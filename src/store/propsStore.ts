import { defineStore } from 'pinia'

export const usePropsStore = defineStore('props', {
  state: () => ({
    props: {},
  })
})
