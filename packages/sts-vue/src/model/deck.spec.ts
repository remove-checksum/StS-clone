import { expect, it, describe, beforeEach } from 'vitest'
import { Deck, type DeckEntry } from '@/model/deck'
import { initCardRegistry } from '@/model/card'

const HAND_LIMIT = 5
const CARDS_FIXTURE = ['A', 'B', 'C', 'D', 'E', 'F', 'G'].map((letter, index) => {
	return {
		id: index,
		name: letter,
		description: 'testCard',
		cost: 0,
		effect: []
	}
})

const CARD_REGISTRY_FIXTURE = initCardRegistry(CARDS_FIXTURE)

type CtxWithDeck = { deck: Deck }

describe.sequential('Deck', () => {
	expect.addSnapshotSerializer({
		print(val) {
			const deck = val as Deck

			function cardNamesOrNone(pile: Array<DeckEntry>) {
				return pile.length > 0
					? pile.map(({ id }) => CARD_REGISTRY_FIXTURE.get(id)!.name).join(',')
					: 'None'
			}

			return `Draw: ${cardNamesOrNone(deck.drawPile)} Hand: ${cardNamesOrNone(deck.hand)} Discard: ${cardNamesOrNone(deck.discardPile)}`
		},
		test(thing) {
			return thing && thing instanceof Deck
		}
	})

	let deck: Deck

	beforeEach(() => {
		deck = new Deck(CARDS_FIXTURE, HAND_LIMIT)
	})

	it<CtxWithDeck>('#draw() draws when draw pile larger than draw count', () => {
		expect(deck).toMatchInlineSnapshot(`Draw: A,B,C,D,E,F,G Hand: None Discard: None`)

		deck.draw(3)
		expect(deck.drawPile.length).toBe(CARD_REGISTRY_FIXTURE.size - 3)
		expect(deck.hand.length).toBe(3)
		expect(deck).toMatchInlineSnapshot(`Draw: A,B,C,D Hand: G,F,E Discard: None`)
	})

	it<CtxWithDeck>('#discard() works', () => {
		const drawCount = 4
		const discardCount = 3

		deck.draw(drawCount)

		for (let i = 0; i < discardCount; i++) {
			deck.discardAt(0)
		}

		expect(deck.discardPile.length).toBe(discardCount)
		expect(deck).toMatchInlineSnapshot(`Draw: A,B,C Hand: D Discard: G,F,E`)
	})

	it<CtxWithDeck>('#draw() shuffles discard pile into draw pile when drawCount bigger than draw pile size', () => {
		const cardMoveCount = 5
		deck.draw(cardMoveCount)

		for (let i = 0; i < cardMoveCount; i++) {
			deck.discardAt(0)
		}

		expect(deck).toMatchInlineSnapshot(`Draw: A,B Hand: None Discard: G,F,E,D,C`)

		expect(deck.drawPile.length).toBe(2)

		const drawCount = 5
		deck.draw(drawCount)

		expect(deck.drawPile.length).toBe(2)
		expect(deck.hand.length).toBe(drawCount)
		expect(deck.discardPile.length).toBe(0)
	})

	it<CtxWithDeck>(`#draw() discards cards drawn over hand limit: ${HAND_LIMIT}`, () => {
		const drawCount = 6
		deck.draw(drawCount)

		expect(deck).toMatchInlineSnapshot('Draw: A Hand: G,F,E,D,C Discard: B')
	})
})
