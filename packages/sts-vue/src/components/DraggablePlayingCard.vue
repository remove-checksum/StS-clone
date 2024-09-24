<script setup lang="ts">
import PlayingCard from './PlayingCard.vue'
import type { Card } from '@/model/card'
import { ref, onMounted } from 'vue'
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import { disableNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/disable-native-drag-preview'
import { preserveOffsetOnSource } from '@atlaskit/pragmatic-drag-and-drop/element/preserve-offset-on-source'
import { assert } from '@/model/assert'

type Point = { x: number; y: number }
const props = defineProps<{
	card: Card,
	dragData: { cardIndex: number }
}>()
const emit = defineEmits<{
	(e: 'cardPicked'): void
	(e: 'cardDropped'): void
	(e: 'cardMoved', value: Point): void
	(e: 'cardSelected', sizing: DOMRect): void
}>()

function cardSelected(e: MouseEvent) {
	const sizing = (e.currentTarget as HTMLDivElement).getBoundingClientRect()

	emit('cardSelected', sizing)
}

const CARD_HOVER_SCALE = 1

const cardRef = ref<InstanceType<typeof PlayingCard> | null>(null)

const isDragged = ref(false)
const dragCursorOffset = ref<Point>({ x: 0, y: 0 })

function getCardRect() {
	return cardRef.value?.cardRef?.getBoundingClientRect()
}

defineExpose({
	getCardRect
})


onMounted(() => {
	const card = cardRef.value?.cardRef
	assert(!!card)

	draggable({
		element: card,
		getInitialData: () => {
			return props.dragData
		},
		onGenerateDragPreview: ({ nativeSetDragImage }) => {
			disableNativeDragPreview({
				nativeSetDragImage
			})
		},
		// onDragStart: (args) => {
		// 	const offsetFn = preserveOffsetOnSource({
		// 		element: card,
		// 		input: args.location.initial.input
		// 	})

		// 	dragCursorOffset.value = offsetFn({ container: card })
		// 	// isDragged.value = true
		// 	// emit('cardPicked')
		// },
		// onDrag: (args) => {
		// 	const { input } = args.location.current

		// 	emit('cardMoved', {
		// 		x: input.clientX - dragCursorOffset.value.x / CARD_HOVER_SCALE,
		// 		y: input.clientY - dragCursorOffset.value.y / CARD_HOVER_SCALE
		// 	})
		// },
		// onDrop: () => {
		// 	isDragged.value = false
		// 	emit('cardDropped')
		// }
	})
})
</script>

<template>
	<PlayingCard
		ref="cardRef"
		:card="$props.card"
		:selected="isDragged"
		:class="[isDragged && 'w-0 opacity-0']"
		@click="cardSelected"
	>
	</PlayingCard>
</template>
