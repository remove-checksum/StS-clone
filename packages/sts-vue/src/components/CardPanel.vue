<script setup lang="ts">
import { computed } from 'vue'
import StatusIcon from './StatusIcon.vue'
import BaseButton from './BaseButton.vue'
import Circle from '~icons/ph/circle-fill'
import CardHand from './CardHand.vue'
import { useRoundStore } from '@/stores/round'
import PileOverviewPanel from './PileOverviewPanel.vue'

const roundStore = useRoundStore()

const playerStatString = computed(
  () => `${roundStore.player.resource}\\${roundStore.player.maxResource}`
)

</script>

<template>
  <div class="grid min-h-24 grid-cols-12 justify-items-center lg:min-h-56">
    <div class="col-span-2 flex flex-col justify-between px-4 py-4">
      <StatusIcon
        :stat="playerStatString"
        class="self-end md:text-2xl"
      >
        <Circle class="h-8 w-8 text-blue-400 md:h-20 md:w-20" />
      </StatusIcon>
      <PileOverviewPanel kind="draw">Draw Pile</PileOverviewPanel>
    </div>
    <CardHand />
    <div class="col-span-2 flex flex-col justify-between px-4 py-4">
      <BaseButton @click="roundStore.round.enemyTurn()">Enemy Turn</BaseButton>
      <PileOverviewPanel
        kind="discard"
        class="col-span-2"
      >Discard Pile</PileOverviewPanel>
    </div>
  </div>
</template>
