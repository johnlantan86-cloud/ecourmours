<template>
  <div class="marketplace-container">
    <nav class="navbar">
      <div class="nav-content">
        <router-link to="/" class="logo">&#127978; Kigali Great Market</router-link>
        <div class="nav-links">
          <router-link to="/marketplace" class="nav-link">Marketplace</router-link>
          <router-link v-if="currentUser" :to="dashboardPath" class="nav-link">Dashboard</router-link>
          <button v-if="currentUser" @click="logout" class="btn btn-secondary">Logout</button>
          <template v-else>
            <router-link to="/buyer-register" class="nav-link">Register as Buyer</router-link>
            <router-link to="/seller-register" class="nav-link">Become a Seller</router-link>
            <router-link to="/login" class="nav-link">Login</router-link>
          </template>
        </div>
      </div>
    </nav>

    <main class="marketplace-content">
      <section class="search-section">
        <div class="search-heading">
          <div>
            <h2>Find Products Near You</h2>
            <p>{{ resultSummary }}</p>
          </div>
          <div v-if="buyerLocationLabel" class="buyer-location">
            <span>&#128205; {{ buyerLocationLabel }}</span>
            <small>{{ buyerLocationPrecision }}</small>
            <button
              v-if="currentUser?.type === 'buyer'"
              type="button"
              class="btn-location"
              @click="useBuyerCurrentPosition"
              :disabled="locatingBuyer"
            >
              {{ locatingBuyer ? 'Locating...' : 'Use Current Position' }}
            </button>
          </div>
        </div>

        <div class="search-controls">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search phones, food, clothes, electricity, beauty, home items..."
            class="search-input"
          />
          <label class="toggle-control">
            <input v-model="showAllRelated" type="checkbox" />
            <span>Show all related products</span>
          </label>
        </div>

        <div class="category-strip">
          <button
            v-for="category in visibleCategories"
            :key="category.slug"
            type="button"
            class="category-chip"
            :class="{ active: activeCategorySlug === category.slug }"
            @click="searchCategory(category)"
          >
            {{ category.label }}
          </button>
          <button v-if="searchQuery" type="button" class="category-chip clear-chip" @click="clearSearch">
            Clear
          </button>
        </div>
      </section>

      <section v-if="featuredSellers.length > 0" class="market-strip">
        <div class="strip-header">
          <h3>Featured Sellers</h3>
          <span>Top trust scores</span>
        </div>
        <div class="featured-grid">
          <router-link
            v-for="seller in featuredSellers"
            :key="seller.id"
            :to="{ name: 'SellerProfile', params: { id: seller.id } }"
            class="featured-card"
          >
            <div class="featured-stars">{{ starString(seller.trust.stars) }}</div>
            <strong>{{ seller.businessName }}</strong>
            <span>{{ seller.trust.percent }} trust</span>
            <small>{{ seller.distanceLabel }}</small>
          </router-link>
        </div>
      </section>

      <section v-if="popularProducts.length > 0" class="market-strip">
        <div class="strip-header">
          <h3>Popular Products</h3>
          <span>Location first, likes visible</span>
        </div>
        <div class="popular-grid">
          <router-link
            v-for="item in popularProducts"
            :key="`${item.sellerId}-${item.id}`"
            :to="{ name: 'SellerProfile', params: { id: item.sellerId } }"
            class="popular-card"
          >
            <img :src="item.image" :alt="item.name" />
            <div>
              <strong>{{ item.name }}</strong>
              <span>{{ item.sellerName }}</span>
              <small>&#10084; {{ productLikeCount(item) }} likes | {{ item.distanceLabel }}</small>
            </div>
          </router-link>
        </div>
      </section>

      <section class="sellers-container">
        <div v-if="rankedSellers.length > 0">
          <article
            v-for="seller in rankedSellers"
            :key="seller.id"
            class="seller-section"
            :class="{ featured: seller.trust.score >= 85 }"
          >
            <header class="seller-header">
              <div class="seller-info">
                <img v-if="seller.idphoto" :src="seller.idphoto" :alt="seller.businessName" class="seller-photo" />
                <div class="seller-details">
                  <div class="seller-title-row">
                    <h3>{{ seller.businessName }}</h3>
                    <span v-if="seller.trust.score >= 85" class="featured-badge">Featured</span>
                  </div>
                  <p class="location">&#128205; {{ seller.locationLabel }}</p>
                  <p class="contact">&#9742; {{ seller.phone }} | {{ seller.email }}</p>
                  <div class="seller-signals">
                    <span class="distance-pill">{{ seller.distanceLabel }}</span>
                    <span>{{ precisionLabel(seller) }}</span>
                    <span>&#128077; {{ seller.trust.good }}</span>
                    <span>&#128078; {{ seller.trust.bad }}</span>
                    <span>&#10084; {{ seller.trust.productLikes }}</span>
                  </div>
                </div>
              </div>

              <div class="seller-actions">
                <div class="trust-card">
                  <span class="stars">{{ starString(seller.trust.stars) }}</span>
                  <strong>{{ seller.trust.percent }}</strong>
                  <small>{{ seller.trust.grade }}</small>
                </div>
                <router-link
                  :to="{ name: 'SellerProfile', params: { id: seller.id } }"
                  class="btn btn-view-store"
                >
                  View Store
                </router-link>
              </div>
            </header>

            <div v-if="seller.matchedProducts.length > 0" class="products-preview">
              <div class="products-grid">
                <div
                  v-for="product in seller.matchedProducts"
                  :key="product.id"
                  class="product-card"
                  :class="{ popular: productLikeCount(product) >= 5 }"
                >
                  <div class="card-image">
                    <img :src="product.image" :alt="product.name" />
                    <span v-if="productLikeCount(product) >= 5" class="like-ribbon">Popular</span>
                  </div>
                  <div class="card-content">
                    <span class="category-tag">{{ product.category }}</span>
                    <h4>{{ product.name }}</h4>
                    <p class="description">{{ product.description }}</p>
                    <div class="price">${{ Number(product.price).toFixed(2) }}</div>
                    <div class="product-meta">
                      <span>&#10084; {{ productLikeCount(product) }}</span>
                      <span>&#128172; {{ productCommentCount(product) }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <p v-if="seller.totalMatchedProducts > seller.matchedProducts.length" class="more-products">
                +{{ seller.totalMatchedProducts - seller.matchedProducts.length }} related products
              </p>
            </div>

            <div v-else class="no-products">
              <p>No products listed yet</p>
            </div>
          </article>
        </div>

        <div v-else class="empty-state">
          <p>{{ searchQuery ? 'No nearby sellers matched that search' : 'No sellers registered yet' }}</p>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  CATEGORY_RULES,
  buildLocationMeta,
  buildSellerSearchResults,
  productCommentCount,
  productLikeCount,
  productPopularityScore,
  resolveLocation,
  starString
} from '../utils/marketIntelligence.js'

const router = useRouter()
const sellers = ref([])
const buyers = ref([])
const buyer = ref(null)
const productReports = ref([])
const searchQuery = ref('')
const showAllRelated = ref(false)
const currentUser = ref(null)
const locatingBuyer = ref(false)

const visibleCategories = CATEGORY_RULES.slice(0, 8)

onMounted(() => {
  currentUser.value = JSON.parse(localStorage.getItem('currentUser') || 'null')
  if (!currentUser.value) {
    router.push('/login')
    return
  }

  loadMarketData()
})

const loadMarketData = () => {
  sellers.value = JSON.parse(localStorage.getItem('sellers') || '[]')
  buyers.value = JSON.parse(localStorage.getItem('buyers') || '[]')
  productReports.value = JSON.parse(localStorage.getItem('productReports') || '[]')
  buyer.value = currentUser.value?.type === 'buyer'
    ? buyers.value.find((item) => item.id === currentUser.value.id) || null
    : null
}

const rankedSellers = computed(() => {
  return buildSellerSearchResults({
    sellers: sellers.value,
    buyer: buyer.value,
    buyers: buyers.value,
    productReports: productReports.value,
    query: searchQuery.value,
    includeAll: showAllRelated.value
  })
})

const allSellerResults = computed(() => {
  return buildSellerSearchResults({
    sellers: sellers.value,
    buyer: buyer.value,
    buyers: buyers.value,
    productReports: productReports.value,
    query: '',
    includeAll: false
  })
})

const featuredSellers = computed(() => {
  return [...allSellerResults.value]
    .sort((a, b) => {
      if (b.trust.score !== a.trust.score) return b.trust.score - a.trust.score
      return (a.distanceKm ?? Number.POSITIVE_INFINITY) - (b.distanceKm ?? Number.POSITIVE_INFINITY)
    })
    .slice(0, 5)
})

const popularProducts = computed(() => {
  const sourceSellers = rankedSellers.value.length ? rankedSellers.value : allSellerResults.value
  return sourceSellers
    .flatMap((seller) => {
      return seller.products.map((product) => ({
        ...product,
        sellerId: seller.id,
        sellerName: seller.businessName,
        distanceKm: seller.distanceKm,
        distanceLabel: seller.distanceLabel
      }))
    })
    .sort((a, b) => {
      const aDistance = a.distanceKm ?? Number.POSITIVE_INFINITY
      const bDistance = b.distanceKm ?? Number.POSITIVE_INFINITY
      if (Math.abs(aDistance - bDistance) > 0.25) return aDistance - bDistance
      return productPopularityScore(b) - productPopularityScore(a)
    })
    .slice(0, 6)
})

const buyerLocation = computed(() => (buyer.value ? resolveLocation(buyer.value.locationMeta || buyer.value) : null))
const buyerLocationLabel = computed(() => buyerLocation.value?.summary || buyer.value?.location || '')
const buyerLocationPrecision = computed(() => buyerLocation.value ? `Location precision: ${buyerLocation.value.precision}` : '')

const activeCategorySlug = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  return CATEGORY_RULES.find((category) => category.label.toLowerCase() === query)?.slug || ''
})

const resultSummary = computed(() => {
  if (!searchQuery.value.trim()) return `${rankedSellers.value.length} sellers sorted by nearby location`
  return `${rankedSellers.value.length} seller matches for "${searchQuery.value.trim()}"`
})

const searchCategory = (category) => {
  searchQuery.value = category.label
}

const clearSearch = () => {
  searchQuery.value = ''
}

const precisionLabel = (seller) => {
  const precision = seller.resolvedLocation?.precision || seller.locationMeta?.precision || 'estimate'
  return precision.replace(/-/g, ' ')
}

const useBuyerCurrentPosition = () => {
  if (!buyer.value) return
  if (!navigator.geolocation) {
    alert('Current position is not available in this browser.')
    return
  }

  locatingBuyer.value = true
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const updatedBuyer = {
        ...buyer.value,
        locationMeta: buildLocationMeta({
          ...(buyer.value.locationMeta || {}),
          location: buyer.value.location,
          latitude: Number(position.coords.latitude.toFixed(6)),
          longitude: Number(position.coords.longitude.toFixed(6))
        })
      }
      buyer.value = {
        ...updatedBuyer,
        location: updatedBuyer.locationMeta.location
      }

      const buyerIndex = buyers.value.findIndex((item) => item.id === buyer.value.id)
      if (buyerIndex !== -1) {
        buyers.value[buyerIndex] = buyer.value
        localStorage.setItem('buyers', JSON.stringify(buyers.value))
      }
      locatingBuyer.value = false
    },
    () => {
      locatingBuyer.value = false
      alert('Could not get your current position. Your saved location will still be used.')
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
  )
}

const dashboardPath = computed(() => {
  if (currentUser.value?.type === 'seller') return '/seller-dashboard'
  if (currentUser.value?.type === 'admin') return '/admin-dashboard'
  return '/buyer-dashboard'
})

const logout = () => {
  localStorage.removeItem('currentUser')
  router.push('/')
}
</script>

<style scoped>
.marketplace-container {
  min-height: 100vh;
  background: #f5f7fa;
}

.navbar {
  background: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  padding: 1rem 2rem;
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-content {
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  max-width: 1240px;
}

.logo {
  color: #2c3e50;
  font-size: 1.4rem;
  font-weight: 700;
  text-decoration: none;
}

.nav-links {
  align-items: center;
  display: flex;
  gap: 1rem;
}

.nav-link {
  color: #34495e;
  font-weight: 700;
  text-decoration: none;
}

.nav-link:hover {
  color: #c0392b;
}

.marketplace-content {
  margin: 0 auto;
  max-width: 1240px;
  padding: 1.5rem;
}

.search-section,
.market-strip,
.seller-section,
.empty-state {
  background: white;
  border: 1px solid #e6e9ed;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(21, 34, 50, 0.06);
}

.search-section {
  display: grid;
  gap: 1.25rem;
  margin-bottom: 1.5rem;
  padding: 1.5rem;
}

.search-heading {
  align-items: start;
  display: flex;
  gap: 1rem;
  justify-content: space-between;
}

.search-heading h2 {
  color: #253445;
  font-size: 1.65rem;
  margin: 0 0 0.35rem;
}

.search-heading p,
.strip-header span,
.buyer-location small {
  color: #6b7280;
}

.buyer-location {
  align-items: flex-end;
  display: grid;
  gap: 0.3rem;
  justify-items: end;
  text-align: right;
}

.buyer-location span {
  color: #253445;
  font-weight: 800;
}

.search-controls {
  align-items: center;
  display: grid;
  gap: 1rem;
  grid-template-columns: minmax(0, 1fr) auto;
}

.search-input {
  border: 2px solid #d8dee6;
  border-radius: 8px;
  box-sizing: border-box;
  font-size: 1rem;
  padding: 0.95rem 1rem;
  width: 100%;
}

.search-input:focus {
  border-color: #e74c3c;
  outline: none;
}

.toggle-control {
  align-items: center;
  background: #f8f9fa;
  border: 1px solid #e6e9ed;
  border-radius: 8px;
  color: #253445;
  display: inline-flex;
  gap: 0.5rem;
  font-weight: 700;
  padding: 0.85rem 1rem;
}

.category-strip {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}

.category-chip {
  background: #fff;
  border: 1px solid #d8dee6;
  border-radius: 999px;
  color: #34495e;
  cursor: pointer;
  font-weight: 700;
  padding: 0.55rem 0.8rem;
}

.category-chip.active,
.category-chip:hover {
  background: #fdecea;
  border-color: #e74c3c;
  color: #c0392b;
}

.clear-chip {
  border-color: #95a5a6;
}

.market-strip {
  margin-bottom: 1.5rem;
  padding: 1rem;
}

.strip-header {
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.9rem;
}

.strip-header h3 {
  color: #253445;
  margin: 0;
}

.featured-grid,
.popular-grid {
  display: grid;
  gap: 0.85rem;
}

.featured-grid {
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
}

.popular-grid {
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
}

.featured-card,
.popular-card {
  border: 1px solid #e6e9ed;
  border-radius: 8px;
  color: inherit;
  text-decoration: none;
}

.featured-card {
  display: grid;
  gap: 0.25rem;
  padding: 0.85rem;
}

.featured-stars,
.stars {
  color: #d6a400;
  font-weight: 900;
  letter-spacing: 0;
}

.featured-card strong,
.popular-card strong {
  color: #253445;
}

.featured-card span,
.popular-card span,
.featured-card small,
.popular-card small {
  color: #6b7280;
}

.popular-card {
  align-items: center;
  display: grid;
  gap: 0.85rem;
  grid-template-columns: 76px 1fr;
  padding: 0.75rem;
}

.popular-card img {
  background: #edf0f4;
  border-radius: 6px;
  height: 76px;
  object-fit: cover;
  width: 76px;
}

.popular-card div {
  display: grid;
  gap: 0.2rem;
}

.sellers-container {
  display: grid;
  gap: 1.25rem;
}

.seller-section {
  padding: 1.25rem;
  transition: transform 0.2s, box-shadow 0.2s;
}

.seller-section.featured {
  border-color: #e7c04b;
}

.seller-section:hover {
  box-shadow: 0 8px 18px rgba(21, 34, 50, 0.1);
  transform: translateY(-2px);
}

.seller-header {
  align-items: start;
  border-bottom: 1px solid #edf0f4;
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  margin-bottom: 1.25rem;
  padding-bottom: 1.25rem;
}

.seller-info {
  display: flex;
  flex: 1;
  gap: 1rem;
  min-width: 0;
}

.seller-photo {
  border: 3px solid #e74c3c;
  border-radius: 8px;
  height: 112px;
  object-fit: cover;
  width: 112px;
}

.seller-details {
  min-width: 0;
}

.seller-title-row {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.seller-details h3 {
  color: #253445;
  font-size: 1.25rem;
  margin: 0;
}

.featured-badge {
  background: #fff8dc;
  border: 1px solid #e7c04b;
  border-radius: 999px;
  color: #8a6d12;
  font-size: 0.75rem;
  font-weight: 900;
  padding: 0.25rem 0.55rem;
}

.seller-details p {
  color: #596273;
  margin: 0.35rem 0;
}

.seller-signals {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  margin-top: 0.7rem;
}

.seller-signals span {
  background: #f8f9fa;
  border: 1px solid #e6e9ed;
  border-radius: 999px;
  color: #253445;
  font-size: 0.82rem;
  font-weight: 800;
  padding: 0.35rem 0.55rem;
}

.distance-pill {
  border-color: #b7d7f2 !important;
  color: #2471a3 !important;
}

.seller-actions {
  align-items: end;
  display: grid;
  gap: 0.75rem;
  justify-items: end;
}

.trust-card {
  align-items: center;
  background: #fffdf2;
  border: 1px solid #eadb8d;
  border-radius: 8px;
  display: grid;
  gap: 0.15rem;
  justify-items: end;
  min-width: 150px;
  padding: 0.75rem;
}

.trust-card strong {
  color: #253445;
  font-size: 1.35rem;
}

.trust-card small {
  color: #77620c;
  font-weight: 700;
}

.btn,
.btn-location {
  border: none;
  border-radius: 6px;
  cursor: pointer;
  display: inline-block;
  font-weight: 800;
  text-decoration: none;
  transition: all 0.2s;
}

.btn-view-store {
  background: #e74c3c;
  color: white;
  padding: 0.75rem 1rem;
}

.btn-view-store:hover {
  background: #c0392b;
}

.btn-secondary {
  background: #95a5a6;
  color: white;
  padding: 0.5rem 1rem;
}

.btn-secondary:hover {
  background: #7f8c8d;
}

.btn-location {
  background: #fff;
  border: 1px solid #e74c3c;
  color: #c0392b;
  padding: 0.55rem 0.75rem;
}

.btn-location:disabled {
  cursor: wait;
  opacity: 0.7;
}

.products-preview {
  display: grid;
  gap: 0.75rem;
}

.products-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
}

.product-card {
  border: 1px solid #dce2ea;
  border-radius: 8px;
  overflow: hidden;
}

.product-card.popular {
  border-color: #e7c04b;
}

.card-image {
  background: #edf0f4;
  height: 150px;
  overflow: hidden;
  position: relative;
  width: 100%;
}

.card-image img {
  height: 100%;
  object-fit: cover;
  width: 100%;
}

.like-ribbon {
  background: #fff8dc;
  border: 1px solid #e7c04b;
  border-radius: 999px;
  color: #8a6d12;
  font-size: 0.75rem;
  font-weight: 900;
  padding: 0.25rem 0.5rem;
  position: absolute;
  right: 0.5rem;
  top: 0.5rem;
}

.card-content {
  display: grid;
  gap: 0.35rem;
  padding: 0.9rem;
}

.category-tag {
  background: #edf6fd;
  border: 1px solid #aed6f1;
  border-radius: 999px;
  color: #2471a3;
  display: inline-flex;
  font-size: 0.76rem;
  font-weight: 800;
  padding: 0.25rem 0.5rem;
  width: fit-content;
}

.card-content h4 {
  color: #253445;
  font-size: 1rem;
  margin: 0;
}

.description {
  color: #6b7280;
  font-size: 0.88rem;
  line-height: 1.35;
  max-height: 2.4rem;
  overflow: hidden;
}

.price {
  color: #c0392b;
  font-size: 1.1rem;
  font-weight: 900;
}

.product-meta {
  color: #596273;
  display: flex;
  gap: 0.75rem;
  font-size: 0.85rem;
  font-weight: 800;
}

.more-products,
.no-products,
.empty-state {
  color: #6b7280;
  text-align: center;
}

.more-products {
  font-weight: 800;
}

.no-products {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
}

.empty-state {
  padding: 3rem 1rem;
}

@media (max-width: 820px) {
  .nav-content,
  .search-heading,
  .seller-header {
    align-items: stretch;
    flex-direction: column;
  }

  .nav-links,
  .search-controls {
    grid-template-columns: 1fr;
  }

  .nav-links {
    flex-wrap: wrap;
  }

  .buyer-location,
  .seller-actions,
  .trust-card {
    justify-items: start;
    text-align: left;
  }

  .seller-info {
    flex-direction: column;
  }

  .seller-photo {
    height: 96px;
    width: 96px;
  }
}
</style>
