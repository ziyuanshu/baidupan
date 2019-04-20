# 脚本使用说明
![TamperMonkey v4.5](https://img.shields.io/badge/TamperMonkey-v4.8-brightgreen.svg) ![Chrome x64 v60.4](https://img.shields.io/badge/Chrome%20x64-v73.0-brightgreen.svg) ![Safari v11.0.3](https://img.shields.io/badge/Safari%20-v12.0-brightgreen.svg)

本教程基于脚本 [百度网盘直链下载助手](https://greasyfork.org/zh-CN/scripts/39504)

### 安装教程

#### 一、安装脚本管理器（必须）

**前往浏览器扩展中心安装 Tampermonkey 或暴力猴**

|  浏览器 |  安装地址 |
| ------------ | ------------ |
|  360极速浏览器 |  https://ext.chrome.360.cn/webstore/detail/dhdgffkkebhmkfjojejmpbldmpobfkfo |
|  QQ浏览器 |  qqbrowser://extensions/search?key=Tampermonkey |
|  UC浏览器 |  离线安装包 [Tampermonkey.crx](https://open-1252026789.cos.ap-beijing.myqcloud.com/Tampermonkey.crx) |
|  遨游浏览器 |  http://extension.maxthon.cn/detail/index.php?view_id=1680&category_id=10 |
|  Chrome浏览器 |  https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo |
|  火狐浏览器 |  https://addons.mozilla.org/zh-CN/firefox/addon/tampermonkey/ |
|  Microsoft Edge |  https://www.microsoft.com/store/p/tampermonkey/9nblggh5162s |
|  其他浏览器 |  同UC |

安装成功后浏览器扩展栏将出现

![](https://ww1.sinaimg.cn/large/4db689e3ly1g15iix9j24j20qf0130sq.jpg)

#### 二、安装百度网盘直链下载助手（必须）

[安装地址1](https://greasyfork.org/zh-CN/scripts/39504) 或 [安装地址2](https://openuserjs.org/scripts/syhyz1990/百度网盘直链下载助手)

点击安装此脚本

![](https://ww1.sinaimg.cn/large/4db689e3ly1g15isj5ld3j20pf0ddju4.jpg)

点击安装

![](https://ww1.sinaimg.cn/large/4db689e3ly1g15ixn2kexj20qs0di0wg.jpg)

安装成功后脚本列表中会出现

![](https://ww1.sinaimg.cn/large/4db689e3ly1g15iwtanyxj20yx01g3ym.jpg)

#### 三、安装 Internet Download Manager（可选）

不安装此软件可使用浏览器自带的下载功能下载，如需提高下载速度，需要安装此软件

下载地址 : http://internetdownloadmanager.com/download.html

![](https://ww1.sinaimg.cn/large/4db689e3ly1g15jfiw03yj20p80ej3zq.jpg)

软件安装成功后将安装目录里的 **IDMGCExt.crx** 拖动到浏览器的扩展页面中进行安装 , 成功后浏览器扩展栏中会出现 IDM 图标 , **成功后重启浏览器**  (Chrome浏览器请使用开发者模式安装)

![](https://ww1.sinaimg.cn/large/4db689e3ly1g15j5c5mg4j20p0013t8p.jpg)


### 脚本安装成功界面

#### 我的网盘页面 

![](https://ww1.sinaimg.cn/large/4db689e3ly1g15j96ogr7j211y0gcwgw.jpg)

|  功能按钮说明 |  示例 |
| ------------ | ------------ |
|  API下载 |  ![](https://ww1.sinaimg.cn/large/4db689e3ly1g15jnpa1s8j20ku061aar.jpg) |
|  外链下载 |  ![](https://ww1.sinaimg.cn/large/4db689e3ly1g15jqtg41wj20ko059t94.jpg) |

#### 网盘分享页面 

![](https://ww1.sinaimg.cn/large/4db689e3ly1g15jd6ghowj211y0gcta2.jpg)

|  功能按钮说明 |  示例 |
| ------------ | ------------ |
|  直接下载 |  点击后调用浏览器或IDM的下载功能 |
|  显示链接 |  显示获取到的链接地址 |

### 脚本功能演示

#### 我的网盘页面

![](https://ww1.sinaimg.cn/large/4db689e3ly1g15k4dcp6yg20zg0gce81.gif)

#### 网盘分享页面 

![](https://ww1.sinaimg.cn/large/4db689e3ly1g15ka0b327g20zg0gce6t.gif)

### 注意事项

**1. 直接复制链接到迅雷或idm中无效**

**2. 弹出idm新建任务对话框 , 等获取到文件名和文件大小后方可开始下载**

![](https://ww1.sinaimg.cn/large/4db689e3ly1g15kiwmrnfj20g006lgm5.jpg)


### 常见问题

**Q: 安装脚本后没显示[下载助手]按钮**

A1: 请检查浏览器是否已安装tampermonkey或暴力猴 , 并启用脚本，Tampermonkey请安装4.7以上版本，如下图所示

![](https://ws1.sinaimg.cn/large/4db689e3ly1g1xczrzk7tj209209cmxj.jpg)

A2: 国产双核浏览器请切换内核为高速(极速)模式

A3: 是否安装了其他的百度网盘脚本或插件 , 请禁用删除后再试

A4: 换用其他浏览器尝试

**Q: 链接复制到IDM中提示403**

A: 直接复制链接到迅雷或idm中无效

**Q: Chrome浏览器无法安装crx扩展**

A: 请按照下列方法安装（适合于Chrome73以下版本）

![](http://ww1.sinaimg.cn/large/4db689e3ly1g1bochg39lg20vd0manpd.gif)

**Q: 无法调用IDM下载**

A: 确保IDM和IDM浏览器扩展正确安装 , 或换用其他浏览器（推荐360或QQ，简单快捷）

**Q: 下载速度很慢 , 只有几百K**

A: 账号被百度限速 , 参见 [解决方法](https://github.com/syhyz1990/baiduyun/blob/master/ADM.md) 或购买 [百度网盘会员](https://pan.baidu.com/buy/center)

**Q: 如何使用批量下载**

A: 浏览器一次只能下载单个文件 , 多个文件请使用批量链接, 弹出IDM下载窗口进行操作 , 批量复制链接无效

### 捐赠
本脚本不收取任何费用 , 如果您觉得本脚本对您有帮助，您可以通过支付宝或微信，扫描二维码，捐赠 X元，也可以扫码领取支付宝红包，^_^，谢谢！

 ![微信](https://ww1.sinaimg.cn/large/4db689e3ly1g0ae1ogfjbj205k05yjrl.jpg) ![支付宝](https://ww1.sinaimg.cn/large/4db689e3ly1g0ae1oc3o4j205k05yweg.jpg) ![领支付宝红包](https://ww1.sinaimg.cn/large/4db689e3ly1g1aj9cf6wuj205k05ymxi.jpg)
