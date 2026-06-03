<template>
  <div class="buyer-dashboard-container">
    <!-- Navbar -->
    <nav class="navbar">
      <div class="nav-content">
        <router-link to="/" class="logo">🏪 Kigali Great Market</router-link>
        <div class="nav-links">
          <router-link to="/marketplace" class="nav-link">Browse Sellers</router-link>
          <button @click="logout" class="btn btn-secondary">Logout</button>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="dashboard-content">
      <!-- Profile Section -->
      <div class="profile-section">
        <div class="profile-card">
          <div class="profile-picture-wrapper">
            <img v-if="buyer.profilePicture" :src="buyer.profilePicture" alt="Profile" class="profile-picture">
            <div v-else class="profile-picture-placeholder">
              <span class="placeholder-icon">👤</span>
            </div>
            <label class="upload-button">
              <input type="file" @change="handleProfilePictureUpload" accept="image/*" style="display: none;">
              📷 Change Picture
            </label>
          </div>

          <div class="profile-info">
            <h1>{{ buyer.name }}</h1>
            <div class="buyer-details">
              <div class="detail-item">
                <span class="label">📧 Email:</span>
                <span class="value">{{ buyer.email }}</span>
              </div>
              <div class="detail-item">
                <span class="label">📱 Phone:</span>
                <span class="value">{{ buyer.phone }}</span>
              </div>
              <div class="detail-item">
                <span class="label">📍 Location:</span>
                <span class="value">{{ buyer.location }}</span>
              </div>
              <div class="detail-item">
                <span class="label">🆔 ID Number:</span>
                <span class="value">{{ buyer.idnumber }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="quick-actions">
        <h2>Available Actions</h2>
        <div class="actions-grid">
          <router-link to="/marketplace" class="action-card">
            <div class="action-icon">🛍️</div>
            <h3>Browse All Sellers</h3>
            <p>Explore all registered sellers and their products</p>
          </router-link>

          <div class="action-card" @click="scrollToSection('favorite-sellers')">
            <div class="action-icon">⭐</div>
            <h3>Favorite Sellers</h3>
            <p>View your saved favorite sellers</p>
          </div>

          <div class="action-card" @click="viewPurchaseHistory">
            <div class="action-icon">📦</div>
            <h3>Purchase History</h3>
            <p>Track your past purchases and orders</p>
          </div>

          <div class="action-card" @click="scrollToSection('wishlist')">
            <div class="action-icon">❤️</div>
            <h3>Wishlist</h3>
            <p>View your saved items and products</p>
          </div>
        </div>
      </div>

      <!-- Statistics -->
      <div class="statistics-section">
        <h2>Your Activity</h2>
        <div class="stats-grid">
          <div class="stat-box">
            <div class="stat-icon">👥</div>
            <div class="stat-info">
              <span class="stat-label">Favorite Sellers</span>
              <span class="stat-value">{{ favoriteSellerDetails.length }}</span>
            </div>
          </div>

          <div class="stat-box">
            <div class="stat-icon">🛍️</div>
            <div class="stat-info">
              <span class="stat-label">Total Purchases</span>
              <span class="stat-value">0</span>
            </div>
          </div>

          <div class="stat-box">
            <div class="stat-icon">⭐</div>
            <div class="stat-info">
              <span class="stat-label">Wishlist Products</span>
              <span class="stat-value">{{ wishlistDetails.length }}</span>
            </div>
          </div>

          <div class="stat-box">
            <div class="stat-icon">💬</div>
            <div class="stat-info">
              <span class="stat-label">Unread Messages</span>
              <span class="stat-value">0</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Favorite Sellers -->
      <div id="favorite-sellers" class="saved-section">
        <h2>Favorite Sellers</h2>
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
              <h3>{{ seller.businessName }}</h3>
              <p>{{ seller.location }}</p>
              <span>View seller profile</span>
            </div>
          </router-link>
        </div>
        <div v-else class="mini-empty">
          <p>No favorite sellers yet.</p>
        </div>
      </div>

      <!-- Wishlist -->
      <div id="wishlist" class="saved-section">
        <h2>Wishlist</h2>
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
              <h3>{{ item.productName }}</h3>
              <p>${{ Number(item.productPrice).toFixed(2) }}</p>
              <span>From {{ item.sellerName }}</span>
            </div>
          </router-link>
        </div>
        <div v-else class="mini-empty">
          <p>No wishlist products yet.</p>
        </div>
      </div>

      <!-- Edit Profile -->
      <div class="edit-section">
        <h2>Edit Profile</h2>
        <button @click="toggleEditMode" class="btn btn-primary">
          {{ editMode ? 'Cancel' : 'Edit Profile Information' }}
        </button>

        <div v-if="editMode" class="edit-form">
          <div class="form-group">
            <label>Phone Number</label>
            <input v-model="buyer.phone" type="tel" placeholder="Enter phone number">
          </div>

          <div class="form-group">
            <label>Short Location Name</label>
            <input v-model="buyer.location" list="profile-location-options" type="text" placeholder="Enter location">
            <datalist id="profile-location-options">
              <option v-for="location in shortLocationOptions" :key="location" :value="location" />
            </datalist>
          </div>

          <div class="location-panel">
            <div class="location-grid">
              <div class="form-group">
                <label>Province / City</label>
                <input v-model="buyer.locationMeta.province" list="profile-province-options" type="text">
                <datalist id="profile-province-options">
                  <option v-for="province in provinceOptions" :key="province" :value="province" />
                </datalist>
              </div>

              <div class="form-group">
                <label>District</label>
                <input
                  v-model="buyer.locationMeta.district"
                  list="profile-district-options"
                  type="text"
                  @change="syncProvinceFromDistrict"
                >
                <datalist id="profile-district-options">
                  <option v-for="district in districtOptions" :key="district" :value="district" />
                </datalist>
              </div>

              <div class="form-group">
                <label>Sector</label>
                <input
                  v-model="buyer.locationMeta.sector"
                  list="profile-sector-options"
                  type="text"
                  @change="syncDistrictFromSector"
                >
                <datalist id="profile-sector-options">
                  <option v-for="sector in sectorOptions" :key="sector" :value="sector" />
                </datalist>
              </div>

              <div class="form-group">
                <label>Cell</label>
                <input v-model="buyer.locationMeta.cell" list="profile-cell-options" type="text">
                <datalist id="profile-cell-options">
                  <option v-for="cell in cellOptions" :key="cell" :value="cell" />
                </datalist>
              </div>

              <div class="form-group">
                <label>Village</label>
                <input v-model="buyer.locationMeta.village" list="profile-village-options" type="text">
                <datalist id="profile-village-options">
                  <option v-for="village in villageOptions" :key="village" :value="village" />
                </datalist>
              </div>

              <div class="form-group">
                <label>Street / Building</label>
                <input v-model="buyer.locationMeta.addressLine" list="profile-address-options" type="text">
                <datalist id="profile-address-options">
                  <option v-for="address in addressOptions" :key="address" :value="address" />
                </datalist>
              </div>

              <div class="form-group">
                <label>Latitude</label>
                <input v-model="buyer.locationMeta.latitude" type="number" step="0.000001">
              </div>

              <div class="form-group">
                <label>Longitude</label>
                <input v-model="buyer.locationMeta.longitude" type="number" step="0.000001">
              </div>
            </div>

            <button type="button" class="btn-location" @click="useCurrentPosition" :disabled="locating">
              {{ locating ? 'Getting location...' : 'Use Current Position' }}
            </button>
          </div>

          <button @click="saveProfile" class="btn btn-primary">Save Changes</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  RWANDA_DISTRICTS,
  buildLocationMeta,
  formatLocation,
  getDistrictOptions,
  getProvinceOptions,
  getSavedLocationOptions,
  getSectorOptions
} from '../utils/marketIntelligence.js'

const router = useRouter()
const locating = ref(false)
const savedLocationRecords = ref([])
const buyer = ref({
  id: '',
  name: '',
  email: '',
  phone: '',
  location: '',
  locationMeta: {
    province: 'Kigali',
    district: '',
    sector: '',
    cell: '',
    village: '',
    addressLine: '',
    latitude: '',
    longitude: ''
  },
  idnumber: '',
  profilePicture: ''
})
const editMode = ref(false)
const sellers = ref([])

const mergeOptions = (...groups) => {
  return [...new Set(groups.flat().map((item) => String(item || '').trim()).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b))
}

const shortLocationOptions = computed(() => getSavedLocationOptions(savedLocationRecords.value, 'location'))
const provinceOptions = computed(() => mergeOptions(['Kigali'], getProvinceOptions(), getSavedLocationOptions(savedLocationRecords.value, 'province')))
const districtOptions = computed(() => mergeOptions(getDistrictOptions(buyer.value.locationMeta?.province), getSavedLocationOptions(savedLocationRecords.value, 'district')))
const sectorOptions = computed(() => mergeOptions(getSectorOptions(buyer.value.locationMeta?.district), getSavedLocationOptions(savedLocationRecords.value, 'sector')))
const cellOptions = computed(() => getSavedLocationOptions(savedLocationRecords.value, 'cell'))
const villageOptions = computed(() => getSavedLocationOptions(savedLocationRecords.value, 'village'))
const addressOptions = computed(() => getSavedLocationOptions(savedLocationRecords.value, 'addressLine'))

const clean = (value = '') => String(value).trim().toLowerCase()

const syncProvinceFromDistrict = () => {
  const district = RWANDA_DISTRICTS.find((item) => clean(item.district) === clean(buyer.value.locationMeta?.district))
  if (district) {
    buyer.value.locationMeta.province = district.province
  }
}

const syncDistrictFromSector = () => {
  const district = RWANDA_DISTRICTS.find((item) => {
    return Object.keys(item.sectors || {}).some((sector) => clean(sector) === clean(buyer.value.locationMeta?.sector))
  })

  if (district) {
    buyer.value.locationMeta.district = buyer.value.locationMeta.district || district.district
    buyer.value.locationMeta.province = buyer.value.locationMeta.province || district.province
  }
}

onMounted(() => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null')
  
  // Check if user is logged in and is a buyer
  if (!currentUser || currentUser.type !== 'buyer') {
    router.push('/login')
    return
  }

  loadBuyerProfile()
})

const loadBuyerProfile = () => {
  const buyers = JSON.parse(localStorage.getItem('buyers') || '[]')
  sellers.value = JSON.parse(localStorage.getItem('sellers') || '[]')
  savedLocationRecords.value = [...buyers, ...sellers.value]
  const currentUser = JSON.parse(localStorage.getItem('currentUser'))
  
  const foundBuyer = buyers.find(b => b.id === currentUser.id)
  if (foundBuyer) {
    buyer.value = {
      ...foundBuyer,
      locationMeta: {
        province: 'Kigali',
        district: '',
        sector: '',
        cell: '',
        village: '',
        addressLine: '',
        latitude: '',
        longitude: '',
        ...(foundBuyer.locationMeta || {}),
        location: foundBuyer.location
      },
      favoriteSellers: foundBuyer.favoriteSellers || [],
      wishlist: foundBuyer.wishlist || []
    }
  }
}

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
      saveBuyerProfile()
    }
    reader.readAsDataURL(file)
  }
}

const saveBuyerProfile = () => {
  const buyers = JSON.parse(localStorage.getItem('buyers') || '[]')
  const buyerIndex = buyers.findIndex(b => b.id === buyer.value.id)
  
  if (buyerIndex !== -1) {
    buyers[buyerIndex] = buyer.value
    localStorage.setItem('buyers', JSON.stringify(buyers))
  }
}

const saveProfile = () => {
  const locationMeta = buildLocationMeta({
    ...(buyer.value.locationMeta || {}),
    location: buyer.value.location
  })
  buyer.value.locationMeta = locationMeta
  buyer.value.location = formatLocation(locationMeta)
  saveBuyerProfile()
  editMode.value = false
  alert('Profile updated successfully!')
}

const useCurrentPosition = () => {
  if (!navigator.geolocation) {
    alert('Current position is not available in this browser.')
    return
  }

  locating.value = true
  navigator.geolocation.getCurrentPosition(
    (position) => {
      buyer.value.locationMeta = {
        ...(buyer.value.locationMeta || {}),
        latitude: Number(position.coords.latitude.toFixed(6)),
        longitude: Number(position.coords.longitude.toFixed(6))
      }
      locating.value = false
    },
    () => {
      locating.value = false
      alert('Could not get your current position. You can still enter the address manually.')
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
  )
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
  localStorage.removeItem('currentUser')
  router.push('/')
}
</script>

<style scoped>
.buyer-dashboard-container {
  min-height: 100vh;
  background: #f8f9fa;
}

.navbar {
  background: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 100;
  padding: 1rem 2rem;
}

.nav-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 1.5rem;
  color: #2c3e50;
  text-decoration: none;
  font-weight: 600;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.nav-link {
  color: #666;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
}

.nav-link:hover {
  color: #3498db;
}

.dashboard-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.profile-section {
  margin-bottom: 3rem;
}

.profile-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 2rem;
  align-items: start;
}

.profile-picture-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.profile-picture {
  width: 180px;
  height: 180px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #3498db;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.profile-picture-placeholder {
  width: 180px;
  height: 180px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 4px solid #e0e0e0;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.placeholder-icon {
  font-size: 4rem;
}

.upload-button {
  background: #3498db;
  color: white;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s;
  text-align: center;
}

.upload-button:hover {
  background: #2980b9;
  transform: translateY(-2px);
}

.profile-info h1 {
  margin: 0 0 1.5rem;
  color: #2c3e50;
  font-size: 2rem;
}

.buyer-details {
  display: grid;
  gap: 1rem;
}

.detail-item {
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 1rem;
}

.label {
  font-weight: 600;
  color: #2c3e50;
}

.value {
  color: #666;
  word-break: break-word;
}

.quick-actions {
  margin-bottom: 3rem;
}

.quick-actions h2 {
  margin-bottom: 1.5rem;
  color: #2c3e50;
  font-size: 1.5rem;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.action-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  text-decoration: none;
  color: inherit;
  border: 2px solid transparent;
}

.action-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.15);
  border-color: #3498db;
}

.action-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.action-card h3 {
  margin: 1rem 0;
  color: #2c3e50;
}

.action-card p {
  color: #7f8c8d;
  font-size: 0.9rem;
}

.statistics-section {
  margin-bottom: 3rem;
}

.statistics-section h2 {
  margin-bottom: 1.5rem;
  color: #2c3e50;
  font-size: 1.5rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.stat-box {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  gap: 1.5rem;
  border-left: 4px solid #3498db;
}

.stat-icon {
  font-size: 2rem;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-label {
  color: #7f8c8d;
  font-size: 0.9rem;
}

.stat-value {
  font-size: 1.8rem;
  font-weight: bold;
  color: #2c3e50;
}

.saved-section {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  margin-bottom: 3rem;
}

.saved-section h2 {
  margin: 0 0 1.5rem;
  color: #2c3e50;
}

.saved-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
}

.saved-card {
  display: grid;
  grid-template-columns: 90px 1fr;
  gap: 1rem;
  align-items: center;
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s;
}

.saved-card:hover {
  border-color: #3498db;
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(0,0,0,0.1);
}

.saved-image,
.saved-image-placeholder {
  width: 90px;
  height: 90px;
  border-radius: 8px;
}

.saved-image {
  object-fit: cover;
}

.saved-image-placeholder {
  background: #ecf0f1;
  color: #7f8c8d;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}

.saved-info h3 {
  color: #2c3e50;
  font-size: 1rem;
  margin: 0 0 0.4rem;
}

.saved-info p {
  color: #666;
  margin: 0 0 0.4rem;
}

.saved-info span {
  color: #3498db;
  font-size: 0.9rem;
  font-weight: 600;
}

.mini-empty {
  background: #f8f9fa;
  border-radius: 8px;
  color: #7f8c8d;
  padding: 1.5rem;
  text-align: center;
}

.edit-section {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.edit-section h2 {
  margin-bottom: 1.5rem;
  color: #2c3e50;
}

.edit-form {
  margin-top: 1.5rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.location-panel {
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  padding: 1rem;
}

.location-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #2c3e50;
  font-weight: 600;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: #3498db;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 0.95rem;
}

.btn-primary {
  background: #3498db;
  color: white;
}

.btn-primary:hover {
  background: #2980b9;
  transform: translateY(-2px);
}

.btn-secondary {
  background: #95a5a6;
  color: white;
}

.btn-secondary:hover {
  background: #7f8c8d;
}

.btn-location {
  background: #fff;
  border: 1px solid #3498db;
  border-radius: 6px;
  color: #2471a3;
  cursor: pointer;
  font-weight: 700;
  padding: 0.7rem 1rem;
  width: auto;
}

.btn-location:disabled {
  cursor: wait;
  opacity: 0.7;
}

@media (max-width: 768px) {
  .profile-card {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .detail-item {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .nav-content {
    flex-direction: column;
    gap: 1rem;
  }

  .nav-links {
    flex-direction: column;
    width: 100%;
  }

  .nav-link {
    width: 100%;
    text-align: center;
  }

  .location-grid {
    grid-template-columns: 1fr;
  }
}
</style>
