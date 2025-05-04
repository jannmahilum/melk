<template>
  <div class="container">
    <header class="customer-header">
      <h1>Milk Shop</h1>
      <nav class="nav-links">
        <router-link to="/customer-home" active-class="active">Home</router-link>
        <router-link to="/customer-shop" active-class="active">Shop</router-link>
        <router-link to="/customer-status" active-class="active">Status</router-link>
        <router-link to="/customer-profile" active-class="active">Profile</router-link>
      </nav>
    </header>

    <p>Select a date to see milk stock availability.</p>

    <div class="calendar-container">
      <div class="calendar-header">
        <button @click="changeMonth(-1)">&lt;</button>
        <h2>{{ formattedMonth }}</h2>
        <button @click="changeMonth(1)">&gt;</button>
      </div>
      <div class="days-row">
        <span v-for="day in ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']" :key="day">{{ day }}</span>
      </div>
      <div class="calendar-grid">
        <span v-for="n in firstDay" :key="'empty' + n" class="empty"></span>
        <span
          v-for="day in daysInMonth"
          :key="day"
          class="day"
          @click="selectDate(day)"
        >
          {{ day }}
        </span>
      </div>
    </div>

    <div class="stock-display" v-if="selectedDate">
      <h3>Milk Stock</h3>
      <p><strong>Date:</strong> {{ selectedDate }}</p>
      <p><strong>Available Stock:</strong> {{ stock }} bottles</p>
      <p><strong>Price per Bottle:</strong> ₱{{ pricePerBottle }}</p>
      <button @click="showOrderForm" :disabled="stock <= 0">Order Now</button>
    </div>

    <div class="order-section" v-if="showOrder">
      <h3>Place Your Order</h3>
      <form @submit.prevent="reviewOrder">
        <label for="deliveryDate">Delivery Date:</label>
        <input type="text" id="deliveryDate" v-model="form.deliveryDate" readonly required>

        <label for="quantity">Number of Bottles:</label>
        <input type="number" id="quantity" v-model.number="form.quantity" min="1" :max="stock" required>

        <label for="name">Name:</label>
        <input type="text" id="name" v-model="form.name" required>

        <label for="address">Address:</label>
        <input type="text" id="address" v-model="form.address" required>

        <label for="phone">Phone Number:</label>
        <input type="tel" id="phone" v-model="form.phone" required>

        <p><strong>Total Price:</strong> ₱{{ totalPrice }}</p>

        <button type="submit">Review</button>
      </form>
    </div>

    <div class="review-section" v-if="showReview">
      <h3>Review Your Order</h3>
      <p><strong>Delivery Date:</strong> {{ form.deliveryDate }}</p>
      <p><strong>Quantity:</strong> {{ form.quantity }}</p>
      <p><strong>Name:</strong> {{ form.name }}</p>
      <p><strong>Address:</strong> {{ form.address }}</p>
      <p><strong>Phone Number:</strong> {{ form.phone }}</p>
      <p><strong>Total Price:</strong> ₱{{ totalPrice }}</p>
      <button @click="submitOrder">Submit</button>
      <button @click="cancelOrder">Cancel</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const currentDate = ref(new Date())
const selectedDate = ref('')
const showOrder = ref(false)
const showReview = ref(false)
const stockData = ref(JSON.parse(localStorage.getItem('stockData')) || {})
const router = useRouter()

const form = ref({
  deliveryDate: '',
  quantity: 1,
  name: '',
  address: '',
  phone: ''
})

const pricePerBottle = ref(0)

const daysInMonth = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  return new Date(year, month + 1, 0).getDate()
})

const firstDay = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  return new Date(year, month, 1).getDay()
})

const formattedMonth = computed(() => {
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]
  return `${monthNames[currentDate.value.getMonth()]} ${currentDate.value.getFullYear()}`
})

const stock = computed(() => {
  const data = stockData.value[selectedDate.value]
  if (data && typeof data === 'object') {
    pricePerBottle.value = data.price || 0
    return data.quantity || 0
  }
  pricePerBottle.value = 0
  return 0
})

const totalPrice = computed(() => {
  return form.value.quantity * pricePerBottle.value
})

function changeMonth(direction) {
  currentDate.value.setMonth(currentDate.value.getMonth() + direction)
  currentDate.value = new Date(currentDate.value) // trigger reactivity
}

function selectDate(day) {
  const year = currentDate.value.getFullYear()
  const month = String(currentDate.value.getMonth() + 1).padStart(2, '0')
  const dayStr = String(day).padStart(2, '0')
  selectedDate.value = `${year}-${month}-${dayStr}`
}

function showOrderForm() {
  if (!selectedDate.value) {
    alert("Please select a date first.")
    return
  }
  form.value.deliveryDate = selectedDate.value
  showOrder.value = true
}

function reviewOrder() {
  const { quantity, name, address, phone } = form.value
  if (!quantity || !name || !address || !phone) {
    alert("Please fill in all fields.")
    return
  }
  showOrder.value = false
  showReview.value = true
}

function submitOrder() {
  const orderData = {
    ...form.value,
    status: "Pending",
    price: totalPrice.value
  }

  const orders = JSON.parse(localStorage.getItem("orders")) || []
  orders.push(orderData)
  localStorage.setItem("orders", JSON.stringify(orders))

  alert("Order submitted successfully!")
  router.replace('/customer-home')
}

function cancelOrder() {
  showOrder.value = false
  showReview.value = false
}
</script>


<style scoped>
root {
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
  padding: .5rem 1rem;
  background-color: #3178c6;
  border-radius: 12px;
  color: white;
  margin-top: 1rem;
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



/* Calendar Section */
.calendar-container {
    margin: 20px 0;
    text-align: center;
}
.calendar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}
.calendar-header button {
    background: #0078D7;
    color: #fff;
    border: none;
    padding: 8px 15px;
    border-radius: 5px;
    cursor: pointer;
    transition: background 0.3s;
}
.calendar-header button:hover {
    background: #0056A1;
}
.days-row {
    display: flex;
    justify-content: space-around;
    font-weight: bold;
    color: #555;
    margin-bottom: 10px;
}
.calendar-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 10px;
}
.day, .empty {
    padding: 15px;
    border-radius: 5px;
    text-align: center;
    cursor: pointer;
    transition: background 0.3s;
}
.day {
    background: #f1f1f1;
}
.day:hover {
    background: #0078D7;
    color: #fff;
}

/* Stock Display */
.stock-display, .order-section, .review-section {
    margin: 20px 0;
    padding: 15px;
    border: 1px solid #ddd;
    border-radius: 10px;
    background: #fafafa;
}
.stock-display button {
    margin-top: 10px;
    padding: 10px 20px;
    background: #0078D7;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background 0.3s;
}
.stock-display button:hover {
    background: #0056A1;
}

/* Order Section */
form label {
    display: block;
    margin: 10px 0 5px;
    font-weight: bold;
}
form input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    margin-bottom: 15px;
}
form button {
    background: #0078D7;
    color: #fff;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    transition: background 0.3s;
}
form button:hover {
    background: #0056A1;
}

/* Review Section */
.review-section p {
    margin: 10px 0;
}
.review-section button {
    margin: 10px 10px 0 0;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}
#submitOrderButton {
    background: #28a745;
    color: #fff;
}
#cancelOrderButton {
    background: #dc3545;
    color: #fff;
}
button:hover {
    opacity: 0.9;
}

/* Responsive Design */
@media (max-width: 768px) {
    .calendar-header {
        flex-direction: column;
    }
    nav ul {
        flex-direction: column;
        align-items: center;
    }
    nav ul li {
        margin: 5px 0;
    }
    .container {
        padding: 15px;
    }
}

</style>
