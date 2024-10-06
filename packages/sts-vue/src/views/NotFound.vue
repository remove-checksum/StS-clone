<script setup lang="ts">
import BaseButton from '@/components/BaseButton.vue';
import { RouterLink, useRoute } from 'vue-router';

const route = useRoute()

</script>

<template>
  <div class="px-4">
    <h1>Page {{ route.fullPath }} not found!</h1>
    <RouterLink
      to="/game"
    >
      <BaseButton>
        Back to game
      </BaseButton>
    </RouterLink>
  </div>
</template>