/************ 页面加载完成时 **************/
$(function(){
	/** 圆的百分比 **/
    var obj={
        Javascript:80,
        Bootstrap:70,
        AngularJS:70,
        HTML_CSS:80,
        Photoshop:60,
        JQuery:85
    };
	var W=Javascript.width;
	var H=Javascript.height;
	/** 绘制圆的函数 **/
    function arc(Id,num1,num2){//传入id、画num%
        var ctx=$('#'+Id)[0].getContext('2d');
        ctx.lineWidth='5';
        ctx.strokeStyle='#fff';
        ctx.beginPath();
        ctx.arc(W/2,H/2,70,-Math.PI/2,(num1/100*360-90)*Math.PI/180);
        ctx.stroke();
        ctx.strokeStyle='#1ABC9C';
        ctx.beginPath();
        ctx.arc(W/2,H/2,70,-Math.PI/2,(num2/100*360-90)*Math.PI/180);
        ctx.stroke();
    }
    var isArc=true;//变量作为判断能否进行绘制圆的动画
	/***   调用周期函数动态绘制圆 ***/
    function arcSet(Id,i){
        var num=100-obj[Id];
        var num1= 0,num2=0;
        var ctx=$('#'+Id)[0].getContext('2d');
        var timer = setInterval(function () {
                ctx.clearRect(0, 0, W, H);
                num1++;
                num2++;
                num1 <= num && (num2 = 0);//判断是否可以进行绘制蓝色条
                arc(Id, num1, num2);
                ctx.font = '30px SimHei';
                ctx.fillStyle = '#fff';
                var wid = ctx.measureText(num2 + '%').width;
                num2 > 0 ? ctx.fillText(num2 + '%', (W - wid) / 2, (H+30)/2) : ctx.fillText(0 + '%', (W - wid) / 2, (H+30)/2);
                if (num1 >= 100) {
                    clearInterval(timer);
                    timer = null;
                }
            }, 10);
    }



	/********************** 楼层滚动监听部分 ******************/
	function getElementTop(elem){
	var sum=elem.offsetTop;
	while((elem=elem.offsetParent)!=null){
		sum+=elem.offsetTop;
	}
	return sum;
	}
var elevator={
	UPLEVEL:0,//保存移动顶部的上限
	DURATION:1000,//保存动画的总时间
	DISTANCE:0,//动画的总距离
	STEPS:200,//总步数
	interval:0,//每步的时间间距
	step:0,//步长
	moved:0,//动画的步数
	timer:null,//动画的序号

	init:function(){
		window.addEventListener("scroll",this.checkLight.bind(this));
		var me=this;
		this.interval=this.DURATION/this.STEPS;
		$("#box_bg ul")[0].addEventListener("click",function(e){
			if(me.timer==null){
				var target=e.target;
				if(target.nodeName=="LI"||target.nodeName=="SPAN"){
					//获取鼠标滑动的距离  也相当于页面顶部和浏览器顶部的距离
					var scrollTop=document.documentElement.scrollTop
						 ||document.body.scrollTop;
					//获取楼层的层数  如（1F 2F 3F）
					var d='',span='';
					if(target.nodeName=="LI"){
						d=$(target).attr('data');
						span=$("#"+d)[0];
					}
					if(target.nodeName=="SPAN"){//预防点击的时候点的是span
						d=$(target).parent().attr('data');
						span=$("#"+d)[0];
					}
					//每一层楼距离页面最顶部的距离   已经定死的值  不能改变的
					var elemTop=getElementTop(span);
					//移动的总距离
					me.DISTANCE=elemTop-me.UPLEVEL-scrollTop;
					//每一步的距离
					me.step=me.DISTANCE/me.STEPS;
					//调用周期函数    必须用bind进行绑定指向哪个调用者
					me.timer=setTimeout(me.moveStep.bind(me),me.interval);
				}
			}
		});
		$('#go_top').click(function(){
			me.DISTANCE=-(document.documentElement.scrollTop
				||document.body.scrollTop);
			me.step=me.DISTANCE/me.STEPS;
			me.timer=setTimeout(me.moveStep.bind(me),me.interval);
		});
	},
	moveStep:function(){
		window.scrollBy(0,this.step);
		this.moved++;
		if(this.moved<=this.STEPS){
			this.timer=setTimeout(this.moveStep.bind(this),this.interval);
		}else{
			this.moved=0;
			this.timer=null;
		}
	},
	//鼠标每移动一次就调用的函数    监听楼层是否到达了指定的地点了  就可以点亮
	checkLight:function(){
		//获取楼层的标志  （1F）
		var skills=$("#skills")[0];
		var scrollTop=document.documentElement.scrollTop
						 ||document.body.scrollTop;
		if(scrollTop<=500){
			$('#go_top').css({display:'none'});
		}else{
			$('#go_top').css({display:'block'});
		}
		var skillsT=getElementTop(skills);
		var skillsD=skillsT-this.UPLEVEL-scrollTop;
		if(skillsD>-150&&skillsD<460){
			if(isArc){
                isArc = false;
				arcSet('Javascript');
				arcSet('Bootstrap');
				arcSet('AngularJS');
				arcSet('HTML_CSS');
				arcSet('Photoshop');
				arcSet('JQuery');
			}
		}else{
			isArc=true;
		}
		this.actives('about');
		this.actives('skills');
		this.actives('project_box');
		this.actives('contact');
		var box_bg=$('#box_bg')[0];
		var box_bgT=getElementTop(box_bg);
		var box_bgD=box_bgT-scrollTop;
		if(box_bgD==0){
			$(box_bg).css({background:'transparent'}).find('.actives').removeClass('actives');
		}else{
			$(box_bg).css({background:'rgb(96, 96, 101)'});
		}
	},
	actives:function(Id){
		var scrollTop=document.documentElement.scrollTop||document.body.scrollTop;
		var about=$('#'+Id)[0];
		var aboutT=getElementTop(about);
		var aboutD=aboutT-scrollTop;
		if(aboutD>=10&&aboutD<=400){
			$('#nav li[data="'+Id+'"]').addClass('actives').siblings('.actives').removeClass('actives').siblings('.active').removeClass('active');
		}
	}
	};
	elevator.init();
	/***** 导航栏 鼠标进入事件  添加active  Classname *****/
	$('#nav>li').hover(function(){
    	$(this).addClass('active');
		},function(){
    	$(this).removeClass('active');
	});
	//项目案例
	$(function(){
		var W=$('.project .work img').css('width');
		var ML=$('.project .work').css('padding-left');
		$('.project .work div').css({width:W,left:ML});
	});
	//文字定时器更改
	setInterval(function(){
		$('#headertext span.active').fadeOut('fast').removeClass('active').next('span').addClass('active').fadeIn('slow');
		if(!$('#headertext span.active')[0]){
			$('#headertext span:first-child').addClass('active').fadeIn('fast');
		};
	},3000);
	//QQ微信图片
	$('.imgcode').mouseover(function(event){
		event.preventDefault();
		var target=event.target;
		$(target).parent().next('img').fadeIn('fast');
	})
	$('.imgcode').mouseout(function(event){
		event.preventDefault();
		var target=event.target;
		$(target).parent().next('img').fadeOut('fast');
	})
	$('.imgcode').click(function(event){
		event.preventDefault();
		var target=event.target;
		$(target).parent().next('img').fadeIn('fast');
	})
})
