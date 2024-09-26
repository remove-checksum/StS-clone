import type { WithId, WithHandId } from '@/model/card'

export const HAND_LIMIT = 10

export type DeckEntryInitializer = WithHandId & WithId
export type DeckEntry = [DeckEntryInitializer['handId'], DeckEntryInitializer['id']]

export class Deck<
	T extends DeckEntryInitializer = DeckEntryInitializer,
	HandId = T['handId'],
	CardID = T['id'],
	CardEntry = [HandId, CardID]
> {
	drawPile: Array<CardEntry>
	hand: Array<CardEntry>
	discardPile: Array<CardEntry>

	constructor(
		cards: Array<T>,
		public handLimit = HAND_LIMIT
	) {
		this.drawPile = cards.map(({ handId, id }) => [handId, id] as CardEntry)
		this.hand = []
		this.discardPile = []
	}

	idInHandAt(index: number) {
		return (this.hand[index] as any)[1] as CardID
	}

	drawOne() {
		if (this.drawPile.length > 0) {
			if (this.hand.length < this.handLimit) {
				this.hand.push(this.drawPile.pop()!)
			} else {
				this.discardPile.push(this.drawPile.pop()!)
			}
		} else if (this.discardPile.length > 0) {
			this.drawPile = FYshuffle(this.discardPile)
			this.discardPile = []
			this.drawOne()
		}
	}

	/**
	 * Reorder cards in hand
	 * @param from start index
	 * @param to end index
	 */
	reorder(from: number, to: number) {
		if (from === -1 || to === -1) return

		const result = this.hand.slice()
		const [removed] = result.splice(from, 1)
		result.splice(to, 0, removed)

		this.hand = result
	}

	/**
	 * Draw from draw pile
	 * @param count number of cards to draw
	 */
	draw(count: number) {
		if (count <= 0) return

		for (let i = 0; i < count; i++) {
			this.drawOne()
		}
	}

	/**
	 * Discard card by its index in hand
	 * @param position index of card in hand
	 */
	discardAt(position: number) {
		if (position < 0) return
		const idToDiscard = this.hand[position]
		this.hand.splice(position, 1)
		this.discardPile.push(idToDiscard)
	}

	/**
	 * Discard card by its id
	 * @param id
	 */
	discard(id: number) {
		// TODO: Cannot index CardTuple
		const index = this.hand.findIndex((entry) => id === (entry as any)[1])
		if (index >= 0) {
			this.discardAt(index)
		}
	}
}

function FYshuffle<T extends unknown>(array: T[]) {
	const arrayCopy = array.slice()
	let tail = arrayCopy.length
	while (tail !== 0) {
		const randomIndex = Math.floor(Math.random() * tail)
		tail--

		const here = arrayCopy[tail]
		const there = arrayCopy[randomIndex]

		arrayCopy[randomIndex] = here
		arrayCopy[tail] = there
	}
	return arrayCopy
}
