# 计时器/倒计时插件

### 使用方法

```
new Timer(el, {
    startTime: 0,    // { Number }  初始时间  Default: 0
    isTimer: true,   // { Boolean } 计时：true 倒计时：false  Default: true
    type: 's',       // { String }  渲染类型 Default: s     
                     // d：天；h：小时；m：分钟；s：秒；ss：毫秒
                     // 使用 / 号隔断； 如： [小时：分钟：秒] [=> h/m/s]
})
```


