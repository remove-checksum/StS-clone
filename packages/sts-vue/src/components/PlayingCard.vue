<template>
	<div
		ref="cardRef"
		:class="[
			'aspect-[0.72/1] min-h-28 min-w-20 select-none overflow-hidden border-2 border-black lg:min-h-[12.5rem] lg:min-w-36',
			$props.selected ? 'bg-green-600' : 'bg-sky-500'
		]"
		:style="$attrs.style as string"
	>
		<div>
			<div class="mb-auto flex flex-row justify-start gap-2">
				<p :class="['h-8 w-8 bg-slate-400 pl-2 tabular-nums', $style.cardBadgeClip]">
					{{ card.cost }}
				</p>
				<h2 class="inline-block">{{ card.name }} ID:{{ card.id }}</h2>
			</div>
			<p @mouseenter="descriptionHovered = true" @mouseleave="descriptionHovered = false">
				{{ card.description }}
			</p>
			<p
				v-if="descriptionHovered"
				class="absolute -top-12 rounded-sm border-2 border-black bg-slate-300 px-4 py-1"
			>
				Description!
			</p>
		</div>
	</div>
</template>

<script setup lang="ts">
import type { Card } from '@/model/card'
import { ref } from 'vue'

const cardRef = ref<HTMLElement | null>(null)

defineProps<{
	card: Card
	selected: boolean
}>()

defineExpose({
	cardRef
})

const descriptionHovered = ref(false)
</script>

<style lang="css" module>
.cardBadgeClip {
	clip-path: polygon(0 0, 100% 0, 100% 60%, 60% 100%, 0 100%, 0 40%);
}
.cardAspectRation {
}
</style>
