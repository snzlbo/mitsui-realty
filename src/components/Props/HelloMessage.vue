<template>
  <div>
    <div class="d-flex bot-chat-wrapper">
      <div class="chat-avatar">
        <icon-chat />
      </div>
      <div
        class="bot-chat"
        :style="{
          backgroundColor: props.botColor || '#efefef',
          color: pickTextColorBasedOnBgColorAdvanced(
            props.botColor,
            '#FFFFFF',
            '#000000'
          ),
        }"
      >
        <div class="markdown-body" v-html="formatMessage(message)"></div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'pinia';
import { usePropsStore } from '../../store/propsStore';
import { pickTextColorBasedOnBgColorAdvanced } from '../../services/invertColor';
import { renderMarkdown } from '../../services/markdown.js';
import { IconChat } from '../../assets/icons';

export default {
  props: {
    message: {
      type: String,
      default() {
        return '';
      },
    },
  },
  components: {
    IconChat,
  },
  computed: {
    ...mapState(usePropsStore, ['props']),
  },
  methods: {
    pickTextColorBasedOnBgColorAdvanced,
    formatMessage(value) {
      return renderMarkdown(value);
    },
  },
};
</script>
