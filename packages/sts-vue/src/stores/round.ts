import { defineStore } from 'pinia'
import { computed, reactive, ref } from 'vue'
import { cards } from '@/model/cards.json'
import type { Card } from './round'
import { Character } from '@/model/character'
import { GameRound, Defaults } from '@/model/round'

function makeRound() {
	const player = new Character('Clad', 10, 20, { block: 4 })
	const enemies = new Map([
		['wurm', new Character('Wurm', Defaults.Resource, Defaults.Health, { block: 4 })],
		['gremlin', new Character('Gremlin')]
	])

	const [strike, block, heave, scan, heavyStrike, stab, whoops] = cards

	const roundCards = [
		strike,
		strike,
		strike,
		strike,
		strike,
		block,
		block,
		block,
		block,
		heave,
		scan,
		heavyStrike,
		stab,
		whoops
	]

	const round = new GameRound(player, enemies, roundCards as Array<Card>)
	return round
}

export type { Card } from '@/model/card'

export const useRoundStore = defineStore('game', () => {
	const __roundNonReactive = makeRound()
	const round = reactive(__roundNonReactive)
	const deck = computed(() => round.deck)
	const player = computed(() => round.player)
	const enemies = computed(() => round.enemies)

	const selectedEnemyKey = ref(round.selectedEnemyKey)
	const selectedHandIndex = ref(-1)
	const selectedHandCard = computed(() =>
		selectedHandIndex.value > -1 ? round.deck.cardInHandAt(selectedHandIndex.value) : null
	)

	function selectCardInHand(index: number) {
		selectedHandIndex.value = index
	}

	round.deck.draw(5)

	function playCard(position: number) {
		round.tryPlayFromHand(position)
	}

	function getCardById(id: number) {
		return round.deck.cardById(id)!
	}

	function cardInHandAt(index: number) {
		return round.deck.cardInHandAt(index)
	}

	function startRound() {
		round.deck.draw(Defaults.Draw)
	}

	function changeSelectedEnemy(enemyKey: string) {
		round.selectEnemy(enemyKey)
		selectedEnemyKey.value = round.selectedEnemyKey
	}

	return {
		__roundNonReactive,
		deck,
		player,
		enemies,
		selectedEnemyKey,
		selectedHandIndex,
		selectedHandCard,
		selectCardInHand,
		getCardById,
		getCardByHandIndex: cardInHandAt,
		changeSelectedEnemy,
		playCard,
		startRound
	}
})
