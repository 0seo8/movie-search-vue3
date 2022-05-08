import axios from 'axios'
import _uniqBy from 'lodash/uniqBy'

const _defaultMessage = 'Search for the movie title!'

export default {
  namespaced: true,
  state: () => ({
    movies: [],
    message: _defaultMessage,
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
      state.movies = [],
      state.message=_defaultMessage
      state.loading = false
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
      }catch({message}){
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
        console.log(res.data)
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

async function _fetchMovie(payload) {
  return await axios.post('/.netlify/functions/movie', payload)
}