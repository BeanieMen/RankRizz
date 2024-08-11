<template>
  <div class="max-w-md mx-auto mt-8 p-6 bg-white  rounded-lg">
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
          class="w-full text-black px-3 py-2 border bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
      </div>

      <div class="flex justify-center">
        <button
          type="submit"
          class="px-5 bg-blue-500 text-white font-bold py-2 rounded-lg hover:bg-blue-600 transition duration-300"
        >
          Generate Account
        </button>
      </div>

      <p
        v-if="errorMessage"
        class="mt-4 text-red-500 font-bold"
      >
        {{ errorMessage }}
      </p>

      <p
        v-if="successMessage"
        class="mt-4 text-green-500 font-bold"
      >
        <a
          :href="successLink"
          class="text-green-500 hover:underline"
        >
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
    const response = await $fetch('/api/generate-account', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: username.value }),
    })

    const data = response as {error: string | null, passKey: string | undefined, username: string | undefined}
    if (data) {
      if (response.error) {
        errorMessage.value = data.error!
      }
      else {
        passKeyCookie.value = data.passKey
        successMessage.value = 'Account generated successfully. Keep the link given safe as it is used to login to your account'
        successLink.value = `/passkey-login?pass=${passKeyCookie.value}`
      }
    }
  }
  catch (error) {
    console.error('There was a problem with the fetch operation:', error)
    errorMessage.value = 'There was a problem with the fetch operation'
  }
}
</script>
