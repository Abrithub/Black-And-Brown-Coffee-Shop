import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  Alert, TextInput, Modal, ActivityIndicator,
} from 'react-native';
import { COLORS } from '../../constants/theme';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

const PAYMENT_METHODS = ['Cash', 'Card', 'Telebirr', 'CBE'];

export default function CartScreen() {
  const { cart, removeFromCart, updateQuantity, clearCart, getTotal, getCount } = useCart();
  const { user } = useAuth();
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', phone: '', address: '', telebirrPhone: '', cbeAccount: '' });

  const total = getTotal();
  const delivery = total >= 500 ? 0 : 50;

  const placeOrder = async () => {
    if (!form.name || !form.email) { Alert.alert('Required', 'Please enter your name and email'); return; }
    if (cart.length === 0) { Alert.alert('Empty Cart', 'Add items before ordering'); return; }

    const paymentMeta = paymentMethod === 'Telebirr' ? { phone: form.telebirrPhone }
      : paymentMethod === 'CBE' ? { account: form.cbeAccount } : {};

    const payload = {
      customerId: user?.id || null,
      customerName: form.name,
      email: form.email,
      phone: form.phone,
      shippingAddress: form.address,
      items: cart.map(i => ({ name: i.name, quantity: i.quantity, price: i.price })),
      paymentMethod,
      paymentMeta,
    };

    try {
      setLoading(true);
      await api.post('/api/orders', payload);
      clearCart();
      setShowCheckout(false);
      Alert.alert('Order Placed! ✅', 'Thank you! We will contact you soon.');
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Order failed. Please try again.');
    } finally { setLoading(false); }
  };

  if (cart.length === 0) return (
    <View style={styles.empty}>
      <Text style={styles.emptyIcon}>🛒</Text>
      <Text style={styles.emptyTitle}>Your cart is empty</Text>
      <Text style={styles.emptySub}>Go to Shop and add some coffee!</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Cart</Text>
        <Text style={styles.headerSub}>{getCount()} items</Text>
      </View>

      <ScrollView style={styles.list} contentContainerStyle={{ padding: 16, paddingBottom: 120 }}>
        {cart.map(item => (
          <View key={item.id} style={styles.item}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
              <Text style={styles.itemPrice}>{item.price} birr each</Text>
            </View>
            <View style={styles.itemControls}>
              <TouchableOpacity onPress={() => updateQuantity(item.id, item.quantity - 1)} style={styles.qtyBtn}>
                <Text style={styles.qtyBtnText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.qty}>{item.quantity}</Text>
              <TouchableOpacity onPress={() => updateQuantity(item.id, item.quantity + 1)} style={styles.qtyBtn}>
                <Text style={styles.qtyBtnText}>+</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.itemRight}>
              <Text style={styles.itemTotal}>{item.price * item.quantity} birr</Text>
              <TouchableOpacity onPress={() => removeFromCart(item.id)}>
                <Text style={styles.removeBtn}>✕</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* Summary */}
        <View style={styles.summary}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>{total} birr</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery</Text>
            <Text style={[styles.summaryValue, delivery === 0 && { color: COLORS.success }]}>
              {delivery === 0 ? 'Free 🎉' : `${delivery} birr`}
            </Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{total + delivery} birr</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Buttons */}
      <View style={styles.bottomBar}>
        <TouchableOpacity onPress={() => Alert.alert('Clear Cart', 'Remove all items?', [{ text: 'Cancel' }, { text: 'Clear', onPress: clearCart, style: 'destructive' }])} style={styles.clearBtn}>
          <Text style={styles.clearBtnText}>Clear</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowCheckout(true)} style={styles.checkoutBtn}>
          <Text style={styles.checkoutBtnText}>Checkout — {total + delivery} birr</Text>
        </TouchableOpacity>
      </View>

      {/* Checkout Modal */}
      <Modal visible={showCheckout} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Complete Order</Text>
            <TouchableOpacity onPress={() => setShowCheckout(false)}>
              <Text style={styles.modalClose}>✕</Text>
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
            {[
              { key: 'name', placeholder: 'Full Name *', keyboardType: 'default' },
              { key: 'email', placeholder: 'Email *', keyboardType: 'email-address' },
              { key: 'phone', placeholder: 'Phone Number', keyboardType: 'phone-pad' },
              { key: 'address', placeholder: 'Delivery Address', keyboardType: 'default' },
            ].map(f => (
              <TextInput
                key={f.key}
                style={styles.input}
                placeholder={f.placeholder}
                placeholderTextColor={COLORS.textDim}
                value={(form as any)[f.key]}
                onChangeText={v => setForm(prev => ({ ...prev, [f.key]: v }))}
                keyboardType={f.keyboardType as any}
                autoCapitalize="none"
              />
            ))}

            <Text style={styles.sectionLabel}>Payment Method</Text>
            <View style={styles.paymentGrid}>
              {PAYMENT_METHODS.map(m => (
                <TouchableOpacity key={m} onPress={() => setPaymentMethod(m)} style={[styles.payBtn, paymentMethod === m && styles.payBtnActive]}>
                  <Text style={[styles.payBtnText, paymentMethod === m && styles.payBtnTextActive]}>{m}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {paymentMethod === 'Telebirr' && (
              <TextInput style={styles.input} placeholder="Telebirr Phone" placeholderTextColor={COLORS.textDim}
                value={form.telebirrPhone} onChangeText={v => setForm(p => ({ ...p, telebirrPhone: v }))} keyboardType="phone-pad" />
            )}
            {paymentMethod === 'CBE' && (
              <TextInput style={styles.input} placeholder="CBE Account Number" placeholderTextColor={COLORS.textDim}
                value={form.cbeAccount} onChangeText={v => setForm(p => ({ ...p, cbeAccount: v }))} />
            )}

            <View style={styles.orderSummaryBox}>
              <Text style={styles.orderSummaryTitle}>Order Summary</Text>
              {cart.map(i => (
                <View key={i.id} style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>{i.name} ×{i.quantity}</Text>
                  <Text style={styles.summaryValue}>{i.price * i.quantity} birr</Text>
                </View>
              ))}
              <View style={[styles.summaryRow, { borderTopWidth: 1, borderTopColor: COLORS.border, marginTop: 8, paddingTop: 8 }]}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>{total + delivery} birr</Text>
              </View>
            </View>

            <TouchableOpacity onPress={placeOrder} disabled={loading} style={[styles.placeOrderBtn, loading && { opacity: 0.6 }]}>
              {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.placeOrderText}>Place Order</Text>}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  empty: { flex: 1, backgroundColor: COLORS.bg, justifyContent: 'center', alignItems: 'center' },
  emptyIcon: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { color: COLORS.text, fontSize: 22, fontWeight: 'bold', marginBottom: 8 },
  emptySub: { color: COLORS.textMuted, fontSize: 15 },
  header: { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 16, backgroundColor: COLORS.surface },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: COLORS.primary },
  headerSub: { color: COLORS.textMuted, fontSize: 14 },
  list: { flex: 1 },
  item: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: 14, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: COLORS.border },
  itemInfo: { flex: 1 },
  itemName: { color: COLORS.text, fontWeight: '600', fontSize: 14, marginBottom: 4 },
  itemPrice: { color: COLORS.textMuted, fontSize: 12 },
  itemControls: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 10 },
  qtyBtn: { backgroundColor: COLORS.surfaceLight, width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  qtyBtnText: { color: COLORS.primary, fontSize: 18, fontWeight: 'bold', lineHeight: 22 },
  qty: { color: COLORS.text, fontSize: 16, fontWeight: 'bold', marginHorizontal: 8, minWidth: 20, textAlign: 'center' },
  itemRight: { alignItems: 'flex-end' },
  itemTotal: { color: COLORS.primary, fontWeight: 'bold', fontSize: 14, marginBottom: 6 },
  removeBtn: { color: COLORS.error, fontSize: 16 },
  summary: { backgroundColor: COLORS.surface, borderRadius: 16, padding: 16, marginTop: 8, borderWidth: 1, borderColor: COLORS.border },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  summaryLabel: { color: COLORS.textMuted, fontSize: 14 },
  summaryValue: { color: COLORS.text, fontSize: 14 },
  totalRow: { borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: 10, marginTop: 4 },
  totalLabel: { color: COLORS.text, fontSize: 16, fontWeight: 'bold' },
  totalValue: { color: COLORS.primary, fontSize: 18, fontWeight: 'bold' },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', gap: 12, padding: 16, backgroundColor: COLORS.surface, borderTopWidth: 1, borderTopColor: COLORS.border },
  clearBtn: { flex: 1, borderWidth: 1, borderColor: COLORS.error, borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  clearBtnText: { color: COLORS.error, fontWeight: 'bold', fontSize: 15 },
  checkoutBtn: { flex: 2, backgroundColor: COLORS.primary, borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  checkoutBtnText: { color: '#000', fontWeight: 'bold', fontSize: 15 },
  modal: { flex: 1, backgroundColor: COLORS.bg },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 60, backgroundColor: COLORS.surface, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  modalTitle: { color: COLORS.primary, fontSize: 20, fontWeight: 'bold' },
  modalClose: { color: COLORS.textMuted, fontSize: 22 },
  input: { backgroundColor: COLORS.surfaceLight, borderRadius: 12, padding: 14, color: COLORS.text, fontSize: 15, marginBottom: 12, borderWidth: 1, borderColor: COLORS.border },
  sectionLabel: { color: COLORS.textMuted, fontSize: 13, marginBottom: 10, marginTop: 4 },
  paymentGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  payBtn: { flex: 1, minWidth: '45%', borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, paddingVertical: 12, alignItems: 'center', backgroundColor: COLORS.surfaceLight },
  payBtnActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  payBtnText: { color: COLORS.textMuted, fontWeight: '600' },
  payBtnTextActive: { color: '#000' },
  orderSummaryBox: { backgroundColor: COLORS.surface, borderRadius: 14, padding: 16, marginVertical: 16, borderWidth: 1, borderColor: COLORS.border },
  orderSummaryTitle: { color: COLORS.primary, fontWeight: 'bold', fontSize: 15, marginBottom: 12 },
  placeOrderBtn: { backgroundColor: COLORS.primary, borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  placeOrderText: { color: '#000', fontWeight: 'bold', fontSize: 17 },
});
