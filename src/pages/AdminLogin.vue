<template>
  <div class="admin-login-container">
    <div class="navbar">
      <div class="nav-content">
        <router-link to="/" class="logo">🏪 Kigali Great Market</router-link>
      </div>
    </div>

    <div class="login-wrapper">
      <div class="login-card">
        <h1>🛡️ Admin Login</h1>
        <p class="subtitle">Exclusive admin access only</p>

        <form @submit.prevent="loginAdmin">
          <div class="form-group">
            <label for="email">Admin Email</label>
            <input 
              v-model="form.email" 
              type="email" 
              id="email" 
              placeholder="Enter admin email"
              required
            />
          </div>

          <div class="form-group">
            <label for="password">Admin Password</label>
            <input 
              v-model="form.password" 
              type="password" 
              id="password" 
              placeholder="Enter admin password"
              required
            />
          </div>

          <div v-if="error" class="error-message">{{ error }}</div>

          <button type="submit" class="btn btn-primary btn-full">Login as Admin</button>
        </form>

        <p class="back-link">
          <router-link to="/">← Back to Home</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authApi, saveSession } from '../api.js'

const router = useRouter()
const form = ref({ email: '', password: '' })
const error = ref('')

const loginAdmin = async () => {
  error.value = ''

  try {
    const session = await authApi.login({
      type: 'admin',
      email: form.value.email,
      password: form.value.password
    })
    saveSession(session)
    router.push('/admin-dashboard')
  } catch (loginError) {
    error.value = loginError.message
  }
}
</script>

<style scoped>
.admin-login-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.navbar {
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  padding: 1rem 2rem;
}

.nav-content {
  max-width: 1200px;
  margin: 0 auto;
}

.logo {
  font-size: 1.5rem;
  color: #2c3e50;
  text-decoration: none;
  font-weight: 600;
  display: inline-block;
}

.login-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 70px);
  padding: 2rem;
}

.login-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.2);
  padding: 3rem;
  width: 100%;
  max-width: 400px;
}

.login-card h1 {
  margin: 0 0 0.5rem;
  color: #2c3e50;
  text-align: center;
  font-size: 2rem;
}

.subtitle {
  text-align: center;
  color: #7f8c8d;
  margin-bottom: 2rem;
  font-size: 0.9rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #2c3e50;
  font-weight: 500;
  font-size: 0.95rem;
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
  border-color: #667eea;
}

.error-message {
  background: #fee;
  color: #c33;
  padding: 0.75rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  text-align: center;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.btn-full {
  width: 100%;
}

.back-link {
  text-align: center;
  margin-top: 1.5rem;
}

.back-link a {
  color: #667eea;
  text-decoration: none;
  font-size: 0.9rem;
}

.back-link a:hover {
  text-decoration: underline;
}
</style>
