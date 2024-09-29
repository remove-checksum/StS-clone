import * as v from 'valibot'
import { cards } from '@/model/cards.json'
import type { GenericSchema } from 'valibot'

export type WithId = {
	readonly id: number
}

export const DamageEffect = {
	Damage: 'damage',
	Pierce: 'pierce'
} as const
export const CardEffect = {
	SelfDamage: 'selfDamage',
	Block: 'block',
	Draw: 'draw',
	...DamageEffect
} as const
export type DamageEffect = (typeof DamageEffect)[keyof typeof DamageEffect]
export type CardEffect = (typeof CardEffect)[keyof typeof CardEffect]
type CardEffectEntry = { kind: CardEffect; amount: number }

/*
	TODO: Card type (spell / attack / permanent)
				Card targets (single / multi)
*/
export type Card = WithId & {
	readonly name: string
	readonly description: string
	readonly cost: number
	readonly effect: Array<CardEffectEntry>
}

export const cardRegistry = initCardRegistry(cards)

export function initCardRegistry(cards: Array<unknown>) {
	const result = validateCards(cards)
	return new Map<number, Card>(result.map((card) => [card.id, card]))
}

export function validateCards(cards: Array<unknown>) {
	const positiveInt = () => v.pipe(v.number(), v.integer(), v.minValue(0))

	const cardEffectSchema = v.array(
		v.object({
			kind: v.union(Object.values(CardEffect).map((value) => v.literal(value))),
			amount: positiveInt()
		})
	)

	const cardSchema: GenericSchema<Card> = v.object({
		id: positiveInt(),
		name: v.pipe(v.string(), v.nonEmpty()),
		description: v.pipe(v.string(), v.nonEmpty()),
		cost: positiveInt(),
		effect: cardEffectSchema
	})

	const cardsSchema = v.array(cardSchema)

	return v.parse(cardsSchema, cards)
}
