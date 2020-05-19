const path = require('path')
const Koa = require('koa')
const Router = require('koa-router')
const views = require('koa-views')
const bodyparser = require('koa-bodyparser')
const koaStatic = require('koa-static')

const app = new Koa()
const router = new Router()

app.use(
  views(path.join(__dirname, './views'), {
    extension: 'ejs',
  })
)

// 错误处理中间件
app.use(async (ctx, next) => {
  await next()
  if (ctx.status == '404') {
    ctx.status = 404
    ctx.body = '404页面'
  }
})

router.get('/aaa', async (ctx) => {
  ctx.body = '/aaa'
})
router.get('/bbb', async (ctx) => {
  ctx.body = '/bbb'
})
router.get('/ccc', async (ctx) => {
  await ctx.render('index', { list: [1, 2, 3, 4, 5, 6] })
})
router.post('/addUser', async (ctx) => {
  ctx.body = ctx.request.body
})

app.use(router.routes())
app.use(router.allowedMethods())
app.use(bodyparser())
app.use(koaStatic(__dirname + '/static')) // 静态资源中间件,可以配置多个

app.listen(3000, () => {
  console.log('http://localhost:3000')
})
