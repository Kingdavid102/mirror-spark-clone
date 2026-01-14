-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  region TEXT,
  language TEXT DEFAULT 'en-US',
  get_updates BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles RLS policies
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = user_id);

-- Create portfolio table for tracking user investments
CREATE TABLE public.portfolios (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  symbol TEXT NOT NULL,
  shares DECIMAL(12, 4) NOT NULL DEFAULT 0,
  avg_cost DECIMAL(12, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, symbol)
);

-- Enable RLS on portfolios
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;

-- Portfolio RLS policies
CREATE POLICY "Users can view their own portfolio"
ON public.portfolios FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own portfolio entries"
ON public.portfolios FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own portfolio"
ON public.portfolios FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own portfolio entries"
ON public.portfolios FOR DELETE
USING (auth.uid() = user_id);

-- Create watchlist table
CREATE TABLE public.watchlist (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  symbol TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, symbol)
);

-- Enable RLS on watchlist
ALTER TABLE public.watchlist ENABLE ROW LEVEL SECURITY;

-- Watchlist RLS policies
CREATE POLICY "Users can view their own watchlist"
ON public.watchlist FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert to their own watchlist"
ON public.watchlist FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete from their own watchlist"
ON public.watchlist FOR DELETE
USING (auth.uid() = user_id);

-- Create vehicles table for inventory management
CREATE TABLE public.vehicles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  year INTEGER NOT NULL,
  model TEXT NOT NULL,
  range_mi INTEGER NOT NULL,
  acceleration_0_60 DECIMAL(3, 1) NOT NULL,
  top_speed_mph INTEGER NOT NULL,
  price DECIMAL(12, 2) NOT NULL,
  image_url TEXT,
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'sold_out', 'coming_soon')),
  featured BOOLEAN DEFAULT false,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on vehicles (public read, authenticated for orders)
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;

-- Everyone can view vehicles
CREATE POLICY "Anyone can view vehicles"
ON public.vehicles FOR SELECT
USING (true);

-- Create vehicle orders table
CREATE TABLE public.vehicle_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'delivered', 'cancelled')),
  configuration JSONB DEFAULT '{}',
  total_price DECIMAL(12, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on vehicle_orders
ALTER TABLE public.vehicle_orders ENABLE ROW LEVEL SECURITY;

-- Vehicle orders RLS policies
CREATE POLICY "Users can view their own orders"
ON public.vehicle_orders FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders"
ON public.vehicle_orders FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_portfolios_updated_at
  BEFORE UPDATE ON public.portfolios
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_vehicles_updated_at
  BEFORE UPDATE ON public.vehicles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_vehicle_orders_updated_at
  BEFORE UPDATE ON public.vehicle_orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, first_name, last_name, email)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name',
    NEW.email
  );
  RETURN NEW;
END;
$$;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample vehicles
INSERT INTO public.vehicles (name, year, model, range_mi, acceleration_0_60, top_speed_mph, price, status, featured, description) VALUES
('Tesla Model X', 2024, 'Model X', 348, 3.8, 155, 79990.00, 'available', true, '2024 Tesla Model X Long Range with Falcon Wing doors and premium interior'),
('Tesla Model X', 2021, 'Model X', 360, 3.1, 130, 36000.00, 'sold_out', false, '2021 Tesla Model X with exceptional range and performance'),
('Tesla Model 3 Long Range', 2024, 'Model 3', 333, 4.2, 145, 47240.00, 'available', true, '2024 Tesla Model 3 Long Range - Our most affordable long-range vehicle'),
('Tesla Model X Plaid', 2024, 'Model X Plaid', 326, 2.5, 163, 94990.00, 'available', true, 'The quickest SUV on Earth with tri-motor all-wheel drive'),
('Tesla Model S', 2024, 'Model S', 402, 3.1, 149, 74990.00, 'available', true, '2024 Tesla Model S - Unparalleled range and comfort'),
('Tesla Model S Plaid', 2024, 'Model S Plaid', 390, 1.99, 200, 89990.00, 'available', true, 'The quickest production car ever made with 1,020 horsepower'),
('Tesla Model Y', 2024, 'Model Y', 310, 4.8, 135, 44990.00, 'available', true, '2024 Tesla Model Y - Versatile, spacious, and efficient'),
('Tesla Model Y Long Range', 2024, 'Model Y', 330, 4.8, 135, 49990.00, 'available', false, '2024 Tesla Model Y Long Range - Extended range for longer journeys'),
('Tesla Cybertruck', 2024, 'Cybertruck', 340, 2.9, 130, 79990.00, 'available', true, 'Tesla Cybertruck - Redefining utility and durability'),
('Tesla Roadster', 2025, 'Roadster', 620, 1.9, 250, 200000.00, 'coming_soon', true, 'The quickest car in the world with record-setting acceleration');