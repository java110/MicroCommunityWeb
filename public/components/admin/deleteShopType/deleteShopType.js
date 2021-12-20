(function(vc, vm) {

    vc.extends({
        data: {
            deleteShopTypeInfo: {

            }
        },
        _initMethod: function() {

        },
        _initEvent: function() {
            vc.on('deleteShopType', 'openDeleteShopTypeModal', function(_params) {

                vc.component.deleteShopTypeInfo = _params;
                $('#deleteShopTypeModel').modal('show');

            });
        },
        methods: {
            deleteShopType: function() {
                vc.http.apiPost(
                    '/shopType/deleteShopType',
                    JSON.stringify(vc.component.deleteShopTypeInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteShopTypeModel').modal('hide');
                            vc.emit('shopTypeManage', 'listShopType', {});
                            return;
                        }
                        vc.message(_json.msg);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.message(json);

                    });
            },
            closeDeleteShopTypeModel: function() {
                $('#deleteShopTypeModel').modal('hide');
            }
        }
    });

})(window.vc, window.vc.component);