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

	function setPosition(point: { x: number; y: number }) {
		position.value = point
	}

	function resetPosition() {
		position.value = toValue(initialPosition)
	}

	return { position, setPosition, style, resetPosition } as const
}
