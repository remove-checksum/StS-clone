import { defineStore } from 'pinia'
import { computed, reactive, ref } from 'vue'
import { cards } from '@/model/cards.json'
import type { Card } from './round'
import { Player, Target } from '@/model/character'
import { GameRound, Defaults } from '@/model/round'

function makeRound() {
	const playerHealth = 10
	const playerResource = 10
	const player = new Player('Clad', playerHealth, playerHealth, playerResource, { block: 4 })
	const enemies = new Map([
		['wurm', new Target('Wurm', Defaults.Health, Defaults.Health, { block: 4 })],
		['gremlin', new Target('Gremlin')]
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
	const deck = computed(() => {
		return {
			drawPile: round.deck.drawPile.map((id) => round.deck.cardById(id)),
			discardPile: round.deck.discardPile.map((id) => round.deck.cardById(id)),
			hand: round.deck.hand.map((id) => round.deck.cardById(id)),
			size: round.deck.drawPile.length + round.deck.hand.length + round.deck.discardPile.length
		}
	})

	const player = computed(() => round.player)
	const enemies = computed(() => round.enemies)
	const selectedEnemyKey = computed(() => round.selectedEnemyKey)

	const selectedHandIndex = ref(-1)
	const selectedHandCard = computed(() =>
		selectedHandIndex.value > -1 ? round.deck.cardInHandAt(selectedHandIndex.value) : null
	)

	function selectCardInHand(index: number) {
		selectedHandIndex.value = index
	}

	function playSelectedCard() {
		if (selectedHandIndex.value > -1) {
			const success = round.tryPlayFromHand(selectedHandIndex.value)
			if (success) {
				selectedHandIndex.value = -1
			}
		}
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

	function selectEnemy(enemyKey: string) {
		round.selectEnemy(enemyKey)
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
		cardInHandAt,
		selectEnemy,
		playSelectedCard,
		startRound
	}
})
