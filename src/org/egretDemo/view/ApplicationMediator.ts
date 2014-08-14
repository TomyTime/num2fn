

module game {

    export class ApplicationMediator extends puremvc.Mediator implements puremvc.IMediator{
        public static NAME:string = "ApplicationMediator";
        public constructor(viewComponent:any){
            super(ApplicationMediator.NAME, viewComponent);

            this.main.addEventListener(egret.TouchEvent.TOUCH_TAP , this.mouseTapHandle , this)

            //为PC和移动端设置不同的移动策略
           /* if(egret.MainContext.deviceType != egret.MainContext.DEVICE_MOBILE)
            {
                var self = this;
                document.addEventListener("click",function(event:MouseEvent){
                    *//*switch (event.keyCode) {
                        case 38:
                            self.doMove(0);
                            break;
                        case 39:
                            self.doMove(1);
                            break;
                        case 40:
                            self.doMove(2);
                            break;
                        case 37:
                            self.doMove(3);
                            break;
                    }*//*
                    self.doClick();
                });
            }
            else
            {
//                this.main.addEventListener(egret.TouchEvent.TOUCH_BEGIN , this.mouseDownHandle , this)
                this.main.addEventListener(egret.TouchEvent.TOUCH_TAP , this.mouseTapHandle , this)
            }*/
        }

        private downPoint:egret.Point;
        private movePoint:egret.Point;
        private mouseTapHandle(event:egret.TouchEvent):void{
            this.downPoint = this.main.globalToLocal(event.stageX, event.stageY);
            this.doClick(event);
        }

        private needMove:boolean;
        private stage_mouseMoveHandler(event:egret.TouchEvent):void{
            if(!this.movePoint)
                this.movePoint = new egret.Point();
            this.movePoint.x = event.stageX;
            this.movePoint.y = event.stageY;
            if (this.needMove)
                return;
            this.needMove = true;
        }

        public stage_mouseUpHandler(event:egret.Event):void{
            egret.gui.UIGlobals.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE,
                this.stage_mouseMoveHandler,
                this);
            egret.gui.UIGlobals.stage.removeEventListener(egret.TouchEvent.TOUCH_END,
                this.stage_mouseUpHandler,
                this);
            egret.gui.UIGlobals.stage.addEventListener(egret.Event.LEAVE_STAGE,
                this.stage_mouseUpHandler,
                this);
            if(this.needMove){
//                this.updateWhenMouseUp();
                this.needMove = false;
            }
        }

        private doClick(event:egret.Event):void{
            if(CommonData.isRunning && (egret.getTimer() - this.lastMoveTime)>=150) {
//                this.sendNotification(GridProxy.SELECT_TILE,  event.target);
               this.sendNotification(GameCommand.USER_SELECT,  event.target);
                this.lastMoveTime = egret.getTimer();
            }
        }

        /**
         * 上次移动的时间 ， 防止过快设置移动
         */
        private lastMoveTime:number = 0;

        public listNotificationInterests():Array<any>{
            return [];
        }

        public handleNotification(notification:puremvc.INotification):void{
            switch(notification.getName()){
            }
        }

        public get main():AppContainer{
            return <AppContainer><any> (this.viewComponent);
        }
    }
}