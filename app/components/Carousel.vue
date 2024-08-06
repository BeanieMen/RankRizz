<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="relative w-full overflow-hidden">
    <div
      class="flex transition-transform duration-500 ease-in-out"
      :style="{ transform: `translateX(-${currentSlide * 100}%)` }"
    >
      <div
        v-for="(slide, index) in slides"
        :key="index"
        class="w-full flex-shrink-0"
      >
        <slot :slide="slide" />
      </div>
    </div>
    <button
      class="absolute top-1/2 left-0 transform -translate-y-1/2 bg-black bg-opacity-50 text-white text-2xl p-2"
      @click="prevSlide"
    >
      ‹
    </button>
    <button
      class="absolute top-1/2 right-0 transform -translate-y-1/2 bg-black bg-opacity-50 text-white text-2xl p-2"
      @click="nextSlide"
    >
      ›
    </button>
    <div class="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
      <span
        v-for="(slide, index) in slides"
        :key="index"
        :class="[
          'inline-block w-3 h-3 rounded-full cursor-pointer',
          index === currentSlide ? 'bg-gray-800' : 'bg-gray-400',
        ]"
        @click="goToSlide(index)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
  slides: {
    type: Array as () => string[],
    required: true,
  },
})

const currentSlide = ref(0)

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % props.slides.length
}

const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + props.slides.length) % props.slides.length
}

const goToSlide = (index: number) => {
  currentSlide.value = index
}
</script>
