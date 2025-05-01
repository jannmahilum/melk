<script setup>
import { ref } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import { useDisplay } from 'vuetify'
import { useRouter } from 'vue-router'

const { mobile } = useDisplay()
const router = useRouter()

// Form fields
const firstname = ref('')
const lastname = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const role = ref('')

// Submit handler
const registerUser = () => {
  if (password.value !== confirmPassword.value) {
    alert('Passwords do not match!')
    return
  }

  const user = {
    firstname: firstname.value,
    lastname: lastname.value,
    email: email.value,
    password: password.value,
    role: role.value
  }

  // Save to localStorage
  localStorage.setItem('registeredUser', JSON.stringify(user))

  alert('Registration successful!')
  router.push('/') // Redirect to login page
}
</script>


<template>
  <AppLayout>
    <template #content>
      <v-row>
        <v-col cols="12" md="6" class="mx-auto pt-16">
          <v-card class="mx-auto" elevation="24">
            <v-card-title class="text-center">
              <v-img
                class="mx-auto"
                src="/public/images/lbb.png"
                :width="mobile ? '75%' : '25%'"
              ></v-img>
              <h3 class="font-weight-bold">Welcome to Pasteurized Milk</h3>
              <p >High-quality Milk</p>
            </v-card-title>

            <v-card-text class="bg-surface-light pt-4">
<v-form fast-fail @submit.prevent="registerUser">

  <v-text-field label="Firstname" variant="outlined"></v-text-field>

  <v-text-field label="Lastname" variant="outlined"></v-text-field>

  <v-text-field label="Email" variant="outlined"></v-text-field>

  <v-text-field label="Password" type="password" variant="outlined"></v-text-field>

  <v-text-field
    label="Password Confirmation"
    type="password"
    variant="outlined"
  ></v-text-field>

  <v-select
    label="Role"
  :items="['Admin', 'Customer']"
    variant="outlined"
    required
    item-value="value"
    item-title="text"
    return-object
  > </v-select>

  <v-btn class="mt-2" type="submit" block>Submit</v-btn>
</v-form>


              <v-divider class="my-5"></v-divider>

              <h5 class="text-center">
                Already have account?<RouterLink class="text-primary" to="/">
                  Click here to Login
                </RouterLink>
              </h5>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </AppLayout>
</template>
