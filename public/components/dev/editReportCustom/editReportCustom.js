(function (vc, vm) {
    vc.extends({
        data: {
            editReportCustomInfo: {
                customId: '',
                groupId: '',
                title: '',
                seq: '',
                remark: '',
                reportCustomGroups: []
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('editReportCustom', 'openEditReportCustomModal', function (_params) {
                vc.component.refreshEditReportCustomInfo();
                $that._listEditReportCustomGroups();
                $('#editReportCustomModel').modal('show');
                vc.copyObject(_params, vc.component.editReportCustomInfo);
            });
        },
        methods: {
            editReportCustomValidate: function () {
                return vc.validate.validate({
                    editReportCustomInfo: vc.component.editReportCustomInfo
                }, {
                    'editReportCustomInfo.groupId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "报表组不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "30",
                            errInfo: "报表组不能超过30"
                        }
                    ],
                    'editReportCustomInfo.title': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "选项标题不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "选项标题不能超过64"
                        }
                    ],
                    'editReportCustomInfo.seq': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "排序不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "11",
                            errInfo: "排序不能超过11"
                        }
                    ],
                    'editReportCustomInfo.remark': [
                        {
                            limit: "maxLength",
                            param: "512",
                            errInfo: "描述不能超过512"
                        }
                    ],
                    'editReportCustomInfo.customId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "报表ID不能为空"
                        }
                    ]
                });
            },
            editReportCustom: function () {
                if (!vc.component.editReportCustomValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.http.apiPost(
                    '/reportCustom.updateReportCustom',
                    JSON.stringify(vc.component.editReportCustomInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editReportCustomModel').modal('hide');
                            vc.emit('reportCustomManage', 'listReportCustom', {});
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
            refreshEditReportCustomInfo: function () {
                vc.component.editReportCustomInfo = {
                    customId: '',
                    groupId: '',
                    title: '',
                    seq: '',
                    remark: '',
                    reportCustomGroups: []
                }
            },
            _listEditReportCustomGroups: function (_page, _rows) {
                var param = {
                    params: {
                        page: 1,
                        row: 50
                    }
                };
                //发送get请求
                vc.http.apiGet('/reportCustomGroup.listReportCustomGroup',
                    param,
                    function (json, res) {
                        var _reportCustomGroupManageInfo = JSON.parse(json);
                        $that.editReportCustomInfo.reportCustomGroups = _reportCustomGroupManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.editReportCustomInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
        }
    });
})(window.vc, window.vc.component);
