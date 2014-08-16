

module game {

    export class MainMenuUI extends egret.gui.SkinnableComponent{
        public addLabel:egret.gui.Label;
        public scoreLabel:egret.gui.Label;
        public highScoreLabel:egret.gui.Label;
        public resetButton:egret.gui.Button;
        public timerLabel:egret.gui.Label;

        public constructor(){
            super();
            this.skinName = MainMenuUISkin;
            this.addEventListener(egret.gui.UIEvent.CREATION_COMPLETE, this.createCompleteEvent, this);
        }

        public createCompleteEvent(event:egret.gui.UIEvent):void{
            this.removeEventListener(egret.gui.UIEvent.CREATION_COMPLETE , this.createCompleteEvent, this);
            this.addEventListener(egret.Event.LEAVE_STAGE, this.leaveStageEvent, this);
            ApplicationFacade.getInstance().registerMediator( new MainMenuMediator(this) );
        }

        public leaveStageEvent(event:egret.gui.UIEvent):void{
            console.log("...");
        }

        public partAdded(partName:string, instance:any):void{
            super.partAdded(partName , instance);
            if(this.addLabel == instance){
                this.addLabel.visible = false;
            }
        }

        private moveEffect_effectEndHandler():void
        {
            this.addLabel.visible = false;
        }

        /**
         * 加分效果
         */
        public playScoreEffect(addScore:number):void{
            this.addLabel.visible = true;
            this.addLabel.text = "+".concat(addScore.toString());
            egret.Tween.removeTweens(this.addLabel);
            this.addLabel.y = 25;
            egret.Tween.get(this.addLabel).to({y:0},300).call(this.moveEffect_effectEndHandler , this);
        }
    }
}