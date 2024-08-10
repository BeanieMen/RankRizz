<template>
  <div class="max-w-7xl mx-auto p-6 bg-background text-text h-screen flex items-center justify-center">
    <div
      class="w-full max-w-5xl p-6 rounded-lg shadow-lg my-auto flex flex-col md:grid md:grid-cols-2 md:gap-x-36 place-items-center">

      <!-- Image Carousel -->
      <div class="w-full md:w-auto flex justify-center mb-6 md:mb-0">
        <UCarousel :items="imageLocations" :ui="{
          item: 'basis-full',
          container: 'rounded-lg',
          indicators: {
            wrapper: 'relative bottom-0 mt-4'
          }
        }" indicators class="w-full md:w-[30rem] mx-auto">
          <template #default="{ item }">
            <img :src="item" class="w-full" draggable="false">
          </template>

          <template #indicator="{ onClick, page, active }">
            <UButton :label="String(page)" :variant="active ? 'solid' : 'outline'" size="2xs"
              class="rounded-full min-w-6 justify-center" @click="onClick(page)" />
          </template>
        </UCarousel>
      </div>

      <!-- User Information and Feedback -->
      <div class="flex flex-col space-y-6 w-full">
        <div class="text-center">
          <h1 class="text-2xl md:text-3xl font-bold mb-4">
            Username: <span class="text-accent">{{ randomUser }}</span>
          </h1>
        </div>

        <div class="flex flex-col items-center">
          <h2 class="text-lg md:text-xl font-semibold mb-2">Rate this user:</h2>
          <NuxtRating :read-only="false" :rating-size="24" :rating-value="rating" border-color="#db8403"
            active-color="#ffa41c" inactive-color="#111827" :rating-step="1" :rounded-corners="true" :border-width="5"
            @rating-selected="updateRating" class="bg-background" />
        </div>

        <div class="w-full">
          <h2 class="text-lg md:text-xl font-semibold mb-2 text-center">Leave a comment:</h2>
          <textarea v-model="comment" rows="4"
            class="w-full p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder="Write your comment here..."></textarea>
        </div>

        <div class="mt-4 flex flex-col items-center w-full">
          <button @click="submitFeedback" class="bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent-dark">
            Submit
          </button>
          <p v-if="statusMessage" :class="statusMessageClass" class="mt-5">{{ statusMessage }}</p>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const imageLocations = ref<string[]>([])
const randomUser = ref<string>('')
const randomUserId = ref<string>('')
const rating = ref<number>(0)
const comment = ref<string>('')
const statusMessage = ref<string | null>(null)
const statusMessageClass = ref<string>('')

const randomData = await useFetch(`/api/random`)
if (randomData.data.value) {
  imageLocations.value = randomData.data.value.imageLocations ?? []
  randomUser.value = randomData.data.value.username ?? ''
  randomUserId.value = randomData.data.value.userId ?? ''
}

function updateRating(value: number) {
  rating.value = value
}

async function submitFeedback() {
  const formData = new FormData()
  formData.append('userId', randomUserId.value)

  if (rating.value > 0) {
    formData.append('starRating', String(rating.value))

  }
  if (comment.value.trim()) {
    formData.append('comment', comment.value)
  }
  rating.value = 0
  comment.value = ''

  const response = await useFetch("/api/recieve-rating", {
    method: 'POST',
    body: formData,
  })

  if (response.data.value?.message === "Successfully uploaded ratings") {
    statusMessage.value = "Successfully rated!"
    statusMessageClass.value = "text-green-500"
  } else {
    statusMessage.value = "Error rating user."
    statusMessageClass.value = "text-red-500"
  }

}
</script>
