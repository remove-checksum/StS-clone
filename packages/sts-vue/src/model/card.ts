export type WithId = {
	readonly id: number
}

const CARD_EFFECT_KIND = ['damage', 'selfDamage', 'pierce', 'block', 'draw'] as const
export type CardEffectKind = (typeof CARD_EFFECT_KIND)[number]

type CardEffectEntry = { kind: CardEffectKind; amount: number }

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
			kind: v.union(CARD_EFFECT_KIND.map((l) => v.literal(l))),
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
