(function (vc, vm) {
    vc.extends({
        data: {
            editBusinessDatabusInfo: {
                databusId: '',
                businessTypeCd: '',
                beanName: '',
                seq: '',
                databusName: '',
                state: ''
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('editBusinessDatabus', 'openEditBusinessDatabusModal', function (_params) {
                vc.component.refreshEditBusinessDatabusInfo();
                $('#editBusinessDatabusModel').modal('show');
                vc.copyObject(_params, vc.component.editBusinessDatabusInfo);
            });
        },
        methods: {
            editBusinessDatabusValidate: function () {
                return vc.validate.validate({
                    editBusinessDatabusInfo: vc.component.editBusinessDatabusInfo
                }, {
                    'editBusinessDatabusInfo.businessTypeCd': [{
                        limit: "required",
                        param: "",
                        errInfo: "业务类型不能为空"
                    }],
                    'editBusinessDatabusInfo.beanName': [{
                        limit: "required",
                        param: "",
                        errInfo: "适配器不能为空"
                    },
                        {
                            limit: "maxLength",
                            param: "256",
                            errInfo: "适配器名称太长"
                        },
                    ],
                    'editBusinessDatabusInfo.databusName': [{
                        limit: "required",
                        param: "",
                        errInfo: "名称不能为空"
                    },
                        {
                            limit: "maxLength",
                            param: "128",
                            errInfo: "名称太长"
                        },
                    ],
                    'editBusinessDatabusInfo.seq': [{
                        limit: "required",
                        param: "",
                        errInfo: "顺序不能为空"
                    },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "顺序格式错误"
                        },
                    ],
                    'editBusinessDatabusInfo.databusId': [{
                        limit: "required",
                        param: "",
                        errInfo: "Databus ID不能为空"
                    }],
                    'editBusinessDatabusInfo.state': [{
                        limit: "required",
                        param: "",
                        errInfo: "状态不能为空"
                    }]
                });
            },
            editBusinessDatabus: function () {
                if (!vc.component.editBusinessDatabusValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.http.apiPost(
                    '/businessDatabus/updateBusinessDatabus',
                    JSON.stringify(vc.component.editBusinessDatabusInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editBusinessDatabusModel').modal('hide');
                            vc.emit('businessDatabusManage', 'listBusinessDatabus', {});
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
            refreshEditBusinessDatabusInfo: function () {
                vc.component.editBusinessDatabusInfo = {
                    databusId: '',
                    businessTypeCd: '',
                    beanName: '',
                    seq: '',
                    databusName: '',
                    state: ''
                }
            }
        }
    });
})(window.vc, window.vc.component);