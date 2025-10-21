import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import MainLayout from "../components/tamplates/MainLayout";

/*
  Perubahan utama:
  - Konsisten pakai requestWithRetry / safeInsertRetryable untuk semua operasi Supabase.
  - toggleLike sekarang menggunakan retryable delete/insert.
  - fetchLikesCount & fetchUserLike menggunakan retry wrapper.
  - Logging error lebih informatif.
*/

function ensureAnonIdentity() {
  try {
    const storage = window.localStorage;
    let anonId = storage.getItem("dsc_anon_id");
    let anonName = storage.getItem("dsc_anon_username");
    if (!anonId) {
      anonId =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : "anon_" + Math.random().toString(36).slice(2, 10);
      storage.setItem("dsc_anon_id", anonId);
    }
    if (!anonName) {
      const random5Digit = Math.floor(10000 + Math.random() * 90000);
      anonName = "anonymous" + random5Digit;
      storage.setItem("dsc_anon_username", anonName);
    }
    return { anonId, anonName };
  } catch {
    return { anonId: "anon_fallback", anonName: "anonymous00000" };
  }
}

async function getUserContext() {
  try {
    const resp = await supabase.auth.getUser();
    const user = resp?.data?.user ?? null;
    if (user) {
      const username =
        user.email || user.user_metadata?.full_name || user.id || "user";
      return { id: user.id, isAnon: false, username };
    }
  } catch {
    // ignore and fallback to anon
  }
  const { anonId, anonName } = ensureAnonIdentity();
  return { id: anonId, isAnon: true, username: anonName };
}

async function wait(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

async function requestWithRetry(fn, { retries = 3, delay = 500 } = {}) {
  let attempt = 0;
  while (attempt < retries) {
    try {
      return await fn();
    } catch (err) {
      attempt++;
      const msg = (err?.message || "").toLowerCase();
      const code = err?.code || "";
      const shouldRetry =
        msg.includes("not found") ||
        msg.includes("could not find") ||
        code === "PGRST205" ||
        code === "PGRST204" ||
        code === "NOT_FOUND";
      if (!shouldRetry || attempt >= retries) {
        throw err;
      }
      await wait(delay * attempt);
    }
  }
  throw new Error("requestWithRetry: exhausted retries");
}

async function safeInsertRetryable(table, payload) {
  const runner = async () => {
    const resp = await supabase.from(table).insert([payload]).select();
    if (resp.error) {
      const err = resp.error;
      err.message = err.message || JSON.stringify(err);
      err.code = err.code || "";
      throw err;
    }
    return resp.data;
  };

  try {
    const data = await requestWithRetry(runner, { retries: 4, delay: 600 });
    return { data, error: null };
  } catch (err) {
    const msg = (err?.message || "").toLowerCase();
    if (msg.includes("anonymous_username")) {
      const p2 = { ...payload };
      delete p2.anonymous_username;
      const r2 = await supabase.from(table).insert([p2]).select();
      return { data: r2.data, error: r2.error };
    }
    return { data: null, error: err };
  }
}

export default function CommunityPage() {
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newThread, setNewThread] = useState({ title: "", content: "" });
  const [expandedReplies, setExpandedReplies] = useState({});
  const [repliesMap, setRepliesMap] = useState({});
  const [replyInput, setReplyInput] = useState({});
  const [likesCount, setLikesCount] = useState({});
  const [userLikeMap, setUserLikeMap] = useState({});

  useEffect(() => {
    ensureAnonIdentity();
    fetchThreads();

    // Set up realtime subscriptions
    const threadsChannel = supabase.channel('public:community_threads')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'community_threads'
      }, handleThreadChange)
      .subscribe();

    const repliesChannel = supabase.channel('public:thread_replies')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'thread_replies'
      }, handleReplyChange)
      .subscribe();

    // Add realtime subscription for likes
    const likesChannel = supabase.channel('public:thread_likes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'thread_likes'
      }, handleLikeChange)
      .subscribe();

    // Cleanup on unmount
    return () => {
      threadsChannel.unsubscribe();
      repliesChannel.unsubscribe();
      likesChannel.unsubscribe();
    };
  }, []);

  const handleThreadChange = (payload) => {
    console.log('Thread change:', payload);
    
    switch (payload.eventType) {
      case 'INSERT':
        setThreads(current => [payload.new, ...current]);
        fetchLikesCount(payload.new.id);
        fetchUserLike(payload.new.id);
        break;
        
      case 'DELETE':
        setThreads(current => current.filter(t => t.id !== payload.old.id));
        break;
        
      case 'UPDATE':
        setThreads(current => 
          current.map(t => t.id === payload.new.id ? payload.new : t)
        );
        break;
    }
  };

  const handleReplyChange = (payload) => {
    const threadId = payload.new?.thread_id || payload.old?.thread_id;
    if (!threadId) return;

    switch (payload.eventType) {
      case 'INSERT':
        setRepliesMap(current => ({
          ...current,
          [threadId]: [...(current[threadId] || []), payload.new].sort((a, b) => 
            new Date(a.created_at) - new Date(b.created_at)
          )
        }));
        break;

      case 'DELETE':
        setRepliesMap(current => ({
          ...current,
          [threadId]: current[threadId]?.filter(r => r.id !== payload.old.id) || []
        }));
        break;

      case 'UPDATE':
        setRepliesMap(current => ({
          ...current,
          [threadId]: current[threadId]?.map(r => 
            r.id === payload.new.id ? payload.new : r
          ) || []
        }));
        break;
    }
  };

  const handleLikeChange = (payload) => {
    const threadId = payload.new?.thread_id || payload.old?.thread_id;
    if (!threadId) return;

    switch (payload.eventType) {
      case 'INSERT':
        // Update likes count
        setLikesCount(current => ({
          ...current,
          [threadId]: (current[threadId] || 0) + 1
        }));
        
        // Check if this is the current user's like
        getUserContext().then(ctx => {
          if (payload.new?.user_id === ctx.id) {
            setUserLikeMap(current => ({
              ...current,
              [threadId]: true
            }));
          }
        });
        break;
        
      case 'DELETE':
        // Update likes count
        setLikesCount(current => ({
          ...current,
          [threadId]: Math.max(0, (current[threadId] || 1) - 1)
        }));
        
        // Check if this is the current user's like
        getUserContext().then(ctx => {
          if (payload.old?.user_id === ctx.id) {
            setUserLikeMap(current => ({
              ...current,
              [threadId]: false
            }));
          }
        });
        break;
    }
  };

  useEffect(() => {
    ensureAnonIdentity();
    fetchThreads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchThreads() {
    setLoading(true);
    setError(null);
    try {
      const runner = async () => {
        const { data, error } = await supabase
          .from("community_threads")
          .select("*")
          .order("created_at", { ascending: false });
        if (error) {
          const e = error;
          e.message = error.message || JSON.stringify(error);
          e.code = error.code;
          throw e;
        }
        return data || [];
      };

      const data = await requestWithRetry(runner, { retries: 4, delay: 600 });
      setThreads(data);
      (data || []).forEach((t) => {
        fetchLikesCount(t.id);
        fetchUserLike(t.id);
      });
    } catch (unexpected) {
      console.error("Unexpected fetch error:", unexpected);
      setError(unexpected);
      setThreads([]);
    } finally {
      setLoading(false);
    }
  }

  async function fetchLikesCount(threadId) {
    try {
      const runner = async () => {
        const { count, error } = await supabase
          .from("thread_likes")
          .select("*", { count: "exact", head: true })
          .eq("thread_id", threadId);
        if (error) {
          const e = error;
          e.message = error.message || JSON.stringify(error);
          e.code = error.code;
          throw e;
        }
        return count || 0;
      };

      const count = await requestWithRetry(() => runner(), { retries: 3, delay: 400 });
      setLikesCount((s) => ({ ...s, [threadId]: count }));
    } catch (e) {
      console.warn("fetchLikesCount failed:", e);
      setLikesCount((s) => ({ ...s, [threadId]: 0 }));
    }
  }

  async function fetchUserLike(threadId) {
    try {
      const ctx = await getUserContext();
      const userId = ctx?.id;
      if (!userId) {
        setUserLikeMap((s) => ({ ...s, [threadId]: false }));
        return;
      }
      const runner = async () => {
        const { data, error } = await supabase
          .from("thread_likes")
          .select("*")
          .match({ thread_id: threadId, user_id: userId })
          .limit(1);
        if (error) {
          const e = error;
          e.message = error.message || JSON.stringify(error);
          e.code = error.code;
          throw e;
        }
        return Array.isArray(data) && data.length > 0;
      };

      const liked = await requestWithRetry(runner, { retries: 3, delay: 400 });
      setUserLikeMap((s) => ({ ...s, [threadId]: liked }));
    } catch (e) {
      console.warn("fetchUserLike failed:", e);
      setUserLikeMap((s) => ({ ...s, [threadId]: false }));
    }
  }

  async function toggleLike(threadId) {
    try {
      const ctx = await getUserContext();
      const userId = ctx.id;
      if (!userId) {
        alert("Cannot identify user for like.");
        return;
      }

      const liked = !!userLikeMap[threadId];

      if (liked) {
        const delRunner = async () => {
          const { error } = await supabase
            .from("thread_likes")
            .delete()
            .match({ thread_id: threadId, user_id: userId });
          if (error) {
            const e = error;
            e.message = error.message || JSON.stringify(error);
            e.code = error.code;
            throw e;
          }
          return true;
        };
        await requestWithRetry(delRunner, { retries: 3, delay: 400 });
        setUserLikeMap((s) => ({ ...s, [threadId]: false }));
        setLikesCount((s) => ({ ...s, [threadId]: Math.max(0, (s[threadId] || 1) - 1) }));
      } else {
        const { error } = await safeInsertRetryable("thread_likes", { thread_id: threadId, user_id: userId });
        if (error) throw error;
        setUserLikeMap((s) => ({ ...s, [threadId]: true }));
        setLikesCount((s) => ({ ...s, [threadId]: (s[threadId] || 0) + 1 }));
      }
    } catch (err) {
      console.error("toggleLike error:", err);
      alert("Unable to update like. See console/network for details.");
      fetchLikesCount(threadId);
      fetchUserLike(threadId);
    }
  }

  async function fetchReplies(threadId) {
    try {
      const { data, error } = await supabase
        .from("thread_replies")
        .select("*")
        .eq("thread_id", threadId)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching replies:", error);
        setRepliesMap((s) => ({ ...s, [threadId]: [] }));
      } else {
        setRepliesMap((s) => ({ ...s, [threadId]: data || [] }));
      }
    } catch (e) {
      console.error(e);
    }
  }

  function toggleReplies(threadId) {
    const expanded = !!expandedReplies[threadId];
    setExpandedReplies((s) => ({ ...s, [threadId]: !expanded }));
    if (!expanded && !repliesMap[threadId]) {
      fetchReplies(threadId);
    }
  }

  // Modify postReply to remove manual reply addition
  async function postReply(threadId) {
    try {
      const text = (replyInput[threadId] || "").trim();
      if (!text) return alert("Reply cannot be empty");

      const ctx = await getUserContext();
      const payload = {
        thread_id: threadId,
        content: text,
        author_id: ctx.id,
        anonymous_username: ctx.isAnon ? ctx.username : null,
      };

      const { error } = await safeInsertRetryable("thread_replies", payload);
      if (error) throw error;

      // Don't manually update state - realtime will handle it
      setReplyInput((s) => ({ ...s, [threadId]: "" }));
    } catch (err) {
      console.error("postReply error:", err);
      alert("Gagal mengirim reply. Cek console/network untuk detail.");
    }
  }

  // Modify createThread to rely on realtime updates
  const createThread = async () => {
    try {
      if (!newThread.title?.trim()) {
        alert("Title tidak boleh kosong");
        return;
      }

      const ctx = await getUserContext();
      const payload = {
        title: newThread.title,
        content: newThread.content,
        author_id: ctx.id,
        anonymous_username: ctx.isAnon ? ctx.username : null,
      };

      const { error } = await safeInsertRetryable("community_threads", payload);
      if (error) throw error;

      // Clear form - realtime will handle state update
      setNewThread({ title: "", content: "" });
      setShowCreateForm(false);
    } catch (err) {
      console.error("createThread error:", err);
      alert("Gagal membuat thread. Cek console untuk detail.");
    }
  };

  if (loading) {
    return (
      <MainLayout title="Community">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout title="Community">
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-2">Community</h2>
          <div className="text-red-600 mb-2">
            Tidak dapat memuat thread: {error.message || JSON.stringify(error)}
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Community">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Community</h1>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-full font-medium transition-colors"
          >
            {showCreateForm ? "Cancel" : "New Thread"}
          </button>
        </div>

        {/* Create Thread Form */}
        {showCreateForm && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Create New Thread</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="What's happening?"
                value={newThread.title}
                onChange={(e) => setNewThread({ ...newThread, title: e.target.value })}
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-lg"
              />
              <textarea
                placeholder="Share your thoughts..."
                value={newThread.content}
                onChange={(e) => setNewThread({ ...newThread, content: e.target.value })}
                rows={4}
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-lg"
              />
              <button 
                onClick={createThread} 
                className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-full font-medium w-full transition-colors"
              >
                Post Thread
              </button>
            </div>
          </div>
        )}

        {/* Threads List */}
        <div className="space-y-4">
          {threads.map((thread) => (
            <div key={thread.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-start space-x-4">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {(thread.anonymous_username || thread.author_id || "A").charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  {/* Thread Header */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-gray-900">
                        {thread.anonymous_username || thread.author_id || "Anonymous"}
                      </span>
                      <span className="text-gray-500 text-sm">
                        {thread.created_at ? new Date(thread.created_at).toLocaleDateString() : "Unknown date"}
                      </span>
                    </div>
                  </div>

                  {/* Thread Content */}
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">
                    {thread.title}
                  </h2>
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    {thread.content}
                  </p>

                  {/* Actions */}
                  <div className="flex items-center space-x-6 text-gray-500">
                    {/* Like Button */}
                    <button
                      onClick={() => toggleLike(thread.id)}
                      className={`flex items-center space-x-1 transition-colors ${
                        userLikeMap[thread.id] ? "text-red-500" : "hover:text-red-500"
                      }`}
                    >
                      <svg className="w-5 h-5" fill={userLikeMap[thread.id] ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      <span className="text-sm">{likesCount[thread.id] ?? 0}</span>
                    </button>

                    {/* Reply Button */}
                    <button
                      onClick={() => toggleReplies(thread.id)}
                      className="flex items-center space-x-1 hover:text-blue-500 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <span className="text-sm">{(repliesMap[thread.id] || []).length}</span>
                    </button>

                    {/* Share Button */}
                    <button className="flex items-center space-x-1 hover:text-green-500 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                      </svg>
                    </button>
                  </div>

                  {/* Replies Section */}
                  {expandedReplies[thread.id] && (
                    <div className="mt-6 border-t pt-4 space-y-4">
                      {(repliesMap[thread.id] || []).map((reply) => (
                        <div key={reply.id} className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-xs font-semibold">
                              {(reply.anonymous_username || reply.author_id || "R").charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="text-sm text-gray-700">{reply.content}</div>
                            <div className="text-xs text-gray-400 mt-1">
                              {reply.anonymous_username || reply.author_id || ""} • {reply.created_at ? new Date(reply.created_at).toLocaleString() : ""}
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Reply Input */}
                      <div className="flex items-start space-x-3 pt-2">
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-gray-600 text-xs font-semibold">Y</span>
                        </div>
                        <div className="flex-1">
                          <textarea
                            placeholder="Write a reply..."
                            value={replyInput[thread.id] || ""}
                            onChange={(e) => setReplyInput((s) => ({ ...s, [thread.id]: e.target.value }))}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                            rows={2}
                          />
                          <div className="flex justify-end mt-2">
                            <button
                              onClick={() => postReply(thread.id)}
                              className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
                            >
                              Reply
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {threads.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-gray-500 text-lg">No threads yet. Be the first to start a discussion!</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
