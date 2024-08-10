<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <nav class="bg-gray-800 text-white p-4 px-10 flex justify-between items-center">
    <div class="flex items-center">
      <span class="font-semibold text-xl">RankRizz</span>
    </div>
    <ul class="flex space-x-4">
      <li>
        <a
          href="/"
          class="hover:underline"
        >Home</a>
      </li>
      <li>
        <a
          href="/feed"
          class="hover:underline"
        >Feed</a>
      </li>
      <li>
        <a
          href="/user"
          class="hover:underline"
        >User</a>
      </li>
      <li>
        <a
          href="/faq"
          class="hover:underline"
        >FAQ</a>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
a {
    font-weight: 900;
}
</style>
