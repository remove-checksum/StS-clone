<script setup lang="ts">
import DebugToggle from '@/components/DebugToggle.vue'
import { ref, onMounted } from 'vue'
import { useRoundStore } from '@/stores/round'
import CharacterCard from '@/components/CharacterCard.vue'
import CardHand from '@/components/CardHand.vue'
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'

const roundStore = useRoundStore()
const { changeSelectedEnemy } = roundStore

const cardPlayDropZone = ref<null | HTMLDivElement>(null)
const cardEnteredDropZone = ref(false)

function isCard(cardData: unknown): cardData is { cardIndex: number } {
	return (
		typeof cardData === 'object' &&
		cardData !== null &&
		'cardIndex' in cardData &&
		typeof cardData.cardIndex === 'number'
	)
}

onMounted(() => {
	const cardPlayZoneRef = cardPlayDropZone.value!

	dropTargetForElements({
		element: cardPlayZoneRef,
		canDrop: () => true,
		onDrop: ({ source }) => {
			if (isCard(source.data)) {
				const isSuccess = roundStore.playCard(source.data.cardIndex)
				cardEnteredDropZone.value = false
			}
		},
		onDragEnter: () => {
			cardEnteredDropZone.value = true
		},
		onDragLeave: () => {
			cardEnteredDropZone.value = false
		}
	})
})
</script>

<template>
	<main class="flex min-h-screen flex-col">
		<header class="flex h-[12wh] justify-between overflow-x-clip">
			<div id="cog" class="hover:animate-wiggle h-12 w-12 bg-zinc-200"></div>
			<h2 class="flex flex-row justify-around gap-4 text-2xl">
				<span class="align-middle">StS Game</span>
				<DebugToggle></DebugToggle>
			</h2>
			<div id="hamburger" class="h-12 w-12 bg-zinc-200 duration-200 hover:rotate-90"></div>
		</header>
		<div class="grid grow grid-flow-row grid-cols-3 bg-gray-600">
			<div class="bg-zinc-300">
				<h3 class="text-center text-2xl">Player</h3>
				<CharacterCard :target="roundStore.player" :selected="false"></CharacterCard>
			</div>
			<div>
				<div
					ref="cardPlayDropZone"
					class="grid h-1/2 w-full place-self-center border-black bg-zinc-400"
					:class="{ 'border-dotted': cardEnteredDropZone }"
				>
					<h3 v-if="cardEnteredDropZone" class="place-self-center text-3xl">Drop</h3>
				</div>
			</div>
			<div class="bg-zinc-300">
				<h3 class="text-center text-2xl">Enemies</h3>
				<template v-for="[key, target] of roundStore.enemies.entries()" :key="key">
					<CharacterCard
						:selected="roundStore.selectedEnemyKey === key"
						:target="target"
						@click="changeSelectedEnemy(key)"
					></CharacterCard>
				</template>
			</div>
		</div>

		<CardHand></CardHand>
	</main>
	<div id="cardHandPlane" class="fixed left-0 top-0 w-full h-full pointer-events-none"></div>
	<div id="teleports" class="fixed left-0 top-0 w-full h-full pointer-events-none"></div>
</template>