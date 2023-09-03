(function (vc, vm) {
    vc.extends({
        data: {
            editMappingInfo: {
                id: '',
                domain: 'DOMAIN.COMMON',
                name: '',
                key: '',
                value: '',
                remark: '',
                domains: []
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('editMapping', 'openEditMappingModal', function (_params) {
                vc.component.refreshEditMappingInfo();
                $('#editMappingModel').modal('show');
                vc.copyObject(_params, vc.component.editMappingInfo);
                $that._listEditMappingDomains();
                // vc.component.editMappingInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods: {
            editMappingValidate: function () {
                return vc.validate.validate({
                    editMappingInfo: vc.component.editMappingInfo
                }, {
                    'editMappingInfo.domain': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "域不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "50",
                            errInfo: "域长度不能超过50"
                        }
                    ],
                    'editMappingInfo.name': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "名称不能为空"
                        },
                        {
                            limit: "maxin",
                            param: "2,50",
                            errInfo: "名称必须在2至50字符之间"
                        }
                    ],
                    'editMappingInfo.key': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "键不能为空"
                        },
                        {
                            limit: "maxin",
                            param: "1,100",
                            errInfo: "键必须在1至100之间"
                        }
                    ],
                    'editMappingInfo.value': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "值不能为空"
                        },
                        {
                            limit: "maxin",
                            param: "1,100",
                            errInfo: "值必须在1至100之间"
                        }
                    ],
                    'editMappingInfo.id': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "编码ID不能为空"
                        }
                    ]
                });
            },
            editMapping: function () {
                if (!vc.component.editMappingValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.http.apiPost(
                    '/mapping.updateMapping',
                    JSON.stringify(vc.component.editMappingInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        if (res.status == 200) {
                            //关闭model
                            $('#editMappingModel').modal('hide');
                            vc.emit('mappingManage', 'listMapping', {});
                            vc.toast("修改成功");
                            return;
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            refreshEditMappingInfo: function () {
                vc.component.editMappingInfo = {
                    id: '',
                    domain: 'DOMAIN.COMMON',
                    name: '',
                    key: '',
                    value: '',
                    remark: '',
                    domains: []
                }
            },
            _listEditMappingDomains: function (_page, _rows) {
                let param = {
                    params: {
                        page: 1,
                        row: 300
                    }
                };
                //发送get请求
                vc.http.apiGet('/mapping.listMappingDomain',
                    param,
                    function (json, res) {
                        let _mappingDomainManageInfo = JSON.parse(json);
                        vc.component.editMappingInfo.domains = _mappingDomainManageInfo.data;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
        }
    });
})(window.vc, window.vc.component);