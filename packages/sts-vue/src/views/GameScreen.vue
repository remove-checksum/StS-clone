<script setup lang="ts">
import DebugToggle from '@/components/DebugToggle.vue'
import { onMounted } from 'vue'
import { useRoundStore } from '@/stores/round'
import PlayerCard from '@/components/PlayerCard.vue'
import EnemyCard from '@/components/EnemyCard.vue'
import CardPanel from '@/components/CardPanel.vue'

const roundStore = useRoundStore()

onMounted(() => roundStore.startRound())
</script>

<template>
	<main class="flex min-h-screen flex-col">
		<header class="flex h-[12wh] justify-between">
			<div
				id="cog"
				class="hover:animate-wiggle h-12 w-12 bg-zinc-200"
			></div>
			<h2 class="flex flex-row justify-around gap-4 text-2xl">
				<span class="align-middle">StS Game</span>
				<DebugToggle></DebugToggle>
			</h2>
			<div
				id="hamburger"
				class="h-12 w-12 bg-zinc-200 duration-200 hover:rotate-90"
			></div>
		</header>
		<div class="grid grow grid-flow-row grid-cols-2 bg-zinc-400">
			<div class="p-20 grid place-items-center">
				<PlayerCard :player="roundStore.player" />
			</div>
			<div
				ref="cardPlayDropZone"
				class="m-20 flex flex-col gap-8 bg-teal-400"
			>
				<h3 class="mt-auto text-center text-2xl">Enemies</h3>
				<div class="flex justify-center gap-2 p-4">
					<EnemyCard
						v-for="[key, enemy] of roundStore.enemies.entries()"
						:key="key"
						:enemy="enemy"
						:selected="roundStore.selectedEnemyKey === key"
						class="transition-transform hover:-translate-y-2 hover:cursor-pointer hover:shadow-2xl hover:shadow-cyan-600"
						@click="roundStore.selectEnemy(key)"
					/>
				</div>
			</div>
		</div>
		<CardPanel />
	</main>
	<div
		data-overlay-teleport
		class="pointer-events-none fixed left-0 top-0 h-full w-full"
	></div>
</template>
