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

    <section class="order-status-section">
      <h2>Order Status</h2>
      <div v-if="orders.length === 0">
        <p>No orders yet.</p>
      </div>
      <div v-for="(order, index) in orders" :key="index" class="order">
        <p><strong>Order #{{ index + 1 }}</strong></p>
        <ul>
          <li><strong>Quantity:</strong> {{ order.quantity }}</li>
          <li><strong>Status:</strong> {{ order.status }}</li>
          <li><strong>Date to Deliver:Within 24 hrs</strong> {{ order.date }}</li>
          <li><strong>Price:</strong> ₱{{ order.price }}</li>
        </ul>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const orders = ref([])

function loadOrders() {
  const saved = JSON.parse(localStorage.getItem('orders')) || []
  orders.value = saved
}

onMounted(() => {
  loadOrders()
})
</script>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.75rem;
  background: #f9fbff;
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
  margin-bottom: 2rem;
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

.order-status-section {
  width: 100%;
  max-width: 700px;
  background: white;
  border: 1px solid #cce0f5;
  border-radius: 12px;
  padding: 1rem;
}

.order {
  margin-bottom: 1rem;
  background: #f5faff;
  padding: 0.75rem;
  border-radius: 8px;
}
</style>
