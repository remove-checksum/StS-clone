<script setup lang="ts">

</script>
<template>
  <div class="aspect-[0.72/1] xl:w-36 border-2 border-gray-800 xl:p-2">
    <h3 class="text-2xl">
      <slot name="header"></slot>
    </h3>
    <slot name="content"></slot>
  </div>
</template>