;(function(window){
	window.peacock = _peacock = {};
	//获取浏览器类型
	var browser = function() {
	    var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
	    var isOpera = userAgent.indexOf("Opera") > -1;
	    if (isOpera) {
	        return "Opera"
	    }; //判断是否Opera浏览器
	    if (userAgent.indexOf("Firefox") > -1) {
	        return "FF";
	    } //判断是否Firefox浏览器
	    if (userAgent.indexOf("Chrome") > -1) {
	        return "Chrome";
	    }
	    if (userAgent.indexOf("Safari") > -1) {
	        return "Safari";
	    } //判断是否Safari浏览器
	    if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) {
	        return "IE";
	    }; //判断是否IE浏览器, ie10以下可以判断出来
	    if("ActiveXObject" in window || window.ActiveXObject){
	    	//ie11
	    	return "IE";
	    }
	    //如果都没出去返回
	    return "Can not judge";
	}
	_peacock.browser = browser;
	/**
	阻止向上冒泡
	*/
	function preventEvent(e) {
	    if (e && e.stopPropagation) {
	        e.stopPropagation()
	    } else {
	        window.event.cancelBubble = true
	    }
	}
	_peacock.preventEvent = preventEvent;
	/**
	阻止默认方法
	*/
	function preventDefault(e) {
	    if (e && e.preventDefault) {
	        e.preventDefault();
	    } else {
	        window.event.returnValue = false;
	        return false;
	    }
	}
	_peacock.preventDefault = preventDefault;
	
	/**
     * 动态加载css文件
     * 金术静
     */
	function loadDynamicStyles(url) {
	    var link = document.createElement("link");
	    link.type = "text/css";
	    link.rel = "stylesheet";
	    link.href = url;
	    document.getElementsByTagName("head")[0].appendChild(link);
	}
	_peacock.loadDynamicStyles = loadDynamicStyles;
	
	/**
	 * 动态加载js文件
	 * 金术静
	 */
	function loadDynamicJavascript(url) {
	    var script = document.createElement("script");
	    script.type = "text/javascript";
	    script.src = url;
	    document.getElementsByTagName("head")[0].appendChild(script);
	}
	_peacock.loadDynamicJavascript = loadDynamicJavascript;
	
	/*
	 * 自定义下拉框初始化
	 * 靳海月
	 */
	function initCommonSelect(ele,data) {
		var ele = ele?ele:'.common-select';
		$(ele).each(function() {
			var _this = $(this),
				selectInp = _this.children('.cm-select-form'),
				selectBtn = _this.children('.cm-select-btn'),
				selectBoxWrap = _this.children('.cm-selectBox-Wrap'),
				
				allSelectBtn = $('.cm-select-btn'),
				allSelectBoxWrap = $('.cm-selectBox-Wrap');
				
			// 初始化
			if(typeof data !== 'undefined') {			
				for(var i = 0; i < data.length; i++) {				
					selectBoxWrap.append('<li>'+data[i].text+'</li>');
				}
			}
			selectInp.val(selectBoxWrap.children('li:first-child').text());
			
			// 操作
			$(document).click(function() {
				allSelectBoxWrap.hide();
				allSelectBtn.removeClass('active');
			});
			
			selectInp.off('click').on('click', function(e) {
				preventEvent(e);
				toggleRotate();
			})
			.next().off('click').on('click', function(e) {
				preventEvent(e);
				toggleRotate();			
				selectInp.css({'border-color': '#d43f3a', 'background-color': '#fffdfd'});
				$(this).css({'color': '#e15b52'});
			});
			
			// 鼠标划入效果
			_this.children('.cm-select-form, .cm-select-btn').hover(function() {
				$(this).parent().css({'border-color': '#d43f3a'});
				selectInp.css({'background-color': '#fcf4f4'});
				selectBtn.css({'color': '#e15b52'});
				// 添加title
				selectInp.attr('title', $(this).val());
			}, function() {
				$(this).parent().css({'border-color': '#ccc'});
				selectInp.css({'background-color': '#fff'});
				selectBtn.css({'color': '#aaa'});
			})
			
			// 下拉操作
			selectBoxWrap.children('li').off('click').on('click', function() {
				selectInp.val($(this).text());
				selectBoxWrap.hide();
				selectBtn.removeClass('active');
			})
			
			// 内容过多时出现滚动条
			selectBoxWrap.niceScroll({cursorcolor: '#ccc'});		
			
			function toggleRotate() {
				if(selectBoxWrap.is(':visible') == true) {
					selectBoxWrap.hide();
					selectBtn.removeClass('active');
				}else {
					allSelectBoxWrap.hide();
					allSelectBtn.removeClass('active');
					selectBoxWrap.show();
					
					// 判断下拉菜单显示位置					
					if(selectInp.offset().top + selectInp.height()/2 - $(document).scrollTop() > ($(window).height() - 78)*2/3) {
						selectBoxWrap.css({'top': - selectBoxWrap.outerHeight()-1}).addClass('topActive');
					}else {
						selectBoxWrap.css({'top': '27px'}).removeClass('topActive');
					}
					selectBtn.addClass('active');
				}
			}
		})
	}
	_peacock.initCommonSelect = initCommonSelect;
	
	// 显示提示弹出层
	var showTipsLayer = function(msg, id) {
		layer.tips(msg, '#'+id, {
			tips: [2, '#ff6d5e'],
			time:0
		});
	};
	_peacock.showTipsLayer = showTipsLayer;
	var hideAllTip = function(){
		layer.closeAll('tips');
	}
	_peacock.hideAllTip = hideAllTip;
	
	
	//初始化zTree树状结构---带 checkbox复选框 的多选下拉菜单
	/**
	 * id   下拉树ul的id
	 * data  下拉树中的数据
	 * options  一些常规的配置项  
	 * 			options.id    树状菜单每条数据节点的id字段名，唯一的
	 * 			options.pId   父节点的id字段名，同一层父节点id也是唯一的
	 * 			options.name  每个节点显示的名称
	 * 			options.flag  是否支持多选
	 * 
	 * **/
	function initDownTree(id, data, options) {
		$('#'+id).each(function() {	
			var downWrap = $(this).parent(),
				selInp = downWrap.siblings('.cm-select-form'),
				selBtn = downWrap.siblings('.cm-select-btn'),
				
				allSelBtn = $('.cm-select-btn'),
				allSelectBoxWrap = $('.cm-selectBox-Wrap');
			
			var setting = {
				data: {
					simpleData: {
						enable: true, 
						idKey: options.id,
						pIdKey: options.pId
					},
					key:{
						name: options.name
					}
				},
				check: {
					enable: options.flag,
					chkboxType: {"Y":"s", "N":"s"}
				},
				callback: {
					beforeClick: function(treeId, treeNode){
						var zTree = $.fn.zTree.getZTreeObj(id);
						zTree.checkNode(treeNode, !treeNode.checked, null, true);
					},
					onClick: function(e, treeId, treeNode) {
						if(!options.flag) {							
							selInp.attr("value", treeNode[options.name]);
						}
					},
					onCheck: function(e, treeId, treeNode){
						var zTree = $.fn.zTree.getZTreeObj(id),
						nodes = zTree.getCheckedNodes(true),
						v = "";
						for (var i=0, l=nodes.length; i<l; i++) {
							v += nodes[i][options.name] + ",";
						}
						if (v.length > 0 ) v = v.substring(0, v.length-1);
						selBtn.addClass('active');
						selInp.attr("value", v);
					}
				}
			};
		
			
			if(data!=null&&data.length>0){
				var treeObj = $.fn.zTree.init($("#"+id), setting, data);
				treeObj.expandAll(true);
			}else{
				layer.msg('暂无数据', {time:1000, icon:5});
			}
			
			// 鼠标划入效果
			downWrap.prevAll().hover(function() {
				$(this).parent().css({'border-color': '#d43f3a'});
				selInp.css({'background-color': '#fcf4f4'});
				selBtn.css({'color': '#e15b52'});
				// 添加title属性
				$(this).attr('title', $(this).val());
			}, function() {
				$(this).parent().css({'border-color': '#ccc'});
				selInp.css({'background-color': '#fff'});
				selBtn.css({'color': '#aaa'});
			}).click(showMenu);
			
			// 内容过多时出现滚动条
			downWrap.niceScroll({cursorcolor: '#ccc', horizrailenabled: true});	
			
			function showMenu() {
				allSelectBoxWrap.hide();
				allSelBtn.removeClass('active');
				
				var cityOffset = selInp.offset();
				if(downWrap.is(':visible')) {
					downWrap.fadeOut("fast");
					selBtn.removeClass('active');
				}else {					
					// 判断下拉菜单显示位置					
					if(selInp.offset().top + selInp.height()/2 - $(document).scrollTop() > ($(window).height() - 78)*2/3) {
						downWrap.css({left:cityOffset.left + "px", top:- downWrap.outerHeight()-1 + "px"}).addClass('topActive').slideDown("fast");
					}else {
						downWrap.css({left:cityOffset.left + "px", top: selInp.outerHeight()+1 + "px"}).removeClass('topActive').slideDown("fast");
					}
					selBtn.addClass('active');
				}	
				$("body").bind("mousedown", onBodyDown);
				selInp.css({'background-color': '#fcf4f4'}).parent().css({'border-color': '#d43f3a'});
				selBtn.css({'color': '#e15b52'});
				return false;
			}
			function hideMenu() {
				downWrap.fadeOut("fast");
				$("body").unbind("mousedown", onBodyDown);
				selInp.css({'background-color': '#fff'}).parent().css({'border-color': '#ccc'});
				selBtn.css({'color': '#aaa'}).removeClass('active');
			}
			function onBodyDown(event) {
				if (!(event.target.className == "cm-menu-content" || $(event.target).parents(".cm-menu-content").length>0)) {
					hideMenu();
				}
			}
		})
	}
	_peacock.initDownTree = initDownTree;
	
	//	初始化my97datepicker
	function initDatepicker() {
		$('.cm-datepicker').each(function() {
			var _this = $(this),
				dateInp = _this.children('.cm-input'),
				leftIcon = _this.children('.iconfont:first-child'),
				rightIcon = _this.children('.iconfont:last-child');
			dateInp.focus(function() {
				WdatePicker({
					maxDate:'2020-10-01',
					position: {
						left: -40
					},
					dateFmt: 'yyyy-MM-dd'
				})
			})
			
//			设置默认日期
			var myDate = new Date();
		    var dateToday = myDate.toLocaleDateString();
		
		    dateToday = showTime(-1, '', false);
		    var yestoday = dateToday;
		    if("undefined" != typeof lastday){
				if(!(lastday==null || typeof(lastday) == "undefined")){
					dateToday = lastday;
					if(yestoday < dateToday)
						yestoday = dateToday;
				}
		    }
			dateInp.attr("value", dateToday);
			
			// 前一天
			leftIcon.click(function() {
				var curTime = dateInp.val();
		        if(curTime.length > 10) curTime = dateToday;
		        dateInp.val(showTime(-1, curTime));
			})
			
			//后一天
			rightIcon.click(function() {
		        var curTime = dateInp.val();
		        if(curTime.length > 10) curTime = dateToday;
		        dateInp.val(showTime(1, curTime));
		
		    });
		})
	}
	
	
	function getDays(strDateStart,strDateEnd){
	   var strSeparator = "-"; // 切割符
	   var oDate1;
	   var oDate2;
	   var iDays;
	   oDate1= strDateStart.split(strSeparator);
	   oDate2= strDateEnd.split(strSeparator);
	   var strDateS = new Date(oDate1[0], oDate1[1]-1, oDate1[2]);
	   var strDateE = new Date(oDate2[0], oDate2[1]-1, oDate2[2]);
	   iDays = parseInt(Math.abs(strDateS - strDateE ) / 1000 / 60 / 60 /24)
	   return iDays ;
	}
	
	
	function showTime(pdVal, dateString, def) {
	    var trans_day = "";
	    var cur_date = new Date();
	    var cur_year = new Date().getFullYear();
	    var cur_month = cur_date.getMonth() + 1;
	    var real_date = cur_date.getDate();
	    cur_month = cur_month > 9 ? cur_month : ("0" + cur_month);
	    real_date = real_date > 9 ? real_date : ("0" + real_date);
	    eT = cur_year + "-" + cur_month + "-" + real_date;
	    if (dateString == "") {
	        dateString = eT;
	    }
	    if (pdVal == 1) {
	        trans_day = addByTransDate(dateString, 1);
	    } else if (pdVal == -1) {
	    	trans_day = reduceByTransDate(dateString, 1, def);
	    } else {
	        trans_day = dateString;
	    }
	    //澶勭悊
	    return trans_day;
	}
	
	function addByTransDate(dateParameter, num) {
	    var translateDate = "",
	        dateString = "",
	        monthString = "",
	        dayString = "";
	    translateDate = dateParameter.replace("-", "/").replace("-", "/");
	    var newDate = new Date(translateDate);
	    newDate = newDate.valueOf();
	    newDate = newDate + num * 24 * 60 * 60 * 1000;
	    newDate = new Date(newDate);
	    
	    if ((newDate.getMonth() + 1).toString().length == 1) {
	        monthString = 0 + "" + (newDate.getMonth() + 1).toString();
	    } else {
	        monthString = (newDate.getMonth() + 1).toString();
	    }
	    //濡傛灉澶╂暟闀垮害灏戜簬2锛屽垯鍓嶅姞 0 琛ヤ綅   
	    if (newDate.getDate().toString().length == 1) {
	        dayString = 0 + "" + newDate.getDate().toString();
	    } else {
	        dayString = newDate.getDate().toString();
	    }
	    dateString = newDate.getFullYear() + "-" + monthString + "-" + dayString;
	    return dateString;
	}

	function reduceByTransDate(dateParameter, num, def) {
		//鑾峰彇鏃ユ湡鐨勫墠鍑犲ぉ锛屾牴鎹畁um纭畾
	    var translateDate = "",
	        dateString = "",
	        monthString = "",
	        dayString = "";
	    translateDate = dateParameter.replace("-", "/").replace("-", "/");
	    var newDate = new Date(translateDate);
	    newDate = newDate.valueOf();
	    if(typeof def == 'undefined') newDate = newDate - num * 24 * 60 * 60 * 1000;
	    newDate = new Date(newDate);
	    //濡傛灉鏈堜唤闀垮害灏戜簬2锛屽垯鍓嶅姞 0 琛ヤ綅   
	    if ((newDate.getMonth() + 1).toString().length == 1) {
	        monthString = 0 + "" + (newDate.getMonth() + 1).toString();
	    } else {
	        monthString = (newDate.getMonth() + 1).toString();
	    }
	    //濡傛灉澶╂暟闀垮害灏戜簬2锛屽垯鍓嶅姞 0 琛ヤ綅   
	    if (newDate.getDate().toString().length == 1) {
	        dayString = 0 + "" + newDate.getDate().toString();
	    } else {
	        dayString = newDate.getDate().toString();
	    }
	    dateString = newDate.getFullYear() + "-" + monthString + "-" + dayString;
	    return dateString;
	}
	_peacock.initDatepicker = initDatepicker;
	
})(window);