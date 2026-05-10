import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Image,
  StyleSheet, TextInput, ActivityIndicator, RefreshControl, Alert,
} from 'react-native';
import { COLORS } from '../../constants/theme';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

interface Product {
  _id: string; name: string; price: number; category: string;
  description?: string; image?: string; rating?: number; stock?: number; featured?: boolean;
}

const CATEGORIES = ['All', 'Coffee Beans', 'Brewing Equipment', 'Accessories', 'Additives', 'Beverage', 'Subscription'];

export default function ShopScreen() {
  const { addToCart, getCount } = useCart();
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const load = async () => {
    try {
      const res = await api.get('/api/coffees');
      const list: Product[] = res.coffees || res || [];
      setProducts(list);
      setFiltered(list);
    } catch (e) {
      Alert.alert('Error', 'Could not load products. Is the server running?');
    } finally { setLoading(false); setRefreshing(false); }
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    let list = products;
    if (category !== 'All') list = list.filter(p => p.category === category);
    if (search.trim()) list = list.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    setFiltered(list);
  }, [search, category, products]);

  const handleAdd = (product: Product) => {
    addToCart({ id: product._id, name: product.name, price: product.price, image: product.image });
    Alert.alert('Added!', `${product.name} added to cart ☕`);
  };

  if (loading) return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color={COLORS.primary} />
      <Text style={styles.loadingText}>Loading products...</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Black & Brown</Text>
          <Text style={styles.headerSub}>Coffee Shop ☕</Text>
        </View>
        <View style={styles.cartBadgeWrap}>
          <Text style={styles.cartIcon}>🛒</Text>
          {getCount() > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{getCount()}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <TextInput
          style={styles.search}
          placeholder="Search products..."
          placeholderTextColor={COLORS.textDim}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Categories */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll} contentContainerStyle={{ paddingHorizontal: 16 }}>
        {CATEGORIES.map(cat => (
          <TouchableOpacity
            key={cat}
            onPress={() => setCategory(cat)}
            style={[styles.catBtn, category === cat && styles.catBtnActive]}
          >
            <Text style={[styles.catText, category === cat && styles.catTextActive]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Products */}
      <ScrollView
        style={styles.list}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor={COLORS.primary} />}
      >
        {filtered.length === 0 ? (
          <View style={styles.center}>
            <Text style={styles.emptyText}>No products found</Text>
          </View>
        ) : (
          <View style={styles.grid}>
            {filtered.map(product => (
              <View key={product._id} style={styles.card}>
                <Image
                  source={{ uri: product.image?.startsWith('http') ? product.image : `http://localhost:5000/${product.image}` }}
                  style={styles.cardImg}
                  defaultSource={require('../../assets/images/icon.png')}
                />
                {product.featured && (
                  <View style={styles.featuredBadge}>
                    <Text style={styles.featuredText}>★ Featured</Text>
                  </View>
                )}
                <View style={styles.cardBody}>
                  <Text style={styles.cardName} numberOfLines={2}>{product.name}</Text>
                  <Text style={styles.cardCat}>{product.category}</Text>
                  {product.rating ? (
                    <Text style={styles.cardRating}>{'★'.repeat(Math.round(product.rating))} {product.rating}</Text>
                  ) : null}
                  <View style={styles.cardFooter}>
                    <View>
                      <Text style={styles.cardPrice}>{product.price} birr</Text>
                      <Text style={[styles.cardStock, { color: (product.stock ?? 0) > 10 ? COLORS.success : (product.stock ?? 0) > 0 ? COLORS.warning : COLORS.error }]}>
                        {(product.stock ?? 0) > 10 ? 'In Stock' : (product.stock ?? 0) > 0 ? 'Low Stock' : 'Out of Stock'}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={[styles.addBtn, (product.stock ?? 0) === 0 && styles.addBtnDisabled]}
                      onPress={() => handleAdd(product)}
                      disabled={(product.stock ?? 0) === 0}
                    >
                      <Text style={styles.addBtnText}>Add</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 60 },
  loadingText: { color: COLORS.primary, marginTop: 12, fontSize: 16 },
  emptyText: { color: COLORS.textMuted, fontSize: 16, textAlign: 'center', marginTop: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 16, backgroundColor: COLORS.surface },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: COLORS.primary },
  headerSub: { fontSize: 13, color: COLORS.textMuted },
  cartBadgeWrap: { position: 'relative' },
  cartIcon: { fontSize: 28 },
  badge: { position: 'absolute', top: -6, right: -6, backgroundColor: COLORS.primary, borderRadius: 10, width: 20, height: 20, justifyContent: 'center', alignItems: 'center' },
  badgeText: { color: '#000', fontSize: 11, fontWeight: 'bold' },
  searchWrap: { paddingHorizontal: 16, paddingVertical: 10, backgroundColor: COLORS.surface },
  search: { backgroundColor: COLORS.surfaceLight, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 10, color: COLORS.text, fontSize: 14, borderWidth: 1, borderColor: COLORS.border },
  catScroll: { backgroundColor: COLORS.surface, paddingVertical: 8, maxHeight: 52 },
  catBtn: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: COLORS.border, marginRight: 8, backgroundColor: COLORS.bg },
  catBtnActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  catText: { color: COLORS.textMuted, fontSize: 13 },
  catTextActive: { color: '#000', fontWeight: 'bold' },
  list: { flex: 1 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  card: { width: '47%', backgroundColor: COLORS.surface, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: COLORS.border },
  cardImg: { width: '100%', height: 130, backgroundColor: COLORS.surfaceLight },
  featuredBadge: { position: 'absolute', top: 8, right: 8, backgroundColor: COLORS.primary, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3 },
  featuredText: { color: '#000', fontSize: 10, fontWeight: 'bold' },
  cardBody: { padding: 10 },
  cardName: { color: COLORS.primary, fontWeight: 'bold', fontSize: 13, marginBottom: 2 },
  cardCat: { color: COLORS.textDim, fontSize: 11, marginBottom: 4 },
  cardRating: { color: COLORS.warning, fontSize: 11, marginBottom: 6 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  cardPrice: { color: COLORS.primary, fontWeight: 'bold', fontSize: 14 },
  cardStock: { fontSize: 10, marginTop: 2 },
  addBtn: { backgroundColor: COLORS.primary, paddingHorizontal: 14, paddingVertical: 7, borderRadius: 10 },
  addBtnDisabled: { backgroundColor: COLORS.border },
  addBtnText: { color: '#000', fontWeight: 'bold', fontSize: 13 },
});
