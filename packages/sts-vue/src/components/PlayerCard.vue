<script setup lang="ts">
import StatusIcon from './StatusIcon.vue'
import type { Player } from '@/model/character'
import BaseCard from './BaseCard.vue'

defineProps<{
	player: Player
}>()
</script>

<template>
	<BaseCard>
		<template #header>
			<h4 class="text-xl">{{ player.name }}</h4>
		</template>
		<template #content>

			<div class="flex items-start">
				<StatusIcon
					:stat="'health'"
					:value="player.health"
				></StatusIcon>
				<StatusIcon
					v-for="[kind, amount] of player.statuses.entries()"
					:key="kind"
					:stat="kind"
					:value="amount"
				>
				</StatusIcon>
			</div>
		</template>
	</BaseCard>
</template>
