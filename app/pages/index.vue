<template>
  <div class="max-w-6xl mx-auto p-6 bg-background text-text">
    <div class="flex flex-col items-center">
      <!-- User Info -->
      <div class="mb-8 text-center">
        <h1 class="text-3xl font-bold mb-4">
          Username: <span class="text-accent">{{ randomUser }}</span>
        </h1>
      </div>

      <!-- Photo Carousel -->
      <div class="w-full max-w-6xl rounded-lg overflow-hidden bg-secondary border border-gray-700">
        <Carousel
          v-if="imageSrc.length > 0"
          :slides="imageSrc"
          class="relative"
        >
          <template #default="{ slide }">
            <div class="relative w-full h-0 pb-[56.25%]">
              <!-- Aspect ratio 16:9 -->
              <img
                :src="slide"
                alt="User Photo"
                class="absolute inset-0 w-full h-full object-contain"
              >
            </div>
          </template>
        </Carousel>
      </div>
    </div>

    <!-- Authentication Component -->
    <div class="mt-8">
      <Auth />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const imageSrc = ref<string[]>([])
const randomUser = ref<string | null>(null)

const randomData = await useFetch(`/api/random`)
if (randomData.data.value) {
  imageSrc.value = randomData.data.value.imageSrc ?? []
  randomUser.value = randomData.data.value.username ?? ''
}
</script>
