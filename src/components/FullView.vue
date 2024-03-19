<template>
  <div class="pa-8 h-screen">
    <v-card class="d-flex h-screen">
      <div class="d-flex flex-column pa-6 w-100">
        <div class="flex-grow-1 flex-shrink-0 chat-wrapper pb-8">
          <div
            v-if="loading"
            class="typing"
          >
            <span />
            <span />
            <span />
          </div>
          <div
            v-for="(chat, index) in chatLogs"
            :key="index"
          >
            <div
              class="d-flex"
              :class="chat.wrapperClass"
            >
              <div
                v-if="chat.class === 'bot-chat' && props.botAvatar"
                class="chat-avatar" 
                :style="props.botAvatar ? {backgroundImage: `url('${props.botAvatar}')`} : ''"
              />
              <div
                v-else-if="chat.class === 'user-chat' && props.userAvatar"
                class="chat-avatar user-avatar"
                :style="props.userAvatar ? {backgroundImage: `url('${props.userAvatar}')`} : ''"
              />
              <div
                :class="chat.class"
                :style="
                  chat.class === 'user-chat' ? {
                    backgroundColor: props.userColor || '#4f46e5',
                    color: pickTextColorBasedOnBgColorAdvanced(props.userColor, '#FFFFFF', '#000000')
                  } : {
                    backgroundColor: props.botColor || '#efefef',
                    color: pickTextColorBasedOnBgColorAdvanced(props.botColor, '#FFFFFF', '#000000')
                  }"
              >
                {{ chat.text }}
              </div>
            </div>
          </div>
          <hello-message :message="props.helloMessage" />
        </div>
        <div class="flex-grow-0 flex-shrink-1">
          <v-textarea
            id="textarea"
            v-model="userInput"
            class="rounded"
            :loading="conversationLoading"
            :readonly="conversationLoading"
            rows="2"
            autofocus
            hide-details
            no-resize
            placeholder="入力してください・・・"
            density="comfortable"
            :bg-color="props.textAreaColor"
            @keydown.enter="handleKeydownEnter"
          >
            <template #append-inner>
              <v-btn
                v-if="conversationLoading"
                flat
                density="comfortable"
                :color="props.buttonColor || 'primary'"
                icon
                @click="cancelToken"
              >
                <v-icon
                  size="18" 
                  :style="{
                    color: props?.buttonIconColor ? props.buttonIconColor : pickTextColorBasedOnBgColorAdvanced(props.buttonColor, '#FFFFFF', '#000000')
                  }"
                >
                  <icon-cancel />
                </v-icon>
              </v-btn>
              <v-btn
                v-else
                flat
                density="comfortable"
                icon
                :color="props.buttonColor || 'primary'"
                @click="sendChat"
              >
                <v-icon
                  size="18"
                  :style="{
                    color: props?.buttonIconColor ? props.buttonIconColor : pickTextColorBasedOnBgColorAdvanced(props.buttonColor, '#FFFFFF', '#000000')
                  }"
                >
                 <icon-send />
                </v-icon>
              </v-btn>
            </template>
          </v-textarea>
        </div>
      </div>
    </v-card>
  </div>
</template>
<script>
import { mapState } from 'pinia'
import { usePropsStore } from '../store/propsStore'
import { generateString } from '../services/generateString'
import { groupBy } from '../services/groupBy'
import HelloMessage from './Props/HelloMessage.vue'
import { pickTextColorBasedOnBgColorAdvanced } from '../services/invertColor'
import { IconCancel, IconSend } from "../assets/icons";
export default {
  components: {
    HelloMessage,
    IconCancel,
    IconSend
  },
  data () {
    return {
      loading: false,
      conversationLoading: false,
      userInput: null,
      controller: null,
      chatLogs: []
    }
  },
  computed: {
    ...mapState(usePropsStore, ['props'])
  },
  mounted () {
    this.textAreaBackground()
    document.onkeydown = (event) => {
      if (event.key === 'Escape') {
        this.cancelToken()
      }
    }
  },
  methods: {
    pickTextColorBasedOnBgColorAdvanced,
    async sendChat () {
      const history = groupBy(this.chatLogs.slice(-6), 'index')
      const conversationId = generateString()
      const userId = generateString(8)
      const index = Math.floor(this.chatLogs.length / 2)
      const logs = []
      for (const index in history) {
        logs.push([history[index][1].text, history[index][0].text])
      }
      this.loading = true
      this.conversationLoading = true
      const userInput = this.userInput
      this.userInput = null
      this.chatLogs.unshift({
        wrapperClass: 'user-chat-wrapper',
        class: 'user-chat',
        text: userInput,
        index,
        id: null
      })
      const models = {
        gpt3: 'gpt-3.5-turbo',
        gpt4: 'gpt-4',
        palm2: 'palm-2'
      }
      const propsModel = this.props?.model || "gpt3"
      const query = {
        project_id: this.props.projectId,
        user_id: userId,
        conversation_id: conversationId,
        frequency_penalty: 0,
        history: logs,
        max_length: 2048,
        model: models[propsModel] || 'gpt-3.5-turbo',
        platform: 'Widget',
        presence_penalty: 0,
        question: userInput,
        temperature: 0,
        top_p: 1
      }
      this.controller = new AbortController()

      const sources = {
        dev: "https://beta.multi-chat.data-artist.info",
        stg: "https://test.multi-chat.data-artist.info",
        prod: "https://mugen-ai-chat.jp"
      }
      const propsSource = this.props?.source || "prod"
      const source = sources[propsSource] || "https://mugen-ai-chat.jp"
      const response = await fetch(`${source}/be/answer`, {
        method: 'POST',
        signal: this.controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
          'X-API-KEY': this.props.apiKey
        },
        body: JSON.stringify(query)
      })
      this.loading = false
      if (!response.body) {
        return
      }
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let done = false
      let msgFull = ''
      this.chatLogs.unshift({
        wrapperClass: 'bot-chat-wrapper',
        class: 'bot-chat',
        text: msgFull,
        index,
        id: null
      })
      while (!done) {
        const { value, done: doneReading } = await reader.read()
        done = doneReading
        const chunkValue = decoder.decode(value)
        msgFull += chunkValue
        this.chatLogs.find(chat => chat.class === 'bot-chat' && chat.index === index).text = msgFull
      }
      this.conversationLoading = false
    },
    cancelToken () {
      if (!this.loading && !this.conversationLoading) {
        return
      }
      this.controller.abort()
      this.chatLogs = this.chatLogs.splice(2)
      this.loading = false
      this.conversationLoading = false
    },
    handleKeydownEnter (e) {
      if (!e.ctrlKey && !e.metaKey) {
        return
      }
      this.sendChat()
    },
    textAreaBackground () {
      const textArea = document.getElementById('textarea')
      if (textArea) {
        const textColor = pickTextColorBasedOnBgColorAdvanced(this.props.textAreaColor, '#FFFFFF', '#000000')
        textArea.style.color = textColor
      }
    },
  }
}
</script>