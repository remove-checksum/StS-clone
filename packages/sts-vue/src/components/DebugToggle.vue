<script setup lang="ts">
import BaseButton from './BaseButton.vue'
import { useRoundStore } from '@/stores/round'
import { Defaults } from '@/model/round'

const roundStore = useRoundStore()

function drawOne() {
	roundStore.__roundNonReactive.deck.draw(1)
}
function discardHand() {
	while (roundStore.__roundNonReactive.deck.hand.length > 0) {
		roundStore.__roundNonReactive.deck.discardAt(0)
	}
}
function shuffle() {
	discardHand()
	roundStore.__roundNonReactive.deck.draw(Defaults.Draw)
}
function addPlayerResource() {
	roundStore.__roundNonReactive.player.resource += 1
}
</script>
<template>
	<div class="w-40">
		<BaseButton
			:class="$route.query.debugPopup === 'open' ? '[&&]:bg-green-500' : '[&&]:bg-red-500'"
			@click="
				$router.replace({
					path: $route.path,
					query: {
						debugPopup: $route.query.debugPopup === 'open' ? 'closed' : 'open'
					}
				})
			"
			>Debug: {{ $route.query.debugPopup === 'open' ? 'On' : 'Off' }}
		</BaseButton>
		<div
			class="absolute z-10 flex flex-col gap-2 border border-black bg-gray-50 p-2"
			v-if="$route.query.debugPopup === 'open'"
		>
			<BaseButton @click="discardHand">Discard Hand</BaseButton>
			<BaseButton @click="drawOne">Draw One</BaseButton>
			<BaseButton @click="shuffle">Shuffle</BaseButton>
			<BaseButton @click="addPlayerResource">Add Resource</BaseButton>
		</div>
	</div>
</template>
