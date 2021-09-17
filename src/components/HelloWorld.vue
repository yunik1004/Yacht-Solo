<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { Board } from '../common/board'

const board = new Board(window.innerWidth, window.innerHeight)
window.addEventListener("resize", resizeEventHandler)

onMounted(() => {
  document.getElementById('canvas-container')?.appendChild(board.getRendererDomElement())
  board.animate()
})

onUnmounted(() => {
  window.removeEventListener("resize", resizeEventHandler)
})

function resizeEventHandler(e: UIEvent): void {
  board.resize(window.innerWidth, window.innerHeight)
}

</script>

<template>
  <div id="canvas-container"></div>
</template>

<style scoped>
</style>
