# 🚀 Guía Oficial: Cómo compilar UrbanTime para Android & iPhone (iOS)

Hola Juan, para cumplir con el requisito de que la app funcione tanto en **Web**, como en **Android** y **iPhone (iOS)** con el menor esfuerzo y máxima calidad, existen 2 caminos profesionales utilizados por las startups más exitosas:

---

## ⚡ Método 1: Capacitor (Recomendado para ir a máxima velocidad)
Capacitor (creado por el equipo de Ionic) toma tu código Web responsivo y lo envuelve en un contenedor nativo de alto rendimiento para Android Studio y Xcode.

### Paso 1: Inicializar Capacitor en la carpeta del proyecto
```bash
cd c:\Users\mackl\OneDrive\Desktop\UrbanTime
npm init -y
npm install @capacitor/core @capacitor/cli @capacitor/android @capacitor/ios
npx cap init "UrbanTime" "com.urbantime.app" --web-dir "."
```

### Paso 2: Agregar las plataformas nativas
```bash
# Para Android (crea la carpeta /android lista para Android Studio)
npx cap add android

# Para iPhone / iOS (requiere Mac para compilar el .ipa final en Xcode)
npx cap add ios
```

### Paso 3: Sincronizar y Abrir
```bash
# Copia tus archivos web a Android e iOS
npx cap sync

# Abre el proyecto nativo en Android Studio para generar el APK o subir a Play Store:
npx cap open android

# Abre el proyecto en Xcode para iPhone:
npx cap open ios
```

---

## 📱 Método 2: React Native con Expo (100% Nativo)
Si quieren una app con componentes nativos de Android y SwiftUI en iOS:
1. Ya te dejamos el archivo listo: `Mobile-Expo-Template.tsx`.
2. Para probarlo en sus celulares hoy mismo:
   ```bash
   npx create-expo-app UrbanTimeApp -t blank-typescript
   cd UrbanTimeApp
   npx expo install @expo/vector-icons
   # Copias el contenido de Mobile-Expo-Template.tsx en App.tsx
   npx expo start
   ```
3. Abren la cámara de su iPhone o la app **Expo Go** en Android, escanean el código QR y verán la app corriendo nativamente en sus teléfonos en 10 segundos.

---

## 🔑 Configuración de Google & Facebook OAuth

### Para Google Sign-In:
1. Ve a [Google Cloud Console](https://console.cloud.google.com/).
2. Crea un proyecto llamado `UrbanTime`.
3. Ve a **Pantalla de consentimiento de OAuth**:
   - Nombre: `UrbanTime - Reserva de Turnos`
   - Correo de soporte: tu correo.
4. Ve a **Credenciales** -> **Crear ID de cliente de OAuth**:
   - Tipo de aplicación: *Aplicación web* (para la web) y *Android* (ingresas el package `com.urbantime.app` y la huella SHA-1).
5. Copia el **Client ID** en la configuración.

### Para Facebook Sign-In:
1. Ve a [Meta for Developers](https://developers.facebook.com/).
2. Crea una app de tipo **Consumidor / Autenticación**.
3. Activa el producto **Inicio de sesión con Facebook**.
4. En configuración ingresas tu URL de redirección o el Package Name de Android.
5. Copia el **App ID**.

¡Con esto tienen un sistema de autenticación de nivel Silicon Valley listo para escalar a millones de usuarios!
