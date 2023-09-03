(function(vc, vm) {

    vc.extends({
        data: {
            deleteWechatMenuInfo: {
                msg: ''
            }
        },
        _initMethod: function() {

        },
        _initEvent: function() {
            vc.on('deleteWechatMenu', 'openDeleteWechatMenuModal', function(_params) {
                $that.deleteWechatMenuInfo.msg = '';
                vc.component.deleteWechatMenuInfo = _params;
                if (_params.menuLevel == '101') {
                    $that.deleteWechatMenuInfo.msg = '当前删除为一级菜单，自动删除其二级菜单';
                }
                $('#deleteWechatMenuModel').modal('show');

            });
        },
        methods: {
            deleteWechatMenu: function() {
                vc.component.deleteWechatMenuInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/smallWeChat.deleteWechatMenu',
                    JSON.stringify(vc.component.deleteWechatMenuInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        if (res.status == 200) {
                            //关闭model
                            $('#deleteWechatMenuModel').modal('hide');
                            vc.emit('wechatMenuManage', 'listWechatMenu', {});
                            return;
                        }
                        vc.message(json);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.message(json);

                    });
            },
            closeDeleteWechatMenuModel: function() {
                $('#deleteWechatMenuModel').modal('hide');
            }
        }
    });

})(window.vc, window.vc.component);