(function(vc, vm) {

    vc.extends({
        data: {
            deleteCouponPoolInfo: {

            }
        },
        _initMethod: function() {

        },
        _initEvent: function() {
            vc.on('deleteCouponPool', 'openDeleteCouponPoolModal', function(_params) {

                vc.component.deleteCouponPoolInfo = _params;
                $('#deleteCouponPoolModel').modal('show');

            });
        },
        methods: {
            deleteCouponPool: function() {
                vc.http.apiPost(
                    'couponPool.deleteCouponPool',
                    JSON.stringify(vc.component.deleteCouponPoolInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteCouponPoolModel').modal('hide');
                            vc.emit('couponPoolManage', 'listCouponPool', {});
                            return;
                        }
                        vc.message(_json.msg);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.message(json);

                    });
            },
            closeDeleteCouponPoolModel: function() {
                $('#deleteCouponPoolModel').modal('hide');
            }
        }
    });

})(window.vc, window.vc.component);