<template>
  <div class="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
    <form @submit.prevent="submitForm">
      <div class="mb-4">
        <label
          for="username"
          class="block text-gray-700 font-bold mb-2"
        >Username:</label>
        <input
          id="username"
          v-model="username"
          type="text"
          required
          class="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
      </div>
      <button
        type="submit"
        class="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
      >
        Generate Account
      </button>
      <p
        v-if="errorMessage"
        class="mt-4 text-red-500 font-bold"
      >
        {{ errorMessage }}
      </p>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const username = ref('')
const errorMessage = ref('')

const submitForm = async () => {
  errorMessage.value = ''

  try {
    const response = await fetch('/api/generate-account', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: username.value }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      errorMessage.value = errorData.error || 'An unexpected error occurred'
      return
    }

    const data = await response.json()
    if (data.error) {
      errorMessage.value = data.error
    }
    else {
      username.value = ''
    }
  }
  catch (error) {
    console.error('There was a problem with the fetch operation:', error)
    errorMessage.value = 'There was a problem with the fetch operation'
  }
}
</script>
