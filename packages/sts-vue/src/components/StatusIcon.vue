<script setup lang="ts">
import { useMotion } from '@vueuse/motion'
import { ref, watch } from 'vue'

const props = defineProps<{ stat: number }>()
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

watch(
	() => props.stat,
	(n, p) => {
		apply(props.stat > 0 ? 'jump' : 'destroyed')
	}
)
</script>

<template>
	<span class="relative grid place-items-center" ref="wrapperRef">
		<slot></slot>
		<span class="absolute tabular-nums">{{ stat }}</span>
	</span>
</template>
