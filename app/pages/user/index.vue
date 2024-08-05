<template>
  <div class="flex flex-row items-center justify-center bg-gray-900 h-[calc(100vh-4rem)] py-10 px-4">
    <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
      <div class="grid grid-cols-2 gap-x-10">
        <!-- info section -->
        <div class="flex flex-col">
          <div class="text-center mb-6">
            <h1 class="text-2xl font-semibold text-gray-800 mb-2">
              User Profile
            </h1>
            <p class="text-gray-600">
              Manage your profile information and upload a profile picture.
            </p>
          </div>

          <div class="space-y-6">
            <div class="flex items-center justify-center">
              <img
                v-if="user?.image_location"
                :src="user?.image_location"
                alt="Profile Picture"
                class="w-32 h-32 object-cover rounded-full border-4 border-gray-200 shadow-md"
              >
              <div
                v-else
                class="text-center"
              >
                <label
                  for="file-upload"
                  class="block text-lg font-medium text-gray-700 mb-2"
                >Upload
                  Profile
                  Picture:</label>
                <input
                  id="file-upload"
                  type="file"
                  class="block w-full text-gray-700 border border-gray-300 rounded-lg p-2"
                  @change="handleFileUpload"
                >
              </div>
            </div>

            <div class="bg-gray-100 p-4 rounded-lg shadow-inner">
              <p class="text-gray-700">
                <strong>ID:</strong> {{ user?.id }}
              </p>
              <p class="text-gray-700">
                <strong>Username:</strong> {{ user?.username }}
              </p>
              <p class="text-gray-700">
                <strong>Pass Key:</strong> {{ user?.pass_key }}
              </p>
            </div>

            <!-- Star Rating Section -->
            <div class="flex flex-col items-center mt-4">
              <h2 class="text-lg font-semibold text-gray-800 mb-2">
                RizzRates ({{ user && user.stars ? user.stars.length : 0 }} reviews )
              </h2>
              <NuxtRating
                :read-only="true"
                :rating-size="30"
                :rating-value="rating"
              />
              <h3 class="text-md text-gray-800 mb-2">
                {{ rating.toFixed(2) }} out of 5 stars
              </h3>
            </div>

            <div class="mt-4">
              <div
                v-if="loading"
                class="text-center text-gray-500"
              >
                Loading...
              </div>
              <div
                v-else-if="uploadError"
                class="text-center text-red-500"
              >
                Error: {{ uploadError }}
              </div>
              <div
                v-else-if="uploadSuccess"
                class="text-center text-green-500"
              >
                Image uploaded successfully!
              </div>
            </div>
          </div>
        </div>
        <!-- comment section  -->
        <div class="bg-gray-100 p-4 rounded-lg shadow-inner">
          <h2 class="text-xl text-center  font-bold text-gray-800 mb-4">
            RizzViews
          </h2>
          <div class="space-y-4">
            <div class="p-4 bg-white rounded-lg shadow">
              <p class="text-gray-700">
                <strong>Samarth:</strong> Bheri handsum munda ahhhhh
              </p>
            </div>
            <div class="p-4 bg-white rounded-lg shadow">
              <p class="text-gray-700">
                <strong>Harry:</strong> Jojo ki mkc
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useCookie } from '#app'
import type { User } from '~~/server/utils/database'

const passKey = useCookie('passKey').value

const user = ref<User | null>(null)
const rating = ref<number>(0)
const loading = ref(true)
const uploadError = ref<string | null>(null)
const uploadSuccess = ref(false)

const userData = useFetch(`/api/user/${passKey}`)
if (userData.data.value) {
  user.value = userData.data.value.user
  rating.value = userData.data.value.rating ?? 0
}

const handleFileUpload = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file && user.value?.id) {
    const formData = new FormData()
    formData.append('image', file)
    formData.append('userId', user.value?.id)

    try {
      const response = await fetch(`/api/upload`, {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        uploadSuccess.value = true
        setTimeout(() => {
          window.location.reload()
        }, 500)
      }
      else {
        const errorData = await response.json()
        uploadError.value = errorData.message || 'Unknown error'
      }
    }
    catch (error) {
      uploadError.value = 'Failed to upload image'
      console.error('Error uploading image:', error)
    }
  }
}
</script>
