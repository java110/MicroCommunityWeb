(function(vc, vm) {
    vc.extends({
        data: {
            editNoticeViewInfo: {
                noticeId: '',
                title: '',
                noticeTypeCd: '',
                context: '',
                startTime: '',
                endTime: ''
            }
        },
        _initMethod: function() {
            vc.component._initEditNoticeInfo();
        },
        _initEvent: function() {
            vc.on('editNoticeViewInfo', 'openEditNoticeModal', function(_params) {
                vc.component.refreshEditNoticeInfo();
                _params.context = filterXSS(_params.context);
                vc.component.editNoticeInfo = _params;
            });
            vc.on('editNoticeView', 'noticeEditNoticeInfo', function(_params) {
                vc.component.refreshEditNoticeInfo();
                _params.context = filterXSS(_params.context);
                vc.copyObject(_params, vc.component.editNoticeViewInfo);
                $(".eidtSummernote").summernote('code', vc.component.editNoticeViewInfo.context);
            });
        },
        methods: {
            editNoticeValidate: function() {
                return vc.validate.validate({
                    editNoticeViewInfo: vc.component.editNoticeViewInfo
                }, {
                    'editNoticeViewInfo.title': [{
                            limit: "required",
                            param: "",
                            errInfo: "标题不能为空"
                        },
                        {
                            limit: "maxin",
                            param: "4,100",
                            errInfo: "标题必须在4至100字符之间"
                        },
                    ],
                    'editNoticeViewInfo.noticeTypeCd': [{
                            limit: "required",
                            param: "",
                            errInfo: "公告类型不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "公告类型错误"
                        },
                    ],
                    'editNoticeViewInfo.context': [{
                            limit: "required",
                            param: "",
                            errInfo: "公告内容不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "10000",
                            errInfo: "公告内容不能超过10000个字"
                        },
                    ],
                    'editNoticeViewInfo.startTime': [{
                            limit: "required",
                            param: "",
                            errInfo: "开始时间不能为空"
                        },
                        {
                            limit: "dateTime",
                            param: "",
                            errInfo: "开始时间不是有效的日期"
                        },
                    ],
                    'editNoticeViewInfo.endTime': [{
                            limit: "required",
                            param: "",
                            errInfo: "结束时间不能为空"
                        },
                        {
                            limit: "dateTime",
                            param: "",
                            errInfo: "开始时间不是有效的日期"
                        },
                    ],
                    'editNoticeViewInfo.noticeId': [{
                        limit: "required",
                        param: "",
                        errInfo: "公告ID不能为空"
                    }]
                });
            },
            editNotice: function() {
                if (!vc.component.editNoticeValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.component.editNoticeViewInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/notice.updateNotice',
                    JSON.stringify(vc.component.editNoticeViewInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json)
                        if (_json.code == 0) {
                            //关闭model
                            vc.emit('noticeManage', 'listNotice', {});
                            vc.toast("修改成功");
                            return;
                        }
                        vc.toast(_json.msg);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            refreshEditNoticeInfo: function() {
                vc.component.editNoticeViewInfo = {
                    noticeId: '',
                    title: '',
                    noticeTypeCd: '',
                    context: '',
                    startTime: '',
                    endTime: ''
                }
            },
            _initEditNoticeInfo: function() {
                $('.editNoticeStartTime').datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd hh:ii:ss',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.editNoticeStartTime').datetimepicker()
                    .on('changeDate', function(ev) {
                        var value = $(".editNoticeStartTime").val();
                        vc.component.editNoticeViewInfo.startTime = value;
                    });
                $('.editNoticeEndTime').datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd hh:ii:ss',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.editNoticeEndTime').datetimepicker()
                    .on('changeDate', function(ev) {
                        var value = $(".editNoticeEndTime").val();
                        vc.component.editNoticeViewInfo.endTime = value;
                    });
                let $summernote = $('.eidtSummernote').summernote({
                    lang: 'zh-CN',
                    height: 300,
                    placeholder: '必填，请输入公告内容',
                    callbacks: {
                        onImageUpload: function(files, editor, $editable) {
                            $that.sendEditFile($summernote, files);
                        },
                        onChange: function(contents, $editable) {
                            vc.component.editNoticeViewInfo.context = contents;
                        }
                    }
                });
                //防止多次点击时间插件失去焦点
                document.getElementsByClassName('form-control editNoticeStartTime')[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }

                document.getElementsByClassName("form-control editNoticeEndTime")[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }
            },
            sendEditFile: function($summernote, files) {
                console.log('上传图片', files);
                var param = new FormData();
                param.append("uploadFile", files[0]);
                param.append('communityId', vc.getCurrentCommunity().communityId);
                vc.http.upload(
                    'uploadFile',
                    'uploadImage',
                    param, {
                        emulateJSON: true,
                        //添加请求头
                        headers: {
                            "Content-Type": "multipart/form-data"
                        }
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        if (res.status == 200) {
                            var data = JSON.parse(json);
                            //关闭model
                            // $summernote.summernote('insertImage', "/callComponent/download/getFile/file?fileId=" + data.fileId + "&communityId=" + vc.getCurrentCommunity().communityId);
                            $summernote.summernote('insertImage', data.url);

                            return;
                        }
                        vc.toast(json);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            closeEditNoticeInfo: function() {
                vc.emit('noticeManage', 'listNotice', {});
            },
        }
    });
})(window.vc, window.vc.component);