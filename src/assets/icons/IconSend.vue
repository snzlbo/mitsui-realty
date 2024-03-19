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
      d="M120-160v-240l320-80-320-80v-240l760 320-760 320Z"
    />
  </svg>
</template>
