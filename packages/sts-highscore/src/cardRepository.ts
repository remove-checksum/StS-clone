import { db } from "./db/init";
import { NewCard } from "./db/schema/card";

export async function findCardById(id: number) {
	return await db
		.selectFrom("card")
		.where("card.id", "=", id)
		.selectAll()
		.executeTakeFirst();
}

export async function createCard(card: NewCard) {
	return await db.insertInto("card").values(card).returningAll().execute();
}
