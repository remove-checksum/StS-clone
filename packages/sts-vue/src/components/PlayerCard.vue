<script setup lang="ts">
import Heart from '~icons/ph/heart-straight-fill'
import Shield from '~icons/ph/shield-fill'
import HalfDrop from '~icons/pixelarticons/drop-half'
import StatusIcon from './StatusIcon.vue'
import type { Player, TargetStatus } from '@/model/character'
import { type FunctionalComponent } from 'vue'
import BaseCard from './BaseCard.vue'

defineProps<{
	player: Player
}>()

const iconSizing = 'h-8 w-8 text-blue-400 md:h-12 md:w-12'
const iconStatusMap: Record<TargetStatus, [FunctionalComponent, string]> = {
	bleed: [HalfDrop, 'text-red-600'],
	block: [Shield, 'text-stone-600']
}
</script>

<template>
	<BaseCard>
		<template #header>
			<h4 class="text-xl">{{ player.name }}</h4>
		</template>
		<template #content>

			<div class="flex items-start">
				<StatusIcon :stat="player.health">
					<Heart
						class="text-pink-800"
						:class="iconSizing"
						:inline="true"
					/>
				</StatusIcon>
				<StatusIcon
					v-for="[kind, amount] of player.statuses.entries()"
					:key="kind"
					:stat="amount"
				>
					<component
						:is="iconStatusMap[kind][0]"
						:class="[iconStatusMap[kind][1], iconSizing]"
					/>
				</StatusIcon>
			</div>
		</template>
	</BaseCard>
</template>
