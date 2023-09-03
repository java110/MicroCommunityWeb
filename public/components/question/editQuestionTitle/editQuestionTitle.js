(function(vc, vm) {
    vc.extends({
        data: {
            editQuestionTitleInfo: {
                titleType: '',
                qaTitle: '',
                titleId: '',
                titleValues: []
            }
        },
        _initMethod: function() {},
        _initEvent: function() {
            vc.on('editQuestionTitle', 'openEditQuestionTitleModal', function(_params) {
                $that.refreshEditQuestionTitleInfo();
                $('#editQuestionTitleModel').modal('show');
                vc.copyObject(_params, $that.editQuestionTitleInfo);
                $that.editQuestionTitleInfo.titleValues = _params.titleValues;
                $that.editQuestionTitleInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods: {
            editQuestionTitleValidate: function() {
                return vc.validate.validate({
                    editQuestionTitleInfo: $that.editQuestionTitleInfo
                }, {
                    'editQuestionTitleInfo.titleType': [{
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
                    'editQuestionTitleInfo.qaTitle': [{
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
                    'editQuestionTitleInfo.titleId': [{
                        limit: "required",
                        param: "",
                        errInfo: "ID不能为空"
                    }]
                });
            },
            editQuestionTitle: function() {
                if (!$that.editQuestionTitleValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                if ($that.editQuestionTitleInfo.titleType == '3003') {
                    $that.editQuestionTitleInfo.titleValues = [];
                }
                // 验证必填项
                let msg = '';
                $that.editQuestionTitleInfo.titleValues.forEach((item) => {
                    if (!vc.validate.required(item.qaValue)) {
                        msg = '请填写选项内容';
                    }
                });
                if (msg) {
                    vc.toast(msg);
                    return;
                }
                vc.http.apiPost(
                    '/question.updateQuestionTitle',
                    JSON.stringify($that.editQuestionTitleInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editQuestionTitleModel').modal('hide');
                            vc.emit('questionTitle', 'listQuestionTitle', {});
                            vc.toast("修改成功");
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            refreshEditQuestionTitleInfo: function() {
                $that.editQuestionTitleInfo = {
                    titleType: '',
                    qaTitle: '',
                    titleId: '',
                    titleValues: []
                }
            },
            _changeEditTitleType: function() {
                let _titleType = $that.editQuestionTitleInfo.titleType;
                if (_titleType == '1001') {
                    $that.editQuestionTitleInfo.titleValues = [{
                        qaValue: '',
                        seq: 1
                    }];
                }
                if (_titleType == '2002') {
                    $that.editQuestionTitleInfo.titleValues = [{
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
            _addEditTitleValue: function() {
                $that.editQuestionTitleInfo.titleValues.push({
                    qaValue: '',
                    seq: $that.editQuestionTitleInfo.titleValues.length + 1
                });
            },
            _deleteEditTitleValue: function(_seq) {
                let _newTitleValues = [];
                let _tmpTitleValues = $that.editQuestionTitleInfo.titleValues;
                _tmpTitleValues.forEach(item => {
                    if (item.seq != _seq) {
                        _newTitleValues.push({
                            qaValue: item.qaValue,
                            seq: _newTitleValues.length + 1
                        })
                    }
                });
                $that.editQuestionTitleInfo.titleValues = _newTitleValues;
            }
        }
    });
})(window.vc, window.$that);