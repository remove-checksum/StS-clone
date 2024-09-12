import type { Character } from '@/model/character'
import type { Card, CardEffectKind } from '@/model/card'
import { Deck } from '@/model/deck'

export const Defaults = {
	Draw: 4,
	Health: 10,
	Resource: 3
}
export class GameRound<T extends string> {
	public turn: 'player' | 'enemy' = 'player'
	public nextEnemyAt: number

	public selectedEnemyKey: T
	constructor(
		public player: Character,
		public enemies: Map<T, Character>,
		public cards: Array<Card>,
		public deck = new Deck(cards)
	) {
		this.selectedEnemyKey = Array.from(enemies.keys()).at(0)!
		this.nextEnemyAt = 0
	}

	/**
	 * Try playing card from hand
	 * @param position Position of played card
	 * @returns was played succesfully
	 */
	tryPlayFromHand(position: number) {
		const cardId = this.deck.hand.at(position)

		if (!cardId) {
			console.error(`No card in hand at position ${position}`)
			return false
		}

		const card = this.deck.cards.get(cardId)

		if (!card) {
			console.error(`No card in deck with id ${cardId}`)
			return false
		}

		if (card.cost > this.player.resource) {
			console.error(`Not enough resource: have ${this.player.resource}, card costs ${card.cost}`)
			return false
		}

		// Must discard first (draw alters position)
		this.deck.discardAt(position)
		this.player.resource -= card.cost

		for (const eff of card.effect) {
			console.log(eff)
			this.applyCardEffect(eff.kind, eff.amount)
		}

		return true
	}

	turnStart() {
		this.deck.draw(Defaults.Draw)
		this.turn = 'enemy'
	}

	turnEnd() {
		while (this.deck.hand.length > 0) {
			this.deck.discardAt(this.deck.hand.length - 1)
		}

		this.turn = 'player'
		this.nextEnemyAt = (this.nextEnemyAt + 1) % this.enemies.size
	}

	enemyTurn() {
		this.player.takeShieldedDamage(5)
	}

	private applyCardEffect(kind: CardEffectKind, amount: number) {
		const selectedEnemy = this.enemies.get(this.selectedEnemyKey)!

		switch (kind) {
			case 'damage': {
				selectedEnemy.takeShieldedDamage(amount)
				break
			}
			case 'pierce': {
				selectedEnemy.health -= amount
				break
			}
			case 'selfDamage': {
				this.player.takeShieldedDamage(amount)
				break
			}
			case 'draw': {
				this.deck.draw(amount)
				break
			}
			case 'block': {
				const shield = this.player.statuses.get('block') ?? 0

				this.player.setStatus('block', amount + shield)
				break
			}
			default:
				throw new Error(`Card effect ${kind} not implemented`)
		}
	}

	selectEnemy(key: T) {
		if (this.enemies.has(key)) {
			this.selectedEnemyKey = key
		}
	}
}
