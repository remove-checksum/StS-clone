<script setup lang="ts">
import { useRoundStore } from '@/stores/round'
import BaseButton from './BaseButton.vue'
import PlayingCard from './PlayingCard.vue'
import { computed, ref } from 'vue'
import DndOverlayTeleport from './DndOverlayTeleport.vue';

type PileKind = 'draw' | 'discard'
type OverviewState = PileKind | 'closed'

const props = defineProps<{
	kind: PileKind
}>()

defineOptions({
	inheritAttrs: false
})

const roundStore = useRoundStore()
const state = ref<OverviewState>('closed')

const cardsByPileKind = computed(() => {
	switch (props.kind) {
		case 'discard':
			return roundStore.deck.discardPile
		case 'draw':
			return roundStore.deck.drawPile
		default:
			return []
	}
})

const cardCountTitle = computed(() => {
	return cardsByPileKind.value.length > 0 ? `${cardsByPileKind.value.length} cards` : 'None'
})

</script>

<template>
	<div
		class="bg-blue-400 p-8"
		:class="$attrs.class"
	>
		<BaseButton
			:disabled="cardsByPileKind.length === 0"
			@click="state = kind"
		>
			<slot></slot> | {{ cardCountTitle }}
		</BaseButton>
	</div>
	<DndOverlayTeleport v-if="state !== 'closed'">
		<div
			class="fixed left-0 top-0 h-full w-full bg-black bg-opacity-50 pointer-events-auto"
			@click.self="state = 'closed'"
		>
			<section class="fixed left-[10%] top-[12vh] h-4/5 w-4/5 border-2 border-black bg-zinc-300 p-4">
				<h2>
					<slot></slot>
				</h2>
				<div class="flex flex-row gap-2 flex-wrap">
					<PlayingCard
						v-for="({ card }, index) of cardsByPileKind"
						:key="index"
						:card="card"
						:index="index"
						:selected="false"
					></PlayingCard>
				</div>
			</section>
		</div>

	</DndOverlayTeleport>
</template>
