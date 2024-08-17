<template>
  <div class="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg">
    <form @submit.prevent="submitForm">
      <div class="mb-4">
        <label for="username" class="block text-gray-700 font-bold mb-2">Username:</label>
        <input id="username" v-model="username" type="text" required
          class="w-full text-black px-3 py-2 border bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
      </div>

      <div class="flex justify-center">
        <button type="submit"
          class="px-5 bg-blue-500 text-white font-bold py-2 rounded-lg hover:bg-blue-600 transition duration-300">
          Generate Account
        </button>
      </div>

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
import { ref } from 'vue';

interface ApiResponse {
  error?: string;
  data?: {
    passKey: string;
    username: string;
  };
}

const username = ref<string>('');
const errorMessage = ref<string>('');
const successMessage = ref<string>('');
const successLink = ref<string>('');

const submitForm = async (): Promise<void> => {
  errorMessage.value = '';
  successMessage.value = '';
  successLink.value = '';

  try {
    const response = await $fetch<ApiResponse>('/api/generate-account', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: username.value }),
    });

    if (response.error) {
      errorMessage.value = response.error;
    } else if (response.data) {
      successMessage.value = 'Account generated successfully. Keep the link given safe as it is used to login to your account';
      successLink.value = `/passkey-login?pass=${response.data.passKey}`;
    }
  } catch (error: any) {
    if (error.response && error.response._data) {
      errorMessage.value = error.response._data.error || 'An unknown error occurred';
    } else {
      errorMessage.value = 'Failed to connect to the server. Please try again later.';
    }
  }
};
</script>
