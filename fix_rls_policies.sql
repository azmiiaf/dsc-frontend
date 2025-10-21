-- Script untuk memperbaiki RLS policies di Supabase
-- Jalankan di SQL Editor Supabase

-- Nonaktifkan RLS untuk sementara (jika ingin akses publik tanpa auth)
ALTER TABLE threads DISABLE ROW LEVEL SECURITY;
ALTER TABLE comments DISABLE ROW LEVEL SECURITY;

-- ATAU buat policies yang benar untuk akses publik:

-- Enable RLS
ALTER TABLE threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Policy untuk SELECT (baca data) - izinkan semua orang
CREATE POLICY "Allow public read access for threads" ON threads
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access for comments" ON comments
  FOR SELECT USING (true);

-- Policy untuk INSERT (tambah data) - izinkan semua orang
CREATE POLICY "Allow public insert for threads" ON threads
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public insert for comments" ON comments
  FOR INSERT WITH CHECK (true);

-- Policy untuk UPDATE (ubah data) - izinkan semua orang
CREATE POLICY "Allow public update for threads" ON threads
  FOR UPDATE USING (true);

CREATE POLICY "Allow public update for comments" ON comments
  FOR UPDATE USING (true);

-- Policy untuk DELETE (hapus data) - izinkan semua orang
CREATE POLICY "Allow public delete for threads" ON threads
  FOR DELETE USING (true);

CREATE POLICY "Allow public delete for comments" ON comments
  FOR DELETE USING (true);