import api from './index'

const templateApi = api.injectEndpoints({
  endpoints: (build) => ({
    templateList: build.query({
      query: (_data) => ({
        url: '/template/list'
      })
    })
  }),
  overrideExisting: true
})

export const {
  useTemplateListQuery
} = templateApi
