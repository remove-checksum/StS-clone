import type { ColumnType, Generated, Insertable, Selectable } from "kysely";

const CardKind = {
	Attack: "Attack",
	Skill: "Skill",
	Power: "Power",
} as const;

type CardKind = keyof typeof CardKind

export interface Card {
	readonly name: string;
	readonly description: string;
	readonly cost: number;
	readonly kind: CardKind;
}

export type CardTable = {
	id: Generated<number>;
} & {
	[Key in keyof Card]: ColumnType<Card[Key], Card, never>;
};

export type CardQuery = Selectable<CardTable>
export type NewCard = Insertable<CardTable>