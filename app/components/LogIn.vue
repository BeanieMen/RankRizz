<template>
  <div class="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
    <form @submit.prevent="login">
      <div class="mb-4">
        <label
          for="passKey"
          class="block text-gray-700 font-bold mb-2"
        >PassKey:</label>
        <input
          id="passKey"
          v-model="passKey"
          type="text"
          required
          class="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
      </div>
      <button
        type="submit"
        class="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
      >
        Log In
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
import { useCookie, useRouter } from 'nuxt/app'

const passKey = ref('')
const errorMessage = ref('')
const passKeyCookie = useCookie('passKey')
const router = useRouter()

const login = async () => {
  errorMessage.value = ''

  if (!passKey.value) {
    errorMessage.value = 'Please enter a passKey'
    return
  }

  try {
    const userData = await useFetch(`/api/user/${passKey.value}`)

    if (userData.data.value?.user) {
      errorMessage.value = 'Invalid passKey provided'
      return
    }
    passKeyCookie.value = passKey.value
    router.push(`/user/`)
  }
  catch (error) {
    console.error('There was a problem with the fetch operation:', error)
    errorMessage.value = 'There was a problem with the fetch operation'
  }
}
</script>
