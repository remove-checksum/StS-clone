import type { Card } from '@/model/card'

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

	constructor(cards: Array<T>) {
		this._drawPile = cards.map((card) => card.id)
		this.cards = new Map(cards.map((card) => [card.id, card]))
	}

	cardById(id: number) {
		return this.cards.get(id)
	}

	cardInHandAt(index: number) {
		if (index > this._hand.length || index < 0) return undefined
		const id = this._hand[index]
		return this.cardById(id)!
	}

	/**
	 * Draw from draw pile
	 * @param count number of cards to draw
	 */
	draw(count: number) {
		if (count <= 0) return

		if (this._drawPile.length > count) {
			for (let i = 0; i < count; i++) {
				const id = this._drawPile.pop()!
				this._hand.push(id)
			}
		} else {
			const shuffledDraw = FYshuffle(this._discardPile).concat(this._drawPile)

			let cardsDrawn = count
			while (shuffledDraw.length > 0 && cardsDrawn > 0) {
				const id = shuffledDraw.pop()!
				this._hand.push(id)
				cardsDrawn--
			}

			this._discardPile = []
			this._drawPile = shuffledDraw.slice()
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
