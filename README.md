num2fn
======

在豌豆荚里看到过[消灭数字](http://www.wandoujia.com/apps/com.remember.coushu "消灭数字传奇")这样的游戏
于是用Egret引擎模仿实现了一个类似的游戏
玩法介绍
-------
1.  4*4格子布局中，每个格子代表[-4,4]区间内一个非0的数字
2.  万家可以任意相邻格子
3.  如果选中格子代表数字求和为零，则消除刚才选中格子，更新分数，然后生成新格子；
   如果不为零，则游戏继续
4.  如果当前操作超过30s还没有成功消除格子，那么游戏失败

目前存在问题
-------
1.  不能保证当前格子布局内的任意相邻数字能够求和为零
   需要一个检测机制，如果没有能求和为零的相邻格子，则重新布局
2.  游戏点击和触摸操作事件需要优化.目前只做了移动终端触摸事件，pc端有明显问题.
3.  游戏计时器在一次成功的消除数字操作后有延迟

- - -
<p>update 2014-8-10<br>
egret demo from [2014Egret](https://github.com/f111fei/2048egret "2014Egret")<br>
update to egret v1.0.3
<p>
