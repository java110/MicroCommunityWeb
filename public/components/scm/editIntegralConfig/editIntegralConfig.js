(function (vc, vm) {

    vc.extends({
        data: {
            editIntegralConfigInfo: {
                configId: '',
                squarePrice: '',
                additionalAmount: '',
                configName: '',
                computingFormula: '',
                scale: '',

            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('editIntegralConfig', 'openEditIntegralConfigModal', function (_params) {
                vc.component.refreshEditIntegralConfigInfo();
                $('#editIntegralConfigModel').modal('show');
                vc.copyObject(_params, vc.component.editIntegralConfigInfo);
                vc.component.editIntegralConfigInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods: {
            editIntegralConfigValidate: function () {
                return vc.validate.validate({
                    editIntegralConfigInfo: vc.component.editIntegralConfigInfo
                }, {
                    'editIntegralConfigInfo.squarePrice': [
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
                    'editIntegralConfigInfo.additionalAmount': [
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
                    'editIntegralConfigInfo.configName': [
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
                    'editIntegralConfigInfo.computingFormula': [
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
                    'editIntegralConfigInfo.scale': [
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
                    'editIntegralConfigInfo.configId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "积分标准不能为空"
                        }]

                });
            },
            editIntegralConfig: function () {
                if($that.editIntegralConfigInfo.computingFormula == '3003'){
                    $that.editIntegralConfigInfo.squarePrice = '0';
                }else{
                    $that.editIntegralConfigInfo.additionalAmount = '0';
                }
                if (!vc.component.editIntegralConfigValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }

                vc.http.apiPost(
                    '/integral.updateIntegralConfig',
                    JSON.stringify(vc.component.editIntegralConfigInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editIntegralConfigModel').modal('hide');
                            vc.emit('integralConfigManage', 'listIntegralConfig', {});
                            return;
                        }
                        vc.message(_json.msg);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);
                    });
            },
            refreshEditIntegralConfigInfo: function () {
                vc.component.editIntegralConfigInfo = {
                    configId: '',
                    squarePrice: '',
                    additionalAmount: '',
                    configName: '',
                    computingFormula: '',
                    scale: '',

                }
            }
        }
    });

})(window.vc, window.vc.component);
