<template>
  <div class="admin-login-container">
    <div class="navbar">
      <div class="nav-content">
        <router-link to="/" class="logo">Kigali Great Market</router-link>
        <div class="nav-links">
          <router-link to="/" class="nav-link">Home</router-link>
        </div>
      </div>
    </div>

    <div class="login-wrapper">
      <div class="login-card">
        <h1>Admin Login</h1>
        <p class="subtitle">Exclusive admin access only</p>

        <form @submit.prevent="loginAdmin">
          <div class="form-group">
            <label for="email">Admin Email</label>
            <input
              v-model="form.email"
              type="email"
              id="email"
              placeholder="Enter admin email"
              autocomplete="email"
              required
            />
          </div>

          <div class="form-group">
            <PasswordField
              v-model="form.password"
              id="password"
              label="Admin Password"
              placeholder="Enter admin password"
              autocomplete="current-password"
              required
            />
          </div>

          <div v-if="error" class="error-message">{{ error }}</div>

          <button type="submit" class="btn btn-primary btn-full">Login as Admin</button>
        </form>

        <p class="back-link">
          <router-link to="/">Back to Home</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authApi, saveSession } from '../api.js'
import PasswordField from '../components/PasswordField.vue'

const router = useRouter()
const form = ref({ email: '', password: '' })
const error = ref('')

const loginAdmin = async () => {
  error.value = ''

  try {
    const session = await authApi.login({
      type: 'admin',
      email: form.value.email.trim(),
      password: form.value.password.trim()
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
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  max-width: 1200px;
}

.logo {
  color: #2c3e50;
  display: inline-block;
  font-size: 1.5rem;
  font-weight: 600;
  text-decoration: none;
}

.login-wrapper {
  align-items: center;
  display: flex;
  justify-content: center;
  min-height: calc(100vh - 70px);
  padding: 2rem;
}

.login-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.2);
  max-width: 400px;
  padding: 3rem;
  width: 100%;
}

.login-card h1 {
  color: #2c3e50;
  font-size: 2rem;
  margin: 0 0 0.5rem;
  text-align: center;
}

.subtitle {
  color: #7f8c8d;
  font-size: 0.9rem;
  margin-bottom: 2rem;
  text-align: center;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  color: #2c3e50;
  display: block;
  font-size: 0.95rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.form-group input {
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 1rem;
  padding: 0.75rem;
  transition: border-color 0.3s;
  width: 100%;
}

.form-group input:focus {
  border-color: #667eea;
  outline: none;
}

.error-message {
  background: #fee;
  border-radius: 6px;
  color: #c33;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  padding: 0.75rem;
  text-align: center;
}

.btn {
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  transition: all 0.3s;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover {
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
  transform: translateY(-2px);
}

.btn-full {
  width: 100%;
}

.back-link {
  margin-top: 1.5rem;
  text-align: center;
}

.back-link a {
  color: #667eea;
  font-size: 0.9rem;
  text-decoration: none;
}

.back-link a:hover {
  text-decoration: underline;
}
</style>
