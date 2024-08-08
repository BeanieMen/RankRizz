<template>
  <div class="flex flex-row items-center justify-center bg-background h-[calc(100vh-4rem)] py-10 px-4">
    <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
      <div class="grid grid-cols-2 gap-x-10">
        <!-- Info Section -->
        <div class="flex flex-col">
          <div class="text-center mb-6">
            <h1 class="text-3xl font-semibold text-text mb-2">
              User Profile
            </h1>
            <p class="text-text">
              Manage your profile information and upload photos.
            </p>
          </div>

          <div class="space-y-6">
            <!-- Photo Carousel -->
            <Carousel v-if="imageLocation !== ''" :slides="imageLocation.split(',')">
              <template #default="{ slide }">
                <div class="relative w-full h-0 pb-[56.25%]">
                  <img :src="slide" alt="User Photo" class="absolute inset-0 w-full h-full object-contain rounded-lg shadow-md">
                </div>
              </template>
            </Carousel>
            <!-- File Upload -->
            <div v-if="imageLocation.split(',').length < 3" class="text-center mt-6">
              <label for="file-upload" class="block text-lg font-medium text-text mb-2">
                Upload Photos:
              </label>
              <input id="file-upload" type="file"
                class="block w-full text-text border border-gray-300 rounded-lg p-2"
                accept=".jpeg, .jpg, .png, .webp" @change="handleFileUpload">
            </div>

            <div class="bg-gray-100 p-4 rounded-lg shadow-inner">
              <p class="text-text">
                <strong>ID:</strong> {{ user?.id }}
              </p>
              <p class="text-text">
                <strong>Username:</strong> {{ user?.username }}
              </p>
              <p class="text-text">
                <strong>Pass Key:</strong> {{ user?.pass_key }}
              </p>
            </div>

            <!-- Star Rating Section -->
            <div class="flex flex-col items-center mt-4">
              <h2 class="text-lg font-semibold text-text mb-2">
                RizzRates ({{ user && user.stars ? user.stars.length : 0 }} reviews)
              </h2>
              <NuxtRating :read-only="true" :rating-size="30" :rating-value="rating" />
              <h3 class="text-md text-text mb-2">
                {{ rating.toFixed(2) }} out of 5 stars
              </h3>
            </div>

            <div class="mt-4">
              <div v-if="uploadError" class="text-center text-red-500">
                Error: {{ uploadError }}
              </div>
              <div v-else-if="uploadSuccess" class="text-center text-green-500">
                Images uploaded successfully!
              </div>
            </div>
          </div>
        </div>

        <!-- Comment Section -->
        <div class="bg-gray-100 p-4 rounded-lg shadow-inner">
          <h2 class="text-xl text-center font-bold text-text mb-4">
            RizzViews
          </h2>
          <div class="space-y-4">
            <div class="p-4 bg-white rounded-lg shadow">
              <p class="text-text">
                <strong>Samarth:</strong> Bheri handsum munda ahhhhh
              </p>
            </div>
            <div class="p-4 bg-white rounded-lg shadow">
              <p class="text-text">
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
import type { User } from '~~/server/db/database'

const passKey = useCookie('passKey').value

const user = ref<User | null>(null)
const rating = ref<number>(0)
const uploadError = ref<string | null>(null)
const uploadSuccess = ref(false)

const userData = useFetch(`/api/user/${passKey}`)
if (userData.data.value) {
  user.value = userData.data.value.user
  rating.value = userData.data.value.rating ?? 0
}
const imageLocation = user.value?.image_location ?? ''

const handleFileUpload = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file && user.value?.id) {
    // Validate file size and type
    if (file.size > 200 * 1024 * 1024) {
      uploadError.value = 'File size exceeds 200MB'
      return
    }

    const fileType = file.type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(fileType)) {
      uploadError.value = 'Invalid file type. Only JPEG, PNG, and WEBP images are allowed.'
      return
    }

    const formData = new FormData()
    formData.append('image', file)
    formData.append('userId', user.value?.id)

    try {
      const response = await useFetch(`/api/upload`, {
        method: 'POST',
        body: formData,
      })

      if (response.data.value?.message == "File uploaded successfully" ) {
        uploadSuccess.value = true
        setTimeout(() => {
          window.location.reload()
        }, 500)
      }
      else {
        uploadError.value = response.data.value?.message ?? "Unknown error"
      }
    }
    catch (error) {
      uploadError.value = 'Failed to upload images'
      console.error('Error uploading images:', error)
    }
  }
}
</script>
