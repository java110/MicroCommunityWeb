(function (vc, vm) {

    vc.extends({
        data: {
            deleteCouponDetailInfo: {

            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('deleteCouponDetail', 'openDeleteCouponDetailModal', function (_params) {

                vc.component.deleteCouponDetailInfo = _params;
                $('#deleteCouponDetailModel').modal('show');

            });
        },
        methods: {
            deleteCouponDetail: function () {
                vc.component.deleteCouponDetailInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    'couponDetail.deleteCouponDetail',
                    JSON.stringify(vc.component.deleteCouponDetailInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteCouponDetailModel').modal('hide');
                            vc.emit('couponDetailManage', 'listCouponDetail', {});
                            return;
                        }
                        vc.message(_json.msg);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.message(json);

                    });
            },
            closeDeleteCouponDetailModel: function () {
                $('#deleteCouponDetailModel').modal('hide');
            }
        }
    });

})(window.vc, window.vc.component);
