<template>
  <div class="fab">
    <v-btn
      v-if="!isMobile && !menuOpen"
      :color="buttonColor || 'primary'"
      @click="toggleMenu"
      style="color: #ffffff; height: 3rem"
      rounded="lg"
    >
      <template #prepend>
        <v-icon style="width: 3rem; height: 3rem"> <icon-chat /> </v-icon>
      </template>
      <template #append>
        <v-icon style="width: 3rem; height: 3rem">
          <icon-keyboard-arrow-up />
        </v-icon>
      </template>
      売却に関するご質問にAIがお答えします
    </v-btn>
    <v-btn
      v-else-if="!isMobile || !menuOpen"
      icon
      :color="buttonColor || 'primary'"
      @click="toggleMenu"
    >
      <v-icon
        style="width: 3rem; height: 3rem"
        :style="{
          color: buttonIconColor
            ? buttonIconColor
            : pickTextColorBasedOnBgColorAdvanced(
                buttonColor,
                '#FFFFFF',
                '#000000'
              ),
        }"
      >
        <icon-chat v-if="!menuOpen" />
        <icon-close v-else />
      </v-icon>
    </v-btn>
  </div>
  <div
    v-if="menuOpen"
    :style="{
      position: 'absolute',
      bottom: isMobile ? '0rem' : '4rem',
      right: '0px',
      maxHeight: 'auto',
      maxWidth: 'auto',
      height: isMobile && '100dvh',
      width: isMobile && '100dvw',
      overflow: 'hidden',
      transform: menuOpen ? 'translateY(0%)' : 'translateY(100%)',
      transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
      transitionDuration: '300ms',
      transitionDelay: menuOpen ? '300ms' : '0ms',
    }"
  >
    <div
      :style="{
        margin: '16px',
        overflow: 'hidden',
        height: isMobile && 'calc(100% - 32px)',
        width: isMobile && 'calc(100% - 32px)',
        borderRadius: '0.25rem',
        boxShadow: `0 2px 1px -1px rgba(0, 0, 0, 0.2),
    0 1px 1px 0 rgba(0, 0, 0, 0.14),
    0 1px 3px 0 rgba(0, 0, 0, 0.12) !important`,
        backgroundColor: '#FFFFFF !important',
      }"
    >
      <chat-view @close="close" />
    </div>
  </div>
</template>
<script>
import { mapState } from "pinia";
import { usePropsStore } from "../store/propsStore";
import ChatView from "./Embed/ChatView.vue";
import { pickTextColorBasedOnBgColorAdvanced } from "../services/invertColor";
import { IconChat, IconClose, IconKeyboardArrowUp } from "../assets/icons";
export default {
  components: {
    ChatView,
    IconChat,
    IconClose,
    IconKeyboardArrowUp,
  },
  data() {
    return {
      menuOpen: false,
      isMobile: window.innerWidth <= 767,
    };
  },
  computed: {
    ...mapState(usePropsStore, ["props"]),
    buttonColor: {
      get() {
        return this.props?.widgetButtonColor
          ? this.props?.widgetButtonColor
          : this.props.buttonColor;
      },
    },
    buttonIconColor: {
      get() {
        return this.props?.buttonIconColor;
      },
    },
  },
  mounted() {
    window.addEventListener("resize", this.handleResize);
  },
  methods: {
    pickTextColorBasedOnBgColorAdvanced,
    close() {
      this.menuOpen = false;
    },
    handleResize() {
      this.isMobile = window.innerWidth <= 767;
    },
    toggleMenu() {
      this.menuOpen = !this.menuOpen;
    },
  },
};
</script>
