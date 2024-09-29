<script setup lang="ts">
import { onMounted, ref, type ComponentInstance } from 'vue'
import StatusIcon from './StatusIcon.vue'
import BaseCard from './BaseCard.vue'
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import type { Target } from '@/model/character';
import { assert } from '@/model/assert'
import { getEnemyData } from '@/helpers/dragDataAssert'

defineProps<{ selected: boolean, enemy: Target }>()

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
        <StatusIcon
          :stat="'health'"
          :value="enemy.health"
        ></StatusIcon>
        <StatusIcon
          v-for="[kind, amount] of enemy.statuses.entries()"
          :key="kind"
          :stat="kind"
          :value="amount"
        >
        </StatusIcon>
      </div>
    </template>
  </BaseCard>
</template>
