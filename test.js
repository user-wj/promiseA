const Promise = require("./promise.js");

// var p1 = new Promise((resolveFn,rejectFn)=>{
//     // 两个函数都会执行只是 在状态不为 pending 的时候
//     // 这其中一个函数是return 的
//     // resolveFn("200");
//     rejectFn("100");

// })

// console.log("p1",p1)
// var p2 = p1.then(
//     // 这里面的方法是异步里面的微任务
//     // 这里要注意这里的回调函数是要在 resolveFn
//     // 函数里面执行的
//     (data)=>{
//         setTimeout(() => {
//             throw new Error("asdffy")
//         }, 0);
//         // console.log("data:",data);
//         // return new Promise((resolveFn,rejectFn)=>{
//         //     // console.log("6666")
//         //     resolveFn("xxx")
//         //     // reject("xxx")
//         // })
//         // console.log(data);
//         // throw new Error("xxx")
//         // return "11"
//         // return data
//     } 
// ).catch((err) => {
//     console.log(err)
// })

// console.log("p1:",p1)

// var p3 = p2.then(
//     (data)=>{console.log("data:",data) },
// )

// var p4 = p3.then((data) => { console.log("data:", data) },
//     (err) => { console.log("err:", err) })

// 但是这里的话出现了一个问题 就是 excutorCallback
// 和 then 方法是同步执行的 是先执行的 excutor 里面
// 函数 进而执行了 resoveFn 此时 resolveFn 里面根本没有
// then 方法里面的 函数参数  因为 then 方法是在后面
// 根本还没有执行到 then 方法
// 怎么样才能在当前的代码快中拿到后面的代码
// 异步：当前代码快变为异步 等待后面的同步的任务先执行完成
// 才会走当前的异步操作
// 这就可以从当前的代码块中拿到后面的代码

// 需要在 then 里面进行参数的判断
// var p5 = p4.then(null,()=>{});
// // 使用的 p4 里面的 this.value = value => 并且
// // return 的
// p5.then(()=>{},null);

// <2>
let p4 = new Promise((resolve,reject)=>{
    // setTimeout(() => {
    //     reject("400")
    // }, 0);
    reject("404")
})

// 先执行 这个 promise <1>
let p5 = new Promise((resolve, reject) => {
    setTimeout(() => {
        // resolve("500")
        reject(500)
    }, 10);
});

// <3>
let p6 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve("600")
    }, 80);
});


Promise.all([p4,p5,p6]).then((res)=>{
    // res [是按照顺序数组里面的顺序来的]
    // 虽然他的执行是 p5 p4 p6
    // 但是输出的结果 是按照 参数数组 的顺序来输出的
    console.log(res);
},(err)=>{
    console.log(err);

});







