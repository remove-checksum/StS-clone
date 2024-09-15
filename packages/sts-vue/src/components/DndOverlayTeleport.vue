<script setup lang="ts">
import { OVERLAY_MODAL_SELECTOR } from '@/model/modal';
</script>

<template>
  <Teleport :to="OVERLAY_MODAL_SELECTOR">
    <slot></slot>
  </Teleport>
</template>