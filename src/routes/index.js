import { createRouter, createWebHashHistory } from 'vue-router'
import Home from './Home'  //확장자명 생략이 가능도록 webpack을 설정해놓았습니다.
import About from './About'
import Movie from './Movie'

export default createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      component: Home
    },
    {
      path: '/movie/:id',
      component: Movie
    },    
    {
      path: '/about',
      component: About
    },
  ]
})