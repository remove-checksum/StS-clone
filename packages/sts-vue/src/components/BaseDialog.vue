<script setup lang="ts">
const open = defineModel({ default: false })
</script>

<template>
	<div
		class="fixed left-0 top-0 z-50 grid h-full w-full place-items-center bg-gray-700 bg-opacity-80"
		v-if="open"
	>
		<slot></slot>
		<button @click="open = false">Close</button>
	</div>
</template>
