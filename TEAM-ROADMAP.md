# 🏆 UrbanTime: Plan Maestro de Desarrollo & Roles del Equipo

> **Misión:** Crear la plataforma #1 de gestión de turnos fáciles para barberías, estéticas y comercios locales en Web, Android e iOS.
> **Equipo Fundador:** Juan, Miguel, Brayan y Jose.

---

## 👥 División Estratégica de Responsabilidades

### 1. 🛡️ Juan (Líder de Autenticación, Seguridad & Multiplataforma)
- **Módulo:** Inicio de Sesión, Registro y Perfiles.
- **Entregables:**
  - Login y Registro con Google OAuth, Facebook y Correo/Contraseña.
  - Soporte multiplataforma garantizado: Web responsiva + Android + iPhone (iOS).
  - Selector de Roles: Cliente (quien pide el turno) vs Dueño de Barbería (quien atiende).
  - Recuperación de contraseña y encriptación de datos de usuario.
  - Estado: **✅ FASE 1 COMPLETADA Y FUNCIONAL EN ESTE REPOSITORIO.**

### 2. 📅 Miguel (Líder del Motor de Turnos, Citas & Calendario)
- **Módulo:** Flujo de Reserva y Agenda en Tiempo Real.
- **Entregables:**
  - Selector de servicios (Ej: Corte Clásico $25k, Barba $15k, Combo VIP $35k).
  - Calendario interactivo con bloques de 30 o 45 minutos (basado en la pantalla de Calendario del Mockup 1).
  - Cálculo de tiempos de espera en vivo ("Turno #04, tiempo estimado 15 minutos").
  - Cancelación y reprogramación de turnos.

### 3. 💈 Brayan (Líder de Experiencia de Negocios & Catálogo de Barberías)
- **Módulo:** Directorio de Locales y Panel Administrativo para Barberos.
- **Entregables:**
  - Vista de descubrimiento de barberías cercanas (geolocalización o lista por ciudad).
  - Perfil del negocio: fotos de trabajos, barberos disponibles, valoraciones/estrellas y horarios.
  - Dashboard del Barbero: pantalla donde el barbero ve los clientes que van llegando en orden y hace clic en "Llamar siguiente turno".

### 4. ⚡ Jose (Líder de Backend, Base de Datos en la Nube & Notificaciones)
- **Módulo:** Arquitectura de Datos y Mensajería.
- **Entregables:**
  - Base de datos en PostgreSQL / Supabase con tablas: `users`, `businesses`, `barbers`, `services`, `appointments`.
  - Notificaciones automáticas por WhatsApp / SMS / Push ("¡Tu turno está listo! Tienes 5 minutos para llegar a la silla").
  - Sistema de analíticas: ¿Cuántos turnos se atienden al día? ¿Cuáles son las horas pico?

---

## 🗓️ Roadmap de Ejecución (3 Fases)

```
[FASE 1: Cimientos y Auth] ---> [FASE 2: Flujo de Citas] ---> [FASE 3: Lanzamiento & Monetización]
• Login Web/iOS/Android          • Catálogo de Barberías       • WhatsApp API Notifications
• Roles Cliente/Negocio          • Selección de fecha/hora     • Modelo de suscripción mensual
• Perfil de usuario              • Cola de espera en vivo      • App Store & Google Play
```

---

## 💰 Modelo de Monetización (Cómo volver el proyecto rentable)
1. **Suscripción para Barberías / Locales (SaaS):**
   - Plan Básico (Gratis): Hasta 30 turnos al mes.
   - Plan Pro ($15 - $25 USD / mes por barbería): Turnos ilimitados, recordatorios por WhatsApp, estadísticas e informes de ingresos.
2. **Turno Express VIP (Clientes):**
   - El cliente paga un micro-pago ($1 - $2) para reservar con prioridad o asegurar su turno en horas pico sin hacer fila.
