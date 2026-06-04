<template>
  <div class="admin-dashboard">
    <aside class="dashboard-sidebar">
      <router-link to="/" class="sidebar-brand">
        <span>KGM</span>
        <strong>Kigali Great Market</strong>
      </router-link>
      <div class="sidebar-role">Admin workspace</div>

      <div class="admin-card">
        <span class="admin-avatar">A</span>
        <div>
          <h1>{{ currentAdmin }}</h1>
          <p>Marketplace operations</p>
        </div>
      </div>

      <nav class="side-nav">
        <router-link to="/" class="side-link">Home</router-link>
        <router-link to="/marketplace" class="side-link">Marketplace</router-link>
        <button
          type="button"
          class="side-link"
          :class="{ active: activeView === 'overview' }"
          @click="setActiveView('overview')"
        >
          Overview
        </button>
        <button
          type="button"
          class="side-link"
          :class="{ active: activeView === 'reports' }"
          @click="setActiveView('reports')"
        >
          Reports
        </button>
        <button
          type="button"
          class="side-link"
          :class="{ active: activeView === 'buyers' }"
          @click="setActiveView('buyers')"
        >
          Buyers
        </button>
        <button
          type="button"
          class="side-link"
          :class="{ active: activeView === 'sellers' }"
          @click="setActiveView('sellers')"
        >
          Sellers
        </button>
      </nav>

      <button @click="logoutAdmin" class="btn btn-secondary logout-button">Logout</button>
    </aside>

    <main class="dashboard-main">
      <header class="dashboard-topbar">
        <div>
          <span class="section-kicker">{{ activeViewMeta.kicker }}</span>
          <h2>{{ activeViewMeta.title }}</h2>
          <p>{{ activeViewMeta.description }}</p>
        </div>
      </header>

      <section v-if="activeView === 'overview'" class="dashboard-panel panel-stack">
        <div class="stats-container">
          <div class="stat-card">
            <span>Total Buyers</span>
            <strong>{{ buyers.length }}</strong>
          </div>
          <div class="stat-card">
            <span>Total Sellers</span>
            <strong>{{ sellers.length }}</strong>
          </div>
          <div class="stat-card">
            <span>Total Users</span>
            <strong>{{ buyers.length + sellers.length }}</strong>
          </div>
          <div class="stat-card danger-stat">
            <span>Product Reports</span>
            <strong>{{ productReports.length }}</strong>
          </div>
        </div>

        <div class="quick-actions">
          <button type="button" class="action-chip" @click="setActiveView('reports')">Review reports</button>
          <button type="button" class="action-chip" @click="setActiveView('buyers')">Manage buyers</button>
          <button type="button" class="action-chip" @click="setActiveView('sellers')">Manage sellers</button>
          <router-link to="/marketplace" class="action-chip">Open marketplace</router-link>
        </div>
      </section>

      <section v-else-if="activeView === 'reports'" class="users-section">
        <div class="section-header">
          <div>
            <span class="panel-label">Trust and safety</span>
            <h3>Product Reports ({{ productReports.length }})</h3>
          </div>
        </div>

        <div v-if="productReports.length > 0" class="reports-list">
          <div v-for="report in productReports" :key="report.id" class="report-card">
            <div class="report-main">
              <h4>{{ report.productName }}</h4>
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
      </section>

      <section v-else-if="activeView === 'buyers'" class="users-section">
        <div class="section-header">
          <div>
            <span class="panel-label">Accounts</span>
            <h3>Registered Buyers ({{ buyers.length }})</h3>
          </div>
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
                <th>Account</th>
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
                <td>Protected</td>
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
      </section>

      <section v-else class="users-section">
        <div class="section-header">
          <div>
            <span class="panel-label">Accounts</span>
            <h3>Registered Sellers ({{ sellers.length }})</h3>
          </div>
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
                <th>Account</th>
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
                <td>Protected</td>
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
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { adminApi, clearSession } from '../api.js'

const router = useRouter()
const activeView = ref('overview')
const currentAdmin = ref('Admin')
const buyers = ref([])
const sellers = ref([])
const productReports = ref([])

const viewMeta = {
  overview: {
    kicker: 'Admin dashboard',
    title: 'Control panel',
    description: 'Monitor users, review product reports, and manage marketplace access.'
  },
  reports: {
    kicker: 'Trust and safety',
    title: 'Product Reports',
    description: 'Review buyer reports and remove reports that have been resolved.'
  },
  buyers: {
    kicker: 'Buyer accounts',
    title: 'Registered Buyers',
    description: 'Review buyer accounts, contact details, and registration history.'
  },
  sellers: {
    kicker: 'Seller accounts',
    title: 'Registered Sellers',
    description: 'Review seller accounts, business details, and registration history.'
  }
}

const activeViewMeta = computed(() => viewMeta[activeView.value] || viewMeta.overview)

const setActiveView = (view) => {
  activeView.value = view
}

onMounted(() => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null')
  if (!currentUser || currentUser.type !== 'admin') {
    router.push('/admin-login')
    return
  }

  currentAdmin.value = currentUser.name
  loadUsers()
})

const loadUsers = async () => {
  try {
    const data = await adminApi.overview()
    buyers.value = data.buyers
    sellers.value = data.sellers
    productReports.value = data.productReports
  } catch (error) {
    alert(error.message)
    router.push('/admin-login')
  }
}

const deleteUser = async (type, userId) => {
  const confirmed = confirm(`Are you sure you want to delete this ${type}? This action cannot be undone.`)

  if (!confirmed) return

  try {
    await adminApi.deleteUser(type, userId)
    alert(`${type === 'buyer' ? 'Buyer' : 'Seller'} deleted successfully`)
    loadUsers()
  } catch (error) {
    alert(error.message)
  }
}

const logoutAdmin = () => {
  clearSession()
  router.push('/')
}

const deleteProductReport = async (reportId) => {
  try {
    await adminApi.deleteReport(reportId)
    productReports.value = productReports.value.filter(report => report.id !== reportId)
  } catch (error) {
    alert(error.message)
  }
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
}
</script>

<style scoped>
.admin-dashboard {
  background: var(--page);
  display: grid;
  grid-template-columns: 300px minmax(0, 1fr);
  min-height: 100vh;
}

.dashboard-sidebar {
  background: linear-gradient(180deg, #111827 0%, #0f172a 100%);
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 18px 0 40px rgba(15, 23, 42, 0.08);
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
  padding: 0.25rem;
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

.sidebar-role {
  color: rgba(255, 255, 255, 0.58);
  font-size: 0.76rem;
  font-weight: 850;
  margin-top: -0.65rem;
  padding-left: 3.3rem;
  text-transform: uppercase;
}

.admin-card {
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  gap: 0.8rem;
  padding-block: 1rem;
}

.admin-avatar {
  align-items: center;
  background: #263244;
  border-radius: 8px;
  color: #ffffff;
  display: inline-flex;
  font-weight: 850;
  height: 58px;
  justify-content: center;
  width: 58px;
}

.admin-card h1 {
  color: #ffffff;
  font-size: 1.05rem;
}

.admin-card p {
  color: rgba(255, 255, 255, 0.66);
  font-size: 0.84rem;
}

.side-nav {
  display: grid;
  gap: 0.35rem;
}

.side-link {
  align-items: center;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 6px;
  color: rgba(255, 255, 255, 0.76);
  cursor: pointer;
  display: flex;
  gap: 0.7rem;
  font-weight: 750;
  padding: 0.65rem 0.75rem;
  text-align: left;
  text-decoration: none;
  transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease;
  width: 100%;
}

.side-link::before {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 999px;
  content: "";
  flex: 0 0 auto;
  height: 0.42rem;
  width: 0.42rem;
}

.side-link:hover {
  background: rgba(255, 255, 255, 0.09);
  border-color: rgba(255, 255, 255, 0.08);
  color: #ffffff;
}

.side-link.active {
  background: rgba(194, 65, 12, 0.24);
  border-color: rgba(251, 146, 60, 0.35);
  color: #ffffff;
}

.side-link.active::before {
  background: #fb923c;
}

.logout-button {
  border: 1px solid rgba(255, 255, 255, 0.14);
  margin-top: auto;
  width: 100%;
}

.dashboard-main {
  display: grid;
  gap: 1.25rem;
  padding: clamp(1rem, 3vw, 2rem);
}

.dashboard-topbar {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 8px;
  box-shadow: var(--shadow-sm);
  padding: 1.25rem;
}

.dashboard-topbar h2 {
  font-size: 2.25rem;
  line-height: 1.1;
  margin-top: 0.25rem;
}

.dashboard-topbar p {
  margin-top: 0.45rem;
}

.dashboard-panel {
  min-height: 420px;
}

.panel-stack {
  display: grid;
  gap: 1.25rem;
}

.stats-container {
  display: grid;
  gap: 0.85rem;
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.stat-card {
  background: var(--surface);
  border: 1px solid var(--line);
  border-left: 4px solid var(--accent);
  border-radius: 8px;
  box-shadow: var(--shadow-sm);
  padding: 1rem;
}

.stat-card span,
.stat-card strong {
  display: block;
}

.stat-card span {
  color: var(--muted);
  font-size: 0.82rem;
  font-weight: 750;
}

.stat-card strong {
  color: var(--ink);
  font-size: 1.8rem;
  line-height: 1;
  margin-top: 0.45rem;
}

.danger-stat {
  border-left-color: var(--danger);
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
  text-decoration: none;
  transition: border-color 0.2s ease, color 0.2s ease, transform 0.2s ease;
}

.action-chip:hover {
  border-color: rgba(194, 65, 12, 0.5);
  color: var(--accent);
  transform: translateY(-1px);
}

.users-section {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 8px;
  box-shadow: var(--shadow-sm);
  min-height: 420px;
  padding: 1.2rem;
}

.section-header {
  align-items: center;
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
}

.section-header h3 {
  font-size: 1.25rem;
  margin-top: 0.25rem;
}

.panel-label {
  color: var(--accent);
  font-size: 0.76rem;
  font-weight: 850;
  text-transform: uppercase;
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
  border-left: 4px solid var(--danger);
  border-radius: 8px;
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr auto;
  padding: 1rem;
}

.report-main h4 {
  color: var(--ink);
  font-size: 1rem;
  margin-bottom: 0.65rem;
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
  border-collapse: collapse;
  font-size: 0.9rem;
  width: 100%;
}

thead {
  background: var(--surface-soft);
  border-bottom: 2px solid var(--line);
}

th {
  color: var(--ink);
  font-weight: 800;
  padding: 0.8rem;
  text-align: left;
}

td {
  border-bottom: 1px solid var(--line);
  color: #34495e;
  padding: 0.8rem;
}

tr:hover {
  background: var(--surface-soft);
}

.id-cell {
  color: var(--muted);
  font-family: monospace;
  font-size: 0.82rem;
}

.btn-danger {
  background: var(--danger);
  color: white;
}

.btn-danger:hover {
  background: #8f1d14;
}

.btn-small {
  font-size: 0.85rem;
  min-height: 2rem;
  padding: 0.4rem 0.7rem;
}

@media (max-width: 980px) {
  .admin-dashboard {
    grid-template-columns: 1fr;
  }

  .dashboard-sidebar {
    min-height: auto;
    position: relative;
  }

  .side-nav,
  .stats-container {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .report-card,
  .side-nav,
  .stats-container {
    grid-template-columns: 1fr;
  }
}
</style>
