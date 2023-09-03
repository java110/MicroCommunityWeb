(function (vc, vm) {
    vc.extends({
        data: {
            editMappingDomainInfo: {
                id: '',
                domain: '',
                domainName: '',
                seq: '',
                remark: ''
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('editMappingDomain', 'openEditMappingDomainModal', function (_params) {
                vc.component.refreshEditMappingDomainInfo();
                $('#editMappingDomainModel').modal('show');
                vc.copyObject(_params, vc.component.editMappingDomainInfo);
            });
        },
        methods: {
            editMappingDomainValidate: function () {
                return vc.validate.validate({
                    editMappingDomainInfo: vc.component.editMappingDomainInfo
                }, {
                    'editMappingDomainInfo.domain': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "配置项不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "50",
                            errInfo: "配置项不能超过50"
                        }
                    ],
                    'editMappingDomainInfo.seq': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "排序不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "12",
                            errInfo: "排序不能超过12"
                        }
                    ],
                    'editMappingDomainInfo.remark': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "描述不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "256",
                            errInfo: "描述不能超过256"
                        }
                    ],
                    'editMappingDomainInfo.id': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "编号不能为空"
                        }
                    ]
                });
            },
            editMappingDomain: function () {
                if (!vc.component.editMappingDomainValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.http.apiPost(
                    '/mapping.updateMappingDomain',
                    JSON.stringify(vc.component.editMappingDomainInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editMappingDomainModel').modal('hide');
                            vc.emit('mappingDomainManage', 'listMappingDomain', {});
                            vc.toast("修改成功");
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
            refreshEditMappingDomainInfo: function () {
                vc.component.editMappingDomainInfo = {
                    id: '',
                    domain: '',
                    domainName: '',
                    seq: '',
                    remark: ''
                }
            }
        }
    });
})(window.vc, window.vc.component);