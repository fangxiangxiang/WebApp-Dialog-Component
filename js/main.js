;(function($){
	var Dialog = function(config){
		var _this = this;
		//默认参数配置 实质的参数是从html那里传过来的
		this.config = {
			//对话框的宽高
			width:"auto",
			height:"auto",
			//对话框的提示信息
			message:null,
			//对话框的类型
			type:"waiting",
			//按钮配置
			buttons:null,
			//弹出框延迟多久关闭
			delay:null,
			//延迟关闭的回调函数
			delayCallback:null,
			//对话框遮罩层透明度
			maskOpacity:null,
			//遮罩层点击是否可以关闭
			maskClose:null,
			//是否启用动画
			effect:null
		};

		//默认参数扩展
		if(config && $.isPlainObject(config)){
			$.extend(this.config,config);
		}else{
			this.isConfig = true;
		}
		//console.log(this.config);
		//
		//创建基本的DOM
		this.body = $("body");
		//创建遮罩层
		this.mask = $('<div class="g-dialog-contianer">');
		//创建弹出框
		this.win = $('<div class="dialog-window">');
		//创建弹出框头部
		this.winHeadr = $('<div class="dialog-header"></div>');
		//创建提示信息
		this.winContent = $('<div class="dialog-content">');
		//创建弹出框按钮组
		this.winFooter = $('<div class="dialog-footer">');

		//渲染DOM
		this.creat();

	};
	Dialog.zIndex = 10000;  //在Dialog这个类上定义一个静态的属性 记录弹框层级 为什么不定义上面是因为面向对象开发每个类都是独立多态的
	                        //new出来的zIndex可能跟其他弹框没有关联的
	Dialog.prototype = {
		//动画函数
		animate:function(){
			var _this_ = this;
			this.win.css("-webkit-transform","scale(0,0)");
			window.setTimeout(function(){
				_this_.win.css("-webkit-transform","scale(1,1)");				
			},100);
		},
		creat:function(){
			var _this = this,  
				config = this.config,
				mask = this.mask,
				win = this.win,
				header = this.winHeadr,
				content = this.winContent,
				footer = this.winFooter,
				body = this.body;  //将上面定义的dom都保存在变量里

				//增加弹框的层级
				Dialog.zIndex++;
				this.mask.css('zIndex',Dialog.zIndex);

			//如果没有传递任何配置参数 就弹出一个等待的图标形式的弹框
			if(this.isConfig){
				win.append(header.addClass("waiting"));
				if(config.effect){
					this.animate();
				}
				mask.append(win);
				body.append(mask);
			}else{
				//根据配置参数创建对应的弹框
				header.addClass(config.type);
				win.append(header);
				//如果传了信息文本
				if(config.message){
					win.append(content.html(config.message));
				}
				//按钮组
				if(config.buttons){
					this.creatButtons(footer,config.buttons);
					win.append(footer);
				};
				//插入到页面
				mask.append(win);
				body.append(mask);
				//设置对话框的宽高
				if(config.width!="auto"){
					win.width(config.width);
				}
				if(config.height!="auto"){
					win.height(config.height);
				}
				//对话框遮罩透明maskOpacity
				if(config.maskOpacity){
					mask.css("backgroundColor","rgba(0,0,0,"+config.maskOpacity+")");
				};
				//设置弹出框弹出后多久关闭
				if(config.delay&&config.delay!=0){
					window.setTimeout(function(){
						_this.close();
						//执行延迟的回调函数
						config.delayCallback&&config.delayCallback();
					},config.delay);
				};
				if(config.effect){
					this.animate();
				};
				//指定遮罩层是否可以关闭
				if(config.maskClose){
					mask.tap(function(){
						_this.close();
					})
				}
			}

		},
		creatButtons:function(footer,buttons){
			var _this_ = this;
			console.log(_this_);
			$(buttons).each(function(i){
				/*{
					type:"red",
					text:"不好",
					callback:function(){
						alert(1);
					}
				},*/
				//获取按钮的样式回调以及文本
				var type = this.type?" class='"+this.type+"'":"";
				var btnText = this.text?this.text:"按钮"+(++i);
				var callback = this.callback?this.callback:null;
				var button = $("<button"+type+">"+btnText+"</button>");
				
				if(callback){
					button.tap(function(e){
						//console.log(this); //打印的是button这个dom对象
						var isClose = callback(); //callback不但执行完毕 还将返回值赋给一个变量 用于后面的判断 这是个技巧
						//阻止事件冒泡
						e.stopPropagation();
						if(isClose != false){
							_this_.close();
						}
						//callback();
					});
				}else{
					button.tap(function(e){
						//阻止事件冒泡
						e.stopPropagation();
						_this_.close();
					});
				}
				footer.append(button);
			})
		},
		close:function(){
			this.mask.remove();
		}
	};
	window.Dialog = Dialog;
	$.dialog = function(config){   //调用的时候 var d = $.dialog({})
		return new Dialog(config);
	}
})(Zepto);