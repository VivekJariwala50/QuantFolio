-- Supabase Schema for Advanced Stock Portfolio Analytics Platform

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 2. Positions table (stock holdings)
CREATE TABLE IF NOT EXISTS public.positions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  symbol TEXT NOT NULL,
  shares_owned NUMERIC NOT NULL CHECK (shares_owned >= 0),
  cost_per_share NUMERIC NOT NULL CHECK (cost_per_share >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS for positions
ALTER TABLE public.positions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own positions" ON public.positions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own positions" ON public.positions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own positions" ON public.positions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own positions" ON public.positions FOR DELETE USING (auth.uid() = user_id);

-- 3. Portfolio Snapshots (Daily history tracking for performance charts)
CREATE TABLE IF NOT EXISTS public.portfolio_snapshots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  total_value NUMERIC NOT NULL,
  snapshot_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, snapshot_date) -- One snapshot per user per day
);

-- RLS for portfolio_snapshots
ALTER TABLE public.portfolio_snapshots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own snapshots" ON public.portfolio_snapshots FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own snapshots" ON public.portfolio_snapshots FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own snapshots" ON public.portfolio_snapshots FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own snapshots" ON public.portfolio_snapshots FOR DELETE USING (auth.uid() = user_id);
