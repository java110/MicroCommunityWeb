(function (vc, vm) {
    vc.extends({
        data: {
            editInspectionItemTitleInfo: {
                titleId: '',
                titleType: '',
                itemTitle: '',
                seq: '',
                itemId: '',
                titleValues: []
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('editInspectionItemTitle', 'openEditInspectionItemTitleModal', function (_params) {
                vc.component.refreshEditInspectionItemTitleInfo();
                $('#editInspectionItemTitleModel').modal('show');
                vc.copyObject(_params, vc.component.editInspectionItemTitleInfo);
                $that.editInspectionItemTitleInfo.titleValues = _params.inspectionItemTitleValueDtos;
                vc.component.editInspectionItemTitleInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods: {
            editInspectionItemTitleValidate: function () {
                return vc.validate.validate({
                    editInspectionItemTitleInfo: vc.component.editInspectionItemTitleInfo
                }, {
                    'editInspectionItemTitleInfo.titleType': [{
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
                    'editInspectionItemTitleInfo.itemTitle': [{
                        limit: "required",
                        param: "",
                        errInfo: "题目不能为空"
                    },
                        {
                            limit: "maxLength",
                            param: "256",
                            errInfo: "问卷题目太长"
                        },
                    ],
                    'editInspectionItemTitleInfo.seq': [{
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
                    'editInspectionItemTitleInfo.titleId': [{
                        limit: "required",
                        param: "",
                        errInfo: "题目ID不能为空"
                    }]
                });
            },
            editInspectionItemTitle: function () {
                if (!vc.component.editInspectionItemTitleValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                if (vc.component.editInspectionItemTitleInfo.titleType == '3003') {
                    vc.component.editInspectionItemTitleInfo.titleValues = [];
                }
                // 验证必填项
                let msg = '';
                vc.component.editInspectionItemTitleInfo.titleValues.forEach((item) => {
                    if (!vc.validate.required(item.itemValue)) {
                        msg = '请填写选项内容';
                    }
                });
                if (msg) {
                    vc.toast(msg);
                    return;
                }
                vc.http.apiPost(
                    '/inspectionItemTitle.updateInspectionItemTitle',
                    JSON.stringify(vc.component.editInspectionItemTitleInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editInspectionItemTitleModel').modal('hide');
                            vc.emit('inspectionItemTitleManage', 'listInspectionItemTitle', {});
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
            refreshEditInspectionItemTitleInfo: function () {
                vc.component.editInspectionItemTitleInfo = {
                    titleId: '',
                    titleType: '',
                    itemTitle: '',
                    seq: '',
                    itemId: '',
                    titleValues: []
                }
            },
            _changeEditTitleType: function () {
                let _titleType = $that.editInspectionItemTitleInfo.titleType;
                if (_titleType == '1001') {
                    $that.editInspectionItemTitleInfo.titleValues = [
                        {
                            itemValue: '',
                            seq: 1
                        }
                    ];
                }
                if (_titleType == '2002') {
                    $that.editInspectionItemTitleInfo.titleValues = [
                        {
                            itemValue: '',
                            seq: 1
                        },
                        {
                            itemValue: '',
                            seq: 2
                        }
                    ];
                }
            },
            _addEditTitleValue: function () {
                $that.editInspectionItemTitleInfo.titleValues.push({
                    qaValue: '',
                    seq: $that.editInspectionItemTitleInfo.titleValues.length + 1
                });
            },
            _deleteEditTitleValue: function (_seq) {
                let _newTitleValues = [];
                let _tmpTitleValues = $that.editInspectionItemTitleInfo.titleValues;
                _tmpTitleValues.forEach(item => {
                    if (item.seq != _seq) {
                        _newTitleValues.push({
                            itemValue: item.itemValue,
                            seq: _newTitleValues.length + 1
                        })
                    }
                });
                $that.editInspectionItemTitleInfo.titleValues = _newTitleValues;
            }
        }
    });
})(window.vc, window.vc.component);