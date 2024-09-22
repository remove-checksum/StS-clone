<script setup lang="ts">
import { ref, onMounted, type ComponentInstance, computed } from 'vue'
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import PlayingCard from './PlayingCard.vue'
import DraggablePlayingCard from './DraggablePlayingCard.vue'
import StatusIcon from './StatusIcon.vue'
import BaseButton from './BaseButton.vue'
import Circle from '~icons/ph/circle-fill'
import { useRoundStore } from '@/stores/round'
import PileOverviewPanel from './PileOverviewPanel.vue'
import DndOverlayTeleport from './DndOverlayTeleport.vue'
import { usePositioning } from '@/composables/usePositioning'
import { storeToRefs } from 'pinia'

const roundStore = useRoundStore()
const { selectedHandCard, selectedHandIndex, deck } = storeToRefs(roundStore)
const { selectCardInHand } = roundStore

const cardsInHand = ref<Array<ComponentInstance<typeof DraggablePlayingCard>> | null>(null)

const isCardDragged = ref(false)
const { position, style, resetPosition } = usePositioning({ x: -1, y: -1 })
const playerStatString = computed(() => `${roundStore.player.resource}\\${roundStore.player.maxResource}`)

function selectCard(index: number) {
	selectCardInHand(index)

	const cardRef = cardsInHand.value?.at(index)

	if (cardRef) {
		const rect = cardRef.getCardRect()!

		position.value = {
			x: rect.x,
			y: rect.y
		}
	}
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
	selectedHandIndex.value = -1
	isCardDragged.value = false
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
		<div class="col-span-2 flex flex-col justify-between">
			<StatusIcon
				:stat="playerStatString"
				class="md:text-2xl self-end"
			>
				<Circle class="text-blue-400 h-8 w-8 md:h-20 md:w-20" />
			</StatusIcon>
			<PileOverviewPanel kind="draw">Draw Pile</PileOverviewPanel>
		</div>
		<div
			ref="cardDropTarget"
			:class="[
				'col-span-8 flex overflow-x-clip',
				isDraggedOver && 'bg-sky-400',
			]"
		>
			<DraggablePlayingCard
				v-for="(card, index) of deck.hand"
				:key="index"
				ref="cardsInHand"
				:index="index"
				:card="card"
				class="first:ml-auto last:mr-auto min-w-0"
				:class="selectedHandIndex === index && 'opacity-0'"
				@card-picked="cardPicked"
				@card-dropped="cardDropped"
				@card-moved="cardMoved"
				@click="selectCard(index)"
			>
			</DraggablePlayingCard>
		</div>
		<div class="col-span-2 flex flex-col justify-between">
			<BaseButton
				class="self-start py-12 px-12"
				@click="roundStore.round.turnEnd()"
			>End turn</BaseButton>
			<PileOverviewPanel
				kind="discard"
				class="col-span-2"
			>Discard Pile</PileOverviewPanel>
		</div>
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
