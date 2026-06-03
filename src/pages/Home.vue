<template>
  <div class="home-container">
    <nav class="navbar">
      <div class="nav-content">
        <h1 class="logo">🏪 Kigali Great Market</h1>
        <div class="nav-links">
          <router-link to="/" class="nav-link active">Home</router-link>
          <router-link to="/login" class="nav-link">Login</router-link>
          <router-link to="/register" class="nav-link">Register</router-link>
        </div>
      </div>
    </nav>

    <div class="hero-section">
      <div class="hero-content">
        <h2>Welcome to Kigali Great Market</h2>
        <p>Buy and Sell Products Easily</p>
      </div>
    </div>

    <div class="options-section">
      <div class="option-card">
        <div class="option-icon">🛍️</div>
        <h3>I'm a Buyer</h3>
        <p>Create a buyer account to access the marketplace.</p>
        <router-link to="/buyer-register" class="btn btn-primary">Register as Buyer</router-link>
      </div>

      <div class="option-card">
        <div class="option-icon">🛒</div>
        <h3>I'm a Seller</h3>
        <p>Create your seller page and list products for buyers.</p>
        <router-link to="/seller-register" class="btn btn-primary">Register as Seller</router-link>
      </div>

      <div class="option-card admin-card">
        <div class="option-icon">🛡️</div>
        <h3>Admin Panel</h3>
        <p>Administrator access to manage all users and monitor the platform</p>
        <router-link to="/admin-login" class="btn btn-admin">Admin Login</router-link>
      </div>
    </div>

    <div class="info-section">
      <h3>How It Works</h3>
      <div class="steps">
        <div class="step">
          <span class="step-number">1</span>
          <h4>Register Your Account</h4>
          <p>Create a buyer or seller account with your details</p>
        </div>
        <div class="step">
          <span class="step-number">2</span>
          <h4>Set Up Your Profile</h4>
          <p>Add your information, business name, location, and ID</p>
        </div>
        <div class="step">
          <span class="step-number">3</span>
          <h4>Start Selling/Buying</h4>
          <p>Sellers add products, Buyers browse and purchase</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  background: #f8f9fa;
}

.navbar {
  background: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 1.5rem;
  color: #2c3e50;
  margin: 0;
}

.nav-links {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.nav-link {
  text-decoration: none;
  color: #666;
  font-weight: 500;
  transition: color 0.3s;
}

.nav-link:hover,
.nav-link.active {
  color: #e74c3c;
}

.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4rem 2rem;
  text-align: center;
}

.hero-content h2 {
  font-size: 2.5rem;
  margin: 0 0 0.5rem 0;
}

.hero-content p {
  font-size: 1.5rem;
  margin: 0;
  opacity: 0.9;
}

.options-section {
  max-width: 1200px;
  margin: 3rem auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.option-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  transition: transform 0.3s;
}

.option-card:hover {
  transform: translateY(-5px);
}

.option-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.option-card h3 {
  color: #2c3e50;
  margin: 1rem 0;
}

.option-card p {
  color: #666;
  margin: 1rem 0;
}

.btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  text-decoration: none;
  border-radius: 4px;
  font-weight: 600;
  transition: all 0.3s;
  border: none;
  cursor: pointer;
}

.btn-primary {
  background: #e74c3c;
  color: white;
}

.btn-primary:hover {
  background: #c0392b;
}

.option-card.admin-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.option-card.admin-card h3,
.option-card.admin-card p {
  color: white;
}

.btn-admin {
  background: white;
  color: #667eea;
  font-weight: 600;
}

.btn-admin:hover {
  background: #f0f0f0;
  color: #667eea;
}

.btn-secondary {
  background: #ffffff;
  color: #2c3e50;
  border: 1px solid #ddd;
}

.btn-secondary:hover {
  background: #f1f1f1;
}

.info-section {
  max-width: 1200px;
  margin: 3rem auto;
  padding: 0 2rem;
}

.info-section h3 {
  text-align: center;
  color: #2c3e50;
  font-size: 1.8rem;
  margin-bottom: 2rem;
}

.steps {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.step {
  text-align: center;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.step-number {
  display: inline-block;
  width: 50px;
  height: 50px;
  background: #e74c3c;
  color: white;
  border-radius: 50%;
  line-height: 50px;
  font-weight: bold;
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.step h4 {
  color: #2c3e50;
  margin: 1rem 0;
}

.step p {
  color: #666;
}

@media (max-width: 768px) {
  .options-section,
  .steps {
    grid-template-columns: 1fr;
  }

  .nav-content {
    flex-direction: column;
    gap: 1rem;
  }

  .hero-content h2 {
    font-size: 1.5rem;
  }
}
</style>
