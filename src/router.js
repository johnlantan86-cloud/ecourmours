import { createRouter, createWebHistory } from 'vue-router'
import Home from './pages/Home.vue'
import BuyerRegister from './pages/BuyerRegister.vue'
import BuyerDashboard from './pages/BuyerDashboard.vue'
import SellerRegister from './pages/SellerRegister.vue'
import SellerDashboard from './pages/SellerDashboard.vue'
import Marketplace from './pages/Marketplace.vue'
import SellerProfile from './pages/SellerProfile.vue'
import Login from './pages/Login.vue'
import RegisterChoice from './pages/RegisterChoice.vue'
import AdminLogin from './pages/AdminLogin.vue'
import AdminDashboard from './pages/AdminDashboard.vue'

const routes = [
  { path: '/', component: Home, name: 'Home' },
  { path: '/login', component: Login, name: 'Login' },
  { path: '/register', component: RegisterChoice, name: 'RegisterChoice' },
  { path: '/buyer-register', component: BuyerRegister, name: 'BuyerRegister' },
  { path: '/buyer-dashboard', component: BuyerDashboard, name: 'BuyerDashboard' },
  { path: '/seller-register', component: SellerRegister, name: 'SellerRegister' },
  { path: '/seller-dashboard', component: SellerDashboard, name: 'SellerDashboard' },
  { path: '/marketplace', component: Marketplace, name: 'Marketplace' },
  { path: '/seller/:id', component: SellerProfile, name: 'SellerProfile' },
  { path: '/admin-login', component: AdminLogin, name: 'AdminLogin' },
  { path: '/admin-dashboard', component: AdminDashboard, name: 'AdminDashboard' },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

const getCurrentUser = () => {
  try {
    return JSON.parse(localStorage.getItem('currentUser') || 'null')
  } catch {
    localStorage.removeItem('currentUser')
    return null
  }
}

const dashboardFor = (userType) => {
  if (userType === 'seller') return '/seller-dashboard'
  if (userType === 'admin') return '/admin-dashboard'
  return '/buyer-dashboard'
}

router.beforeEach((to) => {
  const currentUser = getCurrentUser()
  const authPages = ['Login', 'RegisterChoice', 'BuyerRegister', 'SellerRegister', 'AdminLogin']

  if (currentUser && authPages.includes(to.name)) {
    return dashboardFor(currentUser.type)
  }

  if (to.name === 'BuyerDashboard' && currentUser?.type !== 'buyer') {
    return currentUser ? dashboardFor(currentUser.type) : '/login'
  }

  if (to.name === 'SellerDashboard' && currentUser?.type !== 'seller') {
    return currentUser ? dashboardFor(currentUser.type) : '/login'
  }

  if (to.name === 'AdminDashboard' && currentUser?.type !== 'admin') {
    return currentUser ? dashboardFor(currentUser.type) : '/admin-login'
  }
})

export default router
