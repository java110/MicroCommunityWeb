(function (vc) {
    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addMaintainanceItemInfo: {
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
            vc.on('addMaintainanceItem', 'openAddMaintainanceItemModal', function (_param) {
                vc.copyObject(_param, $that.addMaintainanceItemInfo);
                $('#addMaintainanceItemModel').modal('show');
            });
        },
        methods: {
            addMaintainanceItemValidate() {
                return vc.validate.validate({
                    addMaintainanceItemInfo: vc.component.addMaintainanceItemInfo
                }, {
                    'addMaintainanceItemInfo.titleType': [{
                        limit: "required",
                        param: "",
                        errInfo: "类型不能为空"
                    },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "类型格式错误"
                        },
                    ],
                    'addMaintainanceItemInfo.itemTitle': [{
                        limit: "required",
                        param: "",
                        errInfo: "问卷不能为空"
                    },
                        {
                            limit: "maxLength",
                            param: "256",
                            errInfo: "问卷太长"
                        },
                    ],
                    'addMaintainanceItemInfo.seq': [{
                        limit: "required",
                        param: "",
                        errInfo: "顺序不能为空"
                    },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "顺序必须是数字"
                        },
                    ]
                });
            },
            saveInspectionItemTitleInfo: function () {
                if (!vc.component.addMaintainanceItemValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                // 验证必填项
                let msg = '';
                vc.component.addMaintainanceItemInfo.titleValues.forEach((item) => {
                    if (!vc.validate.required(item.itemValue)) {
                        msg = '请填写选项内容';
                    }
                });
                if (msg) {
                    vc.toast(msg);
                    return;
                }
                vc.component.addMaintainanceItemInfo.communityId = vc.getCurrentCommunity().communityId;
                
                vc.http.apiPost(
                    '/maintainance.saveMaintainanceItem',
                    JSON.stringify(vc.component.addMaintainanceItemInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addMaintainanceItemModel').modal('hide');
                            vc.component.clearAddMaintainanceItemInfo();
                            vc.emit('maintainanceItem', 'listMaintainanceItem', {});
                            vc.toast("添加成功");
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
            clearAddMaintainanceItemInfo: function () {
                vc.component.addMaintainanceItemInfo = {
                    titleId: '',
                    titleType: '',
                    itemTitle: '',
                    seq: '',
                    itemId: '',
                    titleValues: []
                };
            },
            _changeAddTitleType: function () {
                let _titleType = $that.addMaintainanceItemInfo.titleType;
                if (_titleType == '3003') {
                    $that.addMaintainanceItemInfo.titleValues = [];
                    return;
                }
                if (_titleType == '1001') {
                    $that.addMaintainanceItemInfo.titleValues = [
                        {
                            itemValue: '',
                            seq: 1
                        }
                    ];
                }
                if (_titleType == '2002') {
                    $that.addMaintainanceItemInfo.titleValues = [
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
            _addTitleValue: function () {
                $that.addMaintainanceItemInfo.titleValues.push({
                    itemValue: '',
                    seq: $that.addMaintainanceItemInfo.titleValues.length + 1
                });
            },
            _deleteTitleValue: function (_seq) {
                let _newTitleValues = [];
                let _tmpTitleValues = $that.addMaintainanceItemInfo.titleValues;
                _tmpTitleValues.forEach(item => {
                    if (item.seq != _seq) {
                        _newTitleValues.push({
                            itemValue: item.itemValue,
                            seq: _newTitleValues.length + 1
                        })
                    }
                });
                $that.addMaintainanceItemInfo.titleValues = _newTitleValues;
            }
        }
    });
})(window.vc);