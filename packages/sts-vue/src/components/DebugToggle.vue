<script setup lang="ts">
import BaseButton from './BaseButton.vue'
import { useRoundStore } from '@/stores/round'
import { Defaults } from '@/model/round'
import { useRoute, useRouter } from 'vue-router'
import { computed, ref, toValue } from 'vue'
import { number } from 'valibot'

const roundStore = useRoundStore()
const route = useRoute()
const router = useRouter()

const debugPopup = computed({
	get() {
		return route.query?.debugPopup === 'open'
	},
	set(status: boolean) {
		router.replace({ query: { debugPopup: status ? 'open' : 'closed' } })
	}
})

function drawOne() {
	roundStore.__roundNonReactive.deck.draw(1)
}
async function discardHand() {
	return await roundStore.discardHand()
}
function shuffle() {
	discardHand()
	roundStore.__roundNonReactive.deck.draw(Defaults.Draw)
}
function addPlayerResource() {
	roundStore.__roundNonReactive.player.resource += 1
}

const from = ref(0)
const to = ref(0)

function reorder() {
	const fro = toValue(from)
	const too = toValue(to)

	if (
		Number.isNaN(fro) ||
		Number.isNaN(to) ||
		fro < 0 ||
		too < 0 ||
		fro > roundStore.deck.hand.length ||
		too > roundStore.deck.hand.length
	) {
		return
	}

	roundStore.round.deck.reorder(+from.value, +to.value)
	from.value = 0
	to.value = 0
}
</script>
<template>
	<div class="w-40">
		<BaseButton
			:class="$route.query.debugPopup === 'open' ? '[&&]:bg-green-500' : '[&&]:bg-red-500'"
			@click="debugPopup = !debugPopup"
		>Debug: {{ $route.query.debugPopup === 'open' ? 'On' : 'Off' }}
		</BaseButton>
		<div
			v-if="debugPopup"
			class="absolute z-10 flex flex-col gap-2 border border-black bg-gray-50 p-2"
		>
			<BaseButton @click="discardHand">Discard Hand</BaseButton>
			<BaseButton @click="drawOne">Draw One</BaseButton>
			<BaseButton @click="shuffle">Shuffle</BaseButton>
			<BaseButton @click="addPlayerResource">Add Resource</BaseButton>
			<div class="text-base">
				from: <input
					v-model.number="from"
					type="number"
					class="w-12 border border-black"
				/> to:
				<input
					v-model.number="to"
					type="number"
					class="w-12 border border-black"
				/>
				<BaseButton @click="reorder">Reorder</BaseButton>
			</div>
		</div>
	</div>
</template>
