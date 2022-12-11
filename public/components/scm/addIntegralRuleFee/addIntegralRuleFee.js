(function (vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addIntegralRuleFeeInfo: {
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
            vc.on('addIntegralRuleFee', 'openAddIntegralRuleFeeModal', function (_param) {
                vc.copyObject(_param,$that.addIntegralRuleFeeInfo);
                $that._listAddIntegralConfigFees();
                $('#addIntegralRuleFeeModel').modal('show');
                setTimeout(function(){
                    $that._initAddIntegralRuleFeeDate();
                },1000)
            });
        },
        methods: {
            _initAddIntegralRuleFeeDate:function(){
                vc.initDateTime('addPayStartTime',function(_value){
                    $that.addIntegralRuleFeeInfo.payStartTime = _value;
                });
                vc.initDateTime('addPayEndTime',function(_value){
                    $that.addIntegralRuleFeeInfo.payEndTime = _value;
                })
            },
            addIntegralRuleFeeValidate() {
                return vc.validate.validate({
                    addIntegralRuleFeeInfo: vc.component.addIntegralRuleFeeInfo
                }, {
                    'addIntegralRuleFeeInfo.ruleId': [
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
                    'addIntegralRuleFeeInfo.feeConfigId': [
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
                    'addIntegralRuleFeeInfo.payStartTime': [
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
                    'addIntegralRuleFeeInfo.payEndTime': [
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
                    'addIntegralRuleFeeInfo.payMonth': [
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
            saveIntegralRuleFeeInfo: function () {
                if (!vc.component.addIntegralRuleFeeValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.component.addIntegralRuleFeeInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/integral.saveIntegralRuleFee',
                    JSON.stringify(vc.component.addIntegralRuleFeeInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addIntegralRuleFeeModel').modal('hide');
                            vc.component.clearAddIntegralRuleFeeInfo();
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
            clearAddIntegralRuleFeeInfo: function () {
                vc.component.addIntegralRuleFeeInfo = {
                    ruleId: '',
                    feeConfigId: '',
                    payStartTime: '',
                    payEndTime: '',
                    payMonth: '',
                    feeConfigs:[]

                };
            },
            _listAddIntegralConfigFees: function (_page, _rows) {
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
                        vc.component.addIntegralRuleFeeInfo.feeConfigs = _integralPropertyPoolManageInfo.feeConfigs;
                       
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
        }
    });

})(window.vc);
