<script setup lang="ts">
import { useMotion } from '@vueuse/motion'
import { ref, watch } from 'vue'

const props = defineProps<{ stat: number | string }>()
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

watch(() => props.stat, () => {
	apply('jump')
})

</script>

<template>
	<div
		ref="wrapperRef"
		class="grid place-items-center *:col-start-1 *:row-start-1 *:col-end-1 *:row-end-1"
	>
		<slot></slot>
		<span class="tabular-nums">{{ stat.toString() }}</span>
	</div>
</template>
