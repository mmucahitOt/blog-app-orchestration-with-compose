let BASE_URL = import.meta.env.VITE_BACKEND_URL

console.log('import.meta.env', import.meta.env)

if (!BASE_URL) {
  BASE_URL = 'http://localhost:3000'
}

const generateURL = (api, path) => {
  if (!api) {
    return BASE_URL
  }
  if (!path) {
    return BASE_URL + '/' + api
  }
  if (api && path) {
    return BASE_URL + '/' + api + '/' + path
  }

  return BASE_URL
}

export default generateURL
