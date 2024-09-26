import { defineStore } from 'pinia'
import { computed, reactive, ref } from 'vue'
import { cards } from '@/model/cards.json'
import type { Card } from './round'
import { Player, Target } from '@/model/character'
import { GameRound, Defaults } from '@/model/round'
import { cardRegistry } from '@/model/card'
import type { DeckEntry } from '@/model/deck'

async function delay(ms: number) {
	return await new Promise((res) => setTimeout(res, ms))
}

function makeRound() {
	const playerHealth = 20
	const playerResource = 3
	const player = new Player('Clad', playerHealth, playerHealth, playerResource, playerResource, {
		block: 4
	})
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
	].map((card) => ({ ...card, handId: crypto.randomUUID() }))

	const round = new GameRound(player, enemies, roundCards, cardRegistry)
	return round
}

export type { Card } from '@/model/card'

export const useRoundStore = defineStore('game', () => {
	const __roundNonReactive = makeRound()
	const round = reactive(__roundNonReactive)

	function mapDeckEntry(entry: DeckEntry) {
		const [deckId, cardId] = entry
		return { deckId: deckId, card: round.cardRegistry.get(cardId)! }
	}

	const deck = computed(() => {
		return {
			drawPile: round.deck.drawPile.map(mapDeckEntry),
			discardPile: round.deck.discardPile.map(mapDeckEntry),
			hand: round.deck.hand.map(mapDeckEntry),
			size: round.deck.drawPile.length + round.deck.hand.length + round.deck.discardPile.length
		}
	})

	const cards = ref<Array<Card>>([])
	const roundState = computed(() => round.roundState)
	const player = computed(() => round.player)
	const enemies = computed(() => round.enemies)
	const selectedEnemyKey = computed(() => round.selectedEnemyKey)

	const selectedHandIndex = ref(-1)
	const selectedHandCard = computed(() => {
		if (selectedHandIndex.value === -1) return null
		const [_, cardId] = round.deck.hand[selectedHandIndex.value]

		return cardRegistry.get(cardId)!
	})

	function selectCardInHand(index: number) {
		selectedHandIndex.value = index
	}

	function playSelectedCard() {
		if (selectedHandIndex.value > -1) {
			const success = round.tryPlayFromHand(selectedHandIndex.value)
			selectedHandIndex.value = -1
		}
	}

	async function discardHand() {
		while (round.deck.hand.length) {
			await delay(400)
			round.deck.discardAt(round.deck.hand.length - 1)
		}
	}

	async function draw(count: number) {
		round.deck.draw(count)
		let i = round.deck.hand.length - 1
		while (round.deck.hand.length < cards.value.length) {
			await delay(400)
			const cardId = round.deck.idInHandAt(i)
			cards.value = [...cards.value, round.cardRegistry.get(cardId)!]
			i--
		}
	}

	function getCardById(id: number) {
		return round.cardRegistry.get(id)!
	}

	function cardInHandAt(index: number) {
		return round.deck.idInHandAt(index)
	}

	function startRound() {
		round.deck.draw(Defaults.Draw)
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
