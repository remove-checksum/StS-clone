<script setup lang="ts">
import { onMounted, ref, type ComponentInstance, type FunctionalComponent } from 'vue'
import Heart from '~icons/ph/heart-straight-fill'
import Shield from '~icons/ph/shield-fill'
import HalfDrop from '~icons/pixelarticons/drop-half'
import StatusIcon from './StatusIcon.vue'
import BaseCard from './BaseCard.vue'
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import type { Target, TargetStatus } from '@/model/character';
import { assert } from '@/model/assert'
import { getEnemyData } from '@/helpers/dragDataAssert'

defineProps<{ selected: boolean, enemy: Target }>()
const iconSizing = 'h-8 w-8 text-blue-400 md:h-12 md:w-12'
const iconStatusMap: Record<TargetStatus, { icon: FunctionalComponent, class: string }> = {
  bleed: { icon: HalfDrop, class: 'text-red-600' },
  block: { icon: Shield, class: 'text-stone-600' }
}

const enemyCardElement = ref<ComponentInstance<typeof BaseCard> | null>(null)

onMounted(() => {
  const element = enemyCardElement.value?.element
  assert(element instanceof HTMLElement)

  dropTargetForElements({
    element,
    getData: () => getEnemyData()
  })

})
</script>

<template>
  <BaseCard
    ref="enemyCardElement"
    :class="selected && 'bg-green-500'"
  >
    <template #header>
      {{ enemy.name }}
    </template>
    <template #content>
      <div class="flex">
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
            :is="iconStatusMap[kind].icon"
            :class="[iconStatusMap[kind].class, iconSizing]"
          />
        </StatusIcon>
      </div>
    </template>
  </BaseCard>
</template>
