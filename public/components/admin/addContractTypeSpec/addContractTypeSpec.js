(function (vc) {
    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addContractTypeSpecInfo: {
                specCd: '',
                specName: '',
                specHoldplace: '',
                required: '',
                specShow: '',
                specValueType: '',
                specType: '',
                listShow: '',
                contractTypeId: ''
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('addContractTypeSpec', 'openAddContractTypeSpecModal', function (_parma) {
                $that.addContractTypeSpecInfo.contractTypeId = _parma.contractTypeId;
                $('#addContractTypeSpecModel').modal('show');
            });
        },
        methods: {
            addContractTypeSpecValidate() {
                return vc.validate.validate({
                    addContractTypeSpecInfo: vc.component.addContractTypeSpecInfo
                }, {
                    'addContractTypeSpecInfo.specName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "规格名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "规格名称太长"
                        },
                    ],
                    'addContractTypeSpecInfo.specHoldplace': [
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "说明不能超过500位"
                        },
                    ],
                    'addContractTypeSpecInfo.required': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "必填不能为空"
                        }
                    ],
                    'addContractTypeSpecInfo.specShow': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "展示不能为空"
                        }
                    ],
                    'addContractTypeSpecInfo.specValueType': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "值类型不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "值类型格式错误"
                        },
                    ],
                    'addContractTypeSpecInfo.specType': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "规格类型不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "规格类型错误"
                        },
                    ],
                    'addContractTypeSpecInfo.listShow': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "查询显示不能为空"
                        }
                    ]
                });
            },
            saveContractTypeSpecInfo: function () {
                if (!vc.component.addContractTypeSpecValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.component.addContractTypeSpecInfo.communityId = vc.getCurrentCommunity().communityId;
                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.addContractTypeSpecInfo);
                    $('#addContractTypeSpecModel').modal('hide');
                    return;
                }
                vc.http.apiPost(
                    '/contract/saveContractTypeSpec',
                    JSON.stringify(vc.component.addContractTypeSpecInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addContractTypeSpecModel').modal('hide');
                            vc.component.clearAddContractTypeSpecInfo();
                            vc.emit('contractTypeSpecManage', 'listContractTypeSpec', {});
                            vc.toast("添加成功");
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.message(errInfo);
                    });
            },
            clearAddContractTypeSpecInfo: function () {
                vc.component.addContractTypeSpecInfo = {
                    specName: '',
                    specHoldplace: '',
                    required: '',
                    specShow: '',
                    specValueType: '',
                    specType: '',
                    listShow: '',
                    contractTypeId: ''
                };
            }
        }
    });
})(window.vc);
