(function (vc) {
    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addMappingDomainInfo: {
                id: '',
                domainName: '',
                domain: '',
                seq: '',
                remark: ''
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('addMappingDomain', 'openAddMappingDomainModal', function () {
                $('#addMappingDomainModel').modal('show');
            });
        },
        methods: {
            addMappingDomainValidate() {
                return vc.validate.validate({
                    addMappingDomainInfo: vc.component.addMappingDomainInfo
                }, {
                    'addMappingDomainInfo.domain': [
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
                    'addMappingDomainInfo.seq': [
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
                    'addMappingDomainInfo.remark': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "描述'不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "256",
                            errInfo: "描述'不能超过256"
                        }
                    ]
                });
            },
            saveMappingDomainInfo: function () {
                if (!vc.component.addMappingDomainValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.http.apiPost(
                    '/mapping.saveMappingDomain',
                    JSON.stringify(vc.component.addMappingDomainInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addMappingDomainModel').modal('hide');
                            vc.component.clearAddMappingDomainInfo();
                            vc.emit('mappingDomainManage', 'listMappingDomain', {});
                            vc.toast("添加成功");
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            clearAddMappingDomainInfo: function () {
                vc.component.addMappingDomainInfo = {
                    domain: '',
                    domainName: '',
                    seq: '',
                    remark: ''
                };
            }
        }
    });
})(window.vc);