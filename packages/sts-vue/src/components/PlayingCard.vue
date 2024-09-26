<script setup lang="ts">
import type { Card } from '@/model/card'
import { ref } from 'vue'

const cardRef = ref<HTMLElement | null>(null)

defineProps<{
	card: Card
	selected: boolean
}>()

defineExpose({ cardRef })

const descriptionHovered = ref(false)
</script>

<template>
	<div
		ref="cardRef"
		:class="[
			'relative aspect-[0.72/1] h-28 w-20 select-none border-2 border-black bg-sky-500 lg:h-[12.5rem] lg:w-36',
			$props.selected && 'ring-4 ring-inset ring-pink-300'
		]"
		:style="$attrs.style as string"
	>
		<div class="flex h-full flex-col">
			<div class="bg-emerald-500">
				<p
					class="mr-2 inline-block h-8 w-8 bg-slate-400 pl-2 tabular-nums"
					:class="$style.cardBadgeClip"
				>
					{{ card.cost }}
				</p>
				<h2 class="inline w-full">{{ card.name }}</h2>
			</div>
			<p
				@pointerenter="descriptionHovered = true"
				@pointerleave="descriptionHovered = false"
			>
				{{ card.description }}
			</p>
			<p
				v-if="descriptionHovered"
				class="absolute -top-12 rounded-sm border-2 border-black bg-slate-300 px-4 py-1"
			>
				Description!
			</p>
			<p class="mt-auto h-8 w-8 bg-slate-400 pl-2">ID:{{ card.id }}</p>
		</div>
	</div>
</template>

<style lang="css" module>
.cardBadgeClip {
	clip-path: polygon(0 0, 100% 0, 100% 60%, 60% 100%, 0 100%, 0 40%);
}
</style>
