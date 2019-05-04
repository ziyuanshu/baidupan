# [原创]突破百度网盘限速教程
![TamperMonkey v4.5](https://img.shields.io/badge/TamperMonkey-v4.8-brightgreen.svg) ![Chrome x64 v60.4](https://img.shields.io/badge/Chrome%20x64-v73.0-brightgreen.svg) ![Safari v11.0.3](https://img.shields.io/badge/Safari%20-v12.0-brightgreen.svg)

本教程基于脚本 [百度网盘直链下载助手](https://greasyfork.org/zh-CN/scripts/39504)

### 1. 安装 Ant Download Manager 

[下载地址](https://www.antdownloadmanager.com/cgi/download.cgi)

安装过程程序会自动安装Chrome，Firefox，Edge插件，安装结束后重启浏览器，再浏览器扩展管理中启用插件

![](https://ws1.sinaimg.cn/large/4db689e3ly1g1wjs4dmkuj20dw07ajro.jpg)

插件安装后浏览器扩展栏图标

![](https://ws1.sinaimg.cn/large/4db689e3ly1g1wjtedipyj206n01bweb.jpg)

没有出现蚂蚁图标怎么办？（已出现的略过）

找到安装目录里的【antCH】目录下的【antCH.crx】拖动到浏览器扩展界面进行安装

![](https://ws1.sinaimg.cn/large/4db689e3ly1g1wkmyqjp9j20in056glj.jpg)

软件安装成功后界面如图

![](https://ww1.sinaimg.cn/large/4db689e3ly1g1wjl7pr6hj20mz0d5gmk.jpg)

点击设置按钮，修改配置参数

![](https://ws1.sinaimg.cn/large/4db689e3ly1g1xeohud5tj20iu0feadg.jpg)

![](https://ws1.sinaimg.cn/large/4db689e3ly1g1xcyc3sa4j20iu0fe41o.jpg)

### 2. 使用脚本下载

进入我的网盘勾选要下载的文件，下载助手=》API下载=》显示链接

![](https://ws1.sinaimg.cn/large/4db689e3ly1g1wk0anzisj20yr0gbq5b.jpg)

此时会调用ADM进行下载，**一定要等文件名出来以后再点击下载按钮**

![](https://ws1.sinaimg.cn/large/4db689e3ly1g1wk2edhpqj20e60abmyb.jpg)

### 3. 实测下载速度

![](https://ws1.sinaimg.cn/large/4db689e3ly1g1wki00366j20e30dh76h.jpg)


### 常见问题

**Q: 下载卡在99%**

A1: 右键【停止】任务(停止，不是暂停)，等5秒，右键【开始】。

**Q: 下载过程中速度不稳定**

A1: 修改配置，下载缓存大小先改成200，如不稳定改成80，修改前请先【停止】任务

**Q: 无法安装 Chrome 扩展**

A1: 参考 https://antdownloadmanager.com/user_guide.php?lng=xx&cc=CN

### 捐赠
本脚本不收取任何费用 , 如果您觉得本脚本对您有帮助，您可以通过支付宝或微信，扫描二维码，捐赠 X元，也可以扫码领取支付宝红包，^_^，谢谢！

![微信](https://i.loli.net/2019/05/04/5ccc6d088bc31.jpg) ![支付宝](https://i.loli.net/2019/05/04/5ccc6d08a22f7.jpg)
