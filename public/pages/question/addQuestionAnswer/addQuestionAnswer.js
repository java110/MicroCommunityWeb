(function(vc) {
    vc.extends({
        data: {
            addQuestionAnswerInfo: {
                qaName: '',
                startTime: '',
                endTime: '',
                communityId: vc.getCurrentCommunity().communityId,
                content: '',
                titleType: '',
                questionTitles: [],
                roomIds: []
            }
        },
        _initMethod: function() {
            $that._initVoiteContent();
            vc.emit('selectRooms', 'refreshTree', {});
            vc.initDateTime('startTime', function(_value) {
                $that.addQuestionAnswerInfo.startTime = _value;
            });
            vc.initDateTime('endTime', function(_value) {
                $that.addQuestionAnswerInfo.endTime = _value;
            })
        },
        _initEvent: function() {

            vc.on('addQuestionAnswer', 'notifySelectRooms', function(_selectRooms) {
                let _roomIds = [];
                _selectRooms.forEach(item => {
                    _roomIds.push(item.roomId);
                })
                $that.addQuestionAnswerInfo.roomIds = _roomIds;
            });

            vc.on('addQuestionAnswer', 'chooseQuestionTitle', function(_title) {
                let _titles = $that.addQuestionAnswerInfo.questionTitles;
                let _has = false;
                _titles.forEach(item => {
                    if (_title.titleId == item.titleId) {
                        _has = true;
                    }
                });
                if (_has) {
                    vc.toast('请勿重复选择');
                    return;
                }
                _titles.push(_title);
            });

        },
        methods: {
            _initVoiteContent: function() {
                var $summernote = $('.summernote').summernote({
                    lang: 'zh-CN',
                    height: 200,
                    placeholder: '必填，请输入投票说明',
                    callbacks: {
                        onChange: function(contents, $editable) {
                            vc.component.addQuestionAnswerInfo.content = contents;
                        }
                    },
                    toolbar: [
                        ['style', ['style']],
                        ['font', ['bold', 'italic', 'underline', 'clear']],
                        ['fontname', ['fontname']],
                        ['color', ['color']],
                        ['para', ['ul', 'ol', 'paragraph']],
                        ['height', ['height']],
                        ['table', ['table']],
                    ],
                });
            },
            addQuestionAnswerValidate() {
                return vc.validate.validate({
                    addQuestionAnswerInfo: vc.component.addQuestionAnswerInfo
                }, {
                    'addQuestionAnswerInfo.qaName': [{
                            limit: "required",
                            param: "",
                            errInfo: "名称不能为空"
                        },
                        {
                            limit: "maxin",
                            param: "1,256",
                            errInfo: "名称长度必须在1位至256位"
                        },
                    ],
                    'addQuestionAnswerInfo.startTime': [{
                        limit: "required",
                        param: "",
                        errInfo: "开始时间不能为空"
                    }, ],
                    'addQuestionAnswerInfo.endTime': [{
                        limit: "required",
                        param: "",
                        errInfo: "结束时间不能为空"
                    }],
                });
            },
            _saveQuestionAnswer: function() {
                if (!vc.component.addQuestionAnswerValidate()) {
                    //侦听回传
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.http.apiPost('/question.saveQuestionAnswer', JSON.stringify(vc.component.addQuestionAnswerInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            vc.goBack();
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
            _getTitleTypeName: function(_titleType) {
                if (_titleType == '1001') {
                    return '单选';
                } else if (_titleType == '2002') {
                    return '多选';
                } else {
                    return '简答';
                }
            },
            _chooseTitle: function() {
                vc.emit('chooseQuestionTitle', 'openQuestionTitleModel', {});
            },
            _openDeleteQuestionTitle: function(_title) {
                let _titles = $that.addQuestionAnswerInfo.questionTitles;
                let _tmpTitles = [];
                _titles.forEach(item => {
                    if (_title.titleId != item.titleId) {
                        _tmpTitles.push(item);
                    }
                });
                $that.addQuestionAnswerInfo.questionTitles = _tmpTitles;
            }
        }
    });
})(window.vc);