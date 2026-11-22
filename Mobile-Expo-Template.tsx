// =======================================================================
// UrbanTime - Plantilla Nativa React Native / Expo para Android & iOS
// Producción Global
// =======================================================================

import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<'cliente' | 'negocio'>('cliente');
  const [isLoading, setIsLoading] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  // Manejador de Login con Correo
  const handleEmailAuth = async () => {
    if (!email || !password) {
      Alert.alert('Campos requeridos', 'Por favor ingresa tu correo y contraseña.');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert('¡Bienvenido!', `Sesión iniciada con éxito.`);
    }, 1000);
  };

  // Manejador de Login con Google (Nativo iOS / Android)
  const handleGoogleSignIn = async () => {
    Alert.alert(
      'Google Sign-In',
      'Iniciando flujo nativo de Google Auth (OAuth 2.0)...'
    );
  };

  // Manejador de Login con Facebook
  const handleFacebookSignIn = async () => {
    Alert.alert(
      'Facebook Login',
      'Iniciando flujo con Meta Facebook Graph SDK...'
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardContainer}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Logo & Marca UrbanTime */}
          <View style={styles.brandHeader}>
            <View style={styles.logoBadge}>
              <Ionicons name="calendar-outline" size={26} color="#FFFFFF" />
            </View>
            <Text style={styles.brandTitle}>UrbanTime</Text>
            <Text style={styles.brandSlogan}>Reserva. Organiza. Crece.</Text>
          </View>

          {/* Tarjeta de Autenticación */}
          <View style={styles.card}>
            <Text style={styles.heading}>
              {isRegisterMode ? 'Crear cuenta' : 'Hola de nuevo'}
            </Text>
            <Text style={styles.subheading}>
              {isRegisterMode
                ? 'Únete a la mejor red de turnos fáciles'
                : 'Aquí estás de vuelta. Sigue donde lo dejaste.'}
            </Text>

            {/* Botón Principal: Google Sign-In */}
            <TouchableOpacity
              style={styles.googleBtn}
              onPress={handleGoogleSignIn}
              activeOpacity={0.8}
            >
              <Ionicons name="logo-google" size={18} color="#EA4335" />
              <Text style={styles.googleBtnText}>
                {isRegisterMode ? 'Registrarme con Google' : 'Entrar con Google'}
              </Text>
            </TouchableOpacity>

            {/* Separador */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>o con tu correo</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Selector de Rol (Cliente vs Negocio) */}
            <View style={styles.roleContainer}>
              <TouchableOpacity
                style={[styles.roleBtn, role === 'cliente' && styles.roleBtnActive]}
                onPress={() => setRole('cliente')}
              >
                <Ionicons
                  name="person-outline"
                  size={15}
                  color={role === 'cliente' ? '#4F46E5' : '#6B7280'}
                />
                <Text style={[styles.roleText, role === 'cliente' && styles.roleTextActive]}>
                  Soy Cliente
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.roleBtn, role === 'negocio' && styles.roleBtnActive]}
                onPress={() => setRole('negocio')}
              >
                <Ionicons
                  name="storefront-outline"
                  size={15}
                  color={role === 'negocio' ? '#4F46E5' : '#6B7280'}
                />
                <Text style={[styles.roleText, role === 'negocio' && styles.roleTextActive]}>
                  Soy Negocio
                </Text>
              </TouchableOpacity>
            </View>

            {/* Input Correo */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>CORREO ELECTRÓNICO</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="mail-outline" size={18} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="tu@email.com"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
            </View>

            {/* Input Contraseña */}
            <View style={styles.inputGroup}>
              <View style={styles.passwordLabelRow}>
                <Text style={styles.inputLabel}>CONTRASEÑA</Text>
                {!isRegisterMode && (
                  <TouchableOpacity onPress={() => Alert.alert('Recuperar clave', 'Enlace de restablecimiento enviado.')}>
                    <Text style={styles.forgotLink}>¿Olvidaste tu contraseña?</Text>
                  </TouchableOpacity>
                )}
              </View>
              <View style={styles.inputWrapper}>
                <Ionicons name="key-outline" size={18} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="••••••••"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={18}
                    color="#6B7280"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Botón CTA Iniciar Sesión con gradiente azul-índigo */}
            <TouchableOpacity
              style={styles.submitBtn}
              onPress={handleEmailAuth}
              disabled={isLoading}
              activeOpacity={0.85}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <View style={styles.submitBtnContent}>
                  <Text style={styles.submitBtnText}>
                    {isRegisterMode ? 'Crear mi cuenta' : 'Iniciar Sesión'}
                  </Text>
                  <Ionicons name="arrow-forward" size={18} color="#FFFFFF" style={{ marginLeft: 6 }} />
                </View>
              )}
            </TouchableOpacity>

            {/* Badge de Seguridad */}
            <View style={styles.securityRow}>
              <Ionicons name="lock-closed-outline" size={13} color="#F59E0B" />
              <Text style={styles.securityText}>Tus datos están cifrados y son 100% privados</Text>
            </View>

            {/* Botones Sociales Secundarios */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>o también con</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.socialRow}>
              {/* Facebook */}
              <TouchableOpacity
                style={styles.facebookBtn}
                onPress={handleFacebookSignIn}
                activeOpacity={0.8}
              >
                <Ionicons name="logo-facebook" size={18} color="#1877F2" />
                <Text style={styles.facebookBtnText}>Facebook</Text>
              </TouchableOpacity>

              {/* Apple (Requerido para App Store) */}
              <TouchableOpacity
                style={styles.appleBtn}
                onPress={() => Alert.alert('Apple Sign-In', 'Apple ID Authentication activado')}
                activeOpacity={0.8}
              >
                <Ionicons name="logo-apple" size={18} color="#FFFFFF" />
                <Text style={styles.appleBtnText}>Apple ID</Text>
              </TouchableOpacity>
            </View>

            {/* Toggle Registrarse / Iniciar Sesión */}
            <View style={styles.switchRow}>
              <Text style={styles.switchText}>
                {isRegisterMode ? '¿Ya tienes una cuenta?' : '¿No tienes cuenta?'}
              </Text>
              <TouchableOpacity onPress={() => setIsRegisterMode(!isRegisterMode)}>
                <Text style={styles.switchHighlight}>
                  {isRegisterMode ? ' Inicia sesión' : ' Regístrate gratis aquí'}
                </Text>
              </TouchableOpacity>
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandHeader: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  logoBadge: {
    width: 50,
    height: 50,
    borderRadius: 18,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  brandTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111827',
    marginTop: 8,
    letterSpacing: -0.5,
  },
  brandSlogan: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
    marginTop: 2,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 24,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  heading: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
  },
  subheading: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
    marginBottom: 18,
  },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    paddingVertical: 13,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  googleBtnText: {
    marginLeft: 10,
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    marginHorizontal: 10,
    fontSize: 11,
    color: '#9CA3AF',
    textTransform: 'lowercase',
    fontWeight: '500',
  },
  roleContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    padding: 4,
    marginBottom: 16,
  },
  roleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 11,
  },
  roleBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginLeft: 6,
  },
  roleTextActive: {
    color: '#111827',
    fontWeight: '700',
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9CA3AF',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  passwordLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  forgotLink: {
    fontSize: 11,
    color: '#4F46E5',
    fontWeight: '600',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    paddingHorizontal: 12,
    height: 48,
  },
  inputIcon: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: '#1F2937',
  },
  eyeBtn: {
    padding: 6,
  },
  submitBtn: {
    backgroundColor: '#4F46E5',
    borderRadius: 16,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 5,
  },
  submitBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  securityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  securityText: {
    fontSize: 11,
    color: '#6B7280',
    marginLeft: 5,
  },
  socialRow: {
    flexDirection: 'row',
    gap: 10,
  },
  facebookBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(24, 119, 242, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(24, 119, 242, 0.2)',
    borderRadius: 14,
    paddingVertical: 11,
  },
  facebookBtnText: {
    color: '#1877F2',
    fontWeight: '700',
    fontSize: 12,
    marginLeft: 6,
  },
  appleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111827',
    borderRadius: 14,
    paddingVertical: 11,
  },
  appleBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
    marginLeft: 6,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 18,
  },
  switchText: {
    fontSize: 12,
    color: '#6B7280',
  },
  switchHighlight: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4F46E5',
  },
});
