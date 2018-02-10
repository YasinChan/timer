/*
* 计时倒计时插件
* example:
*
* new Timer(el, {
*     startTime: 0,    // { Number }  初始时间  Default: 0
*     isTimer: true,   // { Boolean } 计时：true 倒计时：false  Default: true
*     formate: 's',       // { String }  时间类型 Default: s     d：天；h：小时；m：分钟；s：秒；ss：毫秒
*
* })
*
* */



function Timer(el, opts) {
    this.el = el;
    this.opts = opts || {};
    this.init();
}
Timer.prototype = {
    init: function () {
        // this.reqAniFra = null;  // 记录 requestAnimationFrame 返回值
        this.arrIdx = ['d','h','m','s','ss'];
        this.diff = 0;            
        this.isMillisecond = false;         // 记录 是否有毫秒 如果有，则需要保留两位小数 默认是无毫秒
        this.spacingTime = 0;          // 间隔时间 或者说是 已用时间
        this.startTime = this.opts.startTime || 0;
        this.isTimer = this.opts.isTimer;
        this.formate = this.opts.formate || 's';

        this.render();
    },
    render: function () {
        var _this = this;
        if(this.reqAniFra) {
            cancelAnimationFrame(this.reqAniFra)
        }
        this.timerUpdate(this.startTime)
        this.startDataNow = Date.now();
        if(this.formate.indexOf('/') > -1) {
            this.formatArr = this.formate.split('/');
        }else {
            this.formatArr = this.formate
        }
        
        for(var i=0;i<this.formatArr.length;i++) {
            if(this.arrIdx.indexOf(this.formatArr[i]) == -1) {
                throw 'format 格式有误'
            } 
        }

        var isTimer;
        if(this.isTimer == undefined) {
            isTimer = true
        }else {
            isTimer = this.isTimer
        }
        if(this.formate.indexOf('ss') > -1) {   // 判断是否有毫秒
            this.isMillisecond = true;
            if(isTimer) {
                _this.startTimer(0)
            }else {
                _this.startTimer(1)
            }
        }else {
            this.isMillisecond = false;
            if(isTimer) {
                _this.startTimer(2)
            }else {
                _this.startTimer(3)
            }
        }
    },
    /**
     * 计时开始
     * @param {string} type -类型 0：毫秒/计时； 1：毫秒/倒计时； 2：秒/计时； 3：秒/倒计时；
     * 
     */
    startTimer: function(type) {
        var _this = this;
        this.settedStartTime = this.startTime;
        this.reqAniFra = requestAnimationFrame(function fn() {
            _this.diff = Date.now() - _this.startDataNow;
            switch(type) {
                case 0: _this.spacingTime = _this.settedStartTime + Number((_this.diff * 0.001).toFixed(2));
                break;
                case 1: _this.spacingTime = _this.settedStartTime - Number((_this.diff * 0.001).toFixed(2));
                break;
                case 2: _this.spacingTime = _this.settedStartTime + Math.trunc(Number(_this.diff * 0.001));
                break;
                case 3: _this.spacingTime = _this.settedStartTime - Math.trunc(Number(_this.diff * 0.001));
                break;
            }
            if (_this.spacingTime < 0) {
                window.cancelAnimationFrame(_this.reqAniFra)
                // 更新时间为0，以免结束时，显示非零的时间
                _this.spacingTime = 0;
                _this.timerUpdate(_this.spacingTime,type);
                return;
            }
            // TODO: 此处放渲染 html 的方法。
            _this.timerUpdate(_this.spacingTime,type);
            // return this.reqAniFra;
            _this.reqAniFra = requestAnimationFrame(fn);
        })
    },

    /**
     * 渲染计时/倒计时HTML
     */
    timerUpdate: function(time) {
        var formatTime = this.getFormateTime(time)
        this.updateTimerDom(formatTime)
    },
    /**
     * 获取时间类型模板
     */
    getFormateTime: function(time) {
        var time = Number(Number(time).toFixed(2));
        var d = Math.floor(time/24/3600),
            d = d<10?('0'+d):d,

            h1 = Math.floor(time/3600),
            h1 = h1<10?('0'+h1):h1,

            h2 = Math.floor((time-d*24*3600)/3600),
            h2 = h2<10?('0'+h2):h2,
            
            m1 = Math.floor(time/60),
            m1 = m1<10?('0'+m1):m1,
            
            m2 = Math.floor((time-h1*3600)/60),
            m2 = m2<10?('0'+m2):m2,
            
            m3 = Math.floor((time-d*24*3600-h2*3600)/60),
            m3 = m3<10?('0'+m3):m3,
            
            s1 = Math.floor(time-m1*60),
            s1 = s1<10?('0'+s1):s1,
            
            s2 = Math.floor(time-h1*3600-m2*60),
            s2 = s2<10?('0'+s2):s2,
            
            s3 = Math.floor(time-d*24*3600-h2*3600-m3*60),
            s3 = s3<10?('0'+s3):s3,

            s4 = Math.floor(time),
            s4 = s4<10?('0'+s4):s4,
            
            ss = Math.round((time - Math.floor(time))*100),
            ss = ss<10?('0'+ss):ss;
        
        var hadD = this.formate.indexOf('d')>-1?true:false,
            hadH = this.formate.indexOf('h')>-1?true:false,
            hadM = this.formate.indexOf('m')>-1?true:false,
            hadS = this.formate.indexOf('s')>-1?true:false,
            hadSS = this.formate.indexOf('ss')>-1?true:false;
        
        if(hadS && !hadM && !hadH && !hadD) {           // s
            return (this.isMillisecond ? s4 + ':' + ss : s4)
        }else if(hadS && hadM && !hadH && !hadD) {      // m/s
            return (this.isMillisecond ? m1 + ':' + s1 + ':' + ss : m1 + ':' + s1)
        }else if(hadS && hadM && hadH && !hadD) {       // h/m/s
            return (this.isMillisecond ? h1 + ':' + m2 + ':' + s2 + ':' + ss : h1 + ':' + m2 + ':' + s2)
        }else if(hadS && hadM && hadH && hadD) {        // d/h/m/s
            return (this.isMillisecond ? d + ':' + h2 + ':' + m3 + ':' + s3 + ':' + ss : d + ':' + h2 + ':' + m3 + ':' + s3)
        }else if(!hadS && hadM && !hadH && !hadD) {        // m
            return m3
        }else if(!hadS && hadM && hadH && !hadD) {        // h/m
            return (h1 + ':' + m2)
        }else if(!hadS && hadM && hadH && hadD) {        // d/h/m
            return (d + ':' + h2 + ':' + m3)
        }else if(!hadS && !hadM && hadH && !hadD) {        // h
            return h1
        }else if(!hadS && !hadM && hadH && hadD) {        // d/h
            return (d + ':' + h2)
        }else if(!hadS && !hadM && !hadH && hadD) {        // d
            return d
        }
    },
    updateTimerDom: function(val) {
        this.el.innerText = val
    },
    destory: function() {
        if(this.reqAniFra) cancelAnimationFrame(this.reqAniFra);
    }
}



