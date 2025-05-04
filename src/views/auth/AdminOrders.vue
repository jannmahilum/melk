<template>
  <div class="wrapper">
    <header class="order-header">
      <h1 class="logo">Milk Shop</h1>
      <nav class="nav-links">
        <router-link to="/admin-shop" active-class="active">Shop</router-link>
        <router-link to="/admin-orders" active-class="active">Orders</router-link>
        <router-link to="/admin-review" active-class="active">Review</router-link>
        <router-link to="/admin-profile" active-class="active">Profile</router-link>
      </nav>
    </header>

    <h1>Customer Orders</h1>
    <table>
      <thead>
        <tr>
          <th>Quantity</th>
          <th>Name</th>
          <th>Address</th>
          <th>Price</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(order, index) in orders" :key="index">
          <td>{{ order.quantity }}</td>
          <td>{{ order.name }}</td>
          <td>{{ order.address }}</td>
          <td>₱{{ order.price }}</td>
          <td>{{ order.status }}</td>
          <td>
            <button 
              v-if="order.status === 'Pending'" 
              @click="approveOrder(index)"
            >Approve</button>
            <button 
              v-if="order.status === 'Pending'" 
              @click="rejectOrder(index)"
            >Reject</button>
            <button 
              v-if="order.status === 'Pending'" 
              @click="cancelOrder(index)"
            >Cancel</button>
            <button v-if="order.status === 'Approved'" disabled>Approved</button>
            <button v-if="order.status === 'Rejected'" disabled>Rejected</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// Define a ref to hold orders
const orders = ref([]);

// Fetch orders from localStorage when the component is mounted
onMounted(() => {
  const storedOrders = JSON.parse(localStorage.getItem('orders')) || [];
  orders.value = storedOrders;
});

// Function to approve an order
const approveOrder = (index) => {
  orders.value[index].status = 'Approved';
  localStorage.setItem('orders', JSON.stringify(orders.value));
};

// Function to reject an order
const rejectOrder = (index) => {
  orders.value[index].status = 'Rejected';
  localStorage.setItem('orders', JSON.stringify(orders.value));
};

// Function to cancel an order
const cancelOrder = (index) => {
  orders.value[index].status = 'Cancelled';
  localStorage.setItem('orders', JSON.stringify(orders.value));
};
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

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: .95rem 1rem;
  background-color: #3178c6;
  border-radius: 12px;
  color: white;
  margin-bottom: 3rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.order-header .logo {
  font-size: 1.5rem;
  font-weight: bold;
}

.nav-links {
  display: flex;
  justify-content: space-between;  
  gap: .95rem;                     
                      
}

.nav-links a {
  color: white;
  font-size: 16px;
  text-decoration: none;
  font-weight: 500;
  padding: 6px 12px;
  border-radius: 5px;
  transition: background-color 0.2s;
}

.nav-links a:hover,
.nav-links .active {
  background-color: rgba(255, 255, 255, 0.2);
}



/* Table Styling */
table {
  width: 100%;
  max-width: 800px;
  margin: 20px auto;
  border-collapse: collapse;
  background-color: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

th, td {
  padding: 10px;
  text-align: left;
  border: 1px solid #ddd;
}

th {
  background-color: #f9f9f9;
}

td button {
  padding: 6px 12px;
  border-radius: 5px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
}

td button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

td button:hover:not(:disabled) {
  background-color: #0056b3;
}

/* Responsive Design */
@media (max-width: 768px) {
  .nav-links {
    max-width: 100%;
    justify-content: space-between;
  }

  nav a {
    margin: 0 4px;
    font-size: 12px;
  }

  h1 {
    font-size: 18px;
  }

  table {
    padding: 8px;
  }

  th, td {
    padding: 8px;
  }
}
</style>
