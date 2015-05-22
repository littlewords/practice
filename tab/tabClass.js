var tabClass = function(tab_arr,tab_menu){
	this.tabArr = tab_arr;
	this.tabMenu = tab_menu;
	this.tabCount = Math.min(this.tabArr.length,this.tabMenu.length);
	this.init();
}
tabClass.prototype.init = function(){
	this.currentTab = 0;
	for(var i=0;i<this.tabArr.length;i++){
		this.tabArr[i].style.display = 'none';
		if(this.tabMenu[i]){
			this.tabMenu[i].setAttribute('sign',i);
		
		}
	}
	this.tabArr[this.currentTab].style.display = 'block';
	var that = this;
	this.tabMenu[0].parentNode.addEventListener('click',function(e){
		var event = e || window.event;
		var target = event.target || event.srcElement;
		var sign = target.getAttribute('sign');
		if(sign){
			that.tabTo(sign);
		}
	})
}
tabClass.prototype.tabTo = function(sign){
	this.tabArr[this.currentTab].style.display = 'none';
	this.tabArr[sign].style.display = 'block';
	this.currentTab = sign;
}

window.onload = function(){
	var tab1 = document.getElementById('tab1');
	var tab2 = document.getElementById('tab2');
	var menu_div = document.getElementById('tab-menu');
	var tab_menu = menu_div.getElementsByTagName('li');
	var tab_arr = [];
	tab_arr.push(tab1);
	tab_arr.push(tab2);

	var tab = new tabClass(tab_arr,tab_menu);
}