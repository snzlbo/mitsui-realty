<script lang="ts">
export default {
  props: {
    fill: { type: String, default: "currentColor" },
    stroke: { type: String, default: "currentColor" },
    className: { type: String, default: "" },
  },
};
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
      d="M480-528 296-344l-56-56 240-240 240 240-56 56-184-184Z"
    />
  </svg>
</template>
