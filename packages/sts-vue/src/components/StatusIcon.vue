<script setup lang="ts">
import { computed, ref, watch, type FunctionalComponent } from 'vue'
import { type DisplayTargetStat } from '@/model/character';
// @ts-ignore
import Heart from '~icons/ph/heart-straight-fill'
// @ts-ignore
import Shield from '~icons/ph/shield-fill'
// @ts-ignore
import HalfDrop from '~icons/pixelarticons/drop-half'
// @ts-ignore
import Circle from '~icons/ph/circle-fill'
import anime from 'animejs';
import { assert } from '@/model/assert';

const props = defineProps<{ value: number | string, stat: DisplayTargetStat }>()
const wrapperRef = ref<HTMLElement | null>(null)

const iconStatusMap: Record<DisplayTargetStat, { component: FunctionalComponent, class: string }> = {
	bleed: { component: HalfDrop, class: 'text-red-600' },
	block: { component: Shield, class: 'text-stone-600' },
	health: { component: Heart, class: 'text-pink-800' },
	resource: { component: Circle, class: 'text-blue-400' }
}

const icon = computed(() => iconStatusMap[props.stat])

// TODO: stagger animations in order
watch(() => props.value, (current, old) => {
	if (current !== old) {
		assert(wrapperRef.value instanceof HTMLDivElement)

		anime({
			targets: wrapperRef.value,
			translateY: -15,
			easing: 'easeInQuad',
			duration: 200,
			direction: 'alternate'
		})
	}
})


</script>

<template>
	<div
		ref="wrapperRef"
		class="grid place-items-center *:col-start-1 *:row-start-1 *:col-end-1 *:row-end-1"
	>
		<component
			:is="icon.component"
			:class="[icon.class, 'h-8 w-8 text-blue-400 md:h-12 md:w-12', $attrs.class]"
		></component>
		<span class="tabular-nums">{{ value.toString() }}</span>
	</div>
</template>
