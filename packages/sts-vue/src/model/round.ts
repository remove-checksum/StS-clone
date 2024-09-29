import { Player, Target, TargetStatus } from '@/model/character'
import { CardEffect, DamageEffect, type Card, type WithId } from '@/model/card'
import { Deck } from '@/model/deck'

export const Defaults = {
	Draw: 4,
	Health: 10,
	Resource: 3
}
export const RoundState = {
	Initial: 'Initial',
	Player: 'Player',
	Enemy: 'Enemy',
	Lost: 'Lost',
	Won: 'Won'
} as const
export type RoundState = (typeof RoundState)[keyof typeof RoundState]

export class GameRound<T extends string> {
	public roundState: RoundState = RoundState.Initial
	public nextEnemyAt: number
	public deck: Deck

	public selectedEnemyKey: T
	constructor(
		public player: Player,
		public enemies: Map<T, Target>,
		public deckInitializers: Array<WithId>,
		public cardRegistry: Map<number, Card>
	) {
		this.selectedEnemyKey = Array.from(enemies.keys()).at(0)!
		this.nextEnemyAt = 0

		this.deck = new Deck(deckInitializers)
	}

	/**
	 * Try playing card from hand
	 * @param position Position of played card
	 * @returns was played succesfully
	 */
	tryPlayFromHand(position: number) {
		const cardId = this.deck.idInHandAt(position)

		if (!cardId) {
			console.error(`No card in hand at position ${position}`)
			return false
		}

		const card = this.cardRegistry.get(cardId)

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
			this.applyCardEffect(eff.kind, eff.amount)
		}

		if (this.enemies.size === 0) {
			this.roundState = RoundState.Won
		}
		return true
	}

	turnStart() {
		this.deck.draw(Defaults.Draw)
		this.roundState = RoundState.Player
	}

	turnEnd() {
		while (this.deck.hand.length > 0) {
			this.deck.discardAt(this.deck.hand.length - 1)
		}

		this.nextEnemyAt = (this.nextEnemyAt + 1) % this.enemies.size
		this.roundState = RoundState.Enemy
	}

	enemyTurn() {
		this.player.takeDamage(DamageEffect.Damage, 5)

		if (!this.player.isAlive) {
			this.roundState = RoundState.Lost
		}
	}

	private applyCardEffect(kind: CardEffect, amount: number) {
		const selectedEnemy = this.enemies.get(this.selectedEnemyKey)!

		switch (kind) {
			case CardEffect.Damage: {
				selectedEnemy.takeDamage(kind, amount)
				break
			}
			case CardEffect.Pierce: {
				selectedEnemy.takeDamage(kind, amount)
				break
			}
			case CardEffect.SelfDamage: {
				this.player.takeDamage(DamageEffect.Damage, amount)
				break
			}
			case CardEffect.Draw: {
				this.deck.draw(amount)
				break
			}
			case CardEffect.Block: {
				const block = this.player.statuses.get(TargetStatus.Block) ?? 0

				this.player.statuses.set(TargetStatus.Block, block + amount)
				break
			}
			default:
				throw new Error(`Card effect ${kind} not implemented`)
		}

		if (!selectedEnemy.isAlive) {
			this.enemies.delete(this.selectedEnemyKey)
			this.selectedEnemyKey = Array.from(this.enemies.keys())[0]
		}
	}

	selectEnemy(key: T) {
		if (this.enemies.has(key)) {
			this.selectedEnemyKey = key
		}
	}
}
