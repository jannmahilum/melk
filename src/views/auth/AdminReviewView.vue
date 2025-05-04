<template>
  <div class="wrapper">
    <header class="review-header">
      <h1 class="logo">Milk Shop</h1>
      <nav class="nav-links">
        <router-link to="/admin-shop" active-class="active">Shop</router-link>
        <router-link to="/admin-orders" active-class="active">Orders</router-link>
        <router-link to="/admin-review" active-class="active" exact>Review</router-link>
        <router-link to="/admin-profile" active-class="active">Profile</router-link>
      </nav>
    </header>

    <h1>User Review</h1>
    <div id="review">
      <div v-if="reviews.length === 0">
        <p>No reviews available yet.</p>
      </div>
      <div v-else>
        <div class="review-item">
          <p><strong>Rating:</strong> {{ latestReview.rating || 'Not rated' }}</p>
          <p><strong>Comment:</strong> {{ latestReview.comment || 'No comment' }}</p>
          <p><strong>Date:</strong> {{ latestReview.date }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';

// Define a ref to hold reviews
const reviews = ref([]);

// Define a computed property for the latest review
const latestReview = computed(() => reviews.value[reviews.value.length - 1]);

// Fetch reviews from localStorage when the component is mounted
onMounted(() => {
  const storedReviews = JSON.parse(localStorage.getItem('userReviews')) || [];
  reviews.value = storedReviews;

  const router = useRouter();
  // Force refresh if already on the review route
  if (router.currentRoute.value.path !== '/admin-review') {
    router.push('/admin-review');
  }
});
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

.review-header {
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

.review-header .logo {
  font-size: 1.5rem;
  font-weight: bold;
}

.nav-links {
  display: flex;
  justify-content: space-between;  
  gap: .5rem;                                          
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


/* Reviews Section */
#reviews {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin: 20px auto;
    max-width: 800px;
    padding: 20px;
    background-color: #fff;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
}

.review-item {
    padding: 15px;
    border: 1px solid #ddd;
    border-radius: 5px;
    background-color: #f9f9f9;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.review-item h3 {
    font-size: 18px;
    color: #007BFF;
    margin-bottom: 10px;
}

.review-item p {
    font-size: 16px;
    color: #555;
}

.review-item span {
    font-size: 14px;
    color: #999;
    font-style: italic;
}

/* Responsive Design */
@media (max-width: 768px) {
    nav a {
        margin: 0 8px;
        font-size: 14px;
    }

    h1 {
        font-size: 20px;
    }

    #reviews {
        padding: 15px;
    }

    .review-item h3 {
        font-size: 16px;
    }

    .review-item p {
        font-size: 14px;
    }

    .review-item span {
        font-size: 12px;
    }

}
</style>
