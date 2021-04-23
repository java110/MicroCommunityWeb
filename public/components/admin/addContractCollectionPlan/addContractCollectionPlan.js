(function (vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addContractCollectionPlanInfo: {
                planId: '',
                planName: '',
                contractCode: '',
                feeName: '',
                remark: '',

            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('addContractCollectionPlan', 'openAddContractCollectionPlanModal', function () {
                $('#addContractCollectionPlanModel').modal('show');
            });
        },
        methods: {
            addContractCollectionPlanValidate() {
                return vc.validate.validate({
                    addContractCollectionPlanInfo: vc.component.addContractCollectionPlanInfo
                }, {
                    'addContractCollectionPlanInfo.planName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "计划名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "128",
                            errInfo: "计划名称太长"
                        },
                    ],
                    'addContractCollectionPlanInfo.contractCode': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "合同号不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "30",
                            errInfo: "合同号格式错误"
                        },
                    ],
                    'addContractCollectionPlanInfo.feeName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "费用不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "128",
                            errInfo: "费用不正确"
                        },
                    ],
                    'addContractCollectionPlanInfo.remark': [
                        {
                            limit: "maxLength",
                            param: "512",
                            errInfo: "备注太长"
                        },
                    ],




                });
            },
            saveContractCollectionPlanInfo: function () {
                if (!vc.component.addContractCollectionPlanValidate()) {
                    vc.toast(vc.validate.errInfo);

                    return;
                }

                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.addContractCollectionPlanInfo);
                    $('#addContractCollectionPlanModel').modal('hide');
                    return;
                }

                vc.http.apiPost(
                    'contractCollectionPlan.saveContractCollectionPlan',
                    JSON.stringify(vc.component.addContractCollectionPlanInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addContractCollectionPlanModel').modal('hide');
                            vc.component.clearAddContractCollectionPlanInfo();
                            vc.emit('contractCollectionPlanManage', 'listContractCollectionPlan', {});

                            return;
                        }
                        vc.message(_json.msg);

                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);

                    });
            },
            clearAddContractCollectionPlanInfo: function () {
                vc.component.addContractCollectionPlanInfo = {
                    planName: '',
                    contractCode: '',
                    feeName: '',
                    remark: '',

                };
            }
        }
    });

})(window.vc);
