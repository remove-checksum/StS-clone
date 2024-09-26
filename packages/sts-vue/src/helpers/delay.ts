export async function delay(ms: number) {
	return await new Promise((res) => setTimeout(res, ms))
}
