<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useDisplay } from 'vuetify'

const { mobile } = useDisplay()
const router = useRouter()

// Form data
const email = ref('')
const password = ref('')
const role = ref('')

// Handle login
const login = () => {
  const storedUser = JSON.parse(localStorage.getItem('registeredUser'))

  if (
    storedUser &&
    storedUser.email === email.value &&
    storedUser.password === password.value &&
    storedUser.role === role.value
  ) {
    alert('Login successful!')
    router.push('/admin-shop') // redirect after login
  } else {
    alert('Invalid email, password, or role!')
  }
}
</script>

<template>
  <AppLayout>
    <template #content>
      <v-row>
        <v-col cols="12" md="6" class="mx-auto pt-16">
          <v-card class="mx-auto" elevation="24">
            <v-card-title class="text-center">
              <v-img class="mx-auto" src="/images/lbb.png" :width="mobile ? '75%' : '25%'" />
              <h3 class="font-weight-bold">Welcome to Pasteurized Milk</h3>
              <p>High-quality Milk</p>
            </v-card-title>

            <v-card-text class="bg-surface-light pt-4">
              <v-divider class="my-5"></v-divider>

              <v-form fast-fail @submit.prevent="login">
                <v-text-field
                  label="Email"
                  variant="outlined"
                  v-model="email"
                  required
                />
                <v-text-field
                  label="Password"
                  type="password"
                  variant="outlined"
                  v-model="password"
                  required
                />
                <v-select
                  label="Role"
                  :items="['Admin', 'Customer']"
                  v-model="role"
                  variant="outlined"
                  required
                />
                <v-btn class="mt-2" type="submit" block color="primary" prepend-icon="→">
                  Login
                </v-btn>
              </v-form>

              <v-divider class="my-5"></v-divider>

              <h5 class="text-center">
                Don't have an account?
                <RouterLink class="text-primary" to="/register">
                  Click here to Register
                </RouterLink>
              </h5>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </AppLayout>
</template>
