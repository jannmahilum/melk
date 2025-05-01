

<template>
  <div class="container">
    <h1>Milk Shop</h1>
    <p>Select a date to see milk stock availability and update the stock.</p>

    <!-- Calendar Section -->
    <div class="calendar-container">
      <div class="calendar-header">
        <button @click="prevMonth">&lt;</button>
        <h2>{{ monthYear }}</h2>
        <button @click="nextMonth">&gt;</button>
      </div>
      <div class="days-row">
        <span v-for="day in ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']" :key="day">{{ day }}</span>
      </div>
      <div class="calendar-grid">
        <template v-for="(cell, index) in calendarCells" :key="index">
          <span v-if="cell.empty" class="empty"></span>
          <span v-else class="day" @click="showStockUpdateForm(cell.dateStr)">
            {{ cell.day }} ({{ cell.stock }} bottles)
          </span>
        </template>
      </div>
    </div>

    <!-- Stock Update Section -->
    <div class="stock-update" v-if="selectedDate">
      <h3>Update Stock for <span>{{ selectedDate }}</span></h3>
      <label for="stockQuantity">Enter Available Stock (in bottles):</label>
      <input type="number" v-model.number="stockQuantity" min="0" />
      <button @click="updateStock">Update Stock</button>
    </div>

    <!-- Monthly Inventory Section -->
    <div class="monthly-inventory">
      <h3>Monthly Inventory</h3>
      <p><strong>Month:</strong> {{ currentMonthName }}</p>
      <p><strong>Produced Product:</strong> {{ producedProduct }}</p>
      <p><strong>Sold Milk:</strong> {{ soldMilk }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'


import { useDisplay } from 'vuetify'

const currentDate = ref(new Date())
const selectedDate = ref('')
const stockQuantity = ref(0)

const stockData = ref(JSON.parse(localStorage.getItem('stockData')) || {})
const orders = ref(JSON.parse(localStorage.getItem('orders')) || [])

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const monthYear = computed(() => {
  const date = currentDate.value
  return `${monthNames[date.getMonth()]} ${date.getFullYear()}`
})

const currentMonthName = computed(() => monthNames[currentDate.value.getMonth()])
const calendarCells = ref([])
const producedProduct = ref(0)
const soldMilk = ref(0)

function renderCalendar() {
  const date = currentDate.value
  const year = date.getFullYear()
  const month = date.getMonth()

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const cells = []
  for (let i = 0; i < firstDay; i++) {
    cells.push({ empty: true })
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    cells.push({
      day,
      dateStr,
      stock: stockData.value[dateStr] || 0,
    })
  }

  calendarCells.value = cells
  updateMonthlyInventory()
}

function showStockUpdateForm(dateStr) {
  selectedDate.value = dateStr
  stockQuantity.value = stockData.value[dateStr] || 0
}

function updateStock() {
  if (isNaN(stockQuantity.value) || stockQuantity.value < 0) {
    alert('Please enter a valid stock quantity.')
    return
  }

  stockData.value[selectedDate.value] = stockQuantity.value
  localStorage.setItem('stockData', JSON.stringify(stockData.value))
  selectedDate.value = ''
  renderCalendar()
}

function updateMonthlyInventory() {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()

  let totalProduced = 0
  for (let day = 1; day <= new Date(year, month + 1, 0).getDate(); day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    totalProduced += stockData.value[dateStr] || 0
  }
  producedProduct.value = totalProduced

  let totalSold = 0
  for (const order of orders.value) {
    const d = new Date(order.date)
    if (order.status === 'Approved' && d.getMonth() === month) {
      totalSold += order.quantity
    }
  }

  soldMilk.value = totalSold
}

function prevMonth() {
  currentDate.value.setMonth(currentDate.value.getMonth() - 1)
  renderCalendar()
}

function nextMonth() {
  currentDate.value.setMonth(currentDate.value.getMonth() + 1)
  renderCalendar()
}

onMounted(() => {
  renderCalendar()
})
</script>

<style scoped>
/* You can import your existing CSS or convert to scoped styles here */
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  margin-top: 0.5rem;
}

.day {
  padding: 8px;
  background-color: #eef;
  cursor: pointer;
  text-align: center;
  border-radius: 4px;
}

.empty {
  height: 40px;
}
</style>
