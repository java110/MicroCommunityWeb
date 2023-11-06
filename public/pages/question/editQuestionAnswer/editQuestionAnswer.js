(function (vc) {
    vc.extends({
        data: {
            editQuestionAnswerInfo: {
                qaName: '',
                startTime: '',
                endTime: '',
                communityId: vc.getCurrentCommunity().communityId,
                content: '',
                titleType: '',
                questionTitles: [],
                roomIds: [],
                updateRoomIds: false,
                voteCount: 0,
                qaId: '',
            }
        },
        _initMethod: function () {
            $that.editQuestionAnswerInfo.qaId = vc.getParam('qaId');
            $that._initVoiteContent();
            vc.emit('selectRooms', 'refreshTree', {});
            $that._loadQuestionAnswerInfo();
            $that._loadQuestionTitles();
            $that._initDateInfo();
        },
        _initEvent: function () {
            vc.on('editQuestionAnswer', 'notifySelectRooms', function (_selectRooms) {
                let _roomIds = [];
                _selectRooms.forEach(item => {
                    _roomIds.push(item.roomId);
                })
                $that.editQuestionAnswerInfo.roomIds = _roomIds;
            });
            vc.on('editQuestionAnswer', 'chooseQuestionTitle', function (_title) {
                let _titles = $that.editQuestionAnswerInfo.questionTitles;
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
            _initDateInfo: function () {
                $('.startTime').datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd hh:ii:ss',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.startTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".startTime").val();
                        var start = Date.parse(new Date(value))
                        var end = Date.parse(new Date(vc.component.editQuestionAnswerInfo.endTime))
                        if (start - end >= 0) {
                            vc.toast("开始时间必须小于结束时间");
                            $(".startTime").val('');
                            vc.component.editQuestionAnswerInfo.startTime = "";
                        } else {
                            vc.component.editQuestionAnswerInfo.startTime = value;
                        }
                    });
                $('.endTime').datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd hh:ii:ss',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.endTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".endTime").val();
                        var start = Date.parse(new Date(vc.component.editQuestionAnswerInfo.startTime))
                        var end = Date.parse(new Date(value))
                        if (start - end >= 0) {
                            vc.toast("结束时间必须大于开始时间");
                            $(".endTime").val('');
                            vc.component.editQuestionAnswerInfo.endTime = "";
                        } else {
                            vc.component.editQuestionAnswerInfo.endTime = value;
                        }
                    });
                //防止多次点击时间插件失去焦点
                document.getElementsByClassName('form-control startTime')[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }

                document.getElementsByClassName("form-control endTime")[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }
            },
            _initVoiteContent: function () {
                /*vc.initDateTime('startTime', function (_value) {
                    $that.editQuestionAnswerInfo.startTime = _value;
                });
                vc.initDateTime('endTime', function (_value) {
                    $that.editQuestionAnswerInfo.endTime = _value;
                });*/
                let $summernote = $('.summernote').summernote({
                    lang: 'zh-CN',
                    height: 200,
                    placeholder: '必填，请输入投票说明',
                    callbacks: {
                        onChange: function (contents, $editable) {
                            if (contents && contents.indexOf("<p>") != -1 && contents.indexOf("</p>") != -1) {
                                contents = contents.substring(3, contents.length - 4);
                            }
                            vc.component.editQuestionAnswerInfo.content = contents;
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
            editQuestionAnswerValidate() {
                return vc.validate.validate({
                    editQuestionAnswerInfo: vc.component.editQuestionAnswerInfo
                }, {
                    'editQuestionAnswerInfo.qaName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "名称不能为空"
                        },
                        {
                            limit: "maxin",
                            param: "1,256",
                            errInfo: "名称长度必须在1位至256位"
                        }
                    ],
                    'editQuestionAnswerInfo.startTime': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "开始时间不能为空"
                        }
                    ],
                    'editQuestionAnswerInfo.endTime': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "结束时间不能为空"
                        }
                    ]
                });
            },
            _updateQuestionAnswer: function () {
                if (!vc.component.editQuestionAnswerValidate()) {
                    //侦听回传
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.http.apiPost('/question.updateQuestionAnswer', JSON.stringify(vc.component.editQuestionAnswerInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            vc.goBack();
                            vc.toast("修改成功");
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            _getTitleTypeName: function (_titleType) {
                if (_titleType == '1001') {
                    return '单选';
                } else if (_titleType == '2002') {
                    return '多选';
                } else {
                    return '简答';
                }
            },
            _chooseTitle: function () {
                vc.emit('chooseQuestionTitle', 'openQuestionTitleModel', {});
            },
            _openDeleteQuestionTitle: function (_title) {
                let _titles = $that.editQuestionAnswerInfo.questionTitles;
                let _tmpTitles = [];
                _titles.forEach(item => {
                    if (_title.titleId != item.titleId) {
                        _tmpTitles.push(item);
                    }
                });
                $that.editQuestionAnswerInfo.questionTitles = _tmpTitles;
            },
            _updateRoomIdsMethod: function () {
                $that.editQuestionAnswerInfo.updateRoomIds = true;
            },
            _loadQuestionAnswerInfo: function () {
                let param = {
                    params: {
                        page: 1,
                        row: 1,
                        communityId: vc.getCurrentCommunity().communityId,
                        qaId: $that.editQuestionAnswerInfo.qaId
                    }
                };
                //发送get请求
                vc.http.apiGet('/question.listQuestionAnswer',
                    param,
                    function (json, res) {
                        let _info = JSON.parse(json);
                        vc.copyObject(_info.data[0], $that.editQuestionAnswerInfo);
                        $(".summernote").summernote('code', $that.editQuestionAnswerInfo.content);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _loadQuestionTitles: function () {
                let param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId,
                        qaId: $that.editQuestionAnswerInfo.qaId
                    }
                };
                //发送get请求
                vc.http.apiGet('/question.listQuestionTitle',
                    param,
                    function (json, res) {
                        let _info = JSON.parse(json);
                        $that.editQuestionAnswerInfo.questionTitles = _info.data;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            }
        }
    });
})(window.vc);