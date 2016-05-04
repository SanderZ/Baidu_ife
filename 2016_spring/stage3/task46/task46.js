var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;


var bgColor = "#eaeaea";
var wallColor = "#333";

/*=====================游戏区域定义=========================*/

var playFieldColor = "#fafafa";
var playFieldScale = 0.8;

var gridSize = 20;//网格大小

var playFieldWidth = window.innerWidth * playFieldScale - window.innerWidth * playFieldScale % gridSize;
var playFieldHeight = window.innerHeight * playFieldScale - window.innerHeight * playFieldScale % gridSize;
var playFieldStartX = window.innerWidth / 2 - playFieldWidth / 2;
var playFieldStartY = window.innerHeight / 2 - playFieldHeight / 2;

var colNum = Math.floor(playFieldWidth / gridSize);//地图共有几列
var rowNum = Math.floor(playFieldHeight / gridSize);//地图共有几行

var matrix = new Array();//二维数组，用于存储地图中哪些网格是墙
var pathGrid = new PF.Grid(colNum, rowNum);//寻路用的网格

/*======================声明画布=============================*/

var canvas = document.createElement("canvas");
var context = canvas.getContext("2d");

/*================玩家角色与目标对象定义======================*/

var hero = {
    x: 0,
    y: 0,
    color: "#f00",
    isMoving: false,
    movePath: [],
    findPath: function(endCol, endRow, grid){
    	var startCol = this.x;
    	var startRow = this.y;
    	var gridBackup = grid.clone();
    	var finder = new PF.AStarFinder({
		    allowDiagonal: true,
		    dontCrossCorners: true
		});
    	var path = finder.findPath(startCol, startRow, endCol, endRow, grid);
    	pathGrid = gridBackup;
		return path;
    }
};

var target = {
    x: 0,
    y: 0,
    color: "#fb0"
};

/*================初始化并运行游戏======================*/

init();

var then = Date.now();
main();

/*================游戏流程控制函数======================*/

function main(){
    var now = Date.now();
    var delta = now - then;

    update(delta / 1000);
    render();
    then = now;

    requestAnimationFrame(main);
};

function init(){
	drawBackground();

	generateMaze();

	canvas.addEventListener("click", mouseHitTest);
}

function update(deltaTime){

	if(hero.isMoving){
		var nextX = hero.x;
		var nextY = hero.y;
		var directVector = {
			x: 0,
			y: 0
		};

		if(hero.movePath.length >= 1){
			if(hero.x == nextX && hero.y == nextY){
				var nextPoint = hero.movePath.shift();
				nextX = nextPoint[0];
				nextY = nextPoint[1];
			}

			directVector.x = nextX - hero.x;
			directVector.y = nextY - hero.y;

			hero.x += directVector.x;
			hero.y += directVector.y;


		}else{
			hero.isMoving = false;
			return;
		}
		
	}

	if(hero.x == target.x && hero.y == target.y)
		restart();

}

function render(){
	context.clearRect(playFieldStartX, playFieldStartY,	playFieldWidth,	playFieldHeight);
	drawMaze();
	drawTarget();
	drawHero();	
}

function restart(){
	generateMaze();
}

/*================地图生成函数======================*/

function generateMaze(){
	var pathRow1 = Math.floor(rowNum / 10);
	var pathRow2 = Math.floor(rowNum / 2);
	var pathRow3 = Math.floor(rowNum / 1.2);
	var pathCol1 = Math.floor(colNum / 8);
	var pathCol2 = Math.floor(colNum / 2);
	var pathCol3 = Math.floor(colNum / 1.2);
	for(var row = 0 ; row < rowNum; row++){
		matrix[row] = [];
		for(var col = 0 ; col < colNum; col++){
			var isWall = Math.floor(Math.random() * 2);
			if(
				row > pathRow1 - (Math.random() * 5) && row < pathRow1 + (Math.random() * 5) ||
				row > pathRow2 - (Math.random() * 5) && row < pathRow2 + (Math.random() * 5) ||
				row > pathRow3 - (Math.random() * 5) && row < pathRow3 + (Math.random() * 5) ||
				col > pathCol1 - (Math.random() * 5) && col < pathCol1 + (Math.random() * 5) ||
				col > pathCol2 - (Math.random() * 5) && col < pathCol2 + (Math.random() * 5) ||
				col > pathCol3 - (Math.random() * 5) && col < pathCol3 + (Math.random() * 5) 
				)
			{
				isWall = 0;
			}
			matrix[row][col] = isWall;
			if(isWall == 1){
				pathGrid.setWalkableAt(col, row, false);
			}else{
				pathGrid.setWalkableAt(col, row, true);
			}
		}
	}

	hero.x = pathCol1;
	hero.y = pathRow1;

	target.x = pathCol3;
	target.y = pathRow3;
}

/*================各元素的绘制函数======================*/

function drawMaze(){
	for(var row = 0 ; row < rowNum; row++){
		for(var col = 0 ; col < colNum; col++){
			if(matrix[row][col] == 1){
				drawWall(col * gridSize, row * gridSize, gridSize, gridSize);
			}
		}
	}
}

function drawBackground(){

	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	canvas.style.display = "block";

	context.fillStyle = bgColor;
	context.fillRect(0, 0, window.innerWidth, window.innerHeight);


	context.fillStyle = playFieldColor;
	context.fillRect(playFieldStartX, playFieldStartY, playFieldWidth, playFieldHeight);

	document.body.appendChild(canvas);
}

function drawWall(startX, startY, width, height){
	context.fillStyle = wallColor;
	var x = playFieldStartX + startX;
	var y = playFieldStartY + startY;
	context.fillRect(x, y, width, height);
}

function drawHero(){
	context.beginPath();
	var centerX = playFieldStartX + hero.x * gridSize + gridSize / 2;
	var centerY = playFieldStartY + hero.y * gridSize + gridSize / 2;
	var radius = gridSize / 2;
	context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
	context.fillStyle = hero.color;
	context.fill();
}

function drawTarget(){
	context.fillStyle = target.color;
	var x = playFieldStartX + target.x * gridSize;
	var y = playFieldStartY + target.y * gridSize;
	context.fillRect(x, y, gridSize, gridSize);
}

/*================响应鼠标点击事件======================*/

function mouseHitTest(e){
	var col = Math.floor((e.clientX - playFieldStartX) / 20);
	var row = Math.floor((e.clientY - playFieldStartY) / 20);
	hero.movePath = hero.findPath(col, row, pathGrid);
	hero.isMoving = true;
}



