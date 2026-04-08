-- Create products table
CREATE TABLE public.products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sku TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    category TEXT,
    subCategory TEXT,
    fabric TEXT,
    gsmWeight TEXT,
    gsm TEXT,
    quantity INTEGER DEFAULT 0,
    description TEXT,
    status TEXT DEFAULT 'Active',
    sizingMode TEXT DEFAULT 'standard',
    isFeatured BOOLEAN DEFAULT false,
    pricingTiers JSONB,
    brandingOptions JSONB,
    sizes TEXT,
    colors TEXT,
    images JSONB,
    tags TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Allow anonymous read access (since you want storefront users to view products)
CREATE POLICY "Allow anonymous read access" 
ON public.products 
FOR SELECT 
USING (true);

-- Allow anonymous insert access (For the admin panel API functionality)
CREATE POLICY "Allow anonymous insert access" 
ON public.products 
FOR INSERT 
WITH CHECK (true);

-- Allow anonymous update access (If you plan to add editing functionality later)
CREATE POLICY "Allow anonymous update access" 
ON public.products 
FOR UPDATE 
USING (true);
