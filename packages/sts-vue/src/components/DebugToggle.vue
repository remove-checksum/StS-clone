<script setup lang="ts">
import BaseButton from './BaseButton.vue'
import { CARD_REMOVE_ANIMATION_DURATION_MS, useRoundStore } from '@/stores/round'
import { Defaults } from '@/model/round'
import { useRoute, useRouter } from 'vue-router'
import { computed, ref, toValue } from 'vue'
import { delay } from '@/helpers/delay'

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

const drawCount = ref(0)
function inc() {
	drawCount.value++
}
function dec() {
	drawCount.value--
}

const drawPending = ref(false)

async function draw() {
	if (!Number.isInteger(drawCount.value) || drawCount.value === 0) return
	const change = Math.abs(drawCount.value)

	drawPending.value = true

	if (drawCount.value > 0) {
		for (let i = 0; i < change; i++) {
			await delay(CARD_REMOVE_ANIMATION_DURATION_MS)
			roundStore.round.deck.draw(1)
		}
	} else {
		for (let i = 0; i < change; i++) {
			await delay(CARD_REMOVE_ANIMATION_DURATION_MS)
			roundStore.round.deck.discardAt(roundStore.round.deck.hand.length - 1)
		}
	}

	drawPending.value = false
	drawCount.value = 0
}

function discardLast() {
	roundStore.round.deck.discardAt(roundStore.deck.hand.length - 1)
}

async function discardHand() {
	return await roundStore.discardHand()
}
async function shuffle() {
	await discardHand()
	roundStore.round.deck.draw(Defaults.Draw)
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
			<BaseButton @click="discardLast">Discard Last</BaseButton>
			<div class="flex gap-2">
				<BaseButton
					:disabled="drawPending"
					@click="inc"
				>add</BaseButton>
				<BaseButton
					:disabled="drawPending"
					@click="dec"
				>remove</BaseButton>
				<BaseButton
					:disabled="drawPending"
					@click="draw"
				>Draw
					<div class="">{{ drawCount }}</div>
				</BaseButton>
			</div>
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
