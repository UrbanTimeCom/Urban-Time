// ==========================================
// UrbanTime - Lógica Principal (Cliente + Dueño de Negocio)
// ==========================================

let isRegisterMode = false;
let currentRole = 'cliente';
let currentSlideIndex = 0;
let carouselTimer = null;
let toastTimer = null;

let clientMap = null;
let mapMarkers = [];
let selectedShop = null;
let bookingState = {
  serviceId: null,
  staffId: null,
  dateStr: null,
  timeSlot: null
};
let calViewDate = new Date();
let ratingTargetShopId = null;
let selectedStars = 5;
// Convierte texto del usuario en texto seguro antes de pintarlo con innerHTML
function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

const DEFAULT_SHOPS = [
  {
    id: 'shop-1',
    code: 'URB-101',
    name: 'Urban Fade Barber Studio',
    category: 'barberia',
    address: 'Calle 85 # 14-22, Zona T',
    lat: 4.6682,
    lng: -74.0538,
    rating: 4.9,
    reviewsCount: 142,
    staff: [
      { id: 'st-1', name: 'Carlos Mendoza', role: 'Barbero Master · Degradados' },
      { id: 'st-2', name: 'Andrés Felipe', role: 'Especialista en Barba y Navaja' },
      { id: 'st-3', name: 'Sebastián Ruiz', role: 'Estilista Capilar y Cejas' }
    ],
    services: [
      { id: 'sv-1', name: 'Corte Urbano + Perfilado', duration: 35, price: 28000 },
      { id: 'sv-2', name: 'Combo Full (Corte + Barba + Cejas)', duration: 50, price: 42000 },
      { id: 'sv-3', name: 'Ritual de Barba con Toalla Caliente', duration: 25, price: 20000 },
      { id: 'sv-4', name: 'Diseño de Cejas con Navaja', duration: 15, price: 12000 }
    ],
    timeSlots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:30 PM', '06:00 PM']
  },
  {
    id: 'shop-2',
    code: 'URB-205',
    name: 'Aura Beauty & Nails Lounge',
    category: 'salon',
    address: 'Carrera 11 # 71-40, Chapinero',
    lat: 4.6565,
    lng: -74.0592,
    rating: 4.8,
    reviewsCount: 98,
    staff: [
      { id: 'st-4', name: 'Valeria Torres', role: 'Estilista · Uñas Acrílicas y Diseño' },
      { id: 'st-5', name: 'Camila Restrepo', role: 'Estilista Colorista y Cepillado' },
      { id: 'st-8', name: 'Mariana Gómez', role: 'Especialista en Cejas y Pestañas' }
    ],
    services: [
      { id: 'sv-5', name: 'Manicure Semipermanente + Diseño', duration: 45, price: 45000 },
      { id: 'sv-6', name: 'Cepillado + Hidratación Capilar', duration: 50, price: 55000 },
      { id: 'sv-7', name: 'Lifting de Pestañas y Diseño de Cejas', duration: 40, price: 50000 }
    ],
    timeSlots: ['09:30 AM', '11:00 AM', '01:30 PM', '03:30 PM', '05:00 PM']
  },
  {
    id: 'shop-3',
    code: 'URB-309',
    name: 'Blackstone Barber Club',
    category: 'barberia',
    address: 'Av. Pepe Sierra # 19-15, Usaquén',
    lat: 4.6981,
    lng: -74.0451,
    rating: 5.0,
    reviewsCount: 64,
    staff: [
      { id: 'st-6', name: 'Julián Castro', role: 'Barbero Senior' },
      { id: 'st-7', name: 'Kevin Duarte', role: 'Estilista y Cortes Clásicos' }
    ],
    services: [
      { id: 'sv-8', name: 'Corte Clásico Tijera', duration: 40, price: 32000 },
      { id: 'sv-9', name: 'Corte + Barba Express', duration: 45, price: 45000 }
    ],
    timeSlots: ['10:00 AM', '12:00 PM', '02:30 PM', '04:00 PM', '05:30 PM']
  },
  {
    id: 'shop-4',
    code: 'URB-412',
    name: 'Élan Salon & Hair Studio',
    category: 'salon',
    address: 'Calle 93B # 12-18, Parque de la 93',
    lat: 4.6768,
    lng: -74.0485,
    rating: 4.9,
    reviewsCount: 115,
    staff: [
      { id: 'st-9', name: 'Sofía Martínez', role: 'Estilista Master · Balayage y Color' },
      { id: 'st-10', name: 'Laura Castaño', role: 'Especialista en Keratina y Spa Capilar' }
    ],
    services: [
      { id: 'sv-10', name: 'Corte Estilizado + Brushing', duration: 50, price: 60000 },
      { id: 'sv-11', name: 'Tratamiento Keratina Orgánica', duration: 90, price: 140000 },
      { id: 'sv-12', name: 'Diseño de Cejas + Laminado', duration: 35, price: 45000 }
    ],
    timeSlots: ['09:00 AM', '11:30 AM', '02:00 PM', '04:30 PM']
  }
];

function getShopsData() {
  const saved = localStorage.getItem('urbantime_shops_v2');
  if (!saved) {
    localStorage.setItem('urbantime_shops_v2', JSON.stringify(DEFAULT_SHOPS));
    return DEFAULT_SHOPS;
  }
  return JSON.parse(saved);
}

function saveShopsData(shops) {
  localStorage.setItem('urbantime_shops_v2', JSON.stringify(shops));
}

function getAppointmentsData() {
  return JSON.parse(localStorage.getItem('urbantime_appointments_db') || '[]');
}

function saveAppointmentsData(list) {
  localStorage.setItem('urbantime_appointments_db', JSON.stringify(list));
}

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

document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) window.lucide.createIcons();
  startCarousel();
  initThemeToggle();
  checkExistingSession();
});

// ------------------------------------------
// MODO CLARO / OSCURO
// ------------------------------------------
function initThemeToggle() {
  const btnDesk = document.getElementById('themeBtn');
  if (!btnDesk) return;
  btnDesk.addEventListener('click', () => {
    const html = document.documentElement;
    const next = html.getAttribute('data-bs-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-bs-theme', next);
    btnDesk.innerHTML = next === 'dark'
      ? '<i class="bi bi-sun-fill" style="font-size: 0.85rem;"></i>'
      : '<i class="bi bi-moon-stars-fill" style="font-size: 0.85rem;"></i>';
  });
}

// ------------------------------------------
// 1. CARRUSEL Y LOGIN
// ------------------------------------------
function startCarousel() {
  stopCarousel();
  carouselTimer = setInterval(() => {
    goToSlide((currentSlideIndex + 1) % slidesData.length);
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
  document.querySelectorAll('.carousel-slide').forEach((slide, i) => slide.classList.toggle('active', i === index));
  const tagEl = document.getElementById('hero-slide-tag');
  const titleEl = document.getElementById('hero-slide-title');
  const descEl = document.getElementById('hero-slide-desc');
  if (tagEl && titleEl && descEl && slidesData[index]) {
    tagEl.textContent = slidesData[index].tag;
    titleEl.innerHTML = slidesData[index].title;
    descEl.textContent = slidesData[index].desc;
  }
  document.querySelectorAll('#carousel-dots button').forEach((dot, i) => dot.classList.toggle('active-dot', i === index));
  startCarousel();
}

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
    toggleAuthPrompt.innerHTML = `¿Ya tienes una cuenta? <button type="button" onclick="toggleAuthMode()" class="font-bold text-[#1F2937] hover:underline">Inicia sesión aquí</button>`;
  } else {
    authHeading.textContent = "Hola de nuevo";
    authSubheading.textContent = "Aquí estás de vuelta. Sigue donde lo dejaste.";
    submitBtnText.textContent = "Iniciar Sesión";
    googleBtnText.textContent = "Entrar con Google";
    fieldNameGroup.classList.add('hidden');
    toggleAuthPrompt.innerHTML = `¿No tienes cuenta? <button type="button" onclick="toggleAuthMode()" class="font-bold text-[#1F2937] hover:underline">Regístrate gratis aquí</button>`;
  }
  if (window.lucide) window.lucide.createIcons();
}

function handleEmailAuth(event) {
  event.preventDefault();
  const email = document.getElementById('input-email').value.trim();
  const password = document.getElementById('input-password').value;
  const nameInput = document.getElementById('input-name');
  const name = isRegisterMode && nameInput && nameInput.value.trim() ? nameInput.value.trim() : email.split('@')[0];

  if (!email || !password) {
    showToast("Por favor completa los campos requeridos", "error");
    return;
  }

  if (typeof SUPABASE_URL !== 'undefined' && SUPABASE_URL !== 'https://TU-PROYECTO.supabase.co' && typeof authRealEmail === 'function') {
    authRealEmail(email, password, isRegisterMode, currentRole, name);
    return;
  }

  saveSessionAndEnter({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    email: email,
    role: currentRole,
    provider: 'email',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    phone: '',
    notes: ''
  });
}

function handleOAuthLogin(provider) {
  if (typeof SUPABASE_URL !== 'undefined' && SUPABASE_URL !== 'https://TU-PROYECTO.supabase.co' && typeof loginRealOAuth === 'function') {
    loginRealOAuth(provider);
    return;
  }
  saveSessionAndEnter({
    name: provider === 'google' ? "Usuario Google" : provider === 'facebook' ? "Usuario Facebook" : "Usuario Apple",
    email: `usuario@${provider}.com`,
    role: currentRole,
    provider: provider,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    phone: '',
    notes: ''
  });
}

// ------------------------------------------
// 2. ENTRADA Y CAMBIO ENTRE CLIENTE / NEGOCIO
// ------------------------------------------
// Después de iniciar sesión se muestra el selector de modo (usuario / prestador).
// skipHub = true entra directo al último modo usado (ej. al recargar la página).
function saveSessionAndEnter(session, skipHub = false) {
  localStorage.setItem('urbantime_user_session', JSON.stringify(session));
  document.getElementById('auth-main-container').classList.add('hidden');
  if (skipHub && (session.role === 'cliente' || session.role === 'negocio')) applyMode(session);
  else showModeHub();
}

function showModeHub() {
  const session = JSON.parse(localStorage.getItem('urbantime_user_session') || '{}');
  document.getElementById('dashboard-screen').classList.add('hidden');
  document.getElementById('auth-main-container').classList.add('hidden');
  document.getElementById('mode-user-name').textContent = (session.name || 'bienvenido').split(' ')[0];
  document.getElementById('mode-screen').classList.remove('hidden');
  window.scrollTo(0, 0);
}

function enterMode(mode) {
  const session = JSON.parse(localStorage.getItem('urbantime_user_session') || '{}');
  session.role = mode;
  localStorage.setItem('urbantime_user_session', JSON.stringify(session));
  applyMode(session);
}

function applyMode(session) {
  const isOwner = session.role === 'negocio';
  document.getElementById('mode-screen').classList.add('hidden');
  document.getElementById('dashboard-screen').classList.remove('hidden');
  document.getElementById('topbar-user-name').textContent = session.name;
  document.getElementById('topbar-user-avatar').src = session.avatar;
  document.getElementById('topbar-user-role').textContent = isOwner ? 'Prestador de servicio' : 'Usuario';

  document.getElementById('client-workspace').classList.toggle('d-none', isOwner);
  document.getElementById('owner-workspace').classList.toggle('d-none', !isOwner);

    // Pestañas de escritorio: solo las del modo activo
    const cliTabs = document.getElementById('client-top-tabs');
    const ownTabs = document.getElementById('owner-top-tabs');
    const activeTabs = isOwner ? ownTabs : cliTabs;
    const inactiveTabs = isOwner ? cliTabs : ownTabs;
    activeTabs.classList.add('d-none', 'd-lg-flex');
    inactiveTabs.classList.remove('d-lg-flex');
    inactiveTabs.classList.add('d-none');

  // Pestañas móviles
  const mobCli = document.getElementById('mobile-client-pills');
  const mobOwn = document.getElementById('mobile-owner-pills');
  mobCli.classList.toggle('d-none', isOwner); mobCli.classList.toggle('d-flex', !isOwner);
  mobOwn.classList.toggle('d-none', !isOwner); mobOwn.classList.toggle('d-flex', isOwner);

  if (isOwner) initOwnerDashboard(); else initClientDashboard(session);
}

function goHomeWorkspace() {
  const session = JSON.parse(localStorage.getItem('urbantime_user_session') || '{}');
  if (session.role === 'negocio') switchOwnerView('resumen');
  else switchClientView('explorar');
}

function checkExistingSession() {
  const saved = localStorage.getItem('urbantime_user_session');
  if (saved) {
    try {
      const session = JSON.parse(saved);
      if (session && session.email) saveSessionAndEnter(session, true);
    } catch (e) {}
  }
}

function handleLogout() {
  localStorage.removeItem('urbantime_user_session');
  document.getElementById('dashboard-screen').classList.add('hidden');
  document.getElementById('mode-screen').classList.add('hidden');
  document.getElementById('auth-main-container').classList.remove('hidden');
  showToast("Sesión cerrada", "info");
}

// ------------------------------------------
// 3. NAVEGACIÓN INTERNA CLIENTE
// ------------------------------------------
function switchClientView(viewName) {
  // 'citas' y 'perfil' comparten contenedor pero muestran columnas distintas
  const container = (viewName === 'citas' || viewName === 'perfil') ? 'perfil' : viewName;

  ['explorar', 'reservar', 'perfil'].forEach(v => {
    document.getElementById(`client-view-${v}`)?.classList.toggle('d-none', v !== container);
  });
  document.getElementById('cli-col-citas')?.classList.toggle('d-none', viewName !== 'citas');
  document.getElementById('cli-col-perfil')?.classList.toggle('d-none', viewName !== 'perfil');

  // Pestañas de escritorio
  ['explorar', 'reservar', 'citas', 'perfil'].forEach(v => {
    const btn = document.getElementById(`tab-cli-${v}`);
    if (btn) {
      btn.className = (v === viewName)
        ? 'btn btn-sm btn-dark rounded-pill px-3 fw-semibold'
        : 'btn btn-sm btn-link text-decoration-none text-reset rounded-pill px-3 fw-semibold';
    }
  });

  // Pestañas móviles (ahora también marcan la activa)
  document.querySelectorAll('#mobile-client-pills button').forEach(b => {
    b.className = `btn btn-sm rounded-pill px-3 flex-shrink-0 ${b.dataset.view === viewName ? 'btn-dark' : 'btn-outline-secondary'}`;
  });

  if (viewName === 'explorar') {
    renderShopsList(getPublicShops());
    setTimeout(() => {
      if (clientMap) {
        clientMap.invalidateSize();
        updateMapMarkers(getPublicShops());
      }
    }, 150);
  } else if (viewName === 'citas') {
    renderClientAppointments();
  }
}


function initClientDashboard(session) {
  document.getElementById('owner-onboarding')?.classList.add('d-none');
  document.getElementById('edit-client-name').value = session.name;
  document.getElementById('edit-client-email').value = session.email;
  document.getElementById('edit-client-phone').value = session.phone || '';
  document.getElementById('edit-client-notes').value = session.notes || '';

  const pub = getPublicShops();
  renderShopsList(pub);
  if (pub.length) selectShopForBooking(pub[0].id, false);
  renderClientAppointments();
  switchClientView('explorar');
  setTimeout(() => initClientMap(), 200);
}


function initClientMap() {
  const mapContainer = document.getElementById('client-map');
  if (!mapContainer || typeof L === 'undefined') return;

  if (clientMap) {
    clientMap.invalidateSize();
    return;
  }

  clientMap = L.map('client-map').setView([4.6750, -74.0520], 12);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap'
  }).addTo(clientMap);

  updateMapMarkers(getPublicShops());
}

function updateMapMarkers(shops) {
  if (!clientMap) return;
  mapMarkers.forEach(m => clientMap.removeLayer(m));
  mapMarkers = [];

  shops.forEach(shop => {
    const marker = L.marker([shop.lat, shop.lng]).addTo(clientMap);
    marker.bindPopup(`
      <div style="font-family: 'Plus Jakarta Sans', sans-serif; min-width: 175px;">
        <div style="font-weight: 700; font-size: 13px; color: #111827;">${esc(shop.name)}</div>
        <div style="font-size: 11px; color: #6B7280; margin: 2px 0;">${esc(shop.address)}</div>
        <div style="font-size: 11px; font-weight: 600; margin-bottom: 8px; color: #1F2937;">★ ${shop.rating} · Código: ${esc(shop.code)}</div>
        <button onclick="selectShopForBooking('${shop.id}', true)" style="width: 100%; background:#1F2937; color:#fff; border:none; border-radius:20px; padding:6px 12px; font-size:11px; font-weight:600; cursor:pointer;">Reservar cita</button>
      </div>
    `);
    mapMarkers.push(marker);
  });

    // Ajusta el zoom para que se vean todos los locales a la vez
    if (mapMarkers.length) {
      clientMap.fitBounds(L.featureGroup(mapMarkers).getBounds().pad(0.2), { maxZoom: 15 });
    }
}

function renderShopsList(shops) {
  const container = document.getElementById('shops-list-container');
  if (!shops.length) {
    container.innerHTML = `<div class="col-12"><div class="ut-card p-5 text-center text-body-secondary small">No encontramos establecimientos que coincidan con tu búsqueda.</div></div>`;
    return;
  }

  container.innerHTML = shops.map(shop => `
    <div class="col-md-6">
      <div class="ut-card ut-card-hover p-4 h-100 d-flex flex-column justify-content-between">
        <div>
          <div class="d-flex justify-content-between align-items-center mb-3">
            <span class="ut-tag">
              ${shop.category === 'barberia' ? 'Barbería' : 'Salón de Belleza'}
            </span>
            <span class="small fw-bold">
              ★ ${shop.rating} <span class="text-body-secondary fw-normal">(${shop.reviewsCount})</span>
            </span>
          </div>
          <h5 class="fw-bold mb-1" style="font-size: 1.02rem; letter-spacing: -0.01em;">${esc(shop.name)}</h5>
          <p class="text-body-secondary small mb-3">${esc(shop.address)}</p>
        </div>

        <div>
          <div class="d-flex justify-content-between align-items-center pt-3 mb-3 border-top small">
            <span class="text-body-secondary">Código de enlace</span>
            <span class="fw-bold">${esc(shop.code)}</span>
          </div>
          <div class="d-flex align-items-center gap-2">
            <button onclick="selectShopForBooking('${shop.id}', true)" class="btn btn-ut-dark flex-grow-1">Reservar cita</button>
            <button onclick="openRatingModal('${shop.id}')" class="btn-ut-icon-circle" title="Calificar local">
              <i class="bi bi-star"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

function filterShops() {
  const query = document.getElementById('search-shop-input').value.toLowerCase();
  const cat = document.getElementById('filter-category-select').value;
  const filtered = getPublicShops().filter(s => {
    const matchesText = s.name.toLowerCase().includes(query) || s.address.toLowerCase().includes(query) || s.code.toLowerCase().includes(query);
    const matchesCat = cat === 'all' || s.category === cat;
    return matchesText && matchesCat;
  });
  renderShopsList(filtered);
  updateMapMarkers(filtered);
}

function enterShopByCode(inputId) {
  const codeInput = document.getElementById(inputId).value.trim().toUpperCase();
  if (!codeInput) {
    showToast("Ingresa el código del establecimiento", "error");
    return;
  }
  const shop = getPublicShops().find(s => s.code.toUpperCase() === codeInput);
  if (!shop) {
    showToast(`Código ${codeInput} no encontrado`, "error");
    return;
  }
  selectShopForBooking(shop.id, true);
}

// ------------------------------------------
// 4. RESERVA EN 3 PASOS + CALENDARIO
// ------------------------------------------
function selectShopForBooking(shopId, switchView = true) {
  const shop = getShopsData().find(s => s.id === shopId);
  if (!shop) return;

  selectedShop = shop;
  bookingState = {
    serviceId: shop.services[0]?.id || null,
    staffId: shop.staff[0]?.id || null,
    dateStr: formatDateISO(new Date()),
    timeSlot: shop.timeSlots[0] || null
  };

  document.getElementById('selected-shop-category-badge').textContent = shop.category === 'barberia' ? 'Barbería' : 'Salón de Belleza';
  document.getElementById('selected-shop-name').textContent = shop.name;
  document.getElementById('selected-shop-address').textContent = `${shop.address} · Código: ${shop.code}`;
  document.getElementById('selected-shop-rating').innerHTML = `<i class="bi bi-star-fill text-warning me-1"></i>${shop.rating} (${shop.reviewsCount})`;

  renderBookingOptions();
  renderCalendar();
  updateBookingSummary();

  if (switchView) {
    switchClientView('reservar');
  }
}

function renderBookingOptions() {
  if (!selectedShop) return;

  document.getElementById('booking-services-list').innerHTML = selectedShop.services.map(sv => `
    <div class="col-md-6">
      <div onclick="selectBookingService('${sv.id}')" class="ut-select-box ${bookingState.serviceId === sv.id ? 'active' : ''}">
        <div class="d-flex justify-content-between align-items-start gap-2 mb-1">
          <span class="fw-bold small">${esc(sv.name)}</span>
          <span class="ut-tag">$${Number(sv.price).toLocaleString()}</span>
        </div>
        <small class="text-body-secondary">Duración: ${sv.duration} min</small>
      </div>
    </div>
  `).join('');

  document.getElementById('booking-staff-list').innerHTML = selectedShop.staff.map(st => `
    <div class="col-md-6">
      <div onclick="selectBookingStaff('${st.id}')" class="ut-select-box d-flex align-items-center gap-3 ${bookingState.staffId === st.id ? 'active' : ''}">
        <div class="rounded-circle bg-dark text-white d-flex align-items-center justify-content-center fw-bold flex-shrink-0" style="width: 38px; height: 38px; font-size: 0.85rem;">
          ${esc(st.name.charAt(0))}
        </div>
        <div>
          <div class="fw-bold small">${esc(st.name)}</div>
          <small class="text-body-secondary">${esc(st.role)}</small>
        </div>
      </div>
    </div>
  `).join('');

  const bookedAppointments = getAppointmentsData().filter(a => a.shopId === selectedShop.id && a.dateStr === bookingState.dateStr && a.staffId === bookingState.staffId);
  const takenTimes = bookedAppointments.map(a => a.timeSlot);

  document.getElementById('booking-timeslots-list').innerHTML = selectedShop.timeSlots.map(slot => {
    const isTaken = takenTimes.includes(slot);
    if (isTaken) {
      return `<button disabled class="btn btn-sm btn-outline-secondary rounded-pill opacity-50 text-decoration-line-through">${slot}</button>`;
    }
    const activeClass = bookingState.timeSlot === slot ? 'btn-dark' : 'btn-outline-secondary';
    return `<button onclick="selectBookingTime('${slot}')" class="btn btn-sm ${activeClass} rounded-pill px-3 fw-semibold">${slot}</button>`;
  }).join('');
}

function selectBookingService(id) { bookingState.serviceId = id; renderBookingOptions(); updateBookingSummary(); }
function selectBookingStaff(id) { bookingState.staffId = id; renderBookingOptions(); updateBookingSummary(); }
function selectBookingTime(slot) { bookingState.timeSlot = slot; renderBookingOptions(); updateBookingSummary(); }

function renderCalendar() {
  const year = calViewDate.getFullYear();
  const month = calViewDate.getMonth();
  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  document.getElementById('calendar-month-label').textContent = `${monthNames[month]} ${year}`;

  const firstDay = new Date(year, month, 1).getDay();
  const startOffset = firstDay === 0 ? 6 : firstDay - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayStr = formatDateISO(new Date());

  let html = '';
  for (let i = 0; i < startOffset; i++) html += `<div></div>`;
  for (let d = 1; d <= daysInMonth; d++) {
    const iso = formatDateISO(new Date(year, month, d));
    const isPast = iso < todayStr;
    const isSelected = iso === bookingState.dateStr;
    html += `<div onclick="${isPast ? '' : `selectCalendarDay('${iso}')`}" class="cal-day ${isPast ? 'cal-disabled' : ''} ${isSelected ? 'cal-selected' : ''}">${d}</div>`;
  }
  document.getElementById('calendar-days-grid').innerHTML = html;
}

function changeCalendarMonth(delta) { calViewDate.setMonth(calViewDate.getMonth() + delta); renderCalendar(); }
function selectCalendarDay(iso) { bookingState.dateStr = iso; renderCalendar(); renderBookingOptions(); updateBookingSummary(); }
function formatDateISO(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function updateBookingSummary() {
  if (!selectedShop) return;
  const sv = selectedShop.services.find(s => s.id === bookingState.serviceId);
  const st = selectedShop.staff.find(s => s.id === bookingState.staffId);
  document.getElementById('summary-shop').textContent = selectedShop.name;
  document.getElementById('summary-service').textContent = sv ? `${sv.name} ($${Number(sv.price).toLocaleString()})` : '—';
  document.getElementById('summary-staff').textContent = st ? st.name : '—';
  document.getElementById('summary-datetime').textContent = (bookingState.dateStr && bookingState.timeSlot) ? `${bookingState.dateStr} · ${bookingState.timeSlot}` : '—';
}

function confirmBooking() {
  if (!selectedShop || !bookingState.serviceId || !bookingState.staffId || !bookingState.dateStr || !bookingState.timeSlot) {
    showToast("Completa todos los pasos de tu reserva", "error");
    return;
  }
  const session = JSON.parse(localStorage.getItem('urbantime_user_session') || '{}');
  const sv = selectedShop.services.find(s => s.id === bookingState.serviceId);
  const st = selectedShop.staff.find(s => s.id === bookingState.staffId);

  const allApts = getAppointmentsData();
  allApts.unshift({
    id: 'apt-' + Date.now(),
    shopId: selectedShop.id,
    shopName: selectedShop.name,
    clientName: session.name || 'Cliente',
    clientEmail: session.email || '',
    serviceName: sv.name,
    price: sv.price,
    staffId: st.id,
    staffName: st.name,
    dateStr: bookingState.dateStr,
    timeSlot: bookingState.timeSlot,
    status: 'Confirmada'
  });
  saveAppointmentsData(allApts);

  showToast("Cita confirmada con éxito", "success");
  switchClientView('citas');
}

// ------------------------------------------
// 5. PERFIL CLIENTE Y CALIFICACIONES
// ------------------------------------------
function saveClientProfile(event) {
  event.preventDefault();
  const session = JSON.parse(localStorage.getItem('urbantime_user_session') || '{}');
  session.name = document.getElementById('edit-client-name').value.trim();
  session.phone = document.getElementById('edit-client-phone').value.trim();
  session.notes = document.getElementById('edit-client-notes').value.trim();
  localStorage.setItem('urbantime_user_session', JSON.stringify(session));

  document.getElementById('topbar-user-name').textContent = session.name;
  showToast("Perfil actualizado correctamente", "success");
}

function renderClientAppointments() {
  const session = JSON.parse(localStorage.getItem('urbantime_user_session') || '{}');
  const myApts = getAppointmentsData().filter(a => a.clientEmail === session.email);
  const tbody = document.getElementById('client-appointments-table');

  if (!myApts.length) {
    tbody.innerHTML = `<tr><td colspan="4" class="text-center text-body-secondary py-4">Aún no tienes citas reservadas.</td></tr>`;
    return;
  }

  tbody.innerHTML = myApts.map(apt => `
    <tr>
      <td>
        <div class="fw-bold">${esc(apt.shopName)}</div>
        <small class="text-body-secondary">${esc(apt.serviceName)}</small>
      </td>
      <td>${esc(apt.staffName)}</td>
      <td><span class="ut-tag">${apt.dateStr} · ${apt.timeSlot}</span></td>
      <td class="text-end">
        <button onclick="openRatingModal('${apt.shopId}')" class="btn btn-outline-secondary btn-sm rounded-pill px-3 me-1">Calificar</button>
        <button onclick="cancelClientAppointment('${apt.id}')" class="btn btn-outline-danger btn-sm rounded-pill px-3">Cancelar</button>
      </td>
    </tr>
  `).join('');
}

function cancelClientAppointment(aptId) {
  saveAppointmentsData(getAppointmentsData().filter(a => a.id !== aptId));
  renderClientAppointments();
  renderBookingOptions();
  showToast("Cita cancelada", "info");
}

function openRatingModal(shopId) {
  const shop = getShopsData().find(s => s.id === shopId);
  if (!shop) return;
  ratingTargetShopId = shopId;
  selectedStars = 5;
  document.getElementById('rating-shop-title').textContent = shop.name;
  document.getElementById('rating-comment-input').value = '';
  new bootstrap.Modal(document.getElementById('ratingModal')).show();
}

function setRatingStars(num) {
  selectedStars = num;
  document.querySelectorAll('#star-rating-selector button').forEach((b, idx) => {
    b.className = (idx + 1 === num) ? 'btn btn-dark rounded-pill px-3 fw-bold' : 'btn btn-outline-dark rounded-pill px-3 fw-bold';
  });
}

function submitShopRating() {
  const shops = getShopsData();
  const idx = shops.findIndex(s => s.id === ratingTargetShopId);
  if (idx !== -1) {
    const totalScore = (shops[idx].rating * shops[idx].reviewsCount) + selectedStars;
    shops[idx].reviewsCount += 1;
    shops[idx].rating = Number((totalScore / shops[idx].reviewsCount).toFixed(1));
    saveShopsData(shops);
    renderShopsList(getPublicShops());
  }
  bootstrap.Modal.getInstance(document.getElementById('ratingModal')).hide();
  showToast("Calificación registrada", "success");
}

// ------------------------------------------
// 6. PANEL DEL DUEÑO DE NEGOCIO
// ------------------------------------------
function switchOwnerView(viewName) {
  if (viewName === 'resumen') renderOwnerSummary();
  ['resumen', 'agenda', 'equipo', 'servicios', 'horarios'].forEach(v => {
    document.getElementById(`owner-view-${v}`)?.classList.toggle('d-none', v !== viewName);
    const btn = document.getElementById(`tab-own-${v}`);
    if (btn) {
      btn.className = (v === viewName)
        ? 'btn btn-sm btn-dark rounded-pill px-3 fw-semibold'
        : 'btn btn-sm btn-link text-decoration-none text-reset rounded-pill px-3 fw-semibold';
    }
  });
  if (viewName === 'horarios') setTimeout(initOwnerLocationMap, 100);
}

function getOwnerEmail() {
  const s = JSON.parse(localStorage.getItem('urbantime_user_session') || '{}');
  return (s.email || '').toLowerCase();
}

function getOwnerIndex(shops) {
  const email = getOwnerEmail();
  return shops.findIndex(s => (s.ownerEmail || '').toLowerCase() === email);
}

function getOwnerShop() {
  const shops = getShopsData();
  const i = getOwnerIndex(shops);
  return i === -1 ? null : shops[i];
}

// Solo los locales completos son visibles para los clientes
function getPublicShops() {
  return getShopsData().filter(s => s.located !== false && s.services.length && s.staff.length && s.timeSlots.length);
}

function generateShopCode(shops) {
  let code;
  do { code = 'URB-' + (100 + Math.floor(Math.random() * 900)); }
  while (shops.some(s => s.code === code));
  return code;
}

function registerBusiness(event) {
  event.preventDefault();
  const shops = getShopsData();
  shops.push({
    id: 'shop-' + Date.now(),
    code: generateShopCode(shops),
    ownerEmail: getOwnerEmail(),
    name: document.getElementById('reg-shop-name').value.trim(),
    category: document.getElementById('reg-shop-category').value,
    address: document.getElementById('reg-shop-address').value.trim(),
    phone: document.getElementById('reg-shop-phone').value.trim(),
    // Ubicación provisional cerca del centro de Bogotá (luego se cambia por geocodificación real)
    lat: 4.675 + (Math.random() - 0.5) * 0.04,
    lng: -74.052 + (Math.random() - 0.5) * 0.04,
    located: false,
    rating: 0,
    reviewsCount: 0,
    staff: [],
    services: [],
    timeSlots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM']
  });
  saveShopsData(shops);
  showToast('Negocio creado. Ahora agrega tu equipo y servicios', 'success');
  initOwnerDashboard();
  switchOwnerView('horarios');
}


function initOwnerDashboard() {
  const shop = getOwnerShop();
  if (!shop) return;
  const onboarding = document.getElementById('owner-onboarding');
  const workspace = document.getElementById('owner-workspace');
  const tabs = ['owner-top-tabs', 'mobile-owner-pills'].map(id => document.getElementById(id));

  // Primera vez: mostrar el registro del negocio
  if (!shop) {
    workspace.classList.add('d-none');
    onboarding.classList.remove('d-none');
    tabs.forEach(t => t.classList.add('invisible'));
    return;
  }
  onboarding.classList.add('d-none');
  workspace.classList.remove('d-none');
  tabs.forEach(t => t.classList.remove('invisible'));

  document.getElementById('owner-shop-title').textContent = shop.name;
  document.getElementById('owner-shop-code-badge').textContent = `CÓDIGO: ${shop.code}`;
  document.getElementById('edit-owner-shop-name').value = shop.name;
  document.getElementById('edit-owner-shop-category').value = shop.category;
  document.getElementById('edit-owner-shop-address').value = shop.address;

  renderOwnerAppointments();
  renderOwnerStaff();
  renderOwnerServices();
  renderOwnerTimeSlots();
  renderOwnerSummary();
  switchOwnerView('resumen');
}


function saveOwnerBusinessInfo(event) {
  event.preventDefault();
  const shops = getShopsData();
  shops[getOwnerIndex(shops)].name = document.getElementById('edit-owner-shop-name').value.trim();
  shops[getOwnerIndex(shops)].category = document.getElementById('edit-owner-shop-category').value;
  shops[getOwnerIndex(shops)].address = document.getElementById('edit-owner-shop-address').value.trim();
  saveShopsData(shops);
  document.getElementById('owner-shop-title').textContent = shops[getOwnerIndex(shops)].name;
  showToast("Datos del negocio actualizados", "success");
}

function copyShopCode() {
  const shop = getOwnerShop();
  navigator.clipboard?.writeText(shop.code);
  showToast(`Código ${shop.code} copiado para compartir`, "success");
}

function renderOwnerAppointments() {
  const shop = getOwnerShop();
  const apts = getAppointmentsData().filter(a => a.shopId === shop.id);
  document.getElementById('metric-total-citas').textContent = apts.length;
  document.getElementById('metric-shop-rating').textContent = `${shop.rating}`;

  const tbody = document.getElementById('owner-appointments-table');
  if (!apts.length) {
    tbody.innerHTML = `<tr><td colspan="6" class="text-center text-body-secondary py-4">No hay turnos agendados aún. Comparte el código <strong>${esc(shop.code)}</strong> con tus clientes.</td></tr>`;
    return;
  }

  tbody.innerHTML = apts.map(apt => `
    <tr>
      <td class="fw-bold">${esc(apt.clientName)}</td>
      <td>${esc(apt.serviceName)}</td>
      <td>${esc(apt.staffName)}</td>
      <td><span class="ut-tag">${apt.dateStr} · ${apt.timeSlot}</span></td>
      <td>$${Number(apt.price).toLocaleString()}</td>
      <td class="text-end">
        <button onclick="completeOwnerAppointment('${apt.id}')" class="btn btn-ut-dark btn-sm">Atendido</button>
      </td>
    </tr>
  `).join('');
}

function completeOwnerAppointment(aptId) {
  saveAppointmentsData(getAppointmentsData().filter(a => a.id !== aptId));
  renderOwnerAppointments();
  renderOwnerSummary();
  showToast("Turno completado", "success");
}

function renderOwnerStaff() {
  const shop = getOwnerShop();
  document.getElementById('metric-total-staff').textContent = shop.staff.length;
  document.getElementById('owner-staff-list').innerHTML = shop.staff.map(st => `
    <div class="col-md-6">
      <div class="ut-select-box d-flex justify-content-between align-items-center">
        <div>
          <div class="fw-bold small">${esc(st.name)}</div>
          <small class="text-body-secondary">${esc(st.role)}</small>
        </div>
        <button onclick="removeStaffMember('${st.id}')" class="btn btn-outline-danger btn-sm rounded-circle" title="Eliminar"><i class="bi bi-x"></i></button>
      </div>
    </div>
  `).join('');
}

function addStaffMember(event) {
  event.preventDefault();
  const shops = getShopsData();
  shops[getOwnerIndex(shops)].staff.push({
    id: 'st-' + Date.now(),
    name: document.getElementById('new-staff-name').value.trim(),
    role: document.getElementById('new-staff-role').value.trim()
  });
  saveShopsData(shops);
  event.target.reset();
  renderOwnerStaff();
  showToast("Especialista agregado al equipo", "success");
}

function removeStaffMember(staffId) {
  const shops = getShopsData();
  shops[getOwnerIndex(shops)].staff = shops[getOwnerIndex(shops)].staff.filter(s => s.id !== staffId);
  saveShopsData(shops);
  renderOwnerStaff();
  showToast("Especialista eliminado", "info");
}

function renderOwnerServices() {
  const shop = getOwnerShop();
  document.getElementById('metric-total-services').textContent = shop.services.length;
  document.getElementById('owner-services-table').innerHTML = shop.services.map(sv => `
    <tr>
      <td class="fw-semibold">${esc(sv.name)}</td>
      <td>${sv.duration} min</td>
      <td>$${Number(sv.price).toLocaleString()}</td>
      <td class="text-end">
        <button onclick="removeBusinessService('${sv.id}')" class="btn btn-outline-danger btn-sm rounded-circle"><i class="bi bi-trash"></i></button>
      </td>
    </tr>
  `).join('');
}

function addBusinessService(event) {
  event.preventDefault();
  const shops = getShopsData();
  shops[getOwnerIndex(shops)].services.push({
    id: 'sv-' + Date.now(),
    name: document.getElementById('new-service-name').value.trim(),
    duration: Number(document.getElementById('new-service-duration').value),
    price: Number(document.getElementById('new-service-price').value)
  });
  saveShopsData(shops);
  event.target.reset();
  renderOwnerServices();
  showToast("Servicio agregado al catálogo", "success");
}

function removeBusinessService(serviceId) {
  const shops = getShopsData();
  shops[getOwnerIndex(shops)].services = shops[getOwnerIndex(shops)].services.filter(s => s.id !== serviceId);
  saveShopsData(shops);
  renderOwnerServices();
  showToast("Servicio eliminado", "info");
}

function renderOwnerTimeSlots() {
  const shop = getOwnerShop();
  document.getElementById('owner-timeslots-grid').innerHTML = shop.timeSlots.map(slot => `
    <span class="badge text-bg-dark rounded-pill px-3 py-2 d-inline-flex align-items-center gap-2 fw-semibold">
      <span>${slot}</span>
      <button onclick="removeTimeSlot('${slot}')" class="btn-close btn-close-white" style="font-size: 0.55rem;" aria-label="Quitar"></button>
    </span>
  `).join('');
}

function addCustomTimeSlot() {
  const raw = prompt("Ingresa la nueva franja horaria (Ej. 07:00 PM):");
  if (!raw) return;
  const m = /^(\d{1,2}):([0-5]\d)\s*(AM|PM)$/i.exec(raw.trim());
  if (!m || Number(m[1]) < 1 || Number(m[1]) > 12) {
    showToast("Formato inválido. Usa por ejemplo 07:00 PM", "error");
    return;
  }
  const slot = `${m[1].padStart(2, '0')}:${m[2]} ${m[3].toUpperCase()}`;
  const shops = getShopsData();
  const shop = shops[getOwnerIndex(shops)];
  if (shop.timeSlots.includes(slot)) {
    showToast("Ese horario ya existe", "info");
    return;
  }
  shop.timeSlots.push(slot);
  shop.timeSlots.sort((a, b) => slotToMinutes(a) - slotToMinutes(b));
  saveShopsData(shops);
  renderOwnerTimeSlots();
  showToast("Horario habilitado", "success");
}

function removeTimeSlot(slot) {
  const shops = getShopsData();
  shops[getOwnerIndex(shops)].timeSlots = shops[getOwnerIndex(shops)].timeSlots.filter(s => s !== slot);
  saveShopsData(shops);
  renderOwnerTimeSlots();
  showToast("Horario deshabilitado", "info");
}

// ------------------------------------------
// 7. MODALES LOGIN & TOAST
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

function openForgotModal() { document.getElementById('forgot-modal').classList.remove('hidden'); }
function closeForgotModal() { document.getElementById('forgot-modal').classList.add('hidden'); }
function handleForgotSubmit(event) {
  event.preventDefault();
  const email = document.getElementById('forgot-email-input').value;
  closeForgotModal();
  showToast(`Enlace enviado a ${email}`, "success");
}

function openTermsModal(event) {
  if (event) event.preventDefault();
  document.getElementById('terms-modal').classList.remove('hidden');
}
function closeTermsModal() { document.getElementById('terms-modal').classList.add('hidden'); }

function showToast(message, type = 'info') {
  const toast = document.getElementById('toast-notification');
  const messageEl = document.getElementById('toast-message');
  const iconEl = document.getElementById('toast-icon');
  if (!toast || !messageEl || !iconEl) return;

  if (toastTimer) clearTimeout(toastTimer);
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
  }, 2400);
}

// ------------------------------------------
// 8. RESUMEN DEL PRESTADOR
// ------------------------------------------
function slotToMinutes(slot) {
  const m = /(\d{1,2}):(\d{2})\s*(AM|PM)/i.exec(slot || '');
  if (!m) return 0;
  let h = Number(m[1]) % 12;
  if (m[3].toUpperCase() === 'PM') h += 12;
  return h * 60 + Number(m[2]);
}

function renderOwnerSummary() {
  if (!document.getElementById('kpi-today')) return;
  const shop = getOwnerShop();
  const session = JSON.parse(localStorage.getItem('urbantime_user_session') || '{}');
  const now = new Date();
  const todayStr = formatDateISO(now);
  const all = getAppointmentsData().filter(a => a.shopId === shop.id);
  const today = all.filter(a => a.dateStr === todayStr);

  const hour = now.getHours();
  const greet = hour < 12 ? 'Buenos días' : hour < 19 ? 'Buenas tardes' : 'Buenas noches';
  document.getElementById('sum-greeting').textContent = `${greet}, ${(session.name || '').split(' ')[0] || shop.name}`;
  document.getElementById('sum-date').textContent = now.toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' });

  document.getElementById('kpi-today').textContent = today.length;
  document.getElementById('kpi-income').textContent = '$' + today.reduce((s, a) => s + Number(a.price || 0), 0).toLocaleString('es-CO');
  document.getElementById('kpi-pending').textContent = all.length;
  document.getElementById('kpi-rating').textContent = shop.rating;
  document.getElementById('sum-code').textContent = shop.code;
  const missing = [];
  if (shop.located === false) missing.push('ubicar tu local en el mapa');
  if (!shop.services.length) missing.push('al menos 1 servicio');
  if (!shop.staff.length) missing.push('al menos 1 barbero o estilista');
  if (!shop.timeSlots.length) missing.push('al menos 1 horario');
  document.getElementById('sum-publish-alert').innerHTML = missing.length
    ? `<div class="alert alert-warning rounded-4 small d-flex gap-2 align-items-start"><i class="bi bi-eye-slash"></i><div><strong>Tu local aún no es visible para los clientes.</strong> Agrega ${missing.join(', ')} para publicarlo.</div></div>`
    : `<div class="alert alert-success rounded-4 small d-flex gap-2 align-items-center"><i class="bi bi-eye"></i><div><strong>Tu local está publicado.</strong> Ya aparece en el mapa y con el código <strong>${esc(shop.code)}</strong>.</div></div>`;

  const upcoming = all
    .slice()
    .sort((a, b) => a.dateStr.localeCompare(b.dateStr) || slotToMinutes(a.timeSlot) - slotToMinutes(b.timeSlot))
    .slice(0, 5);
  const box = document.getElementById('sum-upcoming');
  if (!upcoming.length) {
    box.innerHTML = `<div class="text-center text-body-secondary small py-4">Aún no tienes turnos. Comparte tu código <strong>${esc(shop.code)}</strong> para recibir reservas.</div>`;
    return;
  }
  box.innerHTML = upcoming.map((a, i) => `
    <div class="ut-select-box d-flex align-items-center gap-3 ${i === 0 ? 'active' : ''}">
      <div class="text-center flex-shrink-0" style="min-width:74px;">
        <div class="fw-bold small">${a.timeSlot}</div>
        <small class="text-body-secondary">${a.dateStr === todayStr ? 'Hoy' : a.dateStr}</small>
      </div>
      <div class="flex-grow-1">
        <div class="fw-bold small">${esc(a.clientName)}</div>
        <small class="text-body-secondary">${esc(a.serviceName)} · ${esc(a.staffName)}</small>
      </div>
      ${i === 0 ? '<span class="ut-tag">Siguiente</span>' : ''}
    </div>`).join('');
}


// ------------------------------------------
// 9. UBICACIÓN REAL DEL LOCAL
// ------------------------------------------
let ownerMap = null;
let ownerMarker = null;
let pendingLocation = null;

function setLocationStatus(text) {
  const el = document.getElementById('owner-location-status');
  if (el) el.textContent = text;
}

function placeOwnerMarker(lat, lng) {
  if (ownerMarker) {
    ownerMarker.setLatLng([lat, lng]);
    return;
  }
  ownerMarker = L.marker([lat, lng], { draggable: true }).addTo(ownerMap);
  ownerMarker.on('dragend', () => {
    const p = ownerMarker.getLatLng();
    setPendingLocation(p.lat, p.lng, false);
  });
}

function setPendingLocation(lat, lng, moveMarker = true) {
  pendingLocation = { lat, lng };
  if (moveMarker) placeOwnerMarker(lat, lng);
  setLocationStatus('Ubicación marcada. Pulsa "Guardar ubicación" para confirmarla.');
}

function initOwnerLocationMap() {
  const shop = getOwnerShop();
  const el = document.getElementById('owner-location-map');
  if (!shop || !el || typeof L === 'undefined') return;

  if (!ownerMap) {
    ownerMap = L.map('owner-location-map');
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap'
    }).addTo(ownerMap);
    ownerMap.on('click', e => setPendingLocation(e.latlng.lat, e.latlng.lng));
  }

  pendingLocation = null;
  ownerMap.setView([shop.lat, shop.lng], shop.located === false ? 12 : 16);
  placeOwnerMarker(shop.lat, shop.lng);
  setLocationStatus(shop.located === false
    ? 'Aún no has ubicado tu local. Los clientes no lo verán hasta que lo hagas.'
    : 'Ubicación guardada.');
  setTimeout(() => ownerMap.invalidateSize(), 200);
}

async function geocodeOwnerAddress() {
  const address = document.getElementById('edit-owner-shop-address').value.trim();
  if (!address) { showToast('Escribe primero la dirección del local', 'error'); return; }
  setLocationStatus('Buscando dirección...');
  try {
    // Servicio gratuito de OpenStreetMap. Cambia "Bogotá" si tu ciudad es otra.
    const url = 'https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=co&q='
      + encodeURIComponent(address + ', Bogotá, Colombia');
    const res = await fetch(url, { headers: { 'Accept-Language': 'es' } });
    const data = await res.json();
    if (!data.length) {
      setLocationStatus('No encontré esa dirección. Toca el mapa para marcarla a mano.');
      return;
    }
    const lat = Number(data[0].lat), lng = Number(data[0].lon);
    ownerMap.setView([lat, lng], 17);
    setPendingLocation(lat, lng);
  } catch (e) {
    setLocationStatus('No pude buscar la dirección. Toca el mapa para marcarla a mano.');
  }
}

function useMyLocation() {
  if (!navigator.geolocation) { showToast('Tu navegador no permite geolocalización', 'error'); return; }
  setLocationStatus('Obteniendo tu ubicación...');
  navigator.geolocation.getCurrentPosition(
    pos => {
      ownerMap.setView([pos.coords.latitude, pos.coords.longitude], 17);
      setPendingLocation(pos.coords.latitude, pos.coords.longitude);
    },
    () => setLocationStatus('No tengo permiso para ver tu ubicación. Toca el mapa para marcarla.')
  );
}

function saveOwnerLocation() {
  if (!pendingLocation) { showToast('Marca primero tu local en el mapa', 'error'); return; }
  const shops = getShopsData();
  const shop = shops[getOwnerIndex(shops)];
  shop.lat = pendingLocation.lat;
  shop.lng = pendingLocation.lng;
  shop.located = true;
  saveShopsData(shops);
  pendingLocation = null;
  setLocationStatus('Ubicación guardada.');
  renderOwnerSummary();
  showToast('Ubicación del local guardada', 'success');
}