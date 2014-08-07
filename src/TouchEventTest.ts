class TouchEventTest extends egret.DisplayObjectContainer
 {
 
 	 private count:number;
     public constructor()
     {
         super();
         this.count = 0;
         this.addEventListener(egret.Event.ADDED_TO_STAGE,this.onAddToStage,this);
     }
 
     private onAddToStage(event:egret.Event)
     {
         //添加显示文本
         this.drawText();
 
         //绘制一个透明度为1的绿色矩形，宽高为100*80
         var spr1:egret.Sprite = new egret.Sprite();
         var stageW:number = this.stage.stageWidth;
         var stageH:number = this.stage.stageHeight;

         spr1.graphics.beginFill(0x00ff00, 0.8);
         spr1.graphics.drawRect(0, 0, 100, 100);
         spr1.graphics.endFill();
         spr1.width = 100;
         spr1.height = 100;
         this.addChild( spr1 );
         spr1.x = stageW / 2 - 50;
         spr1.y = stageH / 2 - 100;
         //spr1.alpha = 0;
         
         //开启spr1的Touch开关
         spr1.touchEnabled = true;
 
         //注册事件
         spr1.addEventListener( egret.TouchEvent.TOUCH_TAP, this.onTouch, this );
         this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this);
         this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTaps, this, true);
     }
 
     private onTouch( evt:egret.TouchEvent )
     {
         //this.txt.text += "\n点击了spr1";
         this.count++;
         this.txt.text = "点击了 " + this.count + " 次";
         console.log("\n点击了spr1");
     }
 
     private onTouchTap( evt:egret.TouchEvent )
     {
         //this.txt.text += "\n容器冒泡侦听\n---------";
         console.log("\n容器冒泡侦听\n---------");
     }
 
     private onTouchTaps( evt:egret.TouchEvent )
     {
         //this.txt.text += "\n容器捕获侦听";
         console.log("\n容器捕获侦听");
     }
 
     //绘制文本
     private  txt:egret.TextField;
     private drawText():void
     {
         this.txt = new egret.TextField();
         this.txt.size = 12;
         this.txt.x = 250;
         this.txt.width = 200;
         this.txt.height = 200;
         this.txt.text = "点击次数";
         this.addChild( this.txt );
     }
 
 }