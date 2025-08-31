-- Create profiles table for user data
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  annual_reminder_date DATE,
  last_check_in TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create contacts table for family contacts
CREATE TABLE IF NOT EXISTS public.contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  relationship TEXT NOT NULL,
  rut TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trusted_contacts table for legacy system
CREATE TABLE IF NOT EXISTS public.trusted_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create videos table for storing video metadata
CREATE TABLE IF NOT EXISTS public.videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  video_type TEXT NOT NULL CHECK (video_type IN ('annual', 'personal')),
  contact_id UUID REFERENCES public.contacts(id) ON DELETE CASCADE,
  blob_url TEXT NOT NULL,
  duration INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create personalized_files table for custom content per contact
CREATE TABLE IF NOT EXISTS public.personalized_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  contact_id UUID NOT NULL REFERENCES public.contacts(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  blob_url TEXT NOT NULL,
  description TEXT,
  include_life_video BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trusted_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personalized_files ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_delete_own" ON public.profiles FOR DELETE USING (auth.uid() = id);

-- Create RLS policies for contacts
CREATE POLICY "contacts_select_own" ON public.contacts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "contacts_insert_own" ON public.contacts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "contacts_update_own" ON public.contacts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "contacts_delete_own" ON public.contacts FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for trusted_contacts
CREATE POLICY "trusted_contacts_select_own" ON public.trusted_contacts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "trusted_contacts_insert_own" ON public.trusted_contacts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "trusted_contacts_update_own" ON public.trusted_contacts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "trusted_contacts_delete_own" ON public.trusted_contacts FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for videos
CREATE POLICY "videos_select_own" ON public.videos FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "videos_insert_own" ON public.videos FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "videos_update_own" ON public.videos FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "videos_delete_own" ON public.videos FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for personalized_files
CREATE POLICY "personalized_files_select_own" ON public.personalized_files FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "personalized_files_insert_own" ON public.personalized_files FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "personalized_files_update_own" ON public.personalized_files FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "personalized_files_delete_own" ON public.personalized_files FOR DELETE USING (auth.uid() = user_id);
