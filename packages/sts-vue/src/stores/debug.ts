import { defineStore } from 'pinia'
import { useRoundStore } from './round'
import { Character } from '@/model/character'

export const useDebugStore = defineStore('debug', () => {
	const roundStore = useRoundStore()

	function drawOne() {
		roundStore.round.deck.draw(1)
	}
	function discardOne(cardIndex: number) {
		roundStore.round.deck.discardAt(cardIndex)
	}
	function discardHand() {
		while (roundStore.round.deck.hand.length > 0) {
			roundStore.round.deck.discardAt(0)
		}
	}
	function shuffle() {
		discardHand()
		roundStore.round.deck.draw(Character.Defaults.Draw)
	}
	function addPlayerResource() {
		roundStore.round.player.resource += 1
	}

	return { drawOne, discardOne, discardHand, shuffle, addPlayerResource }
})
