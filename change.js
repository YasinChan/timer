//自开发组件
epub360.PlayerPlugins.push({
    /**
     * @lends view
     */
    config:{
        type:'Timer',
        // Model:'Timer',
        template:'Timer' ,//可以使用一些一些已有元素的模板,比如 "Image", "Button", "Paragraph", 默认的模板是'Container', 'others' :隐藏元素不显示  模板位于 /interaction_view/template/t.js
        model_object:{
            setcollection:function(){
                if(!iOverlaylist.get(this.id)) iOverlaylist.add(this);
            },
            setview:function(type){
                this.iview=new interaction_view.view.Timer({model:this});
            }
        }
    },
    render:function(fileid){
		var detail = this.getdetail();
		this.iHorizontal = ["left", "center", "right"];
		this.$el.find(".Element")
			.css("font-size", detail.font_size)
			.css("color", detail.font_color)
			.css("text-align", this.iHorizontal[detail.iPosition]);

		if(detail.iKind == 0 || detail.iKind == 1) {
			this.updateTimerDom(detail.formatTime, detail.iKind, detail.format);
		}else if(detail.iKind == 2){
			this.updateTimerDom(detail.arrive, detail.iKind, detail.countdownformat);
		}else {
			this.updateTimerDom('',detail.iKind, detail.timeType)
		}
		this.model._reset=true;
	},
	resetOtherStatus: function(){
		var detail = this.getdetail();
		if(detail.iKind == 2) return;
		this.clearTimer();
		this.Interval = false;	// for timer update
		this.Status = -1;	// -1:init, 0:ready, 1:start, 2:paused, 3:finished
		this.Suspend = false;	// for such as page onStart action

		// frame越大越好，越大计时器越不会被阻塞
		// 计时单位为妙时，frame也为1秒即可
		if(detail.format == 2 || detail.format == 4)
			this.frame = 0.01;
		// 计时单位为毫秒时，frame要适中
		else
			this.frame = 1;
	},
	startTimer: function(){
        var view = this, cache1=0, cache2=0,
            detail = this.getdetail();
        var timerUpdate = function () {
            view.updateTimer();
            view.Actions_16.length && interaction_view.events.onTimerCountTo(view);
            // 保证一开始不会触发
            (detail.currentTime != detail.initial) && view.Actions_18.length && interaction_view.events.onTimerInterval(view, detail.currentTime - detail.initial);
        }
        // var timerCountdown = function () {
        //     if (!view.Interval)
        //         return;
        //
        //     if (view.currentTime <= 0) {
        //         // 更新时间为0，以免结束时，显示非零的时间
        //         view.currentTime = 0;
        //         view.updateTimer();
        //
        //         view.stopTimer();
        //         return;
        //     }
        //     view.currentTime -= view.frame;
        //     _setTimeout(timerCountdown, view.frame);
        //     timerUpdate();
        // }

        var countdownDown = function () {
            if (!view.Interval)
                return;

            view.settedStartTime = detail.currentTime;
            // window.clearTimeout(view.settimeoutId)
            // if (view.currentTime <= 0) {
            //     // 更新时间为0，以免结束时，显示非零的时间
            //     view.currentTime = 0;
            //     view.updateTimer();
            //
            //     view.stopTimer();
            //     return;
            // }



            // view.setintervalId = window.setInterval(function () {
            // 	// debugger;
            // 	view.diff = Date.now() - view.startTime;
            // 	if(view.frame == 1) {
            //         view.currentTime = view.settedStartTime - Number((view.diff * 0.001).toFixed())
				// }else {
            //         view.currentTime = view.settedStartTime - Number((view.diff * 0.001).toFixed(2))
				// }
            //     if (view.currentTime <= 0) {
            // 		window.clearInterval(view.setintervalId)
            //         // 更新时间为0，以免结束时，显示非零的时间
            //         view.currentTime = 0;
            //         view.updateTimer();
            //
            //         view.stopTimer();
            //         return;
            //     }
            //     timerUpdate();
            // }, view.frame * 1000)



            view.ft = 0

            view.reqAniFra = requestAnimationFrame(function fn(){
            	// debugger;
                view.diff = Date.now() - view.startTime;
                view.ft += 1/60
                if(view.frame == 1) {
                    // if(Number(view.ft.toFixed(3)) % 1 == 0) {
					detail.currentTime = view.settedStartTime - Math.trunc(Number(view.diff * 0.001))

                    // }
                }else {
                    detail.currentTime = view.settedStartTime - Number((view.diff * 0.001).toFixed(2))
                }
                if (detail.currentTime <= 0) {
                    window.cancelAnimationFrame(view.reqAniFra)
                    // 更新时间为0，以免结束时，显示非零的时间
                    detail.currentTime = 0;
                    view.updateTimer();
                    view.stopTimer();
                    return;
                }
                timerUpdate();
                view.reqAniFra = requestAnimationFrame(fn);
            });




            // view.currentTime -= (view.now - view.startTime)
            // timerUpdate();
        }
        //
        // var timerCountup = function () {
        //     if (!view.Interval)
        //         return;
        //
        //     view.currentTime += view.frame;
        //     _setTimeout(timerCountup, view.frame);
        //     timerUpdate();
        // }

        var countdownUp = function () {
            if (!view.Interval)
                return;

            view.settedStartTime = detail.currentTime;
            // window.clearTimeout(view.settimeoutId)
            // if (view.currentTime <= 0) {
            //     // 更新时间为0，以免结束时，显示非零的时间
            //     view.currentTime = 0;
            //     view.updateTimer();
            //
            //     view.stopTimer();
            //     return;
            // }


            // view.setintervalId = window.setInterval(function () {
            //     // debugger;
            //     view.diff = Date.now() - view.startTime;
            //     if(view.frame == 1) {
            //         view.currentTime = view.settedStartTime + Number((view.diff * 0.001).toFixed())
            //     }else {
            //         view.currentTime = view.settedStartTime + Number((view.diff * 0.001).toFixed(2))
            //     }
            //     // if (view.currentTime <= 0) {
            //     //     window.clearInterval(view.setintervalId)
            //     //     // 更新时间为0，以免结束时，显示非零的时间
            //     //     view.currentTime = 0;
            //     //     view.updateTimer();
            //     //
            //     //     view.stopTimer();
            //     //     return;
            //     // }
            //     timerUpdate();
            // }, view.frame * 1000)



			view.ft = 0

			view.reqAniFra = requestAnimationFrame(function fn(){
                view.diff = Date.now() - view.startTime;
                view.ft += 1/60
				if(view.frame == 1) {
                    // if(Number(view.ft.toFixed(3)) % 1 == 0) {
                    detail.currentTime = view.settedStartTime + Math.trunc(Number(view.diff * 0.001))
					// }
				}else {
                    detail.currentTime = view.settedStartTime + Number((view.diff * 0.001).toFixed(2))
				}
                timerUpdate();
                view.reqAniFra = requestAnimationFrame(fn);
            });


            // view.currentTime -= (view.now - view.startTime)
            // timerUpdate();
        }

        var timerCurrent = function () {
// debugger;
            _setTimeout(timerCurrent);
            view.updateTimerDom('',detail.iKind, detail.timeType)
        }
        // 不能立即开始计时，不然会有上一个计时还未终结的可能
        var _startTimer = function () {
            view.Interval = true;

            if (detail.iKind == 1) {
                // timerCountdown();  // old
                countdownDown()   // new
            }else {
                // timerCountup();  // old
                countdownUp(); //new
            }
        }
        var _setTimeout = function (callback, frame) {
            // if(typeof TweenMax != "undefined")
            // 	TweenMax.to("", frame, {onComplete:callback});
            // else
			if(view.Timeout) window.clearTimeout(view.Timeout); // 不要重复计时
            view.Timeout = setTimeout(callback, frame * 1000);
        }

        // var countdownStart = function (callback, frame) {
        //     view.now = Date.now();
        //     view.clearintervalcount = window.setTimeout(callback, frame * 1000);
        // }

		if(detail.iKind==3) {
        	
            timerCurrent()
		}else {
            // 已经开始，或者已经结束，则返回
            if (this.Status == 1 || this.Status == 3)
                return;

            // 定时器需要从resetTimer中启动
            if (this.Status == -1) {
                this.Suspend = true;
                return;
            }

// debugger;
            view.startTime = Date.now();  // new
            _startTimer()  // new

            // _setTimeout(_startTimer, view.frame);      // old
            // 可能用户设置了初始时间触发器
            view.Actions_16.length && interaction_view.events.onTimerCountTo(view);
            // 每次启动计时器都会触发onTimerStart
            interaction_view.events.onTimerStart(this);
            this.Status = 1;
        }
	},
	// when page stop, should stop timer as well
	stopTimerSimple: function(){
		if(this.Status == 2 || this.Status == 3 || this.Status == -1)
			return false;
		this.clearTimer();
		this.Status = 2;
		return true;
	},
	stopTimer: function(){
		if(this.stopTimerSimple())
		{
			interaction_view.events.onTimerStop(this);
			this.Status = 3;
		}
	},
	resetTimer: function(){
		var view = this,
			detail = this.getdetail();
		
		if(detail.iKind == 2) {
			// this.Actions_17 = interaction_view.events.timerEvents
			return;
		}if(detail.iKind == 3) {
            this.startTimer();
		}else {
            this.clearTimer();
            detail.currentTime = detail.initial = Number(Number(detail.initial).toFixed(2));
            this.Status = 0;
            this.updateTimer();
            if (!this.gotTimerActions) {
                function _filte(i, type) {
                    if (!(i.overlay_id == view.model.id && i.type == type))
                        return false;
                    if (view.model.page.isLayer)
                        return i.layer_id == view.model.page.iOverlaylist.layerid;
                    return i.page_id == view.model.page.id;
                }

                this.Actions_16 = _.filter(interaction_view.events.timerEvents, function (i) {
                    return _filte(i, 16) && i.condition >= 0;
                });
                this.Actions_18 = _.filter(interaction_view.events.timerEvents, function (i) {
                    return _filte(i, 18) && i.condition > 0;
                });
                this.Actions_17 = _.filter(interaction_view.events.timerEvents, function (i) {
                    return _filte(i, 17);
                });
                this.Actions_19 = _.filter(interaction_view.events.timerEvents, function (i) {
                    return _filte(i, 19);
                });

                // 对于间隔计时，需要确保单位正确（一位小数）
                view.Actions_18.forEach(function (v, i) {
                    v.condition = Number(Number(v.condition).toFixed(2));
                });
                this.gotTimerActions = true;
            }

            // 初始化完成，立即启动定时器，除非没有勾选“自动启动”属性
            if (detail.iAutoStart || this.Suspend)
                this.startTimer();
            this.Suspend = false;
        }
	},
	updateTimer: function(){
		var detail = this.getdetail();
		detail.formatTime = this.getFormatTime(detail.currentTime, detail.format);
		this.updateTimerDom(detail.formatTime, detail.iKind, detail.format);
	},
	updateTimerDom: function(time,kind,format){
		var detail = this.getdetail();
		if(kind == 1 || kind == 0){
			this.$el.find(".Element").html(time);
		}else if(kind==2){
			// var countdownlen = $(this.$el.siblings()).find('.countdown-class').length;
			// var gettingStartedIdx;
			// if(countdownlen > 0) {
			// 	gettingStartedIdx = 'getting-started' + (countdownlen+1)
			// }else {
			// 	gettingStartedIdx = 'getting-started1'
			// }
			this.$el.find(".Element").html('<div class="countdown-class"></div>')
			// .css('font-family', this.getdetail().font_family);
			// 
			this.getCuntdownFormatTime(time, format, detail.dateTYPE, detail.dateStyle);
		}else {
			
            this.$el.find(".Element").html('<div class="current_time_content"></div>')
            this.setCurrentTypeTime(format)
		}
	},
	getCuntdownFormatTime: function(time, format, type, style) {
		var view = this;
		var arrivetime
		if(time == '') {
			arrivetime = '2017/12/12 00:00:00' 
		}else{
			// var date = {};
			// date.yyyy = time.split('-')[0]
			// date.mm = time.split('-')[1]
			// date.dd = time.split('-')[2].split('/')[0]
			// date.hh = time.split('-')[2].split('/')[1].split(':')[0]
			// date.ii = time.split('-')[2].split('/')[1].split(':')[1]
			// date.ss = '00'

			var timeformat;
			// arrivetime = date.yyyy + '/' + date.mm + '/' + date.dd + ' ' + date.hh + ':' + date.ii + ':' + date.ss
			arrivetime = time;
		}
		switch(style) {
			case 1:
				formatClass = 'format-class1'
				modifyClass = 'modify-class1';
				break;
			case 2:
				formatClass = 'format-class2';
				modifyClass = 'modify-class2';
				break;
			case 3:
				formatClass = 'format-class3';
				modifyClass = 'modify-class3';
				break;
			case 4:
				formatClass = 'format-class4';
				modifyClass = 'modify-class4';
				break;
			default:
				formatClass = 'format-classx';
				modifyClass = 'modify-classx';
		}

		switch(Number(format))
		{
			case 0:		// 日
				timeformat = '<div style="display:inline-block;text-align: center;"><span class="'+formatClass+'">%D</span> <span class="' + modifyClass + '">天</span></div>';
				break;
			case 1:		// 时
				timeformat = '<div style="display:inline-block;text-align: center;"><span class="'+formatClass+'">%I</span> <span class="'+modifyClass+'">小时</span></div>';
				break;
			case 2:		// 时 : 分 : 秒
				timeformat = '<div style="display:inline-block;text-align: center;"><span class="'+formatClass+'">%I</span> <span class="'+modifyClass+'">小时</span></div> <div style="display:inline-block;text-align: center;"><span class="'+formatClass+'">%M</span> <span class="'+modifyClass+'">分</span></div> <div style="display:inline-block;text-align: center;"><span class="'+formatClass+'">%S</span> <span class="'+modifyClass+'">秒</span></div>';  // '%I:%M:%S  '%I  %M 分 %S 秒
				break;
			case 3:		// 日 : 时 : 分 : 秒
				timeformat = '<div style="display:inline-block;text-align: center;"><span class="'+formatClass+'">%D</span> <span class="'+modifyClass+'">天</span></div> <div style="display:inline-block;text-align: center;"><span class="'+formatClass+'">%H</span> <span class="'+modifyClass+'">小时</span></div> <div style="display:inline-block;text-align: center;"><span class="'+formatClass+'">%M</span> <span class="'+modifyClass+'">分</span></div> <div style="display:inline-block;text-align: center;"><span class="'+formatClass+'">%S</span> <span class="'+modifyClass+'">秒</span></div>';
				break;
			case 4:		// 周 : 日 : 时 : 分 : 秒
				timeformat = '<div style="display:inline-block;text-align: center;"><span class="'+formatClass+'">%w</span> <span class="'+modifyClass+'">周</span></div> <div style="display:inline-block;text-align: center;"><span class="'+formatClass+'">%d</span> <span class="'+modifyClass+'">天</span></div> <div style="display:inline-block;text-align: center;"><span class="'+formatClass+'">%H</span> <span class="'+modifyClass+'">小时</span></div> <div style="display:inline-block;text-align: center;"><span class="'+formatClass+'">%M</span> <span class="'+modifyClass+'">分</span></div> <div style="display:inline-block;text-align: center;"><span class="'+formatClass+'">%S</span> <span class="'+modifyClass+'">秒</span></div>';
				break;
			case 5:		// 日 : 时 : 分 : 秒
                timeformat = '<div style="display:inline-block;text-align: center;"><span class="' + formatClass + '">%D</span> <span class="' + modifyClass + '">day</span></div> <div style="display:inline-block;text-align: center;"><span class="' + formatClass + '">%H</span> <span class="' + modifyClass + '">hr</span></div> <div style="display:inline-block;text-align: center;"><span class="' + formatClass + '">%M</span> <span class="' + modifyClass + '">min</span></div> <div style="display:inline-block;text-align: center;"><span class="' + formatClass + '">%S</span> <span class="' + modifyClass + '">sec</span></div>';
				break;
			case 6:		// 周 : 日 : 时 : 分 : 秒
				timeformat = '<div style="display:inline-block;text-align: center;"><span class="'+formatClass+'">%w</span> <span class="'+modifyClass+'">week</span></div> <div style="display:inline-block;text-align: center;"><span class="'+formatClass+'">%d</span> <span class="'+modifyClass+'">day</span></div> <div style="display:inline-block;text-align: center;"> <span class="'+formatClass+'">%H</span> <span class="'+modifyClass+'">hr</span></div> <div style="display:inline-block;text-align: center;"> <span class="'+formatClass+'">%M</span> <span class="'+modifyClass+'">min</span></div> <div style="display:inline-block;text-align: center;"><span class="'+formatClass+'">%S</span> <span class="'+modifyClass+'">sec</span></div>';
				break;
		}
		
		// $(this.$el.find('.countdown-class')).countdown(arrivetime, function(event) {
		// 	$(this).html(event.strftime(timeformat));
		// }).on('finish.countdown', function() {
		// 	var events = _.filter(interaction_view.events.timerEvents,function(i){
		// 		return interaction_view.events.filterType(view,i,17);
		// 	})
		// 	//this.Actions_17 = interaction_view.events.timerEvents
		// 	//interaction_view.events.onTimerStop(this)
		// 	for(var j=0;j<events.length;j++){
		// 		events[j].func();
		// 	}
		// });
		countdown.deploy(
			{
				$el: $(this.$el.find('.countdown-class')),
				date: arrivetime,
				format: timeformat,   
				dateType: type,
				callback:function(){
					var events = _.filter(interaction_view.events.timerEvents,function(i){
						return interaction_view.events.filterType(view,i,17);
					})
					//this.Actions_17 = interaction_view.events.timerEvents
					//interaction_view.events.onTimerStop(this)
					for(var j=0;j<events.length;j++){
						events[j].func();
					}
				}
			}
		)

		// switch(Number(format)) {
		// 	case 0:    // 日
		// 		return 
		// }
	},
	clearTimer: function(){
		this.Interval = false;
		this.Timeout && window.clearTimeout(this.Timeout);
		// this.Interval && clearInterval(this.Interval);
        this.reqAniFra && window.cancelAnimationFrame(this.reqAniFra)
	},
	getFormatTime: function(time, format){
		// var h, m, s, ss;

		var time = Number(Number(time).toFixed(2));
		// if(time <= 0)
		// 	h = m = s = ss = 0;
		// else
		// {
		// 	h = Math.floor(time/3600);
		// 	m = Math.floor((time - h*3600)/60);
		// 	s = Math.floor(time - h*3600 -m*60);
		// }

		// switch(Number(format))
		// {
		// 	case 0:		// mm:ss
		// 		return ((m<10?("0"+m):m) + ":" + (s<10?("0"+s):s));
		// 		break;
		// 	case 1:		// mm:ss:SS
		// 		ss = Math.round((time - Math.floor(time))*100);
		// 		return ((m<10?("0"+m):m) + ":" + (s<10?("0"+s):s) + ":" + (ss<10?("0"+ss):ss));
		// 		break;
		// 	case 2:		// hh:mm:ss
		// 		return ((h<10?("0"+h):h) + ":" + (m<10?("0"+m):m) + ":" + (s<10?("0"+s):s));
		// 		break;
		// 	case 3:		// hh:mm:ss:SS
		// 		ss = Math.round((time - Math.floor(time))*100);
		// 		return ((h<10?("0"+h):h) + ":" + (m<10?("0"+m):m) + ":" + (s<10?("0"+s):s) + ":" + (ss<10?("0"+ss):ss));
		// 		break;
		// }

		var d = Math.floor(time/24/3600),
		h1 = Math.floor(time/3600),
		h2 = Math.floor((time-d*24*3600)/3600),
		m1 = Math.floor(time/60),
		m2 = Math.floor((time-h1*3600)/60),
		m3 = Math.floor((time-d*24*3600-h2*3600)/60),
		s1 = Math.floor(time-m1*60),
		s2 = Math.floor(time-h1*3600-m2*60),
		s3 = Math.floor(time-d*24*3600-h2*3600-m3*60),
		ss = Math.round((time - Math.floor(time))*100);

		switch(Number(format))
		{
			case 0:		// 秒
				return (time<10?("0"+time):time);
				break;
			case 1:		// 分 : 秒
				return ((m1<10?("0"+m1):m1) + ":" + (s1<10?("0"+s1):s1));
				break;
			case 2:		// 分:秒:毫秒
				return ((m1<10?("0"+m1):m1) + ":" + (s1<10?("0"+s1):s1) + ":" + (ss<10?("0"+ss):ss));
				break;
			case 3:		// 时:分:秒
				return ((h1<10?("0"+h1):h1) + ":" + (m2<10?("0"+m2):m2) + ":" + (s2<10?("0"+s2):s2));
				break;
			case 4:		// 时:分:秒:毫秒
				return ((h1<10?("0"+h1):h1) + ":" + (m2<10?("0"+m2):m2) + ":" + (s2<10?("0"+s2):s2) + ":" + (ss<10?("0"+ss):ss));
				break;
			case 5:		// 日:时:分:秒
				return ((d<10?("0"+d):d) + ":" + (h2<10?("0"+h2):h2) + ":" + (m3<10?("0"+m3):m3) + ":" + (s3<10?("0"+s3):s3));
				break;
			
		}
	},
    setCurrentTypeTime:function (value) {
		
        var newDate = new Date(),
            month = (Number(newDate.getMonth()) + 1) < 10 ? '0' + (Number(newDate.getMonth()) + 1) : Number(newDate.getMonth()) + 1,
            date = Number(newDate.getDate()) < 10 ? '0' + Number(newDate.getDate()) : Number(newDate.getDate()),
            hour = Number(newDate.getHours()) < 10 ? '0' + Number(newDate.getHours()) : Number(newDate.getHours()),
            minute = Number(newDate.getMinutes()) < 10 ? '0' + Number(newDate.getMinutes()) : Number(newDate.getMinutes()),
            week = newDate.getDay();
        switch (Number(week)) {
            case 0:
                week = '日';
                break;
            case 1:
                week = '一';
                break;
            case 2:
                week = '二';
                break;
            case 3:
                week = '三';
                break;
            case 4:
                week = '四';
                break;
            case 5:
                week = '五';
                break;
            case 6:
                week = '六';
                break;
        }

        switch (value) {
            case 0:
                this.$el.find('.current_time_content').html(hour + ':' + minute);
                break;
            case 1:
                this.$el.find('.current_time_content').html(month + '月' + date + '日');
                break;
            case 2:
                this.$el.find('.current_time_content').html('星期' + week);
				break;
			case 3:
                this.$el.find('.current_time_content').html(month + '月' + date + '日' + ' ' + '星期' + week);
                break;
        }
    }
})