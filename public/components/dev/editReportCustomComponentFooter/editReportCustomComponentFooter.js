(function (vc, vm) {
    vc.extends({
        data: {
            editReportCustomComponentFooterInfo: {
                footerId: '',
                componentId: '',
                name: '',
                queryModel: '',
                javaScript: '',
                componentSql: '',
                remark: ''
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('editReportCustomComponentFooter', 'openEditReportCustomComponentFooterModal', function (_params) {
                vc.component.refreshEditReportCustomComponentFooterInfo();
                $('#editReportCustomComponentFooterModel').modal('show');
                vc.copyObject(_params, vc.component.editReportCustomComponentFooterInfo);
            });
        },
        methods: {
            editReportCustomComponentFooterValidate: function () {
                return vc.validate.validate({
                    editReportCustomComponentFooterInfo: vc.component.editReportCustomComponentFooterInfo
                }, {
                    'editReportCustomComponentFooterInfo.componentId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "组件ID不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "30",
                            errInfo: "组件ID不能超过30"
                        }
                    ],
                    'editReportCustomComponentFooterInfo.name': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "名称不能超过64"
                        }
                    ],
                    'editReportCustomComponentFooterInfo.queryModel': [
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
                    'editReportCustomComponentFooterInfo.remark': [
                        {
                            limit: "maxLength",
                            param: "512",
                            errInfo: "描述'不能超过512"
                        }
                    ],
                    'editReportCustomComponentFooterInfo.footerId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "统计ID不能为空"
                        }
                    ]
                });
            },
            editReportCustomComponentFooter: function () {
                if (!vc.component.editReportCustomComponentFooterValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.http.apiPost(
                    '/reportCustomComponentFooter.updateReportCustomComponentFooter',
                    JSON.stringify(vc.component.editReportCustomComponentFooterInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editReportCustomComponentFooterModel').modal('hide');
                            vc.emit('reportCustomComponentFooterManage', 'listReportCustomComponentFooter', {});
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
            refreshEditReportCustomComponentFooterInfo: function () {
                vc.component.editReportCustomComponentFooterInfo = {
                    footerId: '',
                    componentId: '',
                    name: '',
                    queryModel: '',
                    javaScript: '',
                    componentSql: '',
                    remark: ''
                }
            }
        }
    });
})(window.vc, window.vc.component);
