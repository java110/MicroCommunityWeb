(function(vc) {
    vc.extends({
        data: {
            addQuestionTitleInfo: {
                titleType: '',
                qaTitle: '',
                seq: '',
                itemId: '',
                titleValues: []
            }
        },
        _initMethod: function() {},
        _initEvent: function() {
            vc.on('addQuestionTitle', 'openAddQuestionTitleModal', function(_param) {
                vc.copyObject(_param, $that.addQuestionTitleInfo);
                $('#addQuestionTitleModel').modal('show');
            });
        },
        methods: {
            addQuestionTitleValidate() {
                return vc.validate.validate({
                    addQuestionTitleInfo: $that.addQuestionTitleInfo
                }, {
                    'addQuestionTitleInfo.titleType': [{
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
                    'addQuestionTitleInfo.qaTitle': [{
                            limit: "required",
                            param: "",
                            errInfo: "问卷不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "256",
                            errInfo: "问卷太长"
                        },
                    ]
                });
            },
            saveQuestionTitleInfo: function() {
                if (!$that.addQuestionTitleValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                // 验证必填项
                let msg = '';
                $that.addQuestionTitleInfo.titleValues.forEach((item) => {
                    if (!vc.validate.required(item.itemValue)) {
                        msg = '请填写选项内容';
                    }
                });
                if (msg) {
                    vc.toast(msg);
                    return;
                }
                $that.addQuestionTitleInfo.communityId = vc.getCurrentCommunity().communityId;

                vc.http.apiPost(
                    '/question.saveQuestionTitle',
                    JSON.stringify($that.addQuestionTitleInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addQuestionTitleModel').modal('hide');
                            $that.clearAddQuestionTitleInfo();
                            vc.emit('questionTitle', 'listQuestionTitle', {});
                            vc.toast("添加成功");
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.message(errInfo);
                    });
            },
            clearAddQuestionTitleInfo: function() {
                $that.addQuestionTitleInfo = {
                    titleId: '',
                    titleType: '',
                    qaTitle: '',
                    seq: '',
                    itemId: '',
                    titleValues: []
                };
            },
            _changeAddTitleType: function() {
                let _titleType = $that.addQuestionTitleInfo.titleType;
                if (_titleType == '3003') {
                    $that.addQuestionTitleInfo.titleValues = [];
                    return;
                }
                if (_titleType == '1001') {
                    $that.addQuestionTitleInfo.titleValues = [{
                        itemValue: '',
                        seq: 1
                    }];
                }
                if (_titleType == '2002') {
                    $that.addQuestionTitleInfo.titleValues = [{
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
            _addTitleValue: function() {
                $that.addQuestionTitleInfo.titleValues.push({
                    itemValue: '',
                    seq: $that.addQuestionTitleInfo.titleValues.length + 1
                });
            },
            _deleteTitleValue: function(_seq) {
                let _newTitleValues = [];
                let _tmpTitleValues = $that.addQuestionTitleInfo.titleValues;
                _tmpTitleValues.forEach(item => {
                    if (item.seq != _seq) {
                        _newTitleValues.push({
                            itemValue: item.itemValue,
                            seq: _newTitleValues.length + 1
                        })
                    }
                });
                $that.addQuestionTitleInfo.titleValues = _newTitleValues;
            }
        }
    });
})(window.vc);