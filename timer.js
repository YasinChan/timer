/*
* 计时倒计时插件
* example:
*
* new Timer(el, {
*     startTime: 0,    // { Number }  初始时间  Default: 0
*     isTimer: true,   // { Boolean } 计时：true 倒计时：false  Default: true
*     type: 's',       // { String }  渲染类型 Default: s     d：天；h：小时；m：分钟；s：秒；ss：毫秒
*
* })
*
* */


(function () {

    function Timer(el, opts) {
        this.el = el;
        this.opts = opts;
        this.init();
    }
    Timer.prototype = {
        init: function () {
            this.reqAniFra = null;  // 记录 requestAnimationFrame 返回值
            this.isMillisecond = false;         // 记录 是否有毫秒 如果有，则需要保留两位小数 默认是无毫秒
            this.spacingTime = 0;          // 间隔时间 或者说是 已用时间
            this.startTime = this.opts.startTime || 0;
            this.isTimer = this.opts.isTimer || true;
            this.type = this.opts.type || 's';

            this.start();
        },
        start: function () {
            var _this = this;
            
            if(this.type.indexOf('ss') > -1) {
                this.isMillisecond = true
            }
            this.reqAniFra = requestAnimationFrame(function fn() {
                _this.diff = Date.now() - view.startTime;
                if(!_this.isMillisecond) {
                    _this.spacingTime = _this.startTime - Math.trunc(Number(_this.diff * 0.001))
                }else {
                    _this.spacingTime = _this.startTime - Number((_this.diff * 0.001).toFixed(2))
                }
            })
            if (detail.spacingTime <= 0) {
                window.cancelAnimationFrame(_this.reqAniFra)
                // 更新时间为0，以免结束时，显示非零的时间
                detail.spacingTime = 0;
                return;
            }
            // TODO: 此处放渲染 html 的方法。
            _this.reqAniFra = requestAnimationFrame(fn);
        }
    }



})()