<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import PlayingCard from './PlayingCard.vue'
import DraggablePlayingCard from './DraggablePlayingCard.vue'
import { useRoundStore } from '@/stores/round'
import PileOverviewPanel from './PileOverviewPanel.vue'

const roundStore = useRoundStore()

const draggedCardIndex = ref(-1)
const draggedCard = computed(() => {
	const cardInHandAtIndex = roundStore.getCardById(roundStore.deck.hand[draggedCardIndex.value])

	return draggedCardIndex.value >= 0 ? cardInHandAtIndex! : null
})

const cardHandLength = computed(() => roundStore.deck.hand.length)
const draggedCardPosition = ref<{ x: number; y: number } | null>(null)
const draggedCardStyleString = computed(() =>
	draggedCardPosition.value
		? `left: ${draggedCardPosition.value.x}px; top: ${draggedCardPosition.value.y}px`
		: ''
)

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
	<div class="flex min-h-24 max-w-[100vw] justify-between lg:min-h-56">
		<PileOverviewPanel kind="draw">Draw Pile</PileOverviewPanel>
		<div
			:class="[
				'min-w-8/12 basis-8/12',
				isDraggedOver && 'bg-sky-400',
				$style.cardHandClipping,
				$style.cardHandSpacing
			]"
			ref="cardDropTarget"
		>
			<DraggablePlayingCard
				v-for="(cardId, index) of roundStore.deck.hand"
				:key="index"
				:index="index"
				:card="roundStore.getCardById(cardId)!"
				@card-picked="cardPicked"
				@card-dropped="cardDropped"
				@card-moved="cardMoved"
				class="first:ml-auto last:mr-auto"
			></DraggablePlayingCard>
		</div>
		<PileOverviewPanel kind="discard">Discard Pile</PileOverviewPanel>
	</div>
	<Teleport to="#teleports" v-if="draggedCard && draggedCardStyleString.length > 0">
		<PlayingCard
			:card="draggedCard"
			:selected="true"
			:active="true"
			:style="draggedCardStyleString"
			class="pointer-events-none fixed"
		/>
	</Teleport>
</template>

<style lang="css" module>
.cardHandSpacing {
	display: flex;
	flex-basis: calc(100% / v-bind(cardHandLength));
}
</style>
