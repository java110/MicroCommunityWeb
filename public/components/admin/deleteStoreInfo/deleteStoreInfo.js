(function(vc, vm) {

    vc.extends({
        data: {
            deleteStoreInfoInfo: {

            }
        },
        _initMethod: function() {

        },
        _initEvent: function() {
            vc.on('deleteStoreInfo', 'openDeleteStoreInfoModal', function(_params) {

                vc.component.deleteStoreInfoInfo = _params;
                $('#deleteStoreInfoModel').modal('show');

            });
        },
        methods: {
            deleteStoreInfo: function() {
                vc.http.apiPost(
                    '/storeInfo/deleteStoreInfo',
                    JSON.stringify(vc.component.deleteStoreInfoInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteStoreInfoModel').modal('hide');
                            vc.emit('storeInfoManage', 'listStoreInfo', {});
                            return;
                        }
                        vc.message(_json.msg);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.message(json);

                    });
            },
            closeDeleteStoreInfoModel: function() {
                $('#deleteStoreInfoModel').modal('hide');
            }
        }
    });

})(window.vc, window.vc.component);