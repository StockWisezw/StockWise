-- Storage Buckets Configuration for Tareza ERP

-- Create buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
('tareza-logos', 'tareza-logos', true),
('tareza-product-images', 'tareza-product-images', true),
('tareza-reports', 'tareza-reports', false),
('tareza-receipts', 'tareza-receipts', false),
('tareza-exports', 'tareza-exports', false),
('tareza-documents', 'tareza-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on storage.objects (if not already enabled)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Set up Storage RLS Policies

-- Public access policies for logos and product images
CREATE POLICY "Public_Access_Logos" ON storage.objects
FOR SELECT USING (bucket_id = 'tareza-logos');

CREATE POLICY "Public_Access_Product_Images" ON storage.objects
FOR SELECT USING (bucket_id = 'tareza-product-images');

-- Authenticated upload policies for all buckets
CREATE POLICY "Auth_Insert_Logos" ON storage.objects
FOR INSERT TO authenticated WITH CHECK (bucket_id = 'tareza-logos');

CREATE POLICY "Auth_Insert_Product_Images" ON storage.objects
FOR INSERT TO authenticated WITH CHECK (bucket_id = 'tareza-product-images');

CREATE POLICY "Auth_Insert_Reports" ON storage.objects
FOR INSERT TO authenticated WITH CHECK (bucket_id = 'tareza-reports');

CREATE POLICY "Auth_Insert_Receipts" ON storage.objects
FOR INSERT TO authenticated WITH CHECK (bucket_id = 'tareza-receipts');

CREATE POLICY "Auth_Insert_Exports" ON storage.objects
FOR INSERT TO authenticated WITH CHECK (bucket_id = 'tareza-exports');

CREATE POLICY "Auth_Insert_Documents" ON storage.objects
FOR INSERT TO authenticated WITH CHECK (bucket_id = 'tareza-documents');

-- Authenticated update policies for all buckets
CREATE POLICY "Auth_Update_Logos" ON storage.objects
FOR UPDATE TO authenticated USING (bucket_id = 'tareza-logos');

CREATE POLICY "Auth_Update_Product_Images" ON storage.objects
FOR UPDATE TO authenticated USING (bucket_id = 'tareza-product-images');

CREATE POLICY "Auth_Update_Reports" ON storage.objects
FOR UPDATE TO authenticated USING (bucket_id = 'tareza-reports');

CREATE POLICY "Auth_Update_Receipts" ON storage.objects
FOR UPDATE TO authenticated USING (bucket_id = 'tareza-receipts');

CREATE POLICY "Auth_Update_Exports" ON storage.objects
FOR UPDATE TO authenticated USING (bucket_id = 'tareza-exports');

CREATE POLICY "Auth_Update_Documents" ON storage.objects
FOR UPDATE TO authenticated USING (bucket_id = 'tareza-documents');

-- Authenticated read policies for private buckets
CREATE POLICY "Auth_Select_Reports" ON storage.objects
FOR SELECT TO authenticated USING (bucket_id = 'tareza-reports');

CREATE POLICY "Auth_Select_Receipts" ON storage.objects
FOR SELECT TO authenticated USING (bucket_id = 'tareza-receipts');

CREATE POLICY "Auth_Select_Exports" ON storage.objects
FOR SELECT TO authenticated USING (bucket_id = 'tareza-exports');

CREATE POLICY "Auth_Select_Documents" ON storage.objects
FOR SELECT TO authenticated USING (bucket_id = 'tareza-documents');

-- Authenticated delete policies for all buckets
CREATE POLICY "Auth_Delete_Logos" ON storage.objects
FOR DELETE TO authenticated USING (bucket_id = 'tareza-logos');

CREATE POLICY "Auth_Delete_Product_Images" ON storage.objects
FOR DELETE TO authenticated USING (bucket_id = 'tareza-product-images');

CREATE POLICY "Auth_Delete_Reports" ON storage.objects
FOR DELETE TO authenticated USING (bucket_id = 'tareza-reports');

CREATE POLICY "Auth_Delete_Receipts" ON storage.objects
FOR DELETE TO authenticated USING (bucket_id = 'tareza-receipts');

CREATE POLICY "Auth_Delete_Exports" ON storage.objects
FOR DELETE TO authenticated USING (bucket_id = 'tareza-exports');

CREATE POLICY "Auth_Delete_Documents" ON storage.objects
FOR DELETE TO authenticated USING (bucket_id = 'tareza-documents');
