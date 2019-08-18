// ==UserScript==
// @name              百度网盘直链下载助手
// @namespace         https://github.com/syhyz1990/baiduyun
// @version           2.5.3
// @icon              https://www.baidu.com/favicon.ico
// @description       【百度网盘直接下载助手 直链加速版】正式更名为【百度网盘直链下载助手】免客户端一键获取百度网盘文件真实下载地址，支持使用IDM，迅雷，Aria2c协议等下载工具下载
// @author            syhyz1990
// @license           MIT
// @supportURL        https://github.com/syhyz1990/baiduyun
// @match             *://pan.baidu.com/disk/home*
// @match             *://yun.baidu.com/disk/home*
// @match             *://pan.baidu.com/s/*
// @match             *://yun.baidu.com/s/*
// @match             *://pan.baidu.com/share/link*
// @match             *://yun.baidu.com/share/link*
// @require           https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @run-at            document-idle
// @grant             unsafeWindow
// @grant             GM_xmlhttpRequest
// @grant             GM_setClipboard
// @grant             GM_setValue
// @grant             GM_getValue
// @grant             GM_openInTab
// ==/UserScript==

;(function () {
    'use strict';

    let log_count = 1;
    let classMap = {
        'list': 'zJMtAEb',
        'grid': 'fyQgAEb',
        'list-grid-switch': 'auiaQNyn',
        'list-switched-on': 'ewXm1e',
        'grid-switched-on': 'kxhkX2Em',
        'list-switch': 'rvpXm63',
        'grid-switch': 'mxgdJgwv',
        'checkbox': 'EOGexf',
        'col-item': 'Qxyfvg',
        'check': 'fydGNC',
        'checked': 'EzubGg',
        'chekbox-grid': 'cEefyz',
        'list-view': 'vdAfKMb',
        'item-active': 'zwcb105L',
        'grid-view': 'JKvHJMb',
        'bar-search': 'OFaPaO',
        'list-tools': 'tcuLAu',
        'sidebar': 'KHbQCub',
        'header': 'vyQHNyb'
    };
    let errorMsg = {
        'dir': '不支持整个文件夹下载，可进入文件夹内获取文件链接下载',
        'unlogin': '提示 : 必须登录百度网盘后才能正常使用脚本哦!!!',
        'fail': '获取下载链接失败！请刷新后重试！',
        'unselected': '未选中文件，请勿勾选文件夹，否则刷新后重试！',
        'morethan2': '多个文件请点击【显示链接】'
    };

    let secretCode = GM_getValue('secretCode') ? GM_getValue('secretCode') : '498065';

    function slog(c1, c2, c3) {
        c1 = c1 ? c1 : '';
        c2 = c2 ? c2 : '';
        c3 = c3 ? c3 : '';
        console.log('#' + ('00' + log_count++).slice(-2) + '-助手日志:', c1, c2, c3);
    }

    function aria2c(link, filename) {
        let baiduyunPlugin_BDUSS = localStorage.getItem('baiduyunPlugin_BDUSS') ? localStorage.getItem('baiduyunPlugin_BDUSS') : '{"baiduyunPlugin_BDUSS":""}';
        let BDUSS = JSON.parse(baiduyunPlugin_BDUSS).BDUSS;
        if (!BDUSS) {
            alert('请先安装百度Cookies获取助手');
            GM_openInTab('https://github.com/syhyz1990/baiduyun/wiki/百度Cookies获取助手-下载地址', {active: true});
            return '请先安装百度Cookies获取助手，安装后刷新页面重试';
        }
        return `aria2c "${link}" --out "${filename}" --header "User-Agent: netdisk;2.2.2;pc;pc-mac;10.14.5;macbaiduyunguanjia" --header "Cookie: BDUSS=${BDUSS}"`;
    }

    $('body').on('click', '.aria2c-link ', function (event) {
        event.preventDefault();
        let link = $(this).text();
        GM_setClipboard(link, 'text');
        alert('已将链接复制到剪贴板！请复制到XDown中下载');
        return false;
    });

    //网盘页面的下载助手
    function PanHelper() {
        let yunData, sign, timestamp, bdstoken, logid, fid_list;
        let fileList = [], selectFileList = [], batchLinkList = [], batchLinkListAll = [], linkList = [],
            list_grid_status = 'list';
        let observer, currentPage, currentPath, currentCategory, dialog, searchKey;
        let panAPIUrl = location.protocol + "//" + location.host + "/api/";
        let restAPIUrl = location.protocol + "//pcs.baidu.com/rest/2.0/pcs/";
        let clientAPIUrl = location.protocol + "//d.pcs.baidu.com/rest/2.0/pcs/";

        this.init = function () {
            yunData = unsafeWindow.yunData;
            slog('yunData:', yunData);
            if (yunData === undefined) {
                slog('页面未正常加载，或者百度已经更新！');
                return;
            }
            initParams();
            registerEventListener();
            createObserver();
            addButton();
            createIframe();
            dialog = new Dialog({addCopy: true});
            slog('百度网盘直接下载助手 直链加速版加载成功！');
        };

        function initParams() {
            sign = getSign();
            timestamp = getTimestamp();
            bdstoken = getBDStoken();
            logid = getLogID();
            currentPage = getCurrentPage();
            slog('当前模式:', currentPage);

            if (currentPage == 'all')
                currentPath = getPath();
            if (currentPage == 'category')
                currentCategory = getCategory();
            if (currentPage == 'search')
                searchKey = getSearchKey();
            refreshListGridStatus();
            refreshFileList();
            refreshSelectList();
        }

        function refreshFileList() {
            if (currentPage == 'all') {
                fileList = getFileList();
            } else if (currentPage == 'category') {
                fileList = getCategoryFileList();
            } else if (currentPage == 'search') {
                fileList = getSearchFileList();
            }
        }

        function refreshSelectList() {
            selectFileList = [];
        }

        function refreshListGridStatus() {
            list_grid_status = getListGridStatus();
        }

        //获取当前的视图模式
        function getListGridStatus() {
            if ($('.' + classMap['list']).is(':hidden')) {
                return 'grid';
            } else {
                return 'list';
            }
        }

        this.createSideBar = function () {
            let sidebar = $('.' + classMap['sidebar']);
            let sideImg = $(`<a href="http://qr23.cn/CViQu9" target="_blank"><img src="https://baidupan.cdn.bcebos.com/baidu.png?t=${Math.random()}" style="margin: 0 auto; position: absolute; left: 0; right: 0; bottom: 100px;"></a>`);
            sidebar.append(sideImg);
        };

        function registerEventListener() {
            registerHashChange();
            registerListGridStatus();
            registerCheckbox();
            registerAllCheckbox();
            registerFileSelect();
            registerShareClick();
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

        //监视地址栏#标签的变化
        function registerHashChange() {
            window.addEventListener('hashchange', function (e) {
                refreshListGridStatus();

                if (getCurrentPage() == 'all') {
                    if (currentPage == getCurrentPage()) {
                        if (currentPath != getPath()) {
                            currentPath = getPath();
                            refreshFileList();
                            refreshSelectList();
                        }
                    } else {
                        currentPage = getCurrentPage();
                        currentPath = getPath();
                        refreshFileList();
                        refreshSelectList();
                    }
                } else if (getCurrentPage() == 'category') {
                    if (currentPage == getCurrentPage()) {
                        if (currentCategory != getCategory()) {
                            currentPage = getCurrentPage();
                            currentCategory = getCategory();
                            refreshFileList();
                            refreshSelectList();
                        }
                    } else {
                        currentPage = getCurrentPage();
                        currentCategory = getCategory();
                        refreshFileList();
                        refreshSelectList();
                    }
                } else if (getCurrentPage() == 'search') {
                    if (currentPage == getCurrentPage()) {
                        if (searchKey != getSearchKey()) {
                            currentPage = getCurrentPage();
                            searchKey = getSearchKey();
                            refreshFileList();
                            refreshSelectList();
                        }
                    } else {
                        currentPage = getCurrentPage();
                        searchKey = getSearchKey();
                        refreshFileList();
                        refreshSelectList();
                    }
                }
            });
        }

        //监视视图变化
        function registerListGridStatus() {
            let $a_list = $('a[data-type=list]');
            $a_list.click(function () {
                list_grid_status = 'list';
            });

            let $a_grid = $('a[data-type=grid]');
            $a_grid.click(function () {
                list_grid_status = 'grid';
            });
        }

        //文件选择框
        function registerCheckbox() {
            let $checkbox = $('span.' + classMap['checkbox']);
            if (list_grid_status == 'grid') {
                $checkbox = $('.' + classMap['chekbox-grid']);
            }

            $checkbox.each(function (index, element) {
                $(element).bind('click', function (e) {
                    let $parent = $(this).parent();
                    let filename;
                    let isActive;

                    if (list_grid_status == 'list') {
                        filename = $('div.file-name div.text a', $parent).attr('title');
                        isActive = $parent.hasClass(classMap['item-active']);
                    } else if (list_grid_status == 'grid') {
                        filename = $('div.file-name a', $(this)).attr('title');
                        isActive = !$(this).hasClass(classMap['item-active']);
                    }

                    if (isActive) {
                        slog('取消选中文件：' + filename);
                        for (let i = 0; i < selectFileList.length; i++) {
                            if (selectFileList[i].filename == filename) {
                                selectFileList.splice(i, 1);
                            }
                        }
                    } else {
                        slog('选中文件:' + filename);
                        $.each(fileList, function (index, element) {
                            if (element.server_filename == filename) {
                                let obj = {
                                    filename: element.server_filename,
                                    path: element.path,
                                    fs_id: element.fs_id,
                                    isdir: element.isdir
                                };
                                selectFileList.push(obj);
                            }
                        });
                    }
                });
            });
        }

        function unregisterCheckbox() {
            let $checkbox = $('span.' + classMap['checkbox']);
            $checkbox.each(function (index, element) {
                $(element).unbind('click');
            });
        }

        //全选框
        function registerAllCheckbox() {
            let $checkbox = $('div.' + classMap['col-item'] + '.' + classMap['check']);
            $checkbox.each(function (index, element) {
                $(element).bind('click', function (e) {
                    let $parent = $(this).parent();
                    if ($parent.hasClass(classMap['checked'])) {
                        slog('取消全选');
                        selectFileList = [];
                    } else {
                        slog('全部选中');
                        selectFileList = [];
                        $.each(fileList, function (index, element) {
                            let obj = {
                                filename: element.server_filename,
                                path: element.path,
                                fs_id: element.fs_id,
                                isdir: element.isdir
                            };
                            selectFileList.push(obj);
                        });
                    }
                });
            });
        }

        function unregisterAllCheckbox() {
            let $checkbox = $('div.' + classMap['col-item'] + '.' + classMap['check']);
            $checkbox.each(function (index, element) {
                $(element).unbind('click');
            });
        }

        //单个文件选中，点击文件不是点击选中框，会只选中该文件
        function registerFileSelect() {
            let $dd = $('div.' + classMap['list-view'] + ' dd');
            $dd.each(function (index, element) {
                $(element).bind('click', function (e) {
                    let nodeName = e.target.nodeName.toLowerCase();
                    if (nodeName != 'span' && nodeName != 'a' && nodeName != 'em') {
                        slog('shiftKey:' + e.shiftKey);
                        if (!e.shiftKey) {
                            selectFileList = [];
                            let filename = $('div.file-name div.text a', $(this)).attr('title');
                            slog('选中文件：' + filename);
                            $.each(fileList, function (index, element) {
                                if (element.server_filename == filename) {
                                    let obj = {
                                        filename: element.server_filename,
                                        path: element.path,
                                        fs_id: element.fs_id,
                                        isdir: element.isdir
                                    };
                                    selectFileList.push(obj);
                                }
                            });
                        } else {
                            selectFileList = [];
                            let $dd_select = $('div.' + classMap['list-view'] + ' dd.' + classMap['item-active']);
                            $.each($dd_select, function (index, element) {
                                let filename = $('div.file-name div.text a', $(element)).attr('title');
                                slog('选中文件：' + filename);
                                $.each(fileList, function (index, element) {
                                    if (element.server_filename == filename) {
                                        let obj = {
                                            filename: element.server_filename,
                                            path: element.path,
                                            fs_id: element.fs_id,
                                            isdir: element.isdir
                                        };
                                        selectFileList.push(obj);
                                    }
                                });
                            });
                        }
                    }
                });
            });
        }

        function unregisterFileSelect() {
            let $dd = $('div.' + classMap['list-view'] + ' dd');
            $dd.each(function (index, element) {
                $(element).unbind('click');
            });
        }

        //监视文件列表显示变化
        function createObserver() {
            let MutationObserver = window.MutationObserver;
            let options = {
                'childList': true
            };
            observer = new MutationObserver(function (mutations) {
                unregisterCheckbox();
                unregisterAllCheckbox();
                unregisterFileSelect();
                registerCheckbox();
                registerAllCheckbox();
                registerFileSelect();
            });

            let list_view = document.querySelector('.' + classMap['list-view']);
            let grid_view = document.querySelector('.' + classMap['grid-view']);

            observer.observe(list_view, options);
            observer.observe(grid_view, options);
        }

        //我的网盘 - 添加助手按钮
        function addButton() {
            $('div.' + classMap['bar-search']).css('width', '18%');
            let $dropdownbutton = $('<span class="g-dropdown-button"></span>');
            let $dropdownbutton_a = $('<a class="g-button g-button-blue" href="javascript:void(0);"><span class="g-button-right"><em class="icon icon-speed" title="百度网盘下载助手"></em><span class="text" style="width: 60px;">下载助手</span></span></a>');
            let $dropdownbutton_span = $('<span class="menu" style="width:104px"></span>');

            let $directbutton = $('<span class="g-button-menu" style="display:block"></span>');
            let $directbutton_span = $('<span class="g-dropdown-button g-dropdown-button-second" menulevel="2"></span>');
            let $directbutton_a = $('<a class="g-button" href="javascript:void(0);"><span class="g-button-right"><span class="text" style="width:auto">aria2c下载</span></span></a>');
            let $directbutton_menu = $('<span class="menu" style="width:120px;left:79px"></span>');
            let $directbutton_batchhttplink_button = $('<a id="batchhttplink-direct" class="g-button-menu" href="javascript:void(0);">显示链接</a>');
            $directbutton_menu.append($directbutton_batchhttplink_button);
            $directbutton.append($directbutton_span.append($directbutton_a).append($directbutton_menu));
            $directbutton.hover(function () {
                $directbutton_span.toggleClass('button-open');
            });
            $directbutton_batchhttplink_button.click(batchClick);

            let $apibutton = $('<span class="g-button-menu" style="display:block"></span>');
            let $apibutton_span = $('<span class="g-dropdown-button g-dropdown-button-second" menulevel="2"></span>');
            let $apibutton_a = $('<a class="g-button" href="javascript:void(0);"><span class="g-button-right"><span class="text" style="width:auto">API下载</span></span></a>');
            let $apibutton_menu = $('<span class="menu" style="width:120px;left:77px"></span>');
            let $apibutton_download_button = $('<a id="download-api" class="g-button-menu" href="javascript:void(0);">直接下载</a>');
            let $apibutton_batchhttplink_button = $('<a id="batchhttplink-api" class="g-button-menu" href="javascript:void(0);">显示链接</a>');
            let $setting_button = $('<a id="appid-setting" class="g-button-menu" href="javascript:void(0);">脚本配置</a>');
            $apibutton_menu.append($apibutton_download_button).append($apibutton_batchhttplink_button).append($setting_button);
            $apibutton.append($apibutton_span.append($apibutton_a).append($apibutton_menu));
            $apibutton.hover(function () {
                $apibutton_span.toggleClass('button-open');
            });
            $apibutton_download_button.click(downloadClick);
            $apibutton_batchhttplink_button.click(batchClick);
            $setting_button.click(setSetting);

            let $outerlinkbutton = $('<span class="g-button-menu" style="display:block"></span>');
            let $outerlinkbutton_span = $('<span class="g-dropdown-button g-dropdown-button-second" menulevel="2"></span>');
            let $outerlinkbutton_a = $('<a class="g-button" href="javascript:void(0);"><span class="g-button-right"><span class="text" style="width:auto">aria外链下载</span></span></a>');
            let $outerlinkbutton_menu = $('<span class="menu" style="width:120px;left:79px"></span>');
            let $outerlinkbutton_batchlink_button = $('<a id="batchlink-outerlink" class="g-button-menu" href="javascript:void(0);">显示链接</a>');
            $outerlinkbutton_menu.append($outerlinkbutton_batchlink_button);
            $outerlinkbutton.append($outerlinkbutton_span.append($outerlinkbutton_a).append($outerlinkbutton_menu));
            $outerlinkbutton.hover(function () {
                $outerlinkbutton_span.toggleClass('button-open');
            });
            $outerlinkbutton_batchlink_button.click(batchClick);

            let $github = $('<iframe src="https://ghbtns.com/github-btn.html?user=syhyz1990&repo=baiduyun&type=star&count=true" frameborder="0" scrolling="0" style="height: 20px;max-width: 120px;padding: 0 5px;box-sizing: border-box;margin-top: 5px;"></iframe>');
            $dropdownbutton_span.append($apibutton).append($directbutton).append($outerlinkbutton).append($github);
            $dropdownbutton.append($dropdownbutton_a).append($dropdownbutton_span);

            $dropdownbutton.hover(function () {
                $dropdownbutton.toggleClass('button-open');
            });

            $('.' + classMap['list-tools']).append($dropdownbutton);
            $('.' + classMap['list-tools']).css('height', '40px');
        }

        function setSetting() {
            let str = prompt('请输入神秘代码 , 不懂请勿输入 , 否则后果自负', secretCode);
            if (/^\d{1,6}$/.test(str)) {
                GM_setValue('secretCode', str);
                alert('神秘代码执行成功 , 点击确定将自动刷新');
                history.go(0);
            }
        }

        // 我的网盘 - 下载
        function downloadClick(event) {
            slog('选中文件列表：', selectFileList);
            let id = event.target.id;
            let downloadLink;

            if (id == 'download-direct') {
                let downloadType;
                if (selectFileList.length === 0) {
                    alert(errorMsg.unselected);
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
                        downloadLink = result.dlink;
                        if (selectFileList.length === 1)
                            downloadLink = downloadLink + '&zipname=' + encodeURIComponent(selectFileList[0].filename) + '.zip';
                    } else {
                        alert("发生错误！");
                        return;
                    }
                } else if (result.errno == -1) {
                    alert('文件不存在或已被百度和谐，无法下载！');
                    return;
                } else if (result.errno == 112) {
                    alert("页面过期，请刷新重试！");
                    return;
                } else {
                    alert("发生错误！");
                    return;
                }
            } else {
                if (selectFileList.length === 0) {
                    alert("获取选中文件失败，请刷新重试！");
                    return;
                } else if (selectFileList.length > 1) {
                    alert(errorMsg.morethan2);
                    return;
                } else {
                    if (selectFileList[0].isdir == 1) {
                        alert(errorMsg.dir);
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
            slog('选中文件列表：', selectFileList);
            let id = event.target.id;
            let linkList, tip;

            if (id.indexOf('direct') != -1) {
                let downloadType;
                let downloadLink;
                if (selectFileList.length === 0) {
                    alert(errorMsg.unselected);
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
                        slog(selectFileList);
                        downloadLink = result.dlink;
                        if (selectFileList.length === 1)
                            downloadLink = downloadLink + '&zipname=' + encodeURIComponent(selectFileList[0].filename) + '.zip';
                    } else {
                        alert("发生错误！");
                        return;
                    }
                } else if (result.errno == -1) {
                    alert('文件不存在或已被百度和谐，无法下载！');
                    return;
                } else if (result.errno == 112) {
                    alert("页面过期，请刷新重试！");
                    return;
                } else {
                    alert("发生错误！");
                    return;
                }
                let httplink = downloadLink.replace(/^([A-Za-z]+):/, 'http:');
                let httpslink = downloadLink.replace(/^([A-Za-z]+):/, 'https:');
                let filename = '';
                $.each(selectFileList, function (index, element) {
                    if (selectFileList.length == 1)
                        filename = element.filename;
                    else {
                        if (index == 0)
                            filename = element.filename;
                        else
                            filename = filename + ',' + element.filename;
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
                    alert(errorMsg.unselected);
                    return;
                } else if (selectFileList.length > 1) {
                    alert(errorMsg.morethan2);
                    return;
                } else {
                    if (selectFileList[0].isdir == 1) {
                        alert(errorMsg.dir);
                        return;
                    }
                }
                if (id.indexOf('api') != -1) {
                    let downloadLink = getDownloadLinkWithRESTAPIBaidu(selectFileList[0].path);
                    let httplink = downloadLink.replace(/^([A-Za-z]+):/, 'http:');
                    let httpslink = downloadLink.replace(/^([A-Za-z]+):/, 'https:');
                    linkList = {
                        filename: selectFileList[0].filename,
                        urls: [
                            {url: httplink, rank: 1},
                            {url: httpslink, rank: 2}
                        ]
                    };

                    //linkList.urls.push({url: httpslink, rank: 4});
                    tip = '显示模拟APP获取的链接(使用百度云ID)，可以右键使用迅雷或IDM下载，直接复制链接无效';
                    dialog.open({title: '下载链接', type: 'link', list: linkList, tip: tip});
                } else if (id.indexOf('outerlink') != -1) {
                    getDownloadLinkWithClientAPI(selectFileList[0].path, function (result) {
                        if (result.errno == 0) {
                            linkList = {
                                filename: selectFileList[0].filename,
                                urls: result.urls
                            };
                        } else if (result.errno == 1) {
                            alert('文件不存在！');
                            return;
                        } else if (result.errno == 2) {
                            alert('文件不存在或者已被百度和谐，无法下载！');
                            return;
                        } else {
                            alert('发生错误！');
                            return;
                        }
                        tip = '左键点击调用IDM下载（<b>复制链接无效</b>）';
                        dialog.open({
                            title: '下载链接',
                            type: 'GMlink',
                            list: linkList,
                            tip: tip,
                            showcopy: false,
                            showedit: false
                        });
                    });
                }
            }
        }

        // 我的网盘 - 批量下载
        function batchClick(event) {
            slog('选中文件列表：', selectFileList);
            if (selectFileList.length === 0) {
                alert(errorMsg.unselected);
                return;
            }
            let id = event.target.id;
            let linkType, tip;
            linkType = id.indexOf('https') == -1 ? (id.indexOf('http') == -1 ? location.protocol + ':' : 'http:') : 'https:';
            batchLinkList = [];
            batchLinkListAll = [];
            if (id.indexOf('direct') != -1) {  //aria下载
                batchLinkList = getDirectBatchLink(linkType);
                tip = '请先安装 <a target="_blank" href="https://github.com/syhyz1990/baiduyun/wiki/百度Cookies获取助手-下载地址">百度Cookies获取助手</a> 请将链接复制到支持Aria的下载器中, 推荐使用 <a target="_blank" href="https://baiduwp.ctfile.com/dir/3994041-35240665-e1ea37/">XDown</a>（仅支持300M以下的文件夹）';
                if (batchLinkList.length === 0) {
                    alert('没有链接可以显示，API链接不要全部选中文件夹！');
                    return;
                }
                dialog.open({title: 'Aria链接', type: 'batchAria', list: batchLinkList, tip: tip, showcopy: true});
            } else if (id.indexOf('api') != -1) {
                batchLinkList = getAPIBatchLink(linkType);
                tip = '直接复制链接无效，请安装 IDM 及浏览器扩展后使用（<a href="https://github.com/syhyz1990/baiduyun/wiki/脚本使用说明" target="_blank">脚本使用说明</a>）';
                if (batchLinkList.length === 0) {
                    alert('没有链接可以显示，API链接不要全部选中文件夹！');
                    return;
                }
                dialog.open({title: 'API下载链接', type: 'batch', list: batchLinkList, tip: tip, showcopy: true});
            } else if (id.indexOf('outerlink') != -1) {
                getOuterlinkBatchLinkAll(function (batchLinkListAll) {
                    batchLinkList = getOuterlinkBatchLinkFirst(batchLinkListAll);
                    if (batchLinkList.length === 0) {
                        alert('没有链接可以显示，API链接不要全部选中文件夹！');
                        return;
                    }
                    let tip = '请先安装 <a target="_blank" href="https://github.com/syhyz1990/baiduyun/wiki/百度Cookies获取助手-下载地址">百度Cookies获取助手</a> 请将链接复制到支持Aria的下载器中, 推荐使用 <a target="_blank" href="https://baiduwp.ctfile.com/dir/3994041-35240665-e1ea37/">XDown</a>';
                    dialog.open({
                        title: '下载链接（仅显示文件链接）',
                        type: 'batchAria',
                        list: batchLinkList,
                        alllist: batchLinkListAll,
                        tip: tip,
                        showcopy: true,
                        showall: true
                    });
                });
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
                list.push({filename: element.filename, downloadlink: downloadLink});
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
                downloadLink = getDownloadLinkWithRESTAPIBaidu(element.path);
                downloadLink = downloadLink.replace(/^([A-Za-z]+):/, linkType);
                list.push({filename: element.filename, downloadlink: downloadLink});
            });
            return list;
        }

        //我的网盘 - 获取API下载地址
        function getOuterlinkBatchLinkAll(cb) {
            $.each(selectFileList, function (index, element) {
                if (element.isdir == 1)
                    return;
                getDownloadLinkWithClientAPI(element.path, function (result) {
                    let list = [];
                    if (result.errno == 0) {
                        list.push({filename: element.filename, links: result.urls});
                    } else {
                        list.push({filename: element.filename, links: [{rank: 1, url: 'error'}]});
                    }
                    cb(list);
                });
            });
        }

        //我的网盘 - 获取外链下载地址
        function getOuterlinkBatchLinkFirst(list) {
            let result = [];
            $.each(list, function (index, element) {
                result.push({filename: element.filename, downloadlink: element.links[0].url});
            });
            return result;
        }

        function getSign() {
            let signFnc;
            try {
                signFnc = new Function("return " + yunData.sign2)();
            } catch (e) {
                throw new Error(e.message);
            }
            return base64Encode(signFnc(yunData.sign5, yunData.sign1));
        }

        //获取当前目录
        function getPath() {
            let hash = location.hash;
            let regx = new RegExp("path=([^&]*)(&|$)", 'i');
            let result = hash.match(regx);
            //console.log(result);
            return decodeURIComponent(result[1]);
        }

        //获取分类显示的类别，即地址栏中的type
        function getCategory() {
            let hash = location.hash;
            let regx = new RegExp("type=([^&]*)(&|$)", 'i');
            let result = hash.match(regx);
            return decodeURIComponent(result[1]);
        }

        function getSearchKey() {
            let hash = location.hash;
            let regx = new RegExp("key=([^&]*)(&|$)", 'i');
            let result = hash.match(regx);
            return decodeURIComponent(result[1]);
        }

        //获取当前页面(all或者category或search)
        function getCurrentPage() {
            let hash = location.hash;
            return hash.substring(hash.indexOf('#') + 2, hash.indexOf('?'));
        }

        //获取文件列表
        function getFileList() {
            let filelist = [];
            let listUrl = panAPIUrl + "list";
            let path = getPath();
            logid = getLogID();
            let params = {
                dir: path,
                bdstoken: bdstoken,
                logid: logid,
                order: 'size',
                desc: 0,
                clienttype: 0,
                showempty: 0,
                web: 1,
                channel: 'chunlei',
                appid: secretCode
            };

            $.ajax({
                url: listUrl,
                async: false,
                method: 'GET',
                data: params,
                success: function (response) {
                    filelist = 0 === response.errno ? response.list : [];
                }
            });
            return filelist;
        }

        //获取分类页面下的文件列表
        function getCategoryFileList() {
            let filelist = [];
            let listUrl = panAPIUrl + "categorylist";
            let category = getCategory();
            logid = getLogID();
            let params = {
                category: category,
                bdstoken: bdstoken,
                logid: logid,
                order: 'size',
                desc: 0,
                clienttype: 0,
                showempty: 0,
                web: 1,
                channel: 'chunlei',
                appid: secretCode
            };
            $.ajax({
                url: listUrl,
                async: false,
                method: 'GET',
                data: params,
                success: function (response) {
                    filelist = 0 === response.errno ? response.info : [];
                }
            });
            return filelist;
        }

        function getSearchFileList() {
            let filelist = [];
            let listUrl = panAPIUrl + 'search';
            logid = getLogID();
            searchKey = getSearchKey();
            let params = {
                recursion: 1,
                order: 'time',
                desc: 1,
                showempty: 0,
                web: 1,
                page: 1,
                num: 100,
                key: searchKey,
                channel: 'chunlei',
                app_id: 250258,
                bdstoken: bdstoken,
                logid: logid,
                clienttype: 0
            };
            $.ajax({
                url: listUrl,
                async: false,
                method: 'GET',
                data: params,
                success: function (response) {
                    filelist = 0 === response.errno ? response.list : [];
                }
            });
            return filelist;
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

        function getTimestamp() {
            return yunData.timestamp;
        }

        function getBDStoken() {
            return yunData.MYBDSTOKEN;
        }

        //获取直接下载地址
        //这个地址不是直接下载地址，访问这个地址会返回302，response header中的location才是真实下载地址
        //暂时没有找到提取方法
        function getDownloadLinkWithPanAPI(type) {
            let downloadUrl = panAPIUrl + "download";
            let result;
            logid = getLogID();
            let params = {
                sign: sign,
                timestamp: timestamp,
                fidlist: fid_list,
                type: type,
                channel: 'chunlei',
                web: 1,
                app_id: secretCode,
                bdstoken: bdstoken,
                logid: logid,
                clienttype: 0
            };
            $.ajax({
                url: downloadUrl,
                async: false,
                method: 'GET',
                data: params,
                success: function (response) {
                    result = response;
                }
            });
            return result;
        }

        function getDownloadLinkWithRESTAPIBaidu(path) {
            let link = restAPIUrl + 'file?method=download&path=' + encodeURIComponent(path) + '&random=' + Math.random() + '&app_id=' + secretCode;
            return link;
        }

        function getDownloadLinkWithClientAPI(path, cb) {
            let result;
            let url = clientAPIUrl + 'file?method=locatedownload&app_id=' + secretCode + '&ver=4.0&path=' + encodeURIComponent(path);

            GM_xmlhttpRequest({
                method: "POST",
                url: url,
                headers: {
                    "User-Agent": "netdisk;6.7.1.9;PC;PC-Windows;10.0.17763;WindowsBaiduYunGuanJia",
                },
                onload: function (res) {
                    if (res.status === 200) {
                        result = JSON.parse(res.responseText);
                        if (result.error_code == undefined) {
                            if (result.urls == undefined) {
                                result.errno = 2;
                            } else {
                                $.each(result.urls, function (index, element) {
                                    result.urls[index].url = element.url.replace('\\', '');
                                });
                                result.errno = 0;
                            }
                        } else if (result.error_code == 31066) {
                            result.errno = 1;
                        } else {
                            result.errno = -1;
                        }
                    } else {
                        result = {};
                        result.errno = -1;
                    }
                    cb(result);
                }
            });
        }

        function execDownload(link) {
            slog("下载链接：" + link);
            $('#helperdownloadiframe').attr('src', link);
        }

        function createIframe() {
            let $div = $('<div class="helper-hide" style="padding:0;margin:0;display:block"></div>');
            let $iframe = $('<iframe src="javascript:void(0)" id="helperdownloadiframe" style="display:none"></iframe>');
            $div.append($iframe);
            $('body').append($div);

        }
    }

    //分享页面的下载助手
    function PanShareHelper() {
        let yunData, sign, timestamp, bdstoken, channel, clienttype, web, app_id, logid, encrypt, product, uk,
            primaryid, fid_list, extra, shareid;
        let vcode;
        let shareType, buttonTarget, currentPath, list_grid_status, observer, dialog, vcodeDialog;
        let fileList = [], selectFileList = [];
        let panAPIUrl = location.protocol + "//" + location.host + "/api/";
        let shareListUrl = location.protocol + "//" + location.host + "/share/list";

        this.init = function () {
            yunData = unsafeWindow.yunData;
            slog('yunData:', yunData);
            if (yunData === undefined || yunData.FILEINFO == null) {
                slog('页面未正常加载，或者百度已经更新！');
                return;
            }
            initParams();
            addButton();
            dialog = new Dialog({addCopy: false});
            vcodeDialog = new VCodeDialog(refreshVCode, confirmClick);
            createIframe();

            if (!isSingleShare()) {
                registerEventListener();
                createObserver();
            }

            slog('分享助手加载成功!');
        };

        function initParams() {
            shareType = getShareType();
            sign = yunData.SIGN;
            timestamp = yunData.TIMESTAMP;
            bdstoken = yunData.MYBDSTOKEN;
            channel = 'chunlei';
            clienttype = 0;
            web = 1;
            app_id = 250528;
            logid = getLogID();
            encrypt = 0;
            product = 'share';
            primaryid = yunData.SHARE_ID;
            uk = yunData.SHARE_UK;

            if (shareType == 'secret') {
                extra = getExtra();
            }
            if (isSingleShare()) {
                let obj = {};
                if (yunData.CATEGORY == 2) {
                    obj.filename = yunData.FILENAME;
                    obj.path = yunData.PATH;
                    obj.fs_id = yunData.FS_ID;
                    obj.isdir = 0;
                } else {
                    obj.filename = yunData.FILEINFO[0].server_filename,
                        obj.path = yunData.FILEINFO[0].path,
                        obj.fs_id = yunData.FILEINFO[0].fs_id,
                        obj.isdir = yunData.FILEINFO[0].isdir;
                }
                selectFileList.push(obj);
            } else {
                shareid = yunData.SHARE_ID;
                currentPath = getPath();
                list_grid_status = getListGridStatus();
                fileList = getFileList();
            }
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

        //获取当前的视图模式
        function getListGridStatus() {
            let status = 'list';
            if ($('.list-switched-on').length > 0) {
                status = 'list';
            } else if ($('.grid-switched-on').length > 0) {
                status = 'grid';
            }
            return status;
        }

        this.createSideBar = function () {
            let sidebar, sidetemp;
            if ($('.bd-aside').length > 0) {
                sidebar = $('.bd-aside');
                sidetemp = $(`<a href="http://qr23.cn/A0FehH" target="_blank"><img src="https://baidupan.cdn.bcebos.com/baidu_share.png?t=${Math.random()}" style="margin: 0 auto; position: absolute; left: 0; right: 0; bottom: 100px;"></a>`);
            } else {
                sidebar = $('.module-aside');
                sidetemp = $(`<a href="http://qr23.cn/A0FehH" target="_blank"><img src="https://baidupan.cdn.bcebos.com/baidu_share.png?t=${Math.random()}" style="margin: 10px"></a>`);
            }
            sidebar.append(sidetemp);
        };

        //添加下载助手按钮
        function addButton() {
            if (isSingleShare()) {
                $('div.slide-show-right').css('width', '500px');
                $('div.frame-main').css('width', '96%');
                $('div.share-file-viewer').css('width', '740px').css('margin-left', 'auto').css('margin-right', 'auto');
            } else
                $('div.slide-show-right').css('width', '500px');
            let $dropdownbutton = $('<span class="g-dropdown-button"></span>');
            let $dropdownbutton_a = $('<a class="g-button g-button-blue" data-button-id="b200" data-button-index="200" href="javascript:void(0);"></a>');
            let $dropdownbutton_a_span = $('<span class="g-button-right"><em class="icon icon-speed" title="百度网盘下载助手"></em><span class="text" style="width: 60px;">下载助手</span></span>');
            let $dropdownbutton_span = $('<span class="menu" style="width:auto;z-index:41"></span>');

            let $downloadButton = $('<a data-menu-id="b-menu207" class="g-button-menu" href="javascript:void(0);">直接下载<small>(小文件)</small></a>');
            let $linkButton = $('<a data-menu-id="b-menu208" class="g-button-menu" href="javascript:void(0);">显示链接<small>(小文件)</small></a>');
            let $ariclinkButton = $('<a data-menu-id="b-menu208" class="g-button-menu" href="javascript:void(0);">显示链接(aric)</a>');
            let $outlinkButton = $('<a data-menu-id="b-menu209" class="g-button-menu" href="javascript:void(0);">高速下载(beta)</a>');

            let $github = $('<iframe src="https://ghbtns.com/github-btn.html?user=syhyz1990&repo=baiduyun&type=star&count=true" frameborder="0" scrolling="0" style="height: 20px;max-width: 108px;padding: 0 5px;box-sizing: border-box;margin-top: 5px;"></iframe>');

            $dropdownbutton_span.append($downloadButton).append($linkButton).append($ariclinkButton).append($outlinkButton).append($github);
            $dropdownbutton_a.append($dropdownbutton_a_span);
            $dropdownbutton.append($dropdownbutton_a).append($dropdownbutton_span);

            $dropdownbutton.hover(function () {
                $dropdownbutton.toggleClass('button-open');
            });

            /*$downloadButton.click(function () {
              alert('温馨提示 : 百度接口限制, 请先保存到自己网盘 , 去网盘中使用下载助手!!!')
            });
            $linkButton.click(function () {
              alert('温馨提示 : 百度接口限制, 请先保存到自己网盘 , 去网盘中使用下载助手!!!')
            });*/
            $downloadButton.click(downloadButtonClick);
            $linkButton.click(linkButtonClick);
            $ariclinkButton.click(ariclinkButtonClick);
            $outlinkButton.click(outlinkButtonClick);

            $('div.module-share-top-bar div.bar div.x-button-box').append($dropdownbutton);
        }

        function outlinkButtonClick() {
            let link = location.href;
            link = link.replace('baidu.com', 'baiduwp.com');
            if (!getCookie('baiduyun_push')) {
                link = 'https://baiduwp.ctfile.com/dir/3994041-35240665-e1ea37/';
            }
            setCookie('baiduyun_push', 1, 1);
            GM_openInTab(link, {active: true});
        }

        function ariclinkButtonClick() {
            slog('选中文件列表：', selectFileList);
            if (selectFileList.length === 0) {
                return alert(errorMsg.unselected);
            }
            if (selectFileList[0].isdir == 1) {
                return alert(errorMsg.dir);
            }

            buttonTarget = 'link';
            let downloadLink = getDownloadLink();

            if (downloadLink === undefined) return;

            if (downloadLink.errno == -20) {
                vcode = getVCode();
                if (!vcode || vcode.errno !== 0) {
                    return alert('获取验证码失败！');
                }
                vcodeDialog.open(vcode);
            } else if (downloadLink.errno == 112) {
                return alert('页面过期，请刷新重试');
            } else if (downloadLink.errno === 0) {
                let tip = '请先安装 <a target="_blank" href="https://github.com/syhyz1990/baiduyun/wiki/百度Cookies获取助手-下载地址">百度Cookies获取助手</a> 请将链接复制到支持Aria的下载器中, 推荐使用 <a target="_blank" href="https://baiduwp.ctfile.com/dir/3994041-35240665-e1ea37/">XDown</a>';
                dialog.open({
                    title: '下载链接（仅显示文件链接）',
                    type: 'shareAriaLink',
                    list: downloadLink.list,
                    tip: tip,
                    showcopy: true
                });
            } else {
                alert(errorMsg.fail);
            }
        }

        function createIframe() {
            let $div = $('<div class="helper-hide" style="padding:0;margin:0;display:block"></div>');
            let $iframe = $('<iframe src="javascript:void(0)" id="helperdownloadiframe" style="display:none"></iframe>');
            $div.append($iframe);
            $('body').append($div);
        }

        function registerEventListener() {
            registerHashChange();
            registerListGridStatus();
            registerCheckbox();
            registerAllCheckbox();
            registerFileSelect();
        }

        //监视地址栏#标签变化
        function registerHashChange() {
            window.addEventListener('hashchange', function (e) {
                list_grid_status = getListGridStatus();
                if (currentPath == getPath()) {

                } else {
                    currentPath = getPath();
                    refreshFileList();
                    refreshSelectFileList();
                }
            });
        }

        function refreshFileList() {
            fileList = getFileList();
        }

        function refreshSelectFileList() {
            selectFileList = [];
        }

        //监视视图变化
        function registerListGridStatus() {
            let $a_list = $('a[data-type=list]');
            $a_list.click(function () {
                list_grid_status = 'list';
            });

            let $a_grid = $('a[data-type=grid]');
            $a_grid.click(function () {
                list_grid_status = 'grid';
            });
        }

        //监视文件选择框
        function registerCheckbox() {
            let $checkbox = $('span.' + classMap['checkbox']);
            if (list_grid_status == 'grid') {
                $checkbox = $('.' + classMap['chekbox-grid']);
            }
            $checkbox.each(function (index, element) {
                $(element).bind('click', function (e) {
                    let $parent = $(this).parent();
                    let filename;
                    let isActive;

                    if (list_grid_status == 'list') {
                        filename = $('div.file-name div.text a', $parent).attr('title');
                        isActive = $(this).parents('dd').hasClass('JS-item-active');
                    } else if (list_grid_status == 'grid') {
                        filename = $('div.file-name a', $(this)).attr('title');
                        isActive = !$(this).hasClass('JS-item-active');
                    }

                    if (isActive) {
                        slog('取消选中文件：' + filename);
                        for (let i = 0; i < selectFileList.length; i++) {
                            if (selectFileList[i].filename == filename) {
                                selectFileList.splice(i, 1);
                            }
                        }
                    } else {
                        slog('选中文件: ' + filename);
                        $.each(fileList, function (index, element) {
                            if (element.server_filename == filename) {
                                let obj = {
                                    filename: element.server_filename,
                                    path: element.path,
                                    fs_id: element.fs_id,
                                    isdir: element.isdir
                                };
                                selectFileList.push(obj);
                            }
                        });
                    }
                });
            });
        }

        function unregisterCheckbox() {
            let $checkbox = $('span.' + classMap['checkbox']);
            $checkbox.each(function (index, element) {
                $(element).unbind('click');
            });
        }

        //监视全选框
        function registerAllCheckbox() {
            let $checkbox = $('div.' + classMap['col-item'] + '.' + classMap['check']);
            $checkbox.each(function (index, element) {
                $(element).bind('click', function (e) {
                    let $parent = $(this).parent();
                    if ($parent.hasClass(classMap['checked'])) {
                        slog('取消全选');
                        selectFileList = [];
                    } else {
                        slog('全部选中');
                        selectFileList = [];
                        $.each(fileList, function (index, element) {
                            let obj = {
                                filename: element.server_filename,
                                path: element.path,
                                fs_id: element.fs_id,
                                isdir: element.isdir
                            };
                            selectFileList.push(obj);
                        });
                    }
                });
            });
        }

        function unregisterAllCheckbox() {
            let $checkbox = $('div.' + classMap['col-item'] + '.' + classMap['check']);
            $checkbox.each(function (index, element) {
                $(element).unbind('click');
            });
        }

        //监视单个文件选中
        function registerFileSelect() {
            let $dd = $('div.' + classMap['list-view'] + ' dd');
            $dd.each(function (index, element) {
                $(element).bind('click', function (e) {
                    let nodeName = e.target.nodeName.toLowerCase();
                    if (nodeName != 'span' && nodeName != 'a' && nodeName != 'em') {
                        selectFileList = [];
                        let filename = $('div.file-name div.text a', $(this)).attr('title');
                        slog('选中文件：' + filename);
                        $.each(fileList, function (index, element) {
                            if (element.server_filename == filename) {
                                let obj = {
                                    filename: element.server_filename,
                                    path: element.path,
                                    fs_id: element.fs_id,
                                    isdir: element.isdir
                                };
                                selectFileList.push(obj);
                            }
                        });
                    }
                });
            });
        }

        function unregisterFileSelect() {
            let $dd = $('div.' + classMap['list-view'] + ' dd');
            $dd.each(function (index, element) {
                $(element).unbind('click');
            });
        }

        //监视文件列表显示变化
        function createObserver() {
            let MutationObserver = window.MutationObserver;
            let options = {
                'childList': true
            };
            observer = new MutationObserver(function (mutations) {
                unregisterCheckbox();
                unregisterAllCheckbox();
                unregisterFileSelect();
                registerCheckbox();
                registerAllCheckbox();
                registerFileSelect();
            });

            let list_view = document.querySelector('.' + classMap['list-view']);
            let grid_view = document.querySelector('.' + classMap['grid-view']);

            observer.observe(list_view, options);
            observer.observe(grid_view, options);
        }

        //获取文件信息列表
        function getFileList() {
            let result = [];
            if (getPath() == '/') {
                result = yunData.FILEINFO;
            } else {
                logid = getLogID();
                let params = {
                    uk: uk,
                    shareid: shareid,
                    order: 'other',
                    desc: 1,
                    showempty: 0,
                    web: web,
                    dir: getPath(),
                    t: Math.random(),
                    bdstoken: bdstoken,
                    channel: channel,
                    clienttype: clienttype,
                    app_id: app_id,
                    logid: logid
                };
                $.ajax({
                    url: shareListUrl,
                    method: 'GET',
                    async: false,
                    data: params,
                    success: function (response) {
                        if (response.errno === 0) {
                            result = response.list;
                        }
                    }
                });
            }
            return result;
        }

        function downloadButtonClick() {
            slog('选中文件列表：', selectFileList);
            if (selectFileList.length === 0) {
                alert(errorMsg.unselected);
                return;
            }
            if (selectFileList.length > 1) {
                return alert(errorMsg.morethan2);
            }

            if (selectFileList[0].isdir == 1) {
                return alert(errorMsg.dir);
            }
            buttonTarget = 'download';
            let downloadLink = getDownloadLink();

            if (downloadLink === undefined) return;

            if (downloadLink.errno == -20) {
                vcode = getVCode();
                if (vcode.errno !== 0) {
                    alert('获取验证码失败！');
                    return;
                }
                vcodeDialog.open(vcode);
            } else if (downloadLink.errno == 112) {
                alert('页面过期，请刷新重试');

            } else if (downloadLink.errno === 0) {
                let link = downloadLink.list[0].dlink;
                execDownload(link);
            } else {
                alert(errorMsg.fail);

            }
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
            let result = getDownloadLinkWithVCode(val);
            if (result.errno == -20) {
                vcodeDialog.close();
                $('#dialog-err').text('验证码输入错误，请重新输入');
                refreshVCode();
                if (!vcode || vcode.errno !== 0) {
                    alert('获取验证码失败！');
                    return;
                }
                vcodeDialog.open();
            } else if (result.errno === 0) {
                vcodeDialog.close();
                if (buttonTarget == 'download') {
                    if (result.list.length > 1 || result.list[0].isdir == 1) {
                        return alert(errorMsg.morethan2);
                    }
                    let link = result.list[0].dlink;
                    execDownload(link);
                } else if (buttonTarget == 'link') {
                    let tip = '直接复制链接无效，请安装 IDM 及浏览器扩展后使用（<a href="https://github.com/syhyz1990/baiduyun/wiki/脚本使用说明" target="_blank">脚本使用说明</a>）';
                    dialog.open({title: '下载链接（仅显示文件链接）', type: 'shareLink', list: result.list, tip: tip});
                }
            } else {
                alert('发生错误！');

            }
        }

        //生成下载用的fid_list参数
        function getFidList() {
            let fidlist = [];
            $.each(selectFileList, function (index, element) {
                fidlist.push(element.fs_id);
            });
            return '[' + fidlist + ']';
        }

        function linkButtonClick() {
            slog('选中文件列表：', selectFileList);
            if (selectFileList.length === 0) {
                return alert(errorMsg.unselected);
            }
            if (selectFileList[0].isdir == 1) {
                return alert(errorMsg.dir);
            }

            buttonTarget = 'link';
            let downloadLink = getDownloadLink();

            if (downloadLink === undefined) return;

            if (downloadLink.errno == -20) {
                vcode = getVCode();
                if (!vcode || vcode.errno !== 0) {
                    return alert('获取验证码失败！');
                }
                vcodeDialog.open(vcode);
            } else if (downloadLink.errno == 112) {
                return alert('页面过期，请刷新重试');
            } else if (downloadLink.errno === 0) {
                let tip = "若IDM下载失败，请使用Aria2c链接或将文件保存至网盘后使用API下载";
                dialog.open({title: '下载链接（仅显示文件链接）', type: 'shareLink', list: downloadLink.list, tip: tip});
            } else {
                alert(errorMsg.fail);
            }
        }

        //获取下载链接
        function getDownloadLink() {
            if (bdstoken === null) {
                alert(errorMsg.unlogin);
                return '';
            } else {
                let result;
                if (isSingleShare) {
                    fid_list = getFidList();
                    logid = getLogID();
                    let url = panAPIUrl + 'sharedownload?sign=' + sign + '&timestamp=' + timestamp + '&bdstoken=' + bdstoken + '&channel=' + channel + '&clienttype=' + clienttype + '&web=' + web + '&app_id=' + app_id + '&logid=' + logid;
                    let params = {
                        encrypt: encrypt,
                        product: product,
                        uk: uk,
                        primaryid: primaryid,
                        fid_list: fid_list
                    };
                    if (shareType == 'secret') {
                        params.extra = extra;
                    }
                    /*if (selectFileList[0].isdir == 1 || selectFileList.length > 1) {
                      params.type = 'batch';
                    }*/
                    $.ajax({
                        url: url,
                        method: 'POST',
                        async: false,
                        data: params,
                        success: function (response) {
                            result = response;
                        }
                    });
                }
                return result;
            }
        }

        //有验证码输入时获取下载链接
        function getDownloadLinkWithVCode(vcodeInput) {
            let result;
            if (isSingleShare) {
                fid_list = getFidList();
                let url = panAPIUrl + 'sharedownload?sign=' + sign + '&timestamp=' + timestamp + '&bdstoken=' + bdstoken + '&channel=' + channel + '&clienttype=' + clienttype + '&web=' + web + '&app_id=' + app_id + '&logid=' + logid;
                let params = {
                    encrypt: encrypt,
                    product: product,
                    vcode_input: vcodeInput,
                    vcode_str: vcode.vcode,
                    uk: uk,
                    primaryid: primaryid,
                    fid_list: fid_list
                };
                if (shareType == 'secret') {
                    params.extra = extra;
                }
                /*if (selectFileList[0].isdir == 1 || selectFileList.length > 1) {
                  params.type = 'batch';
                }*/
                $.ajax({
                    url: url,
                    method: 'POST',
                    async: false,
                    data: params,
                    success: function (response) {
                        result = response;
                    }
                });
            }
            return result;
        }

        function execDownload(link) {
            slog('下载链接：' + link);
            $('#helperdownloadiframe').attr('src', link);
        }
    }

    function base64Encode(t) {
        let a, r, e, n, i, s, o = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        for (e = t.length, r = 0, a = ""; e > r;) {
            if (n = 255 & t.charCodeAt(r++), r == e) {
                a += o.charAt(n >> 2);
                a += o.charAt((3 & n) << 4);
                a += "==";
                break;
            }
            if (i = t.charCodeAt(r++), r == e) {
                a += o.charAt(n >> 2);
                a += o.charAt((3 & n) << 4 | (240 & i) >> 4);
                a += o.charAt((15 & i) << 2);
                a += "=";
                break;
            }
            s = t.charCodeAt(r++);
            a += o.charAt(n >> 2);
            a += o.charAt((3 & n) << 4 | (240 & i) >> 4);
            a += o.charAt((15 & i) << 2 | (192 & s) >> 6);
            a += o.charAt(63 & s);
        }
        return a;
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
        var oDate = new Date();  //创建日期对象
        oDate.setDate(oDate.getDate() + t); //设置过期时间
        document.cookie = key + '=' + value + ';expires=' + oDate.toGMTString();  //设置cookie的名称，数值，过期时间
    }

    function removeCookie(key) {
        setCookie(key, '', -1);  //cookie的过期时间设为昨天
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
            let $dialog_body = $('<div class="dialog-body" style="max-height:450px;overflow-y:auto;padding:0 20px;"></div>');
            let $dialog_tip = $('<div class="dialog-tip" style="padding-left:20px;background-color:#fff;border-top: 1px solid #c4dbfe;color: #dc373c;"><p></p></div>');

            $dialog_div.append($dialog_header.append($dialog_control)).append($dialog_body);

            //let $dialog_textarea = $('<textarea class="dialog-textarea" style="display:none;width"></textarea>');
            let $dialog_radio_div = $('<div class="dialog-radio" style="display:none;width:760px;padding-left:20px;padding-right:20px"></div>');
            let $dialog_radio_multi = $('<input type="radio" name="showmode" checked="checked" value="multi"><span>多行</span>');
            let $dialog_radio_single = $('<input type="radio" name="showmode" value="single"><span>单行</span>');
            $dialog_radio_div.append($dialog_radio_multi).append($dialog_radio_single);
            $dialog_div.append($dialog_radio_div);
            $('input[type=radio][name=showmode]', $dialog_radio_div).change(function () {
                let value = this.value;
                let $textarea = $('div.dialog-body textarea[name=dialog-textarea]', dialog);
                let content = $textarea.val();
                if (value == 'multi') {
                    content = content.replace(/\s+/g, '\n');
                    $textarea.css('height', '300px');
                } else if (value == 'single') {
                    content = content.replace(/\n+/g, ' ');
                    $textarea.css('height', '');
                }
                $textarea.val(content);
            });

            let $dialog_button = $('<div class="dialog-button" style="display:none"></div>');
            let $dialog_button_div = $('<div style="display:table;margin:auto"></div>');
            let $dialog_copy_button = $('<button id="dialog-copy-button" style="display:none;width: 100px; margin: 5px 0 10px 0; cursor: pointer; background: #cc3235; border: none; height: 30px; color: #fff; border-radius: 3px;">复制全部链接</button>');
            let $dialog_edit_button = $('<button id="dialog-edit-button" style="display:none">编辑</button>');
            let $dialog_exit_button = $('<button id="dialog-exit-button" style="display:none">退出</button>');

            $dialog_button_div.append($dialog_copy_button).append($dialog_edit_button).append($dialog_exit_button);
            $dialog_button.append($dialog_button_div);
            $dialog_div.append($dialog_button);

            $dialog_copy_button.click(function () {
                let content = '';
                if (showParams.type == 'batch') {
                    $.each(linkList, function (index, element) {
                        if (element.downloadlink == 'error')
                            return;
                        if (index == linkList.length - 1)
                            content = content + element.downloadlink;
                        else
                            content = content + element.downloadlink + '\r\n';
                    });
                } else if (showParams.type == 'batchAria') {
                    $.each(linkList, function (index, element) {
                        if (element.downloadlink == 'error')
                            return;
                        if (index == linkList.length - 1)
                            content = content + aria2c(element.downloadlink, element.filename);
                        else
                            content = content + aria2c(element.downloadlink, element.filename) + '\r\n';
                    });
                } else if (showParams.type == 'shareAriaLink') {
                    $.each(linkList, function (index, element) {
                        console.log(element)
                        if (element.url == 'error')
                            return;
                        if (index == linkList.length - 1)
                            content = content + aria2c(element.dlink, element.server_filename);
                        else
                            content = aria2c(element.dlink, element.server_filename) + '\r\n'
                    });
                }
                GM_setClipboard(content, 'text');
                alert('已将链接复制到剪贴板！');
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
            $dialog_div.dialogDrag();
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
                    let $div = $('<div><div style="width:30px;float:left">' + element.rank + ':</div><div style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis"><a href="' + element.url + '">' + element.url + '</a></div></div>');

                    $('div.dialog-body', dialog).append($div);
                });
            }
            if (params.type == 'batch' || params.type == 'batchAria') {
                linkList = params.list;
                $('div.dialog-header h3 span.dialog-title', dialog).text(params.title);
                if (params.showall) {
                    $.each(params.list, function (index, element) {
                        let $item_div = $('<div class="item-container" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap"></div>');
                        let $item_name = $('<div style="width:100px;float:left;overflow:hidden;text-overflow:ellipsis" title="' + element.filename + '">' + element.filename + '</div>');
                        let $item_sep = $('<div style="width:12px;float:left"><span>：</span></div>');
                        let $item_link_div = $('<div class="item-link" style="float:left;width:618px;"></div>');
                        let $item_first;
                        if (params.type == 'batchAria') {
                            let link = aria2c(element.downloadlink, element.filename);
                            $item_first = $('<div class="item-first" style="overflow:hidden;text-overflow:ellipsis"><a href="javasctipt:void(0)" class="aria2c-link" alt="双击复制链接地址">' + link + '</a></div>');
                        } else {
                            $item_first = $('<div class="item-first" style="overflow:hidden;text-overflow:ellipsis"><a href="' + element.downloadlink + '">' + element.downloadlink + '</a></div>');
                        }

                        $item_link_div.append($item_first);
                        $.each(params.alllist[index].links, function (n, item) {
                            let $item;
                            if (element.downloadlink == item.url)
                                return;
                            if (params.type == 'batchAria') {
                                let link = aria2c(item.url, element.filename);
                                $item = $('<div class="item-ex" style="display:none;overflow:hidden;text-overflow:ellipsis"><a href="javasctipt:void(0)" class="aria2c-link" alt="双击复制链接地址">' + link + '</a></div>');
                            } else {
                                $item = $('<div class="item-ex" style="display:none;overflow:hidden;text-overflow:ellipsis"><a href="' + item.url + '">' + item.url + '</a></div>');
                            }

                            $item_link_div.append($item);
                        });
                        let $item_ex = $('<div style="width:15px;float:left;cursor:pointer;text-align:center;font-size:16px"><span>+</span></div>');
                        $item_div.append($item_name).append($item_sep).append($item_link_div).append($item_ex);
                        $item_ex.click(function () {
                            let $parent = $(this).parent();
                            $parent.toggleClass('showall');
                            if ($parent.hasClass('showall')) {
                                $(this).text('-');
                                $('div.item-link div.item-ex', $parent).show();
                            } else {
                                $(this).text('+');
                                $('div.item-link div.item-ex', $parent).hide();
                            }
                        });
                        $('div.dialog-body', dialog).append($item_div);
                    });
                } else {
                    $.each(params.list, function (index, element) {
                        let $div;
                        if (params.type == 'batchAria') {
                            let link = aria2c(element.downloadlink, element.filename);
                            $div = $('<div style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap"><div style="width:100px;float:left;overflow:hidden;text-overflow:ellipsis" title="' + element.filename + '">' + element.filename + '</div><span>：</span><a href="javascript:void(0)" class="aria2c-link">' + link + '</a></div>');
                        } else {
                            $div = $('<div style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap"><div style="width:100px;float:left;overflow:hidden;text-overflow:ellipsis" title="' + element.filename + '">' + element.filename + '</div><span>：</span><a href="' + element.downloadlink + '">' + element.downloadlink + '</a></div>');
                        }
                        $('div.dialog-body', dialog).append($div);
                    });
                }
            }
            if (params.type == 'shareLink') {
                linkList = params.list;
                $('div.dialog-header h3 span.dialog-title', dialog).text(params.title);
                $.each(params.list, function (index, element) {
                    if (element.isdir == 1) return;
                    let $div = $('<div style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap"><div style="width:100px;float:left;overflow:hidden;text-overflow:ellipsis" title="' + element.server_filename + '">' + element.server_filename + '</div><span>：</span><a href="' + element.dlink + '">' + element.dlink + '</a></div>');
                    $('div.dialog-body', dialog).append($div);
                });
            }

            if (params.type == 'shareAriaLink') {
                linkList = params.list;
                $('div.dialog-header h3 span.dialog-title', dialog).text(params.title);
                $.each(params.list, function (index, element) {
                    if (element.isdir == 1) return;
                    let link = aria2c(element.dlink, element.server_filename);
                    let $div = $('<div style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap"><div style="width:100px;float:left;overflow:hidden;text-overflow:ellipsis" title="' + element.server_filename + '">' + element.server_filename + '</div><span>：</span><a href="javasctipt:void(0)" class="aria2c-link" alt="双击复制链接地址">' + link + '</a></div>');
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
            if (params.showedit) {
                $('div.dialog-button', dialog).show();
                $('div.dialog-button button#dialog-edit-button', dialog).show();
                let $dialog_textarea = $('<textarea name="dialog-textarea" style="display:none;resize:none;width:758px;height:300px;white-space:pre;word-wrap:normal;overflow-x:scroll"></textarea>');
                let content = '';
                if (showParams.type == 'batch') {
                    $.each(linkList, function (index, element) {
                        if (element.downloadlink == 'error')
                            return;
                        if (index == linkList.length - 1)
                            content = content + element.downloadlink;
                        else
                            content = content + element.downloadlink + '\r\n';
                    });
                } else if (showParams.type == 'link') {
                    $.each(linkList, function (index, element) {
                        if (element.url == 'error')
                            return;
                        if (index == linkList.length - 1)
                            content = content + element.url;
                        else
                            content = content + element.url + '\r\n';
                    });
                }
                $dialog_textarea.val(content);
                $('div.dialog-body', dialog).append($dialog_textarea);
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
            let $dialog_refresh = $('<a href="javascript:void(0)" style="text-decoration:underline;" class="underline">换一张</a>');
            let $dialog_err = $('<div id="dialog-err" style="padding-left:84px;height:18px;color:#d80000" class="verify-error"></div>');
            let $dialog_footer = $('<div class="dialog-footer g-clearfix"></div>');
            let $dialog_confirm_button = $('<a class="g-button g-button-blue" data-button-id="" data-button-index href="javascript:void(0)" style="padding-left:36px"><span class="g-button-right" style="padding-right:36px;"><span class="text" style="width:auto;">确定</span></span></a>');
            let $dialog_cancel_button = $('<a class="g-button" data-button-id="" data-button-index href="javascript:void(0);" style="padding-left: 36px;"><span class="g-button-right" style="padding-right: 36px;"><span class="text" style="width: auto;">取消</span></span></a>');

            $dialog_header.append($dialog_control);
            $dialog_verify_body.append($dialog_input).append($dialog_img).append($dialog_refresh);
            $dialog_body_download_verify.append($dialog_verify_body).append($dialog_err);
            $dialog_body_div.append($dialog_body_download_verify);
            $dialog_body.append($dialog_body_div);
            $dialog_footer.append($dialog_confirm_button).append($dialog_cancel_button);
            $dialog_div.append($dialog_header).append($dialog_body).append($dialog_footer);
            $('body').append($dialog_div);

            $dialog_div.dialogDrag();

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

    $.fn.dialogDrag = function () {
        let mouseInitX, mouseInitY, dialogInitX, dialogInitY;
        let screenWidth = document.body.clientWidth;
        let $parent = this;
        $('div.dialog-header', this).mousedown(function (event) {
            mouseInitX = parseInt(event.pageX);
            mouseInitY = parseInt(event.pageY);
            dialogInitX = parseInt($parent.css('left').replace('px', ''));
            dialogInitY = parseInt($parent.css('top').replace('px', ''));
            $(this).mousemove(function (event) {
                let tempX = dialogInitX + parseInt(event.pageX) - mouseInitX;
                let tempY = dialogInitY + parseInt(event.pageY) - mouseInitY;
                let width = parseInt($parent.css('width').replace('px', ''));
                tempX = tempX < 0 ? 0 : tempX > screenWidth - width ? screenWidth - width : tempX;
                tempY = tempY < 0 ? 0 : tempY;
                $parent.css('left', tempX + 'px').css('top', tempY + 'px');
            });
        });
        $('div.dialog-header', this).mouseup(function (event) {
            $(this).unbind('mousemove');
        });
    };

    (function () {
        let script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "https://js.users.51.la/19988117.js";
        document.getElementsByTagName("head")[0].appendChild(script);

        //解决https无法加载http资源的问题
        let oMeta = document.createElement('meta');
        oMeta.httpEquiv = 'Content-Security-Policy';
        oMeta.content = 'upgrade-insecure-requests';
        document.getElementsByTagName('head')[0].appendChild(oMeta);
    })();

    $(function () {
        classMap['default-dom'] = ($('.icon-upload').parent().parent().parent().parent().parent().attr('class'));
        classMap['bar'] = ($('.icon-upload').parent().parent().parent().parent().attr('class'));
        /*setTimeout(() => {
          let topbar = $('.' + classMap['header']);
          let toptemp = $('<span class="cMEMEF" node-type="help-author"><a href="" style="color: #dd6287" target="_blank">支持作者</a></span>');
          topbar.append(toptemp);
        }, 5000);*/
        switch (detectPage()) {
            case 'disk':
                let panHelper = new PanHelper();
                panHelper.init();
                panHelper.createSideBar();
                return;
            case 'share':
            case 's':
                let panShareHelper = new PanShareHelper();
                panShareHelper.init();
                panShareHelper.createSideBar();
                return;
            default:
                return;
        }
    });

})();
