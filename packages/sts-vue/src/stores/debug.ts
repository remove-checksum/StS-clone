import { defineStore } from 'pinia'
import { useRoundStore } from './round'
import { Defaults } from '@/model/round'

export const useDebugStore = defineStore('debug', () => {
	const roundStore = useRoundStore()

	function drawOne() {
		roundStore.deck.draw(1)
	}
	function discardOne(cardIndex: number) {
		roundStore.deck.discardAt(cardIndex)
	}
	function discardHand() {
		while (roundStore.deck.hand.length > 0) {
			roundStore.deck.discardAt(0)
		}
	}
	function shuffle() {
		discardHand()
		roundStore.deck.draw(Defaults.Draw)
	}
	function addPlayerResource() {
		roundStore.player.resource += 1
	}

	return { drawOne, discardOne, discardHand, shuffle, addPlayerResource }
})
