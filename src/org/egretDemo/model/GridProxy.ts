

module game {

    export class GridProxy extends puremvc.Proxy implements puremvc.IProxy{
        public static NAME:string = "GridProxy";

        /**
         * 重置格子
         */
        public static RESET_TILE:string = "reset_tile";
        public static MOVE_TILE:string = "move_tile";
        public static INSERT_TILE:string = "insert_tile";
        public static REMOVE_TILE:string = "remove_tile";
        public static SELECT_TILE:string = "select_tile";
        public static UNSELECT_TILE:string = "unselect_tile";
        public static RESET_TIMER:string = "reset_timer";

        private cells:Array<any> = [];
        private startTiles:number = 16;
        private playerTurn:boolean = true;
        private size:number = CommonData.size;
        private min = -4;
        private max = 4;
//        private logger = new egret.log;

        public constructor(){
            super(GridProxy.NAME);
        }

        /**
         * 初始化数据
         */
        public reset():void{
            this.cells = [];
            for (var x:number = 0; x < this.size; x++) {
                var row:Array<any> = [];
                this.cells.push(row);
                for (var y:number = 0; y < this.size; y++) {
                    row.push(null);
                }
            }
            this.playerTurn = true;
            this.sendNotification(GridProxy.RESET_TILE);
        }

        /**
         * 选择格子
         */
        public select(data:TileUI):void{
            var t:TileVO;
            var selTiles:Array<any>;
            if(data.hasOwnProperty('location')){
                t = this.cellContent(data.location.x, data.location.y);
                if(this.checkfTile(t)){
                    t['selected'] = true;
                }
                selTiles = this.getSelectedTiles();
                this.sendNotification(GridProxy.SELECT_TILE,  selTiles);
            }
        }

        /**
         * @desc 计算游戏分数
         * @param tiles
         * @returns {number}
         */
        private calScore(tiles:Array<any>):number{
            var size:number = tiles.length;
            if(size > 1 && size < 3){
                return 10;
            }else if(size > 2 && size < 5){
                return size * 10;
            }else{
                return size * 20;
            }
        }

        /**
         * @desc 计算当前选中格子的和
         * 游戏主要数据逻辑
         * @param selTiles
         */
        public calTilesValue():void{
            var result:number = 0;
            var score:number = 0;
            var selTiles:Array<any> = this.getSelectedTiles();
            if(CommonData.isRunning == false){
                this.unselectTiles();
                this.sendNotification(GridProxy.UNSELECT_TILE);
                return;
            }
            //当前选中格子只有一个或者没有
            if(selTiles.length < 2){
                this.unselectTiles();
                this.sendNotification(GridProxy.UNSELECT_TILE);
                return;
            }
            //当前选中格子大于等于2个以上
            //开始游戏逻辑运算
            for(var i:number=0, len:number=selTiles.length; i<len; i++){
                result += selTiles[i]['value'];
            }
            //选中格子相加和为零
            //消除当前选中格子
            //重新初始化空余位置格子
            if(result == 0){
                this.removeSSuccesseddTiles(selTiles);
                this.addLeaveTiles(selTiles);
                score = this.calScore(selTiles);
                this.sendNotification(GameCommand.USER_CALCULATED, {"won": false, "score": score});
                this.sendNotification(GridProxy.UNSELECT_TILE);
            }else{
                this.unselectTiles();
                this.sendNotification(GridProxy.UNSELECT_TILE);
            }
        }

        /**
         * @desc 填充空余的格子
         * @param tiles
         */
        private addLeaveTiles(tiles:Array<TileVO>):void{
            for(var i:number=0, len:number=tiles.length; i<len; i++){
                this.insertTileByPostion({x: tiles[i].x, y: tiles[i].y});
            }
        }

        /**
         * @desc 移除求和为零的选中的格子
         * @param tiles
         */
        private removeSSuccesseddTiles(tiles:Array<TileVO>):void{
            for(var i:number=0, len:number=tiles.length; i<len; i++){
                this.removeTile(this.cellContent(tiles[i].x, tiles[i].y));
            }
        }

        /**
         * @desc 检查格子是否能被选中
         * @param tileUI
         * @returns {boolean}
         */
        public checkfTile(tileVO:TileVO):boolean{
            var flag:boolean = false;
            var selTiles:Array<any> = this.getSelectedTiles();
            var selCount:number = selTiles.length;
            if(selCount == 0){
                return true;
            }else{
                flag = this.isAtAround(tileVO);
            }

            return flag;
        }

        /**
         * @desc 检查是否有选中的相邻格子
         * @param tileUI
         * @returns {boolean}
         */
        public isAtAround(tileVO:TileVO):boolean{
            var flag:boolean = false;
            var around:any = this.getAroundTiles(tileVO);
            for(var x in around){
                var tile = around[x];
                if(this.isSelected(tile)){
                    flag = true;
                    break;
                }
            }

            return flag;
        }

        /**
         * @desc 获取指定格子的四个方向上的相邻格子
         * @param tileUI
         * @returns {any}
         */
        public getAroundTiles(tileVO:TileVO):any{
            var location = {x: tileVO.x, y: tileVO.y};
            var around:any = {};
            var tVO:TileVO;

            //left
            if((location.x - 1) > -1){
                tVO = this.cellContent(location.x-1, location.y);
                if(null != tVO){
                    around['left'] = tVO;
                }
            }
            //top
            if((location.y - 1) > -1){
                tVO = this.cellContent(location.x, location.y-1);
                if(null != tVO){
                    around['top'] = tVO;
                }
            }
            //right
            //4目前直接写出来
            //这里应该是个变量的
            if((location.x + 1) < 5){
                tVO = this.cellContent(location.x+1, location.y);
                if(null != tVO){
                    around['right'] = tVO;
                }
            }
            //bottom
            //4目前直接写出来
            //这里应该是个变量的
            if((location.y + 1) < 5){
                tVO = this.cellContent(location.x, location.y+1);
                if(null != tVO){
                    around['bottom'] = tVO;
                }
            }

            return around;
        }

        /**
         * 获取当前选中的格子
         */
        public getSelectedTiles():Array<any>{
            var ary:Array<any> = [];
            for (var i:number = 0; i < this.size; i++) {
                var row:Array<any> = this.cells[i];
                for(var j:number = 0; j<this.size; j++){
                    if(row[j]['selected'] == true){
                        ary.push({x: row[j].x, y: row[j].y, value: row[j].value});
                    }
                }
            }

            return ary;
        }

        public unselectTiles():void{
            var pos:Array<any> = this.getSelectedTiles();
            for(var i:number=0, len:number=pos.length; i<len; i++){
                this.cellContent(pos[i].x, pos[i].y)['selected'] = false;
            }
        }

        /**
         * @desc 获得当前选中格子的长度
         * @returns {number}
         */
        public getSelectedTilesCount():number{
            return this.getSelectedTiles().length;
        }

        /**
         * @desc 检查指定格子是否被选中
         * @param tileUI
         * @returns {boolean}
         */
        public isSelected(tileVO:TileVO):boolean{
            var flag:boolean = false;
            var selTiles:Array<any> = this.getSelectedTiles();
            for(var i:number=0, len:number=selTiles.length; i<len; i++){
                var p = selTiles[i];
                if(p.x == tileVO.x && p.y == tileVO.y){
                    flag = true;
                    break;
                }
            }

            return flag;
        }

        /**
         * 电脑添加一个格子
         */
        public computerMove():void{
            this.addRandomTile();
            this.playerTurn = true;
        }

        /**
         * 获取某一方向的格子
         */
        private buildMoveOrder(direction:number):Array<any>{
            var arr:Array<any> = [];
            var vector:any = this.getVector(direction);
            var xReverse:boolean = (vector.x==1)?true:false;
            var yReverse:boolean = (vector.y==1)?true:false;
            var x:number = xReverse? (this.size-1) : 0;
            while(x>=0 && x<this.size){
                var y:number = yReverse? (this.size-1) : 0;
                while(y>=0 && y<this.size){
                    arr.push(this.cellContent(x,y));
                    y = y + (yReverse?-1:1);
                }
                x = x + (xReverse?-1:1);
            }
            return arr;
        }

        /**
         * 获取指定方向上能移动到的位置
         */
        private findFarthestPosition(position:any , direction:number):any{
            var vector:any = this.getVector(direction);
            var lastPosition:any;
            do{
                lastPosition = position;
                position = this.getNextPosition(position , direction);
            }while(this.withinBounds(position.x , position.y) && this.isAvailable(position.x , position.y));
            return lastPosition;
        }

        /**
         * 获取某一位置指定方向的下一个位置
         */
        private getNextPosition(position:any , direction:number):any{
            var vector:any = this.getVector(direction);
            return {"x":position.x+vector.x , "y":position.y+vector.y};
        }

        /**
         * 存储移动前状态
         */
        private prepareTiles():void{
            for (var x:number = 0; x < this.size; x++) {
                for (var y:number = 0; y < this.size; y++) {
                    var tile:TileVO = <TileVO><any> (this.cells[x][y]);
                    if(tile){
                        tile.merged = false;
                        tile.previousPosition = {"x":tile.x , "y":tile.y};
                    }
                }
            }
        }

        private checkTile(data):boolean{
            var flag:boolean = false;
            var position = data.location;
            var x:number = position.x;
            var y:number = position.y;
            if(position != undefined){
                //左边

            }
            return flag;
        }

        /**
         * 添加游戏开始的格子
         */
        public addStartTiles():void{
            for (var i:number = 0; i<this.startTiles; i++) {
                this.addRandomTile();
            }
        }

        /**
         * 随机添加一个格子
         */
        private addRandomTile():void{
            if (this.cellsAvailable()) {
                var position:any = this.randomAvailableCell;
                var tile:TileVO = new TileVO();
                tile.x = position.x;
                tile.y = position.y;
                tile.value = this.getRandomValue(this.min, this.max);
                this.insertTile(tile);
            }
        }

        private insertTileByPostion(position:any):void{
            var tile:TileVO = new TileVO();
            tile.x = position.x;
            tile.y = position.y;
            tile.value = this.getRandomValue(this.min, this.max);
            this.insertTile(tile);
        }

        /**
         * 获取指定范围内的随机数
         * 不要0
         * 如果一直随机返回 0 ，那就去买彩票吧 ^_^
         */
        private getRandomValue(min:number, max:number):number{
            var ret =  Math.floor(min + Math.random()*(max-min));
            if(ret == 0 ){
                return this.getRandomValue(min, max);
            }else{
                return ret;
            }
        }

        /**
         * 是否能够继续游戏
         */
        public movesAvailable():boolean{
            for (var i:number = 0; i < this.size; i++) {
                for (var j:number = 0; j < this.size; j++) {
                    var tile:TileVO = <TileVO><any> (this.cells[i][j]);
                    if (tile) {
                        for (var direction:number = 0; direction < 4; direction++) {
                            var nextPosition:any = this.getNextPosition({"x":tile.x , "y":tile.y} , direction);
                            var nextTileVO:TileVO = this.cellContent(nextPosition.x , nextPosition.y);
                            if( (!nextTileVO && this.withinBounds(nextPosition.x,nextPosition.y)) ||    //某一位置是空的
                                (nextTileVO && nextTileVO.value == tile.value) ){     //某一位置可以合并
                                return true;
                            }
                        }
                    }
                }
            }
            return false;
        }

        /**
         * 是否存在空格子
         */
        private cellsAvailable():boolean{
            if(this.availableCells.length > 0) {
                return true;
            }
            return false;
        }

        /**
         * 获取指定位置的格子是否可用
         */
        private isAvailable(x:number , y:number):boolean{
            return !this.isOccupied(x,y);
        }

        /**
         * 获取指定位置的格子是否被占用
         */
        private isOccupied(x:number , y:number):boolean{
            if(this.cellContent(x,y)){
                return true;
            }else{
                return false;
            }
        }

        /**
         * 获取指定位置的格子
         */
        private cellContent(x:number , y:number):TileVO{
            if (this.withinBounds(x , y)) {
                return <TileVO><any> (this.cells[x][y]);
            } else {
                return null;
            }
        }

        /**
         * 检查位置是否合法
         */
        private withinBounds(x:number , y:number):boolean {
            return x >= 0 && x < this.size && y >= 0 && y < this.size;
        }

        /**
         * 移动格子
         */
        private moveTile(tile:TileVO, x:number , y:number):void
        {
            if(tile.x == x && tile.y == y){
                return;
            }
            this.cells[tile.x][tile.y] = null;
            tile.x = x;
            tile.y = y;
            this.cells[tile.x][tile.y] = tile;
            this.sendNotification(GridProxy.MOVE_TILE , tile.clone());
        }

        /**
         * 添加一个格子
         */
        private insertTile(tile:TileVO):void{
            tile['selected'] = false;
            this.cells[tile.x][tile.y] = tile;
            this.sendNotification(GridProxy.INSERT_TILE , tile.clone());
        }

        /**
         * 移除一个格子
         */
        private removeTile(tile:TileVO):void{
            this.cells[tile.x][tile.y] = null;
            this.sendNotification(GridProxy.REMOVE_TILE , tile.clone());
        }

        /**
         * 获取某一方向的偏移位置
         * @param direction 0: 上, 1: 右, 2:下, 3: 左
         */
        private getVector(direction:number):any{
            if(direction == 0){ return {"x":0 , "y":-1}; }
            else if(direction == 1){ return {"x":1 , "y":0}; }
            else if(direction == 2){ return {"x":0 , "y":1}; }
            else if(direction == 3){ return {"x":-1 , "y":0}; }
            else { return null; }
        }

        /**
         * 随机获取一个空格子的位置
         */
        private get randomAvailableCell():any{
            var arr:Array<any> = this.availableCells;
            if (arr.length) {
                return arr[Math.floor(Math.random() * arr.length)];
            }
            return null;
        }

        /**
         * 所有的空格子的位置
         */
        private get availableCells():Array<any>{
            var arr:Array<any> = [];
            for (var x:number = 0; x < this.size; x++) {
                for (var y:number = 0; y < this.size; y++) {
                    if(!this.cells[x][y]){
                        arr.push({"x":x , "y":y});
                    }
                }
            }
            return arr;
        }

    }
}