<template>
  <div class="wrapper">
    <!-- Profile Header (Fixed on top) -->
    <header class="profile-header">
      <h1 class="logo">Milk Shop</h1>
      <nav class="nav-links">
        <router-link to="/admin-shop" active-class="active">Shop</router-link>
        <router-link to="/admin-orders" active-class="active">Orders</router-link>
        <router-link to="/admin-review" active-class="active">Review</router-link>
        <router-link to="/admin-profile" active-class="active">Profile</router-link>
      </nav>
    </header>

    <!-- Profile View Mode (Now Above Header) -->
    <div class="profile-container" v-if="!isEditMode">
      <div class="profile-header-wrapper">
        <h1>Profile</h1>
        <button class="btn btn-edit" @click="toggleEditMode">Edit</button>
      </div>
      <p><strong>Name:</strong> {{ adminName }}</p>
      <p><strong>Email:</strong> {{ adminEmail }}</p>
      <p><strong>Role:</strong> {{ adminRole }}</p>

      <div class="actions">
        <button class="btn btn-logout" @click="logout">Logout</button>
        <button class="btn btn-delete" @click="deleteAccount">Delete Account</button>
      </div>
    </div>

    <!-- Edit Profile Mode -->
    <div class="profile-container" v-if="isEditMode">
      <h1>Edit Profile</h1>
      <form @submit.prevent="saveChanges">
        <label for="edit-name">Name:</label>
        <input id="edit-name" type="text" v-model="editName" required />

        <label for="edit-email">Email:</label>
        <input id="edit-email" type="email" v-model="editEmail" required />

        <label for="edit-role">Role:</label>
        <input id="edit-role" type="text" value="Admin" disabled />

        <div class="actions">
          <button class="btn" type="submit">Save Changes</button>
          <button class="btn btn-cancel" type="button" @click="toggleEditMode">Cancel</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// State for admin profile
const adminName = ref('')
const adminEmail = ref('')
const adminRole = ref('') // Add role for display
const editName = ref('')
const editEmail = ref('')
const isEditMode = ref(false)

onMounted(() => {
  const storedUser = JSON.parse(localStorage.getItem('registeredUser'))
  if (storedUser && storedUser.role === 'Admin') {
    adminName.value = storedUser.firstname + ' ' + storedUser.lastname
    adminEmail.value = storedUser.email
    adminRole.value = storedUser.role // Set the role
    editName.value = adminName.value
    editEmail.value = adminEmail.value
  } else {
    // Fallback if no admin data is found in localStorage
    adminName.value = '[ADMIN NAME]'
    adminEmail.value = '[ADMIN EMAIL]'
    adminRole.value = 'Admin'
  }
})

const toggleEditMode = () => {
  isEditMode.value = !isEditMode.value
}

const saveChanges = () => {
  // Save to localStorage when profile is edited
  const updatedUser = {
    firstname: editName.value.split(' ')[0],
    lastname: editName.value.split(' ')[1],
    email: editEmail.value,
    role: 'Admin' // Since this is admin profile
  }

  localStorage.setItem('registeredUser', JSON.stringify(updatedUser))
  adminName.value = editName.value
  adminEmail.value = editEmail.value
  toggleEditMode()
}

// Logout function (clears session data, not account data)
const logout = () => {
  // Clear only session data (this could be a token or flag indicating the logged-in state)
  sessionStorage.removeItem('authToken') // Example of clearing session data
  window.location.href = '/' // Redirect to login page
}

// Delete account function (completely removes the account data from localStorage)
const deleteAccount = () => {
  const confirmDelete = confirm('Are you sure you want to delete your account? This action cannot be undone.')
  if (confirmDelete) {
    // Clear user data from localStorage and redirect to login page
    localStorage.removeItem('registeredUser')
    window.location.href = '/' // Redirect to home or login page after account deletion
  }
}
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

/* Profile Header (Fixed on top) */
.profile-header {
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

.profile-header .logo {
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

/* Profile View Mode */
.profile-container {
  background: #fff;
  max-width: 600px;
  width: 100%;
  margin: 2rem auto;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.profile-header-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.profile-container h1 {
  margin-bottom: 1rem;
  font-size: 2rem;
}

.profile-container p {
  margin: 0.5rem 0;
  font-size: 1.1rem;
}

input[type='text'],
input[type='email'] {
  width: 100%;
  padding: 0.75rem;
  margin: 0.5rem 0 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}

.actions {
  margin-top: 1.5rem;
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.btn-logout {
  background-color: #2980b9;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-logout {
  background-color:rgb(122, 135, 144);
}

.btn-logout:hover {
  background-color: #2980b9;
}





.btn-delete {
  background-color: #e74c3c;
  color: white;
  padding: .4rem .4rem;
  font-size: 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-delete:hover {
  background-color: #c0392b;
}
</style>
