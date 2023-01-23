import axios from 'axios'
import qs from 'qs'

export const translates = (texts: string[], to: string) => {
  const sharedParams = {
    key: process.env.NEXT_PUBLIC_GT_API_KEY,
    target: to,
    format: 'html',
  }

  return axios
    .get(`https://www.googleapis.com/language/translate/v2`, {
      params: {
        ...sharedParams,
        q: texts,
      },
      paramsSerializer: function (params) {
        return qs.stringify(params, { arrayFormat: 'repeat' })
      },
    })
    .then((r) => r.data.data.translations.map((t) => t.translatedText))

  // return axios
  //   .get(`/api/transe`, {
  //     params: {
  //       ...sharedParams,
  //       q: texts,
  //     },
  //     paramsSerializer: function (params) {
  //       return qs.stringify(params, { arrayFormat: 'repeat' })
  //     },
  //   })
  //   .then((r) => r.data.map((t) => t.text))
}