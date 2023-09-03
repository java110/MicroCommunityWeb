(function (vc, vm) {
    vc.extends({
        data: {
            editBusinessTableHisInfo: {
                hisId: '',
                businessTypeCd: '',
                action: '',
                actionObj: '',
                actionObjHis: '',
                remark: ''
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('editBusinessTableHis', 'openEditBusinessTableHisModal', function (_params) {
                vc.component.refreshEditBusinessTableHisInfo();
                $('#editBusinessTableHisModel').modal('show');
                vc.copyObject(_params, vc.component.editBusinessTableHisInfo);
            });
        },
        methods: {
            editBusinessTableHisValidate: function () {
                return vc.validate.validate({
                    editBusinessTableHisInfo: vc.component.editBusinessTableHisInfo
                }, {
                    'editBusinessTableHisInfo.businessTypeCd': [{
                        limit: "required",
                        param: "",
                        errInfo: "业务类型不能为空"
                    },
                        {
                            limit: "maxLength",
                            param: "30",
                            errInfo: "业务类型超过30位"
                        },
                    ],
                    'editBusinessTableHisInfo.action': [{
                        limit: "required",
                        param: "",
                        errInfo: "动作不能为空"
                    },
                        {
                            limit: "maxLength",
                            param: "12",
                            errInfo: "动作不能为空"
                        },
                    ],
                    'editBusinessTableHisInfo.actionObj': [{
                        limit: "required",
                        param: "",
                        errInfo: "表名不能为空"
                    },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "表名超过64位"
                        },
                    ],
                    'editBusinessTableHisInfo.actionObjHis': [{
                        limit: "required",
                        param: "",
                        errInfo: "轨迹表名不能为空"
                    },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "轨迹表名超过64位"
                        },
                    ],
                    'editBusinessTableHisInfo.remark': [{
                        limit: "maxLength",
                        param: "200",
                        errInfo: "备注内容不能超过200"
                    },],
                    'editBusinessTableHisInfo.hisId': [{
                        limit: "required",
                        param: "",
                        errInfo: "轨迹ID不能为空"
                    }]
                });
            },
            editBusinessTableHis: function () {
                if (!vc.component.editBusinessTableHisValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.http.apiPost(
                    '/businessTableHis.updateBusinessTableHis',
                    JSON.stringify(vc.component.editBusinessTableHisInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editBusinessTableHisModel').modal('hide');
                            vc.emit('businessTableHisManage', 'listBusinessTableHis', {});
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
            refreshEditBusinessTableHisInfo: function () {
                vc.component.editBusinessTableHisInfo = {
                    hisId: '',
                    businessTypeCd: '',
                    action: '',
                    actionObj: '',
                    actionObjHis: '',
                    remark: ''
                }
            }
        }
    });
})(window.vc, window.vc.component);