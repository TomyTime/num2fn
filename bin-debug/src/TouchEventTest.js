var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var TouchEventTest = (function (_super) {
    __extends(TouchEventTest, _super);
    function TouchEventTest() {
        _super.call(this);
        this.count = 0;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }
    TouchEventTest.prototype.onAddToStage = function (event) {
        //添加显示文本
        this.drawText();

        //绘制一个透明度为1的绿色矩形，宽高为100*80
        var spr1 = new egret.Sprite();
        var stageW = this.stage.stageWidth;
        var stageH = this.stage.stageHeight;

        spr1.graphics.beginFill(0x00ff00, 0.8);
        spr1.graphics.drawRect(0, 0, 100, 100);
        spr1.graphics.endFill();
        spr1.width = 100;
        spr1.height = 100;
        this.addChild(spr1);
        spr1.x = stageW / 2 - 50;
        spr1.y = stageH / 2 - 100;

        //spr1.alpha = 0;
        //开启spr1的Touch开关
        spr1.touchEnabled = true;

        //注册事件
        spr1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this);
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTaps, this, true);
    };

    TouchEventTest.prototype.onTouch = function (evt) {
        //this.txt.text += "\n点击了spr1";
        this.count++;
        this.txt.text = "点击了 " + this.count + " 次";
        console.log("\n点击了spr1");
    };

    TouchEventTest.prototype.onTouchTap = function (evt) {
        //this.txt.text += "\n容器冒泡侦听\n---------";
        console.log("\n容器冒泡侦听\n---------");
    };

    TouchEventTest.prototype.onTouchTaps = function (evt) {
        //this.txt.text += "\n容器捕获侦听";
        console.log("\n容器捕获侦听");
    };

    TouchEventTest.prototype.drawText = function () {
        this.txt = new egret.TextField();
        this.txt.size = 12;
        this.txt.x = 250;
        this.txt.width = 200;
        this.txt.height = 200;
        this.txt.text = "点击次数";
        this.addChild(this.txt);
    };
    return TouchEventTest;
})(egret.DisplayObjectContainer);
TouchEventTest.prototype.__class__ = "TouchEventTest";
