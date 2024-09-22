import { DamageEffect } from './card'
import { Defaults } from './round'

export const TargetStatus = {
	Block: 'block',
	Bleed: 'bleed'
} as const
export type TargetStatus = (typeof TargetStatus)[keyof typeof TargetStatus]
type StatusUpdate = Partial<Record<TargetStatus, number>>
type StatusEntry = readonly [TargetStatus, number]

export class Target {
	public statuses: Map<TargetStatus, number>
	constructor(
		public name: string,
		public maxHealth = Defaults.Health,
		public health = maxHealth,
		initialStatuses: StatusUpdate = {}
	) {
		this.statuses = new Map(Object.entries(initialStatuses) as Array<StatusEntry>)
	}

	get isAlive() {
		return this.health > 0
	}

	takeDamage(kind: DamageEffect, amount: number) {
		if (amount <= 0) return

		switch (kind) {
			case DamageEffect.Pierce: {
				this.health -= amount
				break
			}
			case DamageEffect.Damage: {
				const block = this.statuses.get(TargetStatus.Block) ?? 0

				if (amount > block) {
					this.health -= amount - block
					this.statuses.delete(TargetStatus.Block)
				} else {
					this.statuses.set(TargetStatus.Block, block - amount)
				}
				break
			}
			default:
				throw new Error(`Unknown damage kind: ${kind}`)
		}
	}
}

export class Player extends Target {
	constructor(
		public name: string,
		public maxHealth = Defaults.Health,
		public health = maxHealth,
		public maxResource: number = Defaults.Resource,
		public resource: number = maxResource,
		initialStatuses: StatusUpdate = {}
	) {
		super(name, maxHealth, health, initialStatuses)
	}
}
