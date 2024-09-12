<template>
	<button
		class="inline-block text-sm font-medium bg-white border border-gray-900 text-gray-600 focus:outline-none focus:ring active:text-gray-500 hover:bg-gray-900 hover:text-white px-4 py-1 min-w-20 text-center"
		v-bind="$attrs"
	>
		<slot></slot>
	</button>
</template>
<script setup lang="ts">
defineOptions({ inheritAttrs: false })
</script>
