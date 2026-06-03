<template>
  <div class="dashboard-container">
    <nav class="navbar">
      <div class="nav-content">
        <router-link to="/" class="logo">🏪 Kigali Great Market</router-link>
        <div class="nav-links">
          <router-link to="/marketplace" class="nav-link">All Sellers</router-link>
          <span class="welcome">Welcome, {{ sellerName }}</span>
          <button @click="logout" class="btn btn-logout">Logout</button>
        </div>
      </div>
    </nav>

    <div class="dashboard-content">
      <div class="sidebar">
        <div class="seller-info">
          <img v-if="seller && seller.idphoto" :src="seller.idphoto" alt="ID Photo" class="id-photo" />
          <h3>{{ seller?.businessName }}</h3>
          <p class="location">📍 {{ seller?.location }}</p>
          <p class="phone">📞 {{ seller?.phone }}</p>
          <p class="email">✉️ {{ seller?.email }}</p>
          <div class="seller-stats">
            <div class="seller-stat">
              <strong>{{ favoriteBuyers.length }}</strong>
              <span>buyers added you to favorite</span>
            </div>
            <div class="seller-stat">
              <strong>{{ wishlistedProducts.length }}</strong>
              <span>products added to wishlists</span>
            </div>
          </div>
        </div>
      </div>

      <div class="main-content">
        <div class="insights-section">
          <h2>Buyer Interest</h2>
          <div class="insights-grid">
            <div class="insight-panel">
              <h3>Buyers Who Favorited You</h3>
              <div v-if="favoriteBuyers.length > 0" class="interest-list">
                <div v-for="buyer in favoriteBuyers" :key="buyer.id" class="interest-row">
                  <span>{{ buyer.name }}</span>
                  <small>{{ buyer.email }}</small>
                </div>
              </div>
              <p v-else class="empty-note">No buyers have added you to favorites yet.</p>
            </div>

            <div class="insight-panel">
              <h3>Products in Buyer Wishlists</h3>
              <div v-if="wishlistedProducts.length > 0" class="interest-list">
                <div v-for="item in wishlistedProducts" :key="`${item.buyerId}-${item.productId}`" class="interest-row">
                  <span>{{ item.productName }}</span>
                  <small>{{ item.buyerName }} added this product</small>
                </div>
              </div>
              <p v-else class="empty-note">No products have been added to wishlists yet.</p>
            </div>
          </div>
        </div>

        <div class="header">
          <h2>My Products</h2>
          <button @click="showAddForm = true" class="btn btn-primary">+ Add Product</button>
        </div>

        <!-- Add Product Form -->
        <div v-if="showAddForm" class="add-product-form">
          <div class="form-overlay">
            <div class="form-box">
              <div class="form-header">
                <h3>{{ editingProduct ? 'Edit Product' : 'Add New Product' }}</h3>
                <button @click="closeForm" class="close-btn">✕</button>
              </div>

              <form @submit.prevent="saveProduct">
                <div class="form-group">
                  <label for="productName">Product Name</label>
                  <input 
                    v-model="newProduct.name" 
                    type="text" 
                    id="productName"
                    required
                  />
                </div>

                <div class="form-group">
                  <label for="productPrice">Price</label>
                  <input 
                    v-model.number="newProduct.price" 
                    type="number" 
                    id="productPrice"
                    step="0.01"
                    required
                  />
                </div>

                <div class="form-group">
                  <label for="productImage">Product Image</label>
                  <input 
                    @change="handleImageUpload"
                    type="file" 
                    id="productImage"
                    accept="image/*"
                    :required="!newProduct.image"
                  />
                  <div v-if="newProduct.image" class="image-preview">
                    <img :src="newProduct.image" alt="Product" />
                  </div>
                </div>

                <div class="form-group">
                  <label for="productDescription">Description</label>
                  <textarea 
                    v-model="newProduct.description" 
                    id="productDescription"
                    rows="4"
                  ></textarea>
                </div>

                <div class="category-preview">
                  <span>Auto category</span>
                  <strong>{{ productCategoryPreview.category }}</strong>
                  <small>{{ Math.round(productCategoryPreview.categoryConfidence * 100) }}% confidence</small>
                </div>

                <div class="form-actions">
                  <button type="submit" class="btn btn-primary">{{ editingProduct ? 'Update' : 'Add' }} Product</button>
                  <button type="button" @click="closeForm" class="btn btn-secondary">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <!-- Products Grid -->
        <div class="products-grid">
          <div v-if="seller && seller.products && seller.products.length > 0">
            <div v-for="product in seller.products" :key="product.id" class="product-card">
              <div class="card-image">
                <img :src="product.image" :alt="product.name" />
              </div>
              <div class="card-content">
                <h4>{{ product.name }}</h4>
                <span class="category-tag">{{ product.category || 'General Goods' }}</span>
                <p class="description">{{ product.description }}</p>
                <div class="price">
                  <strong>${{ product.price.toFixed(2) }}</strong>
                </div>
              </div>
              <div class="card-actions">
                <button @click="editProduct(product)" class="btn btn-edit">Edit</button>
                <button @click="deleteProduct(product.id)" class="btn btn-delete">Delete</button>
              </div>
            </div>
          </div>
          <div v-else class="empty-state">
            <p>No products yet. Add your first product!</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { classifyProduct, enrichProduct } from '../utils/marketIntelligence.js'

const router = useRouter()
const seller = ref(null)
const sellerName = ref('')
const showAddForm = ref(false)
const editingProduct = ref(null)
const buyers = ref([])

const newProduct = ref({
  name: '',
  price: 0,
  image: '',
  description: ''
})

const productCategoryPreview = computed(() => classifyProduct(newProduct.value))

onMounted(() => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'))
  if (!currentUser || currentUser.type !== 'seller') {
    router.push('/seller-register')
    return
  }

  loadSeller(currentUser.id)
})

const loadSeller = (sellerId) => {
  const sellers = JSON.parse(localStorage.getItem('sellers') || '[]')
  buyers.value = JSON.parse(localStorage.getItem('buyers') || '[]')
  const foundSeller = sellers.find(s => s.id === sellerId)
  
  if (foundSeller) {
    foundSeller.products = (foundSeller.products || []).map(enrichProduct)
    seller.value = foundSeller
    sellerName.value = foundSeller.businessName

    const sellerIndex = sellers.findIndex(s => s.id === sellerId)
    if (sellerIndex !== -1) {
      sellers[sellerIndex] = foundSeller
      localStorage.setItem('sellers', JSON.stringify(sellers))
    }
  }
}

const favoriteBuyers = computed(() => {
  if (!seller.value) return []
  return buyers.value.filter(buyer => (buyer.favoriteSellers || []).includes(seller.value.id))
})

const wishlistedProducts = computed(() => {
  if (!seller.value) return []

  return buyers.value.flatMap(buyer => {
    return (buyer.wishlist || [])
      .filter(item => item.sellerId === seller.value.id)
      .map(item => {
        const product = seller.value.products?.find(p => p.id === item.productId)
        return {
          ...item,
          buyerId: buyer.id,
          buyerName: buyer.name,
          productName: product?.name || item.productName
        }
      })
  })
})

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

const saveProduct = () => {
  if (!newProduct.value.name || !newProduct.value.price || !newProduct.value.image) {
    alert('Please fill in all required fields')
    return
  }

  const sellers = JSON.parse(localStorage.getItem('sellers') || '[]')
  const sellerIndex = sellers.findIndex(s => s.id === seller.value.id)

  if (sellerIndex !== -1) {
    if (editingProduct.value) {
      // Update existing product
      const productIndex = sellers[sellerIndex].products.findIndex(p => p.id === editingProduct.value.id)
      if (productIndex !== -1) {
        const existingProduct = sellers[sellerIndex].products[productIndex]
        sellers[sellerIndex].products[productIndex] = {
          ...enrichProduct({
            ...existingProduct,
            ...newProduct.value,
            id: editingProduct.value.id
          })
        }
      }
    } else {
      // Add new product
      const product = enrichProduct({
        id: Date.now(),
        ...newProduct.value,
        likes: [],
        comments: []
      })
      sellers[sellerIndex].products.push(product)
    }

    localStorage.setItem('sellers', JSON.stringify(sellers))
    seller.value = sellers[sellerIndex]
    closeForm()
  }
}

const editProduct = (product) => {
  editingProduct.value = product
  newProduct.value = { ...product }
  showAddForm.value = true
}

const deleteProduct = (productId) => {
  if (confirm('Are you sure you want to delete this product?')) {
    const sellers = JSON.parse(localStorage.getItem('sellers') || '[]')
    const sellerIndex = sellers.findIndex(s => s.id === seller.value.id)

    if (sellerIndex !== -1) {
      sellers[sellerIndex].products = sellers[sellerIndex].products.filter(p => p.id !== productId)
      localStorage.setItem('sellers', JSON.stringify(sellers))
      seller.value = sellers[sellerIndex]
    }
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

const logout = () => {
  localStorage.removeItem('currentUser')
  router.push('/')
}
</script>

<style scoped>
.dashboard-container {
  min-height: 100vh;
  background: #f8f9fa;
}

.navbar {
  background: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: 1rem 2rem;
}

.nav-content {
  max-width: 1400px;
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
  align-items: center;
  gap: 2rem;
}

.welcome {
  color: #2c3e50;
  font-weight: 600;
}

.btn-logout {
  background: #e74c3c;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.dashboard-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 2rem;
}

.sidebar {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  height: fit-content;
  position: sticky;
  top: 100px;
}

.seller-info {
  text-align: center;
}

.id-photo {
  width: 150px;
  height: 150px;
  border-radius: 8px;
  object-fit: cover;
  margin-bottom: 1rem;
  border: 3px solid #e74c3c;
}

.seller-info h3 {
  color: #2c3e50;
  margin: 1rem 0;
}

.seller-info p {
  color: #666;
  margin: 0.5rem 0;
  font-size: 0.9rem;
}

.seller-stats {
  margin-top: 1.5rem;
  display: grid;
  gap: 0.75rem;
}

.seller-stat {
  background: #f8f9fa;
  border-left: 4px solid #e74c3c;
  border-radius: 6px;
  padding: 0.75rem;
  text-align: left;
}

.seller-stat strong,
.seller-stat span {
  display: block;
}

.seller-stat strong {
  color: #2c3e50;
  font-size: 1.5rem;
}

.seller-stat span {
  color: #666;
  font-size: 0.85rem;
}

.main-content {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.insights-section {
  margin-bottom: 2rem;
}

.insights-section h2 {
  color: #2c3e50;
  margin: 0 0 1rem;
}

.insights-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1rem;
}

.insight-panel {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1rem;
}

.insight-panel h3 {
  color: #2c3e50;
  margin: 0 0 1rem;
  font-size: 1rem;
}

.interest-list {
  display: grid;
  gap: 0.75rem;
}

.interest-row {
  background: #f8f9fa;
  border-radius: 6px;
  padding: 0.75rem;
}

.interest-row span,
.interest-row small {
  display: block;
}

.interest-row span {
  color: #2c3e50;
  font-weight: 700;
}

.interest-row small {
  color: #666;
  margin-top: 0.25rem;
}

.empty-note {
  background: #f8f9fa;
  border-radius: 6px;
  color: #777;
  margin: 0;
  padding: 1rem;
}

.header h2 {
  color: #2c3e50;
  margin: 0;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary {
  background: #e74c3c;
  color: white;
}

.btn-primary:hover {
  background: #c0392b;
}

.btn-secondary {
  background: #bdc3c7;
  color: white;
}

.btn-secondary:hover {
  background: #95a5a6;
}

.btn-edit {
  background: #3498db;
  color: white;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
}

.btn-delete {
  background: #e74c3c;
  color: white;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
}

/* Add Product Form */
.add-product-form {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.form-overlay {
  width: 100%;
  max-width: 500px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.2);
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateY(-50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.form-box {
  padding: 2rem;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.form-header h3 {
  color: #2c3e50;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
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

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  font-family: inherit;
  box-sizing: border-box;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #e74c3c;
}

.image-preview {
  margin-top: 1rem;
  border: 2px solid #ddd;
  border-radius: 4px;
  padding: 1rem;
  text-align: center;
}

.image-preview img {
  max-width: 100%;
  max-height: 200px;
  border-radius: 4px;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.category-preview {
  background: #f8f9fa;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  display: grid;
  gap: 0.25rem;
  padding: 0.85rem;
}

.category-preview span,
.category-preview small {
  color: #666;
  font-size: 0.85rem;
}

.category-preview strong {
  color: #2c3e50;
}

.form-actions button {
  flex: 1;
}

/* Products Grid */
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
  height: 200px;
  overflow: hidden;
  background: #f0f0f0;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-content {
  padding: 1rem;
}

.card-content h4 {
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
  margin-bottom: 0.5rem;
  padding: 0.25rem 0.55rem;
}

.description {
  color: #666;
  font-size: 0.9rem;
  margin: 0.5rem 0;
  max-height: 60px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.price {
  color: #e74c3c;
  font-size: 1.3rem;
  margin: 0.5rem 0;
}

.card-actions {
  padding: 0 1rem 1rem 1rem;
  display: flex;
  gap: 0.5rem;
}

.card-actions .btn {
  flex: 1;
  padding: 0.5rem;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #666;
}

@media (max-width: 768px) {
  .dashboard-content {
    grid-template-columns: 1fr;
  }

  .sidebar {
    position: relative;
    top: 0;
  }

  .header {
    flex-direction: column;
    gap: 1rem;
  }

  .products-grid {
    grid-template-columns: 1fr;
  }
}
</style>
