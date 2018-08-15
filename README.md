# 计时器/倒计时插件

[示例](https://yasinchan.github.io/timer/)

### 介绍

使用`requestAnimationFrame`替代传统的`setTimeout` `setInterval` 实现计时与倒计时功能。

### 原理

当函数初始化时，记录下此时的`Date.now()` ，通过`requestAnimationFrame`实现浏览器在渲染时的每一帧，运算一次此时的`Date.now()`，并与初始时间的相加减得到具体的差值，从而实现精确计算。

### 使用方法

```
new Timer(el)        // el 即为放置计时器的 Dom 容器
```

也可自定义相关配置如下

```
var timer = new Timer(el, {
    startTime: 0,    // { Number }  初始时间                 默认: 0
    isTimer: true,   // { Boolean } 计时：true 倒计时：false  默认: true
    type: 's',       // { String }  渲染类型                 默认: s     
                     // d：天；h：小时；m：分钟；s：秒；ss：毫秒
                     // 使用 / 号隔断； 如： [小时：分钟：秒] => [h/m/s]
})
```



由于使用了requestAnimationFrame 所以在全局下会有一个动画帧请求，可以通过此方法取消掉。

```
timer.destory()   
```

