<template>
  <div class="login-container">
    <nav class="navbar">
      <div class="nav-content">
        <router-link to="/" class="logo">🏪 Kigali Great Market</router-link>
        <div class="nav-links">
          <router-link to="/login" class="nav-link">Login</router-link>
          <router-link to="/register" class="nav-link">Register</router-link>
        </div>
      </div>
    </nav>

    <div class="form-container">
      <div class="form-box">
        <h2>Login</h2>

        <form @submit.prevent="login">
          <div class="form-group radio-group">
            <label>
              <input type="radio" value="buyer" v-model="loginType" />
              Login as Buyer
            </label>
            <label>
              <input type="radio" value="seller" v-model="loginType" />
              Login as Seller
            </label>
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input
              v-model="form.email"
              type="email"
              id="email"
              required
            />
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input
              v-model="form.password"
              type="password"
              id="password"
              required
            />
          </div>

          <div v-if="error" class="error-message">
            {{ error }}
          </div>

          <button type="submit" class="btn btn-primary">Login</button>
        </form>

        <div class="register-options">
          <p>
            Don't have an account?
            <router-link v-if="loginType === 'buyer'" to="/buyer-register">Register as Buyer</router-link>
            <router-link v-else to="/seller-register">Register as Seller</router-link>
          </p>
          <p class="switch-type">
            Want to log in as the other user type?
            <button @click="switchType" class="btn-switch">Switch to {{ loginType === 'buyer' ? 'Seller' : 'Buyer' }}</button>
          </p>
          <p class="clear-action">
            <button type="button" class="btn btn-secondary" @click="clearLocalSession">Clear local session</button>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authApi, clearSession, saveSession } from '../api.js'

const router = useRouter()
const loginType = ref('buyer')
const form = ref({ email: '', password: '' })
const error = ref('')

const login = async () => {
  error.value = ''
  try {
    const session = await authApi.login({
      type: loginType.value,
      email: form.value.email,
      password: form.value.password
    })
    saveSession(session)
    router.push(loginType.value === 'seller' ? '/seller-dashboard' : '/buyer-dashboard')
  } catch (loginError) {
    error.value = loginError.message
  }
}

const switchType = () => {
  loginType.value = loginType.value === 'buyer' ? 'seller' : 'buyer'
}

const clearLocalSession = () => {
  clearSession()
  error.value = ''
  alert('Local session cleared.')
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  background: #f8f9fa;
}

.navbar {
  background: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
}

.form-container {
  max-width: 500px;
  margin: 3rem auto;
  padding: 0 2rem;
}

.form-box {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.form-box h2 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 1.5rem;
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

.radio-group {
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  align-items: center;
}

.radio-group label {
  font-weight: 500;
  color: #555;
}

.radio-group input {
  margin-right: 0.5rem;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  box-sizing: border-box;
  transition: border-color 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: #e74c3c;
}

.error-message {
  color: #e74c3c;
  font-weight: 600;
  margin-bottom: 1rem;
  text-align: center;
}

.btn {
  width: 100%;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  font-size: 1rem;
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
  background: #ffffff;
  color: #2c3e50;
  border: 1px solid #ddd;
}

.btn-secondary:hover {
  background: #f1f1f1;
}

.register-options {
  margin-top: 1.5rem;
  text-align: center;
  color: #666;
}

.register-options a {
  color: #e74c3c;
  text-decoration: none;
  font-weight: 600;
}

.register-options a:hover {
  text-decoration: underline;
}

.switch-type {
  margin-top: 1rem;
}

.btn-switch {
  margin-left: 0.5rem;
  border: none;
  background: transparent;
  color: #e74c3c;
  cursor: pointer;
  font-weight: 700;
}

.btn-switch:hover {
  text-decoration: underline;
}
</style>
