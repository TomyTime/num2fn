
module game {

    export class MainGameUI extends egret.gui.SkinnableContainer{
        public tileGroup:egret.gui.Group;

        public gap:number = 16;

        private selectedTile:Array<TileUI> = [];

        public constructor(){
            super();
            this.skinName = MainGameUISkin;
            this.addEventListener(egret.gui.UIEvent.CREATION_COMPLETE , this.createCompleteEvent, this);
        }

        public createCompleteEvent(event:egret.gui.UIEvent):void{
            this.removeEventListener(egret.gui.UIEvent.CREATION_COMPLETE , this.createCompleteEvent, this);
            ApplicationFacade.getInstance().registerMediator( new MainGameMediator(this) );
        }

        /**
         * 创建一个格子
         */
        public createTile(tileVO:TileVO):void{
            var tile:TileUI = <TileUI>(ObjectPool.getPool("game.TileUI").borrowObject());  //从对象池创建
            tile.value = tileVO.value;
            tile.location.x = tileVO.x;
            tile.location.y = tileVO.y;
            tile.x = tileVO.x * (tile.width + this.gap) + tile.width/2;
            tile.y = tileVO.y * (tile.height + this.gap) + tile.height/2;
            tile.includeInLayout = false;
            tile.visible = false;
           // tile.addEventListener(egret.TouchEvent.TOUCH_TAP, this.getTilePosition, tile);
            this.tileGroup.addElement(tile);

            var showTile:Function = function():void{
                tile.visible = true;
                tile.playScale();
            };
            egret.setTimeout(showTile , this , 100);   //延迟显示格子，保证其他的格子移动完成后显示
        }

        /**
         *获取指定位置的格子
         */
        public getTileUI(x:number , y:number):TileUI{
            for (var i:number = 0; i < this.tileGroup.numElements; i++) {
                var tile:TileUI = <TileUI><any> (this.tileGroup.getElementAt(i));
                if(tile.location.x == x && tile.location.y == y){
                    return tile;
                }
            }
            return null;
        }

        /**
         * 选择格子
         * @param tileUI
         */
        public selectTile(selTiles:Array<any>):void{
            //取消原来的选中状态
            this.cancelSelected();

            for(var i:number=0, len:number=selTiles.length; i<len; i++){
                var tileUI = this.getTileUI(selTiles[i].x, selTiles[i].y);
                tileUI.selectTile();
            }
        }

        /**
         * @desc 获取当前选中格子的位置信息
         * @returns {Array<any>}
         */
        public getSelectedTilePosition():Array<any>{
            var pos:Array<any> = [];
            var selTileUIs:Array<TileUI> = this.getSelectedTiles();
            for(var i=0,len=selTileUIs.length; i<len; i++){
                var t:TileUI = selTileUIs[i];
                pos.push({x: t.x, y: t.y});
            }

            return pos;
        }

        /**
         * 获取当前选中的格子
         */
        public getSelectedTiles():Array<TileUI>{
            var ary:Array<TileUI> = [];
            for (var i:number = 0; i < this.tileGroup.numElements; i++) {
                var tile:TileUI = <TileUI><any> (this.tileGroup.getElementAt(i));
                if(this.isSelected(tile)){
                    ary.push(tile);
                }
            }
            this.selectedTile = ary;

            return ary;
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
        public isSelected(tileUI:TileUI):boolean{
            var flag:boolean = false;
            if(tileUI.source.indexOf('number.number_selected') > -1){
                flag = true;
            }

            return flag;
        }

        /**
         * 清除一个格子
         */
        public removeTile(tileVO:TileVO):void{
            var tileUI:TileUI = this.getTileUI(tileVO.x , tileVO.y);
            if(tileUI){
                this.tileGroup.removeElement(tileUI);
                ObjectPool.getPool("game.TileUI").returnObject(tileUI);
            }
        }

        public cancelSelected():void{
            for (var i:number = 0; i < this.tileGroup.numElements; i++) {
                var tile:TileUI = <TileUI><any> (this.tileGroup.getElementAt(i));
                tile.unSelect();
            }
        }

        /**
         * 清除所有
         */
        public clearTiles():void{
            var num:number = this.tileGroup.numElements;
            var tileUI:TileUI;
            for(var i:number = num - 1 ; i >= 0 ; i--)
            {
                tileUI = <TileUI> this.tileGroup.removeElementAt(i);
                ObjectPool.getPool("game.TileUI").returnObject(tileUI);
            }
        }
    }
}