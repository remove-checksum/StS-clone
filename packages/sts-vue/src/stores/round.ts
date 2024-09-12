import { defineStore } from 'pinia'
import { computed, reactive, ref, shallowReactive, shallowRef } from 'vue'
import { cards } from '@/model/cards.json'
import type { Card } from './round'
import { Character } from '@/model/character'
import { GameRound, Defaults } from '@/model/round'

function delay(ms: number) {
	return new Promise((res) => setTimeout(res, ms))
}

function makeRound() {
	const player = new Character('Player', 10, 20, { block: 4 })
	const enemies = new Map([
		['bibi', new Character('Bibi', Defaults.Resource, Defaults.Health, { block: 4 })],
		['boba', new Character('Boba')]
	])

	const roundCards = [cards[1], cards[2], cards[3], cards[4], cards[6], cards[7]]

	const round = new GameRound(player, enemies, roundCards as Array<Card>)
	return round
}

const round = makeRound()

export type { Card } from '@/model/card'

export const useRoundStore = defineStore('game', () => {
	const __roundNonReactive = round

	const deck = shallowReactive({
		hand: round.deck.hand,
		drawPile: round.deck.drawPile,
		discardPile: round.deck.discardPile
	})
	const player = ref(round.player)
	const enemies = ref(round.enemies)

	const selectedEnemyKey = ref(round.selectedEnemyKey)

	function __syncDeck() {
		deck.discardPile = __roundNonReactive.deck.discardPile
		deck.drawPile = __roundNonReactive.deck.drawPile
		deck.hand = __roundNonReactive.deck.hand
	}

	function playCard(position: number) {
		round.tryPlayFromHand(position)
		__syncDeck()
	}

	function getCardById(id: number) {
		return round.deck.cardById(id)
	}

	function startRound() {
		round.deck.draw(Defaults.Draw)
		__syncDeck()
	}

	function changeSelectedEnemy(enemyKey: string) {
		round.selectEnemy(enemyKey)
		selectedEnemyKey.value = round.selectedEnemyKey
	}

	function endTurn() {
		round.turnEnd()
		round.enemyTurn()
		round.turnStart()
		__syncDeck()
	}

	return {
		__roundNonReactive,
		deck,
		player,
		enemies,
		selectedEnemyKey,
		__syncDeck,
		getCardById,
		changeSelectedEnemy,
		playCard,
		endTurn,
		startRound
	}
})
