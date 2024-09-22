import { describe, expect, it } from 'vitest'
import { GameRound, RoundState } from './round'
import { Player, Target } from './character'
import type { Card } from './card'
import { cards } from './cards.json'

function createRoundFixture() {
	const [strike] = cards

	return new GameRound(
		new Player('Test Player'),
		new Map([['test1', new Target('Test Enemy')]]),
		[strike, strike, strike, strike, strike, strike] as Array<Card>
	)
}

describe.sequential('Game', () => {
	const round = createRoundFixture()

	it('creates game', () => {
		expect(round.player).toBeDefined()
		expect(round.enemies).toBeDefined()
		expect(round.deck).toBeDefined()
		expect(round.deck.drawPile.length).toBe(6)
		expect(round.roundState).toBe(RoundState.Initial)
	})

	it('#turnStart() works', () => {
		round.turnStart()
		expect(round.deck.hand.length).toBeGreaterThan(0)
		expect(round.roundState).toBe(RoundState.Player)
	})

	it('#turnEnd() works', () => {
		round.turnEnd()

		expect(round.deck.hand.length).toBe(0)
		expect(round.roundState).toBe(RoundState.Enemy)
	})

	it('#enemyTurn() damages player', () => {
		console.log('before', round.player.health)
		round.enemyTurn()
		console.log('after', round.player.health)

		const enemyDamage = 5

		const { health: playerHealth, maxHealth: playerInitialHealth } = round.player

		expect(playerHealth).toBeLessThan(playerInitialHealth)
		expect(playerHealth).toBe(playerInitialHealth - enemyDamage)
	})

	it('killing every enemy wins the round', () => {
		round.turnStart()
		round.tryPlayFromHand(0)
		round.tryPlayFromHand(0)

		expect(round.enemies.size).toBe(0)
		expect(round.roundState).toBe(RoundState.Won)
	})

	it('character dying loses the round', () => {
		round.enemyTurn()

		expect(round.player.health).toBeLessThanOrEqual(0)
		expect(round.roundState).toBe(RoundState.Lost)
	})
})
