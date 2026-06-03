<template>
  <div class="seller-profile-container">
    <nav class="navbar">
      <div class="nav-content">
        <router-link to="/" class="logo">🏪 Kigali Great Market</router-link>
        <router-link to="/marketplace" class="back-link">← Back to Marketplace</router-link>
        <router-link v-if="currentUser" :to="dashboardPath" class="back-link">Dashboard</router-link>
        <button v-if="currentUser" @click="logout" class="btn btn-secondary nav-button">Logout</button>
      </div>
    </nav>

    <div v-if="seller" class="profile-content">
      <div class="seller-header">
        <img v-if="seller.idphoto" :src="seller.idphoto" :alt="seller.businessName" class="seller-photo" />
        <div class="seller-info">
          <h1>{{ seller.businessName }}</h1>
          <p class="owner-name">Owner: {{ seller.name }}</p>
          <div class="profile-stats">
            <div class="stat-pill trust-pill">
              <strong>{{ sellerTrust.percent }}</strong>
              <span class="trust-stars">{{ starString(sellerTrust.stars) }} trust</span>
            </div>
            <div class="stat-pill">
              <strong>{{ sellerWishlistCount }}</strong>
              <span>product wishlists</span>
            </div>
            <div class="stat-pill">
              <strong>{{ sellerFavoriteCount }}</strong>
              <span>buyer favorites</span>
            </div>
            <div class="stat-pill">
              <strong>&#128077; {{ sellerGoodCount }}</strong>
              <span>good ratings</span>
            </div>
            <div class="stat-pill">
              <strong>&#128078; {{ sellerBadCount }}</strong>
              <span>bad ratings</span>
            </div>
            <div class="stat-pill">
              <strong>&#128172; {{ sellerComments.length }}</strong>
              <span>comments</span>
            </div>
          </div>
          <div class="details">
            <p>&#128205; {{ sellerLocationLabel }}</p>
            <p>{{ sellerLocationPrecision }}</p>
            <p>📞 {{ seller.phone }}</p>
            <p>✉️ {{ seller.email }}</p>
            <p class="id-info">ID: {{ seller.idnumber }}</p>
          </div>
          <button
            v-if="currentUser?.type === 'buyer'"
            class="btn btn-favorite"
            @click="toggleFavoriteSeller"
          >
            {{ isFavoriteSeller ? 'Remove from Favorite Sellers' : 'Add Seller to Favorites' }}
          </button>
        </div>
      </div>

      <div class="feedback-section">
        <div class="feedback-header">
          <div>
            <h2>Seller Ratings & Comments</h2>
            <p>See what buyers say about {{ seller.businessName }}.</p>
          </div>
          <div class="rating-summary">
            <span>&#128077; {{ sellerGoodCount }}</span>
            <span>&#128078; {{ sellerBadCount }}</span>
            <span>&#128172; {{ sellerComments.length }}</span>
          </div>
        </div>

        <div v-if="currentUser?.type === 'buyer'" class="buyer-feedback-tools">
          <div class="rating-actions">
            <button
              class="btn btn-good"
              :class="{ active: buyerSellerRating === 'good' }"
              @click="rateSeller('good')"
            >
              &#128077; Good seller
            </button>
            <button
              class="btn btn-bad"
              :class="{ active: buyerSellerRating === 'bad' }"
              @click="rateSeller('bad')"
            >
              &#128078; Bad seller
            </button>
          </div>

          <form class="comment-form" @submit.prevent="addSellerComment">
            <textarea
              v-model="newComment"
              rows="3"
              maxlength="240"
              placeholder="Write a comment about this seller..."
            ></textarea>
            <button type="submit" class="btn btn-comment">&#128172; Post Comment</button>
          </form>
        </div>

        <div v-if="sellerComments.length > 0" class="comments-list">
          <div v-for="comment in sellerComments" :key="comment.id" class="comment-item">
            <div class="comment-meta">
              <strong>{{ comment.buyerName }}</strong>
              <span>{{ formatDate(comment.createdAt) }}</span>
            </div>
            <p>{{ comment.text }}</p>
          </div>
        </div>
        <div v-else class="mini-empty">
          <p>No comments yet. Buyers can be the first to share their experience.</p>
        </div>
      </div>

      <!-- Products Section -->
      <div class="products-section">
        <h2>Products from {{ seller.businessName }}</h2>
        
        <div v-if="rankedProducts.length > 0" class="products-grid">
          <div v-for="product in rankedProducts" :key="product.id" class="product-card">
            <div class="card-image">
              <img :src="product.image" :alt="product.name" />
            </div>
            <div class="card-content">
              <span class="category-tag">{{ product.category }}</span>
              <h3>{{ product.name }}</h3>
              <p v-if="product.description" class="description">{{ product.description }}</p>
              <div class="price">${{ product.price.toFixed(2) }}</div>
              <div class="product-signals">
                <span>&#10084; {{ productLikeCount(product) }} likes</span>
                <span>{{ product.wishlistCount }} wishlists</span>
              </div>
              <button
                v-if="currentUser?.type === 'buyer'"
                class="btn btn-like-product"
                :class="{ active: isProductLiked(product.id) }"
                @click="toggleProductLike(product)"
              >
                &#10084; {{ isProductLiked(product.id) ? 'Liked' : 'Like Product' }} ({{ productLikeCount(product) }})
              </button>
              <button
                v-if="currentUser?.type === 'buyer'"
                class="btn btn-product-comment"
                @click="openProductComment(product)"
              >
                &#128172; Comment on Product
              </button>
              <form
                v-if="commentingProductId === product.id"
                class="product-comment-form"
                @submit.prevent="addProductComment(product)"
              >
                <textarea
                  v-model="productCommentText"
                  rows="3"
                  maxlength="240"
                  placeholder="Write a comment about this product..."
                  required
                ></textarea>
                <div class="product-comment-actions">
                  <button type="submit" class="btn btn-submit-product-comment">Post Comment</button>
                  <button type="button" class="btn btn-cancel-product-comment" @click="cancelProductComment">Cancel</button>
                </div>
              </form>
              <button
                v-if="currentUser?.type === 'buyer'"
                class="btn btn-wishlist"
                @click="toggleWishlistProduct(product)"
              >
                {{ isProductWishlisted(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist' }}
              </button>
              <button
                v-if="currentUser?.type === 'buyer'"
                class="btn btn-report"
                @click="openProductReport(product)"
              >
                Report Product
              </button>
              <form
                v-if="reportingProductId === product.id"
                class="report-form"
                @submit.prevent="submitProductReport(product)"
              >
                <textarea
                  v-model="reportReason"
                  rows="3"
                  maxlength="260"
                  placeholder="Tell us the reason for this report..."
                  required
                ></textarea>
                <div class="report-actions">
                  <button type="submit" class="btn btn-submit-report">Send Report</button>
                  <button type="button" class="btn btn-cancel-report" @click="cancelProductReport">Cancel</button>
                </div>
              </form>
              <button class="btn btn-contact" @click="contactSeller">
                Contact Seller
              </button>

              <div class="product-comments">
                <div class="product-comments-title">
                  &#128172; Product comments ({{ productCommentCount(product) }})
                </div>
                <div v-if="product.comments && product.comments.length > 0" class="product-comments-list">
                  <div v-for="comment in product.comments" :key="comment.id" class="product-comment-item">
                    <div class="product-comment-meta">
                      <strong>{{ comment.buyerName }}</strong>
                      <span>{{ formatDate(comment.createdAt) }}</span>
                    </div>
                    <p>{{ comment.text }}</p>
                  </div>
                </div>
                <p v-else class="product-comments-empty">No product comments yet.</p>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="empty-state">
          <p>This seller hasn't added any products yet.</p>
        </div>
      </div>
    </div>

    <div v-else class="loading">
      <p>Loading seller information...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  calculateSellerTrust,
  rankedProductsForSeller,
  resolveLocation,
  starString
} from '../utils/marketIntelligence.js'

const route = useRoute()
const router = useRouter()
const seller = ref(null)
const currentUser = ref(null)
const buyer = ref(null)
const buyers = ref([])
const productReports = ref([])
const reportingProductId = ref(null)
const reportReason = ref('')
const commentingProductId = ref(null)
const productCommentText = ref('')

onMounted(() => {
  currentUser.value = JSON.parse(localStorage.getItem('currentUser') || 'null')
  if (!currentUser.value) {
    router.push('/login')
    return
  }

  loadSeller()
  loadBuyer()
})

const loadSeller = () => {
  const sellerId = parseInt(route.params.id)
  const sellers = JSON.parse(localStorage.getItem('sellers') || '[]')
  productReports.value = JSON.parse(localStorage.getItem('productReports') || '[]')
  const foundSeller = sellers.find(s => s.id === sellerId)
  
  if (foundSeller) {
    seller.value = foundSeller
  }
}

const loadBuyer = () => {
  buyers.value = JSON.parse(localStorage.getItem('buyers') || '[]')
  if (currentUser.value?.type !== 'buyer') return

  const foundBuyer = buyers.value.find(b => b.id === currentUser.value.id)
  if (foundBuyer) {
    foundBuyer.favoriteSellers = foundBuyer.favoriteSellers || []
    foundBuyer.wishlist = foundBuyer.wishlist || []
    buyer.value = foundBuyer
  }
}

const saveBuyer = () => {
  if (!buyer.value) return

  const buyerIndex = buyers.value.findIndex(b => b.id === buyer.value.id)
  if (buyerIndex !== -1) {
    buyers.value[buyerIndex] = buyer.value
    localStorage.setItem('buyers', JSON.stringify(buyers.value))
  }
}

const isFavoriteSeller = computed(() => {
  if (!buyer.value || !seller.value) return false
  return (buyer.value.favoriteSellers || []).includes(seller.value.id)
})

const sellerFavoriteCount = computed(() => {
  if (!seller.value) return 0
  return buyers.value.filter(b => (b.favoriteSellers || []).includes(seller.value.id)).length
})

const sellerWishlistCount = computed(() => {
  if (!seller.value) return 0
  return buyers.value.reduce((total, b) => {
    return total + (b.wishlist || []).filter(item => item.sellerId === seller.value.id).length
  }, 0)
})

const sellerReactions = computed(() => {
  return {
    good: seller.value?.reactions?.good || [],
    bad: seller.value?.reactions?.bad || []
  }
})

const sellerGoodCount = computed(() => sellerReactions.value.good.length)
const sellerBadCount = computed(() => sellerReactions.value.bad.length)
const sellerComments = computed(() => seller.value?.comments || [])

const sellerTrust = computed(() => {
  if (!seller.value) return { percent: '0%', stars: 0, grade: 'No data' }
  return calculateSellerTrust(seller.value, buyers.value, productReports.value)
})

const rankedProducts = computed(() => {
  if (!seller.value) return []
  return rankedProductsForSeller(seller.value, buyers.value)
})

const sellerResolvedLocation = computed(() => {
  if (!seller.value) return null
  return resolveLocation(seller.value.locationMeta || seller.value)
})

const sellerLocationLabel = computed(() => {
  return sellerResolvedLocation.value?.summary || seller.value?.location || ''
})

const sellerLocationPrecision = computed(() => {
  const precision = sellerResolvedLocation.value?.precision || 'estimate'
  return `Location precision: ${precision.replace(/-/g, ' ')}`
})

const buyerSellerRating = computed(() => {
  if (!buyer.value) return ''
  if (sellerReactions.value.good.includes(buyer.value.id)) return 'good'
  if (sellerReactions.value.bad.includes(buyer.value.id)) return 'bad'
  return ''
})

const dashboardPath = computed(() => {
  if (currentUser.value?.type === 'seller') return '/seller-dashboard'
  if (currentUser.value?.type === 'admin') return '/admin-dashboard'
  return '/buyer-dashboard'
})

const saveSeller = () => {
  if (!seller.value) return

  const sellers = JSON.parse(localStorage.getItem('sellers') || '[]')
  const sellerIndex = sellers.findIndex(s => s.id === seller.value.id)
  if (sellerIndex !== -1) {
    sellers[sellerIndex] = seller.value
    localStorage.setItem('sellers', JSON.stringify(sellers))
  }
}

const toggleFavoriteSeller = () => {
  if (!buyer.value || !seller.value) return

  buyer.value.favoriteSellers = buyer.value.favoriteSellers || []
  if (isFavoriteSeller.value) {
    buyer.value.favoriteSellers = buyer.value.favoriteSellers.filter(id => id !== seller.value.id)
  } else {
    buyer.value.favoriteSellers.push(seller.value.id)
  }
  saveBuyer()
}

const rateSeller = (rating) => {
  if (!buyer.value || !seller.value) return

  seller.value.reactions = seller.value.reactions || { good: [], bad: [] }
  seller.value.reactions.good = seller.value.reactions.good || []
  seller.value.reactions.bad = seller.value.reactions.bad || []

  const opposite = rating === 'good' ? 'bad' : 'good'
  seller.value.reactions[opposite] = seller.value.reactions[opposite].filter(id => id !== buyer.value.id)

  if (seller.value.reactions[rating].includes(buyer.value.id)) {
    seller.value.reactions[rating] = seller.value.reactions[rating].filter(id => id !== buyer.value.id)
  } else {
    seller.value.reactions[rating].push(buyer.value.id)
  }

  saveSeller()
}

const newComment = ref('')

const addSellerComment = () => {
  if (!buyer.value || !seller.value) return

  const text = newComment.value.trim()
  if (!text) return

  seller.value.comments = seller.value.comments || []
  seller.value.comments.unshift({
    id: Date.now(),
    buyerId: buyer.value.id,
    buyerName: buyer.value.name,
    text,
    createdAt: new Date().toISOString()
  })

  newComment.value = ''
  saveSeller()
}

const isProductWishlisted = (productId) => {
  if (!buyer.value || !seller.value) return false
  return (buyer.value.wishlist || []).some(item => item.productId === productId && item.sellerId === seller.value.id)
}

const isProductLiked = (productId) => {
  if (!buyer.value || !seller.value) return false
  const product = seller.value.products?.find(p => p.id === productId)
  return (product?.likes || []).includes(buyer.value.id)
}

const productLikeCount = (product) => {
  return (product.likes || []).length
}

const productCommentCount = (product) => {
  return (product.comments || []).length
}

const toggleProductLike = (product) => {
  if (!buyer.value || !seller.value) return

  const foundProduct = seller.value.products?.find(p => p.id === product.id)
  if (!foundProduct) return

  foundProduct.likes = foundProduct.likes || []
  if (foundProduct.likes.includes(buyer.value.id)) {
    foundProduct.likes = foundProduct.likes.filter(id => id !== buyer.value.id)
  } else {
    foundProduct.likes.push(buyer.value.id)
  }

  saveSeller()
}

const openProductComment = (product) => {
  commentingProductId.value = product.id
  productCommentText.value = ''
}

const cancelProductComment = () => {
  commentingProductId.value = null
  productCommentText.value = ''
}

const addProductComment = (product) => {
  if (!buyer.value || !seller.value) return

  const text = productCommentText.value.trim()
  if (!text) return

  const foundProduct = seller.value.products?.find(p => p.id === product.id)
  if (!foundProduct) return

  foundProduct.comments = foundProduct.comments || []
  foundProduct.comments.unshift({
    id: Date.now(),
    buyerId: buyer.value.id,
    buyerName: buyer.value.name,
    text,
    createdAt: new Date().toISOString()
  })

  cancelProductComment()
  saveSeller()
}

const toggleWishlistProduct = (product) => {
  if (!buyer.value || !seller.value) return

  buyer.value.wishlist = buyer.value.wishlist || []
  if (isProductWishlisted(product.id)) {
    buyer.value.wishlist = buyer.value.wishlist.filter(item => !(item.productId === product.id && item.sellerId === seller.value.id))
  } else {
    buyer.value.wishlist.push({
      productId: product.id,
      sellerId: seller.value.id,
      productName: product.name,
      productPrice: product.price,
      productImage: product.image,
      sellerName: seller.value.businessName,
      addedAt: new Date().toISOString()
    })
  }
  saveBuyer()
}

const openProductReport = (product) => {
  reportingProductId.value = product.id
  reportReason.value = ''
}

const cancelProductReport = () => {
  reportingProductId.value = null
  reportReason.value = ''
}

const submitProductReport = (product) => {
  if (!buyer.value || !seller.value) return

  const reason = reportReason.value.trim()
  if (!reason) return

  const productReports = JSON.parse(localStorage.getItem('productReports') || '[]')
  productReports.unshift({
    id: Date.now(),
    sellerId: seller.value.id,
    sellerName: seller.value.businessName,
    productId: product.id,
    productName: product.name,
    reporterId: buyer.value.id,
    reporterName: buyer.value.name,
    reporterEmail: buyer.value.email,
    reason,
    createdAt: new Date().toISOString()
  })

  localStorage.setItem('productReports', JSON.stringify(productReports))
  cancelProductReport()
  alert('Product report sent. Thank you for helping keep the market safe.')
}

const contactSeller = () => {
  if (seller.value) {
    alert(`Contact ${seller.value.businessName} at:\nPhone: ${seller.value.phone}\nEmail: ${seller.value.email}`)
  }
}

const formatDate = (dateValue) => {
  if (!dateValue) return ''
  return new Date(dateValue).toLocaleDateString()
}

const logout = () => {
  localStorage.removeItem('currentUser')
  router.push('/')
}
</script>

<style scoped>
.seller-profile-container {
  min-height: 100vh;
  background: #f8f9fa;
}

.navbar {
  background: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: 1rem 2rem;
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.logo {
  font-size: 1.5rem;
  color: #2c3e50;
  text-decoration: none;
  font-weight: 600;
}

.back-link {
  color: #e74c3c;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s;
}

.back-link:hover {
  color: #c0392b;
}

.nav-button {
  width: auto;
  padding: 0.5rem 1rem;
}

.btn-secondary {
  background: #95a5a6;
  color: white;
}

.btn-secondary:hover {
  background: #7f8c8d;
}

.profile-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.seller-header {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  display: flex;
  gap: 3rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.seller-photo {
  width: 250px;
  height: 250px;
  border-radius: 8px;
  object-fit: cover;
  border: 4px solid #e74c3c;
}

.seller-info {
  flex: 1;
}

.seller-info h1 {
  color: #2c3e50;
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
}

.owner-name {
  color: #666;
  margin: 0 0 1.5rem 0;
  font-size: 1.1rem;
}

.profile-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-pill {
  background: #f8f9fa;
  border-left: 4px solid #e74c3c;
  border-radius: 6px;
  padding: 0.75rem 1rem;
  min-width: 150px;
}

.stat-pill strong,
.stat-pill span {
  display: block;
}

.stat-pill strong {
  color: #2c3e50;
  font-size: 1.4rem;
}

.stat-pill span {
  color: #666;
  font-size: 0.9rem;
}

.trust-pill {
  background: #fffdf2;
  border-left-color: #d6a400;
}

.trust-stars {
  color: #d6a400 !important;
  font-weight: 800;
}

.details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.details p {
  color: #555;
  font-size: 1.05rem;
  margin: 0;
}

.id-info {
  color: #999;
  font-size: 0.95rem;
  margin-top: 1rem !important;
}

.products-section {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.feedback-section {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 2rem;
}

.feedback-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.feedback-header h2 {
  color: #2c3e50;
  margin: 0 0 0.4rem;
}

.feedback-header p {
  color: #666;
}

.rating-summary {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.rating-summary span {
  background: #f8f9fa;
  border-radius: 6px;
  color: #2c3e50;
  font-weight: 700;
  padding: 0.5rem 0.75rem;
}

.buyer-feedback-tools {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
}

.rating-actions {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.comment-form {
  display: grid;
  gap: 0.75rem;
}

.comment-form textarea {
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  box-sizing: border-box;
  font: inherit;
  padding: 0.75rem;
  resize: vertical;
  width: 100%;
}

.comment-form textarea:focus {
  border-color: #e74c3c;
  outline: none;
}

.comments-list {
  display: grid;
  gap: 1rem;
}

.comment-item {
  background: #f8f9fa;
  border-left: 4px solid #e74c3c;
  border-radius: 6px;
  padding: 1rem;
}

.comment-meta {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.comment-meta strong {
  color: #2c3e50;
}

.comment-meta span {
  color: #777;
  font-size: 0.9rem;
}

.comment-item p {
  color: #555;
  line-height: 1.5;
}

.mini-empty {
  background: #f8f9fa;
  border-radius: 8px;
  color: #777;
  padding: 1rem;
  text-align: center;
}

.products-section h2 {
  color: #2c3e50;
  margin-top: 0;
  margin-bottom: 2rem;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
}

.product-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0,0,0,0.1);
}

.card-image {
  width: 100%;
  height: 220px;
  overflow: hidden;
  background: #f0f0f0;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-content {
  padding: 1.5rem;
}

.card-content h3 {
  color: #2c3e50;
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
}

.category-tag {
  background: #edf6fd;
  border: 1px solid #aed6f1;
  border-radius: 999px;
  color: #2471a3;
  display: inline-flex;
  font-size: 0.78rem;
  font-weight: 700;
  margin-bottom: 0.6rem;
  padding: 0.25rem 0.55rem;
}

.description {
  color: #666;
  font-size: 0.95rem;
  margin: 0.5rem 0;
  line-height: 1.4;
}

.price {
  color: #e74c3c;
  font-size: 1.5rem;
  font-weight: bold;
  margin: 1rem 0;
}

.product-signals {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.product-signals span {
  background: #f8f9fa;
  border: 1px solid #e0e0e0;
  border-radius: 999px;
  color: #2c3e50;
  font-size: 0.82rem;
  font-weight: 700;
  padding: 0.3rem 0.55rem;
}

.btn {
  width: 100%;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-contact {
  background: #e74c3c;
  color: white;
}

.btn-contact:hover {
  background: #c0392b;
}

.btn-favorite {
  background: #f39c12;
  color: white;
  margin-top: 1.5rem;
  max-width: 280px;
}

.btn-favorite:hover {
  background: #d68910;
}

.btn-wishlist {
  background: #3498db;
  color: white;
  margin-bottom: 0.75rem;
}

.btn-wishlist:hover {
  background: #2980b9;
}

.btn-product-comment {
  background: #f8f9fa;
  border: 1px solid #3498db;
  color: #2471a3;
  margin-bottom: 0.75rem;
}

.btn-product-comment:hover {
  background: #edf6fd;
}

.product-comment-form {
  background: #f4f9fd;
  border: 1px solid #aed6f1;
  border-radius: 8px;
  display: grid;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  padding: 0.85rem;
}

.product-comment-form textarea {
  border: 1px solid #85c1e9;
  border-radius: 6px;
  box-sizing: border-box;
  font: inherit;
  padding: 0.7rem;
  resize: vertical;
  width: 100%;
}

.product-comment-form textarea:focus {
  border-color: #3498db;
  outline: none;
}

.product-comment-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
}

.btn-submit-product-comment {
  background: #3498db;
  color: white;
}

.btn-cancel-product-comment {
  background: #bdc3c7;
  color: #2c3e50;
}

.product-comments {
  border-top: 1px solid #eee;
  margin-top: 1rem;
  padding-top: 1rem;
}

.product-comments-title {
  color: #2c3e50;
  font-weight: 700;
  margin-bottom: 0.75rem;
}

.product-comments-list {
  display: grid;
  gap: 0.75rem;
}

.product-comment-item {
  background: #f8f9fa;
  border-radius: 6px;
  padding: 0.75rem;
}

.product-comment-meta {
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.35rem;
}

.product-comment-meta strong {
  color: #2c3e50;
  font-size: 0.95rem;
}

.product-comment-meta span {
  color: #777;
  font-size: 0.85rem;
}

.product-comment-item p,
.product-comments-empty {
  color: #666;
  font-size: 0.9rem;
  line-height: 1.4;
  margin: 0;
}

.btn-report {
  background: #f8f9fa;
  border: 1px solid #f39c12;
  color: #b9770e;
  margin-bottom: 0.75rem;
}

.btn-report:hover {
  background: #fff4df;
}

.report-form {
  background: #fff8ed;
  border: 1px solid #f6c36b;
  border-radius: 8px;
  display: grid;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  padding: 0.85rem;
}

.report-form textarea {
  border: 1px solid #e0b15c;
  border-radius: 6px;
  box-sizing: border-box;
  font: inherit;
  padding: 0.7rem;
  resize: vertical;
  width: 100%;
}

.report-form textarea:focus {
  border-color: #e74c3c;
  outline: none;
}

.report-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
}

.btn-submit-report {
  background: #e74c3c;
  color: white;
}

.btn-cancel-report {
  background: #bdc3c7;
  color: #2c3e50;
}

.btn-good {
  background: #27ae60;
  color: white;
}

.btn-good.active,
.btn-good:hover {
  background: #1e8449;
}

.btn-bad {
  background: #7f8c8d;
  color: white;
}

.btn-bad.active,
.btn-bad:hover {
  background: #5f6a6a;
}

.btn-comment {
  background: #e74c3c;
  color: white;
  justify-self: end;
  width: auto;
}

.btn-like-product {
  background: #f8f9fa;
  border: 1px solid #e0e0e0;
  color: #e74c3c;
  margin-bottom: 0.75rem;
}

.btn-like-product.active,
.btn-like-product:hover {
  background: #fdecea;
  border-color: #e74c3c;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #666;
}

.loading {
  text-align: center;
  padding: 4rem;
  color: #666;
}

@media (max-width: 768px) {
  .seller-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .feedback-header,
  .rating-actions,
  .comment-meta,
  .product-comment-meta {
    flex-direction: column;
  }

  .seller-photo {
    width: 200px;
    height: 200px;
  }

  .products-grid {
    grid-template-columns: 1fr;
  }

  .seller-info h1 {
    font-size: 1.5rem;
  }
}
</style>
