var scrollClass = function(scrollBox,id){
	this.scrollBox = scrollBox;                       //被滚动盒子
	this.scrollPanel = document.createElement('div');                //滚动控件
	this.scrollPanel.id = id;
	this.scrollBar = document.createElement('a');      //滚动条   
	this.init(); 
}
scrollClass.prototype.init = function(){
	//将被滚动区域设置为相对布局
	this.scrollBox.style.position = 'relative';
	this.scrollBox.style.overflow = 'hidden';
	//panel初试属性
	this.scrollPanel.style.position = 'absolute';
	this.scrollPanel.style.right = 0;
	this.scrollPanel.style.top = 0;
	this.scrollPanel.style.width='5px';
	//插入panel
	this.scrollBar.style.display = 'block';
	this.scrollBar.style.background = '#ccc';
	this.scrollPanel.appendChild(this.scrollBar);
	this.scrollBox.appendChild(this.scrollPanel);
	//刷新滚动条高度
	this.refreshBarHeight();
	this.mouseWheel();	
}
scrollClass.prototype.mouseWheel = function(){
	if(this.scrollBox.addEventListener){
		var that = this;
		this.scrollBox.addEventListener('mousewheel',function(e){
			e.preventDefault();
			var drection;
			var boxDistance = that.scrollBox.scrollHeight - that.scrollBox.offsetHeight;
			var event = e || window.event;
			event.wheelDelta>0?drection='up':drection='down';

			//滚动滚动去内容
			if(drection==='up'){

				that.scrollBox.scrollTop -=20;
			}else if(drection==='down'){
				if(that.scrollBox.scrollTop>(boxDistance-20)){
					that.scrollBox.scrollTop = boxDistance;
				}else{
					that.scrollBox.scrollTop +=20;
				}

			}

			//移动滚动条
			that.barWheel()
		})
	}else{
		alert('建议换个浏览器--init');
	}
}
scrollClass.prototype.refreshBarHeight = function(){
	var off_h = this.scrollBox.offsetHeight;
	var scr_h = this.scrollBox.scrollHeight;
	var per = off_h/scr_h;
	this.scrollPanel.style.height = scr_h+'px';
	this.setBarHeight(per*off_h);
}
scrollClass.prototype.setBarHeight = function(h){
	this.scrollBar.style.height = h+'px';
	this.barHeight = h ;
	
}
scrollClass.prototype.barWheel = function(){
	var relativeBase = this.scrollBox.scrollTop;
	var boxDistance = this.scrollBox.scrollHeight - this.scrollBox.offsetHeight;
	var barDistance = this.scrollBox.offsetHeight - this.scrollBar.offsetHeight;
	var relativeOff = relativeBase/boxDistance*barDistance;
	this.scrollBar.style.marginTop = relativeOff+relativeBase+'px';
	console.log(this.scrollBar.style.marginTop);
}
scrollClass.prototype.refresh = function(){
	this.refreshBarHeight();
	this.barWheel();
}


