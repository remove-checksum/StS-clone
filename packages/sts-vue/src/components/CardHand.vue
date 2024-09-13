<script setup lang="ts">
import { ref, onMounted, computed, type ComponentInstance } from 'vue'
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import PlayingCard from './PlayingCard.vue'
import DraggablePlayingCard from './DraggablePlayingCard.vue'
import { useRoundStore } from '@/stores/round'
import PileOverviewPanel from './PileOverviewPanel.vue'
import { MotionComponent, useMotion } from '@vueuse/motion'

const roundStore = useRoundStore()

const cardSelectGhost = ref<ComponentInstance<typeof PlayingCard> | null>(null)
const cardSelectInitialPosition = ref({ x: 0, y: 0 })

const selectedCardIndex = ref(-1)
const selectedCard = computed(() => {
	return selectedCardIndex.value >= 0 ? roundStore.getCardByHandIndex(selectedCardIndex.value) : null
})

const draggedCardIndex = ref(-1)
const draggedCard = computed(() => {
	return draggedCardIndex.value >= 0 ? roundStore.getCardByHandIndex(draggedCardIndex.value) : null
})

const cardHandLength = computed(() => roundStore.deck.hand.length)
const draggedCardPosition = ref<{ x: number; y: number } | null>(null)
const draggedCardStyleString = computed(() =>
	draggedCardPosition.value
		? `left: ${draggedCardPosition.value.x}px; top: ${draggedCardPosition.value.y}px`
		: ''
)

function toggleCardSelect(index: number) {
	selectedCardIndex.value = selectedCardIndex.value < 0 ? index : -1
}

function cardPicked(index: number) {
	draggedCardIndex.value = index
}

function cardMoved(nextPosition: { x: number; y: number }) {
	draggedCardPosition.value = nextPosition
}

function cardDropped() {
	draggedCardIndex.value = -1
	draggedCardPosition.value = null
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
				$style.cardHandClipping,
			]"
		>
			<DraggablePlayingCard
				v-for="(cardId, index) of roundStore.deck.hand"
				:key="index"
				:index="index"
				:card="roundStore.getCardById(cardId)!"
				class="first:ml-auto last:mr-auto min-w-0"
				@card-picked="cardPicked"
				@card-dropped="cardDropped"
				@card-moved="cardMoved"
				@click="toggleCardSelect(index)"
			>
			</DraggablePlayingCard>
		</div>
		<PileOverviewPanel
			kind="discard"
			class="col-span-2"
		>Discard Pile</PileOverviewPanel>
	</div>
	<Teleport
		v-if="draggedCard && draggedCardStyleString.length > 0"
		to="#teleports"
	>
		<PlayingCard
			:card="draggedCard"
			:selected="true"
			:style="draggedCardStyleString"
			class="pointer-events-none fixed"
		/>
	</Teleport>
	<Teleport
		v-if="selectedCard"
		to="#teleports"
	>
		<MotionComponent
			:enter="{
				translateX: '50%',
				translateY: '50%',
				opacity: 1
			}"
			:initial="{
				translateX: '50%',
				translateY: '70%',
				opacity: 0
			}"
		>
			<PlayingCard
				ref="cardSelectGhost"
				:card="selectedCard"
				:selected="true"
				@click="toggleCardSelect"
			></PlayingCard>
		</MotionComponent>
	</Teleport>
</template>

<style lang="css" module>
.cardHandSpacing {
	display: flex;
	flex-basis: calc(100% / v-bind(cardHandLength));
}
</style>
