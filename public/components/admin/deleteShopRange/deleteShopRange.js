(function (vc, vm) {

    vc.extends({
        data: {
            deleteShopRangeInfo: {

            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('deleteShopRange', 'openDeleteShopRangeModal', function (_params) {

                vc.component.deleteShopRangeInfo = _params;
                $('#deleteShopRangeModel').modal('show');

            });
        },
        methods: {
            deleteShopRange: function () {
                vc.http.apiPost(
                    '/shopRange/deleteShopRange',
                    JSON.stringify(vc.component.deleteShopRangeInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteShopRangeModel').modal('hide');
                            vc.emit('shopRangeManage', 'listShopRange', {});
                            return;
                        }
                        vc.message(_json.msg);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.message(json);

                    });
            },
            closeDeleteShopRangeModel: function () {
                $('#deleteShopRangeModel').modal('hide');
            }
        }
    });

})(window.vc, window.vc.component);
