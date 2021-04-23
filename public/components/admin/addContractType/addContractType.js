(function (vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addContractTypeInfo: {
                contractTypeId: '',
                typeName: '',
                audit: '',
                remark: '',

            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('addContractType', 'openAddContractTypeModal', function () {
                $('#addContractTypeModel').modal('show');
            });
        },
        methods: {
            addContractTypeValidate() {
                return vc.validate.validate({
                    addContractTypeInfo: vc.component.addContractTypeInfo
                }, {
                    'addContractTypeInfo.typeName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "类型名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "类型名称不能超过64位"
                        },
                    ],
                    'addContractTypeInfo.audit': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "是否审核不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "是否审核格式错误"
                        },
                    ],
                    'addContractTypeInfo.remark': [
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "描述超过200位"
                        },
                    ],




                });
            },
            saveContractTypeInfo: function () {
                if (!vc.component.addContractTypeValidate()) {
                    vc.toast(vc.validate.errInfo);

                    return;
                }

                vc.component.addContractTypeInfo.communityId = vc.getCurrentCommunity().communityId;
                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.addContractTypeInfo);
                    $('#addContractTypeModel').modal('hide');
                    return;
                }

                vc.http.apiPost(
                    '/contract/saveContractType',
                    JSON.stringify(vc.component.addContractTypeInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addContractTypeModel').modal('hide');
                            vc.component.clearAddContractTypeInfo();
                            vc.emit('contractTypeManage', 'listContractType', {});

                            return;
                        }
                        vc.message(_json.msg);

                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);

                    });
            },
            clearAddContractTypeInfo: function () {
                vc.component.addContractTypeInfo = {
                    typeName: '',
                    audit: '',
                    remark: '',

                };
            }
        }
    });

})(window.vc);
