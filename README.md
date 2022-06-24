# Promise A+

[MyPromise使用]

    ```javascript
        new Promise((resolve,reject)=>{
            resolve("data");
            reject("err");
        }).then(
            (data)=>{},
            (err)=>{},
        ).then(
            (data)=>{},
            (err)=>{},
        ) .....
    ```

[excutorCallBack]

    ```javascript
        new Promise(function excutorCallBack( resolve, reject){
            .....
        })
        
        constructor(excutorCallBack){
            this.status = "pending";
            ....
            try{
                excutorCallBack()
            }catch(e){
                ... 
            }
        }
    ```

[resolveFn|rejectFn]

    ```javascript
        constructor(){
            let resolveFn = (data)=>{
                setTimeout(()=>{

                // 里面的逻辑代码需要在 then 方法执行完成才会执行
                // 简而言之就是 把这里的逻辑代码变为异步
                    {
                        // 异步修改状态
                        this.status = "fulfilled";
                        // 获取 then 里面的 参数函数 进行执行
                        this.fulfilledAry.forEach((item)=>{
                            item(data)
                        })
                    }

                },0)

            }
            let rejectFn = (err) =>{
                setTimeout(()=>{
                    
                // 里面的逻辑代码需要在 then 方法执行完成才会执行
                // 简而言之就是 把这里的逻辑代码变为异步
                    {
                        // 异步修改状态
                        this.status = "rejected";
                        // 获取 then 里面的 参数函数 进行执行
                        this.rejectedAry.forEach((item)=>{
                            item(err)
                        })
                    }

                },0)
            }

            try{
                excutorCallBack(resolveFn,rejectFn) 
            }catch(e){
                rejecteFn(e)
            }
        }

        resolveFn(data)|rejectFn(err)
    ```

[then]

    ```javascript
    // then() 里面的 参数函数需要注册到的 resolve() 管控的异步函数里面
    // 而其还要开辟一个新的 Promise 实例 
    // 这个新的 Promise 实例是根据上一次的 resolve()|reject()执行结果来判断的 如果出现错误的话 就是掉用下次的 reject() 如果没有出现错误 下次统一走的是 resolve()
    /*
    * 简而言之：就是上一个 then(参数函数，参数函数)里面的参数函数
    *          和下一个 Promise 实例的 resolve() 进行关联就可以
    *          得到 then 的链式掉用
    */
        Promise(){
            ....

            then(resolveCallBack,rejectCallBack){
                // resolveCallBack 和 rejectCallBack 
                // 需要进行判断 then() 调用的时候可能 有不传函数参数的情况
                let newPromise = new Promise((resolve,reject)=>{
                           this.fulfilledAry.push(
                               ()=>{
                                   resolveCallBack(this.value);// then(()=>{ return "xx" || return new Promise() })
                                   // 这个返回值可能是 一个promise实例
                                   // 还可以是其他 
                                   //1）判断是 自己手动返回的 Promise 实例
                                   // note: 后面promise实例覆盖前面的promis实例
                                   //       前面的promise在 注册函数上有值 后面的 Promise 实例是异步的情况下是拿不到 注册函数的
                                   // 前面的 data 是有初始值的会覆盖 如果是属性的拷贝的 会使用 this.value = null 覆盖后面的promise实例
                                   newPromise.value = prevThenResolveCallBackRes.value;
                                   newPromise = Object.assign(prevThenResolveCallBackRes, newPromise);
                               }
                               );
                           this.rejectedAry.push(
                                ()=>{
                                    // 步骤和上面的是一样的
                                    rejectCallback(this.value)
                               }
                               )
                })
                return newPromise;
            }

            .... 
        }
    ```

[catch]

    ```javascript
        promiseInstance.then((data)=>{ ... }).catch((err)=>{ ... })

        // 原理
        then(null,rejectCallBack) => then() 里面做参数的判断是否额度传递参数
    ```

[Promise.all]

    ```javascript
        promiseInstance = Promise.all([promiseInstance1,promiseInstance2 .... ])
        promiseInstance.then( (res) =>{ /* 全部promiseInstance都是rejerct状态 */ } )
                            // res 存储的是每一个实例返回的结果并且和数组的顺序是一样的

                        .catch((err)=>{ /* 一个promiseInstance 为 reject */ })
        // 重要的是怎么样去判断 传递的promise实例的状态
        // 使用 .then(()=>{ 实例为成功的状态 },()=>{ 实例为失败的状态 }) =>
    ```
