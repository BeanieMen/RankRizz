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
      <UCarousel :items="imageLocations" :ui="{
        item: 'basis-full',
        container: 'rounded-lg',
        indicators: {
          wrapper: 'relative bottom-0 mt-4'
        }
      }" indicators class="w-[30rem] mx-auto">
        <template #default="{ item }">
          <img :src="item" class="w-full" draggable="false">
        </template>

        <template #indicator="{ onClick, page, active }">
          <UButton :label="String(page)" :variant="active ? 'solid' : 'outline'" size="2xs"
            class="rounded-full min-w-6 justify-center" @click="onClick(page)" />
        </template>
      </UCarousel>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const imageLocations = ref<string[]>([])
const randomUser = ref<string | null>(null)

const randomData = await useFetch(`/api/random`)
if (randomData.data.value) {
  imageLocations.value = randomData.data.value.imageLocations ?? []
  randomUser.value = randomData.data.value.username ?? ''
}
</script>
