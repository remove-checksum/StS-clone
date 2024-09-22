<script setup lang="ts">
import type { FunctionalComponent } from 'vue'
import Heart from '~icons/ph/heart-straight-fill'
import Shield from '~icons/ph/shield-fill'
import HalfDrop from '~icons/pixelarticons/drop-half'
import StatusIcon from './StatusIcon.vue'
import type { Target, TargetStatus } from '@/model/character';

defineProps<{ selected: boolean, enemy: Target }>()
const iconSizing = 'h-8 w-8 text-blue-400 md:h-12 md:w-12'
const iconStatusMap: Record<TargetStatus, [FunctionalComponent, string]> = {
	bleed: [HalfDrop, 'text-red-600'],
	block: [Shield, 'text-stone-600']
}
</script>

<template>
  <div :class="[selected && 'bg-green-500']">
    <h4 class="text-xl">{{ enemy.name }}</h4>
    <div class="flex items-start">
      <StatusIcon :stat="enemy.health">
        <Heart
          class="text-pink-800"
          :class="iconSizing"
          :inline="true"
        />
      </StatusIcon>
      <StatusIcon
        v-for="[kind, amount] of enemy.statuses.entries()"
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
