// ==UserScript==
// @name              百度网盘直链下载助手
// @name:en           Baidu Netdisk Assistant
// @name:zh           百度网盘直链下载助手
// @name:zh-CN        百度网盘直链下载助手
// @name:ja           Baidu Netdiskストレートチェーンダウンロードアシスタントv4
// @namespace         https://github.com/syhyz1990/baiduyun
// @version           4.1.0
// @icon              https://www.baiduyun.wiki/48x48.png
// @description       【百度网盘直链下载助手】是一款免客户端获取百度网盘文件真实下载地址的油猴插件，支持Windows，Mac，Linux，Android等多平台，可使用IDM，XDown等多线程加速工具加速下载，支持RPC协议远程下载。
// @description:en    [Baidu Netdisk Assistant] is an oil monkey plug-in that does not require clients to obtain the real download address of Baidu Netdisk files. It supports Windows, Mac, Linux, Android and other platforms. Multithreaded acceleration tools such as IDM and XDown can be used. Accelerate download, support remote download.
// @description:ja    [Baidu Netdiskストレートチェーンダウンロードアシスタント]は、クライアントがBaidu Netdiskファイルの実際のダウンロードアドレスを取得する必要のないオイルモンキープラグインです。Windows、Mac、Linux、Android、およびその他のプラットフォームをサポートしています。IDMやXDownなどのマルチスレッドアクセラレーションツールを使用できます。 ダウンロードの高速化、リモートダウンロードのサポート、バージョン4.0.0の新しいアップグレード。
// @author            syhyz2020
// @license           AGPL
// @supportURL        https://github.com/syhyz1990/baiduyun
// @updateURL         https://www.baiduyun.wiki/baiduyun.user.js
// @downloadURL       https://www.baiduyun.wiki/baiduyun.user.js
// @match             *://pan.baidu.com/disk/home*
// @match             *://yun.baidu.com/disk/home*
// @match             *://pan.baidu.com/s/*
// @match             *://yun.baidu.com/s/*
// @match             *://pan.baidu.com/share/*
// @match             *://yun.baidu.com/share/*
// @require           https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @require           https://cdn.jsdelivr.net/npm/sweetalert2@9
// @connect           baidu.com
// @connect           baidupcs.com
// @connect           meek.com.cn
// @connect           *
// @run-at            document-idle
// @grant             unsafeWindow
// @grant             GM_addStyle
// @grant             GM_xmlhttpRequest
// @grant             GM_setClipboard
// @grant             GM_setValue
// @grant             GM_getValue
// @grant             GM_openInTab
// @grant             GM_registerMenuCommand
// ==/UserScript==

;(function () {
    'use strict';

    const version = '4.1.0';
    const classMap = {
        'bar-search': 'OFaPaO',
        'list-tools': 'tcuLAu',
        'header': 'vyQHNyb'
    };
    const errorMsg = {
        'dir': '提示：不支持整个文件夹下载，可进入文件夹内获取文件链接下载！',
        'unlogin': '提示：登录百度网盘后才能使用此功能哦！',
        'fail': '提示：获取下载链接失败！请刷新网页后重试！',
        'unselected': '提示：请先选择要下载的文件！',
        'morethan': '提示：多个文件请点击【显示链接】！',
        'toobig': '提示：只支持300M以下的文件夹，若链接无法下载，请进入文件夹后勾选文件获取！',
        'timeout': '提示：页面过期，请刷新重试！',
        'wrongcode': '提示：获取验证码失败！',
        'deleted': '提示：文件不存在或已被百度和谐，无法下载！',
    };
    let defaultCode = 250528;
    let secretCode = getValue('secretCodeV') ? getValue('secretCodeV') : defaultCode;
    let ids = [];
    let userAgent = '';
    let userAgentDefault = navigator.userAgent;
    let number = ['', '①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨'];
    let copyright = 'Powerd By <a style="margin-left: 5px;" href="https://www.baiduyun.wiki" target="_blank">网盘直链下载助手</a>，建议配合网盘 <a href="https://pan.baidu.com/buy/checkoutcounter?from=homepage&svip=1" target="_blank">超级会员</a> 使用';
    let Toast = Swal.mixin({
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: false,
        onOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
        }
    });
    let ariaRPC = {
        domain: getValue('rpcDomain') ? getValue('rpcDomain') : 'http://localhost',
        port: getValue('rpcPort') ? getValue('rpcPort') : 6800,
        token: getValue('rpcToken') ? getValue('rpcToken') : '',
        dir: getValue('rpcDir') ? getValue('rpcDir') : 'D:/',
    };

    function clog(c1, c2, c3) {
        c1 = c1 ? c1 : '';
        c2 = c2 ? c2 : '';
        c3 = c3 ? c3 : '';
        console.group('[百度网盘直链下载助手]');
        console.log(c1, c2, c3);
        console.groupEnd();
    }

    function getBDUSS() {
        let baiduyunPlugin_BDUSS = getStorage('baiduyunPlugin_BDUSS') ? getStorage('baiduyunPlugin_BDUSS') : '{"baiduyunPlugin_BDUSS":""}';
        let BDUSS = JSON.parse(baiduyunPlugin_BDUSS).BDUSS;
        if (!BDUSS) {
            Swal.fire({
                icon: 'error',
                title: '提示',
                html: 'Aria链接获取需要配合<a href="https://www.baiduyun.wiki/zh-cn/assistant.html" target="_blank">【网盘万能助手】使用</a>',
                footer: '【网盘万能助手】是增强扩展插件，安装后请刷新',
                confirmButtonText: '安装'
            }).then((result) => {
                if (result.value) {
                    GM_openInTab('https://www.baiduyun.wiki/zh-cn/assistant.html', {active: true});
                }
            });

        }
        return BDUSS;
    }

    function aria2c(link, filename, ua) {
        let BDUSS = getBDUSS();
        ua = ua || userAgent;
        if (BDUSS) {
            return encodeURIComponent(`aria2c "${link}" --out "${filename}" --header "User-Agent: ${ua}" --header "Cookie: BDUSS=${BDUSS}"`);
        } else {
            return '请先安装网盘万能助手，安装后请重启浏览器！！！';
        }
    }

    function replaceLink(link) {
        //return link ? link.replace(/&/g, '&amp;amp;') : '';
        return link ? link.replace(/&/g, '&amp;') : '';
    }

    function detectPage() {
        let regx = /[\/].+[\/]/g;
        let page = location.pathname.match(regx);
        return page[0].replace(/\//g, '');
    }

    function getCookie(e) {
        let o, t;
        let n = document, c = decodeURI;
        return n.cookie.length > 0 && (o = n.cookie.indexOf(e + "="), -1 != o) ? (o = o + e.length + 1, t = n.cookie.indexOf(";", o), -1 == t && (t = n.cookie.length), c(n.cookie.substring(o, t))) : "";
    }

    function setCookie(key, value, t) {
        let oDate = new Date();  //创建日期对象
        oDate.setTime(oDate.getTime() + t * 60 * 1000); //设置过期时间
        document.cookie = key + '=' + value + ';expires=' + oDate.toGMTString();  //设置cookie的名称，数值，过期时间
    }

    function removeCookie(key) {
        setCookie(key, '', -1);  //cookie的过期时间设为昨天
    }

    function getValue(name) {
        return GM_getValue(name);
    }

    function setValue(name, value) {
        GM_setValue(name, value);
    }

    function getStorage(key) {
        return localStorage.getItem(key);
    }

    function setStorage(key, value) {
        return localStorage.setItem(key, value);
    }

    function getLogID() {
        let name = "BAIDUID";
        let u = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/~！@#￥%……&";
        let d = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g;
        let f = String.fromCharCode;

        function l(e) {
            if (e.length < 2) {
                let n = e.charCodeAt(0);
                return 128 > n ? e : 2048 > n ? f(192 | n >>> 6) + f(128 | 63 & n) : f(224 | n >>> 12 & 15) + f(128 | n >>> 6 & 63) + f(128 | 63 & n);
            }
            let n = 65536 + 1024 * (e.charCodeAt(0) - 55296) + (e.charCodeAt(1) - 56320);
            return f(240 | n >>> 18 & 7) + f(128 | n >>> 12 & 63) + f(128 | n >>> 6 & 63) + f(128 | 63 & n);
        }

        function g(e) {
            return (e + "" + Math.random()).replace(d, l);
        }

        function m(e) {
            let n = [0, 2, 1][e.length % 3];
            let t = e.charCodeAt(0) << 16 | (e.length > 1 ? e.charCodeAt(1) : 0) << 8 | (e.length > 2 ? e.charCodeAt(2) : 0);
            let o = [u.charAt(t >>> 18), u.charAt(t >>> 12 & 63), n >= 2 ? "=" : u.charAt(t >>> 6 & 63), n >= 1 ? "=" : u.charAt(63 & t)];
            return o.join("");
        }

        function h(e) {
            return e.replace(/[\s\S]{1,3}/g, m);
        }

        function p() {
            return h(g((new Date()).getTime()));
        }

        function w(e, n) {
            return n ? p(String(e)).replace(/[+\/]/g, function (e) {
                return "+" == e ? "-" : "_";
            }).replace(/=/g, "") : p(String(e));
        }

        return w(getCookie(name));
    }

    function Dialog() {
        let linkList = [];
        let showParams;
        let dialog, shadow;

        function createDialog() {
            let screenWidth = document.body.clientWidth;
            let dialogLeft = screenWidth > 800 ? (screenWidth - 800) / 2 : 0;
            let $dialog_div = $('<div class="dialog" style="width: 800px; top: 0px; bottom: auto; left: ' + dialogLeft + 'px; right: auto; display: hidden; visibility: visible; z-index: 52;"></div>');
            let $dialog_header = $('<div class="dialog-header"><h3><span class="dialog-title" style="display:inline-block;width:740px;white-space:nowrap;overflow-x:hidden;text-overflow:ellipsis"></span></h3></div>');
            let $dialog_control = $('<div class="dialog-control"><span class="dialog-icon dialog-close">×</span></div>');
            let $dialog_body = $('<div class="dialog-body"></div>');
            let $dialog_tip = $('<div class="dialog-tip"><p></p></div>');

            $dialog_div.append($dialog_header.append($dialog_control)).append($dialog_body);

            let $dialog_button = $('<div class="dialog-button" style="display:none"></div>');
            let $dialog_button_div = $('<div style="display:table;margin:auto"></div>');
            let $dialog_copy_button = $('<button id="dialog-copy-button">复制全部默认链接</button>');
            let $dialog_edit_button = $('<button id="dialog-edit-button" style="display:none">编辑</button>');
            let $dialog_exit_button = $('<button id="dialog-exit-button" style="display:none">退出</button>');

            $dialog_button_div.append($dialog_copy_button).append($dialog_edit_button).append($dialog_exit_button);
            $dialog_button.append($dialog_button_div);
            $dialog_div.append($dialog_button);

            $dialog_copy_button.click(function () {
                let content = '';
                if (showParams.type == 'batch') {
                    $.each(linkList, function (index, element) {
                        if (index == linkList.length - 1)
                            content += element.downloadlink[0];
                        else
                            content += element.downloadlink[0] + '\r\n';
                    });
                }
                if (showParams.type == 'batchAria') {
                    $.each(linkList, function (index, element) {
                        if (index == linkList.length - 1)
                            content += decodeURIComponent(aria2c(element.downloadlink[0], element.filename, userAgentDefault));
                        else
                            content += decodeURIComponent(aria2c(element.downloadlink[0], element.filename, userAgentDefault) + '\r\n');
                    });
                }
                if (showParams.type == 'rpc') {
                    $.each(linkList, function (index, element) {
                        if (element.downloadlink == 'error')
                            return;
                        if (index == linkList.length - 1)
                            content += element.downloadlink;
                        else
                            content += element.downloadlink + '\r\n';
                    });
                }
                if (showParams.type == 'shareLink') {
                    $.each(linkList, function (index, element) {
                        if (element.dlink == 'error')
                            return;
                        if (index == linkList.length - 1)
                            content += element.dlink;
                        else
                            content += element.dlink + '\r\n';
                    });
                }
                if (showParams.type == 'shareAriaLink') {
                    $.each(linkList, function (index, element) {
                        if (element.dlink == 'error')
                            return;
                        if (index == linkList.length - 1)
                            content += decodeURIComponent(aria2c(element.dlink, element.server_filename));
                        else
                            content += decodeURIComponent(aria2c(element.dlink, element.server_filename) + '\r\n');
                    });
                }
                GM_setClipboard(content, 'text');
                if (content != '') {
                    Toast.fire({
                        icon: 'success',
                        text: '已将链接复制到剪贴板！'
                    });

                } else {
                    Toast.fire({
                        icon: 'error',
                        text: '复制失败，请手动复制！'
                    });
                }
            });

            $dialog_edit_button.click(function () {
                let $dialog_textarea = $('div.dialog-body textarea[name=dialog-textarea]', dialog);
                let $dialog_item = $('div.dialog-body div', dialog);
                $dialog_item.hide();
                $dialog_copy_button.hide();
                $dialog_edit_button.hide();
                $dialog_textarea.show();
                $dialog_radio_div.show();
                $dialog_exit_button.show();
            });

            $dialog_exit_button.click(function () {
                let $dialog_textarea = $('div.dialog-body textarea[name=dialog-textarea]', dialog);
                let $dialog_item = $('div.dialog-body div', dialog);
                $dialog_textarea.hide();
                $dialog_radio_div.hide();
                $dialog_item.show();
                $dialog_exit_button.hide();
                $dialog_copy_button.show();
                $dialog_edit_button.show();
            });

            $dialog_div.append($dialog_tip);
            $('body').append($dialog_div);
            $dialog_control.click(dialogControl);
            return $dialog_div;
        }

        function createShadow() {
            let $shadow = $('<div class="dialog-shadow" style="position: fixed; left: 0px; top: 0px; z-index: 50; background: rgb(0, 0, 0) none repeat scroll 0% 0%; opacity: 0.5; width: 100%; height: 100%; display: none;"></div>');
            $('body').append($shadow);
            return $shadow;
        }

        this.open = function (params) {
            showParams = params;
            linkList = [];
            if (params.type == 'link') {
                linkList = params.list.urls;
                $('div.dialog-header h3 span.dialog-title', dialog).text(params.title + "：" + params.list.filename);
                $.each(params.list.urls, function (index, element) {
                    element.url = replaceLink(element.url);
                    let $div = $('<div><div style="width:30px;float:left">' + element.rank + ':</div><div style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis"><a href="' + element.url + '">' + element.url + '</a></div></div>');

                    $('div.dialog-body', dialog).append($div);
                });
            }

            //批量下载 - 我的网盘
            if (params.type == 'batch' || params.type == 'batchAria' || params.type == 'batchAriaRPC') {
                linkList = params.list;
                $('div.dialog-header h3 span.dialog-title', dialog).text(params.title);
                $.each(params.list, function (index, element) {
                    let $div = $('<div class="row"><div class="ui-title" title="' + element.filename + '">' + element.filename + '</div><span>：</span></div>');
                    if (params.type == 'batch') {  //API
                        $.each(element.downloadlink, function (i, e) {
                            if (i === 0) {
                                $div.append($('<a class="ui-link api-link" href="' + e + '" data-link=' + e + '>默认链接</a>'));
                            } else {
                                if (getValue('SETTING_B'))
                                    $div.append($('<a class="ui-link api-link" href="' + e + '"  data-link=' + e + '>备用链接' + number[i] + '</a>'));
                            }
                        });
                    }
                    if (params.type == 'batchAria') {  //Aria下载
                        $.each(element.downloadlink, function (i, e) {
                            let link = aria2c(e, element.filename, userAgentDefault);
                            if (i === 0) {
                                $div.append($('<a class="ui-link aria-link" data-link=' + link + ' href="javascript:;">默认链接</a>'));
                            } else {
                                if (getValue('SETTING_B'))
                                    $div.append($('<a class="ui-link aria-link" data-link=' + link + ' href="javascript:;">备用链接' + number[i] + '</a>'));
                            }
                        });
                    }
                    if (params.type == 'batchAriaRPC') {
                        $.each(element.downloadlink, function (i, e) {
                            if (i === 0) {
                                $div.append($('<a href="javascript:;" class="ui-link aria-rpc" data-link="' + e + '" data-filename="' + element.filename + '">发送默认</a>'));
                            } else {
                                if (getValue('SETTING_B'))
                                    $div.append($('<a href="javascript:;" class="ui-link aria-rpc" data-link="' + e + '" data-filename="' + element.filename + '">发送备用' + number[i] + '</a>'));
                            }
                        });
                    }
                    $('div.dialog-body', dialog).append($div);
                });
            }
            if (params.type == 'shareLink') {
                linkList = params.list;
                $('div.dialog-header h3 span.dialog-title', dialog).text(params.title);
                $.each(params.list, function (index, element) {
                    element.dlink = replaceLink(element.dlink);
                    if (element.isdir == 1) return;
                    let $div = $('<div class="row"><div class="ui-title" title="' + element.server_filename + '">' + element.server_filename + '</div><span>：</span><a href="' + element.dlink + '" class="share-download">' + element.dlink + '</a></div>');
                    $('div.dialog-body', dialog).append($div);
                });
            }
            if (params.type == 'rpcLink') {
                linkList = params.list;
                $('div.dialog-header h3 span.dialog-title', dialog).text(params.title);
                $.each(params.list, function (index, element) {
                    element.dlink = replaceLink(element.dlink);
                    if (element.isdir == 1) return;
                    let $div = $('<div class="row"><div class="ui-title" title="' + element.server_filename + '">' + element.server_filename + '</div><span>：</span><button class="aria-rpc" data-link="' + element.dlink + '" data-filename="' + element.server_filename + '">点击发送到Aria</button></div>');
                    $('div.dialog-body', dialog).append($div);
                });
            }
            if (params.type == 'shareAriaLink') {
                linkList = params.list;
                $('div.dialog-header h3 span.dialog-title', dialog).text(params.title);
                $.each(params.list, function (index, element) {
                    if (element.isdir == 1) return;
                    let link = decodeURIComponent(aria2c(element.dlink, element.server_filename));
                    let $div = $('<div class="row"><div class="ui-title" title="' + element.server_filename + '">' + element.server_filename + '</div><span>：</span><a href="javasctipt:void(0)" class="aria-link">' + link + '</a></div>');
                    $('div.dialog-body', dialog).append($div);
                });
            }

            if (params.tip) {
                $('div.dialog-tip p', dialog).html(params.tip);
            }

            if (params.showcopy) {
                $('div.dialog-button', dialog).show();
                $('div.dialog-button button#dialog-copy-button', dialog).show();
            }
            shadow.show();
            dialog.show();
        };

        this.close = function () {
            dialogControl();
        };

        function dialogControl() {
            $('div.dialog-body', dialog).children().remove();
            $('div.dialog-header h3 span.dialog-title', dialog).text('');
            $('div.dialog-tip p', dialog).text('');
            $('div.dialog-button', dialog).hide();
            $('div.dialog-radio input[type=radio][name=showmode][value=multi]', dialog).prop('checked', true);
            $('div.dialog-radio', dialog).hide();
            $('div.dialog-button button#dialog-copy-button', dialog).hide();
            $('div.dialog-button button#dialog-edit-button', dialog).hide();
            $('div.dialog-button button#dialog-exit-button', dialog).hide();
            dialog.hide();
            shadow.hide();
        }

        dialog = createDialog();
        shadow = createShadow();
    }

    function VCodeDialog(refreshVCode, confirmClick) {
        let dialog, shadow;

        function createDialog() {
            let screenWidth = document.body.clientWidth;
            let dialogLeft = screenWidth > 520 ? (screenWidth - 520) / 2 : 0;
            let $dialog_div = $('<div class="dialog" id="dialog-vcode" style="width:520px;top:0px;bottom:auto;left:' + dialogLeft + 'px;right:auto;display:none;visibility:visible;z-index:52"></div>');
            let $dialog_header = $('<div class="dialog-header"><h3><span class="dialog-header-title"><em class="select-text">提示</em></span></h3></div>');
            let $dialog_control = $('<div class="dialog-control"><span class="dialog-icon dialog-close icon icon-close"><span class="sicon">x</span></span></div>');
            let $dialog_body = $('<div class="dialog-body"></div>');
            let $dialog_body_div = $('<div style="text-align:center;padding:22px"></div>');
            let $dialog_body_download_verify = $('<div class="download-verify" style="margin-top:10px;padding:0 28px;text-align:left;font-size:12px;"></div>');
            let $dialog_verify_body = $('<div class="verify-body">请输入验证码：</div>');
            let $dialog_input = $('<input id="dialog-input" type="text" style="padding:3px;width:85px;height:23px;border:1px solid #c6c6c6;background-color:white;vertical-align:middle;" class="input-code" maxlength="4">');
            let $dialog_img = $('<img id="dialog-img" class="img-code" style="margin-left:10px;vertical-align:middle;" alt="点击换一张" src="" width="100" height="30">');
            let $dialog_refresh = $('<a href="javascript:;" style="text-decoration:underline;" class="underline">换一张</a>');
            let $dialog_err = $('<div id="dialog-err" style="padding-left:84px;height:18px;color:#d80000" class="verify-error"></div>');
            let $dialog_footer = $('<div class="dialog-footer g-clearfix"></div>');
            let $dialog_confirm_button = $('<a class="g-button g-button-blue" data-button-id="" data-button-index href="javascript:;" style="padding-left:36px"><span class="g-button-right" style="padding-right:36px;"><span class="text" style="width:auto;">确定</span></span></a>');
            let $dialog_cancel_button = $('<a class="g-button" data-button-id="" data-button-index href="javascript:;" style="padding-left: 36px;"><span class="g-button-right" style="padding-right: 36px;"><span class="text" style="width: auto;">取消</span></span></a>');

            $dialog_header.append($dialog_control);
            $dialog_verify_body.append($dialog_input).append($dialog_img).append($dialog_refresh);
            $dialog_body_download_verify.append($dialog_verify_body).append($dialog_err);
            $dialog_body_div.append($dialog_body_download_verify);
            $dialog_body.append($dialog_body_div);
            $dialog_footer.append($dialog_confirm_button).append($dialog_cancel_button);
            $dialog_div.append($dialog_header).append($dialog_body).append($dialog_footer);
            $('body').append($dialog_div);

            $dialog_control.click(dialogControl);
            $dialog_img.click(refreshVCode);
            $dialog_refresh.click(refreshVCode);
            $dialog_input.keypress(function (event) {
                if (event.which == 13)
                    confirmClick();
            });
            $dialog_confirm_button.click(confirmClick);
            $dialog_cancel_button.click(dialogControl);
            $dialog_input.click(function () {
                $('#dialog-err').text('');
            });
            return $dialog_div;
        }

        this.open = function (vcode) {
            if (vcode)
                $('#dialog-img').attr('src', vcode.img);
            dialog.show();
            shadow.show();
        };
        this.close = function () {
            dialogControl();
        };
        dialog = createDialog();
        shadow = $('div.dialog-shadow');

        function dialogControl() {
            $('#dialog-img', dialog).attr('src', '');
            $('#dialog-err').text('');
            dialog.hide();
            shadow.hide();
        }
    }

    //网盘页面的下载助手
    function PanHelper() {
        let yunData, sign, timestamp, bdstoken, logid, fid_list;
        let fileList = [], selectFileList = [], batchLinkList = [], batchLinkListAll = [], linkList = [];
        let dialog, searchKey;
        let panAPIUrl = location.protocol + "//" + location.host + "/api/";
        let restAPIUrl = location.protocol + "//pcs.baidu.com/rest/2.0/pcs/";
        let clientAPIUrl = location.protocol + "//d.pcs.baidu.com/rest/2.0/pcs/";

        this.init = function () {
            yunData = unsafeWindow.yunData;
            clog('初始化信息:', yunData);
            if (yunData === undefined) {
                clog('页面未正常加载，或者百度已经更新！');
                return false;
            }
            initVar();
            registerEventListener();
            addButton();
            createIframe();
            dialog = new Dialog({addCopy: true});
            clog('下载助手加载成功！当前版本：', version);
        };

        //获取选中文件
        function getSelectedFile() {
            return require("disk-system:widget/pageModule/list/listInit.js").getCheckedItems();
        }

        //初始化变量
        function initVar() {
            sign = getSign();
            timestamp = yunData.timestamp;
            bdstoken = yunData.MYBDSTOKEN;
            logid = getLogID();
        }

        function registerEventListener() {
            registerDownload();
            //registerShareClick();
        }

        //下载事件
        function registerDownload() {
            $(document).on('click', '.api-link', function (e) {
                e.preventDefault();
                if (e.target.dataset.link) {
                    execDownload(e.target.dataset.link);
                }
            });
            $(document).on('click', '.aria-rpc', function (e) {
                let link = e.target.dataset.link;
                let filename = e.target.dataset.filename;
                let headers = {};
                if (!isSuperVIP()) {  //普通用户需要设置userAgentDefault为空
                    headers = {
                        "User-Agent": userAgent
                    };
                }

                GM_xmlhttpRequest({
                    method: "HEAD",
                    headers: headers,
                    url: e.target.dataset.link,
                    onload: function (res) {
                        let finalUrl = res.finalUrl;
                        if (finalUrl) {
                            let url = ariaRPC.domain + ":" + ariaRPC.port + '/jsonrpc';
                            let json_rpc = {
                                id: new Date().getTime(),
                                jsonrpc: '2.0',
                                method: 'aria2.addUri',
                                params: [
                                    "token:" + ariaRPC.token,
                                    [finalUrl],
                                    {
                                        dir: ariaRPC.dir,
                                        out: filename,
                                        header: isSuperVIP() ? ['User-Agent:' + userAgentDefault, 'Cookie: BDUSS=' + getBDUSS()] : ['User-Agent:' + userAgent, 'Cookie: BDUSS=' + getBDUSS()]
                                    }
                                ]
                            };

                            GM_xmlhttpRequest({
                                method: "POST",
                                headers: {
                                    "User-Agent": userAgent
                                },
                                url: url,
                                responseType: 'json',
                                timeout: 3000,
                                data: JSON.stringify(json_rpc),
                                onload: function (response) {
                                    if (response.response.result) {
                                        Toast.fire({
                                            icon: 'success',
                                            title: '任务已发送至RPC下载器'
                                        });
                                    } else {
                                        Toast.fire({
                                            icon: 'error',
                                            title: response.response.message
                                        });
                                    }
                                },
                                ontimeout: function () {
                                    Toast.fire({
                                        icon: 'error',
                                        title: '无法连接到RPC服务，请检查RPC配置'
                                    });
                                }
                            });
                        }
                    },
                });
            });
        }

        //监视点击分享按钮
        function registerShareClick() {
            $(document).on('click', '[title="分享"]', function () {
                let inv = setInterval(function () {
                    if ($('#share-method-public').length === 0) {
                        $(".share-method-line").parent().append('<div class="share-method-line"><input type="radio" id="share-method-public" name="share-method" value="public" checked><span class="icon radio-icon icon-radio-non"></span><label for="share-method-public"><b>公开分享</b><span>任何人访问链接即可查看，下载！</span></div>');
                    } else {
                        clearInterval(inv);
                        $(document).off('click', '[title="分享"]');
                    }
                }, 100);
            });
        }

        //我的网盘 - 添加助手按钮
        function addButton() {
            $('div.' + classMap['bar-search']).css('width', '18%');
            let $dropdownbutton = $('<span class="g-dropdown-button"></span>');
            let $dropdownbutton_a = $('<a class="g-button g-button-blue" href="javascript:;"><span class="g-button-right"><em class="icon icon-picpre-download" title="百度网盘下载助手"></em><span class="text" style="width: 60px;">下载助手</span></span></a>');
            let $dropdownbutton_span = $('<span class="menu" style="width:114px"></span>');

            let $directbutton = $('<span class="g-button-menu" style="display:block"></span>');
            let $directbutton_span = $('<span class="g-dropdown-button g-dropdown-button-second" menulevel="2"></span>');
            let $directbutton_a = $('<a class="g-button" href="javascript:;"><span class="g-button-right"><span class="text" style="width:auto">直链下载</span></span></a>');
            let $directbutton_menu = $('<span class="menu" style="width:120px;left:79px"></span>');
            let $directbutton_batchhttplink_button = $('<a id="batchhttplink-direct" class="g-button-menu" href="javascript:;">显示链接</a>');
            $directbutton_menu.append($directbutton_batchhttplink_button);
            $directbutton.append($directbutton_span.append($directbutton_a).append($directbutton_menu));
            $directbutton.hover(function () {
                $directbutton_span.toggleClass('button-open');
            });
            $directbutton_batchhttplink_button.click(batchClick);

            let $ariadirectbutton = $('<span class="g-button-menu" style="display:block"></span>');
            let $ariadirectbutton_span = $('<span class="g-dropdown-button g-dropdown-button-second" menulevel="2"></span>');
            let $ariadirectbutton_a = $('<a class="g-button" href="javascript:;"><span class="g-button-right"><span class="text" style="width:auto">Aria下载</span></span></a>');
            let $ariadirectbutton_menu = $('<span class="menu" style="width:120px;left:79px"></span>');
            let $ariadirectbutton_batchhttplink_button = $('<a id="batchhttplink-aria" class="g-button-menu" href="javascript:;">显示链接</a>');
            $ariadirectbutton_menu.append($ariadirectbutton_batchhttplink_button);
            $ariadirectbutton.append($ariadirectbutton_span.append($ariadirectbutton_a).append($ariadirectbutton_menu));
            $ariadirectbutton.hover(function () {
                $ariadirectbutton_span.toggleClass('button-open');
            });
            $ariadirectbutton_batchhttplink_button.click(batchClick);

            let $ariarpcbutton = $('<span class="g-button-menu" style="display:block"></span>');
            let $ariarpcbutton_span = $('<span class="g-dropdown-button g-dropdown-button-second" menulevel="2"></span>');
            let $ariarpcbutton_a = $('<a class="g-button" href="javascript:;"><span class="g-button-right"><span class="text" style="width:auto">RPC下载</span></span></a>');
            let $ariarpcbutton_menu = $('<span class="menu" style="width:120px;left:79px"></span>');
            let $ariarpcbutton_batchhttplink_button = $('<a id="batchhttplink-rpc" class="g-button-menu" href="javascript:;">显示链接</a>');
            let $ariarpcbutton_setting_button = $('<a class="g-button-menu" href="javascript:;">RPC配置</a>');
            $ariarpcbutton_menu.append($ariarpcbutton_batchhttplink_button).append($ariarpcbutton_setting_button);
            $ariarpcbutton.append($ariarpcbutton_span.append($ariarpcbutton_a).append($ariarpcbutton_menu));
            $ariarpcbutton.hover(function () {
                $ariarpcbutton_span.toggleClass('button-open');
            });
            $ariarpcbutton_batchhttplink_button.click(batchClick);
            $ariarpcbutton_setting_button.click(rpcSetting);

            let $apibutton = $('<span class="g-button-menu" style="display:block"></span>');
            let $apibutton_span = $('<span class="g-dropdown-button g-dropdown-button-second" menulevel="2"></span>');
            let $apibutton_a = $('<a class="g-button" href="javascript:;"><span class="g-button-right"><span class="text" style="width:auto">API下载</span></span></a>');
            let $apibutton_menu = $('<span class="menu" style="width:120px;left:77px"></span>');
            let $apibutton_download_button = $('<a id="download-api" class="g-button-menu" href="javascript:;">直接下载</a>');
            let $apibutton_batchhttplink_button = $('<a id="batchhttplink-api" class="g-button-menu" href="javascript:;">显示链接</a>');
            let $setting_button = $('<a id="appid-setting" class="g-button-menu" href="javascript:;">神秘代码</a>');
            let $default_setting = $('<a id="default-setting" class="g-button-menu" href="javascript:;" style="color: #999;">恢复默认</a>');
            $apibutton_menu.append($apibutton_download_button).append($apibutton_batchhttplink_button)/*.append($setting_button).append($default_setting)*/;
            let $sharebutton = $('<span class="g-button-menu" style="display:block;cursor: pointer">分享选中(7天)</span>');
            let $versionButton = $('<a style="color: #e85653;font-weight: 700;" class="g-button-menu" href="javascript:;">Ver ' + version + '</a>');

            $apibutton.append($apibutton_span.append($apibutton_a).append($apibutton_menu));
            $apibutton.hover(function () {
                $apibutton_span.toggleClass('button-open');
            });
            $apibutton_download_button.click(downloadClick);
            $apibutton_batchhttplink_button.click(batchClick);
            $setting_button.click(setSecretCode);
            $default_setting.click(defaultSetting);
            $versionButton.click(versionButtonClick);
            $sharebutton.click(shareButtonClick);
            $dropdownbutton_span.append($apibutton)/*.append($directbutton)*/.append($ariadirectbutton).append($ariarpcbutton).append($sharebutton).append($versionButton);
            $dropdownbutton.append($dropdownbutton_a).append($dropdownbutton_span);
            $dropdownbutton.hover(function () {
                $dropdownbutton.toggleClass('button-open');
            });

            $('.' + classMap['list-tools']).append($dropdownbutton);
            $('.' + classMap['list-tools']).css('height', '40px');
        }

        function rpcSetting() {
            let dom = '';
            dom += '<div class="flex-center-between"><label for="rpcDomain" style="margin-right: 5px;flex: 0 0 100px;">主机：</label><input type="text" id="rpcDomain" value="' + ariaRPC.domain + '" class="swal2-input" placeholder="http://localhost"></div>';
            dom += '<div class="flex-center-between"><label for="rpcPort" style="margin-right: 5px;flex: 0 0 100px;">端口：</label><input type="text" id="rpcPort" value="' + ariaRPC.port + '" class="swal2-input" placeholder="6800"></div>';
            dom += '<div class="flex-center-between"><label for="rpcToken" style="margin-right: 5px;flex: 0 0 100px;">密钥：</label><input type="text" id="rpcToken" value="' + ariaRPC.token + '" class="swal2-input" placeholder="没有留空"></div>';
            dom += '<div class="flex-center-between"><label for="rpcDir" style="margin-right: 5px;flex: 0 0 100px;">下载路径：</label><input type="text" id="rpcDir" value="' + ariaRPC.dir + '" class="swal2-input" placeholder="默认为D:\"></div>';
            dom = '<div>' + dom + '</div>';
            let $dom = $(dom);

            Swal.fire({
                    title: 'RPC配置',
                    allowOutsideClick: false,
                    html: $dom[0],
                    showCancelButton: true,
                    confirmButtonText: '保存',
                    cancelButtonText: '取消'
                }
            ).then((result) => {
                if (result.value) {
                    setValue('rpcDomain', $('#rpcDomain').val() ? $('#rpcDomain').val() : ariaRPC.domain);
                    setValue('rpcPort', $('#rpcPort').val() ? $('#rpcPort').val() : ariaRPC.port);
                    setValue('rpcToken', $('#rpcToken').val());
                    setValue('rpcDir', $('#rpcDir').val() ? $('#rpcDir').val() : ariaRPC.dir);
                    history.go(0);
                }
            });
        }

        //设置神秘代码
        function setSecretCode() {
            Swal.fire({
                title: '请输入神秘代码',
                input: 'text',
                inputValue: secretCode,
                showCancelButton: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputValidator: (value) => {
                    if (value.length != 6) {
                        return '请输入正确的神秘代码';
                    }
                }
            }).then((result) => {
                setValue('secretCodeV', result.value);
                Toast.fire({
                    icon: 'success',
                    text: '神秘代码执行成功，3s后将自动刷新！'
                }).then(() => {
                    history.go(0);
                });
            });
        }

        function defaultSetting() {
            setValue('secretCodeV', defaultCode);
            Toast.fire({
                text: '恢复默认成功，3s后将自动刷新',
                icon: 'success'
            }).then(() => {
                history.go(0);
            });
        }

        function isSuperVIP() {
            return yunData.ISSVIP === 1;
        }

        function versionButtonClick() {
            let url = 'https://www.baiduyun.wiki';
            GM_openInTab(url, {active: true});
        }

        // 我的网盘 - 下载
        function downloadClick(event) {
            selectFileList = getSelectedFile();
            clog('选中文件列表：', selectFileList);
            let id = event.target.id;
            let downloadLink;

            if (id == 'download-direct') {
                let downloadType;
                if (selectFileList.length === 0) {
                    Toast.fire({
                        icon: 'error',
                        text: errorMsg.unselected
                    });
                    return;
                }
                if (selectFileList.length == 1) {
                    selectFileList[0].isdir === 1 ? downloadType = 'batch' : downloadType = 'dlink';
                }
                if (selectFileList.length > 1) {
                    downloadType = 'batch';
                }

                fid_list = getFidList(selectFileList);
                let result = getDownloadLinkWithPanAPI(downloadType);
                if (result.errno === 0) {
                    if (downloadType == 'dlink')
                        downloadLink = result.dlink[0].dlink;
                    else if (downloadType == 'batch') {
                        downloadLink = result.dlink;
                        if (selectFileList.length === 1)
                            downloadLink = downloadLink + '&zipname=' + encodeURIComponent(selectFileList[0].server_filename) + '.zip';
                    } else {
                        Toast.fire({
                            icon: 'error',
                            text: errorMsg.fail
                        });
                        return;
                    }
                } else if (result.errno == -1) {
                    Toast.fire({
                        icon: 'error',
                        text: errorMsg.deleted
                    });
                    return;
                } else if (result.errno == 112) {
                    Toast.fire({
                        icon: 'error',
                        text: errorMsg.timeout
                    });
                    return;
                } else {
                    Toast.fire({
                        icon: 'error',
                        text: errorMsg.fail
                    });
                    return;
                }
            } else {
                if (selectFileList.length === 0) {
                    Toast.fire({
                        icon: 'error',
                        text: errorMsg.unselected
                    });
                    return;
                } else if (selectFileList.length > 1) {
                    Toast.fire({
                        icon: 'error',
                        text: errorMsg.morethan
                    });
                    return;
                } else {
                    if (selectFileList[0].isdir == 1) {
                        Toast.fire({
                            icon: 'error',
                            text: errorMsg.dir
                        });
                        return;
                    }
                }
                if (id == 'download-api') {
                    downloadLink = getDownloadLinkWithRESTAPIBaidu(selectFileList[0].path);
                }
            }
            execDownload(downloadLink);
        }

        //我的网盘 - 显示链接
        function linkClick(event) {
            selectFileList = getSelectedFile();
            clog('选中文件列表：', selectFileList);
            let id = event.target.id;
            let linkList, tip;

            if (id.indexOf('direct') != -1) {
                let downloadType;
                let downloadLink;
                if (selectFileList.length === 0) {
                    Toast.fire({
                        icon: 'error',
                        text: errorMsg.unselected
                    });
                    return;
                } else if (selectFileList.length == 1) {
                    if (selectFileList[0].isdir === 1)
                        downloadType = 'batch';
                    else if (selectFileList[0].isdir === 0)
                        downloadType = 'dlink';
                } else if (selectFileList.length > 1) {
                    downloadType = 'batch';
                }
                fid_list = getFidList(selectFileList);
                let result = getDownloadLinkWithPanAPI(downloadType);
                if (result.errno === 0) {
                    if (downloadType == 'dlink')
                        downloadLink = result.dlink[0].dlink;
                    else if (downloadType == 'batch') {
                        clog('选中文件列表：', selectFileList);
                        downloadLink = result.dlink;
                        if (selectFileList.length === 1)
                            downloadLink = downloadLink + '&zipname=' + encodeURIComponent(selectFileList[0].server_filename) + '.zip';
                    } else {
                        Toast.fire({
                            icon: 'error',
                            text: errorMsg.fail
                        });
                        return;
                    }
                } else if (result.errno == -1) {
                    Toast.fire({
                        icon: 'error',
                        text: errorMsg.deleted
                    });
                    return;
                } else if (result.errno == 112) {
                    Toast.fire({
                        icon: 'error',
                        text: errorMsg.timeout
                    });
                    return;
                } else {
                    Toast.fire({
                        icon: 'error',
                        text: errorMsg.fail
                    });
                    return;
                }
                let httplink = downloadLink.replace(/^([A-Za-z]+):/, 'http:');
                let httpslink = downloadLink.replace(/^([A-Za-z]+):/, 'https:');
                let filename = '';
                $.each(selectFileList, function (index, element) {
                    if (selectFileList.length == 1)
                        filename = element.server_filename;
                    else {
                        if (index == 0)
                            filename = element.server_filename;
                        else
                            filename = filename + ',' + element.server_filename;
                    }
                });
                linkList = {
                    filename: filename,
                    urls: [
                        {url: httplink, rank: 1},
                        {url: httpslink, rank: 2}
                    ]
                };
                tip = '显示模拟百度网盘网页获取的链接，可以使用右键迅雷或IDM下载，多文件打包(限300k)下载的链接可以直接复制使用';
                dialog.open({title: '下载链接', type: 'link', list: linkList, tip: tip});
            } else {
                if (selectFileList.length === 0) {
                    Toast.fire({
                        icon: 'error',
                        text: errorMsg.unselected
                    });
                    return;
                } else if (selectFileList.length > 1) {
                    Toast.fire({
                        icon: 'error',
                        text: errorMsg.morethan
                    });
                    return;
                } else {
                    if (selectFileList[0].isdir == 1) {
                        Toast.fire({
                            icon: 'error',
                            text: errorMsg.dir
                        });
                        return;
                    }
                }
                if (id.indexOf('api') != -1) {
                    let downloadLink = getDownloadLinkWithRESTAPIBaidu(selectFileList[0].path);
                    let httplink = downloadLink.replace(/^([A-Za-z]+):/, 'http:');
                    let httpslink = downloadLink.replace(/^([A-Za-z]+):/, 'https:');
                    linkList = {
                        filename: selectFileList[0].server_filename,
                        urls: [
                            {url: httplink, rank: 1},
                            {url: httpslink, rank: 2}
                        ]
                    };

                    tip = '显示模拟APP获取的链接(使用百度云ID)，可以右键使用迅雷或IDM下载，直接复制链接无效';
                    dialog.open({title: '下载链接', type: 'link', list: linkList, tip: tip});
                }
            }
        }

        // 我的网盘 - 批量下载
        function batchClick(event) {
            selectFileList = getSelectedFile();
            clog('选中文件列表：', selectFileList);
            if (selectFileList.length === 0) {
                Toast.fire({
                    icon: 'error',
                    text: errorMsg.unselected
                });
                return;
            }
            let id = event.target.id;
            let linkType, tip;
            linkType = id.indexOf('https') == -1 ? (id.indexOf('http') == -1 ? location.protocol + ':' : 'http:') : 'https:';
            batchLinkList = [];
            batchLinkListAll = [];
            if (id.indexOf('direct') > 0) {  //直链下载
                batchLinkList = getDirectBatchLink(linkType);
                let tip = '点击链接直接下载，请先升级 <a href="https://www.baiduyun.wiki/zh-cn/assistant.html">[网盘万能助手]</a> 至 <b>v2.3.1</b>，本链接仅支持小文件下载（<300M）';
                if (batchLinkList.length === 0) {
                    Toast.fire({
                        icon: 'error',
                        text: errorMsg.unselected
                    });
                    return;
                }
                dialog.open({title: '直链下载', type: 'batch', list: batchLinkList, tip: tip, showcopy: false});
            }
            if (id.indexOf('aria') > 0) {  //ariaAPI下载
                batchLinkList = getAPIBatchLink(linkType);
                tip = '请先安装 <a  href="https://www.baiduyun.wiki/zh-cn/assistant.html">网盘万能助手</a> 请将链接复制到支持Aria的下载器中, 推荐使用 <a href="http://pan.baiduyun.wiki/down">XDown</a>';
                if (batchLinkList.length === 0) {
                    Toast.fire({
                        icon: 'error',
                        text: errorMsg.unselected
                    });
                    return;
                }
                dialog.open({title: 'Aria链接', type: 'batchAria', list: batchLinkList, tip: tip, showcopy: true});
            }
            if (id.indexOf('rpc') > 0) {  //ariaAPI下载
                batchLinkList = getAPIBatchLink(linkType);
                tip = '点击按钮发送链接至Aria下载器中<a href="https://www.baiduyun.wiki/zh-cn/rpc.html">详细说明</a>，需配合最新版 <a href="https://www.baiduyun.wiki/zh-cn/assistant.html">[网盘万能助手]</a>，支持本地和远程下载，此功能建议配合百度会员使用';
                if (batchLinkList.length === 0) {
                    Toast.fire({
                        icon: 'error',
                        text: errorMsg.unselected
                    });
                    return;
                }
                dialog.open({title: 'Aria RPC', type: 'batchAriaRPC', list: batchLinkList, tip: tip, showcopy: false});
            }
            if (id.indexOf('api') != -1) {  //API下载
                batchLinkList = getAPIBatchLink(linkType);
                tip = '请先安装 <a href="https://www.baiduyun.wiki/zh-cn/assistant.html">网盘万能助手</a> <b>v2.3.1</b> 后点击链接下载，若下载失败，请开启 <a href="https://www.baiduyun.wiki/zh-cn/question.html" target="_blank">备用链接</a>';
                if (batchLinkList.length === 0) {
                    Toast.fire({
                        icon: 'error',
                        text: errorMsg.unselected
                    });
                    return;
                }
                dialog.open({title: 'API下载链接', type: 'batch', list: batchLinkList, tip: tip});
            }
        }

        //我的网盘 - 获取直链下载地址
        function getDirectBatchLink(linkType) {
            let list = [];
            $.each(selectFileList, function (index, element) {
                let downloadType, downloadLink, result;
                if (element.isdir == 0)
                    downloadType = 'dlink';
                else
                    downloadType = 'batch';
                fid_list = getFidList([element]);
                result = getDownloadLinkWithPanAPI(downloadType);
                if (result.errno == 0) {
                    if (downloadType == 'dlink')
                        downloadLink = result.dlink[0].dlink;
                    else if (downloadType == 'batch')
                        downloadLink = result.dlink;
                    downloadLink = downloadLink.replace(/^([A-Za-z]+):/, linkType);
                } else {
                    downloadLink = 'error';
                }
                list.push({filename: element.server_filename, downloadlink: downloadLink});
            });
            return list;
        }

        //我的网盘 - 获取API下载地址
        function getAPIBatchLink(linkType) {
            let list = [];
            $.each(selectFileList, function (index, element) {
                if (element.isdir == 1)
                    return;
                let downloadLink;
                downloadLink = getDownloadById(element.path);
                //downloadLink = downloadLink.replace(/^([A-Za-z]+):/, linkType);
                list.push({
                    filename: element.server_filename,
                    downloadlink: downloadLink,
                });
            });
            return list;
        }

        function getSign() {
            let signFnc;
            try {
                signFnc = new Function("return " + yunData.sign2)();
            } catch (e) {
                throw new Error(e.message);
            }
            return btoa(signFnc(yunData.sign5, yunData.sign1));
        }

        //生成下载时的fid_list参数
        function getFidList(list) {
            let fidlist = null;
            if (list.length === 0)
                return null;
            let fileidlist = [];
            $.each(list, function (index, element) {
                fileidlist.push(element.fs_id);
            });
            fidlist = '[' + fileidlist + ']';
            return fidlist;
        }

        //点击分享按钮
        function shareButtonClick() {
            selectFileList = getSelectedFile();
            let path = [];
            if (selectFileList.length === 0) {
                Toast.fire({
                    icon: 'error',
                    text: errorMsg.unselected
                });
                return;
            }

            $.each(selectFileList, function (i, val) {
                path.push(val['path']);
            });

            let shareAPIUrl = "https://pan.baidu.com/share/set?channel=chunlei&clienttype=0&web=1&channel=chunlei&web=1&app_id=250528&bdstoken=" + bdstoken + "&logid=" + logid;
            let pwd = generatePwd();

            let params = {
                schannel: 4,
                channel_list: JSON.stringify([]),
                period: 7,
                pwd: pwd,
                fid_list: getFidList(selectFileList)
            };

            $.ajax({
                url: shareAPIUrl,
                async: false,
                method: 'POST',
                data: params,
                success: function (res) {
                    if (res.errno === 0) {
                        let link = res.link;
                        Swal.fire({
                            title: "分享链接(7天有效)",
                            allowOutsideClick: false,
                            html: `<a href="${link}" target="_blank">${link}</a><br>提取码: ${pwd}`,
                            confirmButtonText: '复制链接',
                            footer: copyright
                        }).then((result) => {
                            if (result.value) {
                                GM_setClipboard(link + '#' + pwd);
                            }
                        });
                    }
                }
            });
        }

        //生成四位字母数字随机数
        function generatePwd() {
            function random(max, min) {
                return Math.round(Math.random() * (max - min) + min);
            }
            //创建一个空字符，用于存放随机数/字母
            var strData = "";
            //生成随机字符库 (验证码四位，随机数三种，取公倍数12,所以循环4次。也可以是120次，1200次。)
            for (let i = 0; i < 4; i++) {
                let num = random(0, 9);//生成0-9的随机数
                let az = String.fromCharCode(random(97, 122));//生成a-z
                let AZ = String.fromCharCode(random(65, 90));//生成A-Z

                strData = strData + num + az + AZ;//将生成的字符进行字符串拼接
            }
            // 开始真正的随机(从随机字符库中随机取出四个)
            let str = "";
            for (let i = 0; i < 4; i++) {
                str += strData[random(0, strData.length - 1)];
            }
            return str;
        }

        //获取直接下载地址
        function getDownloadLinkWithPanAPI(type) {
            let result;
            logid = getLogID();
            let query = {
                bdstoken: bdstoken,
                logid: logid,
            };
            let params = {
                sign: sign,
                timestamp: timestamp,
                fidlist: fid_list,
                type: type,
            };
            let downloadUrl = `https://pan.baidu.com/api/download?clienttype=1`;
            $.ajax({
                url: downloadUrl,
                async: false,
                method: 'POST',
                data: params,
                success: function (response) {
                    result = response;
                }
            });

            return result;
        }

        function getDownloadLinkWithRESTAPIBaidu(path) {
            return restAPIUrl + 'file?method=download&path=' + encodeURIComponent(path) + '&app_id=' + secretCode;
        }


        function getDownloadById(path) {
            let paths = [];
            $.each(ids, function (index, element) {
                paths.push(restAPIUrl + 'file?method=download&path=' + encodeURIComponent(path) + '&app_id=' + element);
            });
            return paths;
        }

        function execDownload(link) {
            $('#helperdownloadiframe').attr('src', link);
        }

        function createIframe() {
            let $div = $('<div class="helper-hide" style="padding:0;margin:0;display:block"></div>');
            let $iframe = $('<iframe src="javascript:;" id="helperdownloadiframe" style="display:none"></iframe>');
            $div.append($iframe);
            $('body').append($div);

        }
    }

    //分享页面的下载助手
    function PanShareHelper() {
        let yunData, sign, timestamp, bdstoken, channel, clienttype, web, app_id, logid, encrypt, product, uk,
            primaryid, fid_list, extra, shareid;
        let vcode;
        let shareType, buttonTarget, dialog, vcodeDialog;
        let selectFileList = [];
        let panAPIUrl = location.protocol + "//" + location.host + "/api/";

        this.init = function () {
            if (getValue('SETTING_P')) getShareCode();
            yunData = unsafeWindow.yunData;
            clog('初始化信息:', yunData);
            if (yunData === undefined) {
                clog('页面未正常加载，或者百度已经更新！');
                return;
            }
            initVar();
            addButton();
            dialog = new Dialog({addCopy: false});
            vcodeDialog = new VCodeDialog(refreshVCode, confirmClick);
            createIframe();
            registerEventListener();
            clog('下载助手加载成功！当前版本：', version);
        };

        function isSuperVIP() {
            return yunData.ISSVIP === 1;
        }

        function initVar() {
            shareType = getShareType();
            sign = yunData.SIGN;
            timestamp = yunData.TIMESTAMP;
            bdstoken = yunData.MYBDSTOKEN;
            channel = 'chunlei';
            clienttype = 0;
            web = 1;
            app_id = secretCode;
            logid = getLogID();
            encrypt = 0;
            product = 'share';
            primaryid = yunData.SHARE_ID;
            uk = yunData.SHARE_UK;

            if (shareType == 'secret') {
                extra = getExtra();
            }
            if (!isSingleShare()) {
                shareid = yunData.SHARE_ID;
            }
        }

        function getSelctedFile() {
            if (isSingleShare()) {
                return yunData.FILEINFO;
            } else {
                return require("disk-share:widget/pageModule/list/listInit.js").getCheckedItems();
            }
        }

        function getShareCode() {
            let hash = location.hash && /^#([a-zA-Z0-9]{4})$/.test(location.hash) && RegExp.$1,
                input = $('.pickpw input[tabindex="1"]'),
                btn = $('.pickpw a.g-button'),
                inputarea = $('.pickpw .input-area'),
                tip = $('<div style="margin:-8px 0 10px ;color: #ff5858">正在获取提取码</div>'),
                surl = (location.href.match(/\/init\?(?:surl|shareid)=((?:\w|-)+)/) || location.href.match(/\/s\/1((?:\w|-)+)/))[1];
            if (!input || !btn) {
                return;
            }
            inputarea.prepend(tip);
            if (hash) {
                tip.text('发现提取码，已自动为您填写');
                setTimeout(function () {
                        input.val(hash);
                        btn.click();
                    },
                    500);
            }

            GM_xmlhttpRequest({
                method: 'GET',
                url: 'https://ypsuperkey.meek.com.cn/api/v1/items/BDY-' + surl + '?client_version=2019.2',
                onload: function (xhr) {
                    let result = JSON.parse(xhr.responseText);
                    if (result.access_code) {
                        tip.text('发现提取码，已自动为您填写');
                        input.val(result.access_code);//填写密码
                        setTimeout(function () {
                            btn.click();
                            showReferer(result.referrer);
                        }, 300);
                    } else {
                        tip.text('未发现提取码，请手动填写');
                    }
                }
            });
        }

        function showReferer(referrer) {
            if (typeof referrer !== 'object') return false;
            let ref = Object.values(referrer);
            let temp = {};
            let refs = ref.reduce((preVal, curVal) => {
                temp[curVal.title] ? '' : temp[curVal.title] = true && preVal.push(curVal);
                return preVal;
            }, []);

            let ins = setInterval(function () {
                if ($('.slide-show-header').length > 0) {
                    clearInterval(ins);
                    let $parent = $('<div style="max-height: 82px;overflow: scroll"></div>');
                    $('.slide-show-header').append($parent);
                    $.each(refs, function (index, element) {
                        if (element.title != "undefined") {
                            let $div = $('<a style="display: block;margin-top: 7px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;" href="' + element.url + '" target="_blank">【来源】：' + element.title + '</a>');
                            $parent.append($div);
                        }
                    });
                }
            }, 500);
        }

        //判断分享类型（public或者secret）
        function getShareType() {
            return yunData.SHARE_PUBLIC === 1 ? 'public' : 'secret';
        }

        //判断是单个文件分享还是文件夹或者多文件分享
        function isSingleShare() {
            return yunData.getContext === undefined ? true : false;
        }

        //判断是否为自己的分享链接
        function isSelfShare() {
            return yunData.MYSELF == 1 ? true : false;
        }

        function getExtra() {
            let seKey = decodeURIComponent(getCookie('BDCLND'));
            return '{' + '"sekey":"' + seKey + '"' + "}";
        }

        //获取当前目录
        function getPath() {
            let hash = location.hash;
            let regx = new RegExp("path=([^&]*)(&|$)", 'i');
            let result = hash.match(regx);
            return decodeURIComponent(result[1]);
        }

        //添加下载助手按钮
        function addButton() {
            if (isSingleShare()) {
                $('div.slide-show-right').css('width', '500px');
                $('div.frame-main').css('width', '96%');
                $('div.share-file-viewer').css('width', '740px').css('margin-left', 'auto').css('margin-right', 'auto');
            } else
                $('div.slide-show-right').css('width', '500px');
            let $dropdownbutton = $('<span class="g-dropdown-button"></span>');
            let $dropdownbutton_a = $('<a class="g-button g-button-blue" style="width: 114px;" data-button-id="b200" data-button-index="200" href="javascript:;"></a>');
            let $dropdownbutton_a_span = $('<span class="g-button-right"><em class="icon icon-picpre-download" title="百度网盘下载助手"></em><span class="text" style="width: 60px;">下载助手</span></span>');
            let $dropdownbutton_span = $('<span class="menu" style="width:auto;z-index:41"></span>');

            let $downloadButton = $('<a class="g-button-menu" href="javascript:;">直接下载</a>');
            let $linkButton = $('<a class="g-button-menu" href="javascript:;" data-type="down">显示链接</a>');
            let $aricLinkButton = $('<a class="g-button-menu" href="javascript:;">显示Aria链接</a>');
            let $aricRPCButton = $('<a class="g-button-menu" href="javascript:;" data-type="rpc">RPC下载</a>');
            let $versionButton = $('<a style="color: #e85653;font-weight: 700;" class="g-button-menu" href="javascript:;">Ver ' + version + '</a>');

            $dropdownbutton_span.append($downloadButton).append($linkButton).append($aricRPCButton).append($aricLinkButton).append($versionButton)/*.append($github)*/;
            $dropdownbutton_a.append($dropdownbutton_a_span);
            $dropdownbutton.append($dropdownbutton_a).append($dropdownbutton_span);

            $dropdownbutton.hover(function () {
                $dropdownbutton.toggleClass('button-open');
            });
            $downloadButton.click(downloadButtonClick);
            $aricRPCButton.click(linkButtonClick);
            $linkButton.click(linkButtonClick);
            $aricLinkButton.click(ariclinkButtonClick);
            $versionButton.click(versionButtonClick);

            $('div.module-share-top-bar div.bar div.x-button-box').append($dropdownbutton);
        }

        function versionButtonClick() {
            let url = 'https://www.baiduyun.wiki';
            GM_openInTab(url, {active: true});
        }

        function ariclinkButtonClick() {
            selectFileList = getSelctedFile();
            if (bdstoken === null) {
                Toast.fire({
                    icon: 'error',
                    text: errorMsg.unlogin
                });
                return false;
            }
            clog('选中文件列表：', selectFileList);
            if (selectFileList.length === 0) {
                Toast.fire({
                    icon: 'error',
                    text: errorMsg.unselected
                });
                return false;
            }
            if (selectFileList[0].isdir == 1) {
                Toast.fire({
                    icon: 'error',
                    text: errorMsg.toobig
                });
                return false;
            }

            buttonTarget = 'ariclink';
            getDownloadLink(function (downloadLink) {
                if (downloadLink === undefined) return;

                if (downloadLink.errno == -20) {
                    vcode = getVCode();
                    if (!vcode || vcode.errno !== 0) {
                        Toast.fire({
                            icon: 'error',
                            text: errorMsg.wrongcode
                        });
                        return false;
                    }
                    vcodeDialog.open(vcode);
                } else if (downloadLink.errno == 112) {
                    Toast.fire({
                        icon: 'error',
                        text: errorMsg.timeout
                    });
                    return false;
                } else if (downloadLink.errno === 0) {
                    let tip = '请先安装 <a  href="https://www.baiduyun.wiki/zh-cn/assistant.html">网盘万能助手</a> 请将链接复制到支持Aria的下载器中, 推荐使用 <a  href="http://pan.baiduyun.wiki/down">XDown</a>';
                    dialog.open({
                        title: '下载链接（仅显示文件链接）',
                        type: 'shareAriaLink',
                        list: downloadLink.list,
                        tip: tip,
                        showcopy: true
                    });
                } else {
                    Toast.fire({
                        icon: 'error',
                        text: errorMsg.fail
                    });
                }
            });
        }

        function createIframe() {
            let $div = $('<div class="helper-hide" style="padding:0;margin:0;display:block"></div>');
            let $iframe = $('<iframe src="javascript:;" id="helperdownloadiframe" style="display:none"></iframe>');
            $div.append($iframe);
            $('body').append($div);
        }

        function registerEventListener() {
            registerDownload();
        }

        function registerDownload() {
            $(document).on('click', '.aria-rpc', function (e) {
                let link = e.target.dataset.link;
                let filename = e.target.dataset.filename;

                GM_xmlhttpRequest({
                    method: "HEAD",
                    headers: {
                        "User-Agent": userAgent
                    },
                    url: e.target.dataset.link,
                    onload: function (res) {
                        let finalUrl = res.finalUrl;
                        if (finalUrl) {
                            let url = ariaRPC.domain + ":" + ariaRPC.port + '/jsonrpc';
                            let json_rpc = {
                                id: new Date().getTime(),
                                jsonrpc: '2.0',
                                method: 'aria2.addUri',
                                params: [
                                    "token:" + ariaRPC.token,
                                    [finalUrl],
                                    {
                                        dir: ariaRPC.dir,
                                        out: filename,
                                        header: ['User-Agent:' + userAgent, 'Cookie: BDUSS=' + getBDUSS()]

                                    }
                                ]
                            };
                            GM_xmlhttpRequest({
                                method: "POST",
                                headers: {
                                    "User-Agent": userAgent
                                },
                                url: url,
                                responseType: 'json',
                                timeout: 3000,
                                data: JSON.stringify(json_rpc),
                                onload: function (response) {
                                    if (response.response.result) {
                                        Toast.fire({
                                            icon: 'success',
                                            title: '任务已发送至RPC下载器'
                                        });
                                    } else {
                                        Toast.fire({
                                            icon: 'error',
                                            title: response.response.message
                                        });
                                    }
                                },
                                ontimeout: function () {
                                    Toast.fire({
                                        icon: 'error',
                                        title: '无法连接到RPC服务，请检查RPC配置'
                                    });
                                }
                            });
                        }
                    }
                });
            });
        }

        function downloadButtonClick() {
            selectFileList = getSelctedFile();
            if (bdstoken === null) {
                Toast.fire({
                    icon: 'error',
                    text: errorMsg.unlogin
                });
                return false;
            }
            clog('选中文件列表：', selectFileList);
            if (selectFileList.length === 0) {
                Toast.fire({
                    icon: 'error',
                    text: errorMsg.unselected
                });
                return false;
            }
            if (selectFileList.length > 1) {
                Toast.fire({
                    icon: 'error',
                    text: errorMsg.morethan
                });
                return false;
            }

            if (selectFileList[0].isdir == 1) {
                Toast.fire({
                    icon: 'error',
                    text: errorMsg.dir
                });
                return false;
            }
            buttonTarget = 'download';
            getDownloadLink(function (downloadLink) {
                if (downloadLink === undefined) return;

                if (downloadLink.errno == -20) {
                    vcode = getVCode();
                    if (vcode.errno !== 0) {
                        Toast.fire({
                            icon: 'error',
                            text: errorMsg.wrongcode
                        });
                        return;
                    }
                    vcodeDialog.open(vcode);
                } else if (downloadLink.errno == 112) {
                    Toast.fire({
                        icon: 'error',
                        text: errorMsg.timeout
                    });
                } else if (downloadLink.errno === 0) {
                    let link = downloadLink.list[0].dlink;
                    execDownload(link);
                } else {
                    Toast.fire({
                        icon: 'error',
                        text: errorMsg.fail
                    });
                }
            });
        }

        //获取验证码
        function getVCode() {
            let url = panAPIUrl + 'getvcode';
            let result;
            logid = getLogID();
            let params = {
                prod: 'pan',
                t: Math.random(),
                bdstoken: bdstoken,
                channel: channel,
                clienttype: clienttype,
                web: web,
                app_id: app_id,
                logid: logid
            };
            $.ajax({
                url: url,
                method: 'GET',
                async: false,
                data: params,
                success: function (response) {
                    result = response;
                }
            });
            return result;
        }

        //刷新验证码
        function refreshVCode() {
            vcode = getVCode();
            $('#dialog-img').attr('src', vcode.img);
        }

        //验证码确认提交
        function confirmClick() {
            let val = $('#dialog-input').val();
            if (val.length === 0) {
                $('#dialog-err').text('请输入验证码');
                return;
            } else if (val.length < 4) {
                $('#dialog-err').text('验证码输入错误，请重新输入');
                return;
            }
            getDownloadLinkWithVCode(val, function (result) {
                if (result.errno == -20) {
                    vcodeDialog.close();
                    $('#dialog-err').text('验证码输入错误，请重新输入');
                    refreshVCode();
                    if (!vcode || vcode.errno !== 0) {
                        Toast.fire({
                            icon: 'error',
                            text: errorMsg.wrongcode
                        });
                        return;
                    }
                    vcodeDialog.open();
                } else if (result.errno === 0) {
                    vcodeDialog.close();
                    if (buttonTarget == 'download') {
                        if (result.list.length > 1 || result.list[0].isdir == 1) {
                            Toast.fire({
                                icon: 'error',
                                text: errorMsg.morethan
                            });
                            return false;
                        }
                        let link = result.list[0].dlink;
                        execDownload(link);
                    }
                    if (buttonTarget == 'link') {
                        let tip = '点击链接直接下载，请先升级 <a href="https://www.baiduyun.wiki/zh-cn/assistant.html">[网盘万能助手]</a> 至 <b>v2.3.1</b>（出现403请尝试其他下载方法）';
                        dialog.open({
                            title: '下载链接（仅显示文件链接）',
                            type: 'shareLink',
                            list: result.list,
                            tip: tip,
                            showcopy: false
                        });
                    }
                    if (buttonTarget == 'ariclink') {
                        let tip = '请先安装 <a  href="https://www.baiduyun.wiki/zh-cn/assistant.html">网盘万能助手</a> 请将链接复制到支持Aria的下载器中, 推荐使用 <a  href="http://pan.baiduyun.wiki/down">XDown</a>';
                        dialog.open({
                            title: '下载链接（仅显示文件链接）',
                            type: 'shareAriaLink',
                            list: result.list,
                            tip: tip,
                            showcopy: false
                        });
                    }
                } else {
                    Toast.fire({
                        icon: 'error',
                        text: errorMsg.fail
                    });
                }
            });
        }

        //生成下载用的fid_list参数
        function getFidList() {
            let fidlist = [];
            $.each(selectFileList, function (index, element) {
                fidlist.push(element.fs_id);
            });
            return '[' + fidlist + ']';
        }

        function linkButtonClick(e) {
            selectFileList = getSelctedFile();
            if (bdstoken === null) {
                Toast.fire({
                    icon: 'error',
                    text: errorMsg.unlogin
                });
                return false;
            }
            clog('选中文件列表：', selectFileList);
            if (selectFileList.length === 0) {
                Toast.fire({
                    icon: 'error',
                    text: errorMsg.unselected
                });
                return false;
            }
            if (selectFileList[0].isdir == 1) {
                Toast.fire({
                    icon: 'error',
                    text: errorMsg.dir
                });
                return false;
            }

            buttonTarget = 'link';
            getDownloadLink(function (downloadLink) {
                if (downloadLink === undefined) return;

                if (downloadLink.errno == -20) {
                    vcode = getVCode();
                    if (!vcode || vcode.errno !== 0) {
                        Toast.fire({
                            icon: 'error',
                            text: errorMsg.wrongcode
                        });
                        return false;
                    }
                    vcodeDialog.open(vcode);
                } else if (downloadLink.errno == 112) {
                    Toast.fire({
                        icon: 'error',
                        text: errorMsg.timeout
                    });
                    return false;
                } else if (downloadLink.errno === 0) {
                    if (e.target.dataset.type === 'rpc') {
                        let tip = '点击按钮发送链接至Aria下载器中 <a href="https://www.baiduyun.wiki/zh-cn/rpc.html">详细说明</a>，需配合最新版 <a href="https://www.baiduyun.wiki/zh-cn/assistant.html">[网盘万能助手]</a>，支持本地和远程下载';
                        dialog.open({
                            title: '下载链接（仅显示文件链接）',
                            type: 'rpcLink',
                            list: downloadLink.list,
                            tip: tip,
                            showcopy: false
                        });
                    } else {
                        let tip = '点击链接直接下载，请先升级 <a href="https://www.baiduyun.wiki/zh-cn/assistant.html">[网盘万能助手]</a> 至 <b>v2.3.1</b>（出现403请尝试其他下载方式）';
                        dialog.open({
                            title: '下载链接（仅显示文件链接）',
                            type: 'shareLink',
                            list: downloadLink.list,
                            tip: tip,
                            showcopy: true
                        });
                    }

                } else {
                    Toast.fire({
                        icon: 'error',
                        text: errorMsg.fail
                    });
                }
            });
        }

        //获取下载链接
        function getDownloadLink(cb) {
            if (bdstoken === null) {
                Toast.fire({
                    icon: 'error',
                    text: errorMsg.unlogin
                });
                return '';
            }
            let res;
            if (isSingleShare) {
                fid_list = getFidList();
                logid = getLogID();

                let params = new FormData();
                params.append('encrypt', encrypt);
                params.append('product', product);
                params.append('uk', uk);
                params.append('primaryid', primaryid);
                params.append('fid_list', fid_list);

                if (shareType == 'secret') {
                    params.append('extra', extra);
                }

                $.ajax({
                    url: 'https://api.baiduyun.wiki/download?sign=' + sign + '&timestamp=' + timestamp + '&logid=' + logid + '&init=' + getValue('init'),
                    cache: false,
                    method: 'GET',
                    async: false,
                    complete(response) {
                        res = response.responseText;
                    }
                });

                GM_xmlhttpRequest({
                    method: "POST",
                    data: params,
                    url: atob(atob(res)),
                    onload: function (res) {
                        cb(JSON.parse(res.response));
                    }
                });
            }
        }

        //有验证码输入时获取下载链接
        function getDownloadLinkWithVCode(vcodeInput, cb) {
            let res;
            if (isSingleShare) {
                fid_list = getFidList();
                logid = getLogID();

                let params = new FormData();
                params.append('encrypt', encrypt);
                params.append('product', product);
                params.append('uk', uk);
                params.append('primaryid', primaryid);
                params.append('fid_list', fid_list);
                params.append('vcode_input', vcodeInput);
                params.append('vcode_str', vcode.vcode);

                if (shareType == 'secret') {
                    params.append('extra', extra);
                }

                $.ajax({
                    url: 'https://api.baiduyun.wiki/download?sign=' + sign + '&timestamp=' + timestamp + '&logid=' + logid,
                    cache: false,
                    method: 'GET',
                    async: false,
                    complete(response) {
                        res = response.responseText;
                    }
                });

                GM_xmlhttpRequest({
                    method: "POST",
                    data: params,
                    url: atob(atob(res)),
                    onload: function (res) {
                        cb(JSON.parse(res.response));
                    }
                });
            }
        }

        function execDownload(link) {
            clog('下载链接：' + link);
            if (link) {
                GM_xmlhttpRequest({
                    method: "POST",
                    headers: {
                        "User-Agent": userAgent
                    },
                    url: link,
                    onload: function (res) {
                        //cb(JSON.parse(res.response));
                    }
                });
            }
            //GM_openInTab(link, {active: false});
            //$('#helperdownloadiframe').attr('src', link);
        }
    }

    function PanPlugin() {
        clog('RPC：', ariaRPC);
        this.init = function () {
            main();
            checkUpdate();
            if (getValue('SETTING_H')) {
                createHelp();
            }
            createMenu();
        };

        function loadPanhelper() {
            switch (detectPage()) {
                case 'disk':
                    let panHelper = new PanHelper();
                    panHelper.init();
                    return;
                case 'share':
                case 's':
                    let panShareHelper = new PanShareHelper();
                    panShareHelper.init();
                    return;
                default:
                    return;
            }
        }

        function checkUpdate() {
            $.ajax({
                url: `https://api.baiduyun.wiki/update?ver=${version}&s=web`,
                method: 'GET',
                success: function (res) {
                    setValue('lastest_version', res.version);
                    userAgent = res.ua;
                    ids = res.ids;
                    if (res.code === 200) {
                        if (res.version > version) {
                            Swal.fire({
                                title: `发现新版本 <span style="background: #da5961;vertical-align: top;display: inline-block;font-size: 14px;height: 18px;line-height: 18px;border-radius: 3px;padding: 0 6px;color: #fff;">${res.version}</span>`,
                                icon: 'success',
                                html: res.changelog,
                                confirmButtonText: '更新',
                                footer: copyright
                            }).then((result) => {
                                if (result.value) {
                                    location.href = res.updateURL;
                                }
                            });
                        }
                    }
                    if (res.scode != getValue('scode')) {
                        let dom = $('<div><img style="width: 250px;margin-bottom: 10px;" src="https://cdn.baiduyun.wiki/scode.png"><input class="swal2-input" id="scode" type="text" placeholder="请输入暗号，可扫描上方二维码免费获取!"></div>');
                        Swal.fire({
                            title: "初次使用请输入暗号",
                            html: dom[0],
                            allowOutsideClick: false,
                            confirmButtonText: '确定'
                        }).then((result) => {
                            if (res.scode == $('#scode').val()) {
                                setValue('scode', res.scode);
                                setValue('init', 1);
                                Toast.fire({
                                    icon: 'success',
                                    text: '暗号正确，正在初始化中。。。',
                                }).then(() => {
                                    history.go(0);
                                });
                            } else {
                                setValue('init', 0);
                                Swal.fire({
                                    title: "🔺🔺🔺",
                                    text: '暗号不正确，请通过微信扫码免费获取',
                                    imageUrl: 'https://cdn.baiduyun.wiki/scode.png',
                                });
                            }
                        });
                    } else {
                        loadPanhelper();
                    }
                }
            });
        }

        function createHelp() {
            setTimeout(() => {
                let topbar = $('.' + classMap['header']);
                let toptemp = $('<span class="cMEMEF" node-type="help-author" style="opacity: .5" ><a href="https://www.baiduyun.wiki/" target="_blank">教程</a><i class="find-light-icon" style="display: inline;background-color: #009fe8;"></i></span>');
                topbar.append(toptemp);
            }, 2000);
        }

        function createMenu() {
            GM_registerMenuCommand('设置', function () {
                if (getValue('SETTING_P') === undefined) {
                    setValue('SETTING_P', false);
                }

                if (getValue('SETTING_H') === undefined) {
                    setValue('SETTING_H', true);
                }

                if (getValue('SETTING_B') === undefined) {
                    setValue('SETTING_B', false);
                }

                let dom = '';
                if (getValue('SETTING_P')) {
                    dom += '<label class="tm-setting">自动填写提取码<input type="checkbox" id="S-P" checked class="tm-checkbox"></label>';
                } else {
                    dom += '<label class="tm-setting">自动填写提取码<input type="checkbox" id="S-P" class="tm-checkbox"></label>';
                }
                if (getValue('SETTING_B')) {
                    dom += '<label class="tm-setting">开启备用链接<input type="checkbox" id="S-B" checked class="tm-checkbox"></label>';
                } else {
                    dom += '<label class="tm-setting">开启备用链接<input type="checkbox" id="S-B" class="tm-checkbox"></label>';
                }
                if (getValue('SETTING_H')) {
                    dom += '<label class="tm-setting">开启教程<input type="checkbox" id="S-H" checked class="tm-checkbox"></label>';
                } else {
                    dom += '<label class="tm-setting">开启教程<input type="checkbox" id="S-H" class="tm-checkbox"></label>';
                }
                dom = '<div>' + dom + '</div>';
                let $dom = $(dom);
                Swal.fire({
                    title: '脚本配置',
                    html: $dom[0],
                    confirmButtonText: '保存',
                    footer: copyright
                }).then((result) => {
                    history.go(0);
                });
            });
            $(document).on('change', '#S-P', function () {
                setValue('SETTING_P', $(this)[0].checked);
            });
            $(document).on('change', '#S-B', function () {
                setValue('SETTING_B', $(this)[0].checked);
            });
            $(document).on('change', '#S-H', function () {
                setValue('SETTING_H', $(this)[0].checked);
            });
        }

        function main() {
            setValue('current_version', version);

            let script = document.createElement("script");
            script.type = "text/javascript";
            script.async = true;
            script.src = "https://js.users.51.la/19988117.js";
            document.getElementsByTagName("head")[0].appendChild(script);

            //解决https无法加载http资源的问题
            let oMeta = document.createElement('meta');
            oMeta.httpEquiv = 'Content-Security-Policy';
            oMeta.content = 'upgrade-insecure-requests';
            document.getElementsByTagName('head')[0].appendChild(oMeta);

            $(document).on('contextmenu', '.aria-link', function (e) {
                e.preventDefault();
                return false;
            });

            $(document).on('mousedown', '.aria-link', function (e) {
                e.preventDefault();
                let link = decodeURIComponent($(this).data('link'));
                GM_setClipboard(link, 'text');
                Toast.fire({
                    icon: 'success',
                    text: '已将链接复制到剪贴板！'
                });
                return false;
            });

            $(document).on('click', '.share-download', function (e) {
                e.preventDefault();
                if (e.target.innerText) {
                    GM_xmlhttpRequest({
                        method: "POST",
                        headers: {"User-Agent": userAgent},
                        url: e.target.innerText,
                        onload: function (res) {
                            //GM_openInTab(res.finalUrl, {active: false});
                        }
                    });
                }
            });
        }
    }

    $(function () {
        let plugin = new PanPlugin();
        plugin.init();
    });

    GM_addStyle(`
        .dialog .row {overflow: hidden;text-overflow: ellipsis;white-space: nowrap;}
    
        .dialog .row .ui-title {width: 150px;float: left;overflow: hidden;text-overflow: ellipsis;}
    
        .dialog .row .ui-link {margin-right: 20px;}
    
        .dialog-body {max-height: 450px;overflow-y: auto;padding: 0 20px;}
    
        .dialog-tip {padding: 0 20px;background-color: #fff;border-top: 1px solid #c4dbfe;color: #dc373c;}
    
        .tm-setting {display: flex;align-items: center;justify-content: space-between;padding-top: 20px;}
    
        .tm-checkbox {width: 16px;height: 16px;}
    
        #dialog-copy-button {width: 120px;margin: 5px 0px 10px;cursor: pointer;background: #cc3235;border: none;height: 30px;color: #fff;border-radius: 3px;}
    
        .flex-center-between {display: flex;align-items: center;justify-content: space-between}
    `);
})();
