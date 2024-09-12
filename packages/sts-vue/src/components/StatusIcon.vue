<script setup lang="ts">
import { useMotion } from '@vueuse/motion'
import { ref } from 'vue'

defineProps<{ stat: number }>()
const wrapperRef = ref<HTMLElement | null>(null)

// TODO: stagger animations in order
const { apply } = useMotion(wrapperRef, {
	initial: {
		opacity: 1,
		translateY: 0
	},
	jump: {
		translateY: -5,
		transition: {
			duration: 100,
			ease: 'backIn',
			onComplete: () => apply('initial')
		}
	},
	destroyed: {
		translateX: 12,
		backgroundColor: 'red'
	}
})
</script>

<template>
	<div class="grid place-items-center *:col-start-1 *:row-start-1 *:col-end-1 *:row-end-1" ref="wrapperRef">
		<slot></slot>
		<span class="tabular-nums">{{ stat }}</span>
	</div>
</template>
