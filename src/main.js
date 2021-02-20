const Koa = require('koa')
const jazzicon = require('./jazzicon-node')
const md5 = require('md5-node')
var _ = require('koa-route')

const app = new Koa()
const port = 3000

const stringToNumber = (string) => {
    return hexToNumber(md5(string))
}

const hexToNumber = (string) => {
    return parseInt(string.slice(2, 10), 16)
}

const nameToSeed = (name) => {
    let seed = hexToNumber(name)
    if (isNaN(seed)) {
        seed = stringToNumber(name)
    }

    return seed
}
app.use(async (ctx, next) => {
    ctx.set('Access-Control-Allow-Origin', '*')
    ctx.set('Access-Control-Allow-Headers', 'Content-Type')
    ctx.set('Access-Control-Allow-Methods', 'GET')


    if (ctx.method == 'OPTIONS') {
        ctx.body = 200;
    } else {
        await next();
    }
});

// response
app.use(_.get('/:size/:name', async (ctx, size, name) => {
    size = size ? size : 120
    name = name ? name : 'avatar'
    let seed = nameToSeed(name)

    ctx.set('Content-Type', 'image/svg+xml')
    ctx.body = jazzicon(size, seed)
}))

app.use(_.get('/', async ctx => {
    ctx.body = '<h1>Hello Jazzavatar!</h1><br/>Demo: <img src="/36/name"/> <img src="/72/name2"/>'
}))

app.listen(port, () => {
    console.log('Server is running on port: ' + port)
})