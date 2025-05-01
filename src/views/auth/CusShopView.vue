<template>
  <div class="container">
    <h1>Milk Shop</h1>
    <p>Select a date to see milk stock availability.</p>

    <!-- Calendar Section -->
    <div class="calendar-container">
      <div class="calendar-header">
        <button @click="prevMonth">&lt;</button>
        <h2>{{ monthYear }}</h2>
        <button @click="nextMonth">&gt;</button>
      </div>
      <div class="days-row">
        <span>Sun</span><span>Mon</span><span>Tue</span>
        <span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
      </div>
      <div class="calendar-grid">
        <span v-for="(day, index) in daysInMonth" :key="index" :class="{'empty': !day, 'day': day}" @click="displayStock(day)">
          {{ day }}
        </span>
      </div>
    </div>

    <!-- Stock Display -->
    <div v-if="stockDisplayVisible" class="stock-display">
      <h3>Milk Stock</h3>
      <p><strong>Date:</strong> {{ selectedDate }}</p>
      <p><strong>Available Stock:</strong> {{ stock }}</p>
      <button @click="showOrderSection">Order Now</button>
    </div>

    <!-- Order Section -->
    <div v-if="orderSectionVisible" class="order-section">
      <h3>Place Your Order</h3>
      <form @submit.prevent="reviewOrder">
        <label for="deliveryDate">Delivery Date:</label>
        <input type="text" v-model="selectedDate" readonly required>

        <label for="quantity">Number of Bottles:</label>
        <input type="number" v-model="quantity" min="1" required>

        <label for="name">Name:</label>
        <input type="text" v-model="name" required>

        <label for="address">Address:</label>
        <input type="text" v-model="address" required>

        <label for="phone">Phone Number:</label>
        <input type="tel" v-model="phone" required>

        <p><strong>Price per Bottle:</strong> ₱100</p>
        <p><strong>Total Price:</strong> ₱{{ totalPrice }}</p>

        <button type="submit">Review</button>
      </form>
    </div>

    <!-- Review Section -->
    <div v-if="reviewSectionVisible" class="review-section">
      <h3>Review Your Order</h3>
      <p><strong>Delivery Date:</strong> {{ selectedDate }}</p>
      <p><strong>Quantity:</strong> {{ quantity }}</p>
      <p><strong>Name:</strong> {{ name }}</p>
      <p><strong>Address:</strong> {{ address }}</p>
      <p><strong>Phone Number:</strong> {{ phone }}</p>
      <p><strong>Total Price:</strong> ₱{{ totalPrice }}</p>
      <button @click="submitOrder">Submit</button>
      <button @click="cancelOrder">Cancel</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const stockData = JSON.parse(localStorage.getItem('stockData')) || {};
const orders = JSON.parse(localStorage.getItem('orders')) || [];

let currentDate = new Date();
const selectedDate = ref('');
const stockDisplayVisible = ref(false);
const orderSectionVisible = ref(false);
const reviewSectionVisible = ref(false);

const quantity = ref(1);
const name = ref('');
const address = ref('');
const phone = ref('');
const stock = computed(() => stockData[selectedDate.value] || 0);

const totalPrice = computed(() => quantity.value * 100);

// Month and year display
const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December'
];

const monthYear = computed(() => `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`);

// Days of the month
const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
const daysInMonthArray = computed(() => {
  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null); // Empty cells before the first day
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i); // Day cells
  }
  return days;
});

// Handle month navigation
const prevMonth = () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
};

const nextMonth = () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
};

// Handle day click
const displayStock = (day) => {
  if (!day) return;
  selectedDate.value = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  stockDisplayVisible.value = true;
};

// Show order form
const showOrderSection = () => {
  if (!selectedDate.value) {
    alert('Please select a date first.');
    return;
  }
  orderSectionVisible.value = true;
};

// Review order
const reviewOrder = () => {
  if (!quantity.value || !name.value || !address.value || !phone.value) {
    alert('Please fill in all fields.');
    return;
  }
  reviewSectionVisible.value = true;
  orderSectionVisible.value = false;
};

// Submit order
const submitOrder = () => {
  alert('Order submitted successfully!');
  const orderData = {
    date: selectedDate.value,
    quantity: quantity.value,
    name: name.value,
    address: address.value,
    phone: phone.value,
    status: 'Pending',
    price: totalPrice.value
  };
  orders.push(orderData);
  localStorage.setItem('orders', JSON.stringify(orders));
  window.location.href = 'profile.html';
};

// Cancel order
const cancelOrder = () => {
  reviewSectionVisible.value = false;
  orderSectionVisible.value = false;
};
</script>

<style scoped>
/* Your CSS code here (the same as in your original HTML file) */
</style>
