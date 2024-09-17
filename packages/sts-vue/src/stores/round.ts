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

const round = makeRound()

export type { Card } from '@/model/card'

export const useRoundStore = defineStore('game', () => {
	const __roundNonReactive = round

	const deck = reactive(round.deck)
	const player = ref(round.player)
	const enemies = ref(round.enemies)

	const selectedEnemyKey = ref(round.selectedEnemyKey)
	const selectedHandIndex = ref(-1)
	const selectedHandCard = computed(() =>
		selectedHandIndex.value > -1 ? deck.cardInHandAt(selectedHandIndex.value) : null
	)

	function selectCardInHand(index: number) {
		selectedHandIndex.value = index
	}

	deck.draw(5)

	// function __syncDeck() {
	// 	deck.discardPile = __roundNonReactive.deck.discardPile
	// 	deck.drawPile = __roundNonReactive.deck.drawPile
	// 	deck.hand = __roundNonReactive.deck.hand
	// }

	function playCard(position: number) {
		round.tryPlayFromHand(position)
	}

	function getCardById(id: number) {
		return deck.cardById(id)!
	}

	function cardInHandAt(index: number) {
		return deck.cardInHandAt(index)
	}

	function startRound() {
		deck.draw(Defaults.Draw)
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
