(function (vc, vm) {

    vc.extends({
        data: {
            deleteFeeDiscountInfo: {

            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('deleteFeeDiscount', 'openDeleteFeeDiscountModal', function (_params) {

                vc.component.deleteFeeDiscountInfo = _params;
                $('#deleteFeeDiscountModel').modal('show');

            });
        },
        methods: {
            deleteFeeDiscount: function () {
                vc.component.deleteFeeDiscountInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    'feeDiscount.deleteFeeDiscount',
                    JSON.stringify(vc.component.deleteFeeDiscountInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteFeeDiscountModel').modal('hide');
                            vc.emit('feeDiscountManage', 'listFeeDiscount', {});
                            return;
                        }
                        vc.message(_json.msg);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.message(json);

                    });
            },
            closeDeleteFeeDiscountModel: function () {
                $('#deleteFeeDiscountModel').modal('hide');
            }
        }
    });

})(window.vc, window.vc.component);
