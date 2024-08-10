<template>
  <nav
    class="bg-gray-800 text-white p-4 px-6 md:px-10 flex justify-between items-center fixed top-0 left-0 w-full z-50">
    <div class="flex items-center">
      <span class="font-semibold text-xl">RankRizz</span>
    </div>

    <!-- Desktop Menu -->
    <ul class="hidden md:flex space-x-4">
      <li>
        <a href="/" class="hover:underline">Home</a>
      </li>
      <li>
        <a href="/feed" class="hover:underline">Feed</a>
      </li>
      <li>
        <a href="/user" class="hover:underline">User</a>
      </li>
      <li>
        <a href="/faq" class="hover:underline">FAQ</a>
      </li>
    </ul>

    <!-- Mobile Hamburger Menu -->
    <div class="relative md:hidden">
      <button @click="toggleNav" class="text-white">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path>
        </svg>
      </button>
      <UVerticalNavigation v-if="isNavVisible" :links="links"
        class="absolute top-full right-0 mt-2 px-5 py-2 shadow-2xl bg-gray-800 rounded-lg" style="color: black;" />
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'


const links = ref([
  {
    label: 'Home',
    to: '/',
    click
  },
  {
    label: 'Feed',
    to: `/feed`,
    click
  },
  {
    label: 'User',
    to: '/user',
    click

  },
  {
    label: 'FAQ',
    to: '/faq',
    click
  }
])

const isNavVisible = ref(false)

function toggleNav() {
  isNavVisible.value = !isNavVisible.value
}

function click() {
  isNavVisible.value = false
}
</script>

<style scoped>
a {
  font-weight: 900;
}
</style>
