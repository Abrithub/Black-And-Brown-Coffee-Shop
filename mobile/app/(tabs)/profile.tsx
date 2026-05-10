import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  TextInput, Alert, ActivityIndicator,
} from 'react-native';
import { COLORS } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';

export default function ProfileScreen() {
  const { user, login, register, logout } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const handleAuth = async () => {
    setError('');
    if (!form.email || !form.password) { setError('Email and password are required'); return; }
    if (mode === 'register') {
      if (!form.name) { setError('Name is required'); return; }
      if (form.password !== form.confirm) { setError('Passwords do not match'); return; }
      if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    }
    setLoading(true);
    try {
      const res = mode === 'login'
        ? await login(form.email, form.password)
        : await register(form.name, form.email, form.password);
      if (!res.success) setError(res.message || 'Authentication failed');
    } catch (e: any) {
      setError(e.message || 'Something went wrong');
    } finally { setLoading(false); }
  };

  if (user) return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user.name.charAt(0).toUpperCase()}</Text>
          </View>
          <Text style={styles.profileName}>{user.name}</Text>
          <Text style={styles.profileEmail}>{user.email}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>{user.role === 'admin' ? '👑 Admin' : '☕ Customer'}</Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Account Info</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Name</Text>
            <Text style={styles.infoValue}>{user.name}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{user.email}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Role</Text>
            <Text style={styles.infoValue}>{user.role}</Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => Alert.alert('Logout', 'Are you sure?', [{ text: 'Cancel' }, { text: 'Logout', onPress: logout, style: 'destructive' }])}
          style={styles.logoutBtn}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{mode === 'login' ? 'Sign In' : 'Create Account'}</Text>
        <Text style={styles.headerSub}>Black & Brown Coffee Shop</Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 60 }}>
        <Text style={styles.welcomeText}>
          {mode === 'login' ? 'Welcome back! ☕' : 'Join us today! ☕'}
        </Text>

        {error ? <View style={styles.errorBox}><Text style={styles.errorText}>{error}</Text></View> : null}

        {mode === 'register' && (
          <TextInput style={styles.input} placeholder="Full Name" placeholderTextColor={COLORS.textDim}
            value={form.name} onChangeText={v => set('name', v)} autoCapitalize="words" />
        )}
        <TextInput style={styles.input} placeholder="Email Address" placeholderTextColor={COLORS.textDim}
          value={form.email} onChangeText={v => set('email', v)} keyboardType="email-address" autoCapitalize="none" />
        <TextInput style={styles.input} placeholder="Password" placeholderTextColor={COLORS.textDim}
          value={form.password} onChangeText={v => set('password', v)} secureTextEntry />
        {mode === 'register' && (
          <TextInput style={styles.input} placeholder="Confirm Password" placeholderTextColor={COLORS.textDim}
            value={form.confirm} onChangeText={v => set('confirm', v)} secureTextEntry />
        )}

        <TouchableOpacity onPress={handleAuth} disabled={loading} style={[styles.authBtn, loading && { opacity: 0.6 }]}>
          {loading ? <ActivityIndicator color="#000" /> : (
            <Text style={styles.authBtnText}>{mode === 'login' ? 'Sign In' : 'Create Account'}</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }} style={styles.switchBtn}>
          <Text style={styles.switchText}>
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <Text style={styles.switchLink}>{mode === 'login' ? 'Sign Up' : 'Sign In'}</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 16, backgroundColor: COLORS.surface },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: COLORS.primary },
  headerSub: { color: COLORS.textMuted, fontSize: 13 },
  welcomeText: { color: COLORS.text, fontSize: 20, fontWeight: '600', marginBottom: 24, textAlign: 'center' },
  errorBox: { backgroundColor: '#7f1d1d', borderRadius: 10, padding: 12, marginBottom: 16 },
  errorText: { color: '#fca5a5', fontSize: 14 },
  input: { backgroundColor: COLORS.surfaceLight, borderRadius: 12, padding: 14, color: COLORS.text, fontSize: 15, marginBottom: 14, borderWidth: 1, borderColor: COLORS.border },
  authBtn: { backgroundColor: COLORS.primary, borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginTop: 8 },
  authBtnText: { color: '#000', fontWeight: 'bold', fontSize: 17 },
  switchBtn: { marginTop: 20, alignItems: 'center' },
  switchText: { color: COLORS.textMuted, fontSize: 14 },
  switchLink: { color: COLORS.primary, fontWeight: 'bold' },
  profileCard: { backgroundColor: COLORS.surface, borderRadius: 20, padding: 24, alignItems: 'center', marginBottom: 16, borderWidth: 1, borderColor: COLORS.border },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  avatarText: { color: '#000', fontSize: 32, fontWeight: 'bold' },
  profileName: { color: COLORS.text, fontSize: 22, fontWeight: 'bold', marginBottom: 4 },
  profileEmail: { color: COLORS.textMuted, fontSize: 15, marginBottom: 10 },
  roleBadge: { backgroundColor: COLORS.surfaceLight, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 6, borderWidth: 1, borderColor: COLORS.border },
  roleText: { color: COLORS.primary, fontWeight: '600' },
  infoCard: { backgroundColor: COLORS.surface, borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: COLORS.border },
  infoTitle: { color: COLORS.primary, fontWeight: 'bold', fontSize: 16, marginBottom: 12 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  infoLabel: { color: COLORS.textMuted, fontSize: 14 },
  infoValue: { color: COLORS.text, fontSize: 14, fontWeight: '500' },
  logoutBtn: { backgroundColor: '#7f1d1d', borderRadius: 14, paddingVertical: 16, alignItems: 'center', borderWidth: 1, borderColor: COLORS.error },
  logoutText: { color: COLORS.error, fontWeight: 'bold', fontSize: 16 },
});
