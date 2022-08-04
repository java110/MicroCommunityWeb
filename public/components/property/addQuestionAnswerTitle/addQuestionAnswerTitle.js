(function (vc) {
    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addQuestionAnswerTitleInfo: {
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
            vc.on('addQuestionAnswerTitle', 'openAddQuestionAnswerTitleModal', function (_param) {
                vc.copyObject(_param, $that.addQuestionAnswerTitleInfo);
                $('#addQuestionAnswerTitleModel').modal('show');
            });
        },
        methods: {
            addQuestionAnswerTitleValidate() {
                return vc.validate.validate({
                    addQuestionAnswerTitleInfo: vc.component.addQuestionAnswerTitleInfo
                }, {
                    'addQuestionAnswerTitleInfo.titleType': [
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
                    'addQuestionAnswerTitleInfo.qaTitle': [
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
                    'addQuestionAnswerTitleInfo.seq': [
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
                    ]
                });
            },
            saveQuestionAnswerTitleInfo: function () {
                if (!vc.component.addQuestionAnswerTitleValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.component.addQuestionAnswerTitleInfo.communityId = vc.getCurrentCommunity().communityId;
                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.addQuestionAnswerTitleInfo);
                    $('#addQuestionAnswerTitleModel').modal('hide');
                    return;
                }
                vc.http.apiPost(
                    '/questionAnswer/saveQuestionAnswerTitle',
                    JSON.stringify(vc.component.addQuestionAnswerTitleInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addQuestionAnswerTitleModel').modal('hide');
                            vc.component.clearAddQuestionAnswerTitleInfo();
                            vc.emit('questionAnswerTitleManage', 'listQuestionAnswerTitle', {});
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
            clearAddQuestionAnswerTitleInfo: function () {
                vc.component.addQuestionAnswerTitleInfo = {
                    titleType: '',
                    qaTitle: '',
                    seq: '',
                    qaId: '',
                    objId: '',
                    objType: '',
                    titleValues: []
                };
            },
            _changeAddTitleType: function () {
                let _titleType = $that.addQuestionAnswerTitleInfo.titleType;
                if (_titleType == '3003') {
                    $that.addQuestionAnswerTitleInfo.titleValues = [];
                    return;
                }
                $that.addQuestionAnswerTitleInfo.titleValues = [
                    {
                        qaValue: '',
                        seq: 1
                    }
                ];
            },
            _addTitleValue: function () {
                $that.addQuestionAnswerTitleInfo.titleValues.push(
                    {
                        qaValue: '',
                        seq: $that.addQuestionAnswerTitleInfo.titleValues.length + 1
                    }
                );
            },
            _deleteTitleValue: function (_seq) {
                console.log(_seq);
                let _newTitleValues = [];
                let _tmpTitleValues = $that.addQuestionAnswerTitleInfo.titleValues;
                _tmpTitleValues.forEach(item => {
                    if (item.seq != _seq) {
                        _newTitleValues.push({
                            qaValue: item.qaValue,
                            seq: _newTitleValues.length + 1
                        })
                    }
                });
                $that.addQuestionAnswerTitleInfo.titleValues = _newTitleValues;
            }
        }
    });
})(window.vc);
