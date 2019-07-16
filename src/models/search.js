import { message } from 'antd'
import { push } from 'react-router-redux'
import { effects } from 'redux-sirius'
import apis from 'utils/apis'
import r from 'constants/routes'

const { put } = effects

message.config({
  maxCount: 1
})

export default {
  state: {
    searchResult: null,
    error: null
  },
  reducers: {
    loadingStatus: (state, { payload }) => {
      const { field, ...data } = payload
      return {
        ...state,
        [field]: { ...state[field], ...data }
      }
    }
  },
  effects: ({ takeEvery }) => ({
    setState: takeEvery(function*({ payload }) {
      const { error, data } = payload
      if (error) {
        yield put({
          type: 'search/setError',
          payload: error
        })
      } else if (data) {
        let searchType = null
        const keys = Object.keys(data)
        keys.forEach(k => {
          if (data[k]) {
            searchType = k
          }
        })

        if (searchType) {
          let path = '/'
          switch (searchType) {
            case 'Block':
              path = `${apis.block}/${data[searchType].Number}`
              break
            case 'Tx':
              path = `/transaction/${data[searchType].Hash}`
              break
            case 'Account':
              if (data[searchType].IsToken) {
                path = r.tokenDetail
              } else if (data[searchType].IsContract) {
                path = r.contractDetail
              } else {
                path = r.accountDetail
              }
              path += `/${data[searchType].Address}`
              break
            default:
              break
          }
          message.destroy()
          yield put(push(path))
        }
      }
    })
  })
}
