

module game {

    export class MainMenuUISkin extends egret.gui.Skin{

        public constructor(){
            super();
        }

        /**
         * 和主机组件匹配的皮肤部件
         */
        private static _skinParts:Array<string> = ["addLabel","scoreLabel","highScoreLabel","resetButton","timerLabel"];

        public get skinParts():Array<string>{
            return MainMenuUISkin._skinParts;
        }

        /**
         * 游戏计时器
         */
        public timerLabel:egret.gui.Label;

        /**
         * 加分文本
         */
        public addLabel:egret.gui.Label;

        /**
         * 总分文本
         */
        public scoreLabel:egret.gui.Label;

        /**
         * 最高分文本
         */
        public highScoreLabel:egret.gui.Label;

        /**
         * 重置按钮
         */
        public resetButton:egret.gui.Button;

        public createChildren():void
        {
            super.createChildren;
            var uiAsset:egret.gui.UIAsset = new egret.gui.UIAsset();
            uiAsset.source = "source.menu";
            this.addElement(uiAsset);

            this.resetButton = new egret.gui.Button();
            this.resetButton.skinName = ResetButtonSkin;
            this.resetButton.right = 10;
            this.resetButton.top = 70;
            this.resetButton.label = "重置游戏";
            this.addElement(this.resetButton);

            this.highScoreLabel = new egret.gui.Label();
            this.highScoreLabel.text = "0";
            this.highScoreLabel.horizontalCenter = 203;
            this.highScoreLabel.size = 23;
            this.highScoreLabel.textAlign = "center";
            this.highScoreLabel.textColor = 0xFFFFFF;
            this.highScoreLabel.verticalAlign = "middle";
            this.highScoreLabel.top = 40;
            this.addElement(this.highScoreLabel);

            this.timerLabel = new egret.gui.Label();
            this.timerLabel.text = "30:00";
            this.timerLabel.size = 20;
            this.timerLabel.width = 80;
            this.timerLabel.height = 30;
            this.timerLabel.textAlign = "center";
            this.timerLabel.textColor = 0x999999;
            this.timerLabel.verticalAlign = "middle";
            this.addElement(this.timerLabel);


            var group:egret.gui.Group = new egret.gui.Group;
            group.width = 96;
            group.height = 56;
            group.right = 103;
            group.top = 5;
            this.addElement(group);

            this.scoreLabel = new egret.gui.Label();
            this.scoreLabel.text = "0";
            this.scoreLabel.horizontalCenter = 0;
            this.scoreLabel.size = 23;
            this.scoreLabel.textAlign = "center";
            this.scoreLabel.textColor = 0xFFFFFF;
            this.scoreLabel.verticalAlign = "middle";
            this.scoreLabel.percentWidth = 100;
            this.scoreLabel.y = 25;
            this.scoreLabel.top = 34;
            group.addElement(this.scoreLabel);

            this.addLabel = new egret.gui.Label();
            this.addLabel.horizontalCenter = 0;
            this.addLabel.size = 20;
            this.addLabel.textColor = 0x8B8177;
            group.addElement(this.addLabel);
        }

    }
}