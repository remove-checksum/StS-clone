import type { DeckEntry } from '@/model/deck'
import type { Input } from '@atlaskit/pragmatic-drag-and-drop/types'

const __CARD_SYMBOL = Symbol('Card')

type CardData = {
	[__CARD_SYMBOL]: true
	previousInput: Input
	deckKey: DeckEntry['deckId']
}

export function getCardData(data: Omit<CardData, typeof __CARD_SYMBOL>) {
	return {
		[__CARD_SYMBOL]: true,
		...data
	}
}

export function isCardData(data: Record<string | symbol, unknown>): data is CardData {
	return Boolean(data[__CARD_SYMBOL])
}

const __ENEMY_SYMBOL = Symbol('Enemy')

type EnemyData = {
	[__ENEMY_SYMBOL]: true
}

export function getEnemyData() {
	return { [__ENEMY_SYMBOL]: true }
}

export function isEnemyData(data: Record<string | symbol, unknown>): data is EnemyData {
	return Boolean(data[__ENEMY_SYMBOL])
}
