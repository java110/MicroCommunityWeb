(function (vc, vm) {
    vc.extends({
        data: {
            editReportCustomComponentInfo: {
                componentId: '',
                name: '',
                componentType: '',
                queryModel: '',
                componentSql: '',
                javaScript: '',
                remark: ''
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('editReportCustomComponent', 'openEditReportCustomComponentModal', function (_params) {
                vc.component.refreshEditReportCustomComponentInfo();
                $('#editReportCustomComponentModel').modal('show');
                vc.copyObject(_params, vc.component.editReportCustomComponentInfo);
            });
        },
        methods: {
            editReportCustomComponentValidate: function () {
                return vc.validate.validate({
                    editReportCustomComponentInfo: vc.component.editReportCustomComponentInfo
                }, {
                    'editReportCustomComponentInfo.componentId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "组件ID不能为空"
                        }
                    ],
                    'editReportCustomComponentInfo.name': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "组件名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "组件名称不能超过64"
                        }
                    ],
                    'editReportCustomComponentInfo.componentType': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "组件类型不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "12",
                            errInfo: "组件类型不能超过12"
                        }
                    ],
                    'editReportCustomComponentInfo.queryModel': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "查询方式不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "1",
                            errInfo: "查询方式不能超过1"
                        }
                    ],
                    'editReportCustomComponentInfo.remark': [
                        {
                            limit: "maxLength",
                            param: "512",
                            errInfo: "描述不能超过512"
                        }
                    ]
                });
            },
            editReportCustomComponent: function () {
                if (!vc.component.editReportCustomComponentValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.http.apiPost(
                    '/reportCustomComponent.updateReportCustomComponent',
                    JSON.stringify(vc.component.editReportCustomComponentInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editReportCustomComponentModel').modal('hide');
                            vc.emit('reportCustomComponentManage', 'listReportCustomComponent', {});
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
            refreshEditReportCustomComponentInfo: function () {
                vc.component.editReportCustomComponentInfo = {
                    componentId: '',
                    name: '',
                    componentType: '',
                    queryModel: '',
                    componentSql: '',
                    javaScript: '',
                    remark: ''
                }
            }
        }
    });
})(window.vc, window.vc.component);
