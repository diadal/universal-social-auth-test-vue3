import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import axios, { type AxiosInstance } from 'axios'
import UniversalSocialauth from 'universal-social-auth'

import App from './App.vue'
import router from './router'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance
    $Oauth: UniversalSocialauth
  }
}

const options = {
  providers: {
    // apple: {
    //   nonce: '**************',
    //   state: '**************',
    //   clientId: '**************',
    //   redirectUri: 'https://myapp.com/auth/github/callback'
    // },
    github: {
      clientId: '7db089adf03467bec815',
      redirectUri: 'http://localhost:3000/auth/github/callback' // change to your app frontpage url to match your route  path: '/auth/:provider/callback',
    }
    // twitch: {
    //   clientId: 'qi4vbk30uuvuqigcd5ioq3egxf67m8',
    //   redirectUri: 'https://diadal.com.ng/auth/twitch/callback'
    // }
    // google: {
    //   clientId: '***************',
    //   redirectUri: 'https://myapp.com/auth/google/callback'
    // },
    // facebook: {
    //   clientId: '************',
    //   redirectUri: 'https://myapp.com/auth/facebook/callback'
    // },
    // twitter: {
    //   url: 'https://myapp.com/auth/twitter',
    //   clientId: '********',
    //   redirectUri: 'https://myapp.com/auth/twitter/callback'
    // }
  }
}

const Oauth: UniversalSocialauth = new UniversalSocialauth(axios, options)

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.config.globalProperties.$Oauth = Oauth
app.config.globalProperties.$axios = axios

app.mount('#app')
