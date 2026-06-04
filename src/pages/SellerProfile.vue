<template>
  <div class="seller-profile-page">
    <nav class="profile-nav">
      <router-link to="/" class="brand">
        <span>KGM</span>
        <strong>Kigali Great Market</strong>
      </router-link>

      <div class="nav-links">
        <router-link to="/marketplace" class="nav-link">Marketplace</router-link>
        <router-link v-if="currentUser" :to="dashboardPath" class="nav-link">Dashboard</router-link>
        <button v-if="currentUser" @click="logout" class="btn btn-secondary nav-button">Logout</button>
      </div>
    </nav>

    <main v-if="seller" class="profile-content">
      <section class="seller-hero">
        <img v-if="seller.idphoto" :src="seller.idphoto" :alt="seller.businessName" class="seller-photo" />
        <div v-else class="seller-photo-placeholder">
          {{ seller.businessName?.charAt(0)?.toUpperCase() || 'S' }}
        </div>

        <div class="seller-info">
          <span class="section-kicker">Seller profile</span>
          <h1>{{ seller.businessName }}</h1>
          <p class="owner-name">Owner: {{ seller.name }}</p>

          <div class="details">
            <span>{{ seller.location }}</span>
            <span>{{ seller.phone }}</span>
            <span>{{ seller.email }}</span>
            <span>ID: {{ seller.idnumber }}</span>
          </div>

          <button
            v-if="currentUser?.type === 'buyer'"
            class="btn btn-favorite"
            @click="toggleFavoriteSeller"
          >
            {{ isFavoriteSeller ? 'Saved Seller' : 'Save Seller' }}
          </button>
        </div>

        <div class="profile-stats">
          <div class="stat-pill">
            <strong>{{ sellerWishlistCount }}</strong>
            <span>product wishlists</span>
          </div>
          <div class="stat-pill">
            <strong>{{ sellerFavoriteCount }}</strong>
            <span>buyer favorites</span>
          </div>
          <div class="stat-pill good">
            <strong>{{ sellerGoodCount }}</strong>
            <span>good ratings</span>
          </div>
          <div class="stat-pill bad">
            <strong>{{ sellerBadCount }}</strong>
            <span>bad ratings</span>
          </div>
        </div>
      </section>

      <section class="feedback-section">
        <div class="feedback-header">
          <div>
            <span class="panel-label">Seller feedback</span>
            <h2>Ratings and Comments</h2>
          </div>
          <div class="rating-summary">
            <span>Good {{ sellerGoodCount }}</span>
            <span>Bad {{ sellerBadCount }}</span>
            <button class="comment-toggle" @click="toggleSellerComments">
              Comments {{ sellerComments.length }}
            </button>
          </div>
        </div>

        <div v-if="currentUser?.type === 'buyer'" class="buyer-feedback-tools">
          <div class="rating-actions">
            <button
              class="btn btn-good"
              :class="{ active: buyerSellerRating === 'good' }"
              @click="rateSeller('good')"
            >
              Good seller
            </button>
            <button
              class="btn btn-bad"
              :class="{ active: buyerSellerRating === 'bad' }"
              @click="rateSeller('bad')"
            >
              Bad seller
            </button>
          </div>

          <form class="comment-form" @submit.prevent="addSellerComment">
            <textarea
              v-model="newComment"
              rows="3"
              maxlength="240"
              placeholder="Write a short seller comment..."
            ></textarea>
            <button type="submit" class="btn btn-comment">Post Comment</button>
          </form>
        </div>

        <div v-if="showSellerComments" class="comments-area">
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
      </section>

      <section class="products-section">
        <div class="section-title">
          <div>
            <span class="panel-label">Store products</span>
            <h2>Products from {{ seller.businessName }}</h2>
          </div>
        </div>
        
        <div v-if="seller.products && seller.products.length > 0" class="products-grid">
          <article v-for="product in seller.products" :key="product.id" class="product-card">
            <div class="card-image">
              <img :src="product.image" :alt="product.name" />
            </div>
            <div class="card-content">
              <div class="product-heading">
                <h3>{{ product.name }}</h3>
                <strong>${{ product.price.toFixed(2) }}</strong>
              </div>
              <p v-if="product.description" class="description">{{ product.description }}</p>

              <div class="product-signals">
                <span>{{ productLikeCount(product) }} likes</span>
                <button class="comment-toggle small" @click="toggleProductComments(product)">
                  Comments {{ productCommentCount(product) }}
                </button>
              </div>

              <div v-if="currentUser?.type === 'buyer'" class="product-actions">
                <button
                  class="btn btn-like-product"
                  :class="{ active: isProductLiked(product.id) }"
                  @click="toggleProductLike(product)"
                >
                  {{ isProductLiked(product.id) ? 'Liked' : 'Like' }}
                </button>
                <button class="btn btn-product-comment" @click="openProductComment(product)">
                  Comment
                </button>
                <button class="btn btn-wishlist" @click="toggleWishlistProduct(product)">
                  {{ isProductWishlisted(product.id) ? 'Saved' : 'Wishlist' }}
                </button>
                <button class="btn btn-report" @click="openProductReport(product)">
                  Report
                </button>
              </div>

              <form
                v-if="commentingProductId === product.id"
                class="product-comment-form"
                @submit.prevent="addProductComment(product)"
              >
                <textarea
                  v-model="productCommentText"
                  rows="3"
                  maxlength="240"
                  placeholder="Write a product comment..."
                  required
                ></textarea>
                <div class="form-actions compact">
                  <button type="submit" class="btn btn-primary">Post</button>
                  <button type="button" class="btn btn-secondary" @click="cancelProductComment">Cancel</button>
                </div>
              </form>

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
                <div class="form-actions compact">
                  <button type="submit" class="btn btn-primary">Send</button>
                  <button type="button" class="btn btn-secondary" @click="cancelProductReport">Cancel</button>
                </div>
              </form>

              <div v-if="isProductCommentsVisible(product)" class="product-comments">
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

              <button class="btn btn-contact" @click="contactSeller">
                Contact Seller
              </button>
            </div>
          </article>
        </div>

        <div v-else class="empty-state">
          <p>This seller has not added any products yet.</p>
        </div>
      </section>
    </main>

    <div v-else class="loading">
      <p>Loading seller information...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { buyerApi, clearSession, reportsApi, sellersApi } from '../api.js'

const route = useRoute()
const router = useRouter()
const seller = ref(null)
const currentUser = ref(null)
const buyer = ref(null)
const reportingProductId = ref(null)
const reportReason = ref('')
const commentingProductId = ref(null)
const productCommentText = ref('')
const showSellerComments = ref(false)
const visibleProductComments = ref({})

onMounted(() => {
  currentUser.value = JSON.parse(localStorage.getItem('currentUser') || 'null')
  if (!currentUser.value) {
    router.push('/login')
    return
  }

  loadSeller()
  loadBuyer()
})

const loadSeller = async () => {
  try {
    const data = await sellersApi.get(route.params.id)
    seller.value = data.seller
  } catch (error) {
    alert(error.message)
    router.push('/marketplace')
  }
}

const loadBuyer = async () => {
  if (currentUser.value?.type !== 'buyer') return

  try {
    const data = await buyerApi.me()
    buyer.value = {
      ...data.buyer,
      favoriteSellers: data.buyer.favoriteSellers || [],
      wishlist: data.buyer.wishlist || []
    }
  } catch (error) {
    alert(error.message)
  }
}

const isFavoriteSeller = computed(() => {
  if (!buyer.value || !seller.value) return false
  return (buyer.value.favoriteSellers || []).includes(seller.value.id)
})

const sellerFavoriteCount = computed(() => {
  if (!seller.value) return 0
  return seller.value.favoriteCount || 0
})

const sellerWishlistCount = computed(() => {
  if (!seller.value) return 0
  return seller.value.wishlistCount || 0
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

const toggleFavoriteSeller = async () => {
  if (!buyer.value || !seller.value) return

  try {
    const data = await sellersApi.favorite(seller.value.id)
    buyer.value = {
      ...data.buyer,
      favoriteSellers: data.buyer.favoriteSellers || [],
      wishlist: data.buyer.wishlist || []
    }
    await loadSeller()
  } catch (error) {
    alert(error.message)
  }
}

const rateSeller = async (rating) => {
  if (!buyer.value || !seller.value) return

  try {
    const data = await sellersApi.rate(seller.value.id, rating)
    seller.value = data.seller
  } catch (error) {
    alert(error.message)
  }
}

const newComment = ref('')

const addSellerComment = async () => {
  if (!buyer.value || !seller.value) return

  const text = newComment.value.trim()
  if (!text) return

  try {
    const data = await sellersApi.comment(seller.value.id, text)
    seller.value = data.seller
    newComment.value = ''
    showSellerComments.value = true
  } catch (error) {
    alert(error.message)
  }
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

const toggleProductLike = async (product) => {
  if (!buyer.value || !seller.value) return

  try {
    const data = await sellersApi.likeProduct(seller.value.id, product.id)
    seller.value = data.seller
  } catch (error) {
    alert(error.message)
  }
}

const openProductComment = (product) => {
  commentingProductId.value = product.id
  productCommentText.value = ''
}

const cancelProductComment = () => {
  commentingProductId.value = null
  productCommentText.value = ''
}

const toggleSellerComments = () => {
  showSellerComments.value = !showSellerComments.value
}

const toggleProductComments = (product) => {
  visibleProductComments.value = {
    ...visibleProductComments.value,
    [product.id]: !visibleProductComments.value[product.id]
  }
}

const isProductCommentsVisible = (product) => {
  return Boolean(visibleProductComments.value[product.id])
}

const addProductComment = async (product) => {
  if (!buyer.value || !seller.value) return

  const text = productCommentText.value.trim()
  if (!text) return

  try {
    const data = await sellersApi.commentProduct(seller.value.id, product.id, text)
    seller.value = data.seller
    visibleProductComments.value = {
      ...visibleProductComments.value,
      [product.id]: true
    }
    cancelProductComment()
  } catch (error) {
    alert(error.message)
  }
}

const toggleWishlistProduct = async (product) => {
  if (!buyer.value || !seller.value) return

  try {
    const data = await sellersApi.wishlistProduct(seller.value.id, product.id)
    buyer.value = {
      ...data.buyer,
      favoriteSellers: data.buyer.favoriteSellers || [],
      wishlist: data.buyer.wishlist || []
    }
    await loadSeller()
  } catch (error) {
    alert(error.message)
  }
}

const openProductReport = (product) => {
  reportingProductId.value = product.id
  reportReason.value = ''
}

const cancelProductReport = () => {
  reportingProductId.value = null
  reportReason.value = ''
}

const submitProductReport = async (product) => {
  if (!buyer.value || !seller.value) return

  const reason = reportReason.value.trim()
  if (!reason) return

  try {
    await reportsApi.reportProduct({
      sellerId: seller.value.id,
      productId: product.id,
      reason
    })
    cancelProductReport()
    alert('Product report sent. Thank you for helping keep the market safe.')
  } catch (error) {
    alert(error.message)
  }
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
  clearSession()
  router.push('/')
}
</script>

<style scoped>
.seller-profile-page {
  background: var(--page);
  min-height: 100vh;
}

.profile-nav {
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

.profile-content {
  display: grid;
  gap: 1.25rem;
  margin: 0 auto;
  max-width: 1240px;
  padding: clamp(1rem, 3vw, 2rem);
}

.seller-hero,
.feedback-section,
.products-section {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 8px;
  box-shadow: var(--shadow-sm);
}

.seller-hero {
  align-items: center;
  display: grid;
  gap: 1.5rem;
  grid-template-columns: 180px minmax(0, 1fr) 320px;
  padding: 1.25rem;
}

.seller-photo,
.seller-photo-placeholder {
  border-radius: 8px;
  height: 180px;
  width: 180px;
}

.seller-photo {
  object-fit: cover;
}

.seller-photo-placeholder {
  align-items: center;
  background: #e2e8f0;
  color: var(--muted);
  display: flex;
  font-size: 3rem;
  font-weight: 850;
  justify-content: center;
}

.seller-info h1 {
  font-size: 2.4rem;
  line-height: 1.1;
  margin-top: 0.35rem;
}

.owner-name {
  margin-top: 0.35rem;
}

.details {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  margin-top: 1rem;
}

.details span {
  background: var(--surface-soft);
  border: 1px solid var(--line);
  border-radius: 6px;
  color: var(--muted);
  font-size: 0.85rem;
  font-weight: 750;
  padding: 0.35rem 0.65rem;
}

.btn-favorite {
  background: #fff7ed;
  color: var(--accent);
  margin-top: 1rem;
}

.btn-favorite:hover {
  background: #ffedd5;
}

.profile-stats {
  display: grid;
  gap: 0.7rem;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.stat-pill {
  background: var(--surface-soft);
  border: 1px solid var(--line);
  border-left: 4px solid var(--accent);
  border-radius: 8px;
  padding: 0.85rem;
}

.stat-pill.good {
  border-left-color: var(--success);
}

.stat-pill.bad {
  border-left-color: var(--danger);
}

.stat-pill strong,
.stat-pill span {
  display: block;
}

.stat-pill strong {
  color: var(--ink);
  font-size: 1.5rem;
  line-height: 1;
}

.stat-pill span {
  color: var(--muted);
  font-size: 0.78rem;
  font-weight: 750;
  margin-top: 0.35rem;
}

.feedback-section,
.products-section {
  padding: 1.2rem;
}

.feedback-header,
.section-title {
  align-items: center;
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
}

.panel-label {
  color: var(--accent);
  font-size: 0.76rem;
  font-weight: 850;
  text-transform: uppercase;
}

.feedback-header h2,
.section-title h2 {
  font-size: 1.35rem;
  margin-top: 0.25rem;
}

.rating-summary {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}

.rating-summary span,
.comment-toggle {
  background: var(--surface-soft);
  border: 1px solid var(--line);
  border-radius: 6px;
  color: var(--ink);
  font-size: 0.82rem;
  font-weight: 800;
  padding: 0.4rem 0.65rem;
}

.comment-toggle {
  cursor: pointer;
}

.comment-toggle:hover {
  border-color: rgba(194, 65, 12, 0.4);
  color: var(--accent);
}

.comment-toggle.small {
  background: #eff6ff;
  color: var(--info);
  padding: 0.3rem 0.55rem;
}

.buyer-feedback-tools {
  background: var(--surface-soft);
  border: 1px solid var(--line);
  border-radius: 8px;
  display: grid;
  gap: 0.9rem;
  padding: 1rem;
}

.rating-actions,
.product-actions,
.form-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
}

.comment-form {
  display: grid;
  gap: 0.65rem;
}

.comment-form textarea,
.product-comment-form textarea,
.report-form textarea {
  border: 1px solid var(--line-strong);
  border-radius: 6px;
  color: var(--ink);
  padding: 0.7rem;
  resize: vertical;
  width: 100%;
}

.comment-form textarea:focus,
.product-comment-form textarea:focus,
.report-form textarea:focus {
  border-color: var(--accent);
  outline: none;
}

.btn-good {
  background: #ecfdf3;
  color: var(--success);
}

.btn-good.active,
.btn-good:hover {
  background: #d1fadf;
}

.btn-bad {
  background: #fff1f2;
  color: var(--danger);
}

.btn-bad.active,
.btn-bad:hover {
  background: #ffe4e6;
}

.btn-comment {
  justify-self: end;
}

.comments-area {
  margin-top: 1rem;
}

.comments-list,
.product-comments-list {
  display: grid;
  gap: 0.75rem;
}

.comment-item,
.product-comment-item {
  background: var(--surface-soft);
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 0.8rem;
}

.comment-meta,
.product-comment-meta {
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.35rem;
}

.comment-meta strong,
.product-comment-meta strong {
  color: var(--ink);
}

.comment-meta span,
.product-comment-meta span {
  color: var(--muted);
  font-size: 0.82rem;
}

.comment-item p,
.product-comment-item p,
.product-comments-empty {
  color: var(--muted);
  font-size: 0.9rem;
}

.products-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
}

.product-card {
  background: #ffffff;
  border: 1px solid var(--line);
  border-radius: 8px;
  overflow: hidden;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
}

.product-card:hover {
  border-color: rgba(194, 65, 12, 0.36);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.card-image {
  background: #e2e8f0;
  height: 185px;
  overflow: hidden;
}

.card-image img {
  height: 100%;
  object-fit: cover;
  width: 100%;
}

.card-content {
  display: grid;
  gap: 0.75rem;
  padding: 0.95rem;
}

.product-heading {
  align-items: start;
  display: flex;
  gap: 0.75rem;
  justify-content: space-between;
}

.product-heading h3 {
  font-size: 1.05rem;
}

.product-heading strong {
  color: var(--accent);
  white-space: nowrap;
}

.description {
  display: -webkit-box;
  font-size: 0.9rem;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}

.product-signals {
  align-items: center;
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
}

.product-signals span {
  color: var(--muted);
  font-size: 0.85rem;
  font-weight: 800;
}

.product-actions .btn {
  min-height: 2rem;
  padding: 0.4rem 0.62rem;
}

.btn-like-product {
  background: #fff1f2;
  color: var(--danger);
}

.btn-like-product.active,
.btn-like-product:hover {
  background: #ffe4e6;
}

.btn-product-comment {
  background: #eff6ff;
  color: var(--info);
}

.btn-wishlist {
  background: #fff7ed;
  color: var(--accent);
}

.btn-report {
  background: #f8fafc;
  border: 1px solid var(--line);
  color: var(--muted);
}

.product-comment-form,
.report-form,
.product-comments {
  background: var(--surface-soft);
  border: 1px solid var(--line);
  border-radius: 8px;
  display: grid;
  gap: 0.65rem;
  padding: 0.8rem;
}

.form-actions.compact .btn {
  min-height: 2rem;
  padding: 0.4rem 0.75rem;
}

.btn-contact {
  background: var(--ink);
  color: #ffffff;
  width: 100%;
}

.btn-contact:hover {
  background: #263244;
}

.loading {
  padding: 4rem 1rem;
  text-align: center;
}

@media (max-width: 980px) {
  .seller-hero {
    grid-template-columns: 150px 1fr;
  }

  .profile-stats {
    grid-column: 1 / -1;
  }
}

@media (max-width: 640px) {
  .seller-info h1 {
    font-size: 1.8rem;
  }

  .profile-nav,
  .feedback-header,
  .section-title {
    align-items: flex-start;
    flex-direction: column;
  }

  .nav-links {
    flex-wrap: wrap;
  }

  .seller-hero,
  .profile-stats {
    grid-template-columns: 1fr;
  }

  .seller-photo,
  .seller-photo-placeholder {
    height: 140px;
    width: 140px;
  }

  .product-heading,
  .product-signals,
  .comment-meta,
  .product-comment-meta {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
