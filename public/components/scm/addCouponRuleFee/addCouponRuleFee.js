(function (vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addCouponRuleFeeInfo: {
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
            vc.on('addCouponRuleFee', 'openAddCouponRuleFeeModal', function (_param) {
                vc.copyObject(_param,$that.addCouponRuleFeeInfo);
                $that._listAddCouponConfigFees();
                $('#addCouponRuleFeeModel').modal('show');
                setTimeout(function(){
                    $that._initAddCouponRuleFeeDate();
                },1000)
            });
        },
        methods: {
            _initAddCouponRuleFeeDate:function(){
                vc.initDateTime('addPayStartTime',function(_value){
                    $that.addCouponRuleFeeInfo.payStartTime = _value;
                });
                vc.initDateTime('addPayEndTime',function(_value){
                    $that.addCouponRuleFeeInfo.payEndTime = _value;
                })
            },
            addCouponRuleFeeValidate() {
                return vc.validate.validate({
                    addCouponRuleFeeInfo: vc.component.addCouponRuleFeeInfo
                }, {
                    'addCouponRuleFeeInfo.ruleId': [
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
                    'addCouponRuleFeeInfo.feeConfigId': [
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
                    'addCouponRuleFeeInfo.payStartTime': [
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
                    'addCouponRuleFeeInfo.payEndTime': [
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
                    'addCouponRuleFeeInfo.payMonth': [
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
                });
            },
            saveCouponRuleFeeInfo: function () {
                if (!vc.component.addCouponRuleFeeValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.component.addCouponRuleFeeInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/couponRule.saveCouponRuleFee',
                    JSON.stringify(vc.component.addCouponRuleFeeInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addCouponRuleFeeModel').modal('hide');
                            vc.component.clearAddCouponRuleFeeInfo();
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
            clearAddCouponRuleFeeInfo: function () {
                vc.component.addCouponRuleFeeInfo = {
                    ruleId: '',
                    feeConfigId: '',
                    payStartTime: '',
                    payEndTime: '',
                    payMonth: '',
                    feeConfigs:[]

                };
            },
            _listAddCouponConfigFees: function (_page, _rows) {
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
                        vc.component.addCouponRuleFeeInfo.feeConfigs = _couponPropertyPoolManageInfo.feeConfigs;
                       
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
        }
    });

})(window.vc);
