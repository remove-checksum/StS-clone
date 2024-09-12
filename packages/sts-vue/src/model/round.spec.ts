import { describe } from 'vitest'
import { GameRound } from './round'
import { Character } from './character'
import type { Card } from './card'
import { cards } from './cards.json'

function createGameFixture() {
	return new GameRound(
		new Character('Test Player'),
		new Map([['test1', new Character('Test NPC')]]),
		[cards[1], cards[1], cards[4], cards[4], cards[7], cards[7]] as Array<Card>
	)
}

describe('Game', () => {
	const game = createGameFixture()
})
