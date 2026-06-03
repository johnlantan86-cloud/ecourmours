<template>
  <div class="register-choice-container">
    <nav class="navbar">
      <div class="nav-content">
        <router-link to="/" class="logo">🏪 Kigali Great Market</router-link>
        <div class="nav-links">
          <router-link to="/login" class="nav-link">Login</router-link>
        </div>
      </div>
    </nav>

    <div class="choice-box">
      <h2>Create an Account</h2>
      <p>Choose the account type you want to register as:</p>

      <div class="choices">
        <router-link to="/buyer-register" class="btn btn-primary">Register as Buyer</router-link>
        <router-link to="/seller-register" class="btn btn-secondary">Register as Seller</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.register-choice-container {
  min-height: 100vh;
  background: #f8f9fa;
}

.nav-content { max-width: 1200px; margin: 0 auto; padding: 1rem 2rem; display:flex; justify-content:space-between; align-items:center }
.choice-box {
  max-width: 640px;
  margin: 4rem auto;
  background: white;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 6px 20px rgba(0,0,0,0.08);
}
.choices { display:flex; gap:1rem; justify-content:center; margin-top:1.5rem }
.btn { padding:0.75rem 1.25rem; border-radius:6px; text-decoration:none }
.btn-primary { background:#e74c3c; color:#fff }
.btn-secondary { background:#fff; border:1px solid #ddd; color:#2c3e50 }
</style>
