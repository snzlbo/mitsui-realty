import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.scss'
import App from './App.vue'
import { usePropsStore } from './store/propsStore'

// vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { aliases, md } from 'vuetify/iconsets/md'

interface Window {
  MultiChatEmbed: object
}
declare const window: Window

window.MultiChatEmbed = {
  initialize(mugenProps: object) {
    //@ts-ignore
    if (mugenProps?.botAvatar === "mitsui") {
      const sources = {
        dev: "https://beta.multi-chat.data-artist.info",
        stg: "https://test.multi-chat.data-artist.info",
        prod: "https://mugen-ai-chat.jp",
      }
      //@ts-ignore
      const propsSource = mugenProps?.source || "prod"
      //@ts-ignore
      const source = sources[propsSource] || "https://mugen-ai-chat.jp"
      //@ts-ignore
      mugenProps.botAvatar = `${source}/widget/mitsui/bot-icon.svg`
      //@ts-ignore
      mugenProps.userAvatar = `${source}/widget/mitsui/user-icon.svg`
    }
    const pinia = createPinia()
    const vuetify = createVuetify({
      icons: {
        defaultSet: 'md',
        aliases,
        sets: {
          md
        }
      }
    })
    createApp(App)
    .use(pinia)
    .use(vuetify)
    .mount('#multi-chat-embed')
    usePropsStore().$patch({
      props: mugenProps
    })
  }
}
