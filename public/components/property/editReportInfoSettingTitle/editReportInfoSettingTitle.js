(function (vc, vm) {
    vc.extends({
        data: {
            editReportInfoSettingTitleInfo: {
                titleId: '',
                titleType: '',
                title: '',
                seq: '',
                settingId: '',
                titleValues: []
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('editReportInfoSettingTitle', 'openEditReportInfoSettingTitleModal', function (_params) {
                vc.component.refreshEditReportInfoSettingTitleInfo();
                $('#editReportInfoSettingTitleModel').modal('show');
                vc.copyObject(_params, vc.component.editReportInfoSettingTitleInfo);
                $that.editReportInfoSettingTitleInfo.titleValues = _params.reportInfoSettingTitleValueDtos;
                vc.component.editReportInfoSettingTitleInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods: {
            editReportInfoSettingTitleValidate: function () {
                return vc.validate.validate({
                    editReportInfoSettingTitleInfo: vc.component.editReportInfoSettingTitleInfo
                }, {
                    'editReportInfoSettingTitleInfo.titleType': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "题目类型不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "题目类型格式错误"
                        },
                    ],
                    'editReportInfoSettingTitleInfo.title': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "问卷题目不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "256",
                            errInfo: "问卷题目太长"
                        },
                    ],
                    'editReportInfoSettingTitleInfo.seq': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "顺序不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "顺序必须是数字"
                        },
                    ],
                    'editReportInfoSettingTitleInfo.titleId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "题目ID不能为空"
                        }
                    ]
                });
            },
            editReportInfoSettingTitle: function () {
                if (!vc.component.editReportInfoSettingTitleValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.http.apiPost(
                    '/reportInfoSettingTitle/updateSettingTitle',
                    JSON.stringify(vc.component.editReportInfoSettingTitleInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editReportInfoSettingTitleModel').modal('hide');
                            vc.emit('reportInfoSettingTitleManage', 'listReportInfoSettingTitle', {});
                            vc.toast("修改成功")
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
            refreshEditReportInfoSettingTitleInfo: function () {
                vc.component.editReportInfoSettingTitleInfo = {
                    titleId: '',
                    titleType: '',
                    title: '',
                    seq: '',
                    settingId: '',
                    titleValues: []
                }
            },
            _addEditTitleValue: function () {
                $that.editReportInfoSettingTitleInfo.titleValues.push(
                    {
                        qaValue: '',
                        seq: $that.editReportInfoSettingTitleInfo.titleValues.length + 1
                    }
                );
            },
            _deleteEditTitleValue: function (_seq) {
                let _newTitleValues = [];
                let _tmpTitleValues = $that.editReportInfoSettingTitleInfo.titleValues;
                _tmpTitleValues.forEach(item => {
                    if (item.seq != _seq) {
                        _newTitleValues.push({
                            qaValue: item.qaValue,
                            seq: _newTitleValues.length + 1
                        })
                    }
                });
                $that.editReportInfoSettingTitleInfo.titleValues = _newTitleValues;
            }
        }
    });
})(window.vc, window.vc.component);
