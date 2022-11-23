(function (vc, vm) {

    vc.extends({
        data: {
            editCouponRuleFeeInfo: {
                crfId: '',
                ruleId: '',
                feeConfigId: '',
                payStartTime: '',
                payEndTime: '',
                payMonth: '',
                feeConfigs:[]

            }
        },
        _initMethod: function () {
           
            

        },
        _initEvent: function () {
            vc.on('editCouponRuleFee', 'openEditCouponRuleFeeModal', function (_params) {
                vc.component.refreshEditCouponRuleFeeInfo();
                $('#editCouponRuleFeeModel').modal('show');
                $that._listEditCouponConfigFees();
                vc.copyObject(_params, vc.component.editCouponRuleFeeInfo);
                vc.component.editCouponRuleFeeInfo.communityId = vc.getCurrentCommunity().communityId;
                setTimeout(function(){
                    $that._initEditCouponRuleFeeDate();
                },1000)
            });
        },
        methods: {
            _initEditCouponRuleFeeDate:function(){
                vc.initDateTime('editPayStartTime',function(_value){
                    $that.editCouponRuleFeeInfo.payStartTime = _value;
                });
                vc.initDateTime('editPayEndTime',function(_value){
                    $that.editCouponRuleFeeInfo.payEndTime = _value;
                })
            },
            editCouponRuleFeeValidate: function () {
                return vc.validate.validate({
                    editCouponRuleFeeInfo: vc.component.editCouponRuleFeeInfo
                }, {
                    'editCouponRuleFeeInfo.ruleId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "规则ID不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "30",
                            errInfo: "规则ID不能超过30"
                        },
                    ],
                    'editCouponRuleFeeInfo.feeConfigId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "费用不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "费用不能超过64"
                        },
                    ],
                    'editCouponRuleFeeInfo.payStartTime': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "缴费开始时间不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "缴费开始时间不能超过64"
                        },
                    ],
                    'editCouponRuleFeeInfo.payEndTime': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "缴费结束时间不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "缴费结束时间不能超过64"
                        },
                    ],
                    'editCouponRuleFeeInfo.payMonth': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "缴费月不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "缴费月不能超过64"
                        },
                    ],
                    'editCouponRuleFeeInfo.crfId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "编号不能为空"
                        }]

                });
            },
            editCouponRuleFee: function () {
                if (!vc.component.editCouponRuleFeeValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }

                vc.http.apiPost(
                    '/couponRule.updateCouponRuleFee',
                    JSON.stringify(vc.component.editCouponRuleFeeInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editCouponRuleFeeModel').modal('hide');
                            vc.emit('couponRuleFeeManage', 'listCouponRuleFee', {});
                            return;
                        }
                        vc.message(_json.msg);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);
                    });
            },
            refreshEditCouponRuleFeeInfo: function () {
                vc.component.editCouponRuleFeeInfo = {
                    crfId: '',
                    ruleId: '',
                    feeConfigId: '',
                    payStartTime: '',
                    payEndTime: '',
                    payMonth: '',
                    feeConfigs:[]
                }
            },
            _listEditCouponConfigFees: function (_page, _rows) {
                let param = {
                    params: {
                        page:1,
                        row:100,
                        communityId:vc.getCurrentCommunity().communityId
                    }
                };

                //发送get请求
                vc.http.apiGet('/feeConfig.listFeeConfigs',
                    param,
                    function (json, res) {
                        var _couponPropertyPoolManageInfo = JSON.parse(json);
                        vc.component.editCouponRuleFeeInfo.feeConfigs = _couponPropertyPoolManageInfo.feeConfigs;
                       
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
        }
    });

})(window.vc, window.vc.component);
