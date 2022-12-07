(function(vc, vm) {

    vc.extends({
        data: {
            deleteMerchantInfo: {

            }
        },
        _initMethod: function() {

        },
        _initEvent: function() {
            vc.on('deleteMerchant', 'openDeleteMerchantModal', function(_params) {

                vc.component.deleteMerchantInfo = _params;
                $('#deleteMerchantModel').modal('show');

            });
        },
        methods: {
            deleteMerchant: function() {
                vc.http.apiPost(
                    '/property.deleteProperty',
                    JSON.stringify(vc.component.deleteMerchantInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteMerchantModel').modal('hide');
                            vc.emit('merchantManage', 'listMerchant', {});
                            return;
                        }
                        vc.message(_json.msg);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.message(json);

                    });
            },
            closeDeleteMerchantModel: function() {
                $('#deleteMerchantModel').modal('hide');
            }
        }
    });

})(window.vc, window.vc.component);