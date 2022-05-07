import axios from 'axios'
import _uniqBy from 'lodash/uniqBy'

export default {
  namespaced: true,
  state: () => ({
    movies: [],
    message: 'Search for the movie title!',
    loading: false,
  }),
  getters: {},
  mutations: {
    updateState(state, payload) { 
      Object.keys(payload).forEach(key => {
        state[key] = payload[key]
      })
    },
    resetMovies(state) {
      state.movies = []
    }
  },
  actions: {
    async searchMovies({state, commit}, payload) {
      if(state.loading) return
      commit('updateState', {
        message: '',
        loading: true,
        theMovie: {}
      })

      try {
        const res = await _fetchMovie({
          ...payload,
          page:1
        })
        const { Search, totalResults } = res.data
        commit('updateState', {
          movies: _uniqBy(Search, 'imdbID')
        })
  
        const total = parseInt(totalResults, 10) //숫자로변환
        const pageLength = Math.ceil(total / 10) //10개씩 가져오면 총 몇개의 페이지를 가져와야하는지 체크
  
        if(pageLength > 1) {  //pageLength가 1이라면 한개의 페이지로 모든 정보를 가지고 온것을 유추할 수 있다. 따라서 그렇지 않은 경우
          for(let page = 2; page <=pageLength; page++) {
            if(page > (payload.number /10)) break
            const res = await _fetchMovie({
              ...payload,
              page
            })
            const {Search} = res.data
            commit('updateState', {
              movies: [...state.movies, ..._uniqBy(Search, 'imdbID')] //기존데이터 + 새로가져온 데이터
            })
          }
        }
  
      }catch(message){
        commit('updateState', {
          movies: [], //초기화
          message
        })
      } finally {
        commit('updateState', {
          loading: false
        })
      }
    },
    async searchMovieWithId({state, commit}, payload) {
      if(state.loading) return
      commit('updateState', {
        theMovie: {},
        loading: true,
      })
      try {
        const res = await _fetchMovie(payload)
        commit('updateState', {
          theMovie: res.data
        })
      } catch (error) {
        commit('updateState', {
          theMovie: {}
        })
      }finally {
        commit('updateState', {
          loading: false
        })
      }
    }
  }
}

function _fetchMovie(payload) {
  const {title, type, year, page, id} = payload
  const OMDB_API_KEY = '7035c60c'
  const url = id 
  ? `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&i=${id}`
  :  `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&s=${title}&type=${type}&y=${year}&page=${page}`

  return new Promise((resolve, reject) => {
    axios.get(url)
      .then(res => {
        if(res.data.Error) {
          reject(res.data.Error)
        }
        resolve(res)
      })
      .catch((err) => {
        reject(err.message)
      })
  })

}