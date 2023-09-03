/**
    菜单 处理
**/
(function(vc) {
    var vm = new Vue({
        el: '#breadcrumb',
        data: {
            breadCrumbs: [],
            indexPage: 1,
        },
        mounted: function() {
            //this._freshBreadCrumbByUrl();
            // 监听事件
            document.addEventListener('initVcFrameworkFinish', function(e) {
                // e.target matches elem
                vm.breadCrumbs = [];
                vm._freshBreadCrumbByUrl();

                let _hash = location.hash

                if (!_hash) {
                    vm.indexPage = '0';
                    return;
                }
                if (_hash.indexOf('?') != -1) {
                    _hash = _hash.substring(0, _hash.indexOf('?'));
                }

                if (!_hash) {
                    vm.indexPage = '0';
                    return;
                }
                vm.indexPage = '1';

            }, false);

        },
        methods: {
            _freshBreadCrumbByUrl: function() {

                let tabs = vc.getTabFromLocal();
                let _curPath = location.hash;
                if (_curPath.indexOf('?') != -1) {
                    _curPath = _curPath.substring(0, _curPath.indexOf('?'));
                }
                tabs.forEach(item => {
                    let _path = item.url;
                    if (_path.indexOf('?') != -1) {
                        _path = _path.substring(0, _path.indexOf('?'));
                    }
                    _tmpBreadCrumbInf = {
                        href: item.url,
                        pageName: item.name,
                        active: '0'
                    };
                    if (_path == _curPath) {
                        _tmpBreadCrumbInf.active = '1'
                    }
                    this.breadCrumbs.push(_tmpBreadCrumbInf);
                });
            },

            _getRealUrl: function(_url) {
                if (_url.indexOf('?') != -1) {
                    return _url.substring(0, _url.indexOf('?'));
                }
                return _url;
            },
            _changeSmallTab: function(_item) {
                vc.jumpToPage(vc.getUrl() + _item.href)
            },
            _deleteSmallTab: function(_item) {
                let _tabs = vc.getTabFromLocal();
                _item.url = _item.href;
                vc.deleteTabToLocal(_item);
                vm.breadCrumbs = [];
                if (_item.active == '0') {
                    vm._freshBreadCrumbByUrl();
                    return;
                }
                if (_tabs.length == 1) {
                    vc.jumpToPage("/");
                    return;
                }
                vc.jumpToPage(vc.getUrl() + _tabs[_tabs.length - 2].url);
            }
        },

    });

})(window.vc)