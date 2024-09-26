<script setup lang="ts">
import PlayingCard from './PlayingCard.vue'
import type { Card } from '@/model/card'
import { ref, onMounted } from 'vue'
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import { disableNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/disable-native-drag-preview'
import { assert } from '@/model/assert'
import { getCardData } from '@/helpers/isCardData'
import type { DeckEntry } from '@/model/deck'

type Point = { x: number; y: number }
const props = defineProps<{
	card: Card
	deckKey: DeckEntry[0]
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

const cardRef = ref<InstanceType<typeof PlayingCard> | null>(null)
const isDragged = ref(false)

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
		getInitialData: ({ input }) =>
			getCardData({ deckKey: props.deckKey, previousInput: input }),
		onGenerateDragPreview: ({ nativeSetDragImage }) => {
			disableNativeDragPreview({
				nativeSetDragImage
			})
		}
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
