import type { Card } from '@/model/card'

export const HAND_LIMIT = 10

export class Deck<T extends Card = Card> {
	public cards: Map<number, T>
	private _drawPile: Array<number>
	private _hand: Array<number> = []
	private _discardPile: Array<number> = []

	get drawPile() {
		return this._drawPile.slice()
	}

	get hand() {
		return this._hand.slice()
	}

	get discardPile() {
		return this._discardPile.slice()
	}

	constructor(
		cards: Array<T>,
		public handLimit = HAND_LIMIT
	) {
		this._drawPile = cards.map((card) => card.id)
		this.cards = new Map(cards.map((card) => [card.id, card]))
	}

	cardById(id: number) {
		return this.cards.get(id)!
	}

	cardInHandAt(index: number) {
		if (index > this._hand.length || index < 0) return undefined
		const id = this._hand[index]
		return this.cardById(id)!
	}

	drawOne() {
		if (this._drawPile.length > 0) {
			if (this._hand.length < this.handLimit) {
				this._hand.push(this._drawPile.pop()!)
			} else {
				this._discardPile.push(this._drawPile.pop()!)
			}
		} else if (this._discardPile.length > 0) {
			this._drawPile = FYshuffle(this._discardPile)
			this._discardPile = []
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

		const result = this.hand
		const [removed] = result.splice(from, 1)
		result.splice(to, 0, removed)

		this._hand = result
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
		const idToDiscard = this._hand[position]
		this._hand.splice(position, 1)
		this._discardPile.push(idToDiscard)
	}

	/**
	 * Discard card by its id
	 * @param id
	 */
	discard(id: number) {
		const index = this._hand.findIndex((hid) => id === hid)
		if (index >= 0) {
			this.discardAt(index)
		}
	}

	toString() {
		const drawPileString =
			this._drawPile.length > 0 ? this._drawPile.map((id) => this.cardById(id)?.name) : 'None'
		const handString =
			this._hand.length > 0 ? this._hand.map((id) => this.cardById(id)?.name) : 'None'
		const discardPileString =
			this._discardPile.length > 0 ? this._discardPile.map((id) => this.cardById(id)?.name) : 'None'

		return `Draw: ${drawPileString} Hand: ${handString} Discard: ${discardPileString}`
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
