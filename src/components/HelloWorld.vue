<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { Board } from '../common/board'

const board = new Board(window.innerWidth, window.innerHeight)
window.addEventListener("resize", resizeEventHandler)

let mouseDownCoord: [number, number] = [0, 0]

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

function mouseDownHandler(e: MouseEvent): void {
  mouseDownCoord[0] = e.x
  mouseDownCoord[1] = e.y
}

function mouseUpHandler(e: MouseEvent): void {
  board.drag(mouseDownCoord[0], mouseDownCoord[1], e.x, e.y)
}

</script>

<template>
  <div id="canvas-container" @mousedown="mouseDownHandler" @mouseup="mouseUpHandler"></div>
</template>

<style scoped>
</style>
