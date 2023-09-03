(function(vc, vm) {

    vc.extends({
        data: {
            deleteParkingCouponInfo: {

            }
        },
        _initMethod: function() {

        },
        _initEvent: function() {
            vc.on('deleteParkingCoupon', 'openDeleteParkingCouponModal', function(_params) {

                vc.component.deleteParkingCouponInfo = _params;
                $('#deleteParkingCouponModel').modal('show');

            });
        },
        methods: {
            deleteParkingCoupon: function() {
                vc.component.deleteParkingCouponInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/parkingCoupon.deleteParkingCoupon',
                    JSON.stringify(vc.component.deleteParkingCouponInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteParkingCouponModel').modal('hide');
                            vc.emit('parkingCouponManage', 'listParkingCoupon', {});
                            return;
                        }
                        vc.message(_json.msg);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.message(json);

                    });
            },
            closeDeleteParkingCouponModel: function() {
                $('#deleteParkingCouponModel').modal('hide');
            }
        }
    });

})(window.vc, window.vc.component);