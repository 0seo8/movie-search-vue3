import {createApp} from 'vue'
import App from './App'
import router from './routes/index.js'
import store from './plugins/loadImage'
import loadImge from './store/index.js'

createApp(App)
  .use(router)
  .use(store)
  .use(loadImge)
  .mount('#app')