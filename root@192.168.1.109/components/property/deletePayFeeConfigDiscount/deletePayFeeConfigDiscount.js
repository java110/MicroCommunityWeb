(function (vc, vm) {

    vc.extends({
        data: {
            deletePayFeeConfigDiscountInfo: {

            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('deletePayFeeConfigDiscount', 'openDeletePayFeeConfigDiscountModal', function (_params) {

                vc.component.deletePayFeeConfigDiscountInfo = _params;
                $('#deletePayFeeConfigDiscountModel').modal('show');

            });
        },
        methods: {
            deletePayFeeConfigDiscount: function () {
                vc.component.deletePayFeeConfigDiscountInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/payFeeConfigDiscount/deletePayFeeConfigDiscount',
                    JSON.stringify(vc.component.deletePayFeeConfigDiscountInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deletePayFeeConfigDiscountModel').modal('hide');
                            vc.emit('payFeeConfigDiscountManage', 'listPayFeeConfigDiscount', {});
                            return;
                        }
                        vc.message(_json.msg);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.message(json);

                    });
            },
            closeDeletePayFeeConfigDiscountModel: function () {
                $('#deletePayFeeConfigDiscountModel').modal('hide');
            }
        }
    });

})(window.vc, window.vc.component);
