// ==UserScript==
// @name              百度网盘直链下载助手
// @namespace         https://github.com/syhyz1990/baiduyun
// @version           2.9.5
// @icon              https://www.baiduyun.wiki/48x48.png
// @description       【百度网盘直链下载助手】是一款免客户端获取百度网盘文件真实下载地址的油猴脚本，支持Windows，Mac，Linux，Android等多平台，可使用IDM，XDown等多线程加速工具加速下载，告别下载限速问题。
// @author            syhyz1990
// @license           MIT
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
// @connect           meek.com.cn
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
var _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
  return typeof e;
} : function (e) {
  return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
};
!function () {
  function e(e, t, i) {
    e = e || "", t = t || "", i = i || "", console.group("[百度网盘直链下载助手]"), console.log(e, t, i), console.groupEnd();
  }

  function t(e, t) {
    var i = localStorage.getItem("baiduyunPlugin_BDUSS") ? localStorage.getItem("baiduyunPlugin_BDUSS") : '{"baiduyunPlugin_BDUSS":""}',
        n = JSON.parse(i).BDUSS;
    return n ? 'aria2c "' + e + '" --out "' + t + '" --header "User-Agent: ' + w + '" --header "Cookie: BDUSS=' + n + '"' : (swal({
      title: "提示",
      text: "请先安装【网盘万能助手】",
      buttons: {confirm: {text: "安装", value: "confirm"}}
    }).then(function (e) {
      "confirm" === e && (location.href = "https://www.baiduyun.wiki/zh-cn/assistant.html");
    }), "请先安装网盘万能助手，安装后请重启浏览器！！！");
  }

  function i(e) {
    return e ? e.replace(/&/g, "&amp;") : "";
  }

  function n() {
    function t() {
      W = j(), Z = R(), ee = U(), te = l(), re = V(), "all" == re && (ce = N()), "category" == re && (pe = O()), "search" == re && (he = D()), a(), i(), n();
    }

    function i() {
      "all" == re ? ne = F() : "category" == re ? ne = P() : "search" == re && (ne = z());
    }

    function n() {
      ae = [];
    }

    function a() {
      de = s();
    }

    function s() {
      return $("." + h.list).is(":hidden") ? "grid" : "list";
    }

    function d() {
      c(), p(), g(), b(), x();
    }

    function c() {
      window.addEventListener("hashchange", function (e) {
        a(), "all" == V() ? re == V() ? ce != N() && (ce = N(), i(), n()) : (re = V(), ce = N(), i(), n()) : "category" == V() ? re == V() ? pe != O() && (re = V(), pe = O(), i(), n()) : (re = V(), pe = O(), i(), n()) : "search" == V() && (re == V() ? he != D() && (re = V(), he = D(), i(), n()) : (re = V(), he = D(), i(), n()));
      });
    }

    function p() {
      $("a[data-type=list]").click(function () {
        de = "list";
      }), $("a[data-type=grid]").click(function () {
        de = "grid";
      });
    }

    function g() {
      var t = $("span." + h.checkbox);
      "grid" == de && (t = $("." + h["chekbox-grid"])), t.each(function (t, i) {
        $(i).on("click", function (t) {
          var i = $(this).parent(), n = void 0, a = void 0;
          if ("list" == de ? (n = $("div.file-name div.text a", i).attr("title"), a = i.hasClass(h["item-active"])) : "grid" == de && (n = $("div.file-name a", $(this)).attr("title"), a = !$(this).hasClass(h["item-active"])), a) {
            e("取消选中文件：" + n);
            for (var o = 0; o < ae.length; o++) ae[o].filename == n && ae.splice(o, 1);
          } else e("选中文件:" + n), $.each(ne, function (e, t) {
            if (t.server_filename == n) {
              var i = {filename: t.server_filename, path: t.path, fs_id: t.fs_id, isdir: t.isdir};
              ae.push(i);
            }
          });
        });
      });
    }

    function m() {
      $("span." + h.checkbox).each(function (e, t) {
        $(t).unbind("click");
      });
    }

    function b() {
      $("div." + h["col-item"] + "." + h.check).each(function (t, i) {
        $(i).bind("click", function (t) {
          $(this).parent().hasClass(h.checked) ? (e("取消全选"), ae = []) : (e("全部选中"), ae = [], $.each(ne, function (e, t) {
            var i = {filename: t.server_filename, path: t.path, fs_id: t.fs_id, isdir: t.isdir};
            ae.push(i);
          }));
        });
      });
    }

    function y() {
      $("div." + h["col-item"] + "." + h.check).each(function (e, t) {
        $(t).unbind("click");
      });
    }

    function x() {
      $("div." + h["list-view"] + " dd").each(function (t, i) {
        $(i).bind("click", function (t) {
          var i = t.target.nodeName.toLowerCase();
          if ("span" != i && "a" != i && "em" != i) if (e("shiftKey:" + t.shiftKey), t.shiftKey) {
            ae = [];
            var n = $("div." + h["list-view"] + " dd." + h["item-active"]);
            $.each(n, function (t, i) {
              var n = $("div.file-name div.text a", $(i)).attr("title");
              e("选中文件：" + n), $.each(ne, function (e, t) {
                if (t.server_filename == n) {
                  var i = {filename: t.server_filename, path: t.path, fs_id: t.fs_id, isdir: t.isdir};
                  ae.push(i);
                }
              });
            });
          } else {
            ae = [];
            var a = $("div.file-name div.text a", $(this)).attr("title");
            e("选中文件：" + a), $.each(ne, function (e, t) {
              if (t.server_filename == a) {
                var i = {filename: t.server_filename, path: t.path, fs_id: t.fs_id, isdir: t.isdir};
                ae.push(i);
              }
            });
          }
        });
      });
    }

    function k() {
      $("div." + h["list-view"] + " dd").each(function (e, t) {
        $(t).unbind("click");
      });
    }

    function _() {
      var e = window.MutationObserver, t = {childList: !0};
      le = new e(function (e) {
        m(), y(), k(), g(), b(), x();
      });
      var i = document.querySelector("." + h["list-view"]), n = document.querySelector("." + h["grid-view"]);
      le.observe(i, t), le.observe(n, t);
    }

    function S() {
      $("div." + h["bar-search"]).css("width", "18%");
      var e = $('<span class="g-dropdown-button"></span>'),
          t = $('<a class="g-button g-button-blue" href="javascript:;"><span class="g-button-right"><em class="icon icon-speed" title="百度网盘下载助手"></em><span class="text" style="width: 60px;">下载助手</span></span></a>'),
          i = $('<span class="menu" style="width:114px"></span>'),
          n = $('<span class="g-button-menu" style="display:block"></span>'),
          a = $('<span class="g-dropdown-button g-dropdown-button-second" menulevel="2"></span>'),
          o = $('<a class="g-button" href="javascript:;"><span class="g-button-right"><span class="text" style="width:auto">直链下载</span></span></a>'),
          s = $('<span class="menu" style="width:120px;left:79px"></span>'),
          d = $('<a id="batchhttplink-direct" class="g-button-menu" href="javascript:;">显示链接</a>');
      s.append(d), n.append(a.append(o).append(s)), n.hover(function () {
        a.toggleClass("button-open");
      }), d.click(T);
      var l = $('<span class="g-button-menu" style="display:block"></span>'),
          r = $('<span class="g-dropdown-button g-dropdown-button-second" menulevel="2"></span>'),
          c = $('<a class="g-button" href="javascript:;"><span class="g-button-right"><span class="text" style="width:auto">aria直链下载</span></span></a>'),
          p = $('<span class="menu" style="width:120px;left:79px"></span>'),
          u = $('<a id="batchhttplink-aria" class="g-button-menu" href="javascript:;">显示链接</a>');
      p.append(u), l.append(r.append(c).append(p)), l.hover(function () {
        r.toggleClass("button-open");
      }), u.click(T);
      var f = $('<span class="g-button-menu" style="display:block"></span>'),
          v = $('<span class="g-dropdown-button g-dropdown-button-second" menulevel="2"></span>'),
          g = $('<a class="g-button" href="javascript:;"><span class="g-button-right"><span class="text" style="width:auto">API下载</span></span></a>'),
          w = $('<span class="menu" style="width:120px;left:77px"></span>'),
          m = $('<a id="download-api" class="g-button-menu" href="javascript:;">直接下载</a>'),
          b = $('<a id="batchhttplink-api" class="g-button-menu" href="javascript:;">显示链接</a>'),
          y = $('<a id="appid-setting" class="g-button-menu" href="javascript:;">脚本配置</a>');
      w.append(m).append(b).append(y), f.append(v.append(g).append(w)), f.hover(function () {
        v.toggleClass("button-open");
      }), m.click(G), b.click(T), y.click(A);
      var x = $('<span class="g-button-menu" style="display:block"></span>'),
          k = $('<span class="g-dropdown-button g-dropdown-button-second" menulevel="2"></span>'),
          _ = $('<a class="g-button" href="javascript:;"><span class="g-button-right"><span class="text" style="width:auto">aria外链下载</span></span></a>'),
          S = $('<span class="menu" style="width:120px;left:79px"></span>'),
          M = $('<a id="batchlink-outerlink" class="g-button-menu" href="javascript:;">显示链接</a>');
      S.append(M), x.append(k.append(_).append(S)), x.hover(function () {
        k.toggleClass("button-open");
      }), M.click(T);
      var E = $('<span class="g-button-menu" style="display:block;cursor: pointer">分享文件</span>');
      E.click(H), i.append(f).append(n).append(l).append(E), e.append(t).append(i), e.hover(function () {
        e.toggleClass("button-open");
      }), $("." + h["list-tools"]).append(e), $("." + h["list-tools"]).css("height", "40px");
    }

    function A() {
      var e = prompt("请输入神秘代码 , 不懂请勿输入 , 否则后果自负", v);
      /^\d{1,6}$/.test(e) && (GM_setValue("secretCode", e), swal("神秘代码执行成功 , 点击确定将自动刷新"), history.go(0));
    }

    function G(t) {
      e("选中文件列表：", ae);
      var i = t.target.id, n = void 0;
      if ("download-direct" == i) {
        var a = void 0;
        if (0 === ae.length) return void swal(f.unselected);
        1 == ae.length && (a = 1 === ae[0].isdir ? "batch" : "dlink"), ae.length > 1 && (a = "batch"), ie = L(ae);
        var o = K(a);
        if (0 !== o.errno) return -1 == o.errno ? void swal("文件不存在或已被百度和谐，无法下载！") : 112 == o.errno ? void swal("页面过期，请刷新重试！") : void swal("发生错误！");
        if ("dlink" == a) n = o.dlink[0].dlink; else {
          if ("batch" != a) return void swal("发生错误！");
          n = o.dlink, 1 === ae.length && (n = n + "&zipname=" + encodeURIComponent(ae[0].filename) + ".zip");
        }
      } else {
        if (0 === ae.length) return void swal(f.unselected);
        if (ae.length > 1) return void swal(f.morethan);
        if (1 == ae[0].isdir) return void swal(f.dir);
        "download-api" == i && (n = J(ae[0].path));
      }
      X(n);
    }

    function T(t) {
      if (e("选中文件列表：", ae), 0 === ae.length) return void swal(f.unselected);
      var i = t.target.id, n = void 0, a = void 0;
      if (n = -1 == i.indexOf("https") ? -1 == i.indexOf("http") ? location.protocol + ":" : "http:" : "https:", oe = [], se = [], -1 != i.indexOf("direct")) {
        oe = M(n);
        if (0 === oe.length) return void swal("没有链接可以显示，不要选中文件夹！");
        ue.open({
          title: "直链下载",
          type: "batch",
          list: oe,
          tip: '点击链接直接下载，请先升级 <a href="https://www.baiduyun.wiki/zh-cn/assistant.html">[网盘万能助手]</a> 至 <b>v2.2.0</b>，本链接仅支持小文件下载（<300M）',
          showcopy: !1
        });
      }
      if (-1 != i.indexOf("aria")) {
        if (oe = E(n), a = '请先安装 <a  href="https://www.baiduyun.wiki/zh-cn/assistant.html">网盘万能助手</a> 请将链接复制到支持Aria的下载器中, 推荐使用 <a href="http://pan.baiduyun.wiki/down">XDown</a>', 0 === oe.length) return void swal("没有链接可以显示，不要选中文件夹！");
        ue.open({title: "Aria链接", type: "batchAria", list: oe, tip: a, showcopy: !0});
      } else if (-1 != i.indexOf("api")) {
        if (oe = E(n), a = '请先安装 <a href="https://www.baiduyun.wiki/zh-cn/assistant.html">网盘万能助手</a> <b>v2.2.0</b> 后点击链接下载 <a href="https://www.baiduyun.wiki">无效？</a>', 0 === oe.length) return void swal("没有链接可以显示，API链接不要全部选中文件夹！");
        ue.open({title: "API下载链接", type: "batch", list: oe, tip: a});
      } else -1 != i.indexOf("outerlink") && C(function (e) {
        if (oe = I(e), 0 === oe.length) return void swal("没有链接可以显示，API链接不要全部选中文件夹！");
        ue.open({
          title: "下载链接（仅显示文件链接）",
          type: "batchAria",
          list: oe,
          alllist: e,
          tip: '请先安装 <a  href="https://www.baiduyun.wiki/zh-cn/assistant.html">网盘万能助手</a> 请将链接复制到支持Aria的下载器中, 推荐使用 <a href="http://pan.baiduyun.wiki/down">XDown</a>',
          showcopy: !0,
          showall: !0
        });
      });
    }

    function M(e) {
      var t = [];
      return $.each(ae, function (i, n) {
        var a = void 0, o = void 0, s = void 0;
        a = 0 == n.isdir ? "dlink" : "batch", ie = L([n]), s = K(a), 0 == s.errno ? ("dlink" == a ? o = s.dlink[0].dlink : "batch" == a && (o = s.dlink), o = o.replace(/^([A-Za-z]+):/, e)) : o = "error", t.push({
          filename: n.filename,
          downloadlink: o
        });
      }), t;
    }

    function E(e) {
      var t = [];
      return $.each(ae, function (i, n) {
        if (1 != n.isdir) {
          var a = void 0;
          a = J(n.path), a = a.replace(/^([A-Za-z]+):/, e), t.push({filename: n.filename, downloadlink: a});
        }
      }), t;
    }

    function C(e) {
      $.each(ae, function (t, i) {
        1 != i.isdir && q(i.path, function (t) {
          var n = [];
          0 == t.errno ? n.push({filename: i.filename, links: t.urls}) : n.push({
            filename: i.filename,
            links: [{rank: 1, url: "error"}]
          }), e(n);
        });
      });
    }

    function I(e) {
      var t = [];
      return $.each(e, function (e, i) {
        t.push({filename: i.filename, downloadlink: i.links[0].url});
      }), t;
    }

    function j() {
      var e = void 0;
      try {
        e = new Function("return " + Q.sign2)();
      } catch (e) {
        throw new Error(e.message);
      }
      return o(e(Q.sign5, Q.sign1));
    }

    function N() {
      var e = location.hash, t = new RegExp("path=([^&]*)(&|$)", "i"), i = e.match(t);
      return decodeURIComponent(i[1]);
    }

    function O() {
      var e = location.hash, t = new RegExp("type=([^&]*)(&|$)", "i"), i = e.match(t);
      return decodeURIComponent(i[1]);
    }

    function D() {
      var e = location.hash, t = new RegExp("key=([^&]*)(&|$)", "i"), i = e.match(t);
      return decodeURIComponent(i[1]);
    }

    function V() {
      var e = location.hash;
      return e.substring(e.indexOf("#") + 2, e.indexOf("?"));
    }

    function F() {
      var e = [], t = fe + "list", i = N();
      te = l();
      var n = {
        dir: i,
        bdstoken: ee,
        logid: te,
        order: "size",
        num: 1e3,
        desc: 0,
        clienttype: 0,
        showempty: 0,
        web: 1,
        channel: "chunlei",
        appid: v
      };
      return $.ajax({
        url: t, async: !1, method: "GET", data: n, success: function (t) {
          e = 0 === t.errno ? t.list : [];
        }
      }), e;
    }

    function P() {
      var e = [], t = fe + "categorylist", i = O();
      te = l();
      var n = {
        category: i,
        bdstoken: ee,
        logid: te,
        order: "size",
        desc: 0,
        clienttype: 0,
        showempty: 0,
        web: 1,
        channel: "chunlei",
        appid: v
      };
      return $.ajax({
        url: t, async: !1, method: "GET", data: n, success: function (t) {
          e = 0 === t.errno ? t.info : [];
        }
      }), e;
    }

    function z() {
      var e = [], t = fe + "search";
      te = l(), he = D();
      var i = {
        recursion: 1,
        order: "time",
        desc: 1,
        showempty: 0,
        web: 1,
        page: 1,
        num: 100,
        key: he,
        channel: "chunlei",
        app_id: 250528,
        bdstoken: ee,
        logid: te,
        clienttype: 0
      };
      return $.ajax({
        url: t, async: !1, method: "GET", data: i, success: function (t) {
          e = 0 === t.errno ? t.list : [];
        }
      }), e;
    }

    function L(e) {
      if (0 === e.length) return null;
      var t = [];
      return $.each(e, function (e, i) {
        t.push(i.fs_id);
      }), "[" + t + "]";
    }

    function R() {
      return Q.timestamp;
    }

    function U() {
      return Q.MYBDSTOKEN;
    }

    function H() {
      var e = [];
      if (0 === ae.length) return void swal(f.unselected);
      $.each(ae, function (t, i) {
        e.push(i.path);
      });
      var t = "https://pan.baidu.com/share/set?channel=chunlei&clienttype=0&web=1&channel=chunlei&web=1&app_id=250528&bdstoken=" + ee + "&logid=" + te + "&clienttype=0",
          i = B(), n = {schannel: 4, channel_list: JSON.stringify([]), period: 7, pwd: i, fid_list: L(ae)};
      $.ajax({
        url: t, async: !1, method: "POST", data: n, success: function (e) {
          0 === e.errno && swal({
            title: "分享链接",
            text: e.link + " 提取码：" + i,
            buttons: {open: {text: "打开", value: "open"}}
          }).then(function (t) {
            "open" === t && GM_openInTab(e.link, {active: !0});
          });
        }
      });
    }

    function B() {
      function e(e, t) {
        return Math.round(Math.random() * (e - t) + t);
      }

      for (var t = "", i = 0; i < 4; i++) {
        t = t + e(0, 9) + String.fromCharCode(e(97, 122)) + String.fromCharCode(e(65, 90));
      }
      for (var n = "", i = 0; i < 4; i++) n += t[e(0, t.length - 1)];
      return n;
    }

    function K(e) {
      var t = void 0;
      te = l();
      var i = {bdstoken: ee, logid: te}, n = {sign: W, timestamp: Z, fidlist: ie, type: e},
          a = "https://pan.baidu.com/api/download?bdstoken=" + i.bdstoken + "&web=5&app_id=250528&logid=" + i.logid + "=&channel=chunlei&clienttype=1";
      return $.ajax({
        url: a, async: !1, method: "POST", data: n, success: function (e) {
          t = e;
        }
      }), t;
    }

    function J(e) {
      return ve + "file?method=download&path=" + encodeURIComponent(e) + "&app_id=" + v;
    }

    function q(e, t) {
      var i = void 0, n = ge + "file?method=locatedownload&app_id=" + v + "&ver=4.0&path=" + encodeURIComponent(e);
      GM_xmlhttpRequest({
        method: "POST", url: n, headers: {"User-Agent": w}, onload: function (e) {
          200 === e.status ? (i = JSON.parse(e.responseText), void 0 == i.error_code ? void 0 == i.urls ? i.errno = 2 : ($.each(i.urls, function (e, t) {
            i.urls[e].url = t.url.replace("\\", "");
          }), i.errno = 0) : 31066 == i.error_code ? i.errno = 1 : i.errno = -1) : (i = {}, i.errno = -1), t(i);
        }
      });
    }

    function X(t) {
      e("下载链接：" + t), $("#helperdownloadiframe").attr("src", t);
    }

    function Y() {
      var e = $('<div class="helper-hide" style="padding:0;margin:0;display:block"></div>'),
          t = $('<iframe src="javascript:;" id="helperdownloadiframe" style="display:none"></iframe>');
      e.append(t), $("body").append(e);
    }

    var Q = void 0, W = void 0, Z = void 0, ee = void 0, te = void 0, ie = void 0, ne = [], ae = [], oe = [], se = [],
        de = "list", le = void 0, re = void 0, ce = void 0, pe = void 0, ue = void 0, he = void 0,
        fe = location.protocol + "//" + location.host + "/api/",
        ve = location.protocol + "//pcs.baidu.com/rest/2.0/pcs/",
        ge = location.protocol + "//d.pcs.baidu.com/rest/2.0/pcs/";
    this.init = function () {
      if (Q = unsafeWindow.yunData, e("初始化信息:", Q), void 0 === Q) return void e("页面未正常加载，或者百度已经更新！");
      t(), d(), _(), S(), Y(), ue = new r({addCopy: !0}), e("下载助手加载成功！当前版本：", u);
    };
  }

  function a() {
    function t() {
      if (ce = i(), q = J.SIGN, X = J.TIMESTAMP, Y = J.MYBDSTOKEN, Q = "chunlei", W = 0, Z = 1, ee = v, te = l(), ie = 0, ne = "share", oe = J.SHARE_ID, ae = J.SHARE_UK, "secret" == ce && (de = o()), n()) {
        var e = {};
        2 == J.CATEGORY ? (e.filename = J.FILENAME, e.path = J.PATH, e.fs_id = J.FS_ID, e.isdir = 0) : void 0 != J.FILEINFO && (e.filename = J.FILEINFO[0].server_filename, e.path = J.FILEINFO[0].path, e.fs_id = J.FILEINFO[0].fs_id, e.isdir = J.FILEINFO[0].isdir), me.push(e);
      } else le = J.SHARE_ID, ue = s(), he = p(), we = V();
    }

    function i() {
      return 1 === J.SHARE_PUBLIC ? "public" : "secret";
    }

    function n() {
      return void 0 === J.getContext;
    }

    function a() {
      return 1 == J.MYSELF;
    }

    function o() {
      return '{"sekey":"' + decodeURIComponent(d("BDCLND")) + '"}';
    }

    function s() {
      var e = location.hash, t = new RegExp("path=([^&]*)(&|$)", "i"), i = e.match(t);
      return decodeURIComponent(i[1]);
    }

    function p() {
      var e = "list";
      return $(".list-switched-on").length > 0 ? e = "list" : $(".grid-switched-on").length > 0 && (e = "grid"), e;
    }

    function w() {
      n() ? ($("div.slide-show-right").css("width", "500px"), $("div.frame-main").css("width", "96%"), $("div.share-file-viewer").css("width", "740px").css("margin-left", "auto").css("margin-right", "auto")) : $("div.slide-show-right").css("width", "500px");
      var e = $('<span class="g-dropdown-button"></span>'),
          t = $('<a class="g-button g-button-blue" style="width: 114px;" data-button-id="b200" data-button-index="200" href="javascript:;"></a>'),
          i = $('<span class="g-button-right"><em class="icon icon-speed" title="百度网盘下载助手"></em><span class="text" style="width: 60px;">下载助手</span></span>'),
          a = $('<span class="menu" style="width:auto;z-index:41"></span>'),
          o = $('<a data-menu-id="b-menu207" class="g-button-menu" href="javascript:;">保存到网盘</a>'),
          s = $('<a data-menu-id="b-menu207" class="g-button-menu" href="javascript:;" style="opacity: 0.8;">自定义保存路径</a>'),
          d = $('<a data-menu-id="b-menu207" class="g-button-menu" href="javascript:;">直接下载</a>'),
          l = $('<a data-menu-id="b-menu208" class="g-button-menu" href="javascript:;">显示直链</a>'),
          r = $('<a data-menu-id="b-menu208" class="g-button-menu" href="javascript:;">显示aria链接</a>'),
          c = $('<a data-menu-id="b-menu209" style="color: #c7c7c7" class="g-button-menu" href="javascript:;">异常反馈</a>'),
          p = $('<iframe src="https://ghbtns.com/github-btn.html?user=syhyz1990&repo=baiduyun&type=star&count=true" frameborder="0" scrolling="0" style="height: 20px;max-width: 120px;padding: 0 5px;box-sizing: border-box;margin-top: 5px;"></iframe>');
      a.append(d).append(l).append(r).append(o).append(c).append(p), t.append(i), e.append(t).append(a), e.hover(function () {
        e.toggleClass("button-open");
      }), o.click(y), s.click(x), d.click(F), l.click(U), r.click(k), c.click(b), $("div.module-share-top-bar div.bar div.x-button-box").append(e);
    }

    function m() {
      var e = {shareid: le, from: J.SHARE_UK, bdstoken: J.MYBDSTOKEN, logid: l()},
          t = {path: g, isdir: 1, size: "", block_list: [], method: "post", dataType: "json"},
          i = "https://pan.baidu.com/api/create?a=commit&channel=chunlei&app_id=250528&web=1&app_id=250528&bdstoken=" + e.bdstoken + "&logid=" + e.logid + "&clienttype=0";
      $.ajax({
        url: i, async: !1, method: "POST", data: t, success: function (e) {
          0 === e.errno ? (swal("目录创建成功！"), y()) : swal("目录创建失败，请前往我的网盘页面手动创建！");
        }
      });
    }

    function b() {
      GM_openInTab("https://www.baiduyun.wiki", {active: !0});
    }

    function y() {
      if (null === Y) return swal(f.unlogin), !1;
      if (0 === me.length) return void swal(f.unselected);
      if (a()) return void swal({
        title: "提示",
        text: "自己分享的文件请到网盘中下载！",
        buttons: {confirm: {text: "打开网盘", value: "confirm"}}
      }).then(function (e) {
        "confirm" === e && (location.href = "https://pan.baidu.com/disk/home#/all?path=%2F&vmode=list");
      });
      var e = [];
      $.each(me, function (t, i) {
        e.push(i.fs_id);
      });
      var t = {shareid: J.SHARE_ID, from: J.SHARE_UK, bdstoken: J.MYBDSTOKEN, logid: l()},
          i = {path: GM_getValue("savePath"), fsidlist: JSON.stringify(e)},
          n = "https://pan.baidu.com/share/transfer?shareid=" + t.shareid + "&from=" + t.from + "&ondup=newcopy&async=1&channel=chunlei&web=1&app_id=250528&bdstoken=" + t.bdstoken + "&logid=" + t.logid + "&clienttype=0";
      $.ajax({
        url: n, async: !1, method: "POST", data: i, success: function (e) {
          0 === e.errno ? swal({
            title: "提示",
            text: "文件已保存至我的网盘，请再网盘中使用下载助手下载！",
            buttons: {confirm: {text: "打开网盘", value: "confirm"}}
          }).then(function (e) {
            "confirm" === e && (location.href = "https://pan.baidu.com/disk/home#/all?vmode=list&path=" + encodeURIComponent(g));
          }) : 2 === e.errno ? swal({
            title: "提示",
            text: "保存目录不存在，是否先创建该目录？",
            buttons: {confirm: {text: "创建目录", value: "confirm"}}
          }).then(function (e) {
            "confirm" === e && m();
          }) : swal("保存失败，请手动保存");
        }
      });
    }

    function x() {
      var e = prompt("请输入保存路径，例如/PanHelper", g);
      null !== e && (/^\//.test(e) ? (GM_setValue("savePath", e), swal({
        title: "提示",
        text: "路径设置成功！点击确定后立即生效",
        buttons: {confirm: {text: "确定", value: "confirm"}}
      }).then(function (e) {
        "confirm" === e && history.go(0);
      })) : swal("请输入正确的路径，例如/PanHelper"));
    }

    function k() {
      return null === Y ? (swal(f.unlogin), !1) : (e("选中文件列表：", me), 0 === me.length ? (swal(f.unselected), !1) : 1 == me[0].isdir ? (swal(f.toobig), !1) : (pe = "ariclink", void H(function (e) {
        if (void 0 !== e) if (-20 == e.errno) {
          if (!(re = P()) || 0 !== re.errno) return swal("获取验证码失败！"), !1;
          ge.open(re);
        } else {
          if (112 == e.errno) return swal("页面过期，请刷新重试"), !1;
          if (0 === e.errno) {
            ve.open({
              title: "下载链接（仅显示文件链接）",
              type: "shareAriaLink",
              list: e.list,
              tip: '请先安装 <a  href="https://www.baiduyun.wiki/zh-cn/assistant.html">网盘万能助手</a> 请将链接复制到支持Aria的下载器中, 推荐使用 <a  href="http://pan.baiduyun.wiki/down">XDown</a>',
              showcopy: !0
            });
          } else swal(f.fail);
        }
      })));
    }

    function _() {
      var e = $('<div class="helper-hide" style="padding:0;margin:0;display:block"></div>'),
          t = $('<iframe src="javascript:;" id="helperdownloadiframe" style="display:none"></iframe>');
      e.append(t), $("body").append(e);
    }

    function S() {
      A(), M(), E(), I(), N();
    }

    function A() {
      window.addEventListener("hashchange", function (e) {
        he = p(), ue == s() || (ue = s(), G(), T());
      });
    }

    function G() {
      we = V();
    }

    function T() {
      me = [];
    }

    function M() {
      p();
    }

    function E() {
      he = p();
      var t = $("span." + h.checkbox);
      "grid" == he && (t = $("." + h["chekbox-grid"])), t.each(function (t, i) {
        $(i).on("click", function (t) {
          var i = $(this).parent(), n = void 0, a = void 0;
          if ("list" == he ? (n = $(".file-name div.text a", i).attr("title"), a = $(this).parents("dd").hasClass("JS-item-active")) : "grid" == he && (n = $("div.file-name a", i).attr("title"), a = !$(this).hasClass("JS-item-active")), a) {
            e("取消选中文件：" + n);
            for (var o = 0; o < me.length; o++) me[o].filename == n && me.splice(o, 1);
          } else e("选中文件: " + n), $.each(we, function (e, t) {
            if (t.server_filename == n) {
              var i = {filename: t.server_filename, path: t.path, fs_id: t.fs_id, isdir: t.isdir};
              me.push(i);
            }
          });
        });
      });
    }

    function C() {
      $("span." + h.checkbox).each(function (e, t) {
        $(t).unbind("click");
      });
    }

    function I() {
      $("div." + h["col-item"] + "." + h.check).each(function (t, i) {
        $(i).bind("click", function (t) {
          $(this).parent().hasClass(h.checked) ? (e("取消全选"), me = []) : (e("全部选中"), me = [], $.each(we, function (e, t) {
            var i = {filename: t.server_filename, path: t.path, fs_id: t.fs_id, isdir: t.isdir};
            me.push(i);
          }));
        });
      });
    }

    function j() {
      $("div." + h["col-item"] + "." + h.check).each(function (e, t) {
        $(t).unbind("click");
      });
    }

    function N() {
      $("div." + h["list-view"] + " dd").each(function (t, i) {
        $(i).bind("click", function (t) {
          var i = t.target.nodeName.toLowerCase();
          if ("span" != i && "a" != i && "em" != i) {
            me = [];
            var n = $("div.file-name div.text a", $(this)).attr("title");
            e("选中文件：" + n), $.each(we, function (e, t) {
              if (t.server_filename == n) {
                var i = {filename: t.server_filename, path: t.path, fs_id: t.fs_id, isdir: t.isdir};
                me.push(i);
              }
            });
          }
        });
      });
    }

    function O() {
      $("div." + h["list-view"] + " dd").each(function (e, t) {
        $(t).unbind("click");
      });
    }

    function D() {
      var e = window.MutationObserver, t = {childList: !0};
      fe = new e(function (e) {
        C(), j(), O(), E(), I(), N();
      });
      var i = document.querySelector("." + h["list-view"]), n = document.querySelector("." + h["grid-view"]);
      fe.observe(i, t), fe.observe(n, t);
    }

    function V() {
      var e = [];
      if ("/" == s()) e = J.FILEINFO; else {
        te = l();
        var t = {
          uk: ae,
          shareid: le,
          order: "other",
          desc: 1,
          showempty: 0,
          web: Z,
          dir: s(),
          t: Math.random(),
          bdstoken: Y,
          channel: Q,
          clienttype: W,
          app_id: ee,
          logid: te
        };
        $.ajax({
          url: ye, method: "GET", async: !1, data: t, success: function (t) {
            0 === t.errno && (e = t.list);
          }
        });
      }
      return e;
    }

    function F() {
      return null === Y ? (swal(f.unlogin), !1) : (e("选中文件列表：", me), 0 === me.length ? (swal(f.unselected), !1) : me.length > 1 ? (swal(f.morethan), !1) : 1 == me[0].isdir ? (swal(f.dir), !1) : (pe = "download", void H(function (e) {
        if (void 0 !== e) if (-20 == e.errno) {
          if (re = P(), 0 !== re.errno) return void swal("获取验证码失败！");
          ge.open(re);
        } else if (112 == e.errno) swal("页面过期，请刷新重试"); else if (0 === e.errno) {
          var t = e.list[0].dlink;
          K(t);
        } else swal(f.fail);
      })));
    }

    function P() {
      var e = be + "getvcode", t = void 0;
      te = l();
      var i = {prod: "pan", t: Math.random(), bdstoken: Y, channel: Q, clienttype: W, web: Z, app_id: ee, logid: te};
      return $.ajax({
        url: e, method: "GET", async: !1, data: i, success: function (e) {
          t = e;
        }
      }), t;
    }

    function z() {
      re = P(), $("#dialog-img").attr("src", re.img);
    }

    function L() {
      var e = $("#dialog-input").val();
      return 0 === e.length ? void $("#dialog-err").text("请输入验证码") : e.length < 4 ? void $("#dialog-err").text("验证码输入错误，请重新输入") : void B(e, function (e) {
        if (-20 == e.errno) {
          if (ge.close(), $("#dialog-err").text("验证码输入错误，请重新输入"), z(), !re || 0 !== re.errno) return void swal("获取验证码失败！");
          ge.open();
        } else if (0 === e.errno) {
          if (ge.close(), "download" == pe) {
            if (e.list.length > 1 || 1 == e.list[0].isdir) return swal(f.morethan), !1;
            var t = e.list[0].dlink;
            K(t);
          } else if ("link" == pe) {
            ve.open({
              title: "下载链接（仅显示文件链接）",
              type: "shareLink",
              list: e.list,
              tip: '点击链接直接下载，请先升级 <a href="https://www.baiduyun.wiki/zh-cn/assistant.html">[网盘万能助手]</a> 至 <b>v2.2.0</b>',
              showcopy: !1
            });
          } else if ("ariclink" == pe) {
            ve.open({
              title: "下载链接（仅显示文件链接）",
              type: "shareAriaLink",
              list: e.list,
              tip: '请先安装 <a  href="https://www.baiduyun.wiki/zh-cn/assistant.html">网盘万能助手</a> 请将链接复制到支持Aria的下载器中, 推荐使用 <a  href="http://pan.baiduyun.wiki/down">XDown</a>',
              showcopy: !1
            });
          }
        } else swal("发生错误！");
      });
    }

    function R() {
      var e = [];
      return $.each(me, function (t, i) {
        e.push(i.fs_id);
      }), "[" + e + "]";
    }

    function U() {
      return null === Y ? (swal(f.unlogin), !1) : (e("选中文件列表：", me), 0 === me.length ? (swal(f.unselected), !1) : 1 == me[0].isdir ? (swal(f.dir), !1) : (pe = "link", void H(function (e) {
        if (void 0 !== e) if (-20 == e.errno) {
          if (!(re = P()) || 0 !== re.errno) return swal("获取验证码失败！"), !1;
          ge.open(re);
        } else {
          if (112 == e.errno) return swal("页面过期，请刷新重试"), !1;
          if (0 === e.errno) {
            ve.open({
              title: "下载链接（仅显示文件链接）",
              type: "shareLink",
              list: e.list,
              tip: '点击链接直接下载，请先升级 <a href="https://www.baiduyun.wiki/zh-cn/assistant.html">[网盘万能助手]</a> 至 <b>v2.2.0</b>',
              showcopy: !1
            });
          } else swal(f.fail);
        }
      })));
    }

    function H(e) {
      if (null === Y) return swal(f.unlogin), "";
      var t = void 0;
      if (n) {
        se = R(), te = l();
        var i = new FormData;
        i.append("encrypt", ie), i.append("product", ne), i.append("uk", ae), i.append("primaryid", oe), i.append("fid_list", se), "secret" == ce && i.append("extra", de), $.ajax({
          url: "https://api.baiduyun.wiki/download?sign=" + q + "&timestamp=" + X + "&logid=" + te + "&init=" + GM_getValue("init"),
          cache: !1,
          method: "GET",
          async: !1,
          complete: function (e) {
            t = e.responseText;
          }
        }), GM_xmlhttpRequest({
          method: "POST", data: i, url: atob(atob(t)), onload: function (t) {
            e(JSON.parse(t.response));
          }
        });
      }
    }

    function B(e, t) {
      var i = void 0;
      if (n) {
        se = R(), te = l();
        var a = new FormData;
        a.append("encrypt", ie), a.append("product", ne), a.append("uk", ae), a.append("primaryid", oe), a.append("fid_list", se), a.append("vcode_input", e), a.append("vcode_str", re.vcode), "secret" == ce && a.append("extra", de), $.ajax({
          url: "https://api.baiduyun.wiki/download?sign=" + q + "&timestamp=" + X + "&logid=" + te,
          cache: !1,
          method: "GET",
          async: !1,
          complete: function (e) {
            i = e.responseText;
          }
        }), GM_xmlhttpRequest({
          method: "POST", data: a, url: atob(atob(i)), onload: function (e) {
            t(JSON.parse(e.response));
          }
        });
      }
    }

    function K(t) {
      e("下载链接：" + t), $("#helperdownloadiframe").attr("src", t);
    }

    var J = void 0, q = void 0, X = void 0, Y = void 0, Q = void 0, W = void 0, Z = void 0, ee = void 0, te = void 0,
        ie = void 0, ne = void 0, ae = void 0, oe = void 0, se = void 0, de = void 0, le = void 0, re = void 0,
        ce = void 0, pe = void 0, ue = void 0, he = void 0, fe = void 0, ve = void 0, ge = void 0, we = [], me = [],
        be = location.protocol + "//" + location.host + "/api/",
        ye = location.protocol + "//" + location.host + "/share/list";
    this.init = function () {
      if (J = unsafeWindow.yunData, e("初始化信息:", J), void 0 === J) return void e("页面未正常加载，或者百度已经更新！");
      t(), w(), ve = new r({addCopy: !1}), ge = new c(z, L), _(), n() || (S(), D()), e("下载助手加载成功！当前版本：", u);
    };
  }

  function o(e) {
    var t = void 0, i = void 0, n = void 0, a = void 0, o = void 0, s = void 0,
        d = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    for (n = e.length, i = 0, t = ""; n > i;) {
      if (a = 255 & e.charCodeAt(i++), i == n) {
        t += d.charAt(a >> 2), t += d.charAt((3 & a) << 4), t += "==";
        break;
      }
      if (o = e.charCodeAt(i++), i == n) {
        t += d.charAt(a >> 2), t += d.charAt((3 & a) << 4 | (240 & o) >> 4), t += d.charAt((15 & o) << 2), t += "=";
        break;
      }
      s = e.charCodeAt(i++), t += d.charAt(a >> 2), t += d.charAt((3 & a) << 4 | (240 & o) >> 4), t += d.charAt((15 & o) << 2 | (192 & s) >> 6), t += d.charAt(63 & s);
    }
    return t;
  }

  function s() {
    var e = /[\/].+[\/]/g;
    return location.pathname.match(e)[0].replace(/\//g, "");
  }

  function d(e) {
    var t = void 0, i = void 0, n = document, a = decodeURI;
    return n.cookie.length > 0 && -1 != (t = n.cookie.indexOf(e + "=")) ? (t = t + e.length + 1, i = n.cookie.indexOf(";", t), -1 == i && (i = n.cookie.length), a(n.cookie.substring(t, i))) : "";
  }

  function l() {
    function e(e) {
      if (e.length < 2) {
        var t = e.charCodeAt(0);
        return 128 > t ? e : 2048 > t ? l(192 | t >>> 6) + l(128 | 63 & t) : l(224 | t >>> 12 & 15) + l(128 | t >>> 6 & 63) + l(128 | 63 & t);
      }
      var i = 65536 + 1024 * (e.charCodeAt(0) - 55296) + (e.charCodeAt(1) - 56320);
      return l(240 | i >>> 18 & 7) + l(128 | i >>> 12 & 63) + l(128 | i >>> 6 & 63) + l(128 | 63 & i);
    }

    function t(t) {
      return (t + "" + Math.random()).replace(s, e);
    }

    function i(e) {
      var t = [0, 2, 1][e.length % 3],
          i = e.charCodeAt(0) << 16 | (e.length > 1 ? e.charCodeAt(1) : 0) << 8 | (e.length > 2 ? e.charCodeAt(2) : 0);
      return [o.charAt(i >>> 18), o.charAt(i >>> 12 & 63), t >= 2 ? "=" : o.charAt(i >>> 6 & 63), t >= 1 ? "=" : o.charAt(63 & i)].join("");
    }

    function n(e) {
      return e.replace(/[\s\S]{1,3}/g, i);
    }

    function a() {
      return n(t((new Date).getTime()));
    }

    var o = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/~！@#￥%……&",
        s = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g, l = String.fromCharCode;
    return function (e, t) {
      return t ? a(String(e)).replace(/[+\/]/g, function (e) {
        return "+" == e ? "-" : "_";
      }).replace(/=/g, "") : a(String(e));
    }(d("BAIDUID"));
  }

  function r() {
    function e() {
      $("div.dialog-body", o).children().remove(), $("div.dialog-header h3 span.dialog-title", o).text(""), $("div.dialog-tip p", o).text(""), $("div.dialog-button", o).hide(), $("div.dialog-radio input[type=radio][name=showmode][value=multi]", o).prop("checked", !0), $("div.dialog-radio", o).hide(), $("div.dialog-button button#dialog-copy-button", o).hide(), $("div.dialog-button button#dialog-edit-button", o).hide(), $("div.dialog-button button#dialog-exit-button", o).hide(), o.hide(), s.hide();
    }

    var n = [], a = void 0, o = void 0, s = void 0;
    this.open = function (e) {
      if (a = e, n = [], "link" == e.type && (n = e.list.urls, $("div.dialog-header h3 span.dialog-title", o).text(e.title + "：" + e.list.filename), $.each(e.list.urls, function (e, t) {
        t.url = i(t.url);
        var n = $('<div><div style="width:30px;float:left">' + t.rank + ':</div><div style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis"><a href="' + t.url + '">' + t.url + "</a></div></div>");
        $("div.dialog-body", o).append(n);
      })), "batch" != e.type && "batchAria" != e.type || (n = e.list, $("div.dialog-header h3 span.dialog-title", o).text(e.title), e.showall ? $.each(e.list, function (n, a) {
        var s = $('<div class="item-container" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap"></div>'),
            d = $('<div style="width:100px;float:left;overflow:hidden;text-overflow:ellipsis" title="' + a.filename + '">' + a.filename + "</div>"),
            l = $('<div style="width:12px;float:left"><span>：</span></div>'),
            r = $('<div class="item-link" style="float:left;width:618px;"></div>'), c = void 0;
        if ("batchAria" == e.type) {
          var p = t(a.downloadlink, a.filename);
          c = $('<div class="item-first" style="overflow:hidden;text-overflow:ellipsis"><a href="javasctipt:void(0)" class="aria2c-link">' + p + "</a></div>");
        } else c = $('<div class="item-first" style="overflow:hidden;text-overflow:ellipsis"><a href="' + a.downloadlink + '">' + a.downloadlink + "</a></div>");
        r.append(c), $.each(e.alllist[n].links, function (n, o) {
          var s = void 0;
          if (a.downloadlink != o.url) {
            if ("batchAria" == e.type) {
              var d = t(o.url, a.filename);
              s = $('<div class="item-ex" style="display:none;overflow:hidden;text-overflow:ellipsis"><a href="javasctipt:void(0)" class="aria2c-link">' + d + "</a></div>");
            } else o.url = i(o.url), s = $('<div class="item-ex" style="display:none;overflow:hidden;text-overflow:ellipsis"><a href="' + o.url + '">' + o.url + "</a></div>");
            r.append(s);
          }
        });
        var u = $('<div style="width:15px;float:left;cursor:pointer;text-align:center;font-size:16px"><span>+</span></div>');
        s.append(d).append(l).append(r).append(u), u.click(function () {
          var e = $(this).parent();
          e.toggleClass("showall"), e.hasClass("showall") ? ($(this).text("-"), $("div.item-link div.item-ex", e).show()) : ($(this).text("+"), $("div.item-link div.item-ex", e).hide());
        }), $("div.dialog-body", o).append(s);
      }) : $.each(e.list, function (i, n) {
        var a = void 0;
        if ("batchAria" == e.type) {
          var s = t(n.downloadlink, n.filename);
          a = $('<div style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap"><div style="width:100px;float:left;overflow:hidden;text-overflow:ellipsis" title="' + n.filename + '">' + n.filename + '</div><span>：</span><a href="javascript:;" class="aria2c-link">' + s + "</a></div>");
        } else a = $('<div style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap"><div style="width:100px;float:left;overflow:hidden;text-overflow:ellipsis" title="' + n.filename + '">' + n.filename + '</div><span>：</span><a href="' + n.downloadlink + '">' + n.downloadlink + "</a></div>");
        $("div.dialog-body", o).append(a);
      })), "shareLink" == e.type && (n = e.list, $("div.dialog-header h3 span.dialog-title", o).text(e.title), $.each(e.list, function (e, t) {
        if (t.dlink = i(t.dlink), 1 != t.isdir) {
          var n = $('<div style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap"><div style="width:100px;float:left;overflow:hidden;text-overflow:ellipsis" title="' + t.server_filename + '">' + t.server_filename + '</div><span>：</span><a href="' + t.dlink + '">' + t.dlink + "</a></div>");
          $("div.dialog-body", o).append(n);
        }
      })), "shareAriaLink" == e.type && (n = e.list, $("div.dialog-header h3 span.dialog-title", o).text(e.title), $.each(e.list, function (e, i) {
        if (1 != i.isdir) {
          var n = t(i.dlink, i.server_filename),
              a = $('<div style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap"><div style="width:100px;float:left;overflow:hidden;text-overflow:ellipsis" title="' + i.server_filename + '">' + i.server_filename + '</div><span>：</span><a href="javasctipt:void(0)" class="aria2c-link">' + n + "</a></div>");
          $("div.dialog-body", o).append(a);
        }
      })), e.tip && $("div.dialog-tip p", o).html(e.tip), e.showcopy && ($("div.dialog-button", o).show(), $("div.dialog-button button#dialog-copy-button", o).show()), e.showedit) {
        $("div.dialog-button", o).show(), $("div.dialog-button button#dialog-edit-button", o).show();
        var d = $('<textarea name="dialog-textarea" style="display:none;resize:none;width:758px;height:300px;white-space:pre;word-wrap:normal;overflow-x:scroll"></textarea>'),
            l = "";
        "batch" == a.type ? $.each(n, function (e, t) {
          "error" != t.downloadlink && (e == n.length - 1 ? l += t.downloadlink : l += t.downloadlink + "\r\n");
        }) : "link" == a.type && $.each(n, function (e, t) {
          "error" != t.url && (e == n.length - 1 ? l += t.url : l += t.url + "\r\n");
        }), d.val(l), $("div.dialog-body", o).append(d);
      }
      s.show(), o.show();
    }, this.close = function () {
      e();
    }, o = function () {
      var i = document.body.clientWidth, s = i > 800 ? (i - 800) / 2 : 0,
          d = $('<div class="dialog" style="width: 800px; top: 0px; bottom: auto; left: ' + s + 'px; right: auto; display: hidden; visibility: visible; z-index: 52;"></div>'),
          l = $('<div class="dialog-header"><h3><span class="dialog-title" style="display:inline-block;width:740px;white-space:nowrap;overflow-x:hidden;text-overflow:ellipsis"></span></h3></div>'),
          r = $('<div class="dialog-control"><span class="dialog-icon dialog-close">×</span></div>'),
          c = $('<div class="dialog-body" style="max-height:450px;overflow-y:auto;padding:0 20px;"></div>'),
          p = $('<div class="dialog-tip" style="padding-left:20px;background-color:#fff;border-top: 1px solid #c4dbfe;color: #dc373c;"><p></p></div>');
      d.append(l.append(r)).append(c);
      var u = $('<div class="dialog-button" style="display:none"></div>'),
          h = $('<div style="display:table;margin:auto"></div>'),
          f = $('<button id="dialog-copy-button" style="display:none;width: 100px; margin: 5px 0 10px 0; cursor: pointer; background: #cc3235; border: none; height: 30px; color: #fff; border-radius: 3px;">复制全部链接</button>'),
          v = $('<button id="dialog-edit-button" style="display:none">编辑</button>'),
          g = $('<button id="dialog-exit-button" style="display:none">退出</button>');
      return h.append(f).append(v).append(g), u.append(h), d.append(u), f.click(function () {
        var e = "";
        "batch" == a.type ? $.each(n, function (t, i) {
          "error" != i.downloadlink && (t == n.length - 1 ? e += i.downloadlink : e += i.downloadlink + "\r\n");
        }) : "batchAria" == a.type ? $.each(n, function (i, a) {
          "error" != a.downloadlink && (i == n.length - 1 ? e += t(a.downloadlink, a.filename) : e += t(a.downloadlink, a.filename) + "\r\n");
        }) : "shareLink" == a.type ? $.each(n, function (t, i) {
          "error" != i.dlink && (t == n.length - 1 ? e += i.dlink : e += i.dlink + "\r\n");
        }) : "shareAriaLink" == a.type && $.each(n, function (i, a) {
          "error" != a.dlink && (i == n.length - 1 ? e += t(a.dlink, a.server_filename) : e += t(a.dlink, a.server_filename) + "\r\n");
        }), GM_setClipboard(e, "text"), "" != e ? swal("已将链接复制到剪贴板！") : swal("复制失败，请手动复制！");
      }), v.click(function () {
        var e = $("div.dialog-body textarea[name=dialog-textarea]", o);
        $("div.dialog-body div", o).hide(), f.hide(), v.hide(), e.show(), $dialog_radio_div.show(), g.show();
      }), g.click(function () {
        var e = $("div.dialog-body textarea[name=dialog-textarea]", o), t = $("div.dialog-body div", o);
        e.hide(), $dialog_radio_div.hide(), t.show(), g.hide(), f.show(), v.show();
      }), d.append(p), $("body").append(d), r.click(e), d;
    }(), s = function () {
      var e = $('<div class="dialog-shadow" style="position: fixed; left: 0px; top: 0px; z-index: 50; background: rgb(0, 0, 0) none repeat scroll 0% 0%; opacity: 0.5; width: 100%; height: 100%; display: none;"></div>');
      return $("body").append(e), e;
    }();
  }

  function c(e, t) {
    function i() {
      $("#dialog-img", n).attr("src", ""), $("#dialog-err").text(""), n.hide(), a.hide();
    }

    var n = void 0, a = void 0;
    this.open = function (e) {
      e && $("#dialog-img").attr("src", e.img), n.show(), a.show();
    }, this.close = function () {
      i();
    }, n = function () {
      var n = document.body.clientWidth, a = n > 520 ? (n - 520) / 2 : 0,
          o = $('<div class="dialog" id="dialog-vcode" style="width:520px;top:0px;bottom:auto;left:' + a + 'px;right:auto;display:none;visibility:visible;z-index:52"></div>'),
          s = $('<div class="dialog-header"><h3><span class="dialog-header-title"><em class="select-text">提示</em></span></h3></div>'),
          d = $('<div class="dialog-control"><span class="dialog-icon dialog-close icon icon-close"><span class="sicon">x</span></span></div>'),
          l = $('<div class="dialog-body"></div>'), r = $('<div style="text-align:center;padding:22px"></div>'),
          c = $('<div class="download-verify" style="margin-top:10px;padding:0 28px;text-align:left;font-size:12px;"></div>'),
          p = $('<div class="verify-body">请输入验证码：</div>'),
          u = $('<input id="dialog-input" type="text" style="padding:3px;width:85px;height:23px;border:1px solid #c6c6c6;background-color:white;vertical-align:middle;" class="input-code" maxlength="4">'),
          h = $('<img id="dialog-img" class="img-code" style="margin-left:10px;vertical-align:middle;" alt="点击换一张" src="" width="100" height="30">'),
          f = $('<a href="javascript:;" style="text-decoration:underline;" class="underline">换一张</a>'),
          v = $('<div id="dialog-err" style="padding-left:84px;height:18px;color:#d80000" class="verify-error"></div>'),
          g = $('<div class="dialog-footer g-clearfix"></div>'),
          w = $('<a class="g-button g-button-blue" data-button-id="" data-button-index href="javascript:;" style="padding-left:36px"><span class="g-button-right" style="padding-right:36px;"><span class="text" style="width:auto;">确定</span></span></a>'),
          m = $('<a class="g-button" data-button-id="" data-button-index href="javascript:;" style="padding-left: 36px;"><span class="g-button-right" style="padding-right: 36px;"><span class="text" style="width: auto;">取消</span></span></a>');
      return s.append(d), p.append(u).append(h).append(f), c.append(p).append(v), r.append(c), l.append(r), g.append(w).append(m), o.append(s).append(l).append(g), $("body").append(o), d.click(i), h.click(e), f.click(e), u.keypress(function (e) {
        13 == e.which && t();
      }), w.click(t), m.click(i), u.click(function () {
        $("#dialog-err").text("");
      }), o;
    }(), a = $("div.dialog-shadow");
  }

  function p() {
    function e() {
      switch (s()) {
        case"disk":
          return void (new n).init();
        case"share":
        case"s":
          return void (new a).init();
        default:
          return;
      }
    }

    function t() {
      $.ajax({
        url: "https://api.baiduyun.wiki/update?ver=" + u + "&a=" + ~~GM_getValue("SETTING_A"),
        method: "GET",
        success: function (t) {
          GM_setValue("lastest_version", t.version), w = t.ua, 200 === t.code && t.version > u && swal({
            title: "发现新版本",
            text: t.changelog,
            buttons: {confirm: {text: "更新", value: "confirm"}}
          }).then(function (e) {
            "confirm" === e && (location.href = t.updateURL);
          }), t.scode != GM_getValue("scode") ? swal({
            title: "初次使用请输入暗号",
            content: $('<div><img style="width: 200px;" src="https://cdn.baiduyun.wiki/scode.png"><input class="swal-content__input" id="scode" type="text" placeholder="请输入暗号，可扫描上方二维码免费获取!"></div>')[0],
            closeOnClickOutside: !1,
            button: {text: "确定", closeModal: !1}
          }).then(function () {
            t.scode == $("#scode").val() ? (GM_setValue("scode", t.scode), GM_setValue("init", 1), swal({
              text: "暗号正确，正在初始化。。。",
              icon: "success"
            }), setTimeout(function () {
              history.go(0);
            }, 1200)) : (GM_setValue("init", 0), swal({
              title: "暗号不正确，请扫码获取",
              icon: "https://cdn.baiduyun.wiki/scode.png"
            }));
          }) : e(), t.f && GM_setValue("SETTING_A", !0);
        }
      });
    }

    function i() {
      setTimeout(function () {
        var e = $("." + h.header),
            t = $('<span class="cMEMEF" node-type="help-author" style="opacity: .5" ><a href="https://www.baiduyun.wiki/" >教程</a><i class="find-light-icon" style="display: inline;background-color: #009fe8;"></i></span>');
        e.append(t);
      }, 8e3);
    }

    function o() {
      switch (s()) {
        case"disk":
          return GM_getValue("current_version") < GM_getValue("lastest_version") && $(".aside-absolute-container").append($('<img class="V6d3Fg" src="https://cdn.baiduyun.wiki/bd.png?t=' + Math.random() + '" style="margin: 0 auto; position: absolute; left: 0; right: 0; bottom: 100px;cursor: pointer;max-width: 190px">')), void $(document).on("click", ".V6d3Fg", function () {
            GM_openInTab("http://pan.baiduyun.wiki/home", {active: !0});
          });
        case"share":
        case"s":
          var e = void 0, t = void 0;
          return $(".bd-aside").length > 0 ? (e = $(".bd-aside"), t = $('<img class="K5a8Tu" src="https://cdn.baiduyun.wiki/bds.png?t=' + Math.random() + '" style="cursor:pointer;margin: 0 auto; position: absolute; left: 0; right: 0; bottom: 100px;max-width: 215px">')) : (e = $(".module-aside"), t = $('<img class="K5a8Tu" src="https://cdn.baiduyun.wiki/bds.png?t=' + Math.random() + '" style="cursor:pointer;margin: 10px 0;max-width: 215px">')), e.append(t), void $(document).on("click", ".K5a8Tu", function () {
            GM_openInTab("http://pan.baiduyun.wiki/share", {active: !0});
          });
        default:
          return;
      }
    }

    function d() {
      GM_registerMenuCommand("网盘脚本配置", function () {
        void 0 === GM_getValue("SETTING_A") && GM_setValue("SETTING_A", !0), void 0 === GM_getValue("SETTING_P") && GM_setValue("SETTING_P", !1), void 0 === GM_getValue("SETTING_H") && GM_setValue("SETTING_H", !0);
        var e = "";
        GM_getValue("SETTING_H") ? e += '<label style="display:flex;align-items: center;justify-content: space-between;padding-top: 20px;">开启教程<input type="checkbox" id="S-H" checked style="width: 16px;height: 16px;"></label>' : e += '<label style="display:flex;align-items: center;justify-content: space-between;padding-top: 20px;">开启教程<input type="checkbox" id="S-H" style="width: 16px;height: 16px;"></label>', GM_getValue("SETTING_A") ? e += '<label style="display:flex;align-items: center;justify-content: space-between;padding-top: 20px;">开启广告(支持作者)<input type="checkbox" id="S-A" checked style="width: 16px;height: 16px;"></label>' : e += '<label style="display:flex;align-items: center;justify-content: space-between;padding-top: 20px;">开启广告(支持作者)<input type="checkbox" id="S-A" style="width: 16px;height: 16px;"></label>', e = "<div>" + e + "</div>";
        var t = $(e);
        swal({content: t[0]});
      }), $(document).on("change", "#S-A", function () {
        GM_setValue("SETTING_A", $(this)[0].checked);
      }), $(document).on("change", "#S-H", function () {
        GM_setValue("SETTING_H", $(this)[0].checked);
      }), $(document).on("change", "#S-P", function () {
        GM_setValue("SETTING_P", $(this)[0].checked);
      });
    }

    function l() {
      h["default-dom"] = $(".icon-upload").parent().parent().parent().parent().parent().attr("class"), h.bar = $(".icon-upload").parent().parent().parent().parent().attr("class");
      var e = document.createElement("script");
      e.type = "text/javascript", e.async = !0, e.src = "https://js.users.51.la/19988117.js", document.getElementsByTagName("head")[0].appendChild(e);
      var t = document.createElement("meta");
      t.httpEquiv = "Content-Security-Policy", t.content = "upgrade-insecure-requests", document.getElementsByTagName("head")[0].appendChild(t), $(document).on("contextmenu", ".aria2c-link", function (e) {
        return e.preventDefault(), !1;
      }), $(document).on("mousedown", ".aria2c-link", function (e) {
        e.preventDefault();
        var t = $(this).text();
        return GM_setClipboard(t, "text"), swal("已将链接复制到剪贴板！请复制到XDown中下载", {timer: 2e3}), !1;
      });
    }

    this.init = function () {
      GM_setValue("current_version", u), l(), t(), GM_getValue("SETTING_H") && i(), GM_getValue("SETTING_A") && o(), d();
    };
  }

  var u = "2.9.5", h = {
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
        "item-active": "maaXwzJ",
        "grid-view": "JKvHJMb",
        "bar-search": "OFaPaO",
        "list-tools": "tcuLAu",
        header: "vyQHNyb"
      }, f = {
        dir: "提示：此方式不支持整个文件夹下载，可进入文件夹内获取文件链接下载",
        unlogin: "提示：必须登录百度网盘后才能使用此功能哦!!!",
        fail: "提示：获取下载链接失败！请刷新网页后重试！",
        unselected: "提示：请先勾选要下载的文件，否则刷新后重试！",
        morethan: "提示：多个文件请点击【显示链接】",
        toobig: "提示：只支持300M以下的文件夹，若链接无法下载，请进入文件夹后勾选文件获取！"
      }, v = GM_getValue("secretCode") ? GM_getValue("secretCode") : "624966",
      g = GM_getValue("savePath") ? GM_getValue("savePath") : "/PanHelper", w = "";
  $(function () {
    (new p).init();
  });
}();
