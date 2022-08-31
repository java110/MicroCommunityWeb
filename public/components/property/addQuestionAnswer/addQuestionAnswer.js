(function (vc) {
    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addQuestionAnswerInfo: {
                qaId: '',
                qaType: '',
                qaName: '',
                startTime: '',
                endTime: '',
                remark: '',
                content: '',
                objType: '',
                photos: [],
                objId: ''
            }
        },
        _initMethod: function () {
            vc.component._initAnswerDate();
        },
        _initEvent: function () {
            vc.on('addQuestionAnswer', 'openAddQuestionAnswerModal', function () {
                $('#addQuestionAnswerModel').modal('show');
            });
            vc.on("addQuestionAnswer", "notifyUploadImage", function (_param) {
                if (_param.length > 0) {
                    vc.component.addQuestionAnswerInfo.photos = [];
                    _param.forEach((item) => {
                        vc.component.addQuestionAnswerInfo.photos.push(item.fileId);
                    })
                }else{
                    vc.component.addQuestionAnswerInfo.photos = [];
                }
            });
        },
        methods: {
            _initAnswerDate: function () {
                $('.addStartTime').datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd hh:ii:ss',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.addStartTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".addStartTime").val();
                        vc.component.addQuestionAnswerInfo.startTime = value;
                        let start = Date.parse(new Date(vc.component.addQuestionAnswerInfo.startTime))
                        let end = Date.parse(new Date(vc.component.addQuestionAnswerInfo.endTime))
                        if (end != 0 && start - end >= 0) {
                            vc.toast("开始时间必须小于结束时间")
                            vc.component.addQuestionAnswerInfo.startTime = '';
                        }
                    });
                $('.addEndTime').datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd hh:ii:ss',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.addEndTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".addEndTime").val();
                        vc.component.addQuestionAnswerInfo.endTime = value;
                        let start = Date.parse(new Date(vc.component.addQuestionAnswerInfo.startTime))
                        let end = Date.parse(new Date(vc.component.addQuestionAnswerInfo.endTime))
                        if (start - end >= 0) {
                            vc.toast("结束时间必须大于开始时间")
                            vc.component.addQuestionAnswerInfo.endTime = '';
                        }
                    });
                //防止多次点击时间插件失去焦点
                document.getElementsByClassName('form-control addStartTime')[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }

                document.getElementsByClassName("form-control addEndTime")[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }
            },
            addQuestionAnswerValidate() {
                return vc.validate.validate({
                    addQuestionAnswerInfo: vc.component.addQuestionAnswerInfo
                }, {
                    'addQuestionAnswerInfo.qaType': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "问卷类型不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "问卷类型格式错误"
                        },
                    ],
                    'addQuestionAnswerInfo.qaName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "问卷名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "256",
                            errInfo: "问卷名称太长"
                        },
                    ],
                    'addQuestionAnswerInfo.startTime': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "开始时间不能为空"
                        },
                        {
                            limit: "datetime",
                            param: "",
                            errInfo: "开始时间错误"
                        },
                    ],
                    'addQuestionAnswerInfo.endTime': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "结束时间不能为空"
                        },
                        {
                            limit: "datetime",
                            param: "",
                            errInfo: "结束时间错误"
                        },
                    ],
                    'addQuestionAnswerInfo.remark': [
                        {
                            limit: "maxLength",
                            param: "512",
                            errInfo: "备注太长"
                        },
                    ]
                });
            },
            saveQuestionAnswerInfo: function () {
                if (!vc.component.addQuestionAnswerValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.component.addQuestionAnswerInfo.communityId = vc.getCurrentCommunity().communityId;
                if ($that.addQuestionAnswerInfo.qaType == '1001' || $that.addQuestionAnswerInfo.qaType == '3003') {
                    $that.addQuestionAnswerInfo.objType = '3306';
                    $that.addQuestionAnswerInfo.objId = vc.getCurrentCommunity().communityId;
                } else {
                    $that.addQuestionAnswerInfo.objType = '3307';
                    $that.addQuestionAnswerInfo.objId = '-1';
                }
                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.addQuestionAnswerInfo);
                    $('#addQuestionAnswerModel').modal('hide');
                    return;
                }
                vc.http.apiPost(
                    '/questionAnswer/saveQuestionAnswer',
                    JSON.stringify(vc.component.addQuestionAnswerInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addQuestionAnswerModel').modal('hide');
                            vc.component.clearAddQuestionAnswerInfo();
                            vc.emit('questionAnswerManage', 'listQuestionAnswer', {});
                            vc.toast("添加成功");
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
            clearAddQuestionAnswerInfo: function () {
                vc.component.addQuestionAnswerInfo = {
                    qaType: '',
                    qaName: '',
                    startTime: '',
                    endTime: '',
                    remark: '',
                    content: '',
                    objType: '',
                    photos: [],
                    objId: ''
                };
            }
        }
    });
})(window.vc);
