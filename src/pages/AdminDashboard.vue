<template>
  <div class="admin-dashboard-container">
    <!-- Navbar -->
    <div class="navbar">
      <div class="nav-content">
        <router-link to="/" class="logo">🏪 Kigali Great Market</router-link>
        <div class="nav-links">
          <span class="admin-badge">👤 Admin: {{ currentAdmin }}</span>
          <button @click="logoutAdmin" class="btn btn-secondary">Logout</button>
        </div>
      </div>
    </div>

    <!-- Admin Dashboard -->
    <div class="dashboard-wrapper">
      <div class="dashboard-header">
        <h1>📊 Admin Control Panel</h1>
        <p class="subtitle">Monitor and manage all users on the platform</p>
      </div>

      <!-- Stats -->
      <div class="stats-container">
        <div class="stat-card">
          <div class="stat-icon">👥</div>
          <div class="stat-content">
            <div class="stat-label">Total Buyers</div>
            <div class="stat-value">{{ buyers.length }}</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🏪</div>
          <div class="stat-content">
            <div class="stat-label">Total Sellers</div>
            <div class="stat-value">{{ sellers.length }}</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">📈</div>
          <div class="stat-content">
            <div class="stat-label">Total Users</div>
            <div class="stat-value">{{ buyers.length + sellers.length }}</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">&#9888;</div>
          <div class="stat-content">
            <div class="stat-label">Product Reports</div>
            <div class="stat-value">{{ productReports.length }}</div>
          </div>
        </div>
      </div>

      <!-- Product Reports Section -->
      <div class="users-section">
        <div class="section-header">
          <h2>&#9888; Product Reports ({{ productReports.length }})</h2>
        </div>

        <div v-if="productReports.length > 0" class="reports-list">
          <div v-for="report in productReports" :key="report.id" class="report-card">
            <div class="report-main">
              <h3>{{ report.productName }}</h3>
              <p><strong>Seller:</strong> {{ report.sellerName }}</p>
              <p><strong>Reported by:</strong> {{ report.reporterName }} ({{ report.reporterEmail }})</p>
              <p><strong>Date:</strong> {{ formatDate(report.createdAt) }}</p>
              <p class="report-reason"><strong>Reason:</strong> {{ report.reason }}</p>
            </div>
            <button @click="deleteProductReport(report.id)" class="btn btn-danger btn-small">Remove Report</button>
          </div>
        </div>
        <div v-else class="empty-state">
          <p>No product reports yet</p>
        </div>
      </div>

      <!-- Buyers Section -->
      <div class="users-section">
        <div class="section-header">
          <h2>👥 Registered Buyers ({{ buyers.length }})</h2>
        </div>
        
        <div v-if="buyers.length > 0" class="users-table">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Location</th>
                <th>ID Number</th>
                <th>Password</th>
                <th>Registered</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="buyer in buyers" :key="buyer.id">
                <td class="id-cell">{{ buyer.id }}</td>
                <td>{{ buyer.name }}</td>
                <td>{{ buyer.email }}</td>
                <td>{{ buyer.phone }}</td>
                <td>{{ buyer.location }}</td>
                <td>{{ buyer.idnumber }}</td>
                <td>{{ buyer.password }}</td>
                <td>{{ formatDate(buyer.registeredAt) }}</td>
                <td>
                  <button @click="deleteUser('buyer', buyer.id)" class="btn btn-danger btn-small">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="empty-state">
          <p>No buyers registered yet</p>
        </div>
      </div>

      <!-- Sellers Section -->
      <div class="users-section">
        <div class="section-header">
          <h2>🏪 Registered Sellers ({{ sellers.length }})</h2>
        </div>
        
        <div v-if="sellers.length > 0" class="users-table">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Business</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Location</th>
                <th>ID Number</th>
                <th>Password</th>
                <th>Registered</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="seller in sellers" :key="seller.id">
                <td class="id-cell">{{ seller.id }}</td>
                <td>{{ seller.name }}</td>
                <td>{{ seller.businessName }}</td>
                <td>{{ seller.email }}</td>
                <td>{{ seller.phone }}</td>
                <td>{{ seller.location }}</td>
                <td>{{ seller.idnumber }}</td>
                <td>{{ seller.password }}</td>
                <td>{{ formatDate(seller.registeredAt) }}</td>
                <td>
                  <button @click="deleteUser('seller', seller.id)" class="btn btn-danger btn-small">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="empty-state">
          <p>No sellers registered yet</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const currentAdmin = ref('Admin')
const buyers = ref([])
const sellers = ref([])
const productReports = ref([])

onMounted(() => {
  // Verify admin is logged in
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null')
  if (!currentUser || currentUser.type !== 'admin') {
    router.push('/admin-login')
    return
  }

  currentAdmin.value = currentUser.name
  loadUsers()
})

const loadUsers = () => {
  buyers.value = JSON.parse(localStorage.getItem('buyers') || '[]')
  sellers.value = JSON.parse(localStorage.getItem('sellers') || '[]')
  productReports.value = JSON.parse(localStorage.getItem('productReports') || '[]')
}

const deleteUser = (type, userId) => {
  const confirmed = confirm(`Are you sure you want to delete this ${type}? This action cannot be undone.`)
  
  if (!confirmed) return

  if (type === 'buyer') {
    buyers.value = buyers.value.filter(b => b.id !== userId)
    localStorage.setItem('buyers', JSON.stringify(buyers.value))
    alert('Buyer deleted successfully')
  } else if (type === 'seller') {
    sellers.value = sellers.value.filter(s => s.id !== userId)
    localStorage.setItem('sellers', JSON.stringify(sellers.value))
    alert('Seller deleted successfully')
  }
  
  loadUsers()
}

const logoutAdmin = () => {
  localStorage.removeItem('currentUser')
  router.push('/')
}

const deleteProductReport = (reportId) => {
  productReports.value = productReports.value.filter(report => report.id !== reportId)
  localStorage.setItem('productReports', JSON.stringify(productReports.value))
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
}
</script>

<style scoped>
.admin-dashboard-container {
  min-height: 100vh;
  background: #f0f2f5;
}

.navbar {
  background: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  padding: 1rem 2rem;
  position: sticky;
  top: 0;
  z-index: 100;
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
  gap: 1.5rem;
}

.admin-badge {
  background: #667eea;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
}

.dashboard-wrapper {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

.dashboard-header {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.dashboard-header h1 {
  margin: 0 0 0.5rem;
  color: #2c3e50;
  font-size: 2rem;
}

.subtitle {
  color: #7f8c8d;
  margin: 0;
  font-size: 0.95rem;
}

.stats-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  display: flex;
  align-items: center;
  gap: 1rem;
  border-left: 4px solid #667eea;
}

.stat-icon {
  font-size: 2rem;
}

.stat-content {
  flex: 1;
}

.stat-label {
  color: #7f8c8d;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}

.stat-value {
  font-size: 2rem;
  font-weight: bold;
  color: #2c3e50;
}

.users-section {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  margin-bottom: 2rem;
}

.section-header {
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #f0f2f5;
  padding-bottom: 1rem;
}

.section-header h2 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.3rem;
}

.users-table {
  overflow-x: auto;
}

.reports-list {
  display: grid;
  gap: 1rem;
}

.report-card {
  align-items: start;
  background: #fff8ed;
  border: 1px solid #f6c36b;
  border-left: 4px solid #e74c3c;
  border-radius: 8px;
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr auto;
  padding: 1rem;
}

.report-main h3 {
  color: #2c3e50;
  margin: 0 0 0.65rem;
}

.report-main p {
  color: #34495e;
  margin: 0.35rem 0;
}

.report-reason {
  background: white;
  border-radius: 6px;
  padding: 0.75rem;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

thead {
  background: #f8f9fa;
  border-bottom: 2px solid #e0e0e0;
}

th {
  padding: 1rem;
  text-align: left;
  color: #2c3e50;
  font-weight: 600;
}

td {
  padding: 1rem;
  border-bottom: 1px solid #f0f2f5;
  color: #34495e;
}

tr:hover {
  background: #f8f9fa;
}

.id-cell {
  font-family: monospace;
  font-size: 0.85rem;
  color: #7f8c8d;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: #7f8c8d;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-danger {
  background: #e74c3c;
  color: white;
}

.btn-danger:hover {
  background: #c0392b;
  transform: translateY(-2px);
}

.btn-secondary {
  background: #95a5a6;
  color: white;
}

.btn-secondary:hover {
  background: #7f8c8d;
}

.btn-small {
  padding: 0.4rem 0.8rem;
  font-size: 0.85rem;
}

@media (max-width: 768px) {
  .report-card {
    grid-template-columns: 1fr;
  }
}
</style>
