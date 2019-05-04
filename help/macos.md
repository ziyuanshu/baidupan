# MacOS平台使用说明
![TamperMonkey v4.5](https://img.shields.io/badge/TamperMonkey-v4.8-brightgreen.svg) ![Chrome x64 v60.4](https://img.shields.io/badge/Chrome%20x64-v73.0-brightgreen.svg) ![Safari v11.0.3](https://img.shields.io/badge/Safari%20-v12.0-brightgreen.svg)

本教程基于脚本 [百度网盘直链下载助手](https://greasyfork.org/zh-CN/scripts/39504)

## 安装教程

### 一、安装脚本管理器（必须）

mac平台用户请先下载 Chrome浏览器 或 火狐浏览器

**前往浏览器扩展中心安装 Tampermonkey 或暴力猴**

|  浏览器 |  安装地址 |
| ------------ | ------------ |
|  Chrome浏览器 |  https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo |
|  火狐浏览器 |  https://addons.mozilla.org/zh-CN/firefox/addon/tampermonkey/ |


安装成功后浏览器扩展栏将出现

![](https://i.loli.net/2019/05/04/5cccfb3b96734.jpg)

### 二、安装百度网盘直链下载助手（必须）

[安装地址1](https://greasyfork.org/zh-CN/scripts/39504) (推荐) 或 [安装地址2](https://openuserjs.org/scripts/syhyz1990/百度网盘直链下载助手)

点击安装此脚本

![](https://i.loli.net/2019/05/04/5cccfa63357d9.png)

点击安装

![](https://i.loli.net/2019/05/04/5cccfadda0afb.png)

安装成功后脚本列表中会出现

![](https://i.loli.net/2019/05/04/5cccfaa8e719e.png)

### 三、安装 NeatDownloadManager 

不安装此软件可使用浏览器自带的下载功能下载，如需提高下载速度，需要安装此软件

下载地址 : https://www.neatdownloadmanager.com/index.php/en/

![](https://i.loli.net/2019/05/04/5ccd11e65c9ab.png) 

软件安装成功后点击界面上的 "Browsers" 按钮 , 安装对应浏览器扩展 , 成功后如下图 , 

![](https://i.loli.net/2019/05/04/5ccd0c7b71968.png)

可在设置中修改线程为 32 提高下载速度

![](https://i.loli.net/2019/05/04/5ccd0d7d7b0f6.png)


## 脚本安装成功界面

### 我的网盘页面 


![](https://i.loli.net/2019/05/04/5cccfb79e3a81.jpg)

|  功能按钮说明 |  示例 |
| ------------ | ------------ |
|  API下载 |  ![](https://i.loli.net/2019/05/04/5cccf82c408fa.png) |
|  外链下载 |  ![](https://i.loli.net/2019/05/04/5cccf82c583af.png) |

### 网盘分享页面 

![](https://i.loli.net/2019/05/04/5cccfb79e7b1a.jpg)

|  功能按钮说明 |  示例 |
| ------------ | ------------ |
|  直接下载 |  点击后调用浏览器或NeatDownloadManager的下载功能 |
|  显示链接 |  显示获取到的链接地址 |

## 脚本功能演示

### 我的网盘页面

![](https://i.loli.net/2019/05/04/5ccd0e13a34a4.png)

![](https://i.loli.net/2019/05/04/5ccd128720cb5.png)

## 注意事项

**1. 直接复制链接到迅雷或NeatDownloadManager中无效**

## 常见问题

**Q: 安装脚本后没显示[下载助手]按钮**

A1: 请检查浏览器是否已安装tampermonkey或暴力猴 , 并启用脚本，Tampermonkey请安装4.7以上版本，如下图所示

![](https://i.loli.net/2019/05/04/5cccfbea863cb.jpg)

A2: 是否安装了其他的百度网盘脚本或插件 , 请禁用删除后再试

A3: 换用其他浏览器尝试

**Q: 链接复制到IDM中提示403**

A: 直接复制链接到迅雷或idm中无效

**Q: Chrome浏览器无法安装扩展**

A: 需要科[翻]学[墙]上网或换用火狐浏览器

**Q: 无法调用NeatDownloadManager下载**

A: 确保NeatDownloadManager和NeatDownloadManager浏览器扩展正确安装 , 或换用其他浏览器

**Q: 下载速度很慢 , 只有几百K**

A: 账号被百度限速 , 开启32线程 或 购买 [百度网盘会员](https://pan.baidu.com/buy/center)

**Q: 如何批量下载**

A: 可以勾选多个文件使用显示链接获取到每个文件的下载地址, 使用对应下载工具一个个添加 , 不要勾选文件夹哦

## 捐赠作者
本脚本不收取任何费用 , 如果您觉得本脚本对您有帮助，您可以通过支付宝或微信，扫描二维码，捐赠 X元，也可以扫码领取支付宝红包，^_^，谢谢！

![微信](https://i.loli.net/2019/05/04/5ccc6d088bc31.jpg) ![支付宝](https://i.loli.net/2019/05/04/5ccc6d08a22f7.jpg)
