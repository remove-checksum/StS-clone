<script setup lang="ts">
import {
	ref,
	onMounted,
	type ComponentInstance,
	computed,
	getCurrentInstance,
	watch,
	watchEffect,
	toValue,
	nextTick
} from 'vue'
import {
	dropTargetForElements,
	monitorForElements
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import PlayingCard from './PlayingCard.vue'
import DraggablePlayingCard from './DraggablePlayingCard.vue'
import DndOverlayTeleport from './DndOverlayTeleport.vue'
import { useRoundStore } from '@/stores/round'
import { usePositioning } from '@/composables/usePositioning'
import { storeToRefs } from 'pinia'
import CardSlot from './CardSlot.vue'
import animate from 'animejs'
import { preserveOffsetOnSource } from '@atlaskit/pragmatic-drag-and-drop/element/preserve-offset-on-source'
import { assert } from '@/model/assert'

const roundStore = useRoundStore()
const { selectedHandCard, selectedHandIndex, deck } = storeToRefs(roundStore)
const { selectCardInHand } = roundStore

const cardsInHand = ref<Array<ComponentInstance<typeof DraggablePlayingCard>> | null>(null)

const isCardDragged = ref(false)
const { position, style, resetPosition } = usePositioning({ x: -1, y: -1 })

const cardSlots = ref<Array<ComponentInstance<typeof CardSlot>> | null>(null)
const cardDropTarget = ref<HTMLDivElement | null>(null)
const cards = ref<Array<ComponentInstance<typeof PlayingCard>> | null>(null)
const dragCursorOffset = ref<{ x: number; y: number }>({ x: 0, y: 0 })
const cursorOutsideDropZone = ref(false)

function selectCard(index: number) {
	selectCardInHand(index)

	const cardRef = cardsInHand.value?.at(index)

	if (cardRef) {
		const rect = cardRef.getCardRect()!

		position.value = {
			x: 400,
			y: 400
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

function getCardSlotIndex(slots: Array<ComponentInstance<typeof CardSlot>>, pointerX: number) {
	const elements = toValue(slots)
		.map((element) => element.cardSlot!.getBoundingClientRect())
		.sort((a, b) => a.x - b.x)

	const containerOriginX = elements[0].x

	const breakpoints = []

	for (let i = 0; i < elements.length; i++) {
		const rect = elements[i]
		const isLast = i === elements.length - 1
		const leftX = rect.x - containerOriginX
		const rightX = isLast ? leftX + rect.width : elements[i + 1].x - containerOriginX

		breakpoints.push([leftX, rightX])
	}
	return breakpoints.findIndex(([from, to]) => pointerX > from && pointerX < to)
}

function cardDropped() {
	selectedHandIndex.value = -1
	isCardDragged.value = false
	resetPosition()
}

function getAnimationStartingPoint() {
	return cardDropTarget.value!.getBoundingClientRect().left
}

function animateStaggeredEnter(el: Element) {
	const x = el.getBoundingClientRect().x
	const startingPoint = getAnimationStartingPoint() + x
	animate({
		targets: el,
		translateX: [-startingPoint, 0],
		rotate: [-90, 0],
		scaleX: [0.2, 1],
		scaleY: [0.2, 1],
		duration: 500,
		easing: 'easeInOutQuad'
	})
}

function animateStaggeredLeave(el: Element, done: () => void) {
	animate({
		targets: el,
		translateX: 400,
		rotate: 90,
		scale: 0.2,
		duration: 500,
		easing: 'linear',
		complete: done
	})
}

onMounted(() => {
	const dropTarget = cardDropTarget.value!

	dropTargetForElements({
		element: dropTarget,
		getData: () => {
			return { name: 'cardHand' }
		},
	})

	monitorForElements({
		canMonitor: ({ source }) => 'cardIndex' in source.data,
		onDragStart: ({ source, location }) => {
			const card = source.element
			dragCursorOffset.value = preserveOffsetOnSource({
				element: card,
				input: location.initial.input
			})({ container: card })

			assert(typeof source.data.cardIndex === 'number')

			selectCardInHand(source.data.cardIndex)
		},
		onDrag: ({ location }) => {
			const { clientX, clientY } = location.current.input

			isCardDragged.value = true

			const { x, y } = cardDropTarget.value!.getBoundingClientRect()
			cursorOutsideDropZone.value = clientY < y

			if (cardSlots.value) {
				const idx = getCardSlotIndex(cardSlots, clientX - dragCursorOffset.value.x - x)
				roundStore.round.deck.reorder(selectedHandIndex.value, idx)
			}

			position.value = {
				x: clientX - dragCursorOffset.value.x,
				y: clientY - dragCursorOffset.value.y
			}
		},
		onDrop: () => {
			isCardDragged.value = false
			selectCardInHand(-1)
			dragCursorOffset.value = { x: 0, y: 0 }
			resetPosition()
		}
	})
})
</script>

<template>
	<div
		ref="cardDropTarget"
		:class="['col-span-8 flex justify-center overflow-x-clip']"
	>
		<TransitionGroup move-class="transition-all duration-700">
			<CardSlot
				v-for="(card, index) of deck.hand"
				:key="index"
				ref="cardSlots"
				:class="[
					'flex justify-center bg-orange-500 ring-1 ring-red-700',
					// 'transition-[flex-basis]'
					// selectedHandIndex === index && cursorOutsideDropZone ? 'lg:basis-6' : 'lg:basis-36'
				]"
				:data-card-index="index"
			>
				<DraggablePlayingCard
					ref="cards"
					:card="card"
					:drag-data="{ cardIndex: index }"
					:class="selectedHandIndex === index && 'opacity-50'"
					@mouseup="selectCard(index)"
				>
				</DraggablePlayingCard>
			</CardSlot>
		</TransitionGroup>
	</div>
	<DndOverlayTeleport v-if="selectedHandCard && position.x > -1 && position.y > -1">
		<PlayingCard
			v-if="!isCardDragged"
			:card="selectedHandCard"
			:selected="true"
			:style="style"
			class="pointer-events-auto absolute"
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
