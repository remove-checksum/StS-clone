<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import PlayingCard from './PlayingCard.vue'
import DraggablePlayingCard from './DraggablePlayingCard.vue'
import { useRoundStore } from '@/stores/round'
import PileOverviewPanel from './PileOverviewPanel.vue'
import DndOverlayTeleport from './DndOverlayTeleport.vue'
import { usePositioning } from '@/composables/usePositioning'
import { storeToRefs } from 'pinia'

const roundStore = useRoundStore()
const { selectedHandCard, selectedHandIndex } = storeToRefs(roundStore)
const { selectCardInHand } = roundStore

const isCardDragged = ref(false)
const { position, style, resetPosition } = usePositioning({ x: -1, y: -1 })

function selectCard(index: number, sizing: DOMRect) {
	selectCardInHand(index)
	position.value = { x: sizing.left, y: sizing.top }
}

function unselectCard() {
	selectCardInHand(-1)
	resetPosition()
}

function cardPicked(index: number) {
	selectCardInHand(index)
}

function cardMoved(nextPosition: { x: number; y: number }) {
	isCardDragged.value = true
	position.value = nextPosition
}

function cardDropped() {
	isCardDragged.value = false
	selectCardInHand(-1)
	resetPosition()
}

const cardDropTarget = ref<HTMLDivElement | null>(null)
const isDraggedOver = ref(false)

onMounted(() => {
	const dropTarget = cardDropTarget.value!

	dropTargetForElements({
		element: dropTarget,
		getData: () => {
			return { name: 'cardHand' }
		},
		onDragEnter: () => {
			isDraggedOver.value = true
		},
		onDragLeave: () => (isDraggedOver.value = false),
		onDrop: () => {
			isDraggedOver.value = false
		}
	})
})
</script>

<template>
	<div class="grid grid-cols-12 min-h-24 justify-between lg:min-h-56">
		<PileOverviewPanel
			kind="draw"
			class="col-span-2"
		>Draw Pile</PileOverviewPanel>
		<div
			ref="cardDropTarget"
			:class="[
				'col-span-8 flex',
				isDraggedOver && 'bg-sky-400',
			]"
		>
			<DraggablePlayingCard
				v-for="(cardId, index) of roundStore.deck.hand"
				:key="index"
				:index="index"
				:card="roundStore.getCardById(cardId)"
				class="first:ml-auto last:mr-auto min-w-0"
				:class="selectedHandIndex === index && 'opacity-0'"
				@card-picked="cardPicked"
				@card-dropped="cardDropped"
				@card-moved="cardMoved"
				@card-selected="selectCard"
			>
			</DraggablePlayingCard>
		</div>
		<PileOverviewPanel
			kind="discard"
			class="col-span-2"
		>Discard Pile</PileOverviewPanel>
	</div>
	<DndOverlayTeleport v-if="selectedHandCard && position.x > -1 && position.y > -1">
		<PlayingCard
			v-if="!isCardDragged"
			:card="selectedHandCard"
			:selected="true"
			:style="style"
			class="absolute pointer-events-auto"
			@click="unselectCard"
		/>
		<PlayingCard
			v-if="isCardDragged"
			:card="selectedHandCard"
			:style="style"
			:selected="true"
		/>
	</DndOverlayTeleport>
</template>
