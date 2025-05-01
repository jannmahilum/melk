import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '@/views/auth/LoginView.vue';
import RegisterView from '@/views/auth/RegisterView.vue';
import AdminShopView from '@/views/auth/AdminShopView.vue'; 
import CusShopView from '@/views/auth/CusShopView.vue'; // updated import for customer shop view

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
    },
    {
      path: '/dashboard',  // Admin dashboard route
      name: 'dashboard',
      component: AdminShopView,
      meta: {
        requiresAdmin: true,
      },
    },
    {
      path: '/admin-shop',  // Customer dashboard route
      name: 'admin-shop',
      component: CusShopView, // This is now using the correct customer shop view
      meta: {
        requiresCustomer: true,
      },
    }
  ],
});

// Add navigation guard to check for admin or customer authentication
router.beforeEach((to, from, next) => {
  const storedUser = JSON.parse(localStorage.getItem('registeredUser'));
  
  // If the route requires admin and the user is not an admin, redirect to login
  if (to.meta.requiresAdmin && (!storedUser || storedUser.role !== 'Admin')) {
    next('/'); // Redirect to login page if user is not an admin
  } 
  // If the route requires a customer and the user is not a customer, redirect to login
  else if (to.meta.requiresCustomer && (!storedUser || storedUser.role !== 'Customer')) {
    next('/'); // Redirect to login page if user is not a customer
  }
  else {
    next(); // Proceed to the requested route
  }
});

export default router;
