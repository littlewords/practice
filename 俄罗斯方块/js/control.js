window.onload = function(){
	// 配置项
	var game_config = {
		width : 16,
		height : 20
	}
	var game_color = ['red','blue','yellow','gray','black','green','#ccc'];
	
	// 初始化预览框
	function init(w,h){
		var td,tr;
		var gameTable = document.getElementById('game_table');
		for(var j=0;j<game_config.height;j++){
			tr = document.createElement('tr');
			gameTable.insertBefore(tr,gameTable.firstChild);
			for(var i =0;i<game_config.width;i++){
				td = document.createElement('td');
				tr.insertBefore(td,tr.firstChild);
			}
		}
	}
	init();
	// 表格对象
	var tbl = document.getElementById('game_table');
	var tbl_next = document.getElementById('next_block_table');
	var activeBlock;
	var nextBlock;
	var timer;
	var game_bar = document.getElementById('game_bar');
	game_bar.innerHTML = 0;
	// 砖块构造函数
	function generateBlock(blockType){
		var block = new Array(4);
		switch(blockType){
			// o
			case 0:
				block[0] = {x:0,y:0};
				block[1] = {x:0,y:1};
				block[2] = {x:1,y:0};
				block[3] = {x:1,y:1};
				break;
			// i
			case 1:
				block[0] = {x:0,y:0};
				block[1] = {x:0,y:1};
				block[2] = {x:0,y:2};
				block[3] = {x:0,y:3};
				break;
			// z
			case 2:
				block[0] = {x:0,y:0};
				block[1] = {x:1,y:0};
				block[2] = {x:1,y:1};
				block[3] = {x:2,y:1};
				break;
			// s
			case 3:
				block[0] = {x:1,y:0};
				block[1] = {x:2,y:0};
				block[2] = {x:0,y:1};
				block[3] = {x:1,y:1};
				break;
			// t
			case 4:
				block[0] = {x:0,y:0};
				block[1] = {x:1,y:0};
				block[2] = {x:2,y:0};
				block[3] = {x:1,y:1};
				break;
			// L
			case 5:
				block[0] = {x:0,y:0};
				block[1] = {x:0,y:1};
				block[2] = {x:0,y:2};
				block[3] = {x:1,y:2};
				break;
			// J
			default:
				block[0] = {x:1,y:0};
				block[1] = {x:1,y:1};
				block[2] = {x:1,y:2};
				block[3] = {x:0,y:2};
				break;
		}
		return block;
	}

	// 绘制下一个
	function paintNext(block){
		var x,y;
		for(var i=0;i<4;i++){
			x = block[i].x;
			y = block[i].y;
			tbl_next.rows[y].cells[x].style.background = 'black';
		}
	}
	function eraseNext(block){
		var x,y;
		for(var i=0;i<4;i++){
			x = block[i].x;
			y = block[i].y;
			tbl_next.rows[y].cells[x].style.background = '';
		}
	}
	// 绘制图像
	function paintBlock(block){
		var x,y;
		for(var i=0;i<4;i++){
			x = block[i].x;
			y = block[i].y;
			tbl.rows[y].cells[x].style.background = 'black';
		}
	}
	//擦除图像
	function eraseBlock(block){
		var x,y;
		for(var i=0;i<4;i++){
			x = block[i].x;
			y = block[i].y;
			tbl.rows[y].cells[x].style.background = '';
		}
	}
	// 消除行
	function eraseRow(){
		var flag = true;
		var flagArray = [];
		var tempRow;
		for(var i=0;i<game_config.height;i++){
			for (var j=0;j<game_config.width;j++){
				if(tbl.rows[i].cells[j].style.background == ''){
					flag = false;
					break;
				}
			};
			if(flag){
				flagArray.push(i);
			}else{
				flag = true;
			}
		}
		for(var k=flagArray.length;k>=0;k--){
			// alert(flagArray[k]);
			if(flagArray[k]){
				tbl.deleteRow(flagArray[k]);
				game_bar.innerHTML = parseInt(game_bar.innerHTML)+100;
				console.log(flagArray);
			}
			
		}
		for(var k=flagArray.length;k>=0;k--){
			if(flagArray[k]){
				console.log(k);
				tempRow = tbl.insertRow(0);
				console.log(tempRow);
				for(var i=0;i<game_config.width;i++){
					tempRow.insertCell(0);
				}
			}
		}
	}
	// 向左移动
	function moveToLeft(){
		var tempBlock = copyBlock(activeBlock);
		for(var i=0; i<4; i++){
			if(tempBlock[i].x<1){
				return;
			}else{
				tempBlock[i].x-=1;
			}
		}
		// 检查碰撞
		if(!checkImpact(tempBlock)){
			eraseBlock(activeBlock);
			paintBlock(tempBlock);
			activeBlock = tempBlock;
		}
	}
	// 向右移动
	function moveToRight(){
		var tempBlock = copyBlock(activeBlock);
		for(var i=0; i<4; i++){

			if(tempBlock[i].x>=game_config.width){
				return;
			}else{
				tempBlock[i].x+=1;
			}
		}
		// 检查碰撞
		if(!checkImpact(tempBlock)){
			
			eraseBlock(activeBlock);
			paintBlock(tempBlock);
			activeBlock = tempBlock;
		}
	}
	//向下移动
	function moveToDown(){
		// 检查触底
		if(checkBottomBorder()){
			//尝试消行
			eraseRow();
			next();
		}

		var tempBlock = copyBlock(activeBlock);
		for(var i=0; i<4; i++){
			tempBlock[i].y+=1;
		}
		
		// 检查碰撞
		if(checkImpact(tempBlock)){
			eraseRow();
			next();
			return;
		}
		// 移动合法，重新绘制
		eraseBlock(activeBlock);
		paintBlock(tempBlock);
		activeBlock = tempBlock;
	

		

	}
	function change(){
		tempBlock = copyBlock(activeBlock);
		// 计算中心点
		var centerX = Math.round((activeBlock[0].x+activeBlock[1].x+activeBlock[2].x+activeBlock[3].x)/4);
		var centerY = Math.round((activeBlock[0].y+activeBlock[1].y+activeBlock[2].y+activeBlock[3].y)/4);


		console.log(centerX);
		console.log(centerY);
		// 绕中心逆时针旋转90度
		for(var i=0;i<4;i++){
			tempBlock[i].x = centerX+centerY-activeBlock[i].y;
			tempBlock[i].y = centerY-centerX+activeBlock[i].x;
		}
		console.log(tempBlock);
		if(!checkImpact(tempBlock)){
			eraseBlock(activeBlock);
			paintBlock(tempBlock);
			activeBlock = tempBlock;
		}

	}
	// 下一个
	function next(){
		// 检测游戏是否结束
		if (checkOver()) {
			alert('您的得分:'+game_bar.innerHTML);
			clearInterval(timer);
			return;
		};
		activeBlock = nextBlock;
		eraseNext(nextBlock);
		nextBlock = generateBlock(Math.round(Math.random()*100)%7);
		for(var i=0;i<4;i++){
			activeBlock[i].x+=7;
		}
		paintBlock(activeBlock);
		paintNext(nextBlock);

	}
	// 检测结束
	function checkOver(){
		for(var i=0;i<game_config.width;i++){
			if(tbl.rows[0].cells[i].style.background != '') return true;
		}
		return false;
	}
	// 检查触底
	function checkBottomBorder(){
		for(var i=0;i<4;i++){
			if(activeBlock[i].y>=(game_config.height-1)) return true;
		}
		return false;
	}
	// 检查碰撞
	function checkImpact(block){
		var x,y;
		for(var i=0;i<4;i++){
			x = block[i].x;
			y = block[i].y;
			if('' != tbl.rows[y].cells[x].style.background && !checkPointIn(block[i])){
				
				return true;
			}
		}
		return false;
	}
	// 检查点是否在当前砖块中
	function checkPointIn(point){
		for(var i=0;i<4;i++){
			if(activeBlock[i].x == point.x && activeBlock[i].y == point.y) return true;
		}
		return false;
	}
	console.log(tbl.rows[0].cells)
	// 拷贝一个blcok
	function copyBlock(old){  
        var o = new Array(4);  
    	for(var i=0; i<4; i++){    
            o[i] = {x:0, y:0};    
    	}  
    	for(var i=0; i<4; i++){    
        	o[i].x = old[i].x;    
            o[i].y = old[i].y;    
        }  
        return o;  
    }  



    // 测试区域

	activeBlock = generateBlock(Math.round(Math.random()*100)%7);
	nextBlock = generateBlock(Math.round(Math.random()*100)%7);
	for(var i=0;i<4;i++){
		activeBlock[i].x+=7;
	}
	paintBlock(activeBlock);
	paintNext(nextBlock);
	timer = setInterval(function(){
		moveToDown();
	},500);
	document.onkeydown = function(e){
		var keyMap = {
			right:39,
			left:37,
			down:40,
			change:38
		}
		var event = e || window.event;
		// alert(e.keyCode);
		switch(e.keyCode){
			case keyMap.left:
				moveToLeft();
				break;
			case keyMap.right:

				moveToRight();
				break;
			case keyMap.change:
				change();
				break;
			default:
				moveToDown();
				break;
		}
	}

}