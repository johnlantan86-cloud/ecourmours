<template>
  <div class="home-page">
    <nav class="home-nav">
      <router-link to="/" class="brand">
        <span class="brand-mark">KGM</span>
        <span>Kigali Great Market</span>
      </router-link>

      <div class="nav-links">
        <router-link to="/" class="nav-link">Home</router-link>
        <a href="#about" class="nav-link">About</a>
        <a href="#categories" class="nav-link">Categories</a>
        <a href="#trust" class="nav-link">Trust</a>
        <router-link to="/marketplace" class="nav-link">Marketplace</router-link>
        <router-link to="/login" class="nav-link">Login</router-link>
        <router-link to="/register" class="btn btn-primary nav-cta">Register</router-link>
      </div>
    </nav>

    <header class="hero-section">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <span class="hero-kicker">Kigali commerce, organized</span>
        <h1>Kigali Great Market</h1>
        <p>
          A professional local marketplace where buyers discover nearby sellers,
          compare products, and build trust before they contact a business.
        </p>

        <div class="hero-actions">
          <router-link to="/buyer-register" class="btn btn-primary">Start Buying</router-link>
          <router-link to="/seller-register" class="btn btn-light">Become a Seller</router-link>
        </div>

        <div class="hero-metrics" aria-label="Marketplace highlights">
          <div>
            <strong>Nearby</strong>
            <span>seller discovery</span>
          </div>
          <div>
            <strong>Trusted</strong>
            <span>ratings and reports</span>
          </div>
          <div>
            <strong>Organized</strong>
            <span>product categories</span>
          </div>
        </div>
      </div>
    </header>

    <main>
      <section class="entry-section">
        <router-link to="/buyer-register" class="entry-card">
          <span class="entry-icon">B</span>
          <div>
            <h2>Buyer Account</h2>
            <p>Search products, save sellers, like products, and manage a wishlist.</p>
          </div>
          <span class="entry-arrow">View</span>
        </router-link>

        <router-link to="/seller-register" class="entry-card">
          <span class="entry-icon seller">S</span>
          <div>
            <h2>Seller Account</h2>
            <p>Publish products, track buyer interest, and manage your business page.</p>
          </div>
          <span class="entry-arrow">View</span>
        </router-link>

        <router-link to="/admin-login" class="entry-card">
          <span class="entry-icon admin">A</span>
          <div>
            <h2>Admin Panel</h2>
            <p>Review users, monitor reports, and keep the marketplace healthy.</p>
          </div>
          <span class="entry-arrow">View</span>
        </router-link>
      </section>

      <section id="about" class="about-section">
        <div class="section-copy">
          <span class="section-kicker">About the platform</span>
          <h2>A market experience built around location, product quality, and seller trust.</h2>
          <p>
            Kigali Great Market is designed for buyers who want faster product discovery
            and sellers who need a clear, professional storefront. The next stage can add
            precise location ranking, automated categories, and stronger trust scoring.
          </p>
        </div>

        <div class="about-grid">
          <div class="about-item">
            <strong>Product-first browsing</strong>
            <span>Buyers can search for products without starting from the business name.</span>
          </div>
          <div class="about-item">
            <strong>Seller visibility</strong>
            <span>Good sellers can show ratings, likes, wishlists, and comments clearly.</span>
          </div>
          <div class="about-item">
            <strong>Operational control</strong>
            <span>Admins can see reports and users from one management dashboard.</span>
          </div>
        </div>
      </section>

      <section id="categories" class="categories-section">
        <div class="section-heading">
          <span class="section-kicker">Categories</span>
          <h2>Clear product groups for easier search</h2>
        </div>

        <div class="category-grid">
          <div v-for="category in categories" :key="category" class="category-chip">
            {{ category }}
          </div>
        </div>
      </section>

      <section class="process-section">
        <div class="section-heading">
          <span class="section-kicker">Flow</span>
          <h2>Simple paths for buyers and sellers</h2>
        </div>

        <div class="process-grid">
          <div class="process-step">
            <span>01</span>
            <h3>Create an account</h3>
            <p>Buyer and seller profiles collect the essentials without visual clutter.</p>
          </div>
          <div class="process-step">
            <span>02</span>
            <h3>Publish or discover</h3>
            <p>Sellers manage products while buyers browse stores and product previews.</p>
          </div>
          <div class="process-step">
            <span>03</span>
            <h3>Build confidence</h3>
            <p>Likes, comments, favorites, reports, and ratings create visible signals.</p>
          </div>
        </div>
      </section>

      <section id="trust" class="trust-section">
        <div>
          <span class="section-kicker">Trust layer</span>
          <h2>Designed for ratings, reports, and future location intelligence.</h2>
          <p>
            The interface now has space for a professional trust score, nearby seller
            distance, Google rating signals, and product ranking once those backend
            services are added.
          </p>
        </div>

        <div class="trust-panel">
          <div>
            <strong>90%</strong>
            <span>example trust score</span>
          </div>
          <div class="stars">*****</div>
          <p>Ratings, likes, comments, reports, and seller completion can combine into one score.</p>
        </div>
      </section>
    </main>

    <footer class="home-footer">
      <strong>Kigali Great Market</strong>
      <span>Professional local commerce for buyers, sellers, and admins.</span>
    </footer>
  </div>
</template>

<script setup>
const categories = [
  'Food',
  'Clothes',
  'Electronics',
  'Beauty',
  'Home Items',
  'Phones',
  'Services',
  'Fresh Produce'
]
</script>

<style scoped>
.home-page {
  background: var(--page);
  min-height: 100vh;
}

.home-nav {
  align-items: center;
  background: rgba(255, 255, 255, 0.94);
  border-bottom: 1px solid rgba(221, 229, 238, 0.9);
  display: flex;
  justify-content: space-between;
  padding: 0.85rem clamp(1rem, 4vw, 3rem);
  position: sticky;
  top: 0;
  z-index: 20;
}

.brand {
  align-items: center;
  color: var(--ink);
  display: inline-flex;
  font-weight: 850;
  gap: 0.7rem;
  text-decoration: none;
}

.brand-mark {
  align-items: center;
  background: var(--ink);
  border-radius: 8px;
  color: #ffffff;
  display: inline-flex;
  font-size: 0.72rem;
  height: 2.25rem;
  justify-content: center;
  width: 2.25rem;
}

.nav-cta {
  min-height: 2.1rem;
  padding-inline: 0.85rem;
}

.hero-section {
  background-image:
    linear-gradient(90deg, rgba(11, 18, 32, 0.86) 0%, rgba(11, 18, 32, 0.58) 38%, rgba(11, 18, 32, 0.2) 72%),
    url('../assets/market-hero.png');
  background-position: center;
  background-size: cover;
  min-height: min(720px, calc(100vh - 72px));
  position: relative;
}

.hero-content {
  color: #ffffff;
  max-width: 760px;
  padding: clamp(4rem, 11vh, 7rem) clamp(1.25rem, 6vw, 5rem);
  position: relative;
  z-index: 1;
}

.hero-kicker {
  color: #fed7aa;
  display: inline-block;
  font-size: 0.82rem;
  font-weight: 850;
  margin-bottom: 1rem;
  text-transform: uppercase;
}

.hero-content h1 {
  color: #ffffff;
  font-size: 5.4rem;
  line-height: 0.96;
  max-width: 680px;
}

.hero-content p {
  color: rgba(255, 255, 255, 0.88);
  font-size: 1.1rem;
  margin-top: 1.35rem;
  max-width: 640px;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.85rem;
  margin-top: 1.75rem;
}

.btn-light {
  background: #ffffff;
  color: var(--ink);
}

.btn-light:hover {
  background: #f1f5f9;
}

.hero-metrics {
  border-top: 1px solid rgba(255, 255, 255, 0.24);
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-top: clamp(2.5rem, 8vh, 5rem);
  padding-top: 1.2rem;
}

.hero-metrics div {
  min-width: 130px;
}

.hero-metrics strong,
.hero-metrics span {
  display: block;
}

.hero-metrics strong {
  color: #ffffff;
  font-size: 1.05rem;
}

.hero-metrics span {
  color: rgba(255, 255, 255, 0.72);
  font-size: 0.9rem;
}

main {
  display: grid;
  gap: clamp(2.5rem, 6vw, 4.5rem);
  padding: clamp(1.5rem, 4vw, 3.5rem);
}

.entry-section {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  margin: -4.5rem auto 0;
  max-width: 1180px;
  position: relative;
  width: 100%;
  z-index: 5;
}

.entry-card {
  align-items: center;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 8px;
  box-shadow: var(--shadow-md);
  color: inherit;
  display: grid;
  gap: 0.85rem;
  grid-template-columns: auto 1fr auto;
  min-height: 120px;
  padding: 1.1rem;
  text-decoration: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
}

.entry-card:hover {
  border-color: rgba(194, 65, 12, 0.36);
  box-shadow: var(--shadow-lg);
  transform: translateY(-3px);
}

.entry-icon {
  align-items: center;
  background: #fff4ed;
  border-radius: 8px;
  color: var(--accent);
  display: inline-flex;
  font-weight: 850;
  height: 2.7rem;
  justify-content: center;
  width: 2.7rem;
}

.entry-icon.seller {
  background: #ecfdf3;
  color: var(--success);
}

.entry-icon.admin {
  background: #eff6ff;
  color: var(--info);
}

.entry-card h2 {
  font-size: 1rem;
}

.entry-card p {
  font-size: 0.9rem;
  margin-top: 0.2rem;
}

.entry-arrow {
  color: var(--accent);
  font-size: 0.86rem;
  font-weight: 800;
}

.about-section,
.categories-section,
.process-section,
.trust-section {
  margin-inline: auto;
  max-width: 1180px;
  width: 100%;
}

.about-section {
  align-items: start;
  display: grid;
  gap: 2rem;
  grid-template-columns: minmax(0, 1fr) minmax(320px, 0.85fr);
}

.section-copy h2,
.section-heading h2,
.trust-section h2 {
  font-size: 2.8rem;
  line-height: 1.08;
  margin-top: 0.5rem;
}

.section-copy p,
.trust-section p {
  font-size: 1rem;
  margin-top: 1rem;
}

.about-grid {
  display: grid;
  gap: 0.8rem;
}

.about-item {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 1rem;
}

.about-item strong,
.about-item span {
  display: block;
}

.about-item span {
  color: var(--muted);
  font-size: 0.92rem;
  margin-top: 0.3rem;
}

.section-heading {
  margin-bottom: 1.25rem;
}

.category-grid {
  display: grid;
  gap: 0.75rem;
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.category-chip {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 8px;
  color: var(--ink);
  font-weight: 760;
  padding: 1rem;
  text-align: center;
}

.process-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.process-step {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 1.2rem;
}

.process-step span {
  color: var(--accent);
  font-size: 0.82rem;
  font-weight: 850;
}

.process-step h3 {
  font-size: 1.05rem;
  margin-top: 0.45rem;
}

.process-step p {
  font-size: 0.92rem;
  margin-top: 0.4rem;
}

.trust-section {
  align-items: center;
  background: #111827;
  border-radius: 8px;
  display: grid;
  gap: 2rem;
  grid-template-columns: minmax(0, 1fr) 320px;
  padding: clamp(1.5rem, 4vw, 2.5rem);
}

.trust-section h2,
.trust-section p {
  color: #ffffff;
}

.trust-section p {
  color: rgba(255, 255, 255, 0.72);
}

.trust-panel {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 8px;
  padding: 1.2rem;
}

.trust-panel strong {
  color: #ffffff;
  display: block;
  font-size: 3rem;
  line-height: 1;
}

.trust-panel span {
  color: rgba(255, 255, 255, 0.72);
}

.stars {
  color: #f6c453;
  font-size: 1.4rem;
  margin: 1rem 0 0.45rem;
}

.home-footer {
  align-items: center;
  background: var(--surface);
  border-top: 1px solid var(--line);
  color: var(--muted);
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  padding: 1.25rem clamp(1rem, 4vw, 3rem);
}

.home-footer strong {
  color: var(--ink);
}

@media (max-width: 980px) {
  .hero-content h1 {
    font-size: 4rem;
  }

  .section-copy h2,
  .section-heading h2,
  .trust-section h2 {
    font-size: 2.25rem;
  }

  .home-nav {
    align-items: flex-start;
    gap: 0.9rem;
    flex-direction: column;
  }

  .nav-links {
    flex-wrap: wrap;
  }

  .entry-section,
  .about-section,
  .process-grid,
  .trust-section {
    grid-template-columns: 1fr;
  }

  .category-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .hero-content h1 {
    font-size: 3rem;
  }

  .section-copy h2,
  .section-heading h2,
  .trust-section h2 {
    font-size: 1.75rem;
  }

  .hero-section {
    min-height: 680px;
  }

  .hero-content {
    padding-inline: 1rem;
  }

  main {
    padding-inline: 1rem;
  }

  .entry-section {
    margin-top: -2rem;
  }

  .entry-card {
    grid-template-columns: auto 1fr;
  }

  .entry-arrow {
    grid-column: 2;
  }

  .category-grid {
    grid-template-columns: 1fr;
  }

  .home-footer {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
