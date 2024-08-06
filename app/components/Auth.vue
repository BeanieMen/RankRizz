<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="flex justify-center items-center">
    <div class="w-full max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <div class="flex justify-around mb-8">
        <button
          :class="{
            'bg-blue-500 text-white': isSignup,
            'bg-gray-200 text-gray-700': !isSignup,
          }"
          class="w-1/2 font-bold py-2 px-4 rounded-lg transition duration-300"
          @click="toggleForm(true)"
        >
          Sign Up
        </button>
        <button
          :class="{
            'bg-blue-500 text-white': !isSignup,
            'bg-gray-200 text-gray-700': isSignup,
          }"
          class="w-1/2 font-bold py-2 px-4 rounded-lg transition duration-300"
          @click="toggleForm(false)"
        >
          Log In
        </button>
      </div>

      <div v-if="isSignup">
        <SignupComponent />
      </div>
      <div v-else>
        <LoginComponent />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import SignupComponent from '~~/app/components/SignUp.vue'
import LoginComponent from '~~/app/components/LogIn.vue'

const isSignup = ref(true)

const toggleForm = (signup: boolean) => {
  isSignup.value = signup
}
</script>

  <style scoped>
    button {
      transition: background-color 0.3s ease;
    }
  </style>
