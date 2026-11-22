// =======================================================================
// UrbanTime - Conexión Real de Autenticación con Supabase
// Habilita Login con Google, Facebook, Apple ID y Correo Electrónico
// =======================================================================

// 1. REEMPLAZA ESTOS DOS VALORES CON LOS DE TU PROYECTO DE SUPABASE:
const SUPABASE_URL = 'https://TU-PROYECTO.supabase.co';
const SUPABASE_ANON_KEY = 'TU-ANON-KEY-PUBLICA';

// Inicializar cliente oficial de Supabase
const supabaseClient = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

/**
 * Iniciar sesión real con Google, Facebook o Apple
 * @param {'google' | 'facebook' | 'apple'} provider 
 */
async function loginRealOAuth(provider) {
  if (!supabaseClient) {
    console.warn("Supabase no está configurado aún. Ejecutando modo simulación...");
    return;
  }

  const { data, error } = await supabaseClient.auth.signInWithOAuth({
    provider: provider,
    options: {
      redirectTo: window.location.origin,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      }
    }
  });

  if (error) {
    showToast(`Error con ${provider}: ${error.message}`, 'error');
  }
}

/**
 * Iniciar sesión o registrarse con Correo y Contraseña
 */
async function authRealEmail(email, password, isRegister, role, fullName) {
  if (!supabaseClient) return;

  if (isRegister) {
    // Registro de nuevo usuario
    const { data, error } = await supabaseClient.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          full_name: fullName,
          role: role // 'cliente' | 'negocio'
        }
      }
    });

    if (error) {
      showToast(error.message, 'error');
    } else {
      showToast("¡Cuenta creada! Revisa tu correo de confirmación.", "success");
    }
    return data;
  } else {
    // Login tradicional
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email: email,
      password: password
    });

    if (error) {
      showToast(error.message, 'error');
    } else {
      showToast("¡Bienvenido a UrbanTime!", "success");
      saveSessionAndEnter({
        name: data.user.user_metadata.full_name || email.split('@')[0],
        email: data.user.email,
        role: data.user.user_metadata.role || 'cliente',
        provider: 'email',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
        token: data.session.access_token
      });
    }
    return data;
  }
}

/**
 * Escuchar cambios de sesión en vivo (Por ejemplo cuando vuelve de Google o Facebook)
 */
if (supabaseClient) {
  supabaseClient.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' && session) {
      saveSessionAndEnter({
        name: session.user.user_metadata.full_name || session.user.email.split('@')[0],
        email: session.user.email,
        role: session.user.user_metadata.role || 'cliente',
        provider: session.user.app_metadata.provider || 'oauth',
        avatar: session.user.user_metadata.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
        token: session.access_token
      });
    }
  });
}
