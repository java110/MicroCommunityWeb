(function (vc, vm) {
    vc.extends({
        data: {
            editQuestionAnswerTitleInfo: {
                titleId: '',
                titleType: '',
                qaTitle: '',
                seq: '',
                qaId: '',
                objId: '',
                objType: '',
                titleValues: []
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('editQuestionAnswerTitle', 'openEditQuestionAnswerTitleModal', function (_params) {
                vc.component.refreshEditQuestionAnswerTitleInfo();
                $('#editQuestionAnswerTitleModel').modal('show');
                vc.copyObject(_params, vc.component.editQuestionAnswerTitleInfo);
                $that.editQuestionAnswerTitleInfo.titleValues = _params.questionAnswerTitleValues;
                vc.component.editQuestionAnswerTitleInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods: {
            editQuestionAnswerTitleValidate: function () {
                return vc.validate.validate({
                    editQuestionAnswerTitleInfo: vc.component.editQuestionAnswerTitleInfo
                }, {
                    'editQuestionAnswerTitleInfo.titleType': [
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
                    'editQuestionAnswerTitleInfo.qaTitle': [
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
                    'editQuestionAnswerTitleInfo.seq': [
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
                    'editQuestionAnswerTitleInfo.titleId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "题目ID不能为空"
                        }
                    ]
                });
            },
            editQuestionAnswerTitle: function () {
                if (!vc.component.editQuestionAnswerTitleValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                let _saveFlag = true;
                if ($that.editQuestionAnswerTitleInfo.titleValues != null && $that.editQuestionAnswerTitleInfo.titleValues.length > 0) {
                    $that.editQuestionAnswerTitleInfo.titleValues.forEach(item => {
                        if (item.qaValue == null || item.qaValue == '' || item.qaValue == undefined) {
                            vc.toast("选项内容不能为空！");
                            _saveFlag = false;
                            return;
                        }
                    });
                }
                if (!_saveFlag) {
                    return;
                }
                vc.http.apiPost(
                    '/questionAnswer/updateQuestionAnswerTitle',
                    JSON.stringify(vc.component.editQuestionAnswerTitleInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editQuestionAnswerTitleModel').modal('hide');
                            vc.emit('questionAnswerTitleManage', 'listQuestionAnswerTitle', {});
                            vc.component.refreshEditQuestionAnswerTitleInfo();
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
            refreshEditQuestionAnswerTitleInfo: function () {
                vc.component.editQuestionAnswerTitleInfo = {
                    titleId: '',
                    titleType: '',
                    qaTitle: '',
                    seq: '',
                    objId: '',
                    objType: '',
                    titleValues: []
                }
            },
            _addEditTitleValue: function () {
                $that.editQuestionAnswerTitleInfo.titleValues.push(
                    {
                        qaValue: '',
                        seq: $that.editQuestionAnswerTitleInfo.titleValues.length + 1
                    }
                );
            },
            _changeEditTitleType: function () {
                let _titleType = $that.editQuestionAnswerTitleInfo.titleType;
                if (_titleType == '3003') {
                    $that.editQuestionAnswerTitleInfo.titleValues = [];
                    return;
                } else if (_titleType == '1001') {
                    $that.editQuestionAnswerTitleInfo.titleValues = [
                        {
                            qaValue: '',
                            seq: 1
                        }
                    ];
                } else {
                    $that.editQuestionAnswerTitleInfo.titleValues = [
                        {
                            qaValue: '',
                            seq: 1
                        },
                        {
                            qaValue: '',
                            seq: 2
                        }
                    ];
                }
            },
            _deleteEditTitleValue: function (_seq) {
                let _newTitleValues = [];
                let _tmpTitleValues = $that.editQuestionAnswerTitleInfo.titleValues;
                _tmpTitleValues.forEach(item => {
                    if (item.seq != _seq) {
                        _newTitleValues.push({
                            qaValue: item.qaValue,
                            seq: _newTitleValues.length + 1
                        })
                    }
                });
                $that.editQuestionAnswerTitleInfo.titleValues = _newTitleValues;
            }
        }
    });
})(window.vc, window.vc.component);
