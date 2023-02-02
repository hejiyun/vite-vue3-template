import Axios from 'axios'

const BASE_URL = '' //请求接口url 如果不配置 则默认访问链接地址
const TIME_OUT = 30000 // 接口超时时间
const instance = Axios.create({
  baseURL: BASE_URL,
  timeout: TIME_OUT,
})

// 可以添加一个axios的post全局配置
instance.defaults.headers.post = {
  'Content-Type': 'application/x-www-form-urlencoded',
  'USER-PFID': 0,
  'USER-TOKEN': 0,
  locale: localStorage.getItem('SITE_LANG') || 'zh-tw',
  'APP-NAME': 0 || 'art',
  'APP-VERSION': 0 || '1.0.6',
}

// 基本原理: 类似于数组的去重, 在不断添加的数组数据中,只要出现重复相同的数据, 则中断旧数据的处理并清除出去
// 保留最新数据
// 具体原理:https://axiu.me/coding/axios-use-canceltoken-to-cancel-request/

//声明一个数组用于存储每个ajax请求的取消函数和ajax标识
const rqList: any = []
const cancelToken = Axios.CancelToken
const removeRepeatUrl = (ever: any) => {
  for (const rq in rqList) {
    // 判断是否存在重复请求
    if (
      rqList[rq].config &&
      rqList[rq].config.url === ever.url &&
      rqList[rq].config.method === ever.method
    ) {
      if (isObjectValueEqual(rqList[rq].config, ever)) {
        //当当前请求在数组中存在时,取消操作,并将其从数组中移除
        rqList[rq].cancle()
      }
      rqList.splice(rq, 1)
    }
  }
}

// 添加请求拦截器
instance.interceptors.request.use(
  (config) => {
    console.log('config', config)
    //在一个ajax发送前执行一下取消操作
    removeRepeatUrl({
      method: config.method,
      url: config.url,
      params: config.params,
      data: config.data,
    })
    // 创建cancleToken和cancle取消请求方法, 每个请求都唯一
    config.cancelToken = new cancelToken((c: any) => {
      // 自定义唯一标识
      rqList.push({
        config: {
          method: config.method,
          url: config.url,
          params: config.params,
          data: config.data,
        },
        cancle: c, //
      })
    })
    // 可以在此处添加一些共有的请求拦截
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 添加响应拦截器
instance.interceptors.response.use(
  (response) => {
    console.log('响应', response)
    removeRepeatUrl({
      method: response.config.method,
      url: response.config.url,
      params: response.config.params,
      data: response.config.data,
    }) //在一个ajax响应后再执行一下取消操作，把已经完成的请求从rqList中移除
    const data = response.data
    return data
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default instance

const isObjectValueEqual = (a: any, b: any) => {
  console.log(a, b)
  // 判断两个对象是否指向同一内存，指向同一内存返回true,同时比较null和undefined情况
  if (a == b) {
    return true
  }
  if (a == null || a == undefined || b == null || b == undefined) {
    return false
  }
  // 获取两个对象键值数组
  const aProps = Object.getOwnPropertyNames(a)
  const bProps = Object.getOwnPropertyNames(b)
  // 判断两个对象键值数组长度是否一致，不一致返回false
  if (aProps.length !== bProps.length) {
    return false
  }
  // 遍历对象的键值
  for (const prop in a) {
    // 判断a的键值，在b中是否存在，不存在，返回false
    if (b.hasOwnProperty(prop)) {
      // 判断a的键值是否为对象，是则递归，不是对象直接判断键值是否相等，不相等返回false
      if (typeof a[prop] === 'object') {
        if (!isObjectValueEqual(a[prop], b[prop])) {
          return false
        }
      } else if (a[prop] !== b[prop]) {
        return false
      }
    } else {
      return false
    }
  }
  return true
}
