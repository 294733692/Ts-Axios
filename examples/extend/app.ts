import axios from '../../src'

axios({
  url: '/extend/post',
  method: 'post',
  data: {
    msg: 'hi'
  }
})

axios.request({
  url: '/extend/post',
  method: 'post',
  data: {
    msg: 'hello'
  }
})

axios.get('/extend/get')
axios.options('/extend/options')
axios.delete('/extend/delete')
axios.head('/extend/head')
axios.post('/extend/post', {mas: 'post'})
axios.put('/extend/put', {mas: 'put'})
axios.patch('/extend/patch', {mas: 'patch'})

// import axios from '../../src/index'
//
// interface ResponseData<T = any> {
//   code: number
//   result: T
//   message: string
// }
//
// interface User {
//   name: string
//   age: number
// }
//
// function getUser<T>() {
//   return axios<ResponseData<T>>('/extend/user')
//     .then(res => res.data)
//     .catch(err => console.error(err))
// }
//
//
// async function test() {
//   const user = await getUser<User>()
//   if (user) {
//     console.log(user.result.name)
//   }
// }
//
// test()
