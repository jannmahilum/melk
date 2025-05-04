import { createRouter, createWebHistory } from 'vue-router';

import LoginView from '@/views/auth/LoginView.vue';
import RegisterView from '@/views/auth/RegisterView.vue';

import AdminShopView from '@/views/auth/AdminShopView.vue';
import AdminProfileView from '@/views/auth/AdminProfileView.vue';
import AdminReviewView from '@/views/auth/AdminReviewView.vue';
import AdminOrders from '@/views/auth/AdminOrders.vue';

import CusProfileView from '@/views/auth/CusProfileView.vue';
import CusShopView from '@/views/auth/CusShopView.vue';
import CusHomeView from '@/views/auth/CusHomeView.vue';
import CusOrderStatusView from '@/views/auth/CusOrderStatusView.vue'; // ✅ New import

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Public routes
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

    // Admin routes
    {
      path: '/admin-profile',
      name: 'admin-profile',
      component: AdminProfileView,
      meta: { requiresAdmin: true },
    },
    {
      path: '/admin-review',
      name: 'admin-review',
      component: AdminReviewView,
      meta: { requiresAdmin: true },
    },
    {
      path: '/admin-orders',
      name: 'admin-orders',
      component: AdminOrders,
      meta: { requiresAdmin: true },
    },
    {
      path: '/admin-shop',
      name: 'admin-shop',
      component: AdminShopView,
      meta: { requiresAdmin: true },
    },

    // Customer routes
    {
      path: '/customer-home',
      name: 'customer-home',
      component: CusHomeView,
      meta: { requiresCustomer: true },
    },
    {
      path: '/customer-shop',
      name: 'customer-shop',
      component: CusShopView,
      meta: { requiresCustomer: true },
    },
    {
      path: '/customer-profile',
      name: 'customer-profile',
      component: CusProfileView,
      meta: { requiresCustomer: true },
    },
    {
      path: '/customer-status', // ✅ New route
      name: 'customer-status',
      component: CusOrderStatusView,
      meta: { requiresCustomer: true },
    },
  ],
});

// ✅ Route Guard
router.beforeEach((to, from, next) => {
  const storedUser = JSON.parse(localStorage.getItem('registeredUser'));
  console.log('Stored user:', storedUser);

  if (to.meta.requiresAdmin) {
    if (!storedUser || storedUser.role !== 'Admin') {
      console.log('User is not an admin, redirecting...');
      next('/');
    } else {
      next();
    }
  } else if (to.meta.requiresCustomer) {
    if (!storedUser || storedUser.role !== 'Customer') {
      console.log('User is not a customer, redirecting...');
      next('/');
    } else {
      next();
    }
  } else {
    next(); // Public route
  }
});

export default router;
