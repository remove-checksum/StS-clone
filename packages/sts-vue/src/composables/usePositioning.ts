import { ref, type MaybeRefOrGetter, toValue, computed } from 'vue'

export function usePositioning(initialPosition: MaybeRefOrGetter<{ x: number; y: number }>) {
	const position = ref({
		x: toValue(initialPosition).x,
		y: toValue(initialPosition).y
	})

	const style = computed(() => ({
		left: position.value.x + 'px',
		top: position.value.y + 'px'
	}))

	function reset() {
		position.value = toValue(initialPosition)
	}

	return { style, position, reset }
}
