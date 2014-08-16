

module game {

    export class ApplicationMediator extends puremvc.Mediator implements puremvc.IMediator{
        public static NAME:string = "ApplicationMediator";
        private timer:egret.Timer;

        public constructor(viewComponent:any){
            super(ApplicationMediator.NAME, viewComponent);

            this.timer = new egret.Timer(1000, 30);
            this.timer.addEventListener(egret.TimerEvent.TIMER, this.updateTime, this);
            this.timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, this.timeOver,this);
            this.timer.start();

//            this.main.addEventListener(egret.TouchEvent.TOUCH_TAP , this.mouseTapHandle , this)
//            this.main.addEventListener(egret.TouchEvent.TOUCH_BEGIN , this.stage_mouseDownHandler , this)
            this.main.addEventListener(egret.TouchEvent.TOUCH_MOVE , this.stage_mouseMoveHandler , this)
            this.main.addEventListener(egret.TouchEvent.TOUCH_END , this.stage_mouseUpHandler , this)

        }

        public listNotificationInterests():Array<any>{
            return [
                GridProxy.RESET_TIMER
            ];
        }

        public handleNotification(notification:puremvc.INotification):void{
            var data:any = notification.getBody();
            switch(notification.getName()){
                case GridProxy.RESET_TIMER:{
                    this.timer.reset();
                    this.timer.start();
                    break;
                }
            }
        }

        private mouseTapHandle(event:egret.TouchEvent):void{
            this.doClick(event);
        }

        private stage_mouseMoveHandler(event:egret.TouchEvent):void{
            console.log('mouseMoveHandler()');
            if(event.target.hasOwnProperty('location')){
                this.doClick(event);
            }
        }

        public stage_mouseDownHandler(event:egret.Event):void{
            //this.timer.reset();
            //this.timer.start();
        }

        public stage_mouseUpHandler(event:egret.Event):void{
            console.log("mouseUpHandler()");
            //if(event.target.hasOwnProperty('location')){
            this.sendNotification(GameCommand.USER_SELECTED);
            //}
        }

        private doClick(event:egret.Event):void{
            if(CommonData.isRunning && (egret.getTimer() - this.lastMoveTime) >= 50) {
               this.sendNotification(GameCommand.USER_SELECT,  event.target);
                this.lastMoveTime = egret.getTimer();
            }
        }

        public updateTime():void{
            this.sendNotification(GameProxy.UPDATE_TIMER, this.timer.currentCount());
        }

        public timeOver():void{
            CommonData.isRunning = false;
            console.log(CommonData.isRunning);
            this.sendNotification(GameProxy.GAME_RESULT, true);
        }

        /**
         * 上次移动的时间 ， 防止过快设置移动
         */
        private lastMoveTime:number = 0;

        public get main():AppContainer{
            return <AppContainer><any> (this.viewComponent);
        }
    }
}