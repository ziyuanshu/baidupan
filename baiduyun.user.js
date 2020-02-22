// ==UserScript==
// @name              百度网盘直链下载助手
// @namespace         https://github.com/syhyz1990/baiduyun
// @version           3.0.3
// @icon              https://www.baiduyun.wiki/48x48.png
// @description       【百度网盘直链下载助手】是一款免客户端获取百度网盘文件真实下载地址的油猴插件，支持Windows，Mac，Linux，Android等多平台，可使用IDM，XDown等多线程加速工具加速下载，支持远程下载，告别下载限速问题。
// @author            syhyz1990
// @license           AGPL
// @supportURL        https://github.com/syhyz1990/baiduyun
// @updateURL         https://www.baiduyun.wiki/baiduyun.user.js
// @match             *://pan.baidu.com/disk/home*
// @match             *://yun.baidu.com/disk/home*
// @match             *://pan.baidu.com/s/*
// @match             *://yun.baidu.com/s/*
// @match             *://pan.baidu.com/share/*
// @match             *://yun.baidu.com/share/*
// @require           https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @require           https://cdn.bootcss.com/sweetalert/2.1.2/sweetalert.min.js
// @connect           baidu.com
// @connect           baidupcs.com
// @connect           *
// @run-at            document-idle
// @grant             unsafeWindow
// @grant             GM_xmlhttpRequest
// @grant             GM_setClipboard
// @grant             GM_setValue
// @grant             GM_getValue
// @grant             GM_deleteValue
// @grant             GM_openInTab
// @grant             GM_registerMenuCommand
// @grant             GM_unregisterMenuCommand
// ==/UserScript==

"use strict";
var _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) {
    return typeof t;
} : function (t) {
    return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
};
!function () {
    function t(t, e, i) {
        t = t || "", e = e || "", i = i || "", console.group("[百度网盘直链下载助手]"), console.log(t, e, i), console.groupEnd();
    }

    function e() {
        var t = localStorage.getItem("baiduyunPlugin_BDUSS") ? localStorage.getItem("baiduyunPlugin_BDUSS") : '{"baiduyunPlugin_BDUSS":""}',
            e = JSON.parse(t).BDUSS;
        return e || swal({
            title: "提示",
            text: "请先安装【网盘万能助手】",
            buttons: {confirm: {text: "安装", value: "confirm"}}
        }).then(function (t) {
            "confirm" === t && (location.href = "https://www.baiduyun.wiki/zh-cn/assistant.html");
        }), e;
    }

    function i(t, i, n) {
        var a = e();
        return n = n || b, a ? 'aria2c "' + t + '" --out "' + i + '" --header "User-Agent: ' + n + '" --header "Cookie: BDUSS=' + a + '"' : "请先安装网盘万能助手，安装后请重启浏览器！！！";
    }

    function n(t) {
        return t ? t.replace(/&/g, "&amp;") : "";
    }

    function a() {
        function e() {
            it = R(), nt = B(), at = J(), ot = r(), ht = F(), "all" == ht && (ft = N()), "category" == ht && (vt = U()), "search" == ht && (mt = z()), a(), i(), n();
        }

        function i() {
            "all" == ht ? lt = L() : "category" == ht ? lt = H() : "search" == ht && (lt = K());
        }

        function n() {
            dt = [];
        }

        function a() {
            pt = o();
        }

        function o() {
            return $("." + f.list).is(":hidden") ? "grid" : "list";
        }

        function l() {
            p(), u(), w(), _(), A(), d();
        }

        function d() {
            $(document).on("click", ".exe-download", function (t) {
                t.target.innerText && Z(t.target.innerText);
            }), $(document).on("click", ".aria-rpc", function (t) {
                var e = (t.target.dataset.link, t.target.dataset.filename), i = {};
                j() || (i = {"User-Agent": b}), GM_xmlhttpRequest({
                    method: "HEAD",
                    headers: i,
                    url: t.target.dataset.link,
                    onload: function (t) {
                        var i = t.finalUrl;
                        if (i) {
                            var n = x.domain + ":" + x.port + "/jsonrpc", a = {
                                id: (new Date).getTime(),
                                jsonrpc: "2.0",
                                method: "aria2.addUri",
                                params: ["token:" + x.token, [i], {
                                    dir: x.dir,
                                    out: e,
                                    header: j() ? ["User-Agent:" + y] : ["User-Agent:" + b]
                                }]
                            };
                            GM_xmlhttpRequest({
                                method: "POST",
                                headers: {"User-Agent": b},
                                url: n,
                                responseType: "json",
                                timeout: 3e3,
                                data: JSON.stringify(a),
                                onload: function (t) {
                                    t.response.result ? swal({
                                        text: "发送成功",
                                        icon: "success",
                                        timer: 800
                                    }) : swal({text: t.response.message, icon: "error"});
                                },
                                ontimeout: function () {
                                    swal({text: "无法连接到RPC服务，请检查RPC配置", icon: "error"});
                                }
                            });
                        }
                    }
                });
            });
        }

        function p() {
            window.addEventListener("hashchange", function (t) {
                a(), "all" == F() ? ht == F() ? ft != N() && (ft = N(), i(), n()) : (ht = F(), ft = N(), i(), n()) : "category" == F() ? ht == F() ? vt != U() && (ht = F(), vt = U(), i(), n()) : (ht = F(), vt = U(), i(), n()) : "search" == F() && (ht == F() ? mt != z() && (ht = F(), mt = z(), i(), n()) : (ht = F(), mt = z(), i(), n()));
            });
        }

        function u() {
            $("a[data-type=list]").click(function () {
                pt = "list";
            }), $("a[data-type=grid]").click(function () {
                pt = "grid";
            });
        }

        function w() {
            var e = $("span." + f.checkbox);
            "grid" == pt && (e = $("." + f["chekbox-grid"])), e.each(function (e, i) {
                $(i).on("click", function (e) {
                    var i = $(this).parent(), n = void 0, a = void 0;
                    if ("list" == pt ? (n = $("div.file-name div.text a", i).attr("title"), a = i.hasClass(f["item-active"])) : "grid" == pt && (n = $("div.file-name a", $(this)).attr("title"), a = !$(this).hasClass(f["item-active"])), a) {
                        t("取消选中文件：" + n);
                        for (var o = 0; o < dt.length; o++) dt[o].filename == n && dt.splice(o, 1);
                    } else t("选中文件:" + n), $.each(lt, function (t, e) {
                        if (e.server_filename == n) {
                            var i = {filename: e.server_filename, path: e.path, fs_id: e.fs_id, isdir: e.isdir};
                            dt.push(i);
                        }
                    });
                });
            });
        }

        function k() {
            $("span." + f.checkbox).each(function (t, e) {
                $(e).unbind("click");
            });
        }

        function _() {
            $("div." + f["col-item"] + "." + f.check).each(function (e, i) {
                $(i).bind("click", function (e) {
                    $(this).parent().hasClass(f.checked) ? (t("取消全选"), dt = []) : (t("全部选中"), dt = [], $.each(lt, function (t, e) {
                        var i = {filename: e.server_filename, path: e.path, fs_id: e.fs_id, isdir: e.isdir};
                        dt.push(i);
                    }));
                });
            });
        }

        function S() {
            $("div." + f["col-item"] + "." + f.check).each(function (t, e) {
                $(e).unbind("click");
            });
        }

        function A() {
            $("div." + f["list-view"] + " dd").each(function (e, i) {
                $(i).bind("click", function (e) {
                    var i = e.target.nodeName.toLowerCase();
                    if ("span" != i && "a" != i && "em" != i) if (t("shiftKey:" + e.shiftKey), e.shiftKey) {
                        dt = [];
                        var n = $("div." + f["list-view"] + " dd." + f["item-active"]);
                        $.each(n, function (e, i) {
                            var n = $("div.file-name div.text a", $(i)).attr("title");
                            t("选中文件：" + n), $.each(lt, function (t, e) {
                                if (e.server_filename == n) {
                                    var i = {filename: e.server_filename, path: e.path, fs_id: e.fs_id, isdir: e.isdir};
                                    dt.push(i);
                                }
                            });
                        });
                    } else {
                        dt = [];
                        var a = $("div.file-name div.text a", $(this)).attr("title");
                        t("选中文件：" + a), $.each(lt, function (t, e) {
                            if (e.server_filename == a) {
                                var i = {filename: e.server_filename, path: e.path, fs_id: e.fs_id, isdir: e.isdir};
                                dt.push(i);
                            }
                        });
                    }
                });
            });
        }

        function G() {
            $("div." + f["list-view"] + " dd").each(function (t, e) {
                $(e).unbind("click");
            });
        }

        function M() {
            var t = window.MutationObserver, e = {childList: !0};
            ut = new t(function (t) {
                k(), S(), G(), w(), _(), A();
            });
            var i = document.querySelector("." + f["list-view"]), n = document.querySelector("." + f["grid-view"]);
            ut.observe(i, e), ut.observe(n, e);
        }

        function T() {
            $("div." + f["bar-search"]).css("width", "18%");
            var t = $('<span class="g-dropdown-button"></span>'),
                e = $('<a class="g-button g-button-blue" href="javascript:;"><span class="g-button-right"><em class="icon icon-speed" title="百度网盘下载助手"></em><span class="text" style="width: 60px;">下载助手</span></span></a>'),
                i = $('<span class="menu" style="width:114px"></span>'),
                n = $('<span class="g-button-menu" style="display:block"></span>'),
                a = $('<span class="g-dropdown-button g-dropdown-button-second" menulevel="2"></span>'),
                o = $('<a class="g-button" href="javascript:;"><span class="g-button-right"><span class="text" style="width:auto">直链下载</span></span></a>'),
                s = $('<span class="menu" style="width:120px;left:79px"></span>'),
                l = $('<a id="batchhttplink-direct" class="g-button-menu" href="javascript:;">显示链接</a>');
            s.append(l), n.append(a.append(o).append(s)), n.hover(function () {
                a.toggleClass("button-open");
            }), l.click(D);
            var d = $('<span class="g-button-menu" style="display:block"></span>'),
                r = $('<span class="g-dropdown-button g-dropdown-button-second" menulevel="2"></span>'),
                c = $('<a class="g-button" href="javascript:;"><span class="g-button-right"><span class="text" style="width:auto">Aria下载</span></span></a>'),
                p = $('<span class="menu" style="width:120px;left:79px"></span>'),
                u = $('<a id="batchhttplink-aria" class="g-button-menu" href="javascript:;">显示链接</a>');
            p.append(u), d.append(r.append(c).append(p)), d.hover(function () {
                r.toggleClass("button-open");
            }), u.click(D);
            var h = $('<span class="g-button-menu" style="display:block"></span>'),
                v = $('<span class="g-dropdown-button g-dropdown-button-second" menulevel="2"></span>'),
                g = $('<a class="g-button" href="javascript:;"><span class="g-button-right"><span class="text" style="width:auto">导出到RPC</span></span></a>'),
                m = $('<span class="menu" style="width:120px;left:79px"></span>'),
                w = $('<a id="batchhttplink-rpc" class="g-button-menu" href="javascript:;">显示链接</a>'),
                b = $('<a class="g-button-menu" href="javascript:;">RPC配置</a>');
            m.append(w).append(b), h.append(v.append(g).append(m)), h.hover(function () {
                v.toggleClass("button-open");
            }), w.click(D), b.click(C);
            var y = $('<span class="g-button-menu" style="display:block"></span>'),
                x = $('<span class="g-dropdown-button g-dropdown-button-second" menulevel="2"></span>'),
                k = $('<a class="g-button" href="javascript:;"><span class="g-button-right"><span class="text" style="width:auto">API下载</span></span></a>'),
                _ = $('<span class="menu" style="width:120px;left:77px"></span>'),
                S = $('<a id="download-api" class="g-button-menu" href="javascript:;">直接下载</a>'),
                A = $('<a id="batchhttplink-api" class="g-button-menu" href="javascript:;">显示链接</a>'),
                G = $('<a id="appid-setting" class="g-button-menu" href="javascript:;">神秘代码</a>'),
                M = $('<a id="default-setting" class="g-button-menu" href="javascript:;" style="color: #999;">恢复默认</a>');
            _.append(S).append(A).append(G).append(M), y.append(x.append(k).append(_)), y.hover(function () {
                x.toggleClass("button-open");
            }), S.click(P), A.click(D), G.click(E), M.click(I);
            var T = $('<span class="g-button-menu" style="display:block;cursor: pointer">分享选中文件</span>'),
                j = $('<iframe src="https://ghbtns.com/github-btn.html?user=syhyz1990&repo=baiduyun&type=star&count=true" frameborder="0" scrolling="0" style="height: 20px;max-width: 120px;padding: 0 5px;box-sizing: border-box;margin-top: 5px;"></iframe>');
            T.click(X), i.append(y).append(d).append(h).append(T).append(j), t.append(e).append(i), t.hover(function () {
                t.toggleClass("button-open");
            }), $("." + f["list-tools"]).append(t), $("." + f["list-tools"]).css("height", "40px");
        }

        function C() {
            var t = "";
            t += '<div style="display: flex;align-items: center;justify-content: space-between;margin-bottom: 10px;"><label for="rpcDomain" style="margin-right: 5px;flex: 0 0 90px;">主机：</label><input type="text" id="rpcDomain" value="' + x.domain + '" class="swal-content__input" placeholder="http://localhost"></div>', t += '<div style="display: flex;align-items: center;justify-content: space-between;margin-bottom: 10px;"><label for="rpcPort" style="margin-right: 5px;flex: 0 0 90px;">端口：</label><input type="number" id="rpcPort" value="' + x.port + '" class="swal-content__input" placeholder="6800"></div>', t += '<div style="display: flex;align-items: center;justify-content: space-between;margin-bottom: 10px;"><label for="rpcToken" style="margin-right: 5px;flex: 0 0 90px;">密钥：</label><input type="text" id="rpcToken" value="' + x.token + '" class="swal-content__input" placeholder="没有留空"></div>', t += '<div style="display: flex;align-items: center;justify-content: space-between;margin-bottom: 10px;"><label for="rpcDir" style="margin-right: 5px;flex: 0 0 90px;">下载路径：</label><input type="text" id="rpcDir" value="' + x.dir + '" class="swal-content__input" placeholder="默认为D:"></div>', t = "<div>" + t + "</div>";
            var e = $(t);
            swal({title: "RPC配置", closeOnClickOutside: !1, content: e[0], button: {text: "保存"}}).then(function () {
                GM_setValue("rpcDomain", $("#rpcDomain").val() ? $("#rpcDomain").val() : x.domain), GM_setValue("rpcPort", $("#rpcPort").val() ? $("#rpcPort").val() : x.port), GM_setValue("rpcToken", $("#rpcToken").val()), GM_setValue("rpcDir", $("#rpcDir").val() ? $("#rpcDir").val() : x.dir), history.go(0), swal({
                    text: "保存成功",
                    timer: 800
                });
            });
        }

        function E() {
            swal({
                text: "请输入神秘代码",
                closeOnClickOutside: !1,
                content: {element: "input", attributes: {value: m, placeholder: "默认为：" + g}},
                button: {confirm: {text: "确定", value: "ok"}}
            }).then(function (t) {
                t && (GM_setValue("secretCode", t), swal("神秘代码执行成功 , 点击确定将自动刷新").then(function () {
                    history.go(0);
                }));
            });
        }

        function I() {
            GM_setValue("secretCode", g), swal("恢复默认成功，点击确定将自动刷新").then(function () {
                history.go(0);
            });
        }

        function j() {
            return 1 === et.ISSVIP;
        }

        function P(e) {
            t("选中文件列表：", dt);
            var i = e.target.id, n = void 0;
            if ("download-direct" == i) {
                var a = void 0;
                if (0 === dt.length) return void swal(v.unselected);
                1 == dt.length && (a = 1 === dt[0].isdir ? "batch" : "dlink"), dt.length > 1 && (a = "batch"), st = q(dt);
                var o = Q(a);
                if (0 !== o.errno) return -1 == o.errno ? void swal("文件不存在或已被百度和谐，无法下载！") : 112 == o.errno ? void swal("页面过期，请刷新重试！") : void swal("发生错误！");
                if ("dlink" == a) n = o.dlink[0].dlink; else {
                    if ("batch" != a) return void swal("发生错误！");
                    n = o.dlink, 1 === dt.length && (n = n + "&zipname=" + encodeURIComponent(dt[0].filename) + ".zip");
                }
            } else {
                if (0 === dt.length) return void swal(v.unselected);
                if (dt.length > 1) return void swal(v.morethan);
                if (1 == dt[0].isdir) return void swal(v.dir);
                "download-api" == i && (n = W(dt[0].path));
            }
            Z(n);
        }

        function D(e) {
            if (t("选中文件列表：", dt), 0 === dt.length) return void swal(v.unselected);
            var i = e.target.id, n = void 0, a = void 0;
            if (n = -1 == i.indexOf("https") ? -1 == i.indexOf("http") ? location.protocol + ":" : "http:" : "https:", rt = [], ct = [], -1 != i.indexOf("direct")) {
                rt = O(n);
                if (0 === rt.length) return void swal("没有链接可以显示，不要选中文件夹！");
                gt.open({
                    title: "直链下载",
                    type: "batch",
                    list: rt,
                    tip: '点击链接直接下载，请先升级 <a href="https://www.baiduyun.wiki/zh-cn/assistant.html">[网盘万能助手]</a> 至 <b>v2.2.0</b>，本链接仅支持小文件下载（<300M）',
                    showcopy: !1
                });
            }
            if (-1 != i.indexOf("aria")) {
                if (rt = V(n), a = '请先安装 <a  href="https://www.baiduyun.wiki/zh-cn/assistant.html">网盘万能助手</a> 请将链接复制到支持Aria的下载器中, 推荐使用 <a href="http://pan.baiduyun.wiki/down">XDown</a>', 0 === rt.length) return void swal("没有链接可以显示，不要选中文件夹！");
                gt.open({title: "Aria链接", type: "batchAria", list: rt, tip: a, showcopy: !0});
            }
            if (-1 != i.indexOf("rpc")) {
                if (rt = V(n), a = '点击按钮发送链接至Aria下载器中<a href="https://www.baiduyun.wiki/zh-cn/rpc.html">详细说明</a>，需配合最新版 <a href="https://www.baiduyun.wiki/zh-cn/assistant.html">[网盘万能助手]</a>，支持本地和远程下载，此功能建议配合百度会员使用', 0 === rt.length) return void swal("没有链接可以显示，不要选中文件夹！");
                gt.open({title: "Aria RPC", type: "batchAriaRPC", list: rt, tip: a, showcopy: !1});
            }
            if (-1 != i.indexOf("api")) {
                if (rt = V(n), a = '请先安装 <a href="https://www.baiduyun.wiki/zh-cn/assistant.html">网盘万能助手</a> <b>v2.2.0</b> 后点击链接下载，若下载失败，请更换神秘代码 <a href="https://www.baiduyun.wiki/zh-cn/question.html" target="_blank">获取神秘代码</a>', 0 === rt.length) return void swal("没有链接可以显示，API链接不要全部选中文件夹！");
                gt.open({title: "API下载链接", type: "batch", list: rt, tip: a});
            }
        }

        function O(t) {
            var e = [];
            return $.each(dt, function (i, n) {
                var a = void 0, o = void 0, s = void 0;
                a = 0 == n.isdir ? "dlink" : "batch", st = q([n]), s = Q(a), 0 == s.errno ? ("dlink" == a ? o = s.dlink[0].dlink : "batch" == a && (o = s.dlink), o = o.replace(/^([A-Za-z]+):/, t)) : o = "error", e.push({
                    filename: n.filename,
                    downloadlink: o
                });
            }), e;
        }

        function V(t) {
            var e = [];
            return $.each(dt, function (i, n) {
                if (1 != n.isdir) {
                    var a = void 0;
                    a = W(n.path), a = a.replace(/^([A-Za-z]+):/, t), e.push({filename: n.filename, downloadlink: a});
                }
            }), e;
        }

        function R() {
            var t = void 0;
            try {
                t = new Function("return " + et.sign2)();
            } catch (t) {
                throw new Error(t.message);
            }
            return s(t(et.sign5, et.sign1));
        }

        function N() {
            var t = location.hash, e = new RegExp("path=([^&]*)(&|$)", "i"), i = t.match(e);
            return decodeURIComponent(i[1]);
        }

        function U() {
            var t = location.hash, e = new RegExp("type=([^&]*)(&|$)", "i"), i = t.match(e);
            return decodeURIComponent(i[1]);
        }

        function z() {
            var t = location.hash, e = new RegExp("key=([^&]*)(&|$)", "i"), i = t.match(e);
            return decodeURIComponent(i[1]);
        }

        function F() {
            var t = location.hash;
            return t.substring(t.indexOf("#") + 2, t.indexOf("?"));
        }

        function L() {
            var t = [], e = wt + "list", i = N();
            ot = r();
            var n = {
                dir: i,
                bdstoken: at,
                logid: ot,
                order: "size",
                num: 1e3,
                desc: 0,
                clienttype: 0,
                showempty: 0,
                web: 1,
                channel: "chunlei",
                appid: m
            };
            return $.ajax({
                url: e, async: !1, method: "GET", data: n, success: function (e) {
                    t = 0 === e.errno ? e.list : [];
                }
            }), t;
        }

        function H() {
            var t = [], e = wt + "categorylist", i = U();
            ot = r();
            var n = {
                category: i,
                bdstoken: at,
                logid: ot,
                order: "size",
                desc: 0,
                clienttype: 0,
                showempty: 0,
                web: 1,
                channel: "chunlei",
                appid: m
            };
            return $.ajax({
                url: e, async: !1, method: "GET", data: n, success: function (e) {
                    t = 0 === e.errno ? e.info : [];
                }
            }), t;
        }

        function K() {
            var t = [], e = wt + "search";
            ot = r(), mt = z();
            var i = {
                recursion: 1,
                order: "time",
                desc: 1,
                showempty: 0,
                web: 1,
                page: 1,
                num: 100,
                key: mt,
                channel: "chunlei",
                app_id: 250528,
                bdstoken: at,
                logid: ot,
                clienttype: 0
            };
            return $.ajax({
                url: e, async: !1, method: "GET", data: i, success: function (e) {
                    t = 0 === e.errno ? e.list : [];
                }
            }), t;
        }

        function q(t) {
            if (0 === t.length) return null;
            var e = [];
            return $.each(t, function (t, i) {
                e.push(i.fs_id);
            }), "[" + e + "]";
        }

        function B() {
            return et.timestamp;
        }

        function J() {
            return et.MYBDSTOKEN;
        }

        function X() {
            var t = [];
            if (0 === dt.length) return void swal(v.unselected);
            $.each(dt, function (e, i) {
                t.push(i.path);
            });
            var e = "https://pan.baidu.com/share/set?channel=chunlei&clienttype=0&web=1&channel=chunlei&web=1&app_id=250528&bdstoken=" + at + "&logid=" + ot + "&clienttype=0",
                i = Y(), n = {schannel: 4, channel_list: JSON.stringify([]), period: 0, pwd: i, fid_list: q(dt)};
            $.ajax({
                url: e, async: !1, method: "POST", data: n, success: function (t) {
                    if (0 === t.errno) {
                        var e = t.link + "#" + i;
                        swal({
                            title: "分享链接",
                            closeOnClickOutside: !1,
                            text: e + " （#后面为提取码）",
                            buttons: {open: {text: "打开", value: "open"}, copy: {text: "复制链接", value: "copy"}}
                        }).then(function (t) {
                            "open" === t && GM_openInTab(e, {active: !0}), "copy" === t && GM_setClipboard(e);
                        });
                    }
                }
            });
        }

        function Y() {
            function t(t, e) {
                return Math.round(Math.random() * (t - e) + e);
            }

            for (var e = "", i = 0; i < 4; i++) {
                e = e + t(0, 9) + String.fromCharCode(t(97, 122)) + String.fromCharCode(t(65, 90));
            }
            for (var n = "", i = 0; i < 4; i++) n += e[t(0, e.length - 1)];
            return n;
        }

        function Q(t) {
            var e = void 0;
            ot = r();
            var i = {sign: it, timestamp: nt, fidlist: st, type: t};
            return $.ajax({
                url: "https://pan.baidu.com/api/download?clienttype=1",
                async: !1,
                method: "POST",
                data: i,
                success: function (t) {
                    e = t;
                }
            }), e;
        }

        function W(t) {
            return bt + "file?method=download&path=" + encodeURIComponent(t) + "&app_id=" + m;
        }

        function Z(t) {
            $("#helperdownloadiframe").attr("src", t);
        }

        function tt() {
            var t = $('<div class="helper-hide" style="padding:0;margin:0;display:block"></div>'),
                e = $('<iframe src="javascript:;" id="helperdownloadiframe" style="display:none"></iframe>');
            t.append(e), $("body").append(t);
        }

        var et = void 0, it = void 0, nt = void 0, at = void 0, ot = void 0, st = void 0, lt = [], dt = [], rt = [],
            ct = [], pt = "list", ut = void 0, ht = void 0, ft = void 0, vt = void 0, gt = void 0, mt = void 0,
            wt = location.protocol + "//" + location.host + "/api/",
            bt = location.protocol + "//pcs.baidu.com/rest/2.0/pcs/";
        location.protocol;
        this.init = function () {
            if (et = unsafeWindow.yunData, t("初始化信息:", et), void 0 === et) return void t("页面未正常加载，或者百度已经更新！");
            m = 1 === et.ISSVIP ? 250528 : 778750, e(), l(), M(), T(), tt(), gt = new c({addCopy: !0}), t("下载助手加载成功！当前版本：", h);
        };
    }

    function o() {
        function e() {
            if (ft = n(), W = Q.SIGN, Z = Q.TIMESTAMP, tt = Q.MYBDSTOKEN, et = "chunlei", it = 0, nt = 1, at = m, ot = r(), st = 0, lt = "share", rt = Q.SHARE_ID, dt = Q.SHARE_UK, "secret" == ft && (pt = s()), a()) {
                var t = {};
                2 == Q.CATEGORY ? (t.filename = Q.FILENAME, t.path = Q.PATH, t.fs_id = Q.FS_ID, t.isdir = 0) : void 0 != Q.FILEINFO && (t.filename = Q.FILEINFO[0].server_filename, t.path = Q.FILEINFO[0].path, t.fs_id = Q.FILEINFO[0].fs_id, t.isdir = Q.FILEINFO[0].isdir), $t.push(t);
            } else ut = Q.SHARE_ID, gt = l(), mt = u(), xt = z();
        }

        function i() {
            var t = location.hash && /^#([a-zA-Z0-9]{4})$/.test(location.hash) && RegExp.$1,
                e = $('.pickpw input[tabindex="1"]'), i = $(".pickpw a.g-button"), n = $(".pickpw .input-area"),
                a = $('<div style="margin:-8px 0 10px ;color: #ff5858">正在获取提取码</div>');
            (location.href.match(/\/init\?(?:surl|shareid)=((?:\w|-)+)/) || location.href.match(/\/s\/1((?:\w|-)+)/))[1];
            e && i && (n.prepend(a), t && (a.text("发现提取码，已自动为您填写"), setTimeout(function () {
                e.val(t), i.click();
            }, 500)));
        }

        function n() {
            return 1 === Q.SHARE_PUBLIC ? "public" : "secret";
        }

        function a() {
            return void 0 === Q.getContext;
        }

        function o() {
            return 1 == Q.MYSELF;
        }

        function s() {
            return '{"sekey":"' + decodeURIComponent(d("BDCLND")) + '"}';
        }

        function l() {
            var t = location.hash, e = new RegExp("path=([^&]*)(&|$)", "i"), i = t.match(e);
            return decodeURIComponent(i[1]);
        }

        function u() {
            var t = "list";
            return $(".list-switched-on").length > 0 ? t = "list" : $(".grid-switched-on").length > 0 && (t = "grid"), t;
        }

        function g() {
            a() ? ($("div.slide-show-right").css("width", "500px"), $("div.frame-main").css("width", "96%"), $("div.share-file-viewer").css("width", "740px").css("margin-left", "auto").css("margin-right", "auto")) : $("div.slide-show-right").css("width", "500px");
            var t = $('<span class="g-dropdown-button"></span>'),
                e = $('<a class="g-button g-button-blue" style="width: 114px;" data-button-id="b200" data-button-index="200" href="javascript:;"></a>'),
                i = $('<span class="g-button-right"><em class="icon icon-speed" title="百度网盘下载助手"></em><span class="text" style="width: 60px;">下载助手</span></span>'),
                n = $('<span class="menu" style="width:auto;z-index:41"></span>'),
                o = $('<a data-menu-id="b-menu207" class="g-button-menu" href="javascript:;">保存到网盘</a>'),
                s = $('<a data-menu-id="b-menu207" class="g-button-menu" href="javascript:;" style="opacity: 0.8;">自定义保存路径</a>'),
                l = $('<a data-menu-id="b-menu207" class="g-button-menu" href="javascript:;">直接下载</a>'),
                d = $('<a data-menu-id="b-menu208" class="g-button-menu" href="javascript:;" data-type="down">显示链接</a>'),
                r = $('<a data-menu-id="b-menu208" class="g-button-menu" href="javascript:;">显示Aria链接</a>'),
                c = $('<a data-menu-id="b-menu208" class="g-button-menu" href="javascript:;" data-type="rpc">导出到RPC</a>'),
                p = $('<a data-menu-id="b-menu209" style="color: #e85653;font-weight: 700;" class="g-button-menu" href="javascript:;">Ver ' + h + "</a>");
            n.append(l).append(d).append(r).append(c).append(o).append(p), e.append(i), t.append(e).append(n), t.hover(function () {
                t.toggleClass("button-open");
            }), o.click(_), s.click(S), l.click(F), c.click(B), d.click(B), r.click(A), p.click(k), $("div.module-share-top-bar div.bar div.x-button-box").append(t);
        }

        function y() {
            var t = {shareid: ut, from: Q.SHARE_UK, bdstoken: Q.MYBDSTOKEN, logid: r()},
                e = {path: w, isdir: 1, size: "", block_list: [], method: "post", dataType: "json"},
                i = "https://pan.baidu.com/api/create?a=commit&channel=chunlei&app_id=250528&web=1&app_id=250528&bdstoken=" + t.bdstoken + "&logid=" + t.logid + "&clienttype=0";
            $.ajax({
                url: i, async: !1, method: "POST", data: e, success: function (t) {
                    0 === t.errno ? (swal("目录创建成功！"), _()) : swal("目录创建失败，请前往我的网盘页面手动创建！");
                }
            });
        }

        function k() {
            GM_openInTab("https://www.baiduyun.wiki/install.html", {active: !0});
        }

        function _() {
            if (null === tt) return swal(v.unlogin), !1;
            if (0 === $t.length) return void swal(v.unselected);
            if (o()) return void swal({
                title: "提示",
                text: "自己分享的文件请到网盘中下载！",
                buttons: {confirm: {text: "打开网盘", value: "confirm"}}
            }).then(function (t) {
                "confirm" === t && (location.href = "https://pan.baidu.com/disk/home#/all?path=%2F&vmode=list");
            });
            var t = [];
            $.each($t, function (e, i) {
                t.push(i.fs_id);
            });
            var e = {shareid: Q.SHARE_ID, from: Q.SHARE_UK, bdstoken: Q.MYBDSTOKEN, logid: r()},
                i = {path: GM_getValue("savePath"), fsidlist: JSON.stringify(t)},
                n = "https://pan.baidu.com/share/transfer?shareid=" + e.shareid + "&from=" + e.from + "&ondup=newcopy&async=1&channel=chunlei&web=1&app_id=250528&bdstoken=" + e.bdstoken + "&logid=" + e.logid + "&clienttype=0";
            $.ajax({
                url: n, async: !1, method: "POST", data: i, success: function (t) {
                    0 === t.errno ? swal({
                        title: "提示",
                        text: "文件已保存至我的网盘，请再网盘中使用下载助手下载！",
                        buttons: {confirm: {text: "打开网盘", value: "confirm"}}
                    }).then(function (t) {
                        "confirm" === t && (location.href = "https://pan.baidu.com/disk/home#/all?vmode=list&path=" + encodeURIComponent(w));
                    }) : 2 === t.errno ? swal({
                        title: "提示",
                        text: "保存目录不存在，是否先创建该目录？",
                        buttons: {confirm: {text: "创建目录", value: "confirm"}}
                    }).then(function (t) {
                        "confirm" === t && y();
                    }) : swal("保存失败，请手动保存");
                }
            });
        }

        function S() {
            var t = prompt("请输入保存路径，例如/PanHelper", w);
            null !== t && (/^\//.test(t) ? (GM_setValue("savePath", t), swal({
                title: "提示",
                text: "路径设置成功！点击确定后立即生效",
                buttons: {confirm: {text: "确定", value: "confirm"}}
            }).then(function (t) {
                "confirm" === t && history.go(0);
            })) : swal("请输入正确的路径，例如/PanHelper"));
        }

        function A() {
            return null === tt ? (swal(v.unlogin), !1) : (t("选中文件列表：", $t), 0 === $t.length ? (swal(v.unselected), !1) : 1 == $t[0].isdir ? (swal(v.toobig), !1) : (vt = "ariclink", void J(function (t) {
                if (void 0 !== t) if (-20 == t.errno) {
                    if (!(ht = L()) || 0 !== ht.errno) return swal("获取验证码失败！"), !1;
                    yt.open(ht);
                } else {
                    if (112 == t.errno) return swal("页面过期，请刷新重试"), !1;
                    if (0 === t.errno) {
                        bt.open({
                            title: "下载链接（仅显示文件链接）",
                            type: "shareAriaLink",
                            list: t.list,
                            tip: '请先安装 <a  href="https://www.baiduyun.wiki/zh-cn/assistant.html">网盘万能助手</a> 请将链接复制到支持Aria的下载器中, 推荐使用 <a  href="http://pan.baiduyun.wiki/down">XDown</a>',
                            showcopy: !0
                        });
                    } else swal(v.fail);
                }
            })));
        }

        function G() {
            var t = $('<div class="helper-hide" style="padding:0;margin:0;display:block"></div>'),
                e = $('<iframe src="javascript:;" id="helperdownloadiframe" style="display:none"></iframe>');
            t.append(e), $("body").append(t);
        }

        function M() {
            C(), j(), P(), O(), R(), T();
        }

        function T() {
            $(document).on("click", ".aria-rpc", function (t) {
                var e = (t.target.dataset.link, t.target.dataset.filename);
                GM_xmlhttpRequest({
                    method: "HEAD",
                    headers: {"User-Agent": b},
                    url: t.target.dataset.link,
                    onload: function (t) {
                        var i = t.finalUrl;
                        if (i) {
                            var n = x.domain + ":" + x.port + "/jsonrpc", a = {
                                id: (new Date).getTime(),
                                jsonrpc: "2.0",
                                method: "aria2.addUri",
                                params: ["token:" + x.token, [i], {dir: x.dir, out: e, header: ["User-Agent:" + b]}]
                            };
                            GM_xmlhttpRequest({
                                method: "POST",
                                headers: {"User-Agent": b},
                                url: n,
                                responseType: "json",
                                timeout: 3e3,
                                data: JSON.stringify(a),
                                onload: function (t) {
                                    t.response.result ? swal({
                                        text: "发送成功",
                                        icon: "success",
                                        timer: 800
                                    }) : swal({text: t.response.message, icon: "error"});
                                },
                                ontimeout: function () {
                                    swal({text: "无法连接到RPC服务，请检查RPC配置", icon: "error"});
                                }
                            });
                        }
                    }
                });
            });
        }

        function C() {
            window.addEventListener("hashchange", function (t) {
                mt = u(), gt == l() || (gt = l(), E(), I());
            });
        }

        function E() {
            xt = z();
        }

        function I() {
            $t = [];
        }

        function j() {
            u();
        }

        function P() {
            mt = u();
            var e = $("span." + f.checkbox);
            "grid" == mt && (e = $("." + f["chekbox-grid"])), e.each(function (e, i) {
                $(i).on("click", function (e) {
                    var i = $(this).parent(), n = void 0, a = void 0;
                    if ("list" == mt ? (n = $(".file-name div.text a", i).attr("title"), a = $(this).parents("dd").hasClass("JS-item-active")) : "grid" == mt && (n = $("div.file-name a", i).attr("title"), a = !$(this).hasClass("JS-item-active")), a) {
                        t("取消选中文件：" + n);
                        for (var o = 0; o < $t.length; o++) $t[o].filename == n && $t.splice(o, 1);
                    } else t("选中文件: " + n), $.each(xt, function (t, e) {
                        if (e.server_filename == n) {
                            var i = {filename: e.server_filename, path: e.path, fs_id: e.fs_id, isdir: e.isdir};
                            $t.push(i);
                        }
                    });
                });
            });
        }

        function D() {
            $("span." + f.checkbox).each(function (t, e) {
                $(e).unbind("click");
            });
        }

        function O() {
            $("div." + f["col-item"] + "." + f.check).each(function (e, i) {
                $(i).bind("click", function (e) {
                    $(this).parent().hasClass(f.checked) ? (t("取消全选"), $t = []) : (t("全部选中"), $t = [], $.each(xt, function (t, e) {
                        var i = {filename: e.server_filename, path: e.path, fs_id: e.fs_id, isdir: e.isdir};
                        $t.push(i);
                    }));
                });
            });
        }

        function V() {
            $("div." + f["col-item"] + "." + f.check).each(function (t, e) {
                $(e).unbind("click");
            });
        }

        function R() {
            $("div." + f["list-view"] + " dd").each(function (e, i) {
                $(i).bind("click", function (e) {
                    var i = e.target.nodeName.toLowerCase();
                    if ("span" != i && "a" != i && "em" != i) {
                        $t = [];
                        var n = $("div.file-name div.text a", $(this)).attr("title");
                        t("选中文件：" + n), $.each(xt, function (t, e) {
                            if (e.server_filename == n) {
                                var i = {filename: e.server_filename, path: e.path, fs_id: e.fs_id, isdir: e.isdir};
                                $t.push(i);
                            }
                        });
                    }
                });
            });
        }

        function N() {
            $("div." + f["list-view"] + " dd").each(function (t, e) {
                $(e).unbind("click");
            });
        }

        function U() {
            var t = window.MutationObserver, e = {childList: !0};
            wt = new t(function (t) {
                D(), V(), N(), P(), O(), R();
            });
            var i = document.querySelector("." + f["list-view"]), n = document.querySelector("." + f["grid-view"]);
            wt.observe(i, e), wt.observe(n, e);
        }

        function z() {
            var t = [];
            if ("/" == l()) t = Q.FILEINFO; else {
                ot = r();
                var e = {
                    uk: dt,
                    shareid: ut,
                    order: "other",
                    desc: 1,
                    showempty: 0,
                    web: nt,
                    dir: l(),
                    t: Math.random(),
                    bdstoken: tt,
                    channel: et,
                    clienttype: it,
                    app_id: at,
                    logid: ot
                };
                $.ajax({
                    url: _t, method: "GET", async: !1, data: e, success: function (e) {
                        0 === e.errno && (t = e.list);
                    }
                });
            }
            return t;
        }

        function F() {
            return null === tt ? (swal(v.unlogin), !1) : (t("选中文件列表：", $t), 0 === $t.length ? (swal(v.unselected), !1) : $t.length > 1 ? (swal(v.morethan), !1) : 1 == $t[0].isdir ? (swal(v.dir), !1) : (vt = "download", void J(function (t) {
                if (void 0 !== t) if (-20 == t.errno) {
                    if (ht = L(), 0 !== ht.errno) return void swal("获取验证码失败！");
                    yt.open(ht);
                } else if (112 == t.errno) swal("页面过期，请刷新重试"); else if (0 === t.errno) {
                    var e = t.list[0].dlink;
                    Y(e);
                } else swal(v.fail);
            })));
        }

        function L() {
            var t = kt + "getvcode", e = void 0;
            ot = r();
            var i = {
                prod: "pan",
                t: Math.random(),
                bdstoken: tt,
                channel: et,
                clienttype: it,
                web: nt,
                app_id: at,
                logid: ot
            };
            return $.ajax({
                url: t, method: "GET", async: !1, data: i, success: function (t) {
                    e = t;
                }
            }), e;
        }

        function H() {
            ht = L(), $("#dialog-img").attr("src", ht.img);
        }

        function K() {
            var t = $("#dialog-input").val();
            return 0 === t.length ? void $("#dialog-err").text("请输入验证码") : t.length < 4 ? void $("#dialog-err").text("验证码输入错误，请重新输入") : void X(t, function (t) {
                if (-20 == t.errno) {
                    if (yt.close(), $("#dialog-err").text("验证码输入错误，请重新输入"), H(), !ht || 0 !== ht.errno) return void swal("获取验证码失败！");
                    yt.open();
                } else if (0 === t.errno) {
                    if (yt.close(), "download" == vt) {
                        if (t.list.length > 1 || 1 == t.list[0].isdir) return swal(v.morethan), !1;
                        var e = t.list[0].dlink;
                        Y(e);
                    }
                    if ("link" == vt) {
                        bt.open({
                            title: "下载链接（仅显示文件链接）",
                            type: "shareLink",
                            list: t.list,
                            tip: '点击链接直接下载，请先升级 <a href="https://www.baiduyun.wiki/zh-cn/assistant.html">[网盘万能助手]</a> 至 <b>v2.2.0</b>（出现403请先禁用IDM扩展，若仍失败请尝试Aria链接）',
                            showcopy: !1
                        });
                    }
                    if ("ariclink" == vt) {
                        bt.open({
                            title: "下载链接（仅显示文件链接）",
                            type: "shareAriaLink",
                            list: t.list,
                            tip: '请先安装 <a  href="https://www.baiduyun.wiki/zh-cn/assistant.html">网盘万能助手</a> 请将链接复制到支持Aria的下载器中, 推荐使用 <a  href="http://pan.baiduyun.wiki/down">XDown</a>',
                            showcopy: !1
                        });
                    }
                } else swal("发生错误！");
            });
        }

        function q() {
            var t = [];
            return $.each($t, function (e, i) {
                t.push(i.fs_id);
            }), "[" + t + "]";
        }

        function B(e) {
            return null === tt ? (swal(v.unlogin), !1) : (t("选中文件列表：", $t), 0 === $t.length ? (swal(v.unselected), !1) : 1 == $t[0].isdir ? (swal(v.dir), !1) : (vt = "link", void J(function (t) {
                if (void 0 !== t) if (-20 == t.errno) {
                    if (!(ht = L()) || 0 !== ht.errno) return swal("获取验证码失败！"), !1;
                    yt.open(ht);
                } else {
                    if (112 == t.errno) return swal("页面过期，请刷新重试"), !1;
                    if (0 === t.errno) if ("rpc" === e.target.dataset.type) {
                        bt.open({
                            title: "下载链接（仅显示文件链接）",
                            type: "rpcLink",
                            list: t.list,
                            tip: '点击按钮发送链接至Aria下载器中 <a href="https://www.baiduyun.wiki/zh-cn/rpc.html">详细说明</a>，需配合最新版 <a href="https://www.baiduyun.wiki/zh-cn/assistant.html">[网盘万能助手]</a>，支持本地和远程下载',
                            showcopy: !1
                        });
                    } else {
                        bt.open({
                            title: "下载链接（仅显示文件链接）",
                            type: "shareLink",
                            list: t.list,
                            tip: '点击链接直接下载，请先升级 <a href="https://www.baiduyun.wiki/zh-cn/assistant.html">[网盘万能助手]</a> 至 <b>v2.2.0</b>（出现403请先禁用IDM扩展，若仍失败请尝试Aria链接）',
                            showcopy: !1
                        });
                    } else swal(v.fail);
                }
            })));
        }

        function J(t) {
            if (null === tt) return swal(v.unlogin), "";
            var e = void 0;
            if (a) {
                ct = q(), ot = r();
                var i = new FormData;
                i.append("encrypt", st), i.append("product", lt), i.append("uk", dt), i.append("primaryid", rt), i.append("fid_list", ct), "secret" == ft && i.append("extra", pt), $.ajax({
                    url: "https://api.baiduyun.wiki/download?sign=" + W + "&timestamp=" + Z + "&logid=" + ot + "&init=" + GM_getValue("init"),
                    cache: !1,
                    method: "GET",
                    async: !1,
                    complete: function (t) {
                        e = t.responseText;
                    }
                }), GM_xmlhttpRequest({
                    method: "POST", data: i, url: atob(atob(e)), onload: function (e) {
                        t(JSON.parse(e.response));
                    }
                });
            }
        }

        function X(t, e) {
            var i = void 0;
            if (a) {
                ct = q(), ot = r();
                var n = new FormData;
                n.append("encrypt", st), n.append("product", lt), n.append("uk", dt), n.append("primaryid", rt), n.append("fid_list", ct), n.append("vcode_input", t), n.append("vcode_str", ht.vcode), "secret" == ft && n.append("extra", pt), $.ajax({
                    url: "https://api.baiduyun.wiki/download?sign=" + W + "&timestamp=" + Z + "&logid=" + ot,
                    cache: !1,
                    method: "GET",
                    async: !1,
                    complete: function (t) {
                        i = t.responseText;
                    }
                }), GM_xmlhttpRequest({
                    method: "POST", data: n, url: atob(atob(i)), onload: function (t) {
                        e(JSON.parse(t.response));
                    }
                });
            }
        }

        function Y(e) {
            t("下载链接：" + e), e && GM_xmlhttpRequest({
                method: "POST",
                headers: {"User-Agent": b},
                url: e,
                onload: function (t) {
                }
            });
        }

        var Q = void 0, W = void 0, Z = void 0, tt = void 0, et = void 0, it = void 0, nt = void 0, at = void 0,
            ot = void 0, st = void 0, lt = void 0, dt = void 0, rt = void 0, ct = void 0, pt = void 0, ut = void 0,
            ht = void 0, ft = void 0, vt = void 0, gt = void 0, mt = void 0, wt = void 0, bt = void 0, yt = void 0,
            xt = [], $t = [], kt = location.protocol + "//" + location.host + "/api/",
            _t = location.protocol + "//" + location.host + "/share/list";
        this.init = function () {
            if (GM_getValue("SETTING_P") && i(), Q = unsafeWindow.yunData, t("初始化信息:", Q), void 0 === Q) return void t("页面未正常加载，或者百度已经更新！");
            m = 1 === Q.ISSVIP ? 250528 : 778750, e(), g(), bt = new c({addCopy: !1}), yt = new p(H, K), G(), M(), a() || U(), t("下载助手加载成功！当前版本：", h);
        };
    }

    function s(t) {
        var e = void 0, i = void 0, n = void 0, a = void 0, o = void 0, s = void 0,
            l = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        for (n = t.length, i = 0, e = ""; n > i;) {
            if (a = 255 & t.charCodeAt(i++), i == n) {
                e += l.charAt(a >> 2), e += l.charAt((3 & a) << 4), e += "==";
                break;
            }
            if (o = t.charCodeAt(i++), i == n) {
                e += l.charAt(a >> 2), e += l.charAt((3 & a) << 4 | (240 & o) >> 4), e += l.charAt((15 & o) << 2), e += "=";
                break;
            }
            s = t.charCodeAt(i++), e += l.charAt(a >> 2), e += l.charAt((3 & a) << 4 | (240 & o) >> 4), e += l.charAt((15 & o) << 2 | (192 & s) >> 6), e += l.charAt(63 & s);
        }
        return e;
    }

    function l() {
        var t = /[\/].+[\/]/g;
        return location.pathname.match(t)[0].replace(/\//g, "");
    }

    function d(t) {
        var e = void 0, i = void 0, n = document, a = decodeURI;
        return n.cookie.length > 0 && -1 != (e = n.cookie.indexOf(t + "=")) ? (e = e + t.length + 1, i = n.cookie.indexOf(";", e), -1 == i && (i = n.cookie.length), a(n.cookie.substring(e, i))) : "";
    }

    function r() {
        function t(t) {
            if (t.length < 2) {
                var e = t.charCodeAt(0);
                return 128 > e ? t : 2048 > e ? l(192 | e >>> 6) + l(128 | 63 & e) : l(224 | e >>> 12 & 15) + l(128 | e >>> 6 & 63) + l(128 | 63 & e);
            }
            var i = 65536 + 1024 * (t.charCodeAt(0) - 55296) + (t.charCodeAt(1) - 56320);
            return l(240 | i >>> 18 & 7) + l(128 | i >>> 12 & 63) + l(128 | i >>> 6 & 63) + l(128 | 63 & i);
        }

        function e(e) {
            return (e + "" + Math.random()).replace(s, t);
        }

        function i(t) {
            var e = [0, 2, 1][t.length % 3],
                i = t.charCodeAt(0) << 16 | (t.length > 1 ? t.charCodeAt(1) : 0) << 8 | (t.length > 2 ? t.charCodeAt(2) : 0);
            return [o.charAt(i >>> 18), o.charAt(i >>> 12 & 63), e >= 2 ? "=" : o.charAt(i >>> 6 & 63), e >= 1 ? "=" : o.charAt(63 & i)].join("");
        }

        function n(t) {
            return t.replace(/[\s\S]{1,3}/g, i);
        }

        function a() {
            return n(e((new Date).getTime()));
        }

        var o = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/~！@#￥%……&",
            s = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g, l = String.fromCharCode;
        return function (t, e) {
            return e ? a(String(t)).replace(/[+\/]/g, function (t) {
                return "+" == t ? "-" : "_";
            }).replace(/=/g, "") : a(String(t));
        }(d("BAIDUID"));
    }

    function c() {
        function t() {
            $("div.dialog-body", o).children().remove(), $("div.dialog-header h3 span.dialog-title", o).text(""), $("div.dialog-tip p", o).text(""), $("div.dialog-button", o).hide(), $("div.dialog-radio input[type=radio][name=showmode][value=multi]", o).prop("checked", !0), $("div.dialog-radio", o).hide(), $("div.dialog-button button#dialog-copy-button", o).hide(), $("div.dialog-button button#dialog-edit-button", o).hide(), $("div.dialog-button button#dialog-exit-button", o).hide(), o.hide(), s.hide();
        }

        var e = [], a = void 0, o = void 0, s = void 0;
        this.open = function (t) {
            if (a = t, e = [], "link" == t.type && (e = t.list.urls, $("div.dialog-header h3 span.dialog-title", o).text(t.title + "：" + t.list.filename),
                $.each(t.list.urls, function (t, e) {
                    e.url = n(e.url);
                    var i = $('<div><div style="width:30px;float:left">' + e.rank + ':</div><div style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis"><a href="' + e.url + '">' + e.url + "</a></div></div>");
                    $("div.dialog-body", o).append(i);
                })), "batch" != t.type && "batchAria" != t.type && "batchAriaRPC" != t.type || (e = t.list, $("div.dialog-header h3 span.dialog-title", o).text(t.title), $.each(t.list, function (e, n) {
                var a = void 0;
                if ("batchAria" == t.type) {
                    var s = i(n.downloadlink, n.filename, y);
                    a = $('<div style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap"><div style="width:150px;float:left;overflow:hidden;text-overflow:ellipsis" title="' + n.filename + '">' + n.filename + '</div><span>：</span><a href="javascript:;" class="aria2c-link">' + s + "</a></div>");
                }
                "batch" == t.type && (a = $('<div style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap"><div style="width:150px;float:left;overflow:hidden;text-overflow:ellipsis" title="' + n.filename + '">' + n.filename + '</div><span>：</span><a href="' + n.downloadlink + '">' + n.downloadlink + "</a></div>")), "batchAriaRPC" == t.type && (a = $('<div style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap"><div style="width:150px;float:left;overflow:hidden;text-overflow:ellipsis" title="' + n.filename + '">' + n.filename + '</div><span>：</span><button class="aria-rpc" data-link="' + n.downloadlink + '" data-filename="' + n.filename + '">点击发送到Aria</button></div>')), $("div.dialog-body", o).append(a);
            })), "shareLink" == t.type && (e = t.list, $("div.dialog-header h3 span.dialog-title", o).text(t.title), $.each(t.list, function (t, e) {
                if (e.dlink = n(e.dlink), 1 != e.isdir) {
                    var i = $('<div style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap"><div style="width:150px;float:left;overflow:hidden;text-overflow:ellipsis" title="' + e.server_filename + '">' + e.server_filename + '</div><span>：</span><a href="' + e.dlink + '" class="share-download">' + e.dlink + "</a></div>");
                    $("div.dialog-body", o).append(i);
                }
            })), "rpcLink" == t.type && (e = t.list, $("div.dialog-header h3 span.dialog-title", o).text(t.title), $.each(t.list, function (t, e) {
                if (e.dlink = n(e.dlink), 1 != e.isdir) {
                    var i = $('<div style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap"><div style="width:150px;float:left;overflow:hidden;text-overflow:ellipsis" title="' + e.server_filename + '">' + e.server_filename + '</div><span>：</span><button class="aria-rpc" data-link="' + e.dlink + '" data-filename="' + e.server_filename + '">点击发送到Aria</button></div>');
                    $("div.dialog-body", o).append(i);
                }
            })), "shareAriaLink" == t.type && (e = t.list, $("div.dialog-header h3 span.dialog-title", o).text(t.title), $.each(t.list, function (t, e) {
                if (1 != e.isdir) {
                    var n = i(e.dlink, e.server_filename),
                        a = $('<div style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap"><div style="width:150px;float:left;overflow:hidden;text-overflow:ellipsis" title="' + e.server_filename + '">' + e.server_filename + '</div><span>：</span><a href="javasctipt:void(0)" class="aria2c-link">' + n + "</a></div>");
                    $("div.dialog-body", o).append(a);
                }
            })), t.tip && $("div.dialog-tip p", o).html(t.tip), t.showcopy && ($("div.dialog-button", o).show(), $("div.dialog-button button#dialog-copy-button", o).show()), t.showedit) {
                $("div.dialog-button", o).show(), $("div.dialog-button button#dialog-edit-button", o).show();
                var l = $('<textarea name="dialog-textarea" style="display:none;resize:none;width:758px;height:300px;white-space:pre;word-wrap:normal;overflow-x:scroll"></textarea>'),
                    d = "";
                "batch" == a.type ? $.each(e, function (t, i) {
                    "error" != i.downloadlink && (t == e.length - 1 ? d += i.downloadlink : d += i.downloadlink + "\r\n");
                }) : "link" == a.type && $.each(e, function (t, i) {
                    "error" != i.url && (t == e.length - 1 ? d += i.url : d += i.url + "\r\n");
                }), l.val(d), $("div.dialog-body", o).append(l);
            }
            s.show(), o.show();
        }, this.close = function () {
            t();
        }, o = function () {
            var n = document.body.clientWidth, s = n > 800 ? (n - 800) / 2 : 0,
                l = $('<div class="dialog" style="width: 800px; top: 0px; bottom: auto; left: ' + s + 'px; right: auto; display: hidden; visibility: visible; z-index: 52;"></div>'),
                d = $('<div class="dialog-header"><h3><span class="dialog-title" style="display:inline-block;width:740px;white-space:nowrap;overflow-x:hidden;text-overflow:ellipsis"></span></h3></div>'),
                r = $('<div class="dialog-control"><span class="dialog-icon dialog-close">×</span></div>'),
                c = $('<div class="dialog-body" style="max-height:450px;overflow-y:auto;padding:0 20px;"></div>'),
                p = $('<div class="dialog-tip" style="padding-left:20px;background-color:#fff;border-top: 1px solid #c4dbfe;color: #dc373c;"><p></p></div>');
            l.append(d.append(r)).append(c);
            var u = $('<div class="dialog-button" style="display:none"></div>'),
                h = $('<div style="display:table;margin:auto"></div>'),
                f = $('<button id="dialog-copy-button" style="display:none;width: 100px; margin: 5px 0 10px 0; cursor: pointer; background: #cc3235; border: none; height: 30px; color: #fff; border-radius: 3px;">复制全部链接</button>'),
                v = $('<button id="dialog-edit-button" style="display:none">编辑</button>'),
                g = $('<button id="dialog-exit-button" style="display:none">退出</button>');
            return h.append(f).append(v).append(g), u.append(h), l.append(u), f.click(function () {
                var t = "";
                "batch" == a.type && $.each(e, function (i, n) {
                    "error" != n.downloadlink && (i == e.length - 1 ? t += n.downloadlink : t += n.downloadlink + "\r\n");
                }), "batchAria" == a.type && $.each(e, function (n, a) {
                    "error" != a.downloadlink && (n == e.length - 1 ? t += i(a.downloadlink, a.filename, y) : t += i(a.downloadlink, a.filename, y) + "\r\n");
                }), "rpc" == a.type && $.each(e, function (i, n) {
                    "error" != n.downloadlink && (i == e.length - 1 ? t += n.downloadlink : t += n.downloadlink + "\r\n");
                }), "shareLink" == a.type && $.each(e, function (i, n) {
                    "error" != n.dlink && (i == e.length - 1 ? t += n.dlink : t += n.dlink + "\r\n");
                }), "shareAriaLink" == a.type && $.each(e, function (n, a) {
                    "error" != a.dlink && (n == e.length - 1 ? t += i(a.dlink, a.server_filename) : t += i(a.dlink, a.server_filename) + "\r\n");
                }), GM_setClipboard(t, "text"), "" != t ? swal("已将链接复制到剪贴板！") : swal("复制失败，请手动复制！");
            }), v.click(function () {
                var t = $("div.dialog-body textarea[name=dialog-textarea]", o);
                $("div.dialog-body div", o).hide(), f.hide(), v.hide(), t.show(), $dialog_radio_div.show(), g.show();
            }), g.click(function () {
                var t = $("div.dialog-body textarea[name=dialog-textarea]", o), e = $("div.dialog-body div", o);
                t.hide(), $dialog_radio_div.hide(), e.show(), g.hide(), f.show(), v.show();
            }), l.append(p), $("body").append(l), r.click(t), l;
        }(), s = function () {
            var t = $('<div class="dialog-shadow" style="position: fixed; left: 0px; top: 0px; z-index: 50; background: rgb(0, 0, 0) none repeat scroll 0% 0%; opacity: 0.5; width: 100%; height: 100%; display: none;"></div>');
            return $("body").append(t), t;
        }();
    }

    function p(t, e) {
        function i() {
            $("#dialog-img", n).attr("src", ""), $("#dialog-err").text(""), n.hide(), a.hide();
        }

        var n = void 0, a = void 0;
        this.open = function (t) {
            t && $("#dialog-img").attr("src", t.img), n.show(), a.show();
        }, this.close = function () {
            i();
        }, n = function () {
            var n = document.body.clientWidth, a = n > 520 ? (n - 520) / 2 : 0,
                o = $('<div class="dialog" id="dialog-vcode" style="width:520px;top:0px;bottom:auto;left:' + a + 'px;right:auto;display:none;visibility:visible;z-index:52"></div>'),
                s = $('<div class="dialog-header"><h3><span class="dialog-header-title"><em class="select-text">提示</em></span></h3></div>'),
                l = $('<div class="dialog-control"><span class="dialog-icon dialog-close icon icon-close"><span class="sicon">x</span></span></div>'),
                d = $('<div class="dialog-body"></div>'), r = $('<div style="text-align:center;padding:22px"></div>'),
                c = $('<div class="download-verify" style="margin-top:10px;padding:0 28px;text-align:left;font-size:12px;"></div>'),
                p = $('<div class="verify-body">请输入验证码：</div>'),
                u = $('<input id="dialog-input" type="text" style="padding:3px;width:85px;height:23px;border:1px solid #c6c6c6;background-color:white;vertical-align:middle;" class="input-code" maxlength="4">'),
                h = $('<img id="dialog-img" class="img-code" style="margin-left:10px;vertical-align:middle;" alt="点击换一张" src="" width="100" height="30">'),
                f = $('<a href="javascript:;" style="text-decoration:underline;" class="underline">换一张</a>'),
                v = $('<div id="dialog-err" style="padding-left:84px;height:18px;color:#d80000" class="verify-error"></div>'),
                g = $('<div class="dialog-footer g-clearfix"></div>'),
                m = $('<a class="g-button g-button-blue" data-button-id="" data-button-index href="javascript:;" style="padding-left:36px"><span class="g-button-right" style="padding-right:36px;"><span class="text" style="width:auto;">确定</span></span></a>'),
                w = $('<a class="g-button" data-button-id="" data-button-index href="javascript:;" style="padding-left: 36px;"><span class="g-button-right" style="padding-right: 36px;"><span class="text" style="width: auto;">取消</span></span></a>');
            return s.append(l), p.append(u).append(h).append(f), c.append(p).append(v), r.append(c), d.append(r), g.append(m).append(w), o.append(s).append(d).append(g), $("body").append(o), l.click(i), h.click(t), f.click(t), u.keypress(function (t) {
                13 == t.which && e();
            }), m.click(e), w.click(i), u.click(function () {
                $("#dialog-err").text("");
            }), o;
        }(), a = $("div.dialog-shadow");
    }

    function u() {
        function e() {
            switch (l()) {
                case"disk":
                    return void (new a).init();
                case"share":
                case"s":
                    return void (new o).init();
                default:
                    return;
            }
        }

        function i() {
            $.ajax({
                url: "https://api.baiduyun.wiki/update?ver=" + h, method: "GET", success: function (t) {
                    GM_setValue("lastest_version", t.version), b = t.ua, 200 === t.code && t.version > h && swal({
                        title: "发现新版本",
                        text: t.changelog,
                        buttons: {confirm: {text: "更新", value: "confirm"}}
                    }).then(function (e) {
                        "confirm" === e && (location.href = t.updateURL);
                    }), t.scode != GM_getValue("scode") ? swal({
                        title: "初次使用请输入暗号",
                        content: $('<div><img style="width: 200px;margin-bottom: 10px;" src="https://cdn.baiduyun.wiki/scode.png"><input class="swal-content__input" id="scode" type="text" placeholder="请输入暗号，可扫描上方二维码免费获取!"></div>')[0],
                        closeOnClickOutside: !1,
                        button: {text: "确定", closeModal: !1}
                    }).then(function () {
                        t.scode == $("#scode").val() ? (GM_setValue("scode", t.scode), GM_setValue("init", 1), swal({
                            text: "暗号正确，正在初始化。。。",
                            icon: "success"
                        }), setTimeout(function () {
                            history.go(0);
                        }, 1e3)) : (GM_setValue("init", 0), swal({
                            title: "🔺🔺🔺",
                            text: "暗号不正确，请通过微信扫码免费获取",
                            icon: "https://cdn.baiduyun.wiki/scode.png"
                        }));
                    }) : e(), t.f && GM_setValue("SETTING_A", !0);
                }
            });
        }

        function n() {
            setTimeout(function () {
                var t = $("." + f.header),
                    e = $('<span class="cMEMEF" node-type="help-author" style="opacity: .5" ><a href="https://www.baiduyun.wiki/" >教程</a><i class="find-light-icon" style="display: inline;background-color: #009fe8;"></i></span>');
                t.append(e);
            }, 8e3);
        }

        function s() {
            switch (l()) {
                case"disk":
                    return GM_getValue("current_version") < GM_getValue("lastest_version") && $(".aside-absolute-container").append($('<img class="V6d3Fg" src="https://cdn.baiduyun.wiki/bd.png?t=' + Math.random() + '" style="margin: 0 auto; position: absolute; left: 0; right: 0; bottom: 100px;cursor: pointer;max-width: 190px">')), void $(document).on("click", ".V6d3Fg", function () {
                        GM_openInTab("http://pan.baiduyun.wiki/home", {active: !0});
                    });
                case"share":
                case"s":
                    var t = void 0, e = void 0;
                    return $(".bd-aside").length > 0 ? (t = $(".bd-aside"), e = $('<img class="K5a8Tu" src="https://cdn.baiduyun.wiki/bds.png?t=' + Math.random() + '" style="cursor:pointer;margin: 0 auto; position: absolute; left: 0; right: 0; bottom: 100px;max-width: 215px">')) : (t = $("#layoutAside"), e = $('<img class="K5a8Tu" src="https://cdn.baiduyun.wiki/bds.png?t=' + Math.random() + '" style="cursor:pointer;margin: 10px 0;max-width: 215px">')), t.append(e), void $(document).on("click", ".K5a8Tu", function () {
                        GM_openInTab("http://pan.baiduyun.wiki/share", {active: !0});
                    });
                default:
                    return;
            }
        }

        function d() {
            GM_registerMenuCommand("网盘脚本配置", function () {
                void 0 === GM_getValue("SETTING_A") && GM_setValue("SETTING_A", !0), void 0 === GM_getValue("SETTING_P") && GM_setValue("SETTING_P", !1), void 0 === GM_getValue("SETTING_H") && GM_setValue("SETTING_H", !0);
                var t = "";
                GM_getValue("SETTING_P") ? t += '<label style="display:flex;align-items: center;justify-content: space-between;padding-top: 20px;">自动填写提取码(#后面)<input type="checkbox" id="S-P" checked style="width: 16px;height: 16px;"></label>' : t += '<label style="display:flex;align-items: center;justify-content: space-between;padding-top: 20px;">自动填写提取码(#后面)<input type="checkbox" id="S-P" style="width: 16px;height: 16px;"></label>', GM_getValue("SETTING_H") ? t += '<label style="display:flex;align-items: center;justify-content: space-between;padding-top: 20px;">开启教程<input type="checkbox" id="S-H" checked style="width: 16px;height: 16px;"></label>' : t += '<label style="display:flex;align-items: center;justify-content: space-between;padding-top: 20px;">开启教程<input type="checkbox" id="S-H" style="width: 16px;height: 16px;"></label>', GM_getValue("SETTING_A") ? t += '<label style="display:flex;align-items: center;justify-content: space-between;padding-top: 20px;">开启广告(支持作者)<input type="checkbox" id="S-A" checked style="width: 16px;height: 16px;"></label>' : t += '<label style="display:flex;align-items: center;justify-content: space-between;padding-top: 20px;">开启广告(支持作者)<input type="checkbox" id="S-A" style="width: 16px;height: 16px;"></label>', t = "<div>" + t + "</div>";
                var e = $(t);
                swal({content: e[0]});
            }), $(document).on("change", "#S-A", function () {
                GM_setValue("SETTING_A", $(this)[0].checked);
            }), $(document).on("change", "#S-H", function () {
                GM_setValue("SETTING_H", $(this)[0].checked);
            }), $(document).on("change", "#S-P", function () {
                GM_setValue("SETTING_P", $(this)[0].checked);
            });
        }

        function r() {
            f["default-dom"] = $(".icon-upload").parent().parent().parent().parent().parent().attr("class"), f.bar = $(".icon-upload").parent().parent().parent().parent().attr("class");
            var t = document.createElement("script");
            t.type = "text/javascript", t.async = !0, t.src = "https://js.users.51.la/19988117.js", document.getElementsByTagName("head")[0].appendChild(t);
            var e = document.createElement("meta");
            e.httpEquiv = "Content-Security-Policy", e.content = "upgrade-insecure-requests", document.getElementsByTagName("head")[0].appendChild(e), $(document).on("contextmenu", ".aria2c-link", function (t) {
                return t.preventDefault(), !1;
            }), $(document).on("mousedown", ".aria2c-link", function (t) {
                t.preventDefault();
                var e = $(this).text();
                return GM_setClipboard(e, "text"), swal("已将链接复制到剪贴板！请复制到XDown中下载", {timer: 2e3}), !1;
            }), $(document).on("click", ".home-download", function (t) {
            }), $(document).on("click", ".share-download", function (t) {
                t.preventDefault(), t.target.innerText && GM_xmlhttpRequest({
                    method: "POST",
                    headers: {"User-Agent": b},
                    url: t.target.innerText,
                    onload: function (t) {
                    }
                });
            });
        }

        t("RPC：", x), this.init = function () {
            GM_setValue("current_version", h), r(), i(), GM_getValue("SETTING_H") && n(), GM_getValue("SETTING_A") && s(), d();
        };
    }

    var h = "3.0.3", f = {
            list: "zJMtAEb",
            grid: "fyQgAEb",
            "list-grid-switch": "auiaQNyn",
            "list-switched-on": "ewXm1e",
            "grid-switched-on": "kxhkX2Em",
            "list-switch": "rvpXm63",
            "grid-switch": "mxgdJgwv",
            checkbox: "EOGexf",
            "col-item": "Qxyfvg",
            check: "fydGNC",
            checked: "EzubGg",
            "chekbox-grid": "cEefyz",
            "list-view": "vdAfKMb",
            "item-active": "vnKZRK",
            "grid-view": "JKvHJMb",
            "bar-search": "OFaPaO",
            "list-tools": "tcuLAu",
            header: "vyQHNyb"
        }, v = {
            dir: "提示：不支持整个文件夹下载，可进入文件夹内获取文件链接下载",
            unlogin: "提示：登录百度网盘后才能使用此功能哦!!!",
            fail: "提示：获取下载链接失败！请刷新网页后重试！",
            unselected: "提示：请勾选要下载的文件，若已勾选请重新勾选",
            morethan: "提示：多个文件请点击【显示链接】",
            toobig: "提示：只支持300M以下的文件夹，若链接无法下载，请进入文件夹后勾选文件获取！"
        }, g = 250528, m = GM_getValue("secretCode") ? GM_getValue("secretCode") : g,
        w = GM_getValue("savePath") ? GM_getValue("savePath") : "/PanHelper", b = "", y = navigator.userAgent, x = {
            domain: GM_getValue("rpcDomain") ? GM_getValue("rpcDomain") : "http://localhost",
            port: GM_getValue("rpcPort") ? GM_getValue("rpcPort") : 6800,
            token: GM_getValue("rpcToken") ? GM_getValue("rpcToken") : "",
            dir: GM_getValue("rpcDir") ? GM_getValue("rpcDir") : "D:/"
        };
    $(function () {
        (new u).init();
    });
}();
