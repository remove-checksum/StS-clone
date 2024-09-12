import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";
import { Database } from "./schema/database";

const dialect = new PostgresDialect({
	pool: new Pool({
		database: "test",
	}),
});

export const db = new Kysely<Database>({ dialect });
