var http = require('http')
var fs = require('fs')
var url = require('url')
var port = process.argv[2]

if (!port) {
  console.log('请指定端口号好不啦？\nnode server.js 8888 这样不会吗？')
  process.exit(1)
}

var server = http.createServer(function (request, response) {
  var parsedUrl = url.parse(request.url, true)
  var pathWithQuery = request.url
  var queryString = ''
  if (pathWithQuery.indexOf('?') >= 0) { queryString = pathWithQuery.substring(pathWithQuery.indexOf('?')) }
  var path = parsedUrl.pathname
  var query = parsedUrl.query
  var method = request.method

  /******** 从这里开始看，上面不要看 ************/

  console.log('方方说：含查询字符串的路径\n' + pathWithQuery)

  if (path === '/') {
    let cookie = request.headers.cookie
    if (cookie) {
      let ckemail = cookie.split('=')[1]
      let users = fs.readFileSync('./db/users.json', 'utf8')
      users = JSON.parse(users)
      for (let i = 0; i < users.length; i++) {
        if (users[i].email === ckemail) {
          let string = fs.readFileSync('./index.html', 'utf8')
          response.statusCode = 200
          response.setHeader('Content-Type', 'text/html;charset=utf8')
          response.write(string)
        }else{
          response.statusCode = 401
        }
      }
    } else {
      response.statusCode = 401
    }
    response.end()
  } else if (path === "/sign_up" && method === 'GET') {
    let string = fs.readFileSync('./sign_up.html', 'utf8')
    response.statusCode = 200
    response.write(string)
    response.end()
  } else if (path === "/sign_up" && method === 'POST') {
    readBody(request).then((body) => {
      let hash = {}
      body.split('&').forEach((part) => {
        let parts = part.split('=')
        let key = parts[0]
        let value = parts[1]
        hash[key] = decodeURIComponent(value)
      })
      let { email, password, password_confirmation } = hash
      if (email.indexOf('@') === -1) {
        response.statusCode = 400
        response.setHeader("Content-Type", "application/json; charset=utf8")
        response.write(`{
        "errors": {
          "email": "invalid"
        }
      }`)
      } else if (password !== password_confirmation) {
        response.statusCode = 400
        response.setHeader("Content-Type", "application/json; charset=utf8")
        response.write(`{
          "errors": {
            "password": "password not match"
          }
        }`)
      } else {
        let users = fs.readFileSync('./db/users.json', 'utf8')
        try {
          users = JSON.parse(users)
        } catch (error) {
          users = []
        }
        let inUsers = false
        for (let i = 0; i < users.length; i++) {
          if (users[i].email === email) {
            inUsers = true
            break
          }
        }
        if (inUsers) {
          response.statusCode = 400
          response.setHeader("Content-Type", "application/json; charset=utf8")
          response.write(`{
            "errors": {
              "email": "used"
            }
          }`)
        } else {
          users.push({ email: email, password: password })
          let usersString = JSON.stringify(users)
          fs.writeFileSync('./db/users.json', usersString)
          response.statusCode = 200
        }
      }
      response.end()
    })
  } else if (path === '/sign_in' && method === "GET") {
    let string = fs.readFileSync('./sign_in.html', 'utf8')
    response.statusCode = 200
    response.setHeader('Content-Type', 'text/html;charset=utf8')
    response.write(string)
    response.end()
  } else if (path === '/sign_in' && method === "POST") {
    let hash = {}
    let users = fs.readFileSync('./db/users.json', 'utf8')
    let usersList = JSON.parse(users)
    readBody(request).then((body) => {
      body.split('&').forEach((parts) => {
        let part = parts.split('=')
        let key = part[0]
        let value = part[1]
        hash[key] = decodeURIComponent(value)
      })
      let { email, password } = hash
      let found
      for (let i = 0; i < usersList.length; i++) {
        let user = usersList[i]
        if (user.email === email && user.password === password) {
          found = true
          break
        }
      }
      if (found) {
        // Set-Cookie: <cookie-name>=<cookie-value>
        response.setHeader('set-Cookie', `sign_in_email=${email}`)
        response.statusCode = 200
      } else {
        response.statusCode = 401
      }
      response.end()
    })
  } else if (path === '/main.js') {
    let string = fs.readFileSync('./main.js', 'utf8')
    response.statusCode = 200
    response.setHeader('Content-Type', 'application/javascript;charset=utf8')
    response.write(string)
    response.end()
  } else if (path === '/xxx') {
    response.statusCode = 200
    response.setHeader('Content-Type', 'text/json;charset=utf-8')
    response.setHeader('Access-Control-Allow-Origin', 'http://frank.com:8001')
    response.write(`
    {
      "note":{
        "to": "小谷",
        "from": "方方",
        "heading": "打招呼",
        "content": "hi"
      }
    }
    `)
    response.end()
  } else {
    response.statusCode = 404
    response.setHeader('Content-Type', 'text/html;charset=utf-8')
    response.write('呜呜呜')
    response.end()
  }

  /******** 代码结束，下面不要看 ************/
})

server.listen(port)
console.log('监听 ' + port + ' 成功\n请用在空中转体720度然后用电饭煲打开 http://localhost:' + port)

function readBody(request) {
  return new Promise((resolve, reject) => {
    let body = []
    request.on('data', (chunk) => {
      body.push(chunk)
    }).on('end', () => {
      body = Buffer.concat(body).toString()
      resolve(body)
    })
  })
}