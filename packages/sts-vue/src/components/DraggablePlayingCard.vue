<script setup lang="ts">
import PlayingCard from './PlayingCard.vue'
import type { Card } from '@/model/card'
import { ref, onMounted } from 'vue'
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import { disableNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/disable-native-drag-preview'
import { preserveOffsetOnSource } from '@atlaskit/pragmatic-drag-and-drop/element/preserve-offset-on-source'
import { useMotion } from '@vueuse/motion'

type Point = { x: number; y: number }
const props = defineProps<{
	card: Card
	index: number
}>()
const emit = defineEmits<{
	(e: 'cardPicked', index: number): void
	(e: 'cardDropped'): void
	(e: 'cardMoved', value: Point): void
}>()

const CARD_HOVER_SCALE = 1

const cardRef = ref<InstanceType<typeof PlayingCard> | null>(null)
const cardWrapper = ref<HTMLDivElement | null>(null)

const isDragged = ref(false)
const isOverHand = ref(true)
const cardPosition = ref<{ x: number; y: number } | null>(null)
const dragCursorOffset = ref<Point>({ x: 0, y: 0 })
const dragPreviewAboveCard = ref(false)
const hoverCursorOffset = ref<Point>({ x: 0, y: 0 })

const { apply } = useMotion(cardWrapper, {
	initial: {
		translateY: 0
	},
	hovered: {
		translateY: -10
	}
})

onMounted(() => {
	let cardEl = cardRef.value?.cardRef
	if (!cardEl) {
		console.error('no element')
		return
	}
	draggable({
		element: cardEl,
		getInitialData: () => {
			return { cardIndex: props.index }
		},
		onGenerateDragPreview: ({ nativeSetDragImage }) => {
			disableNativeDragPreview({
				nativeSetDragImage
			})
		},
		onDragStart: (args) => {
			const offsetFn = preserveOffsetOnSource({
				element: cardEl,
				input: args.location.initial.input
			})

			dragCursorOffset.value = offsetFn({ container: cardEl })
			isDragged.value = true
			emit('cardPicked', props.index)
		},
		onDrag: (args) => {
			const {
				input,
				dropTargets: [maybeCardHand]
			} = args.location.current

			cardPosition.value = {
				x: input.clientX - dragCursorOffset.value.x / CARD_HOVER_SCALE,
				y: input.clientY - dragCursorOffset.value.y / CARD_HOVER_SCALE
			}
			emit('cardMoved', cardPosition.value)
		},
		onDrop: () => {
			isOverHand.value = true
			isDragged.value = false
			emit('cardDropped')
		}
	})
})
</script>

<template>
	<div class="relative min-w-12 lg:min-w-36" ref="cardWrapper">
		<PlayingCard
			:card="$props.card"
			:index="$props.index"
			:selected="isDragged"
			ref="cardRef"
			:class="['absolute', isDragged && 'w-0 opacity-0']"
		>
		</PlayingCard>
	</div>
</template>

<style lang="css" module>
/* .draggableTransition {
	transition:
		flex-basis 0.1s ease-in,
		z-index 0.1s 0.4s ease-in,
		transform 0.1s ease-in;
}

.draggableTransition:hover {
	transform: translateY(-1.5rem);
	transition: z-index 0ms 0ms;
	z-index: 10;
} */
</style>
