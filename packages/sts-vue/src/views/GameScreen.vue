<script setup lang="ts">
import DebugToggle from '@/components/DebugToggle.vue'
import { ref, onMounted, computed } from 'vue'
import { useRoundStore } from '@/stores/round'
import PlayerCard from '@/components/PlayerCard.vue'
import EnemyCard from '@/components/EnemyCard.vue'
import CardHand from '@/components/CardHand.vue'
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import { assert } from '@/model/assert'

const roundStore = useRoundStore()

function isCard(cardData: unknown): cardData is { cardIndex: number } {
	return (
		typeof cardData === 'object' &&
		cardData !== null &&
		'cardIndex' in cardData &&
		typeof cardData.cardIndex === 'number'
	)
}

const cardPlayDropZone = ref<null | HTMLDivElement>(null)
const cardInDropZone = ref(false)

onMounted(() => {
	const cardPlayZoneRef = cardPlayDropZone.value
	assert(cardPlayZoneRef)

	dropTargetForElements({
		element: cardPlayZoneRef,
		onDrop: ({ source }) => {
			if (isCard(source.data)) {
				roundStore.playSelectedCard()
			}
			cardInDropZone.value = false
		},
		onDragEnter: () => {
			cardInDropZone.value = true
		},
		onDragLeave: () => {
			cardInDropZone.value = false
		}
	})
})

onMounted(() => roundStore.startRound())
</script>

<template>
	<main class="flex min-h-screen flex-col">
		<header class="flex h-[12wh] justify-between overflow-x-clip">
			<div
				id="cog"
				class="hover:animate-wiggle h-12 w-12 bg-zinc-200"
			></div>
			<h2 class="flex flex-row justify-around gap-4 text-2xl">
				<span class="align-middle">StS Game</span>
				<DebugToggle></DebugToggle>
			</h2>
			<div
				id="hamburger"
				class="h-12 w-12 bg-zinc-200 duration-200 hover:rotate-90"
			></div>
		</header>
		<div class="grid grow grid-flow-row grid-cols-3 bg-gray-600">
			<div class="bg-zinc-300">
				<h3 class="text-center text-2xl">Player</h3>
				<PlayerCard :player="roundStore.player" />
			</div>
			<div>
				<div
					ref="cardPlayDropZone"
					class="grid h-1/2 w-full place-self-center bg-zinc-400"
					:class="[
						'ring-inset ring-white transition-[box-shadow] duration-200',
						roundStore.selectedHandIndex > -1 ? 'ring-4' : 'ring-0',
						cardInDropZone ? 'ring-8' : 'ring-0'
					]"
				>
					<h3
						v-if="roundStore.selectedHandCard"
						class="cursor-pointer place-self-center text-3xl underline"
						@click="roundStore.playSelectedCard"
					>
						Drop
					</h3>
				</div>
			</div>
			<div class="bg-zinc-300">
				<h3 class="text-center text-2xl">Enemies</h3>
				<EnemyCard
					v-for="[key, enemy] of roundStore.enemies.entries()"
					:key="key"
					:enemy="enemy"
					:selected="roundStore.selectedEnemyKey === key"
					@click="roundStore.selectEnemy(key)"
				/>
			</div>
		</div>

		<CardHand />
	</main>
	<div
		data-overlay-teleport
		class="pointer-events-none fixed left-0 top-0 h-full w-full"
	></div>
</template>
