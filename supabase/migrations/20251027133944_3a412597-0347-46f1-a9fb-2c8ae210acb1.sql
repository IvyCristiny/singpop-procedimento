-- Remove existing policies that allow supervisors to modify catalog
DROP POLICY IF EXISTS "All authenticated users can view catalog" ON public.catalog;
DROP POLICY IF EXISTS "Gerente geral can insert catalog" ON public.catalog;
DROP POLICY IF EXISTS "Gerente geral can update catalog" ON public.catalog;
DROP POLICY IF EXISTS "Gerente zona can update catalog" ON public.catalog;

-- Create new policies with proper restrictions
-- All authenticated users (including supervisors) can view catalog
CREATE POLICY "All authenticated users can view catalog"
ON public.catalog
FOR SELECT
TO authenticated
USING (true);

-- Only gerente_geral can insert catalog
CREATE POLICY "Only gerente geral can insert catalog"
ON public.catalog
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'gerente_geral'));

-- Only gerente_geral and gerente_zona can update catalog
CREATE POLICY "Gerente geral can update catalog"
ON public.catalog
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'gerente_geral'));

CREATE POLICY "Gerente zona can update catalog"
ON public.catalog
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'gerente_zona'));