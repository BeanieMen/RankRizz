<template>
    <section class="bg-dark-blue py-10 text-center">
        <div class="max-w-3xl mx-auto">
            <button @click="generateAccount" class="btn bg-purple-600 hover:bg-purple-700">Generate Account</button>
            <div v-if="accountLink" class="mt-4">
                <p>Your account link:</p>
                <a :href="accountLink" class="text-blue-500 underline">{{ accountLink }}</a>
            </div>
        </div>
    </section>
</template>

<script>
export default {
    data() {
        return {
            accountLink: null
        };
    },
    methods: {
        async generateAccount() {
            try {
                const response = await this.$axios.$post('/api/generate-account'); // Adjust this endpoint to your actual backend API
                this.accountLink = response.link; // Assuming the API returns a JSON object with the link
            } catch (error) {
                // console.error('Error generating account link:', error);
            }
        }
    }
};
</script>

<style scoped>
.btn {
    @apply text-white py-2 px-4 m-2 rounded-lg cursor-pointer;
}

.bg-dark-blue {
    @apply bg-gray-900;
}
</style>