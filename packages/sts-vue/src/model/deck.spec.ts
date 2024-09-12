import { expect, it, describe } from 'vitest'
import { Deck } from '@/model/deck'
import type { Card } from '@/model/card'

const ITEMS_FIXTURE: Array<Card> = ['A', 'B', 'C', 'D', 'E', 'F', 'G'].map((letter, index) => ({
	id: index,
	name: letter,
	description: 'testCard',
	cost: 0,
	effect: []
}))

type CtxWithDeck = { deck: Deck }

describe.sequential('Deck', () => {
	const deck = new Deck(ITEMS_FIXTURE)

	it<CtxWithDeck>('#draw() draws when draw pile larger than draw count', () => {
		expect(deck.toString()).toBe('Draw: A,B,C,D,E,F,G Hand: None Discard: None')

		deck.draw(3)
		expect(deck.drawPile.length).toBe(ITEMS_FIXTURE.length - 3)
		expect(deck.hand.length).toBe(3)
	})

	it<CtxWithDeck>('#discard() works', () => {
		for (const id of deck.hand) {
			deck.discard(id)
		}

		expect(deck.discardPile.length).toBe(3)
	})

	it<CtxWithDeck>('#draw() draws when draw pile smaller than draw count and discard not empty', () => {
		deck.draw(5)

		expect(deck.drawPile.length).toBe(2)
		expect(deck.hand.length).toBe(5)
	})

	it<CtxWithDeck>('#draw() draws when draw pile smaller than draw count and discard is empty', () => {
		deck.draw(100)

		expect(deck.drawPile.length).toBe(0)
		expect(deck.hand.length).toBe(ITEMS_FIXTURE.length)
		expect(deck.discardPile.length).toBe(0)
	})
})
