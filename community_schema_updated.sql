-- Community Threads Table
CREATE TABLE IF NOT EXISTS community_threads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    author_id UUID REFERENCES auth.users(id),
    anonymous_username TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_pinned BOOLEAN DEFAULT FALSE,
    tags TEXT[] DEFAULT ARRAY[]::TEXT[]
);

-- Thread Replies Table (renamed from community_comments)
CREATE TABLE IF NOT EXISTS thread_replies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    thread_id UUID REFERENCES community_threads(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    author_id UUID REFERENCES auth.users(id),
    anonymous_username TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Thread Likes Table
CREATE TABLE IF NOT EXISTS thread_likes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    thread_id UUID REFERENCES community_threads(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL, -- Changed from UUID to TEXT to support anonymous users
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE community_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE thread_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE thread_likes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for community_threads
CREATE POLICY "Anyone can view threads" ON community_threads
    FOR SELECT USING (true);

CREATE POLICY "Anyone can create threads" ON community_threads
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own threads" ON community_threads
    FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own threads" ON community_threads
    FOR DELETE USING (auth.uid() = author_id);

-- RLS Policies for thread_replies
CREATE POLICY "Anyone can view replies" ON thread_replies
    FOR SELECT USING (true);

CREATE POLICY "Anyone can create replies" ON thread_replies
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own replies" ON thread_replies
    FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own replies" ON thread_replies
    FOR DELETE USING (auth.uid() = author_id);

-- RLS Policies for thread_likes
CREATE POLICY "Anyone can view likes" ON thread_likes
    FOR SELECT USING (true);

CREATE POLICY "Anyone can create likes" ON thread_likes
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can delete their own likes" ON thread_likes
    FOR DELETE USING (user_id = auth.uid()::text OR user_id LIKE 'anon_%');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_threads_created_at ON community_threads(created_at);
CREATE INDEX IF NOT EXISTS idx_threads_author ON community_threads(author_id);
CREATE INDEX IF NOT EXISTS idx_replies_thread ON thread_replies(thread_id);
CREATE INDEX IF NOT EXISTS idx_replies_author ON thread_replies(author_id);
CREATE INDEX IF NOT EXISTS idx_likes_thread ON thread_likes(thread_id);
CREATE INDEX IF NOT EXISTS idx_likes_user ON thread_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_likes_thread_user ON thread_likes(thread_id, user_id);