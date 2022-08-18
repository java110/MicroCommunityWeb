(function(vc) {
    vc.extends({
        data: {
            addActivitiesViewInfo: {
                activitiesId: '',
                title: '',
                typeCd: '',
                headerImg: '',
                context: '',
                startTime: '',
                endTime: '',
                typeCds: [],
                isMoreCommunity: ''
            }
        },
        _initMethod: function() {
            vc.component._initActivitiesInfo();
            $that._loadAddActivitiesType();
        },
        _initEvent: function() {
            vc.on('addActivitiesView', 'openAddActivitiesView', function() {
                //vc.component._initActivitiesInfo();
            });
            vc.on("addActivitiesView", "notifyUploadImage", function(_param) {
                if (!vc.isEmpty(_param) && _param.length > 0) {
                    vc.component.addActivitiesViewInfo.headerImg = _param[0];
                } else {
                    vc.component.addActivitiesViewInfo.headerImg = '';
                }
            });
        },
        methods: {
            addActivitiesValidate() {
                return vc.validate.validate({
                    addActivitiesViewInfo: vc.component.addActivitiesViewInfo
                }, {
                    'addActivitiesViewInfo.title': [{
                            limit: "required",
                            param: "",
                            errInfo: "活动标题不能为空"
                        },
                        {
                            limit: "maxin",
                            param: "1,200",
                            errInfo: "活动标题不能超过200位"
                        },
                    ],
                    'addActivitiesViewInfo.typeCd': [{
                            limit: "required",
                            param: "",
                            errInfo: "活动类型不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "活动类型格式错误"
                        },
                    ],
                    'addActivitiesViewInfo.headerImg': [{
                        limit: "required",
                        param: "",
                        errInfo: "头部照片不能为空"
                    }],
                    'addActivitiesViewInfo.context': [{
                        limit: "required",
                        param: "",
                        errInfo: "活动内容不能为空"
                    }],
                    'addActivitiesViewInfo.startTime': [{
                            limit: "required",
                            param: "",
                            errInfo: "开始时间不能为空"
                        },
                        {
                            limit: "dateTime",
                            param: "",
                            errInfo: "开始时间格式错误"
                        },
                    ],
                    'addActivitiesViewInfo.endTime': [{
                            limit: "required",
                            param: "",
                            errInfo: "结束时间不能为空"
                        },
                        {
                            limit: "dateTime",
                            param: "",
                            errInfo: "结束时间格式错误"
                        },
                    ]
                });
            },
            saveActivitiesInfo: function() {
                if (!vc.component.addActivitiesValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.component.addActivitiesViewInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/activities.saveActivities',
                    JSON.stringify(vc.component.addActivitiesViewInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json)
                        if (_json.code == 0) {
                            //关闭model
                            vc.component.clearaddActivitiesViewInfo();
                            vc.emit('activitiesManage', 'listActivities', {});
                            vc.toast("发布成功");
                            return;
                        }
                        vc.toast(_json.msg);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            clearaddActivitiesViewInfo: function() {
                let _typeCds = $that.addActivitiesViewInfo.typeCds;
                vc.component.addActivitiesViewInfo = {
                    activitiesId: '',
                    title: '',
                    typeCd: '',
                    headerImg: '',
                    context: '',
                    startTime: '',
                    endTime: '',
                    typeCds: _typeCds,
                    isMoreCommunity: ''
                };
            },
            _initActivitiesInfo: function() {
                vc.component.addActivitiesViewInfo.startTime = vc.dateTimeFormat(new Date().getTime());
                $('.activitiesStartTime').datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd hh:ii:ss',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.activitiesStartTime').datetimepicker()
                    .on('changeDate', function(ev) {
                        var value = $(".activitiesStartTime").val();
                        vc.component.addActivitiesViewInfo.startTime = value;
                    });
                $('.activitiesEndTime').datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd hh:ii:ss',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.activitiesEndTime').datetimepicker()
                    .on('changeDate', function(ev) {
                        var value = $(".activitiesEndTime").val();
                        vc.component.addActivitiesViewInfo.endTime = value;
                    });
                //防止多次点击时间插件失去焦点
                document.getElementsByClassName('form-control activitiesStartTime')[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }

                document.getElementsByClassName("form-control activitiesEndTime")[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }

                var $summernote = $('.summernote').summernote({
                    lang: 'zh-CN',
                    height: 300,
                    placeholder: '必填，请输入公告内容',
                    callbacks: {
                        onImageUpload: function(files, editor, $editable) {
                            vc.component.sendFile($summernote, files);
                        },
                        onChange: function(contents, $editable) {
                            vc.component.addActivitiesViewInfo.context = contents;
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
                        ['insert', ['link', 'picture']],
                        ['view', ['fullscreen', 'codeview']],
                        ['help', ['help']]
                    ],
                });
            },
            closeActivitiesInfo: function() {
                vc.emit('activitiesManage', 'listActivities', {});
            },
            sendFile: function($summernote, files) {
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
            _loadAddActivitiesType: function() {
                var param = {
                    params: {
                        page: 1,
                        row: 50,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('/activitiesType/queryActivitiesType',
                    param,
                    function(json, res) {
                        let _activitiesTypeManageInfo = JSON.parse(json);
                        let _data = _activitiesTypeManageInfo.data;
                        $that.addActivitiesViewInfo.typeCds = _data;
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            }
        }
    });
})(window.vc);