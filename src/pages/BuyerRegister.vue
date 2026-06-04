<template>
  <div class="register-container">
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
        <h2>Buyer Registration</h2>
        <form @submit.prevent="registerBuyer">
          <div class="form-group">
            <label for="name">Full Name</label>
            <input
              v-model="form.name"
              type="text"
              id="name"
              minlength="2"
              autocomplete="name"
              required
            />
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input
              v-model="form.email"
              type="email"
              id="email"
              autocomplete="email"
              required
            />
          </div>

          <div class="form-group">
            <label for="phone">Phone Number</label>
            <input
              v-model="form.phone"
              type="tel"
              id="phone"
              minlength="5"
              autocomplete="tel"
              required
            />
          </div>

          <div class="form-group">
            <label for="location">Location/Address</label>
            <input
              v-model="form.location"
              type="text"
              id="location"
              minlength="2"
              autocomplete="street-address"
              required
            />
          </div>

          <div class="form-group">
            <label for="idnumber">National ID Number</label>
            <input
              v-model="form.idnumber"
              type="text"
              id="idnumber"
              minlength="3"
              required
            />
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input
              v-model="form.password"
              type="password"
              id="password"
              minlength="6"
              autocomplete="new-password"
              required
            />
          </div>

          <button type="submit" class="btn btn-primary">Register as Buyer</button>
        </form>

        <p class="login-link">
          Already have an account?
          <router-link to="/login">Login here</router-link>
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

const form = ref({
  name: '',
  email: '',
  phone: '',
  location: '',
  idnumber: '',
  password: ''
})

const registrationPayload = () => ({
  name: form.value.name.trim(),
  email: form.value.email.trim(),
  phone: form.value.phone.trim(),
  location: form.value.location.trim(),
  idnumber: form.value.idnumber.trim(),
  password: form.value.password.trim()
})

const registerBuyer = async () => {
  try {
    const session = await authApi.registerBuyer(registrationPayload())
    saveSession(session)
    alert('Registration successful! Welcome!')
    router.push('/buyer-dashboard')
  } catch (error) {
    alert(error.message)
  }
}
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  background: #f8f9fa;
}

.navbar {
  background: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
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
  margin: 2rem auto;
  padding: 0 2rem;
}

.form-box {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.form-box h2 {
  color: #2c3e50;
  margin-top: 0;
  text-align: center;
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

.login-link {
  text-align: center;
  margin-top: 1.5rem;
  color: #666;
}

.login-link a {
  color: #e74c3c;
  text-decoration: none;
  font-weight: 600;
}

.login-link a:hover {
  text-decoration: underline;
}
</style>
