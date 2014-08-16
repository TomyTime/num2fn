
module game {

    export class GameCommand extends puremvc.SimpleCommand implements puremvc.ICommand{

        public constructor(){
            super();
        }
        public static NAME:string = "GameCommand";

        /**
         * 游戏重置
         */
        public static GAME_RESET:string = "game_reset";

        /**
         * 处理移动后的事务 , body  {score , won , moved}
         */
        public static USER_CALCULATED:string = "user_calculated";

        /**
         * 执行选择
         * @type {string}
         */
        public static USER_SELECT:string = "user_select";

        /**
         * 执行选择后的事务
         * @type {string}
         */
        public static USER_SELECTED:string = "user_selected";

        /**
         * 注册消息
         */
        public register():void{
            this.facade.registerCommand(GameCommand.GAME_RESET , GameCommand); //注册游戏重置消息
            this.facade.registerCommand(GameCommand.USER_CALCULATED , GameCommand); //注册移动后消息
            this.facade.registerCommand(GameCommand.USER_SELECTED , GameCommand);  //注册选中完毕的消息
            this.facade.registerCommand(GameCommand.USER_SELECT , GameCommand);  //注册将要选中的消息
        }

        public execute(notification:puremvc.INotification):void{
            var gameProxy:GameProxy = <GameProxy><any> (this.facade.retrieveProxy(GameProxy.NAME));
            var gridProxy:GridProxy = <GridProxy><any> (this.facade.retrieveProxy(GridProxy.NAME));
            var data:any = notification.getBody();
            switch(notification.getName()){
                case GameCommand.GAME_RESET:{
                    gameProxy.reset();
                    gridProxy.reset();
                    gridProxy.addStartTiles();
                    break;
                }
                case GameCommand.USER_CALCULATED:{
                    gameProxy.updateScore(data["score"]);
                    break;
                }
                case GameCommand.USER_SELECTED:{
                    gridProxy.calTilesValue();
                    break;
                }
                case GameCommand.USER_SELECT:{
                    gridProxy.select(data);
                    break;
                }
            }
        }
    }
}