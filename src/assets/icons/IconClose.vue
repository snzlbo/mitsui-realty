<script lang="ts">
export default {
  props: {
    fill: { type: String, default: 'currentColor' },
    stroke: { type: String, default: 'currentColor' },
    className: { type: String, default: '' }
  }
}
</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    :stroke="stroke"
    :fill="fill"
    :class="className"
    viewBox="0 -960 960 960"
  >
    <path
      :fill="fill"
      :stroke="stroke"
      d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"
    />
  </svg>
</template>
