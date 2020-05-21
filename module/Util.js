const request = require('request') //node封装的请求中间件
const path = require('path')

const { execSync } = require('child_process')
const process = require('process')

const Util = {
  request: () => {
    return new Promise((resolve, reject) => {
      request(
        {
          method: 'get',
          uri: 'http://capi.douyucdn.cn/api/v1/live',
          qs: {
            limit: 2,
            offset: 0,
          },
          json: true, //设置返回的数据为json
        },
        (error, response, body) => {
          if (!error && response.statusCode == 200) {
            resolve(body)
          } else {
            reject('解析失败')
          }
        }
      )
    })
  },

  getVideoUrl: (room) => {
    return new Promise((resolve, reject) => {
      const fileUrl = path.join(__dirname, 'douyu.py')
      const output = execSync(`python ${fileUrl} --room=${room}`)
      const result = new Buffer(output, 'utf8').toString('utf8')
      if (result.startsWith('http')) {
        resolve(result)
      } else {
        reject('解析失败')
      }
    })
  },
}

module.exports = Util
