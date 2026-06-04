<template>
  <div class="marketplace-page">
    <nav class="market-nav">
      <router-link to="/" class="brand">
        <span>KGM</span>
        <strong>Kigali Great Market</strong>
      </router-link>

      <div class="nav-links">
        <router-link to="/" class="nav-link">Home</router-link>
        <router-link to="/marketplace" class="nav-link active">All Sellers</router-link>
        <router-link v-if="currentUser" :to="dashboardPath" class="nav-link">Dashboard</router-link>
        <button v-if="currentUser" @click="logout" class="btn btn-secondary nav-button">Logout</button>
        <template v-else>
          <router-link to="/buyer-register" class="nav-link">Buyer</router-link>
          <router-link to="/seller-register" class="nav-link">Seller</router-link>
          <router-link to="/login" class="nav-link">Login</router-link>
        </template>
      </div>
    </nav>

    <main class="marketplace-content">
      <header class="marketplace-hero">
        <div>
          <span class="section-kicker">Marketplace</span>
          <h1>Browse sellers and product previews</h1>
          <p>Search by seller name or location, then open a store to see full products, ratings, comments, and contact details.</p>
        </div>
        <div class="search-box">
          <label for="sellerSearch">Search</label>
          <input
            id="sellerSearch"
            v-model="searchQuery"
            type="text"
            placeholder="Business name or location"
            class="search-input"
          />
        </div>
      </header>

      <section class="market-stats">
        <div>
          <strong>{{ sellers.length }}</strong>
          <span>registered sellers</span>
        </div>
        <div>
          <strong>{{ filteredSellers.length }}</strong>
          <span>matching results</span>
        </div>
        <div>
          <strong>{{ totalProductCount }}</strong>
          <span>listed products</span>
        </div>
      </section>

      <section class="sellers-container">
        <article v-for="seller in filteredSellers" :key="seller.id" class="seller-card">
          <div class="seller-summary">
            <div class="seller-info">
              <img v-if="seller.idphoto" :src="seller.idphoto" :alt="seller.businessName" class="seller-photo" />
              <div v-else class="seller-photo-placeholder">
                {{ seller.businessName?.charAt(0)?.toUpperCase() || 'S' }}
              </div>

              <div class="seller-details">
                <div class="seller-title-row">
                  <h2>{{ seller.businessName }}</h2>
                  <span class="trust-badge">Trust {{ sellerTrustScore(seller) }}%</span>
                </div>
                <p>{{ seller.location }}</p>
                <p>{{ seller.phone }} | {{ seller.email }}</p>
                <div class="seller-signals">
                  <span>Good {{ sellerGoodCount(seller) }}</span>
                  <span>Bad {{ sellerBadCount(seller) }}</span>
                  <span>Comments {{ sellerCommentCount(seller) }}</span>
                  <span>Likes {{ sellerProductLikeTotal(seller) }}</span>
                </div>
              </div>
            </div>

            <router-link
              :to="{ name: 'SellerProfile', params: { id: seller.id } }"
              class="btn btn-view-store"
            >
              View Store
            </router-link>
          </div>

          <div v-if="seller.products && seller.products.length > 0" class="products-preview">
            <div class="products-grid">
              <div
                v-for="product in seller.products.slice(0, 4)"
                :key="product.id"
                class="product-card"
              >
                <div class="card-image">
                  <img :src="product.image" :alt="product.name" />
                </div>
                <div class="card-content">
                  <h3>{{ product.name }}</h3>
                  <p class="description">{{ product.description || 'No description yet.' }}</p>
                  <div class="price-row">
                    <strong>${{ product.price.toFixed(2) }}</strong>
                    <span>{{ productLikeCount(product) }} likes</span>
                  </div>
                  <span class="comment-count">Comments {{ productCommentCount(product) }}</span>
                </div>
              </div>
            </div>
            <p v-if="seller.products.length > 4" class="more-products">
              +{{ seller.products.length - 4 }} more products in this store
            </p>
          </div>

          <div v-else class="no-products">
            <p>No products listed yet.</p>
          </div>
        </article>

        <div v-if="filteredSellers.length === 0" class="empty-state">
          <p>{{ searchQuery ? 'No sellers found matching your search.' : 'No sellers registered yet.' }}</p>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { clearSession, sellersApi } from '../api.js'

const router = useRouter()
const sellers = ref([])
const searchQuery = ref('')
const currentUser = ref(null)

onMounted(() => {
  currentUser.value = JSON.parse(localStorage.getItem('currentUser') || 'null')
  if (!currentUser.value) {
    router.push('/login')
    return
  }

  loadSellers()
})

const loadSellers = async () => {
  try {
    const data = await sellersApi.list()
    sellers.value = data.sellers
  } catch (error) {
    alert(error.message)
  }
}

const filteredSellers = computed(() => {
  if (!searchQuery.value.trim()) {
    return sellers.value
  }

  const query = searchQuery.value.toLowerCase()
  return sellers.value.filter(seller =>
    seller.businessName.toLowerCase().includes(query) ||
    seller.location.toLowerCase().includes(query)
  )
})

const totalProductCount = computed(() => {
  return sellers.value.reduce((total, seller) => total + (seller.products || []).length, 0)
})

const sellerGoodCount = (seller) => {
  return (seller.reactions?.good || []).length
}

const sellerBadCount = (seller) => {
  return (seller.reactions?.bad || []).length
}

const sellerCommentCount = (seller) => {
  return (seller.comments || []).length
}

const sellerProductLikeTotal = (seller) => {
  return (seller.products || []).reduce((total, product) => total + (product.likes || []).length, 0)
}

const sellerTrustScore = (seller) => {
  const score = 72
    + sellerGoodCount(seller) * 5
    + (seller.favoriteCount || 0) * 2
    + sellerProductLikeTotal(seller)
    - sellerBadCount(seller) * 6

  return Math.max(45, Math.min(98, score))
}

const productLikeCount = (product) => {
  return (product.likes || []).length
}

const productCommentCount = (product) => {
  return (product.comments || []).length
}

const dashboardPath = computed(() => {
  if (currentUser.value?.type === 'seller') return '/seller-dashboard'
  if (currentUser.value?.type === 'admin') return '/admin-dashboard'
  return '/buyer-dashboard'
})

const logout = () => {
  clearSession()
  router.push('/')
}
</script>

<style scoped>
.marketplace-page {
  background: var(--page);
  min-height: 100vh;
}

.market-nav {
  align-items: center;
  background: rgba(255, 255, 255, 0.96);
  border-bottom: 1px solid var(--line);
  display: flex;
  justify-content: space-between;
  padding: 0.85rem clamp(1rem, 4vw, 2rem);
  position: sticky;
  top: 0;
  z-index: 20;
}

.brand {
  align-items: center;
  color: var(--ink);
  display: inline-flex;
  gap: 0.7rem;
  text-decoration: none;
}

.brand span {
  align-items: center;
  background: var(--ink);
  border-radius: 8px;
  color: #ffffff;
  display: inline-flex;
  font-size: 0.72rem;
  font-weight: 850;
  height: 2.25rem;
  justify-content: center;
  width: 2.25rem;
}

.nav-button {
  min-height: 2.1rem;
  padding-inline: 0.8rem;
}

.marketplace-content {
  display: grid;
  gap: 1rem;
  margin: 0 auto;
  max-width: 1240px;
  padding: clamp(1rem, 3vw, 2rem);
}

.marketplace-hero {
  align-items: end;
  background: #111827;
  border-radius: 8px;
  display: grid;
  gap: 1.5rem;
  grid-template-columns: minmax(0, 1fr) minmax(280px, 420px);
  padding: clamp(1.25rem, 4vw, 2rem);
}

.marketplace-hero h1 {
  color: #ffffff;
  font-size: 3rem;
  line-height: 1.05;
  margin-top: 0.35rem;
}

.marketplace-hero p {
  color: rgba(255, 255, 255, 0.72);
  margin-top: 0.7rem;
  max-width: 680px;
}

.search-box {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 8px;
  display: grid;
  gap: 0.4rem;
  padding: 1rem;
}

.search-box label {
  color: rgba(255, 255, 255, 0.78);
  font-size: 0.82rem;
  font-weight: 800;
}

.search-input {
  background: #ffffff;
  border: 1px solid transparent;
  border-radius: 6px;
  color: var(--ink);
  padding: 0.75rem 0.85rem;
  width: 100%;
}

.search-input:focus {
  border-color: var(--accent);
  outline: none;
}

.market-stats {
  display: grid;
  gap: 0.85rem;
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.market-stats div {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 1rem;
}

.market-stats strong,
.market-stats span {
  display: block;
}

.market-stats strong {
  color: var(--ink);
  font-size: 1.6rem;
  line-height: 1;
}

.market-stats span {
  color: var(--muted);
  font-size: 0.82rem;
  font-weight: 750;
  margin-top: 0.35rem;
}

.sellers-container {
  display: grid;
  gap: 1rem;
}

.seller-card {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 8px;
  box-shadow: var(--shadow-sm);
  padding: 1rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
}

.seller-card:hover {
  border-color: rgba(194, 65, 12, 0.34);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.seller-summary {
  align-items: start;
  display: flex;
  gap: 1rem;
  justify-content: space-between;
}

.seller-info {
  display: flex;
  flex: 1;
  gap: 1rem;
  min-width: 0;
}

.seller-photo,
.seller-photo-placeholder {
  border-radius: 8px;
  flex: 0 0 auto;
  height: 94px;
  width: 94px;
}

.seller-photo {
  object-fit: cover;
}

.seller-photo-placeholder {
  align-items: center;
  background: #e2e8f0;
  color: var(--muted);
  display: flex;
  font-size: 2rem;
  font-weight: 850;
  justify-content: center;
}

.seller-details {
  min-width: 0;
}

.seller-title-row {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
}

.seller-title-row h2 {
  font-size: 1.25rem;
}

.trust-badge {
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: 6px;
  color: var(--gold);
  font-size: 0.78rem;
  font-weight: 850;
  padding: 0.28rem 0.55rem;
}

.seller-details p {
  color: var(--muted);
  font-size: 0.9rem;
  margin-top: 0.2rem;
}

.seller-signals {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: 0.7rem;
}

.seller-signals span {
  background: var(--surface-soft);
  border: 1px solid var(--line);
  border-radius: 6px;
  color: var(--ink);
  font-size: 0.78rem;
  font-weight: 800;
  padding: 0.3rem 0.5rem;
}

.btn-view-store {
  background: var(--accent);
  color: white;
  white-space: nowrap;
}

.btn-view-store:hover {
  background: var(--accent-strong);
}

.products-preview {
  border-top: 1px solid var(--line);
  margin-top: 1rem;
  padding-top: 1rem;
}

.products-grid {
  display: grid;
  gap: 0.85rem;
  grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
}

.product-card {
  border: 1px solid var(--line);
  border-radius: 8px;
  overflow: hidden;
}

.card-image {
  background: #e2e8f0;
  height: 130px;
  overflow: hidden;
}

.card-image img {
  height: 100%;
  object-fit: cover;
  width: 100%;
}

.card-content {
  display: grid;
  gap: 0.35rem;
  padding: 0.75rem;
}

.card-content h3 {
  font-size: 0.95rem;
}

.description {
  display: -webkit-box;
  font-size: 0.82rem;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.price-row {
  align-items: center;
  display: flex;
  gap: 0.5rem;
  justify-content: space-between;
}

.price-row strong {
  color: var(--accent);
}

.price-row span,
.comment-count {
  color: var(--muted);
  font-size: 0.78rem;
  font-weight: 800;
}

.more-products {
  color: var(--accent);
  font-size: 0.88rem;
  font-weight: 800;
  margin-top: 0.8rem;
}

.no-products {
  background: var(--surface-soft);
  border: 1px dashed var(--line-strong);
  border-radius: 8px;
  margin-top: 1rem;
  padding: 1rem;
  text-align: center;
}

@media (max-width: 880px) {
  .marketplace-hero h1 {
    font-size: 2.2rem;
  }

  .market-nav,
  .seller-summary {
    align-items: flex-start;
    flex-direction: column;
  }

  .marketplace-hero,
  .market-stats {
    grid-template-columns: 1fr;
  }

  .nav-links {
    flex-wrap: wrap;
  }
}

@media (max-width: 560px) {
  .seller-info {
    flex-direction: column;
  }

  .seller-photo,
  .seller-photo-placeholder {
    height: 82px;
    width: 82px;
  }
}
</style>
