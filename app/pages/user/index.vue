<template>
  <div class="flex flex-row items-center justify-center bg-background h-[calc(100vh-4rem)] py-10 px-4">
    <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl text-black">
      <div class="grid grid-cols-2 gap-x-10">
        <!-- Info Section -->
        <div class="flex flex-col">
          <div class="text-center mb-6">
            <h1 class="text-3xl font-semibold  mb-2">
              User Profile
            </h1>
            <p class="">
              Manage your profile information and upload photos.
            </p>
          </div>

          <div class="space-y-6">
            <!-- Photo Carousel -->
            <UCarousel :items="imageLocations" :ui="{
              item: 'basis-full',
              container: 'rounded-lg',
              indicators: {
                wrapper: 'relative bottom-0 mt-4'
              }
            }" indicators class="w-64 mx-auto">
              <template #default="{ item }">
                <img :src="item" class="w-full" draggable="false">
              </template>

              <template #indicator="{ onClick, page, active }">
                <UButton :label="String(page)" :variant="active ? 'solid' : 'outline'" size="2xs"
                  class="rounded-full min-w-6 justify-center" @click="onClick(page)" />
              </template>
            </UCarousel>
            <!-- File Upload -->
            <div v-if="imageLocations.length < 3" class="text-center mt-6">
              <label for="file-upload" class="block text-lg font-medium  mb-2">
                Upload Photos:
              </label>
              <input id="file-upload" type="file" class="block w-full  border border-gray-300 rounded-lg p-2"
                accept=".jpeg, .jpg, .png, .webp" @change="handleFileUpload">
            </div>

            <div class="bg-gray-100 p-4 rounded-lg shadow-inner">
              <p class="">
                <strong>ID:</strong> {{ user?.id }}
              </p>
              <p class="">
                <strong>Username:</strong> {{ user?.username }}
              </p>
              <p class="">
                <strong>Pass Key:</strong> {{ user?.pass_key }}
              </p>
            </div>

            <!-- Star Rating Section -->
            <div class="flex flex-col items-center mt-4">
              <h2 class="text-lg font-semibold mb-2">
                RizzRates ({{ starCount }} reviews)
              </h2>
              <NuxtRating :read-only="true" :rating-size="30" :rating-value="rating" border-color="#db8403"
                active-color="#ffa41c" inactive-color="#fff" :rating-step="0.5" :rounded-corners="true"
                :border-width="5" />
              <h3 class="text-md  mb-2">
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
          <h2 class="text-xl text-center font-bold  mb-4">
            RizzViews
          </h2>
          <div class="space-y-4">
            <div class="p-4 bg-white rounded-lg shadow">
              <p class="">
                <strong>Samarth:</strong> Bheri handsum munda ahhhhh
              </p>
            </div>
            <div class="p-4 bg-white rounded-lg shadow">
              <p class="">
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
const imageLocations = ref<string[]>([])
const uploadError = ref<string | null>(null)
const uploadSuccess = ref(false)
let starCount = 0
const userData = await useFetch(`/api/user/${passKey}`)
if (userData.data.value) {
  user.value = userData.data.value.user
  rating.value = userData.data.value.rating ?? 0
  imageLocations.value = userData.data.value.imageLocations ?? []
  starCount = userData.data.value.starCount ?? 0
}

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
      const response = await useFetch("/api/upload", {
        method: 'POST',
        body: formData,
      })

      if (response.data.value?.message == 'File uploaded successfully') {
        uploadSuccess.value = true
        setTimeout(() => {
          window.location.reload()
        }, 500)
      }
      else {
        uploadError.value = response.data.value?.message ?? "Unknown Error"
      }
    }
    catch (error) {
      uploadError.value = 'Failed to upload images'
      console.error('Error uploading images:', error)
    }
  }
}
</script>