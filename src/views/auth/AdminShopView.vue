<template>
  <div class="wrapper">
    <!-- Header -->
    <header class="shop-header">
      <h1 class="logo">Milk Shop</h1>
      <nav class="nav-links">
        <router-link to="/admin-shop" active-class="active">Shop</router-link>
        <router-link to="/admin-orders" active-class="active">Orders</router-link>
        <router-link to="/admin-review" active-class="active">Review</router-link>
        <router-link to="/admin-profile" active-class="active">Profile</router-link>
      </nav>
    </header>

    <!-- Calendar -->
    <div class="calendar-section">
      <p class="calendar-info">Select a date to view or update milk stock.</p>

      <div class="calendar-header">
        <button @click="prevMonth">‹</button>
        <input type="month" v-model="selectedMonth" class="month-picker" @change="onMonthChange" />
        <button @click="nextMonth">›</button>
      </div>

      <div class="days">
        <span v-for="day in daysShort" :key="day">{{ day }}</span>
      </div>

      <div class="calendar">
        <template v-for="(cell, index) in calendarCells" :key="index">
          <div v-if="cell.empty" class="empty"></div>
          <div
            v-else
            class="day"
            :class="{ selected: cell.dateStr === selectedDate }"
            @click="showStockUpdateForm(cell.dateStr)"
          >
            <div class="day-number">{{ cell.day }}</div>
            <div class="day-stock">({{ cell.stock }} bottles)</div>
          </div>
        </template>
      </div>
    </div>

    <!-- Side Panel -->
    <div class="side-panel">
      <section v-if="selectedDate" class="stock-update">
        <h3>Update Stock for {{ selectedDate }}</h3>
        <input
          type="number"
          v-model.number="stockQuantity"
          min="0"
          placeholder="Enter stock (bottles)"/>
<input
  type="number"
  v-model="stockPrice"
  min="0"
  placeholder="Enter price per bottle"
/>

        <p v-if="expiryData[selectedDate]"><strong>Expires on:</strong> {{ formatReadableDate(expiryData[selectedDate]) }}</p>
        <p v-if="stockData[selectedDate]">
          <strong>Price per bottle:</strong> ₱{{ stockPrice }}
        </p>
          <p v-if="stockQuantity && stockPrice"> 
            <strong>Income:</strong> ₱{{ income }}
        </p>
        <button @click="updateStock">Save</button>
      </section>

      <section class="summary">
        <h3>Monthly Inventory</h3>
        <p><strong>Month:</strong> {{ currentMonthName }}</p>
        <p><strong>Produced:</strong> {{ producedProduct }} bottles</p>
        <p><strong>Sold:</strong> {{ soldMilk }} bottles</p>
        <p><strong>Total Monthly Income:</strong> ₱{{ monthlyIncome }}</p>
        <button @click="showResetModal" class="reset" style="margin-top: 1rem">Reset All</button>
      </section>
    </div>
  </div>

  <!-- Modal -->
  <div v-if="showModal" class="modal-overlay">
    <div class="modal">
      <p>Are you sure you want to reset the stock data for this month?</p>
      <div class="modal-buttons">
        <button @click="cancelReset">Cancel</button>
        <button @click="confirmReset">OK</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'


const currentDate = ref(new Date())
const selectedDate = ref('')
const stockQuantity = ref(0)
const stockPrice = ref('')  

const stockData = ref(JSON.parse(localStorage.getItem('stockData')) || {})
const expiryData = ref(JSON.parse(localStorage.getItem('expiryData')) || {}) // 🆕

const orders = ref(JSON.parse(localStorage.getItem('orders')) || [])
const selectedMonth = ref(formatMonth(currentDate.value))
const daysShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const calendarCells = ref([])
const producedProduct = ref(0)
const soldMilk = ref(0)
const showModal = ref(false)
const monthToReset = ref('')

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const currentMonthName = computed(() => {
  const [year, month] = selectedMonth.value.split('-')
  return monthNames[parseInt(month) - 1]
})

const income = computed(() => {
  // Income = stock quantity * price per bottle
  return stockQuantity.value * stockPrice.value;
});

const monthlyIncome = computed(() => {
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth();
  let totalIncome = 0;

  // Loop through all days of the selected month
  for (let d = 1; d <= new Date(year, month + 1, 0).getDate(); d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    
    // Calculate the income for each day
    const dailyStock = stockData.value[dateStr];
    if (dailyStock) {
      totalIncome += dailyStock.quantity * dailyStock.price;
    }
  }

  return totalIncome;
});



function formatReadableDate(dateStr) {
  if (!dateStr) return ''
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateStr).toLocaleDateString('en-US', options)
}

function formatMonth(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

function showResetModal() {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  monthToReset.value = `${year}-${String(month + 1).padStart(2, '0')}`
  showModal.value = true
}

function cancelReset() {
  showModal.value = false
}

function confirmReset() {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  for (let d = 1; d <= new Date(year, month + 1, 0).getDate(); d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    delete stockData.value[dateStr]
    delete expiryData.value[dateStr] // 🆕
  }
  localStorage.setItem('stockData', JSON.stringify(stockData.value))
  localStorage.setItem('expiryData', JSON.stringify(expiryData.value)) // 🆕
  stockQuantity.value = 0
  renderCalendar()
  showModal.value = false
}

function onMonthChange() {
  const [year, month] = selectedMonth.value.split('-')
  currentDate.value = new Date(+year, +month - 1)
  renderCalendar()
}

function renderCalendar() {
  const date = currentDate.value;
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push({ empty: true });

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    cells.push({
      day,
      dateStr,
      stock: stockData.value[dateStr]?.quantity || 0,  // Display stock for the date
      expiry: expiryData.value[dateStr] || null  // Handle expiry data
    });
  }

  calendarCells.value = cells;
  updateMonthlyInventory();  // Recalculate monthly inventory
}


function showStockUpdateForm(dateStr) {
  selectedDate.value = dateStr;
  stockQuantity.value = stockData.value[dateStr]?.quantity || 0;  // Ensure initial value is correct
  stockPrice.value = stockData.value[dateStr]?.price || 0;  // Ensure initial price is set
  localStorage.setItem('selectedDate', dateStr);  // Store the selected date for persistence
}

function updateStock() {
  if (isNaN(stockQuantity.value) || stockQuantity.value < 0) return alert('Enter a valid quantity.');

  // Update stockData only for the selected date
  stockData.value[selectedDate.value] = {
    quantity: stockQuantity.value,
    price: stockPrice.value
  };

  const baseDate = new Date(selectedDate.value);
  baseDate.setDate(baseDate.getDate() + 30);  // Expiry date logic
  const expiryDateStr = baseDate.toISOString().split('T')[0];
  expiryData.value[selectedDate.value] = expiryDateStr;

  // Store updated stock data and expiry data in localStorage
  localStorage.setItem('stockData', JSON.stringify(stockData.value));
  localStorage.setItem('expiryData', JSON.stringify(expiryData.value));

  renderCalendar();  // Re-render calendar after updating
}


function updateMonthlyInventory() {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  let produced = 0, sold = 0

  for (let d = 1; d <= new Date(year, month + 1, 0).getDate(); d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    produced += stockData.value[dateStr]?.quantity || 0
  }
  
  for (const order of orders.value) {
    const d = new Date(order.date)
    if (order.status === 'Approved' && d.getMonth() === month && d.getFullYear() === year) {
      sold += order.quantity
    }
  }

  producedProduct.value = produced
  soldMilk.value = sold
}

function prevMonth() {
  currentDate.value.setMonth(currentDate.value.getMonth() - 1)
  selectedMonth.value = formatMonth(currentDate.value)
  renderCalendar()
}

function nextMonth() {
  currentDate.value.setMonth(currentDate.value.getMonth() + 1)
  selectedMonth.value = formatMonth(currentDate.value)
  renderCalendar()
}

onMounted(() => {
  const savedDate = localStorage.getItem('selectedDate')
  if (savedDate) {
    selectedDate.value = savedDate
    stockQuantity.value = stockData.value[savedDate]?.quantity || 0
    stockPrice.value = stockData.value[savedDate]?.price || 0
  }
  renderCalendar()
})
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
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 1rem;
  height: 95vh;
  padding: 0.75rem;
  background: var(--milk-blue-light);
}

/* 🔵 Modern Header Style */
.shop-header {
  grid-column: 1 / -1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background-color: #3178c6;
  border-radius: 12px;
  color: white;
  margin-bottom: 3rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.shop-header .logo {
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

.calendar-section {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  margin-top: 0.5rem;
}

.calendar-info {
  font-size: 1rem;
  margin-bottom: 0.5rem;
  color: #333;
}

.calendar-header {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding: 0.25rem 0;
  font-weight: 600;
}

.calendar-header button {
  padding: 0.25rem 0.5rem;
  font-size: 1.2rem;
  background: #3178c6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.calendar-header button:hover {
  background-color: #2563eb;
}

.calendar-header input[type='month'] {
  padding: 0.25rem 0.5rem;
  text-align: center;
  font-size: 0.95rem;
  border-radius: 6px;
  border: 1px solid #ccc;
}

.days,
.calendar {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 6px;
}

.days span {
  text-align: center;
  font-weight: bold;
  color: #333;
}

.day {
  background: var(--milk-blue);
  padding: 8px 6px;
  border-radius: 6px;
  text-align: center;
  cursor: pointer;
  min-height: 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.day.selected {
  border: 2px solid #2563eb;
}

.day-number {
  font-weight: bold;
  color: #3178c6;
}

.day-stock {
  font-size: 0.75rem;
  color: #555;
}

.empty {
  height: 60px;
}

.side-panel {
  background: var(--milk-white);
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid var(--milk-border);
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.stock-update,
.summary {
  width: 100%;
  max-width: 350px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.stock-update h3,
.summary h3 {
  color: rgb(81, 108, 181);
}

input[type='number'] {
  width: 100%;
  padding: 0.5rem;
  margin: 0.5rem 0 1rem;
  border-radius: 6px;
  border: 1px solid #ccc;
}

button {
  background-color: #3178c6;
  color: white;
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

button:hover {
  background-color: #2563eb;
}

button.reset {
  background-color: #f87171;
}

button.reset:hover {
  background-color: #ef4444;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  width: 300px;
  text-align: center;
}

.modal p {
  font-size: 1rem;
  margin-bottom: 1rem;
}

.modal-buttons button {
  padding: 0.5rem 1rem;
  margin: 0.5rem;
  border-radius: 6px;
  cursor: pointer;
}

.modal-buttons button:first-child {
  background-color: #f87171;
  color: white;
}

.modal-buttons button:last-child {
  background-color: #2563eb;
  color: white;
}

.modal-buttons button:hover {
  opacity: 0.9;
}

@media (min-width: 1024px) {
  .wrapper {
    grid-template-columns: 1.75fr 1fr; /* Adjust for larger screens to balance content */
  }

  .calendar-section {
    margin-bottom: 0; /* Remove bottom margin for the calendar section on large screens */
  }

  .side-panel {
    margin-top: 0.5rem; /* Adjust side panel top margin for desktop view */
  }
}
</style>
