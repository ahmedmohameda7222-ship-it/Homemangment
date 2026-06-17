-- Supabase Database Schema for Beitna Manager
-- Run this in your Supabase SQL Editor to create tables

-- Profiles (seeded with 4 family members)
CREATE TABLE profiles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  nickname TEXT NOT NULL,
  role TEXT NOT NULL,
  avatar_url TEXT,
  greeting TEXT NOT NULL,
  color TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO profiles (id, name, nickname, role, greeting, color) VALUES
  ('moustafa', 'Moustafa', 'Pappy', 'Father', 'Welcome back, ya Pappy.', '#465431'),
  ('doaa', 'Doaa', 'Mamy', 'Mother', 'Welcome back, ya Mamy.', '#C47B7B'),
  ('ahmed', 'Ahmed', 'Ahmed', 'Son', 'Welcome back, Ahmed.', '#7BA4C4'),
  ('sherien', 'Sherien', 'Sherien', 'Daughter', 'Welcome back, Sherien.', '#C4A47B');

-- Expense Categories
CREATE TABLE expense_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  color TEXT NOT NULL
);

INSERT INTO expense_categories (id, name, icon, color) VALUES
  ('groceries', 'Groceries', 'ShoppingBasket', '#8A9A6B'),
  ('bills', 'Bills', 'Receipt', '#7BA4C4'),
  ('maintenance', 'Maintenance', 'Wrench', '#C4A47B'),
  ('home-supplies', 'Home Supplies', 'Home', '#6B6B80'),
  ('appliances', 'Appliances', 'Tv', '#465431'),
  ('medicine', 'Medicine', 'Pill', '#C47B7B'),
  ('transportation', 'Transportation', 'Car', '#2D2D44'),
  ('guests', 'Guests', 'Users', '#D8B86F'),
  ('personal-care', 'Personal Care', 'Heart', '#8A9A6B'),
  ('kitchen', 'Kitchen', 'ChefHat', '#C4A47B'),
  ('bathroom', 'Bathroom', 'Bath', '#7BA4C4'),
  ('other', 'Other', 'MoreHorizontal', '#6B6B80');

-- Expenses
CREATE TABLE expenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  amount DECIMAL(10,2) NOT NULL,
  category_id TEXT REFERENCES expense_categories(id),
  description TEXT NOT NULL,
  date DATE NOT NULL,
  paid_by TEXT REFERENCES profiles(id),
  payment_method TEXT,
  receipt_url TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bills
CREATE TABLE bills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  due_date DATE NOT NULL,
  paid BOOLEAN DEFAULT FALSE,
  paid_by TEXT REFERENCES profiles(id),
  payment_date DATE,
  payment_proof_url TEXT,
  repeat_type TEXT DEFAULT 'monthly',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tasks
CREATE TABLE tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  assigned_to TEXT REFERENCES profiles(id) NOT NULL,
  due_date DATE,
  priority TEXT DEFAULT 'medium',
  status TEXT DEFAULT 'pending',
  notes TEXT,
  related_type TEXT,
  related_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Repairs
CREATE TABLE repairs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  item_name TEXT NOT NULL,
  room TEXT,
  problem_description TEXT NOT NULL,
  priority TEXT DEFAULT 'medium',
  status TEXT DEFAULT 'new',
  expected_cost DECIMAL(10,2),
  actual_cost DECIMAL(10,2),
  paid_by TEXT REFERENCES profiles(id),
  responsible_person TEXT REFERENCES profiles(id) NOT NULL,
  technician_name TEXT,
  technician_phone TEXT,
  warranty_status TEXT,
  related_home_item_id UUID,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Repair Photos
CREATE TABLE repair_photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  repair_id UUID REFERENCES repairs(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Home Items
CREATE TABLE home_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT,
  model TEXT,
  location TEXT,
  purchase_date DATE,
  purchase_price DECIMAL(10,2),
  warranty_end_date DATE,
  receipt_url TEXT,
  manual_url TEXT,
  last_repair_date DATE,
  total_repair_cost DECIMAL(10,2) DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Shopping Items
CREATE TABLE shopping_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  quantity TEXT,
  estimated_price DECIMAL(10,2),
  needed_by_date DATE,
  assigned_buyer TEXT REFERENCES profiles(id),
  bought BOOLEAN DEFAULT FALSE,
  notes TEXT,
  category TEXT DEFAULT 'other',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activity Log
CREATE TABLE activity_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  action_type TEXT NOT NULL,
  description TEXT NOT NULL,
  performed_by TEXT REFERENCES profiles(id),
  related_type TEXT,
  related_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Settings
CREATE TABLE settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  home_name TEXT DEFAULT 'Beitna',
  currency TEXT DEFAULT 'EGP',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS) - optional for private single-family app
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE repairs ENABLE ROW LEVEL SECURITY;
ALTER TABLE home_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (allow all for now - single family app)
CREATE POLICY "Allow all" ON expenses FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON bills FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON tasks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON repairs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON home_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON shopping_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON activity_log FOR ALL USING (true) WITH CHECK (true);
