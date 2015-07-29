window.onload = function(){
    var gameBox = document.getElementById('game_box');
    var context = gameBox.getContext('2d');

    var LinkNode = function(x,y,nextNode){
        this.x = x;
        this.y = y;
        this.next = nextNode;
    }
    // 食物初始
    var food = {
        x:25,
        y:25
    }
    
    // 随机生成食物坐标
    function randomFood(){
        var x,y,nodePoint;
        x = Math.round(Math.random()*50);
        y = Math.round(Math.random()*50);
        if(isOverFlow(x,y)){
            randomFood();
            return;
        }
        food.x = x;
        food.y = y;
    }
    // 绘制食物
    function paintFood(){
        context.fillRect(food.x*10,food.y*10,10,10);
    }
    // 擦除食物
    function eraseFood(){
        context.clearRect(food.x*10,food.y*10,10,10);
    }
    // 判断node是否与蛇身重叠
    function isOverFlow(x,y){
        var nodePoint = snake1.head;
        if(nodePoint.x === x && nodePoint.y === y){
            return true;
        }
        while(nodePoint.next){
            nodePoint = nodePoint.next;
            if(nodePoint.x === x && nodePoint.y === y){
                return true;
            }
        }

        nodePoint = snake2.head;
        if(nodePoint.x === x && nodePoint.y === y){
            return true;
        }
        while(nodePoint.next){
            nodePoint = nodePoint.next;
            if(nodePoint.x === x && nodePoint.y === y){
                return true;
            }
        }
        return false;
    }
    // 生产食物
    function repaintFood(){
        eraseFood();
        randomFood();
        paintFood();
    }
    // 检查吃的
    function isSthToEat(snake){
        if(snake.head.x === food.x && snake.head.y === food.y){
            return true;
        }
        return false;
    }
    // 检测碰撞
    function checkImpact(snake){
        var nodePoint;
        // 碰墙
        if(snake.head.x*snake.head.y<0 || snake.head.x>=50 || snake.head.y>=50){
            return true;
        }
        // 碰到蛇身
        if(snake.id==='ynyn'){
            nodePoint = snake1.head.next;
            while(nodePoint.next){
                if(snake.head.x === nodePoint.x && nodePoint.y === snake.head.y){
                    return true;
                }
                nodePoint = nodePoint.next;
            }
            if(snake.head.x === nodePoint.x && nodePoint.y === snake.head.y){
                return true;
            }
            nodePoint = snake2.head;
            while(nodePoint.next){
                if(snake.head.x === nodePoint.x && nodePoint.y === snake.head.y){
                    return true;
                }
                nodePoint = nodePoint.next;
            }
            if(snake.head.x === nodePoint.x && nodePoint.y === snake.head.y){
                return true;
            }
        }else{
            nodePoint = snake1.head;
            while(nodePoint.next){
                if(snake.head.x === nodePoint.x && nodePoint.y === snake.head.y){
                    return true;
                }
                nodePoint = nodePoint.next;
            }
            if(snake.head.x === nodePoint.x && nodePoint.y === snake.head.y){
                return true;
            }
            nodePoint = snake2.head.next;
            while(nodePoint.next){
                if(snake.head.x === nodePoint.x && nodePoint.y === snake.head.y){
                    return true;
                }
                nodePoint = nodePoint.next;
            }
            if(snake.head.x === nodePoint.x && nodePoint.y === snake.head.y){
                return true;
            }
        }
        
        
        return false;
        
    }
    // 绘制节点
    function paintNode(node){
        context.fillRect(node.x*10,node.y*10,10,10);
    }
    // 擦除节点
    function eraseNode(node){
        context.clearRect(node.x*10,node.y*10,10,10);
    }
    // 绘制蛇
    function paintSnake(head){
        paintNode(head);
        while(head.next){
            head = head.next;
            paintNode(head);
        }
    }
    // 移动
    function move(snake,dir){
        snake.dir_state = dir;
        var newHead;
        var node = snake.head;
        switch(dir){
            case 'up':
                newHead = new LinkNode(node.x,node.y-1,node);
                break;
            case 'down':
                newHead = new LinkNode(node.x,node.y+1,node);
                break;
            case 'left':
                newHead = new LinkNode(node.x-1,node.y,node);
                break;
            case 'right':
                newHead = new LinkNode(node.x+1,node.y,node);
                break;
        }
        snake.head = newHead;
        if(checkImpact(snake)){
            game.gameOver(snake);
            return ;
        }

        
        while(node.next.next){
            node = node.next;
        }
        if(isSthToEat(snake)){
            repaintFood();
        }else{
            eraseNode(node.next);
            node.next = null;
        }
        paintNode(newHead);
        
    }
    
    // 蛇1
    function initSnake1(){
        var head = new LinkNode(30,20,null);
        head.next = new LinkNode(30,21,null);
        head.next.next = new LinkNode(30,22,null);
        snake1.head = head;
        snake1.direct = 'up';
        snake1.dir_state = 'up';
    }
    var snake1 = {
        id:'ynyn',
        head:null,
        speed:100,
        direct:'up',
        dir_state:'up',
        name:'snake1',
        color:'pink'
    }

    // 蛇2
    function initSnake2(){
        var head2 = new LinkNode(20,20,null);
        head2.next = new LinkNode(20,21,null);
        head2.next.next = new LinkNode(20,22,null);
        snake2.head = head2;
        snake2.direct = 'up';
        snake2.dir_state = 'up';
    }
    
    var snake2 = {
        id:'yaya',
        head:null,
        speed:100,
        direct:'up',
        dir_state:'up', 
        name:'snake2',
        color:'black'
    }
    // 键盘事件
    var keyMap1 = {
        right:39,
        left:37,
        down:40,
        up:38
    }
    var keyMap2 = {
        up:87,
        left:65,
        right:68,
        down:83
    }
    document.onkeydown = function(e){
        e = e || window.event;
        // alert(e.keyCode);
        switch(e.keyCode){
            case keyMap1.left:
                if(snake1.dir_state!=='right')
                snake1.direct = 'left';
                break;
            case keyMap1.right:
                if(snake1.dir_state!=='left')
                snake1.direct = 'right';
                break;
            case keyMap1.up:
                if(snake1.dir_state!=='down')
                snake1.direct = 'up';
                break;
            case keyMap1.down:
                if(snake1.dir_state!=='up')
                snake1.direct = 'down';
                break;
            case keyMap2.left:
                if(snake2.dir_state!=='right')
                snake2.direct = 'left';
                break;
            case keyMap2.right:
                if(snake2.dir_state!=='left')
                snake2.direct = 'right';
                break;
            case keyMap2.up:
                if(snake2.dir_state!=='down')
                snake2.direct = 'up';
                break;
            default:
                if(snake2.dir_state!=='up')
                snake2.direct = 'down';
                break;
        }
    }


    // test
    
    var game = {
        st_start:false,
        st_stop:false,
        timer1:null,
        timer2:null,
        start:function(){
            if(this.st_start){return ;}
            initSnake2();
            initSnake1();
            paintSnake(snake1.head);
            paintSnake(snake2.head);
            paintFood();
            this.timer1 = setInterval(function(){
                move(snake1,snake1.direct);
            },snake1.speed);
            this.timer2 = setInterval(function(){
                move(snake2,snake2.direct);
            },snake2.speed);
            this.st_start = true;
        },
        stop:function(){
            if(this.st_stop){
                console.log('继续')
                this.timer1 = setInterval(function(){
                    move(snake1,snake1.direct);
                },snake1.speed);
                this.timer2 = setInterval(function(){
                    move(snake2,snake2.direct);
                },snake2.speed);
                this.st_stop = false;
            }else{
                console.log('暂停');
                clearInterval(this.timer1);
                clearInterval(this.timer2);
                this.st_stop = true;
            }
        },
        gameOver:function(snake){
            clearInterval(this.timer1);
            clearInterval(this.timer2);
            alert(snake.name+'输了');
        },
        reset:function(){
            this.st_start = false;
            this.st_stop = false;
            if(!!this.timer1){
                clearInterval(this.timer1);
                
            }
            if(!!this.timer2){
                clearInterval(this.timer2);
            }
            this.time1 = null;
            this.timer2 = null;
            context.clearRect(0,0,500,500);
            this.start();
        }
    }
    var btn_start = document.getElementById('btn_start');
    var btn_stop = document.getElementById('btn_stop');
    var btn_reset = document.getElementById('btn_reset');
    btn_start.onclick = function(){
        console.log('start');
        game.start();
    }
    btn_stop.onclick = function(){
        game.stop();
    }
    btn_reset.onclick = function(){
        game.reset();
    }

    // // test
    // var head = new LinkNode(20,20,null)
    // paintNode(head);
}

