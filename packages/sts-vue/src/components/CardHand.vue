<script setup lang="ts">
import { ref, onMounted, type ComponentInstance } from 'vue'
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
import { preserveOffsetOnSource } from '@atlaskit/pragmatic-drag-and-drop/element/preserve-offset-on-source'
import { assert } from '@/model/assert'
import { isCardData, isEnemyData } from '@/helpers/dragDataAssert'

const roundStore = useRoundStore()
const { selectedHandCard, selectedHandIndex, deck } = storeToRefs(roundStore)
const { selectCardInHand } = roundStore

const isCardDragged = ref(false)
const { position, style, resetPosition } = usePositioning({ x: -1, y: -1 })

type CardSlotsComponents = Array<ComponentInstance<typeof CardSlot>>

const cardSlots = ref<CardSlotsComponents | null>(null)
const cardDropTarget = ref<HTMLDivElement | null>(null)
const cards = ref<Array<ComponentInstance<typeof PlayingCard>> | null>(null)
const dragCursorOffset = ref<{ x: number; y: number }>({ x: 0, y: 0 })
const cardBreakpoints = ref<Array<readonly [number, number]>>([])
const cursorOutsideDropZone = ref(false)

function getListXBrekpoints(elements: Array<HTMLElement>) {
	const elementRects = elements.map((el) => el.getBoundingClientRect())

	const elementOriginX = elementRects[0].x

	const breakpoints = []

	for (let i = 0; i < elements.length; i++) {
		const { x, width } = elementRects[i]
		const isLast = i === elements.length - 1
		const leftX = x - elementOriginX

		let rightX = isLast ? leftX + width : elementRects[i + 1].x - elementOriginX

		breakpoints.push([leftX, rightX] as const)
	}

	return breakpoints
}

onMounted(() => {
	assert(cardDropTarget.value)

	dropTargetForElements({
		element: cardDropTarget.value,
		getData: () => {
			return { name: 'cardHand' }
		}
	})

	monitorForElements({
		canMonitor: ({ source }) => isCardData(source.data),
		onDragStart: ({ source, location }) => {
			if (!isCardData(source.data)) return

			const card = source.element
			dragCursorOffset.value = preserveOffsetOnSource({
				element: card,
				input: location.initial.input
			})({ container: card })

			const cardIndex = roundStore.deck.hand.findIndex(
				({ deckId }) => deckId === source.data.deckKey
			)

			if (cardSlots.value) {
				cardBreakpoints.value = getListXBrekpoints(
					cardSlots.value
						.map((el) => el.cardSlot)
						.sort(
							(a, b) =>
								(a!.dataset.listOrder as unknown as number) -
								(b!.dataset.listOrder as unknown as number)
						) as Array<HTMLElement>
				)
			}

			selectCardInHand(cardIndex)
		},
		onDrag: ({ location, source }) => {
			const { clientX, clientY } = location.current.input

			assert(cardDropTarget.value && cardSlots.value)
			if (!isCardData(source.data)) return

			isCardDragged.value = true

			if (cardSlots.value && cardDropTarget.value.firstElementChild) {
				const { clientX: prevClientX } = source.data.previousInput
				const { x: firstCardX, y: firstCardY } =
					cardDropTarget.value.firstElementChild.getBoundingClientRect()

				const dragXDirection = Math.sign(clientX - prevClientX) as 0 | 1 | -1

				cursorOutsideDropZone.value = clientY < firstCardY

				const relativeToCardsX = clientX - firstCardX

				const index = cardBreakpoints.value.findIndex(
					([from, to]) => relativeToCardsX > from && relativeToCardsX < to
				)

				if (index !== -1 && index !== selectedHandIndex.value && dragXDirection !== 0) {
					// TODO: animation breaks with operands swapped
					roundStore.reorder(selectedHandIndex.value, index)
				}
			}

			source.data.previousInput = location.current.input

			position.value = {
				x: clientX - dragCursorOffset.value.x,
				y: clientY - dragCursorOffset.value.y
			}
		},
		onDrop: ({ location }) => {
			const { dropTargets } = location.current
			if (dropTargets.some(target => isEnemyData(target.data))) {
				roundStore.playSelectedCard()
			}

			isCardDragged.value = false
			selectCardInHand(-1)
			dragCursorOffset.value = { x: 0, y: 0 }
			resetPosition()
			cardBreakpoints.value = []
		}
	})
})
</script>

<template>
	<div
		ref="cardDropTarget"
		class="col-span-8 flex"
	>
		<TransitionGroup
			move-class="transition-[width,transform]"
			enter-from-class="-translate-x-80 scale-50 opacity-0 w-0"
			enter-active-class="transition-[width,transform,opacity] duration-300"
			enter-to-class="translate-x-0 lg:w-36 w-20"
			leave-from-class="translate-x-[--left-x] lg:w-36 w-20"
			leave-active-class="transition-[width,transform,opacity] duration-300"
			leave-to-class="translate-x-80 scale-50 opacity-0 w-0"
		>
			<!-- reorder animation from 0 to 1 breaks without this placeholder -->
			<CardSlot :key="'hack-first'"></CardSlot>
			<CardSlot
				v-for="({ card, deckId }, index) of deck.hand"
				:key="deckId"
				ref="cardSlots"
				class="flex justify-center"
				:class="[selectedHandIndex === index && cursorOutsideDropZone && 'basis-10', '-ml-4']"
				:data-list-order="index"
			>
				<DraggablePlayingCard
					ref="cards"
					:card="card"
					:deck-key="deckId"
					:class="[selectedHandIndex === index && '-z-10 opacity-0']"
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
		/>
		<PlayingCard
			v-if="isCardDragged"
			:card="selectedHandCard"
			:style="style"
			:selected="true"
		/>
	</DndOverlayTeleport>
</template>
