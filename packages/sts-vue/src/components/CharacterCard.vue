<template>
	<div :class="[, $props.selected && 'bg-green-500']">
		<h4 class="text-xl">{{ target.name }}</h4>
		<div class="flex items-start">
			<StatusIcon :stat="target.resource">
				<Circle
					class="text-blue-400"
					:class="iconSizing"
					:inline="true"
				/>
			</StatusIcon>
			<StatusIcon :stat="target.health">
				<Heart
					class="text-pink-800"
					:class="iconSizing"
					:inline="true"
				/>
			</StatusIcon>
			<StatusIcon
				v-for="[kind, amount] of target.statuses.entries()"
				:key="kind"
				:stat="amount"
			>
				<component
					:is="iconStatusMap[kind][0]"
					:class="[iconStatusMap[kind][1], iconSizing]"
				/>
			</StatusIcon>
		</div>
		<hr class="border-b-2 border-gray-700" />
	</div>
</template>

<script setup lang="ts">
import Heart from '~icons/ph/heart-straight-fill'
import Shield from '~icons/ph/shield-fill'
import HalfDrop from '~icons/pixelarticons/drop-half'
import Circle from '~icons/ph/circle-fill'
import StatusIcon from './StatusIcon.vue'
import type { Character, CharacterStatusKind } from '@/model/character'
import { type FunctionalComponent } from 'vue'

defineProps<{
	target: Character
	selected: boolean
}>()

const iconSizing = 'h-8 w-8 text-blue-400 md:h-12 md:w-12'
const iconStatusMap: Record<CharacterStatusKind, [FunctionalComponent, string]> = {
	bleed: [HalfDrop, 'text-red-600'],
	block: [Shield, 'text-stone-600']
}
</script>
