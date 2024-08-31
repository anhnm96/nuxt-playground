<script lang="ts" setup>
const play = usePlaygroundStore()
</script>

<template>
  <button
    v-if="play.mountedGuide?.solutions"
    class="flex items-center gap-2"
    @click="play.mountGuide(play.mountedGuide, !play.showingSolution)"
  >
    <Icon v-if="!play.showingSolution" name="i-ph-lightbulb-filament-duotone" />
    <Icon v-else name="i-ph-arrow-counter-clockwise-duotone" />
    {{ play.showingSolution ? 'Reset challenge' : 'Show solution' }}
  </button>
</template>
