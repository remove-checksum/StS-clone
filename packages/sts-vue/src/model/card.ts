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

export async function validateCards() {
	type GenericSchema<T> = import('valibot').GenericSchema<T>
	const v = await import('valibot')

	const positiveInt = () => v.pipe(v.number(), v.integer(), v.minValue(0))

	const cardEffectSchema = v.array(
		v.object({
			kind: v.union(Object.keys(CardEffect).map((key) => v.literal(key as CardEffect))),
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

	return v.parse(v.array(cardSchema), (await import('./cards.json')).cards)
}
