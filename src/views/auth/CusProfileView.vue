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

    <section class="user-profile">
      <h2>User Profile</h2>
      <div v-if="!editing">
        <p><strong>Name:</strong> {{ name }}</p>
        <p><strong>Email:</strong> {{ email }}</p>
        <p><strong>Phone:</strong> {{ phone }}</p>
        <p><strong>Address:</strong> {{ address }}</p>
        <button @click="startEdit">Edit Profile</button>
      </div>
      <div v-else>
        <input v-model="editName" placeholder="Name" />
        <input v-model="editEmail" placeholder="Email" />
        <input v-model="editPhone" placeholder="Phone" />
        <input v-model="editAddress" placeholder="Address" />
        <button @click="saveEdit">Save</button>
        <button @click="cancelEdit">Cancel</button>
      </div>
    </section>

    <section class="web-ratings-section">
      <h2>Rate Our Website</h2>
      <select v-model="rating">
        <option disabled value="">Select Rating</option>
        <option>⭐</option>
        <option>⭐⭐</option>
        <option>⭐⭐⭐</option>
        <option>⭐⭐⭐⭐</option>
        <option>⭐⭐⭐⭐⭐</option>
      </select>
      <textarea v-model="comment" placeholder="Write your comment here..."></textarea>
      <button @click="submitReview">Submit Review</button>

      <div v-if="latestReview" class="latest-review">
        <h3>Latest Review</h3>
        <p><strong>Rating:</strong> {{ latestReview.rating }}</p>
        <p><strong>Comment:</strong> {{ latestReview.comment }}</p>
        <p><strong>Date:</strong> {{ latestReview.date }}</p>
      </div>
    </section>

    <section class="account-actions">
      <button class="logout-button" @click="logout">Logout</button>
      <button class="delete-button" @click="deleteAccount">Delete Account</button>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const name = ref('John Doe')
const email = ref('johndoe@example.com')
const phone = ref('+63 123 456 7890')
const address = ref('123 Main Street, City, Country')
const editing = ref(false)

const editName = ref('')
const editEmail = ref('')
const editPhone = ref('')
const editAddress = ref('')

const rating = ref('')
const comment = ref('')
const latestReview = ref(null)

function startEdit() {
  editing.value = true
  editName.value = name.value
  editEmail.value = email.value
  editPhone.value = phone.value
  editAddress.value = address.value
}

function saveEdit() {
  name.value = editName.value
  email.value = editEmail.value
  phone.value = editPhone.value
  address.value = editAddress.value
  editing.value = false
  alert('Profile updated successfully!')
}

function cancelEdit() {
  editing.value = false
}

function submitReview() {
  if (!rating.value || !comment.value) {
    alert('Please provide both a rating and a comment.')
    return
  }
  const reviews = JSON.parse(localStorage.getItem('userReviews')) || []
  const newReview = {
    rating: rating.value,
    comment: comment.value,
    date: new Date().toLocaleString()
  }
  reviews.push(newReview)
  localStorage.setItem('userReviews', JSON.stringify(reviews))
  latestReview.value = newReview
  rating.value = ''
  comment.value = ''
  alert('Thank you for your feedback!')
}

function loadLatestReview() {
  const reviews = JSON.parse(localStorage.getItem('userReviews')) || []
  latestReview.value = reviews[reviews.length - 1] || null
}

function logout() {
  alert('You have been logged out.')
  window.location.href = '/'
}

function deleteAccount() {
  if (confirm('Are you sure you want to delete your account?')) {
    localStorage.removeItem('orders')
    localStorage.removeItem('userReviews')
    alert('Account deleted.')
    window.location.href = '/'
  }
}

onMounted(() => {
  loadLatestReview()
})
</script>

<style scoped>
:root {
  --milk-blue: #e6f2ff;
  --milk-white: #ffffff;
  --milk-border: #cce0f5;
  --milk-blue-light: #f9fbff;
}

.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.75rem;
  background: var(--milk-blue-light);
}

/* Header */
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

.user-profile,
.web-ratings-section,
.account-actions {
  width: 100%;
  max-width: 700px;
  background: white;
  border: 1px solid var(--milk-border);
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 2rem;
}

textarea,
input,
select {
  width: 100%;
  margin-top: 0.5rem;
  padding: 0.5rem;
  border-radius: 6px;
  border: 1px solid var(--milk-border);
}

button {
  margin-top: 0.75rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.logout-button {
  background-color: #f57c00;
  color: white;
}

.delete-button {
  background-color: #d32f2f;
  color: white;
  margin-left: 1rem;
}
</style>
