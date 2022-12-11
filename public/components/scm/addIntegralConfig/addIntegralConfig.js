(function (vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addIntegralConfigInfo: {
                configId: '',
                squarePrice: '',
                additionalAmount: '',
                configName: '',
                computingFormula: '',
                scale: '3',

            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('addIntegralConfig', 'openAddIntegralConfigModal', function () {
                $('#addIntegralConfigModel').modal('show');
            });
        },
        methods: {
            addIntegralConfigValidate() {
                return vc.validate.validate({
                    addIntegralConfigInfo: vc.component.addIntegralConfigInfo
                }, {
                    'addIntegralConfigInfo.squarePrice': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "单价不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "12",
                            errInfo: "单价不能超过12"
                        },
                    ],
                    'addIntegralConfigInfo.additionalAmount': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "固定费不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "12",
                            errInfo: "固定费不能超过12"
                        },
                    ],
                    'addIntegralConfigInfo.configName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "标准名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "100",
                            errInfo: "标准名称不能超过100"
                        },
                    ],
                    'addIntegralConfigInfo.computingFormula': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "计算公式不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "12",
                            errInfo: "计算公式不能超过12"
                        },
                    ],
                    'addIntegralConfigInfo.scale': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "进位不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "12",
                            errInfo: "进位不能超过12"
                        },
                    ],
                });
            },
            saveIntegralConfigInfo: function () {
                if($that.addIntegralConfigInfo.computingFormula == '3003'){
                    $that.addIntegralConfigInfo.squarePrice = '0';
                }else{
                    $that.addIntegralConfigInfo.additionalAmount = '0';
                }
                if (!vc.component.addIntegralConfigValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }

                vc.component.addIntegralConfigInfo.communityId = vc.getCurrentCommunity().communityId;
        
                vc.http.apiPost(
                    '/integral.saveIntegralConfig',
                    JSON.stringify(vc.component.addIntegralConfigInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addIntegralConfigModel').modal('hide');
                            vc.component.clearAddIntegralConfigInfo();
                            vc.emit('integralConfigManage', 'listIntegralConfig', {});
                            return;
                        }
                        vc.toast(_json.msg);

                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            clearAddIntegralConfigInfo: function () {
                vc.component.addIntegralConfigInfo = {
                    squarePrice: '',
                    additionalAmount: '',
                    configName: '',
                    computingFormula: '',
                    scale: '3',

                };
            }
        }
    });

})(window.vc);
