<template>
  <div class="wrapper">
    <header class="customer-header">
      <h1 class="logo">Milk Shop</h1>
      <nav class="nav-links">
        <router-link to="/customer-home" active-class="active">Home</router-link>
        <router-link to="/customer-shop" active-class="active">Shop</router-link>
        <router-link to="/customer-status" active-class="active">Status</router-link>
        <router-link to="/customer-profile" active-class="active">Profile</router-link>
      </nav>
    </header>

    <!-- Main Content -->
    <div class="container">
      <div class="image-section">
        <v-img
          class="hero-image"
          src="/images/milk.png"
          :width="mobile ? '95%' : '100%'"
        />
      </div>
      <div class="description-section">
        <h1>Welcome to Fresh Milk Delivery</h1>
        <p>
          Experience the convenience of having fresh milk delivered straight to your doorstep.
          We take pride in providing high-quality, farm-fresh milk sourced from local dairies.
          Our service is designed to cater to your daily needs with guaranteed freshness and reliability.
        </p>
        <p>
          Whether you’re a health-conscious individual or a family that values natural products,
          we ensure that you get the best. Our user-friendly platform allows you to check availability,
          place orders, and track your deliveries effortlessly. Enjoy a seamless shopping experience
          while prioritizing your health and convenience.
        </p>
      </div>
    </div>
  </div>
</template>



<script setup>
// Optional script logic goes here
</script>

<style scoped>
:root {
  --milk-blue: #e6f2ff;
  --milk-white: #ffffff;
  --milk-border: #cce0f5;
  --milk-blue-light: #f9fbff;
}

html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  background: var(--milk-blue-light);
  font-family: 'Segoe UI', sans-serif;
}

.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.75rem;
  background: var(--milk-blue-light);
}

.customer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0.95rem 1rem;
  background-color: #3178c6;
  border-radius: 12px;
  color: white;
  margin-bottom: 3rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.customer-header .logo {
  font-size: 1.5rem;
  font-weight: bold;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
}

.nav-links a {
  color: white;
  text-decoration: none;
  font-weight: 500;
  padding: 6px 12px;
  border-radius: 6px;
  transition: background-color 0.2s;
}

.nav-links a:hover,
.nav-links .active {
  background-color: rgba(255, 255, 255, 0.2);
}

.container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 2rem;
  padding: 1rem;
  max-width: 1200px;
  width: 100%;
}

.image-section {
  flex: 1;
  max-width: 500px;
}

.hero-image {
  width: 100%;
  height: auto;
}

.description-section {
  flex: 1;
  padding: 1rem;
}

.description-section h1 {
  font-size: 2rem;
  color: #0078D7;
  margin-bottom: 15px;
}

.description-section p {
  margin-bottom: 15px;
  font-size: 1rem;
  color: #555;
}

@media (max-width: 768px) {
  .container {
    flex-direction: column;
    text-align: center;
  }

  .image-section,
  .description-section {
    width: 100%;
  }

  .description-section h1 {
    font-size: 1.8rem;
  }

  .description-section p {
    font-size: 0.95rem;
  }
}



</style>
