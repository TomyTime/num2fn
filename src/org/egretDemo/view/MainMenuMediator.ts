

module game {

    export class MainMenuMediator extends puremvc.Mediator implements puremvc.IMediator{
        public static NAME:string = "MainMenuMediator";

        public constructor(viewComponent:any){
            super(MainMenuMediator.NAME, viewComponent);
            this.mainGameUI.resetButton.addEventListener(egret.TouchEvent.TOUCH_TAP , this.startButtonClick, this);
        }

        public startButtonClick(event:egret.TouchEvent):void{
            this.sendNotification(GameCommand.GAME_RESET);
        }

        public listNotificationInterests():Array<any>{
            return [GameProxy.UPDATE_SCORE , GameProxy.RESET_SCORE, GameProxy.UPDATE_TIMER];
        }

        public handleNotification(notification:puremvc.INotification):void{
            var data:any = notification.getBody();
            switch(notification.getName()){
                case GameProxy.UPDATE_SCORE:{
                    this.mainGameUI.scoreLabel.text = data["totalScore"].toString();
                    this.mainGameUI.highScoreLabel.text = data["highScore"].toString();
                    this.mainGameUI.playScoreEffect(data["addScore"]);
                    break;
                }
                case GameProxy.RESET_SCORE:{
                    this.mainGameUI.scoreLabel.text = "0";
                    break;
                }
                case GameProxy.UPDATE_TIMER:{
                    var t = 30 - data;
                    if(t < 11){
                        this.mainGameUI.timerLabel.textColor = 0xFF0000;
                    }else{
                        this.mainGameUI.timerLabel.textColor = 0x999999;
                    }
                    this.mainGameUI.timerLabel.text = t + ":00";
                }
            }
        }

        public get mainGameUI():MainMenuUI{
            return <MainMenuUI><any> (this.viewComponent);
        }
    }
}