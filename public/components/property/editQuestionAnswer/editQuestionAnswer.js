(function (vc, vm) {
    vc.extends({
        data: {
            editQuestionAnswerInfo: {
                qaId: '',
                qaType: '',
                qaName: '',
                startTime: '',
                endTime: '',
                remark: '',
                content: '',
                photos: []
            }
        },
        _initMethod: function () {
            vc.component._initQuestionDate();
        },
        _initEvent: function () {
            vc.on('editQuestionAnswer', 'openEditQuestionAnswerModal', function (_params) {
                vc.component.refreshEditQuestionAnswerInfo();
                $('#editQuestionAnswerModel').modal('show');
                vc.copyObject(_params, vc.component.editQuestionAnswerInfo);
                vc.component.editQuestionAnswerInfo.photos = _params.fileUrls;
                if (_params.fileUrls) {
                    vc.component._freshPhoto(vc.component.editQuestionAnswerInfo.photos);
                }
                vc.component.editQuestionAnswerInfo.communityId = vc.getCurrentCommunity().communityId;
            });
            vc.on("editQuestionAnswer", "notifyUploadImage", function (_param) {
                if (_param.length > 0) {
                    vc.component.editQuestionAnswerInfo.photos = [];
                    _param.forEach((item) => {
                        vc.component.editQuestionAnswerInfo.photos.push(item.fileId);
                    })
                }else{
                    vc.component.editQuestionAnswerInfo.photos = [];
                }
            });
        },
        methods: {
            _initQuestionDate: function () {
                $('.editStartTime').datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd hh:ii:ss',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.editStartTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".editStartTime").val();
                        vc.component.editQuestionAnswerInfo.startTime = value;
                        let start = Date.parse(new Date(vc.component.editQuestionAnswerInfo.startTime))
                        let end = Date.parse(new Date(vc.component.editQuestionAnswerInfo.endTime))
                        if (end != 0 && start - end >= 0) {
                            vc.toast("开始时间必须小于结束时间")
                            vc.component.editQuestionAnswerInfo.startTime = '';
                        }
                    });
                $('.editEndTime').datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd hh:ii:ss',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.editEndTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".editEndTime").val();
                        vc.component.editQuestionAnswerInfo.endTime = value;
                        let start = Date.parse(new Date(vc.component.editQuestionAnswerInfo.startTime))
                        let end = Date.parse(new Date(vc.component.editQuestionAnswerInfo.endTime))
                        if (start - end >= 0) {
                            vc.toast("结束时间必须大于开始时间")
                            vc.component.editQuestionAnswerInfo.endTime = '';
                        }
                    });
                //防止多次点击时间插件失去焦点
                document.getElementsByClassName('form-control editStartTime')[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }

                document.getElementsByClassName("form-control editEndTime")[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }
            },
            editQuestionAnswerValidate: function () {
                return vc.validate.validate({
                    editQuestionAnswerInfo: vc.component.editQuestionAnswerInfo
                }, {
                    'editQuestionAnswerInfo.qaType': [
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
                    'editQuestionAnswerInfo.qaName': [
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
                    'editQuestionAnswerInfo.startTime': [
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
                    'editQuestionAnswerInfo.endTime': [
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
                    'editQuestionAnswerInfo.remark': [
                        {
                            limit: "maxLength",
                            param: "512",
                            errInfo: "备注太长"
                        },
                    ],
                    'editQuestionAnswerInfo.qaId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "问卷ID不能为空"
                        }
                    ]
                });
            },
            editQuestionAnswer: function () {
                if (!vc.component.editQuestionAnswerValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.http.apiPost(
                    '/questionAnswer/updateQuestionAnswer',
                    JSON.stringify(vc.component.editQuestionAnswerInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editQuestionAnswerModel').modal('hide');
                            vc.emit('questionAnswerManage', 'listQuestionAnswer', {});
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
            refreshEditQuestionAnswerInfo: function () {
                vc.component.editQuestionAnswerInfo = {
                    qaId: '',
                    qaType: '',
                    qaName: '',
                    startTime: '',
                    endTime: '',
                    remark: '',
                    content: '',
                    photos: []
                }
            },
            _freshPhoto: function (_photos) {
                vc.emit('editQuestionAnswer', 'uploadImageUrl', 'notifyPhotos', _photos);
            },
        }
    });
})(window.vc, window.vc.component);
