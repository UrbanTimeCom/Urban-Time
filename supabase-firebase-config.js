// =======================================================================
// UrbanTime - Guía & Código de Integración de Backend (Supabase / Firebase)
// Autenticación Real con Google, Facebook y Roles (Cliente / Barbería)
// =======================================================================

/**
 * OPCIÓN RECOMENDADA #1: SUPABASE AUTH (La más rápida y moderna para Startups)
 * 1. Crea un proyecto gratuito en https://supabase.com
 * 2. En "Authentication" -> "Providers", activa Google y Facebook.
 * 3. En la tabla de usuarios vincula el rol ("cliente" o "negocio").
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://tu-proyecto.supabase.co';
const SUPABASE_ANON_KEY = 'tu-anon-key-publica';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 1. Iniciar sesión con Google (Web, Android e iOS)
export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin, // o el esquema móvil urbantime://auth-callback
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });
  if (error) throw error;
  return data;
}

// 2. Iniciar sesión con Facebook
export async function signInWithFacebook() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'facebook',
    options: {
      redirectTo: window.location.origin,
    },
  });
  if (error) throw error;
  return data;
}

// 3. Registro con Correo, Contraseña y Rol (Cliente vs Barbería)
export async function registerWithEmail(email, password, fullName, phone, role) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        phone: phone,
        role: role, // 'cliente' | 'negocio'
      },
    },
  });
  if (error) throw error;
  return data;
}

// 4. Iniciar sesión tradicional con Correo y Contraseña
export async function loginWithEmail(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

// 5. Restablecer contraseña
export async function resetPasswordForEmail(email) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  if (error) throw error;
  return data;
}

// 6. Cerrar Sesión
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
