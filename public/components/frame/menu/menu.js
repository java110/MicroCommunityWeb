/**
 菜单 处理
 **/
(function(vc) {
    var vm = new Vue({
        el: '#menu-nav',
        data: {
            menus: [],
            logo: '',
        },
        mounted: function() {
            this._initSysInfo();

            //监听 菜单目录改变
            document.body.addEventListener('loadMenu', function(_param) {
                vm.getMenus(_param.detail);
            }, false);
            let _menuDiv = document.getElementById('menu-nav');
            vcFramework.eleResize.on(_menuDiv, function() {
                //console.log('resize', '大小修改了');
                vcFramework._fix_height(_menuDiv);
            });
            window.onscroll = function() {
                //为了保证兼容性，这里取两个值，哪个有值取哪一个
                //scrollTop就是触发滚轮事件时滚轮的高度
                let _menuDivb = document.getElementById('menu-nav');
                vcFramework._fix_height(_menuDivb);
            }
        },
        methods: {
            _initSysInfo: function() {
                let sysInfo = vc.getData("_sysInfo");
                if (sysInfo == null) {
                    this.logo = "HC";
                    return;
                }
                this.logo = sysInfo.logo;
            },
            _gotoIndex: function() {
                vc.jumpToPage("/")
            },
            getMenus: function(_catalog) {
                let _param = {
                        params: {
                            caId: _catalog.caId
                        }
                    }
                    //发送get请求
                vc.http.apiGet('/menu.listCatalogMenus',
                    _param,
                    function(json, res) {
                        let _menuData = JSON.parse(json);
                        if (_menuData.code != 0) {
                            return;
                        }
                        let _menus = _menuData.data;
                        if (_menus == null || _menus.length == 0) {
                            return;
                        }
                        _menus.sort(function(a, b) {
                            return a.seq - b.seq
                        });
                        var _currentMenusId = vc.getCurrentMenu() == null ? _menus[0].id : vc.getCurrentMenu();
                        vm.menus = vm.refreshMenuActive(_menus, _currentMenusId);
                        vc.setMenus(vm.menus);
                        vm.miniMenu();
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            refreshMenuActive: function(jsonArray, _id) {
                for (var menuIndex = 0; menuIndex < jsonArray.length; menuIndex++) {

                    if (jsonArray[menuIndex].hasOwnProperty('childs')) {
                        var _childs = jsonArray[menuIndex].childs;
                        _childs.sort(function(_child, _newChild) {
                            return _child.seq - _newChild.seq
                        });
                        jsonArray[menuIndex].childs = _childs;
                    }

                    if (_id === jsonArray[menuIndex].id) {
                        if (jsonArray[menuIndex].active === true) {
                            //如果当前本身是打开状态，说明 需要关闭
                            jsonArray[menuIndex].active = false;
                            continue;
                        }
                        jsonArray[menuIndex].active = true;
                        continue;
                    }
                    jsonArray[menuIndex].active = false;
                }


                return jsonArray;
            },
            switchMenu: function(_id) {
                //设置菜单ID
                vc.setCurrentMenu(_id);
                vm.menus = vm.refreshMenuActive(vm.menus, _id);
                vc.setMenus(vm.menus);
                //vc._fix_height()
            },
            miniMenu: function() {

                //菜单默认为打开方式
                if (!vc.notNull(vc.getMenuState())) {
                    vc.setMenuState('ON');
                }

                if (vc.notNull(vc.getMenuState()) && vc.getMenuState() == 'ON') {
                    return;
                }

                $("body").toggleClass("mini-navbar");
                vc.setMenuState('OFF');
            },
            _gotoPage: function(_href, _tabName) {
                // 子菜单默认选中
                this._setSelectedMenusChild(_href);
                if (_href.indexOf('?') > -1) {
                    _href += ("&tab=" + _tabName)
                } else {
                    _href += ("?tab=" + _tabName)
                }
                vc.jumpToPage(_href);
            },

            // 子菜单默认选中
            _setSelectedMenusChild(_href) {
                for (var menuIndex = 0; menuIndex < this.menus.length; menuIndex++) {
                    if (this.menus[menuIndex].hasOwnProperty('childs')) {
                        var _childs = this.menus[menuIndex].childs;
                        for (var childIndex = 0; childIndex < _childs.length; childIndex++) {
                            if (_href == _childs[childIndex].href) {
                                this.menus[menuIndex].childs[childIndex].active = true;
                            } else {
                                this.menus[menuIndex].childs[childIndex].active = false;
                            }
                        }
                    }
                }
                this.$forceUpdate();
            }

        },

    });

})(window.vc)