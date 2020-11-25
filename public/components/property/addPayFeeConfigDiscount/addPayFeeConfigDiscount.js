(function (vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addPayFeeConfigDiscountInfo: {
                configDiscountId: '',
                discountId: '',
                configId: '',
                discountType: '',
                discounts: [],
            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('addPayFeeConfigDiscount', 'openAddPayFeeConfigDiscountModal', function (_param) {

                vc.copyObject(_param, $that.addPayFeeConfigDiscountInfo);
                $('#addPayFeeConfigDiscountModel').modal('show');
            });
        },
        methods: {
            addPayFeeConfigDiscountValidate() {
                return vc.validate.validate({
                    addPayFeeConfigDiscountInfo: vc.component.addPayFeeConfigDiscountInfo
                }, {
                    'addPayFeeConfigDiscountInfo.configId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "费用项不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "费用项格式错误"
                        },
                    ],
                    'addPayFeeConfigDiscountInfo.discountId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "折扣名称不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "折扣格式错误"
                        },
                    ]
                });
            },
            savePayFeeConfigDiscountInfo: function () {
                if (!vc.component.addPayFeeConfigDiscountValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }

                vc.component.addPayFeeConfigDiscountInfo.communityId = vc.getCurrentCommunity().communityId;
                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.addPayFeeConfigDiscountInfo);
                    $('#addPayFeeConfigDiscountModel').modal('hide');
                    return;
                }

                vc.http.apiPost(
                    '/payFeeConfigDiscount/savePayFeeConfigDiscount',
                    JSON.stringify(vc.component.addPayFeeConfigDiscountInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addPayFeeConfigDiscountModel').modal('hide');
                            vc.component.clearAddPayFeeConfigDiscountInfo();
                            vc.emit('payFeeConfigDiscountManage', 'listPayFeeConfigDiscount', {});

                            return;
                        }
                        vc.message(_json.msg);

                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);

                    });
            },
            clearAddPayFeeConfigDiscountInfo: function () {
                vc.component.addPayFeeConfigDiscountInfo = {
                    configDiscountId: '',
                    discountId: '',
                    configId: '',
                    discountType: '',
                    discounts: []
                };
            },
            _changeAddPayFeeConfigDiscountType: function () {

                if ($that.addPayFeeConfigDiscountInfo.discountType == '') {
                    return;
                }
                $that.addPayFeeConfigDiscountInfo.discounts = [];
                var param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId,
                        discountType: $that.addPayFeeConfigDiscountInfo.discountType
                    }
                };
                //发送get请求
                vc.http.apiGet('/feeDiscount/queryFeeDiscount',
                    param,
                    function (json, res) {
                        let _feeDiscountManageInfo = JSON.parse(json);
                        
                        $that.addPayFeeConfigDiscountInfo.discounts = _feeDiscountManageInfo.data;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            }
        }
    });

})(window.vc);
