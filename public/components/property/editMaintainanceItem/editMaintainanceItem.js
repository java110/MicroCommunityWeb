(function (vc, vm) {
    vc.extends({
        data: {
            editMaintainanceItemInfo: {
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
            vc.on('editMaintainanceItem', 'openEditMaintainanceItemModal', function (_params) {
                vc.component.refreshEditMaintainanceItemInfo();
                $('#editMaintainanceItemModel').modal('show');
                vc.copyObject(_params, vc.component.editMaintainanceItemInfo);
                $that.editMaintainanceItemInfo.titleValues = _params.titleValues;
                vc.component.editMaintainanceItemInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods: {
            editMaintainanceItemValidate: function () {
                return vc.validate.validate({
                    editMaintainanceItemInfo: vc.component.editMaintainanceItemInfo
                }, {
                    'editMaintainanceItemInfo.titleType': [{
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
                    'editMaintainanceItemInfo.itemTitle': [{
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
                    'editMaintainanceItemInfo.seq': [{
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
                    'editMaintainanceItemInfo.itemId': [{
                        limit: "required",
                        param: "",
                        errInfo: "ID不能为空"
                    }]
                });
            },
            editMaintainanceItem: function () {
                if (!vc.component.editMaintainanceItemValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                if (vc.component.editMaintainanceItemInfo.titleType == '3003') {
                    vc.component.editMaintainanceItemInfo.titleValues = [];
                }
                // 验证必填项
                let msg = '';
                vc.component.editMaintainanceItemInfo.titleValues.forEach((item) => {
                    if (!vc.validate.required(item.itemValue)) {
                        msg = '请填写选项内容';
                    }
                });
                if (msg) {
                    vc.toast(msg);
                    return;
                }
                vc.http.apiPost(
                    '/maintainance.updateMaintainanceItem',
                    JSON.stringify(vc.component.editMaintainanceItemInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editMaintainanceItemModel').modal('hide');
                            vc.emit('maintainanceItem', 'listMaintainanceItem', {});
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
            refreshEditMaintainanceItemInfo: function () {
                vc.component.editMaintainanceItemInfo = {
                    titleId: '',
                    titleType: '',
                    itemTitle: '',
                    seq: '',
                    itemId: '',
                    titleValues: []
                }
            },
            _changeEditTitleType: function () {
                let _titleType = $that.editMaintainanceItemInfo.titleType;
                if (_titleType == '1001') {
                    $that.editMaintainanceItemInfo.titleValues = [
                        {
                            itemValue: '',
                            seq: 1
                        }
                    ];
                }
                if (_titleType == '2002') {
                    $that.editMaintainanceItemInfo.titleValues = [
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
                $that.editMaintainanceItemInfo.titleValues.push({
                    qaValue: '',
                    seq: $that.editMaintainanceItemInfo.titleValues.length + 1
                });
            },
            _deleteEditTitleValue: function (_seq) {
                let _newTitleValues = [];
                let _tmpTitleValues = $that.editMaintainanceItemInfo.titleValues;
                _tmpTitleValues.forEach(item => {
                    if (item.seq != _seq) {
                        _newTitleValues.push({
                            itemValue: item.itemValue,
                            seq: _newTitleValues.length + 1
                        })
                    }
                });
                $that.editMaintainanceItemInfo.titleValues = _newTitleValues;
            }
        }
    });
})(window.vc, window.vc.component);