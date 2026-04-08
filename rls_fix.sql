-- ==========================================
-- RLS RECURSION FIX FOR PROFILES
-- ==========================================

-- 1. Create a security definer function to check role without recursion
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Drop the old recursive policy
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- 3. Create the new non-recursive policy
CREATE POLICY "Admins can view all profiles" 
ON public.profiles FOR SELECT 
USING (public.is_admin());

-- 4. Also ensure admins can UPDATE all profiles
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
CREATE POLICY "Admins can update all profiles" 
ON public.profiles FOR UPDATE 
USING (public.is_admin());

-- 5. Ensure admins can DELETE all profiles
DROP POLICY IF EXISTS "Admins can delete all profiles" ON public.profiles;
CREATE POLICY "Admins can delete all profiles" 
ON public.profiles FOR DELETE 
USING (public.is_admin());
