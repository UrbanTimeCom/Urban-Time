# 🚀 UrbanTime - Guía Maestra Paso a Paso
### Cómo activar la Base de Datos Real y el Inicio de Sesión con Google, Facebook y Apple (iPhone)

Hola Juan, esta es la guía definitiva para que tú, Miguel, Brayan y Jose activen la base de datos y todos los botones de inicio de sesión en producción real.

---

## 📍 PARTE 1: Crear la Base de Datos en Supabase (Gratis en 3 minutos)

Supabase es el servicio en la nube (respaldado por PostgreSQL) que almacenará a los usuarios, turnos y barberías.

1. Ve a [https://supabase.com](https://supabase.com) y haz clic en **"Start your project"**.
2. Inicia sesión con tu cuenta de GitHub o crea una cuenta gratis con tu correo.
3. Haz clic en el botón verde **"New Project"**:
   - **Name:** `UrbanTime`
   - **Database Password:** Escribe una contraseña segura (guárdala en un bloc de notas).
   - **Region:** Selecciona `East US (North Virginia)` o `South America (São Paulo)`.
   - Haz clic en **"Create new project"** y espera 1 minuto a que se inicialice.
4. Una vez creado el proyecto:
   - En el menú izquierdo haz clic en el icono de **SQL Editor** (parece un icono de terminal o código `>_`).
   - Abre el archivo `schema.sql` que te dejé en tu carpeta (`c:\Users\mackl\OneDrive\Desktop\UrbanTime\schema.sql`).
   - Copia todo su contenido, pégalo en el SQL Editor de Supabase y haz clic en el botón verde **"Run"**.
   - ¡Listo! Se habrán creado automáticamente las 4 tablas principales:
     - `profiles`: Datos del cliente o barbero.
     - `businesses`: Barberías y locales.
     - `services`: Lista de precios y cortes.
     - `appointments`: Citas con protección anti-doble reserva.

---

## 📍 PARTE 2: Activar Facebook Login (Meta for Developers)

Para que el botón de Facebook funcione en teléfonos y computadoras con cuentas reales:

1. Entra a [https://developers.facebook.com](https://developers.facebook.com) con tu cuenta personal de Facebook.
2. Arriba a la derecha haz clic en **"Mis apps"** y luego en **"Crear app"**.
3. Selecciona el caso de uso: **"Autenticar y permitir a los usuarios iniciar sesión con Facebook"** y haz clic en Siguiente.
4. En nombre de la app escribe: `UrbanTime`.
5. En el panel de control de tu nueva app de Facebook:
   - Busca el producto **"Inicio de sesión con Facebook"** y haz clic en **"Configurar"**.
   - En el menú lateral izquierdo, ve a **Inicio de sesión con Facebook ➔ Configuración**.
   - Busca el campo **"URI de redireccionamiento de OAuth válidos"**.
   - Pega tu URL de callback de Supabase. Luce exactamente así:
     ```
     https://<TU-ID-DE-PROYECTO>.supabase.co/auth/v1/callback
     ```
     *(Esta URL te la muestra Supabase en Authentication -> Providers -> Facebook)*.
   - Guarda los cambios.
6. Ahora en el menú izquierdo ve a **Configuración de la app ➔ Básica**:
   - Verás dos valores:
     - **Identificador de la app (App ID):** Cópialo.
     - **Clave secreta de la app (App Secret):** Haz clic en "Mostrar" y cópiala.
7. Ve a tu panel de **Supabase ➔ Authentication (icono de candado) ➔ Providers ➔ Facebook**:
   - Activa el interruptor **"Enable Facebook provider"**.
   - Pega tu **App ID** y tu **App Secret**.
   - Haz clic en **Save** (Guardar).
8. ¡Listo! El botón de Facebook ya abre la ventana oficial de Meta para autenticar a cualquier persona.

---

## 📍 PARTE 3: Activar Inicio de Sesión para iPhone (Apple ID e iOS)

En iPhone tienes dos caminos dependiendo de si ya tienen la cuenta de desarrollador de Apple ($99/año) o si quieren lanzar gratis hoy:

### Opción A (Gratis e Inmediata para iPhone hoy mismo):
- En iPhone, cualquier usuario puede iniciar sesión en Safari o Chrome con su **cuenta de Google**, con **Facebook** o con **Correo y Contraseña**.
- Además, como configuramos la app para ser PWA (Web App Progresiva), los usuarios en iPhone tocan el botón de compartir de Safari y seleccionan **"Añadir a pantalla de inicio"**: la app se instala con su icono de UrbanTime a pantalla completa como una app nativa sin pagarle nada a Apple.

### Opción B (Con Apple ID y Face ID nativo):
1. Requiere membresía en [developer.apple.com](https://developer.apple.com).
2. En **Certificates, Identifiers & Profiles ➔ Identifiers**, creas un **Services ID** con identificador `com.urbantime.app`.
3. Activas la casilla **Sign in with Apple**.
4. En **Domains and Return URLs**, agregas tu dominio de Supabase (`<tu-proyecto>.supabase.co`).
5. En **Keys**, generas una clave privada para Apple Sign-In y descargas el archivo `.p8`.
6. En tu panel de **Supabase ➔ Authentication ➔ Providers ➔ Apple**:
   - Activas Apple.
   - Ingresas tu **Services ID**, tu **Team ID** y la **Clave privada (.p8)**.
   - Guardas los cambios.

---

## 📍 PARTE 4: Activar Google Sign-In (Google Cloud)

1. Entra a [https://console.cloud.google.com](https://console.cloud.google.com).
2. Haz clic arriba en el selector de proyectos ➔ **"Nuevo proyecto"** ➔ Nombre: `UrbanTime`.
3. En la barra de búsqueda escribe **"Pantalla de consentimiento de OAuth"**:
   - Tipo de usuario: **Externo** ➔ Crear.
   - Nombre de la app: `UrbanTime`.
   - Correo de soporte: Tu correo ➔ Guardar y continuar hasta el final.
4. En el menú izquierdo ve a **"Credenciales" ➔ "Crear credenciales" ➔ "ID de cliente de OAuth"**:
   - Tipo de aplicación: **Aplicación web**.
   - Nombre: `UrbanTime Web`.
   - En **"URI de redireccionamiento autorizados"**, pega la URL de callback de Supabase (`https://<TU-PROYECTO>.supabase.co/auth/v1/callback`).
   - Haz clic en **Crear**.
5. Te entregará:
   - **ID de cliente (Client ID)**
   - **Secreto de cliente (Client Secret)**
6. En **Supabase ➔ Authentication ➔ Providers ➔ Google**:
   - Activa el interruptor **Enable Google provider**.
   - Pega tu Client ID y Client Secret ➔ Guardar.

---

## 📍 PARTE 5: Conectar tu código en 1 minuto

En tu proyecto `UrbanTime`, abre el archivo [supabase-auth.js](file:///c:/Users/mackl/OneDrive/Desktop/UrbanTime/supabase-auth.js) y en las primeras líneas reemplazas:

```javascript
const SUPABASE_URL = 'https://TU-PROYECTO.supabase.co';
const SUPABASE_ANON_KEY = 'TU-ANON-KEY-PUBLICA';
```

*(Esos dos valores los sacas de tu panel de Supabase en Project Settings (engranaje) -> API)*.

Y agregas en el `<head>` de tu `index.html`:
```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="./supabase-auth.js"></script>
```

¡Con eso todos los botones quedan conectados a la base de datos real en vivo!
