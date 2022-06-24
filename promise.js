class Promise{
    // 0）构造函数
    constructor(excutorCallBack){
        // 保存状态 pending  fulfilled 完成 rejected  拒绝
        this.status = "pending";
        // 保存 resolve( data|err =>  ) 用户手动传递过来的值
        this.value = null;
        // 保存reject回调函数
        this.fulfilledAry = [];
        // 保存resolve回调函数
        this.rejectedAry = [];
        let resolveFn = (data)=>{
            // 执行函数 里面的逻辑就是 把代码逻辑变为异步
            // 保存值
            this.value = data||null;
            var timer = setTimeout(() => {
                // 状态已经被修改过的话直接是 return 结束函数
                // 状态的判断也是不能放在外面的 因为在同步执行的
                // 时候状态都是pending 
                // 两个逻辑代码在最后的都是在修改状态
                // 会照成两个函数都会照常执行
                clearTimeout(timer)
                if (this.status !== "pending") { return };
                // 修改状态
                this.status = "fulfilled";

                // 执行 then 方法里面的 resolveCallback 和 rejectedCallback
                this.fulfilledAry.forEach((item) => {
                    item(this.value)
                })
            }, 0);

        }
        let rejectFn = (err)=>{
            // console.log("xx")
            //执行函数 直接把里面的逻辑代码变 为异步
            // 保存值
            this.value = err||null;
            // console.log("xx")
            var timer = setTimeout(() => {
            // console.log("xx")
                // 状态已经被修改过的话直接是 return 结束函数
                // 状态的判断也是不能放在外面的 因为在同步执行的
                // 时候状态都是pending 
                // 两个逻辑代码在最后的都是在修改状态
                // 会照成两个函数都会照常执行
                clearTimeout(timer)
                if (this.status !== "pending") { return };
                // 修改状态
                this.status = "rejected";
                // 执行 then 方法里面的 resolveCallback 和 rejectedCallback
                this.rejectedAry.forEach((item) => {
                    // console.log("item:",item)
                    item(this.value)
                });
            }, 0);
        };

        try{
            // 当执行器函数报错的时候 执行 rejectFn(e)
            // rejectFn 里面的逻辑都是异步的 要等
            // 主任务执行完才会执行 rejectFn 里面的逻辑函数
            excutorCallBack(resolveFn, rejectFn);
        }catch(e){
            rejectFn(e);
        }
    };

    // 1)then 方法 
    then(resolveCallBack,rejectCallback){
        // 将函数注册到一个成功或者是失败的数组里面
        /*
            this.fulfilledAry = [resolveCallBack];
            this.rejectedAry = [rejectedCallback];
        */
        /*      
            this.fulfilledAry.push(resolveCallBack);
            this.rejectedAry.push(rejectCallback); 
        */
        // 实现 promise 的链式调用  在 then 里面是返回promise实例
        if(typeof resolveCallBack !== "function"){
            // 保证下面函数不报错 并且有返回值 如果不传递的话使用的是 上一个
            // promise 状态里面的 数据
            // 自己手动不传递的话在这里默认是使用的上一次的数据传递给下一个promise对象
            // 自己不传函数这里自己加上函数
            resolveCallBack = (value)=>{ return value }
        };
        // 失败自己手动不传递的话也是 需要自己在这里 默认传递一个过度函数 保证下面的代码不报错
        // 只要出现报错 走的是 reject状态 reject 状态走的是 rejectCallback函数
        // 一直将这个错误传递下去 
        if (typeof rejectCallback !== "function"){
            rejectCallback = (err)=>{ throw new Error(err) }
        }
        var _this = this;
        var newPromise = new Promise((resolve,reject)=>{
            // 注册一个和本次 promise 实例修相关的匿名函数
            // 因为这个实例里面的 resolve() || 或者是 reject()
            // 在下一次的掉用中是必须先掉用的
            // 才能知道下一次 then 走的是什么?
            _this.fulfilledAry.push(()=>{
                try{
                    // console.log(_this.value);
                    let prevThenResolveCallBackRes = resolveCallBack(_this.value);
                    // 这个是下一个 promise 实例化调用的
                    // 方法 里面的参数是需要 根据上一个
                    // then 里面 
                    /*
                    prevThenresolveCallBackRes: 这个结果可能是一个值也可能是一个promise实例
                    
                    then(()=>{
                        return "1"/1/{}/[]
                        return new Promise((resolve,reject){
                            resolve("xxx")||reject("xxx")
                        })
                    })
                    */
                    if (prevThenResolveCallBackRes instanceof Promise){
                        // 是一个 promise 实例 在实例化的时候必须先要
                        // 执行excutor函数 然后 在执行里面 resolve 或者是
                        // reject 函数
                        // 是实例的话里面 reject()
                        // 这里是最重要的 因为 promise 实例 是改变过
                        // 状态的
                        // console.log("yyy") => 没有实现的原因是 同步加载 promise 
                        // 实例上先注册了 两个 回调函数
                        // 但是 如果 我这样的写法 后来的 promise 实例上并没有注册这
                        // 两个方法 一旦进行覆盖的话 注册的方法 就会被后面的 实例
                        // 空注册 覆盖掉
                        // 但是 我用下面这样的方式会照成 先创建的 promise 实例在初始化的时候
                        // 就已经 赋值为 this.value = null 
                        // 后面在初始化的时候 this.value = data  有值的情况
                        // 前面的 null 值覆盖了后面的 this.value = data 值 

                        // 这几句话是非常的主要 ***** 
                        newPromise.value = prevThenResolveCallBackRes.value;
                        // 返回第一个参数对象  => 内存地址进行引用 指向该变了
                        newPromise = Object.assign(prevThenResolveCallBackRes, newPromise);
                        // console.log(newPromise)
                        // console.log("yyy")
                        // console.log("prevThenResolveCallBackRes:", prevThenResolveCallBackRes)
                        return;
                    }else{
                        resolve(prevThenResolveCallBackRes)
                    }
                }catch(e){
                    reject(e.message);
                }
            });

            _this.rejectedAry.push(()=>{
                try{
                    let prevThenRejectCallBackRes = rejectCallback(_this.value);
                    if (prevThenRejectCallBackRes instanceof Promise){
                        // console.log(_this.value)
                        // console.log("prevThenRejectCallBackRes:",prevThenRejectCallBackRes)
                        // console.log(newPromise)
                        newPromise = Object.assign(prevThenRejectCallBackRes, newPromise);
                        return;
                    }else{
                        // console.log("xx")
                        reject(prevThenRejectCallBackRes)
                    }
                }catch(e){
                    // console.log(e)
                    reject(e.message);
                    // console.log("xxx:",this.value)
                }
            })
            
            // console.log(_this.rejectedAry)
        });

        return newPromise

    }

    // 2）catch 方法的实现  then() 方法里面第二个参数可以不传 第一个参数不传的情况
    //    catch 就是相当于then 第一个参数不传递
    catch(rejectCallBack){
        // => 直接调用 then 方法 传递一个参数
        return this.then(null, rejectCallBack);
    }

    // 3） 静态方法 all 
    static all(promiseInstanceAry=[]){
        // all().then() 所以返回的是一个 promise 实例
        return new Promise((resolve,reject)=>{
            // 循环数组中的实例 判断数组中的 所有的promise 实例的状态
            let index = 0;
            let result = [];
            let errs = [];
            for(let i=0;i<promiseInstanceAry.length;i++){
                // let 里面是不会有 i 全局的问题的因为 let 有声明作用域
                // 单个实例 怎么判断当前的 promise 实例是成功还是失败呢？
                // 实例.then((res)=>{  这个函数的执行就是说明状态是成功  })
                // 失败 直接执行当前 all promise 实例
                // 所有的 promise 都需要成功 才会触发 all 里面的 promise 实例的 resolve方法
                promiseInstanceAry[i].then((data)=>{
                    index ++;
                    result[i] = data;
                    if (index === promiseInstanceAry.length){
                        resolve(result)
                    }
                },(err)=>{
                    console.log("sfgg");
                    // 这里只是执行一次的原因是: 一次 reject() 之后 已经是修改了
                    // 当前 all 里面 promise 实例的状态 
                    // 状态已经是 从 pending -> rejected 状态
                    // 其他的 实例对象已经不能在通过方法去修改他的状态
                    // 状态不为pending直接是 return 不再进行执行
                    // ***** 重要  
                    // 相当于 reject()  reject() reject() 但是 一个 promise 的实例
                    // 的状态被修改了 在去修改 这个实例是 直接 return 的 
                    errs[i] = err
                    reject(errs);
                });
                // 那么怎么样才能确认他是全部成功的呢?
                // 简单计数呗
                
            }
        })
    }

}

module.exports = Promise;


/* 
    new Promise((resolve,resject)=>{
        resolve(data)|reject(err)
    }).then(
        (data)=>{
            
        },
        (err)=>{
             
        }
    )
    
    resolve()异步代码
    {

    }

    then(resolvecall,rejectcall){
        // 简而言之：就是根据 resolvecall() 函数的执行状态和执行结果 来确定
        // then 里面的 resolvecallback( ) 就是用来修改状态新的promise实例的状态 和
        // 或者 自己手动返回的是 promise 实例 是覆盖原来的 promise 
        // 自己手动的就是携带状态的不需要在 去修该原来 promise 实例 只是需要覆盖原来的
        // promise 的实例就可以 
        
        resolvecall() 函数执行分为两种情况:
            函数执行的没有出现错误： 函数返回值不是 promise 实例的时候 then() 里面的新promise实例状态修改为resolve("xx")
                                  函数返回值是 promise 实例的情况   那么then里面新的promise实例的状态是什么呢？
                                  应该做什么操作呢？
                                   

            函数执行出现错误     ： 改变 then() 里面新的 promise 实例为 resject()

        // 里面(实例的状态）
        return new Promise((resolve,reject){
            这段代码注册到异步代码块进行执行 根据上一次 resolvecall 函数的执行状况
            来判断接下来应该执行 then里面新的 promise 的状态
            如果返回值不是 promise 实例的话 新的 resolve(val)
            如果返回值是 promise 的实例的话 

            在异步的代码块中只有 resolve() 才是在操作 then 里面新的 promise 实例
            {
                
            }
        })
    }

    真正需要异步的是：
                    status
                    resolveAry 
                    rejectAry 
                在同步的过程中 promise 实例是一个`空壳对象`

                data = null
                rejectAry = []
                resolve = []
*/