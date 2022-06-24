// padding fullfill reject

new Promise(
        // excutor 执行函数 可以不管控异步操作 不管控是没有意义的
        (resolve,reject) =>{
            // resolve reject 手动的进行控制 excutor -> resolve|reject
            resolve(100);
        }
    ).then( 
        // 就是 resolve 
        result=>{
            console.log(1);
            return 1000 ;  // 传递给下一个 then 方法的第一个回调函数
                           // 如果 return new Promise() 等待promise处理完成 把处理完的结果给 then 的第一个回调函数 
        },
        // 就是 reject 
        reason=>{
            console.log(2)
        }
    ).then(res=>{
        // 上一个 then() 方法里面的两个方法只要任意一个不报错的话　下一个　then 都会走成功(第一个)回调函数
    
    },err=>{
        // 上一个 then() 报错的话就会走第二个(错误的)回调函数
    })
// then 是微任务
// Promise.prototype.then = fn(fn1,fn2){  fn1() return new Promise()  }
// catch()  => then(null,catch(){})的第二个方法 
// Promise.all([promise1,promise2...]).then() => all() 等待所有的promise都成功才会实现 then 的第一个回调函数 只要有一个失败执行 then 的第二个方法
console.log(3)

// 3 1 
