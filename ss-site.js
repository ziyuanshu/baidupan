// ==UserScript==
// @name         free-ss
// @version      0.1.7
// @homepage     http://xieshang.ren/2018/03/01/Tampermonkey_free_ss_plus/
// @description  修复对稳定性增加干扰的过滤
// @author       XSC
// @include      https://*free-ss.site/
// @include      http://*free-ss.site/
// @match        https://*free-ss.tk/
// @match        http://*free-ss.tk/
// @match        http://*free-ss.cf/
// @match        http://*free-ss.cf/
// @require           https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @run-at            document-start
// @grant             unsafeWindow
// @grant             GM_setClipboard
// ==/UserScript==

(function () {
    navigator.webdriver = undefined;
    window.webdriver = undefined;
    window.outerWidth = 0;
    window.outerHeight = 0;

})();