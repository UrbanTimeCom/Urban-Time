-- =======================================================================
-- UrbanTime - Esquema Oficial de Base de Datos (PostgreSQL en Supabase)
-- Proyecto: Turno Fácil para Barberías y Locales
-- =======================================================================

-- 1. TABLA DE PERFILES DE USUARIOS (Vinculada a la autenticación de Supabase)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  role TEXT DEFAULT 'cliente' CHECK (role IN ('cliente', 'negocio')),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar seguridad por filas (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Los usuarios pueden ver su propio perfil" 
  ON public.profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Los usuarios pueden actualizar su propio perfil" 
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 2. TABLA DE NEGOCIOS / BARBERÍAS
CREATE TABLE IF NOT EXISTS public.businesses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  category TEXT DEFAULT 'barberia' CHECK (category IN ('barberia', 'salon', 'spa', 'consultorio')),
  address TEXT NOT NULL,
  phone TEXT,
  city TEXT DEFAULT 'Principal',
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Cualquiera puede ver los negocios disponibles" 
  ON public.businesses FOR SELECT TO authenticated, anon USING (true);

-- 3. TABLA DE SERVICIOS (Ej: Corte Clásico, Barba, Combo)
CREATE TABLE IF NOT EXISTS public.services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  duration_minutes INTEGER DEFAULT 30,
  price NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Cualquiera puede ver los servicios de un negocio" 
  ON public.services FOR SELECT TO authenticated, anon USING (true);

-- 4. TABLA DE TURNOS Y CITAS (CON PREVENCIÓN AUTOMÁTICA DE DOBLE RESERVA)
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
  service_id UUID REFERENCES public.services(id) ON DELETE CASCADE NOT NULL,
  client_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  appointment_time TIMESTAMP WITH TIME ZONE NOT NULL,
  turn_number INTEGER NOT NULL,
  status TEXT DEFAULT 'pendiente' CHECK (status IN ('pendiente', 'en_atencion', 'completado', 'cancelado')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,

  -- REGLA DE ORO: Evita matemáticamente que 2 clientes reserven la misma hora en el mismo local
  CONSTRAINT turno_sin_duplicados UNIQUE (business_id, appointment_time)
);

ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clientes y negocios pueden ver sus citas"
  ON public.appointments FOR SELECT
  USING (auth.uid() = client_id OR auth.uid() IN (
    SELECT owner_id FROM public.businesses WHERE id = appointments.business_id
  ));

-- 5. TRIGGER AUTOMÁTICO: Cuando alguien se registra con Google o Facebook,
-- se crea su perfil automáticamente en la tabla public.profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role, avatar_url)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    COALESCE(new.raw_user_meta_data->>'role', 'cliente'),
    COALESCE(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture', '')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
