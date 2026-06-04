<template>
  <div class="buyer-dashboard">
    <aside class="dashboard-sidebar">
      <router-link to="/" class="sidebar-brand">
        <span>KGM</span>
        <strong>Kigali Great Market</strong>
      </router-link>

      <div class="buyer-card">
        <div class="avatar-wrap">
          <img v-if="buyer.profilePicture" :src="buyer.profilePicture" alt="Profile" class="profile-picture">
          <div v-else class="profile-picture-placeholder">{{ buyerInitials }}</div>
          <label class="upload-button" title="Change profile picture">
            <input type="file" @change="handleProfilePictureUpload" accept="image/*">
            Photo
          </label>
        </div>
        <h1>{{ buyer.name || 'Buyer' }}</h1>
        <p>{{ buyer.location || 'Location not set' }}</p>
      </div>

      <nav class="side-nav">
        <router-link to="/marketplace" class="side-link">Marketplace</router-link>
        <button class="side-link" @click="scrollToSection('favorite-sellers')">Favorite Sellers</button>
        <button class="side-link" @click="scrollToSection('wishlist')">Wishlist</button>
        <button class="side-link" @click="scrollToSection('edit-profile')">Profile Settings</button>
      </nav>

      <button @click="logout" class="btn btn-secondary logout-button">Logout</button>
    </aside>

    <main class="dashboard-main">
      <header class="dashboard-topbar">
        <div>
          <span class="section-kicker">Buyer dashboard</span>
          <h2>Welcome back, {{ buyer.name || 'buyer' }}</h2>
        </div>
        <router-link to="/marketplace" class="btn btn-primary">Browse Sellers</router-link>
      </header>

      <section class="profile-panel">
        <div class="profile-copy">
          <span class="panel-label">Profile overview</span>
          <h3>Your marketplace account</h3>
          <p>Keep your location and contact details current so seller suggestions can become more precise.</p>
        </div>

        <div class="buyer-details">
          <div class="detail-item">
            <span>Email</span>
            <strong>{{ buyer.email || 'Not available' }}</strong>
          </div>
          <div class="detail-item">
            <span>Phone</span>
            <strong>{{ buyer.phone || 'Not available' }}</strong>
          </div>
          <div class="detail-item">
            <span>Location</span>
            <strong>{{ buyer.location || 'Not available' }}</strong>
          </div>
          <div class="detail-item">
            <span>ID Number</span>
            <strong>{{ buyer.idnumber || 'Not available' }}</strong>
          </div>
        </div>
      </section>

      <section class="stats-grid">
        <div class="stat-box">
          <span>Favorite sellers</span>
          <strong>{{ favoriteSellerDetails.length }}</strong>
        </div>
        <div class="stat-box">
          <span>Wishlist products</span>
          <strong>{{ wishlistDetails.length }}</strong>
        </div>
        <div class="stat-box">
          <span>Total purchases</span>
          <strong>0</strong>
        </div>
        <div class="stat-box">
          <span>Unread messages</span>
          <strong>0</strong>
        </div>
      </section>

      <section class="quick-actions">
        <button class="action-chip" @click="scrollToSection('favorite-sellers')">Favorite sellers</button>
        <button class="action-chip" @click="viewPurchaseHistory">Purchase history</button>
        <button class="action-chip" @click="scrollToSection('wishlist')">Wishlist</button>
        <button class="action-chip" @click="toggleEditMode">{{ editMode ? 'Close settings' : 'Edit profile' }}</button>
      </section>

      <section id="favorite-sellers" class="saved-section">
        <div class="section-title">
          <div>
            <span class="panel-label">Saved businesses</span>
            <h3>Favorite Sellers</h3>
          </div>
          <router-link to="/marketplace" class="text-link">Find sellers</router-link>
        </div>

        <div v-if="favoriteSellerDetails.length > 0" class="saved-grid">
          <router-link
            v-for="seller in favoriteSellerDetails"
            :key="seller.id"
            :to="{ name: 'SellerProfile', params: { id: seller.id } }"
            class="saved-card"
          >
            <img v-if="seller.idphoto" :src="seller.idphoto" :alt="seller.businessName" class="saved-image">
            <div v-else class="saved-image-placeholder">Store</div>
            <div class="saved-info">
              <h4>{{ seller.businessName }}</h4>
              <p>{{ seller.location }}</p>
              <span>Open profile</span>
            </div>
          </router-link>
        </div>
        <div v-else class="mini-empty">
          <p>No favorite sellers yet.</p>
        </div>
      </section>

      <section id="wishlist" class="saved-section">
        <div class="section-title">
          <div>
            <span class="panel-label">Saved products</span>
            <h3>Wishlist</h3>
          </div>
          <router-link to="/marketplace" class="text-link">Browse products</router-link>
        </div>

        <div v-if="wishlistDetails.length > 0" class="saved-grid">
          <router-link
            v-for="item in wishlistDetails"
            :key="`${item.sellerId}-${item.productId}`"
            :to="{ name: 'SellerProfile', params: { id: item.sellerId } }"
            class="saved-card"
          >
            <img v-if="item.productImage" :src="item.productImage" :alt="item.productName" class="saved-image">
            <div v-else class="saved-image-placeholder">Item</div>
            <div class="saved-info">
              <h4>{{ item.productName }}</h4>
              <p>${{ Number(item.productPrice).toFixed(2) }}</p>
              <span>From {{ item.sellerName }}</span>
            </div>
          </router-link>
        </div>
        <div v-else class="mini-empty">
          <p>No wishlist products yet.</p>
        </div>
      </section>

      <section id="edit-profile" class="edit-section">
        <div class="section-title">
          <div>
            <span class="panel-label">Account settings</span>
            <h3>Edit Profile</h3>
          </div>
          <button @click="toggleEditMode" class="btn btn-secondary">
            {{ editMode ? 'Cancel' : 'Edit' }}
          </button>
        </div>

        <form v-if="editMode" class="edit-form" @submit.prevent="saveProfile">
          <div class="form-group">
            <label>Phone Number</label>
            <input v-model="buyer.phone" type="tel" placeholder="Enter phone number">
          </div>

          <div class="form-group">
            <label>Short Location Name</label>
            <input v-model="buyer.location" type="text" placeholder="Enter location">
          </div>

          <button type="submit" class="btn btn-primary">Save Changes</button>
        </form>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { buyerApi, clearSession, sellersApi } from '../api.js'

const router = useRouter()
const buyer = ref({
  id: '',
  name: '',
  email: '',
  phone: '',
  location: '',
  idnumber: '',
  profilePicture: ''
})
const editMode = ref(false)
const sellers = ref([])

onMounted(() => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null')
  
  // Check if user is logged in and is a buyer
  if (!currentUser || currentUser.type !== 'buyer') {
    router.push('/login')
    return
  }

  loadBuyerProfile()
})

const loadBuyerProfile = async () => {
  try {
    const [buyerData, sellerData] = await Promise.all([
      buyerApi.me(),
      sellersApi.list()
    ])
    sellers.value = sellerData.sellers
    buyer.value = {
      ...buyerData.buyer,
      favoriteSellers: buyerData.buyer.favoriteSellers || [],
      wishlist: buyerData.buyer.wishlist || []
    }
  } catch (error) {
    alert(error.message)
    router.push('/login')
  }
}

const buyerInitials = computed(() => {
  const name = buyer.value.name || 'Buyer'
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase())
    .join('')
})

const favoriteSellerDetails = computed(() => {
  return (buyer.value.favoriteSellers || [])
    .map(sellerId => sellers.value.find(s => s.id === sellerId))
    .filter(Boolean)
})

const wishlistDetails = computed(() => {
  return (buyer.value.wishlist || []).map(item => {
    const seller = sellers.value.find(s => s.id === item.sellerId)
    const product = seller?.products?.find(p => p.id === item.productId)

    return {
      ...item,
      productName: product?.name || item.productName,
      productPrice: product?.price ?? item.productPrice,
      productImage: product?.image || item.productImage,
      sellerName: seller?.businessName || item.sellerName
    }
  })
})

const handleProfilePictureUpload = (e) => {
  const file = e.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (event) => {
      buyer.value.profilePicture = event.target.result
      saveBuyerProfile().catch((error) => alert(error.message))
    }
    reader.readAsDataURL(file)
  }
}

const saveBuyerProfile = async () => {
  const data = await buyerApi.updateMe({
    phone: buyer.value.phone,
    location: buyer.value.location,
    profilePicture: buyer.value.profilePicture
  })
  buyer.value = {
    ...data.buyer,
    favoriteSellers: data.buyer.favoriteSellers || [],
    wishlist: data.buyer.wishlist || []
  }
}

const saveProfile = async () => {
  try {
    await saveBuyerProfile()
    editMode.value = false
    alert('Profile updated successfully!')
  } catch (error) {
    alert(error.message)
  }
}

const toggleEditMode = () => {
  editMode.value = !editMode.value
}

const viewPurchaseHistory = () => {
  alert('Purchase History feature coming soon!')
}

const scrollToSection = (sectionId) => {
  document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const logout = () => {
  clearSession()
  router.push('/')
}
</script>

<style scoped>
.buyer-dashboard {
  background: var(--page);
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr);
  min-height: 100vh;
}

.dashboard-sidebar {
  background: #111827;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  min-height: 100vh;
  padding: 1.2rem;
  position: sticky;
  top: 0;
}

.sidebar-brand {
  align-items: center;
  color: #ffffff;
  display: flex;
  gap: 0.75rem;
  text-decoration: none;
}

.sidebar-brand span {
  align-items: center;
  background: var(--accent);
  border-radius: 8px;
  display: inline-flex;
  font-size: 0.72rem;
  font-weight: 850;
  height: 2.3rem;
  justify-content: center;
  width: 2.3rem;
}

.buyer-card {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-block: 1.1rem;
}

.avatar-wrap {
  align-items: flex-end;
  display: flex;
  gap: 0.75rem;
}

.profile-picture,
.profile-picture-placeholder {
  border-radius: 8px;
  height: 72px;
  width: 72px;
}

.profile-picture {
  object-fit: cover;
}

.profile-picture-placeholder {
  align-items: center;
  background: #263244;
  color: #ffffff;
  display: flex;
  font-weight: 850;
  justify-content: center;
}

.upload-button {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 6px;
  color: #ffffff;
  cursor: pointer;
  font-size: 0.78rem;
  font-weight: 800;
  padding: 0.35rem 0.55rem;
}

.upload-button input {
  display: none;
}

.buyer-card h1 {
  color: #ffffff;
  font-size: 1.15rem;
  margin-top: 0.8rem;
}

.buyer-card p {
  color: rgba(255, 255, 255, 0.66);
  font-size: 0.88rem;
}

.side-nav {
  display: grid;
  gap: 0.35rem;
}

.side-link {
  background: transparent;
  border-radius: 6px;
  color: rgba(255, 255, 255, 0.76);
  cursor: pointer;
  font-weight: 750;
  padding: 0.65rem 0.75rem;
  text-align: left;
  text-decoration: none;
  transition: background 0.2s ease, color 0.2s ease;
}

.side-link:hover {
  background: rgba(255, 255, 255, 0.09);
  color: #ffffff;
}

.logout-button {
  margin-top: auto;
  width: 100%;
}

.dashboard-main {
  display: grid;
  gap: 1.25rem;
  padding: clamp(1rem, 3vw, 2rem);
}

.dashboard-topbar {
  align-items: center;
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.dashboard-topbar h2 {
  font-size: 2.25rem;
  line-height: 1.1;
  margin-top: 0.25rem;
}

.profile-panel,
.saved-section,
.edit-section {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 8px;
  box-shadow: var(--shadow-sm);
}

.profile-panel {
  align-items: start;
  display: grid;
  gap: 1.5rem;
  grid-template-columns: minmax(260px, 0.55fr) 1fr;
  padding: 1.25rem;
}

.profile-copy h3 {
  font-size: 1.2rem;
  margin-top: 0.35rem;
}

.profile-copy p {
  margin-top: 0.45rem;
}

.panel-label {
  color: var(--accent);
  font-size: 0.76rem;
  font-weight: 850;
  text-transform: uppercase;
}

.buyer-details {
  display: grid;
  gap: 0.7rem;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.detail-item {
  background: var(--surface-soft);
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 0.85rem;
}

.detail-item span,
.detail-item strong {
  display: block;
}

.detail-item span {
  color: var(--muted);
  font-size: 0.8rem;
  font-weight: 750;
}

.detail-item strong {
  color: var(--ink);
  font-size: 0.95rem;
  margin-top: 0.2rem;
  word-break: break-word;
}

.stats-grid {
  display: grid;
  gap: 0.85rem;
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.stat-box {
  background: var(--surface);
  border: 1px solid var(--line);
  border-left: 4px solid var(--accent);
  border-radius: 8px;
  padding: 1rem;
}

.stat-box span,
.stat-box strong {
  display: block;
}

.stat-box span {
  color: var(--muted);
  font-size: 0.82rem;
  font-weight: 750;
}

.stat-box strong {
  color: var(--ink);
  font-size: 1.8rem;
  line-height: 1;
  margin-top: 0.45rem;
}

.quick-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}

.action-chip {
  background: #ffffff;
  border: 1px solid var(--line);
  border-radius: 6px;
  color: var(--ink);
  cursor: pointer;
  font-size: 0.88rem;
  font-weight: 750;
  padding: 0.5rem 0.8rem;
  transition: border-color 0.2s ease, color 0.2s ease, transform 0.2s ease;
}

.action-chip:hover {
  border-color: rgba(194, 65, 12, 0.5);
  color: var(--accent);
  transform: translateY(-1px);
}

.saved-section,
.edit-section {
  padding: 1.2rem;
}

.section-title {
  align-items: center;
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
}

.section-title h3 {
  font-size: 1.25rem;
  margin-top: 0.25rem;
}

.text-link {
  color: var(--accent);
  font-size: 0.88rem;
  font-weight: 800;
  text-decoration: none;
}

.saved-grid {
  display: grid;
  gap: 0.85rem;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}

.saved-card {
  align-items: center;
  background: var(--surface-soft);
  border: 1px solid var(--line);
  border-radius: 8px;
  color: inherit;
  display: grid;
  gap: 0.8rem;
  grid-template-columns: 76px 1fr;
  padding: 0.75rem;
  text-decoration: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
}

.saved-card:hover {
  border-color: rgba(194, 65, 12, 0.38);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.saved-image,
.saved-image-placeholder {
  border-radius: 8px;
  height: 76px;
  width: 76px;
}

.saved-image {
  object-fit: cover;
}

.saved-image-placeholder {
  align-items: center;
  background: #e2e8f0;
  color: var(--muted);
  display: flex;
  font-size: 0.82rem;
  font-weight: 850;
  justify-content: center;
}

.saved-info h4 {
  font-size: 1rem;
}

.saved-info p {
  font-size: 0.9rem;
  margin-top: 0.2rem;
}

.saved-info span {
  color: var(--accent);
  display: inline-block;
  font-size: 0.82rem;
  font-weight: 800;
  margin-top: 0.25rem;
}

.edit-form {
  display: grid;
  gap: 1rem;
  max-width: 720px;
}

.form-group {
  display: grid;
  gap: 0.4rem;
}

.form-group label {
  color: var(--ink);
  font-size: 0.88rem;
  font-weight: 800;
}

.form-group input {
  border: 1px solid var(--line-strong);
  border-radius: 6px;
  color: var(--ink);
  padding: 0.7rem 0.8rem;
  width: 100%;
}

.form-group input:focus {
  border-color: var(--accent);
  outline: none;
}

@media (max-width: 980px) {
  .dashboard-topbar h2 {
    font-size: 1.85rem;
  }

  .buyer-dashboard {
    grid-template-columns: 1fr;
  }

  .dashboard-sidebar {
    min-height: auto;
    position: relative;
  }

  .side-nav {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .profile-panel,
  .buyer-details,
  .stats-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 640px) {
  .dashboard-topbar,
  .section-title {
    align-items: flex-start;
    flex-direction: column;
  }

  .side-nav,
  .profile-panel,
  .buyer-details,
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .saved-card {
    grid-template-columns: 64px 1fr;
  }

  .saved-image,
  .saved-image-placeholder {
    height: 64px;
    width: 64px;
  }
}
</style>
