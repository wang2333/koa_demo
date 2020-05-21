const path = require('path')
const Koa = require('koa')
const Router = require('koa-router')
const render = require('koa-art-template')
const bodyparser = require('koa-bodyparser')
const koaStatic = require('koa-static')
const Db = require('./module/db')
const Util = require('./module/Util')

const app = new Koa()
const router = new Router()

// 错误处理中间件
app.use(async (ctx, next) => {
  await next()
  if (ctx.status == '404') {
    ctx.status = 404
    ctx.body = '404页面'
  }
})

router.get('/request', async (ctx) => {
  try {
    let res = await Util.request()
    let video = await Util.getVideoUrl(res.data[1].room_id)
    ctx.body = {
      video
    }
  } catch (error) {
    console.log(error)
  }
})

router.get('/aaa', async (ctx) => {
  ctx.body = '/aaa'
})

router.get('/bbb', async (ctx) => {
  ctx.body = '/bbb'
})

router.get('/ccc', async (ctx) => {
  const data = await Db.find('user')
  await ctx.render('index', { list: data })
})

router.post('/addUser', async (ctx) => {
  const params = ctx.request.body
  const json = {
    name: params.name,
    password: params.password,
  }
  const { result } = await Db.insert('user', json)
  try {
    if (result.ok == 1) {
      ctx.body = '新增成功'
      ctx.redirect('/ccc')
    }
  } catch (error) {
    console.log(error)
  }
})

router.post('/updateUser', async (ctx) => {
  const { result } = await Db.remove('user', { name: '123' })

  if (result.ok == 1) {
    ctx.body = '新增成功'
  } else {
    ctx.body = result
  }
})

app.use(bodyparser())
app.use(koaStatic(path.join(__dirname, './static'))) // 静态资源中间件,可以配置多个

app.use(router.routes())
app.use(router.allowedMethods())

render(app, {
  root: path.join(__dirname, 'views'),
  extname: '.html',
})

app.listen(3000, () => {
  console.log('http://localhost:3000')
})
