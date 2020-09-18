(function (vc, vm) {

    vc.extends({
        data: {
            editContractTypeSpecInfo: {
                specCd: '',
                specName: '',
                specHoldplace: '',
                required: '',
                specShow: '',
                specValueType: '',
                specType: '',
                listShow: '',
            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('editContractTypeSpec', 'openEditContractTypeSpecModal', function (_params) {
                vc.component.refreshEditContractTypeSpecInfo();
                $('#editContractTypeSpecModel').modal('show');
                vc.copyObject(_params, vc.component.editContractTypeSpecInfo);
                vc.component.editContractTypeSpecInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods: {
            editContractTypeSpecValidate: function () {
                return vc.validate.validate({
                    editContractTypeSpecInfo: vc.component.editContractTypeSpecInfo
                }, {
                    'editContractTypeSpecInfo.specName': [
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
                    'editContractTypeSpecInfo.specHoldplace': [
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "说明不能超过500位"
                        },
                    ],
                    'editContractTypeSpecInfo.required': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "必填不能为空"
                        }],
                    'editContractTypeSpecInfo.specShow': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "展示不能为空"
                        }],
                    'editContractTypeSpecInfo.specValueType': [
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
                    'editContractTypeSpecInfo.specType': [
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
                    'editContractTypeSpecInfo.listShow': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "查询显示不能为空"
                        }],
                    'editContractTypeSpecInfo.specCd': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "规格不能为空"
                        }]
                });
            },
            editContractTypeSpec: function () {
                if (!vc.component.editContractTypeSpecValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }

                vc.http.apiPost(
                    '/contract/updateContractTypeSpec',
                    JSON.stringify(vc.component.editContractTypeSpecInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editContractTypeSpecModel').modal('hide');
                            vc.emit('contractTypeSpecManage', 'listContractTypeSpec', {});
                            return;
                        }
                        vc.message(_json.msg);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);
                    });
            },
            refreshEditContractTypeSpecInfo: function () {
                vc.component.editContractTypeSpecInfo = {
                    specCd: '',
                    specName: '',
                    specHoldplace: '',
                    required: '',
                    specShow: '',
                    specValueType: '',
                    specType: '',
                    listShow: '',

                }
            }
        }
    });

})(window.vc, window.vc.component);
