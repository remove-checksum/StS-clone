import { Defaults } from './round'

export const CHARACTER_STATUS_KIND = ['block', 'bleed'] as const
export type CharacterStatusKind = (typeof CHARACTER_STATUS_KIND)[number]
type StatusUpdate = Partial<Record<CharacterStatusKind, number>>

export class Character {
	public statuses: Map<CharacterStatusKind, number>
	public health: number

	constructor(
		public name: string,
		public resource: number = Defaults.Resource,
		public initialHealth: number = Defaults.Health,
		initialStatuses: StatusUpdate = {}
	) {
		this.health = initialHealth
		this.statuses = new Map(Object.entries(initialStatuses) as any)
	}

	get isAlive() {
		return this.health > 0
	}

	takeShieldedDamage(amount: number) {
		const shield = this.statuses.get('block')

		if (shield && shield > 0) {
			if (amount > shield) {
				this.health -= amount - shield
				this.statuses.delete('block')
			} else {
				this.statuses.set('block', shield - amount)
			}
		} else {
			this.health -= amount
		}
	}

	setStatus(kind: CharacterStatusKind, value: number) {
		if (value <= 0) {
			this.statuses.delete(kind)
		} else {
			this.statuses.set(kind, value)
		}
	}
}
