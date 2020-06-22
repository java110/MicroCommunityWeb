/**
    入驻小区
**/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            wechatMenuManageInfo: {
                wechatMenus: [],
                subWechatMenus: [],
                total: 0,
                records: 1,
                moreCondition: false,
                wechatMenuId: '',
                curParentMenuId: ''
            }
        },
        _initMethod: function () {
            vc.component._listWechatMenus(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {

            vc.on('wechatMenuManage', 'listWechatMenu', function (_param) {
                vc.component._listWechatMenus(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listWechatMenus(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listWechatMenus: function (_page, _rows) {
                var param = {
                    params: {
                        page: 1,
                        row: 3,
                        communityId: vc.getCurrentCommunity().communityId,
                        menuLevel: '101'
                    }
                };

                //发送get请求
                vc.http.apiGet('smallWeChat.listWechatMenus',
                    param,
                    function (json, res) {
                        var _wechatMenuManageInfo = JSON.parse(json);
                        vc.component.wechatMenuManageInfo.wechatMenus = _wechatMenuManageInfo.data;
                        if(_wechatMenuManageInfo.data.length > 0){
                            $that.wechatMenuManageInfo.curParentMenuId = _wechatMenuManageInfo.data[0].wechatMenuId;
                            $that._listSubWechatMenus();
                        } 
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },

            _listSubWechatMenus: function () {

                if($that.wechatMenuManageInfo.curParentMenuId == ''){
                    return ;
                }

                var param = {
                    params: {
                        page: 1,
                        row: 5,
                        communityId: vc.getCurrentCommunity().communityId,
                        parentMenuId: $that.wechatMenuManageInfo.curParentMenuId,
                        menuLevel: '202'
                    }
                };

                //发送get请求
                vc.http.apiGet('smallWeChat.listWechatMenus',
                    param,
                    function (json, res) {
                        var _wechatMenuManageInfo = JSON.parse(json);
                        vc.component.wechatMenuManageInfo.subWechatMenus = _wechatMenuManageInfo.data;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddWechatMenuModal: function (_menuLevel) {
                let _parentMenuId = '-1';
                if(_menuLevel == '202'){
                    _parentMenuId = $that.wechatMenuManageInfo.curParentMenuId;
                    if(_parentMenuId == ''){
                        vc.toast("请先选择一级菜单");
                        return ;
                    }
                }else{
                    $that.wechatMenuManageInfo.curParentMenuId = '-1';
                }
                vc.emit('addWechatMenu', 'openAddWechatMenuModal', {
                    menuLevel:_menuLevel,
                    parentMenuId: _parentMenuId
                });
            },
            _openEditWechatMenuModel: function (_wechatMenu) {
                vc.emit('editWechatMenu', 'openEditWechatMenuModal', _wechatMenu);
            },
            _openDeleteWechatMenuModel: function (_wechatMenu) {
                vc.emit('deleteWechatMenu', 'openDeleteWechatMenuModal', _wechatMenu);
            },
            _queryWechatMenuMethod: function () {
                vc.component._listWechatMenus(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            selectMenu: function (_wechatMenu) {
                $that.wechatMenuManageInfo.curParentMenuId = _wechatMenu.wechatMenuId;
                $that._listSubWechatMenus();
            },
            _publishMenu:function(){
                //发布菜单
            }


        }
    });
})(window.vc);
