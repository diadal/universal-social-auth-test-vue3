<script setup lang="ts">
import WelcomeItem from './WelcomeItem.vue'
import {
  getCurrentInstance,
  type ComponentCustomProperties,
  type ComponentInternalInstance,
  ref
} from 'vue'
import type { ProderT } from 'universal-social-auth/dist/providers'

// Button Method 1
import { Providers } from 'universal-social-auth'

// Button Method 2
import { Github, Facebook, Google, Twitter } from 'universal-social-auth'
// const MycustomProvider = {
//   // Mycustom provider datas
// }

interface User {
  provider: string
  code: string
}
interface ReData {
  provider: string
  code: string
}

const globalProperties = <ComponentInternalInstance>getCurrentInstance()
const box: ComponentCustomProperties = <ComponentCustomProperties>(
  globalProperties.appContext.config.globalProperties
)

const perData = { provider: '', code: '' }

const responseData = ref<ReData>(perData)
const hash = ref('')
const data = ref({ tok: '' })

// Below are the functions to use inside you export default be `Vue3 Setup()` or `Vue2 data()` or other `Framework`

function useAuthProvider(provider: string, proData: Record<string, unknown> | null) {
  const pro = <ProderT>proData

  const ProData = pro || <ProderT>Providers[provider]
  box.$Oauth
    .authenticate(provider, ProData)
    .then((response) => {
      const rsp: { code: string } = <{ code: string }>response
      if (rsp.code) {
        responseData.value.code = rsp.code
        responseData.value.provider = provider
        useSocialLogin()
      }
    })
    .catch((err: unknown) => {
      console.log(err)
    })
}

async function useLoginFirst(e: User) {
  // this sample of how to pust user data to my store
  // const firstlogin: boolean = await box.$auth.firstlogin(e)
  if (e) {
    const msg = `Welcome To My App`
    alert(msg)
    // await box.$router.push({ name: 'dashboard' })
    return
  }
}

function useSocialLogin() {
  // otp from input Otp form
  // hash user data in your backend with Cache or save to database
  const pdata = { code: responseData.value.code, otp: data.value.tok, hash: hash.value }
  box.$axios
    .post('https://api.diadal.com.ng/social-login/' + responseData.value.provider, pdata)
    .then(async (response) => {
      // `response` data base on your backend config
      if (response.data.status === 444) {
        hash.value = response.data.hash
        // fauth.value = true // Option show Otp form incase you using 2fa or any addition security apply to your app you can handle all that from here
      } else if (response.data.status === 445) {
        //do something Optional
      } else {
        await useLoginFirst(response.data.u)
      }
    })
    .catch((err: unknown) => {
      console.log(err)
    })
}
// Optional for Native App listen to the event `OauthCall` from your page component main.[js|ts] or app.[js|ts]

// emitter.on('OauthCall', (e) => {
//   if (e) {
//     responseData.value.code = e
//     useSocialLogin()
//   }
// })
</script>

<template>
  <WelcomeItem>
    <template #heading>Documentation</template>

    "universal-social-auth test for vue3
    <a href="https://github.com/diadal/universal-social-auth/" target="_blank" rel="noopener"
      >official documentation</a
    >
    "
  </WelcomeItem>

  <WelcomeItem>
    <template #heading>Method 1</template>

    <button @click="useAuthProvider('github', null)">auth Github</button>
    <!-- <button @click="useAuthProvider('facebook', null)">auth Facebook</button>
    <button @click="useAuthProvider('google', null)">auth Google</button>
    <button @click="useAuthProvider('twitter', null)">auth Twitter</button> -->
  </WelcomeItem>
  <WelcomeItem>
    <template #heading>Method 2</template>

    <button @click="useAuthProvider('github', Github)">auth Github</button>
    <!-- <button @click="useAuthProvider('facebook', Facebook)">auth Facebook</button>
    <button @click="useAuthProvider('google', Google)">auth Google</button>
    <button @click="useAuthProvider('twitter', Twitter)">auth Twitter</button> -->
    <!-- <button @click="useAuthProvider('mycustom', Mycustom)">auth Mycustom</button> -->
  </WelcomeItem>
</template>
