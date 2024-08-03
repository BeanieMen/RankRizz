<template>
  <div class="flex flex-col items-center justify-center bg-gray-900 h-[calc(100vh-4rem)] py-10 px-4">
    <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
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
            >Upload Profile Picture:</label>
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import type { User } from '~~/server/utils/database'

const route = useRoute()

const user = ref<User | null>(null)

const loading = ref(true)
const uploadError = ref<string | null>(null)
const uploadSuccess = ref(false)

onMounted(async () => {
  try {
    const response = await fetch(`/api/user/${route.params.id}`)
    const userData = await response.json()
    user.value = userData.user
  }
  catch (error) {
    console.error('Error fetching data:', error)
  }
  finally {
    loading.value = false
  }
})
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
