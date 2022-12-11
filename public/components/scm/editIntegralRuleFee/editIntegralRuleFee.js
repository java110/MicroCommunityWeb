(function (vc, vm) {

    vc.extends({
        data: {
            editIntegralRuleFeeInfo: {
                irfId: '',
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
            vc.on('editIntegralRuleFee', 'openEditIntegralRuleFeeModal', function (_params) {
                vc.component.refreshEditIntegralRuleFeeInfo();
                $('#editIntegralRuleFeeModel').modal('show');
                $that._listEditIntegralConfigFees();
                vc.copyObject(_params, vc.component.editIntegralRuleFeeInfo);
                vc.component.editIntegralRuleFeeInfo.communityId = vc.getCurrentCommunity().communityId;
                setTimeout(function(){
                    $that._initEditIntegralRuleFeeDate();
                },1000)
            });
        },
        methods: {
            _initEditIntegralRuleFeeDate:function(){
                vc.initDateTime('editPayStartTime',function(_value){
                    $that.editIntegralRuleFeeInfo.payStartTime = _value;
                });
                vc.initDateTime('editPayEndTime',function(_value){
                    $that.editIntegralRuleFeeInfo.payEndTime = _value;
                })
            },
            editIntegralRuleFeeValidate: function () {
                return vc.validate.validate({
                    editIntegralRuleFeeInfo: vc.component.editIntegralRuleFeeInfo
                }, {
                    'editIntegralRuleFeeInfo.ruleId': [
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
                    'editIntegralRuleFeeInfo.feeConfigId': [
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
                    'editIntegralRuleFeeInfo.payStartTime': [
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
                    'editIntegralRuleFeeInfo.payEndTime': [
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
                    'editIntegralRuleFeeInfo.payMonth': [
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
                    'editIntegralRuleFeeInfo.irfId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "编号不能为空"
                        }]

                });
            },
            editIntegralRuleFee: function () {
                if (!vc.component.editIntegralRuleFeeValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }

                vc.http.apiPost(
                    '/integral.updateIntegralRuleFee',
                    JSON.stringify(vc.component.editIntegralRuleFeeInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editIntegralRuleFeeModel').modal('hide');
                            vc.emit('integralRuleFeeManage', 'listIntegralRuleFee', {});
                            return;
                        }
                        vc.message(_json.msg);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);
                    });
            },
            refreshEditIntegralRuleFeeInfo: function () {
                vc.component.editIntegralRuleFeeInfo = {
                    irfId: '',
                    ruleId: '',
                    feeConfigId: '',
                    payStartTime: '',
                    payEndTime: '',
                    payMonth: '',
                    feeConfigs:[]
                }
            },
            _listEditIntegralConfigFees: function (_page, _rows) {
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
                        var _integralPropertyPoolManageInfo = JSON.parse(json);
                        vc.component.editIntegralRuleFeeInfo.feeConfigs = _integralPropertyPoolManageInfo.feeConfigs;
                       
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
        }
    });

})(window.vc, window.vc.component);
