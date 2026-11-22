// ==========================================
// UrbanTime - Lógica de Autenticación & Carrusel Urbano
// Paleta Oficial: Blanco & Negro Asfalto #1F2937
// ==========================================

let isRegisterMode = false;
let currentRole = 'cliente'; // 'cliente' | 'negocio'
let currentSlideIndex = 0;
let carouselTimer = null;
let toastTimer = null;

// Contenido dinámico del carrusel urbano
const slidesData = [
  {
    tag: "Metrópolis en Tiempo Real",
    title: "Tu tiempo en tus manos para <br /><span class='text-transparent bg-clip-text bg-gradient-to-r from-gray-100 via-gray-300 to-gray-400'>reservar y crecer.</span>",
    desc: "Conecta clientes y locales en tiempo real. Pide turnos en 3 clics, evita esperas y organiza tu día con la máxima eficiencia urbana."
  },
  {
    tag: "Barberías & Negocios Urbanos",
    title: "El estilo urbano que mereces, <br /><span class='text-transparent bg-clip-text bg-gradient-to-r from-gray-100 via-gray-300 to-gray-400'>sin perder un minuto.</span>",
    desc: "Los mejores barberos y locales de tu ciudad listos para recibirte. Tu turno reservado y asegurado al instante desde tu teléfono."
  },
  {
    tag: "Eficiencia y Control Total",
    title: "Potencia tu comercio local <br /><span class='text-transparent bg-clip-text bg-gradient-to-r from-gray-100 via-gray-300 to-gray-400'>a escala metropolitana.</span>",
    desc: "Plataforma robusta con notificaciones automáticas, reportes en vivo y soporte multiplataforma garantizado para iOS y Android."
  }
];

// Inicializar iconos y carrusel al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) {
    window.lucide.createIcons();
  }
  startCarousel();
  checkExistingSession();
});

// ------------------------------------------
// 1. MOTOR DEL CARRUSEL URBANO (AUTOMÁTICO & MANUAL)
// ------------------------------------------
function startCarousel() {
  stopCarousel();
  carouselTimer = setInterval(() => {
    const nextIndex = (currentSlideIndex + 1) % slidesData.length;
    goToSlide(nextIndex);
  }, 4500);
}

function stopCarousel() {
  if (carouselTimer) {
    clearInterval(carouselTimer);
    carouselTimer = null;
  }
}

function goToSlide(index) {
  currentSlideIndex = index;

  // Actualizar slides con efecto crossfade
  const slides = document.querySelectorAll('.carousel-slide');
  slides.forEach((slide, i) => {
    if (i === index) {
      slide.classList.add('active');
    } else {
      slide.classList.remove('active');
    }
  });

  // Actualizar textos dinámicos del hero (solo visibles en desktop)
  const tagEl = document.getElementById('hero-slide-tag');
  const titleEl = document.getElementById('hero-slide-title');
  const descEl = document.getElementById('hero-slide-desc');

  if (tagEl && titleEl && descEl && slidesData[index]) {
    tagEl.textContent = slidesData[index].tag;
    titleEl.innerHTML = slidesData[index].title;
    descEl.textContent = slidesData[index].desc;
  }

  // Actualizar dots
  const dots = document.querySelectorAll('#carousel-dots button');
  dots.forEach((dot, i) => {
    if (i === index) {
      dot.classList.add('active-dot');
    } else {
      dot.classList.remove('active-dot');
    }
  });

  startCarousel();
}

// ------------------------------------------
// 2. TOGGLE ENTRE MODO LOGIN Y MODO REGISTRO
// (Sin notificaciones intrusivas)
// ------------------------------------------
function toggleAuthMode() {
  isRegisterMode = !isRegisterMode;

  const authHeading = document.getElementById('auth-heading');
  const authSubheading = document.getElementById('auth-subheading');
  const submitBtnText = document.getElementById('submit-btn-text');
  const fieldNameGroup = document.getElementById('field-name-group');
  const toggleAuthPrompt = document.getElementById('toggle-auth-prompt');
  const googleBtnText = document.getElementById('google-btn-text');

  if (isRegisterMode) {
    authHeading.textContent = "Crea tu cuenta";
    authSubheading.textContent = "Únete a UrbanTime y pide turnos al instante.";
    submitBtnText.textContent = "Crear mi cuenta";
    googleBtnText.textContent = "Registrarme con Google";
    
    fieldNameGroup.classList.remove('hidden');

    toggleAuthPrompt.innerHTML = `
      ¿Ya tienes una cuenta? 
      <button type="button" onclick="toggleAuthMode()" class="font-bold text-[#1F2937] hover:underline">
        Inicia sesión aquí
      </button>
    `;
  } else {
    authHeading.textContent = "Hola de nuevo";
    authSubheading.textContent = "Aquí estás de vuelta. Sigue donde lo dejaste.";
    submitBtnText.textContent = "Iniciar Sesión";
    googleBtnText.textContent = "Entrar con Google";

    fieldNameGroup.classList.add('hidden');

    toggleAuthPrompt.innerHTML = `
      ¿No tienes cuenta? 
      <button type="button" onclick="toggleAuthMode()" class="font-bold text-[#1F2937] hover:underline">
        Regístrate gratis aquí
      </button>
    `;
  }

  if (window.lucide) window.lucide.createIcons();
}

// ------------------------------------------
// 3. SELECTOR DE ROL: CLIENTE O NEGOCIO
// (Cambio inmediato y fluido sin toast molesto)
// ------------------------------------------
function selectRole(role) {
  currentRole = role;
  const clienteBtn = document.getElementById('role-cliente-btn');
  const negocioBtn = document.getElementById('role-negocio-btn');

  if (role === 'cliente') {
    clienteBtn.classList.add('role-active');
    negocioBtn.classList.remove('role-active');
  } else {
    negocioBtn.classList.add('role-active');
    clienteBtn.classList.remove('role-active');
  }
}

// ------------------------------------------
// 4. AUTENTICACIÓN POR CORREO Y CONTRASEÑA
// ------------------------------------------
function handleEmailAuth(event) {
  event.preventDefault();

  const emailInput = document.getElementById('input-email');
  const passwordInput = document.getElementById('input-password');
  const nameInput = document.getElementById('input-name');
  const submitBtn = document.getElementById('submit-auth-btn');

  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const name = isRegisterMode && nameInput && nameInput.value.trim() ? nameInput.value.trim() : email.split('@')[0];

  if (!email || !password) {
    showToast("Por favor completa los campos requeridos", "error");
    return;
  }

  // Si Supabase ya está configurado con claves reales, llamamos al backend
  if (typeof SUPABASE_URL !== 'undefined' && SUPABASE_URL !== 'https://TU-PROYECTO.supabase.co' && typeof authRealEmail === 'function') {
    authRealEmail(email, password, isRegisterMode, currentRole, name);
    return;
  }

  const originalBtnHTML = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = `
    <svg class="animate-spin -ml-1 mr-2 h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    <span>${isRegisterMode ? 'Creando cuenta...' : 'Iniciando sesión...'}</span>
  `;

  setTimeout(() => {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalBtnHTML;

    const userSession = {
      name: name.charAt(0).toUpperCase() + name.slice(1),
      email: email,
      role: currentRole,
      provider: 'email',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      token: 'jwt_token_' + Math.random().toString(36).substring(7)
    };

    saveSessionAndEnter(userSession);
  }, 600);
}

// ------------------------------------------
// 5. AUTENTICACIÓN OAUTH (GOOGLE, FACEBOOK, APPLE)
// ------------------------------------------
function handleOAuthLogin(provider) {
  // Si Supabase ya está configurado con claves reales, llamamos a OAuth real
  if (typeof SUPABASE_URL !== 'undefined' && SUPABASE_URL !== 'https://TU-PROYECTO.supabase.co' && typeof loginRealOAuth === 'function') {
    loginRealOAuth(provider);
    return;
  }

  let userName = "Usuario";
  let userEmail = "usuario@gmail.com";
  let avatarUrl = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80";

  if (provider === 'google') {
    userEmail = "usuario@gmail.com";
    userName = "Usuario Google";
  } else if (provider === 'facebook') {
    userEmail = "usuario.fb@facebook.com";
    userName = "Usuario Facebook";
    avatarUrl = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80";
  } else if (provider === 'apple') {
    userEmail = "usuario@icloud.com";
    userName = "Usuario Apple";
  }

  setTimeout(() => {
    const userSession = {
      name: userName,
      email: userEmail,
      role: currentRole,
      provider: provider,
      avatar: avatarUrl,
      token: `oauth_${provider}_jwt_` + Math.random().toString(36).substring(7)
    };

    saveSessionAndEnter(userSession);
  }, 500);
}

// ------------------------------------------
// 6. GESTIÓN DE SESIÓN Y VISTA DASHBOARD
// ------------------------------------------
function saveSessionAndEnter(session) {
  localStorage.setItem('urbantime_user_session', JSON.stringify(session));

  document.getElementById('auth-main-container').classList.add('hidden');
  const dash = document.getElementById('dashboard-screen');
  dash.classList.remove('hidden');
  // El dashboard sí puede scrollear (overflow-auto en su propia div)
  dash.style.overflowY = 'auto';

  document.getElementById('welcome-name').textContent = session.name;
  document.getElementById('user-display-name').textContent = session.name;
  document.getElementById('user-display-role').textContent = session.role === 'negocio'
    ? "Barbería / Local Verificado"
    : "Cliente Verificado";
  document.getElementById('user-avatar').src = session.avatar;

  showToast(`¡Sesión iniciada con éxito!`, "success");
  if (window.lucide) window.lucide.createIcons();
}

function checkExistingSession() {
  const saved = localStorage.getItem('urbantime_user_session');
  if (saved) {
    try {
      const session = JSON.parse(saved);
      console.log("Sesión activa encontrada:", session);
    } catch(e) {}
  }
}

function handleLogout() {
  localStorage.removeItem('urbantime_user_session');
  document.getElementById('dashboard-screen').classList.add('hidden');
  document.getElementById('auth-main-container').classList.remove('hidden');
  showToast("Sesión cerrada", "info");
}

// ------------------------------------------
// 7. MOSTRAR / OCULTAR CONTRASEÑA
// ------------------------------------------
function togglePasswordVisibility(inputId, iconId) {
  const input = document.getElementById(inputId);
  const icon = document.getElementById(iconId);

  if (input.type === 'password') {
    input.type = 'text';
    icon.setAttribute('data-lucide', 'eye-off');
  } else {
    input.type = 'password';
    icon.setAttribute('data-lucide', 'eye');
  }
  if (window.lucide) window.lucide.createIcons();
}

// ------------------------------------------
// 8. MODAL DE RECUPERAR CONTRASEÑA
// ------------------------------------------
function openForgotModal() {
  document.getElementById('forgot-modal').classList.remove('hidden');
  if (window.lucide) window.lucide.createIcons();
}

function closeForgotModal() {
  document.getElementById('forgot-modal').classList.add('hidden');
}

function handleForgotSubmit(event) {
  event.preventDefault();
  const email = document.getElementById('forgot-email-input').value;
  closeForgotModal();
  showToast(`Enlace enviado a ${email}`, "success");
}

// ------------------------------------------
// 9. MODAL DE TÉRMINOS Y PRIVACIDAD
// ------------------------------------------
function openTermsModal(event) {
  if (event) event.preventDefault();
  document.getElementById('terms-modal').classList.remove('hidden');
  if (window.lucide) window.lucide.createIcons();
}

function closeTermsModal() {
  document.getElementById('terms-modal').classList.add('hidden');
}

// ------------------------------------------
// 10. NOTIFICACIONES TOAST (Optimizadas sin trabarse)
// ------------------------------------------
function showToast(message, type = 'info') {
  const toast = document.getElementById('toast-notification');
  const messageEl = document.getElementById('toast-message');
  const iconEl = document.getElementById('toast-icon');

  if (!toast || !messageEl || !iconEl) return;

  // Limpiar temporizador previo para evitar que se quede trabado o parpadee
  if (toastTimer) {
    clearTimeout(toastTimer);
    toastTimer = null;
  }

  messageEl.textContent = message;

  if (type === 'success') {
    iconEl.setAttribute('data-lucide', 'check-circle-2');
    iconEl.className = "w-4 h-4 text-emerald-400";
  } else if (type === 'error') {
    iconEl.setAttribute('data-lucide', 'alert-circle');
    iconEl.className = "w-4 h-4 text-rose-400";
  } else {
    iconEl.setAttribute('data-lucide', 'info');
    iconEl.className = "w-4 h-4 text-gray-300";
  }

  if (window.lucide) window.lucide.createIcons();

  toast.classList.remove('opacity-0', 'translate-y-20', 'pointer-events-none');
  toast.classList.add('opacity-100', 'translate-y-0');

  toastTimer = setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-20', 'pointer-events-none');
    toast.classList.remove('opacity-100', 'translate-y-0');
    toastTimer = null;
  }, 2400);
}
