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

-- Community Comments Table
CREATE TABLE IF NOT EXISTS community_comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    thread_id UUID REFERENCES community_threads(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    author_id UUID REFERENCES auth.users(id),
    parent_comment_id UUID REFERENCES community_comments(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE community_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_comments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for community_threads
CREATE POLICY "Anyone can view threads" ON community_threads
    FOR SELECT USING (true);

CREATE POLICY "Anyone can create threads" ON community_threads
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own threads" ON community_threads
    FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own threads" ON community_threads
    FOR DELETE USING (auth.uid() = author_id);

-- RLS Policies for community_comments
CREATE POLICY "Anyone can view comments" ON community_comments
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create comments" ON community_comments
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own comments" ON community_comments
    FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own comments" ON community_comments
    FOR DELETE USING (auth.uid() = author_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_threads_created_at ON community_threads(created_at);
CREATE INDEX IF NOT EXISTS idx_threads_author ON community_threads(author_id);
CREATE INDEX IF NOT EXISTS idx_comments_thread ON community_comments(thread_id);
CREATE INDEX IF NOT EXISTS idx_comments_author ON community_comments(author_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent ON community_comments(parent_comment_id);