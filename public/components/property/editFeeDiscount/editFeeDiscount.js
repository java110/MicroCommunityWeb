(function (vc, vm) {

    vc.extends({
        data: {
            editFeeDiscountInfo: {
                discountId: '',
                discountName: '',
                discountType: '',
                ruleId: '',
                discountDesc: '',

            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('editFeeDiscount', 'openEditFeeDiscountModal', function (_params) {
                vc.component.refreshEditFeeDiscountInfo();
                $('#editFeeDiscountModel').modal('show');
                vc.copyObject(_params, vc.component.editFeeDiscountInfo);
                vc.component.editFeeDiscountInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods: {
            editFeeDiscountValidate: function () {
                return vc.validate.validate({
                    editFeeDiscountInfo: vc.component.editFeeDiscountInfo
                }, {
                    'editFeeDiscountInfo.discountName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "折扣名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "256",
                            errInfo: "折扣名称不能超过256位"
                        },
                    ],
                    'editFeeDiscountInfo.discountType': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "折扣类型不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "折扣类型格式错误"
                        },
                    ],
                    'editFeeDiscountInfo.ruleId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "规则不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "规则不是有效数字"
                        },
                    ],
                    'editFeeDiscountInfo.discountDesc': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "描述不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "",
                            errInfo: "描述不能超过500位"
                        },
                    ],
                    'editFeeDiscountInfo.discountId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "折扣ID不能为空"
                        }]

                });
            },
            editFeeDiscount: function () {
                if (!vc.component.editFeeDiscountValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }

                vc.http.apiPost(
                    'feeDiscount.updateFeeDiscount',
                    JSON.stringify(vc.component.editFeeDiscountInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editFeeDiscountModel').modal('hide');
                            vc.emit('feeDiscountManage', 'listFeeDiscount', {});
                            return;
                        }
                        vc.message(_json.msg);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);
                    });
            },
            refreshEditFeeDiscountInfo: function () {
                vc.component.editFeeDiscountInfo = {
                    discountId: '',
                    discountName: '',
                    discountType: '',
                    ruleId: '',
                    discountDesc: '',

                }
            }
        }
    });

})(window.vc, window.vc.component);
