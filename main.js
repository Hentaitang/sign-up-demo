window.jQuery = function(nodeOrSelector){
    let nodes = {}
    nodes.addClass = function(){}
    nodes.html = function(){}
    return nodes
}

window.jQuery.ajax = function({url, method, body, headers}){
    //let url
    //if(arguments.length === 1){
    //    url = options.url
    //}else if(arguments.length === 2){
    //    url = arguments[0]
    //    options = arguments[1]
    //}
    //let method = options.method
    //let body = options.body
    //let headers = options.headers
    //let successFn = options.successFn
    //let failFn = options.failFn


    // ES6语法  析构赋值
    // let {method, body, headers, successFn, failFn} = options

    return new Promise(function(resolve, reject){
        let request = new XMLHttpRequest() //声明一个XMLHttpRequest对象
        request.open(method, url) // 配置request
        for(key in headers){
            let value = headers[key]
            request.setRequestHeader(key, value)
        }
        request.onreadystatechange = ()=>{
            if(request.readyState === 4){
               if(request.status >= 200 && request.status < 300){
                    resolve.call(undefined, request.responseText)
                }else if(request.status >= 400){
                    reject.call(undefined, request)
                }
            }
        }
        request.send(body) //发送
    })
}

window.$ = window.jQuery

function f1(responseText){}
function f2(responseText){}

myButton.addEventListener('click', (e)=>{
    window.jQuery.ajax(
        {
            url: '/xxx',
            method: 'get',
        }
    ).then(
        (text)=>{console.log(text)}, 
        (request)=>{console.log(request)}
    )

// promise 用法
//myButton.addEventListener('click', (e)=>{
    //$.ajax(
    //    {
    //        url: '/frank',
    //        method: 'get'
    //    }
    //).then(
    //    (responseText)=>{
    //        console.log(responseText)
    //    }, 
    //    (request)=>{
    //        console.log(request)
    //        console.log(request.status)
    //    })
    

    //let obj = {
    //    url: '/xxx',
    //    method: 'get',
    //    successFn: ()=>{},
    //    failFn: ()=>{}
    //}
    
    //window.jQuery.ajax(
    //    {
    //        url: '/frank',
    //        method: 'get',
    //        headers: {
    //            'Content-Type': 'application/x-www-form-urlencode',
    //            'frank' : '18' 
    //        },
    //        successFn: (x)=>{
    //            console.log(x)
    //            f1.call(undefined, x)
    //            f2.call(undefined, x)
    //        },
    //        failFn: (x)=>{
    //           console.log(x)
    //            console.log(x.status)
    //        }
    //    }
//    )

    //let request = new XMLHttpRequest() //声明一个XMLHttpRequest对象
    //request.onreadystatechange = ()=>{
    //    if(request.readyState === 4){
    //        console.log('请求响应都完毕了')
    //        console.log(request.status)
    //        console.log(request.statusText)
    //        if(request.status >= 200 && request.status < 300){
    //            console.log('请求成功')
    //            console.log(request.getAllResponseHeaders())
    //            console.log(request.getResponseHeader('Content-Type'))
    //            console.log(request.responseText)  
    //            let string = request.responseText
    //            // 把符合 JSON 语法的字符串
    //            // 转换成 JS 对应的值
    //            let object = window.JSON.parse(string)
    //            // JSON.parse 是浏览器提供的
    //        }else if(request.status >= 400){
    //            console.log('说明请求失败')
    //        }
    //    }
    //}
    //request.open('POST', '/xxx') // 配置request
    //request.setRequestHeader('frank', '18')
    //request.setRequestHeader('Content-Type', 'x-www-form-urlencoded')
    //request.send('我偏要设置第四部分') //发送
})