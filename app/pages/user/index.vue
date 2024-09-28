<template>
  <div class="flex flex-col items-center bg-background h-screen py-10 px-5">
    <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl text-black flex flex-col items-center my-auto">
      <div class="flex flex-col md:grid md:grid-cols-2 md:gap-x-10 w-full">
        <!-- Profile Section -->
        <div class="flex flex-col mb-6 md:mb-0">
          <div class="text-center mb-6">
            <h1 class="text-2xl md:text-3xl font-semibold mb-2">
              User Profile
            </h1>
            <p>Manage your profile information and upload photos.</p>
          </div>

          <div class="space-y-6">
            <UCarousel
              ref="carousel"
              :items="images"
              :ui="{
                item: 'basis-full',
                container: 'rounded-lg',
                indicators: {
                  wrapper: 'relative bottom-0 mt-4',
                },
              }"
              indicators
              class="w-full md:w-64 mx-auto"
            >
              <template #default="{ item }">
                <img
                  :src="item"
                  class="w-full"
                  draggable="false"
                >
              </template>

              <template #indicator="{ onClick, page, active }">
                <UButton
                  :label="String(page)"
                  :variant="active ? 'solid' : 'outline'"
                  size="2xs"
                  class="rounded-full min-w-6 justify-center"
                  @click="pageRef = page; onClick(page)"
                />
              </template>
            </UCarousel>

            <!-- File Upload Section -->
            <div
              v-if="imageIds.length < 3"
              class="text-center mt-6"
            >
              <label
                for="file-upload"
                class="block text-lg font-medium mb-2"
              >
                Upload Photos:
              </label>
              <input
                id="file-upload"
                type="file"
                class="block w-full border border-gray-300 rounded-lg p-2"
                accept=".jpeg, .jpg, .png, .webp"
                @change="handleFileUpload"
              >
            </div>

            <!-- User Information -->
            <div class="bg-gray-100 p-4 rounded-lg shadow-inner">
              <p><strong>ID:</strong> {{ user?.id }}</p>
              <p><strong>Username:</strong> {{ user?.username }}</p>
            </div>

            <!-- Star Rating Section -->
            <div class="flex flex-col items-center mt-4">
              <h2 class="text-lg font-semibold mb-2">
                RizzRates ({{ starRatingTotal }} reviews)
              </h2>
              <NuxtRating
                :read-only="true"
                :rating-size="24"
                :rating-value="starRatingAverage"
                border-color="#db8403"
                active-color="#ffa41c"
                inactive-color="#fff"
                :rating-step="0.5"
                :rounded-corners="true"
                :rating-level="10"
                :rating-count="10"
                :border-width="5"
              />
              <h3 class="text-md mb-2">
                {{ starRatingAverage.toFixed(2) }} out of 10 stars
              </h3>
            </div>

            <!-- Upload Status -->
            <div class="mt-4">
              <div
                v-if="uploadError"
                class="text-center text-red-500"
              >
                Error: {{ uploadError }}
              </div>
              <div
                v-else-if="uploadSuccess"
                class="text-center text-green-500"
              >
                Images uploaded successfully!
              </div>
            </div>
          </div>
        </div>

        <!-- Comment Section -->
        <div class="bg-gray-100 p-4 rounded-lg shadow-inner w-full my-auto h-[90vh] max-h-[40rem] overflow-y-auto">
          <h2 class="text-xl text-center font-bold mb-4">
            RizzViews
          </h2>
          <div class="space-y-4">
            <div
              v-for="(comment, index) in comments"
              :key="index"
              class="p-4 bg-white rounded-lg shadow"
            >
              <p>{{ comment }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import type { User } from '~~/server/db/database'

// Define the type for API responses
type UserApiResponse =
  | { error: string, data?: undefined }
  | {
    error: null
    data: {
      user: User
      starRatingAverages: number[]
      imageIds: string[]
      starRatingTotals: number[]
      comments: string[][]
    }
  }

const pageRef = ref(1)
const user = ref<User | null>(null)
const starRatingAverage = ref<number>(0)
const imageIds = ref<string[]>([])
const comments = ref<string[]>([])
const uploadError = ref<string | null>(null)
const uploadSuccess = ref(false)
const images: string[] = []
let starRatingTotal = 0
let response: UserApiResponse

const fetchPassKey = async (): Promise<string | null> => {
  try {
    const response = await $fetch(`/api/pass-key/get`, {
      credentials: 'include',
    }) as { passKey: string }
    return response.passKey
  }
  catch (error: any) {
    console.error('Failed to fetch passKey:', error)
    return null
  }
}

const carousel = ref()

onMounted(async () => {
  const passKey = await fetchPassKey()
  response = await $fetch(`/api/user/${passKey}`) as UserApiResponse

  if (response.error === null && response.data) {
    user.value = response.data.user
    starRatingAverage.value = response.data.starRatingAverages[pageRef.value - 1] ?? 0
    imageIds.value = response.data.imageIds ?? []
    starRatingTotal = response.data.starRatingTotals[pageRef.value - 1] ?? 0
    comments.value = response.data.comments[pageRef.value - 1] ?? []
    imageIds.value.forEach((v) => {
      images.push(`/user-photos/${user.value?.id}/id_${v}.webp`)
    })
  }
  carousel.value?.select(1)
})

watch(pageRef, (newPage) => {
  if (response.error === null && response.data) {
    starRatingAverage.value = response.data.starRatingAverages[newPage - 1] ?? 0
    starRatingTotal = response.data.starRatingTotals[newPage - 1] ?? 0
    comments.value = response.data.comments[newPage - 1] ?? []
  }
})

const handleFileUpload = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file && user.value?.id) {
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
      const response = await $fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if ('message' in response) {
        uploadSuccess.value = true
        setTimeout(() => {
          window.location.reload()
        }, 500)
      }
    }
    catch (error: any) {
      if (error.response && error.response._data) {
        uploadError.value = error.response._data.error || 'An unknown error occurred'
      }
      else {
        uploadError.value = 'Failed to connect to the server. Please try again later.'
      }
    }
  }
}
</script>
