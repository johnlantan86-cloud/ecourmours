<template>
  <div class="seller-dashboard">
    <aside class="dashboard-sidebar">
      <router-link to="/" class="sidebar-brand">
        <span>KGM</span>
        <strong>Kigali Great Market</strong>
      </router-link>

      <div class="seller-card">
        <img v-if="seller && seller.idphoto" :src="seller.idphoto" alt="Seller profile" class="id-photo" />
        <div v-else class="seller-photo-placeholder">
          {{ seller?.businessName?.charAt(0)?.toUpperCase() || 'S' }}
        </div>
        <h1>{{ seller?.businessName || 'Seller Dashboard' }}</h1>
        <p>{{ seller?.location || 'Location not set' }}</p>
      </div>

      <nav class="side-nav">
        <button class="side-link" @click="scrollToSection('products')">Products</button>
        <button class="side-link" @click="scrollToSection('insights')">Buyer Interest</button>
        <router-link to="/marketplace" class="side-link">All Sellers</router-link>
      </nav>

      <div class="sidebar-stats">
        <div class="seller-stat">
          <strong>{{ favoriteBuyers.length }}</strong>
          <span>buyer favorites</span>
        </div>
        <div class="seller-stat">
          <strong>{{ wishlistedProducts.length }}</strong>
          <span>wishlist products</span>
        </div>
      </div>

      <button @click="logout" class="btn btn-secondary logout-button">Logout</button>
    </aside>

    <main class="dashboard-main">
      <header class="dashboard-topbar">
        <div>
          <span class="section-kicker">Seller dashboard</span>
          <h2>Manage {{ sellerName || 'your store' }}</h2>
        </div>
        <button @click="showAddForm = true" class="btn btn-primary">Add Product</button>
      </header>

      <section id="insights" class="insights-section">
        <div class="section-title">
          <div>
            <span class="panel-label">Buyer signals</span>
            <h3>Buyer Interest</h3>
          </div>
        </div>

        <div class="insights-grid">
          <div class="insight-panel">
            <h4>Buyers Who Favorited You</h4>
            <div v-if="favoriteBuyers.length > 0" class="interest-list">
              <div v-for="buyer in favoriteBuyers" :key="buyer.id" class="interest-row">
                <span>{{ buyer.name }}</span>
                <small>{{ buyer.email }}</small>
              </div>
            </div>
            <p v-else class="empty-note">No buyers have added you to favorites yet.</p>
          </div>

          <div class="insight-panel">
            <h4>Products in Buyer Wishlists</h4>
            <div v-if="wishlistedProducts.length > 0" class="interest-list">
              <div v-for="item in wishlistedProducts" :key="`${item.buyerId}-${item.productId}`" class="interest-row">
                <span>{{ item.productName }}</span>
                <small>{{ item.buyerName }} added this product</small>
              </div>
            </div>
            <p v-else class="empty-note">No products have been added to wishlists yet.</p>
          </div>
        </div>
      </section>

      <section id="products" class="products-section">
        <div class="section-title">
          <div>
            <span class="panel-label">Store inventory</span>
            <h3>My Products</h3>
          </div>
          <button @click="showAddForm = true" class="btn btn-primary">Add Product</button>
        </div>

        <div v-if="seller && seller.products && seller.products.length > 0" class="products-grid">
          <div v-for="product in seller.products" :key="product.id" class="product-card">
            <div class="card-image">
              <img :src="product.image" :alt="product.name" />
            </div>
            <div class="card-content">
              <h4>{{ product.name }}</h4>
              <p class="description">{{ product.description || 'No description yet.' }}</p>
              <div class="product-meta">
                <strong>${{ product.price.toFixed(2) }}</strong>
                <span>{{ (product.likes || []).length }} likes</span>
              </div>
            </div>
            <div class="card-actions">
              <button @click="editProduct(product)" class="btn btn-edit">Edit</button>
              <button @click="deleteProduct(product.id)" class="btn btn-delete">Delete</button>
            </div>
          </div>
        </div>
        <div v-else class="empty-state">
          <p>No products yet. Add your first product.</p>
        </div>
      </section>
    </main>

    <div v-if="showAddForm" class="add-product-form">
      <div class="form-overlay">
        <div class="form-box">
          <div class="form-header">
            <h3>{{ editingProduct ? 'Edit Product' : 'Add New Product' }}</h3>
            <button @click="closeForm" class="close-btn" title="Close form">x</button>
          </div>

          <form @submit.prevent="saveProduct">
            <div class="form-group">
              <label for="productName">Product Name</label>
              <input v-model="newProduct.name" type="text" id="productName" required />
            </div>

            <div class="form-group">
              <label for="productPrice">Price</label>
              <input v-model.number="newProduct.price" type="number" id="productPrice" step="0.01" required />
            </div>

            <div class="form-group">
              <label for="productImage">Product Image</label>
              <input
                @change="handleImageUpload"
                type="file"
                id="productImage"
                accept="image/*"
                :required="!editingProduct"
              />
              <div v-if="newProduct.image" class="image-preview">
                <img :src="newProduct.image" alt="Product preview" />
              </div>
            </div>

            <div class="form-group">
              <label for="productDescription">Description</label>
              <textarea v-model="newProduct.description" id="productDescription" rows="4"></textarea>
            </div>

            <div class="form-actions">
              <button type="submit" class="btn btn-primary">{{ editingProduct ? 'Update' : 'Add' }} Product</button>
              <button type="button" @click="closeForm" class="btn btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { clearSession, sellersApi } from '../api.js'

const router = useRouter()
const seller = ref(null)
const sellerName = ref('')
const showAddForm = ref(false)
const editingProduct = ref(null)
const favoriteBuyers = ref([])
const wishlistedProducts = ref([])

const newProduct = ref({
  name: '',
  price: 0,
  image: '',
  description: ''
})

onMounted(() => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'))
  if (!currentUser || currentUser.type !== 'seller') {
    router.push('/seller-register')
    return
  }

  loadSeller(currentUser.id)
})

const loadSeller = async (sellerId) => {
  try {
    const [sellerData, insightData] = await Promise.all([
      sellersApi.get(sellerId),
      sellersApi.insights(sellerId)
    ])
    seller.value = sellerData.seller
    sellerName.value = sellerData.seller.businessName
    favoriteBuyers.value = insightData.favoriteBuyers
    wishlistedProducts.value = insightData.wishlistedProducts
  } catch (error) {
    alert(error.message)
    router.push('/login')
  }
}

const handleImageUpload = (e) => {
  const file = e.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (event) => {
      newProduct.value.image = event.target.result
    }
    reader.readAsDataURL(file)
  }
}

const saveProduct = async () => {
  if (!newProduct.value.name || !newProduct.value.price || !newProduct.value.image) {
    alert('Please fill in all required fields')
    return
  }

  try {
    const payload = {
      ...newProduct.value,
      price: Number(newProduct.value.price)
    }
    let data
    if (editingProduct.value) {
      data = await sellersApi.updateProduct(seller.value.id, editingProduct.value.id, payload)
    } else {
      data = await sellersApi.addProduct(seller.value.id, payload)
    }

    seller.value = data.seller
    closeForm()
  } catch (error) {
    alert(error.message)
  }
}

const editProduct = (product) => {
  editingProduct.value = product
  newProduct.value = { ...product }
  showAddForm.value = true
}

const deleteProduct = (productId) => {
  if (confirm('Are you sure you want to delete this product?')) {
    sellersApi.deleteProduct(seller.value.id, productId)
      .then((data) => {
        seller.value = data.seller
      })
      .catch((error) => alert(error.message))
  }
}

const closeForm = () => {
  showAddForm.value = false
  editingProduct.value = null
  newProduct.value = {
    name: '',
    price: 0,
    image: '',
    description: ''
  }
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
.seller-dashboard {
  background: var(--page);
  display: grid;
  grid-template-columns: 290px minmax(0, 1fr);
  min-height: 100vh;
}

.dashboard-sidebar {
  background: #111827;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  gap: 1.15rem;
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

.seller-card {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-block: 1rem;
}

.id-photo,
.seller-photo-placeholder {
  border-radius: 8px;
  height: 92px;
  width: 92px;
}

.id-photo {
  object-fit: cover;
}

.seller-photo-placeholder {
  align-items: center;
  background: #263244;
  color: #ffffff;
  display: flex;
  font-size: 2rem;
  font-weight: 850;
  justify-content: center;
}

.seller-card h1 {
  color: #ffffff;
  font-size: 1.15rem;
  margin-top: 0.8rem;
}

.seller-card p {
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

.sidebar-stats {
  display: grid;
  gap: 0.7rem;
}

.seller-stat {
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 0.85rem;
}

.seller-stat strong,
.seller-stat span {
  display: block;
}

.seller-stat strong {
  color: #ffffff;
  font-size: 1.6rem;
  line-height: 1;
}

.seller-stat span {
  color: rgba(255, 255, 255, 0.66);
  font-size: 0.82rem;
  margin-top: 0.35rem;
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

.insights-section,
.products-section {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 8px;
  box-shadow: var(--shadow-sm);
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

.panel-label {
  color: var(--accent);
  font-size: 0.76rem;
  font-weight: 850;
  text-transform: uppercase;
}

.insights-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.insight-panel {
  background: var(--surface-soft);
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 1rem;
}

.insight-panel h4 {
  font-size: 1rem;
  margin-bottom: 0.75rem;
}

.interest-list {
  display: grid;
  gap: 0.65rem;
}

.interest-row {
  background: #ffffff;
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 0.75rem;
}

.interest-row span,
.interest-row small {
  display: block;
}

.interest-row span {
  color: var(--ink);
  font-weight: 800;
}

.interest-row small {
  color: var(--muted);
  margin-top: 0.2rem;
}

.empty-note {
  background: #ffffff;
  border: 1px dashed var(--line-strong);
  border-radius: 8px;
  color: var(--muted);
  padding: 1rem;
}

.products-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
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
  height: 165px;
  overflow: hidden;
}

.card-image img {
  height: 100%;
  object-fit: cover;
  width: 100%;
}

.card-content {
  padding: 0.9rem;
}

.card-content h4 {
  font-size: 1rem;
}

.description {
  color: var(--muted);
  display: -webkit-box;
  font-size: 0.88rem;
  margin-top: 0.35rem;
  min-height: 2.6rem;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.product-meta {
  align-items: center;
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
  margin-top: 0.8rem;
}

.product-meta strong {
  color: var(--accent);
  font-size: 1.1rem;
}

.product-meta span {
  color: var(--muted);
  font-size: 0.82rem;
  font-weight: 750;
}

.card-actions {
  border-top: 1px solid var(--line);
  display: flex;
  gap: 0.5rem;
  padding: 0.75rem 0.9rem;
}

.card-actions .btn {
  flex: 1;
  min-height: 2rem;
  padding: 0.45rem 0.7rem;
}

.btn-edit {
  background: #eff6ff;
  color: var(--info);
}

.btn-edit:hover {
  background: #dbeafe;
}

.btn-delete {
  background: #fff1f2;
  color: var(--danger);
}

.btn-delete:hover {
  background: #ffe4e6;
}

.add-product-form {
  align-items: center;
  background: rgba(15, 23, 42, 0.58);
  bottom: 0;
  display: flex;
  justify-content: center;
  left: 0;
  padding: 1rem;
  position: fixed;
  right: 0;
  top: 0;
  z-index: 1000;
}

.form-overlay {
  background: white;
  border-radius: 8px;
  box-shadow: var(--shadow-lg);
  max-height: calc(100vh - 2rem);
  max-width: 560px;
  overflow: auto;
  width: 100%;
}

.form-box {
  padding: 1.25rem;
}

.form-header {
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.form-header h3 {
  font-size: 1.2rem;
}

.close-btn {
  align-items: center;
  background: #eef2f7;
  border-radius: 6px;
  color: var(--ink);
  cursor: pointer;
  display: inline-flex;
  font-weight: 850;
  height: 2rem;
  justify-content: center;
  width: 2rem;
}

.form-group {
  display: grid;
  gap: 0.4rem;
  margin-bottom: 0.9rem;
}

.form-group label {
  color: var(--ink);
  font-size: 0.88rem;
  font-weight: 800;
}

.form-group input,
.form-group textarea {
  border: 1px solid var(--line-strong);
  border-radius: 6px;
  color: var(--ink);
  padding: 0.7rem 0.8rem;
  resize: vertical;
  width: 100%;
}

.form-group input:focus,
.form-group textarea:focus {
  border-color: var(--accent);
  outline: none;
}

.image-preview {
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 0.5rem;
}

.image-preview img {
  border-radius: 6px;
  max-height: 180px;
  object-fit: cover;
  width: 100%;
}

.form-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 1.1rem;
}

@media (max-width: 980px) {
  .dashboard-topbar h2 {
    font-size: 1.85rem;
  }

  .seller-dashboard {
    grid-template-columns: 1fr;
  }

  .dashboard-sidebar {
    min-height: auto;
    position: relative;
  }

  .side-nav,
  .sidebar-stats,
  .insights-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .dashboard-topbar,
  .section-title,
  .form-actions {
    align-items: flex-start;
    flex-direction: column;
  }

  .side-nav,
  .sidebar-stats,
  .insights-grid {
    grid-template-columns: 1fr;
  }

  .form-actions .btn {
    width: 100%;
  }
}
</style>
