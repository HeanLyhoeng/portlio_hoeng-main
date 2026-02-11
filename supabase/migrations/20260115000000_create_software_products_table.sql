-- Create software_products table for T3 Software Store
-- This table stores product information that can be managed from Supabase Dashboard

CREATE TABLE IF NOT EXISTS software_products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  description TEXT,
  duration TEXT, -- e.g., "4 Months", "1 Year"
  image_filename TEXT NOT NULL, -- Filename in projects/services/ folder
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_software_products_active ON software_products(is_active);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_software_products_updated_at
  BEFORE UPDATE ON software_products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE software_products ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access (for displaying products)
CREATE POLICY "Allow public read access to active software products"
  ON software_products
  FOR SELECT
  USING (is_active = TRUE);

-- Create policy to allow authenticated users to manage products (optional, for admin)
-- Uncomment if you want admin users to manage products via the app
-- CREATE POLICY "Allow authenticated users to manage software products"
--   ON software_products
--   FOR ALL
--   USING (auth.role() = 'authenticated');

COMMENT ON TABLE software_products IS 'Stores software product information for T3 Software Store';
COMMENT ON COLUMN software_products.image_filename IS 'Filename in projects/services/ storage bucket (e.g., "adobe-creative-cloud.jpg")';
COMMENT ON COLUMN software_products.duration IS 'License duration (e.g., "1 Month", "4 Months", "1 Year")';
