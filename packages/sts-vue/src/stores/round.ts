import { defineStore } from 'pinia'
import { computed, reactive, ref } from 'vue'
import { Player, Target } from '@/model/character'
import { GameRound, Defaults } from '@/model/round'
import { cardRegistry, type Card } from '@/model/card'
import type { DeckEntry } from '@/model/deck'
import { delay } from '@/helpers/delay'

function makeRound(cardRegistry: Map<number, Card>) {
	const playerHealth = 20
	const playerResource = 3
	const player = new Player('Clad', playerHealth, playerHealth, playerResource, playerResource, {
		block: 4
	})
	const enemies = new Map([
		['wurm', new Target('Wurm', Defaults.Health, Defaults.Health, { block: 4 })],
		['gremlin', new Target('Gremlin')]
	])

	const [strike, block, heave, scan, heavyStrike, stab, whoops] = cardRegistry.values()

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
	].map((card) => ({ ...card, handId: crypto.randomUUID() }))

	const round = new GameRound(player, enemies, roundCards, cardRegistry)
	return round
}

export const CARD_REMOVE_ANIMATION_DURATION_MS = 150

export type { Card } from '@/model/card'

export const useRoundStore = defineStore('game', () => {
	const __roundNonReactive = makeRound(cardRegistry)
	const round = reactive(__roundNonReactive)

	function mapDeckEntry(entry: DeckEntry) {
		const { deckId, id } = entry
		return { deckId, card: round.cardRegistry.get(id)! }
	}

	const deck = computed(() => {
		return {
			drawPile: round.deck.drawPile.map(mapDeckEntry),
			discardPile: round.deck.discardPile.map(mapDeckEntry),
			hand: round.deck.hand.map(mapDeckEntry),
			size: round.deck.drawPile.length + round.deck.hand.length + round.deck.discardPile.length
		}
	})

	const roundState = computed(() => round.roundState)
	const player = computed(() => round.player)
	const enemies = computed(() => round.enemies)
	const selectedEnemyKey = computed(() => round.selectedEnemyKey)

	const selectedHandIndex = ref(-1)
	const selectedHandCard = computed(() => {
		if (selectedHandIndex.value === -1) return null
		const { id } = round.deck.hand[selectedHandIndex.value]

		return cardRegistry.get(id)!
	})

	function selectCardInHand(index: number) {
		selectedHandIndex.value = index
	}

	function playSelectedCard() {
		if (selectedHandIndex.value > -1) {
			round.tryPlayFromHand(selectedHandIndex.value)
			selectedHandIndex.value = -1
		}
	}

	async function discardHand() {
		const cardHandCount = round.deck.hand.length
		for (let i = 0; i < cardHandCount; i++) {
			round.deck.discardAt(round.deck.hand.length - 1)
		}
	}

	async function draw(count: number) {
		for (let i = 0; i < count; i++) {
			round.deck.draw(1)
		}
	}

	function getCardById(id: number) {
		return round.cardRegistry.get(id)!
	}

	function cardInHandAt(index: number) {
		return round.deck.idInHandAt(index)
	}

	async function startRound() {
		for (let i = 0; i < Defaults.Draw; i++) {
			round.deck.draw(1)
			await delay(CARD_REMOVE_ANIMATION_DURATION_MS)
		}
	}

	function selectEnemy(enemyKey: string) {
		round.selectEnemy(enemyKey)
	}

	function reorder(from: number, to: number) {
		if (from === -1 || to === -1) return

		round.deck.reorder(from, to)
		selectedHandIndex.value = to
	}

	return {
		__roundNonReactive,
		round,
		deck,
		player,
		enemies,
		roundState,
		selectedEnemyKey,
		selectedHandIndex,
		selectedHandCard,
		draw,
		reorder,
		discardHand,
		selectCardInHand,
		getCardById,
		cardInHandAt,
		selectEnemy,
		playSelectedCard,
		startRound
	}
})
