<template>
  <embed-view v-if="props.mode === 'embed'" />
  <full-view v-if="props.mode === 'full'" />
</template>
<script>
import { mapState } from 'pinia'
import { usePropsStore } from './store/propsStore'
import EmbedView from './components/EmbedView.vue'
import FullView from './components/FullView.vue'
export default {
  components: {
    EmbedView,
    FullView
  },
  computed: {
    ...mapState(usePropsStore, ['props'])
  }
}
</script>