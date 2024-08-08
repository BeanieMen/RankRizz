<template>
  <div class="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
    <form @submit.prevent="submitForm">
      <div class="mb-4">
        <label for="username" class="block text-gray-700 font-bold mb-2">Username:</label>
        <input id="username" v-model="username" type="text" required
          class="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
      </div>
      <button type="submit"
        class="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300">
        Generate Account
      </button>
      <p v-if="errorMessage" class="mt-4 text-red-500 font-bold">
        {{ errorMessage }}
      </p>
      <p v-if="successMessage" class="mt-4 text-green-500 font-bold">
        <a :href="successLink" class="text-green-500 hover:underline">
          {{ successMessage }}
        </a>
      </p>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useCookie, useRouter } from 'nuxt/app'

const username = ref('')
const errorMessage = ref('')
const successMessage = ref('')
const successLink = ref('')
const passKeyCookie = useCookie('passKey')
const router = useRouter()

const submitForm = async () => {
  errorMessage.value = ''
  successMessage.value = ''
  successLink.value = ''

  try {
    const response = await useFetch('/api/generate-account', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: username.value }),
    })



    const data = response.data.value
    if (data) {
      if (data?.error) {
        errorMessage.value = data.error
      }
      else {
        passKeyCookie.value = data.passKey
        successMessage.value = 'Account generated successfully!'

        setTimeout(() => {
          router.push(`/user/`)
        }, 2000)
      }
    }
  }
  catch (error) {
    console.error('There was a problem with the fetch operation:', error)
    errorMessage.value = 'There was a problem with the fetch operation'
  }
}
</script>
