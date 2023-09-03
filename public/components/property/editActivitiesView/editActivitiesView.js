(function(vc, vm) {
    vc.extends({
        data: {
            editActivitiesViewInfo: {
                activitiesId: '',
                title: '',
                typeCd: '',
                headerImg: '',
                context: '',
                startTime: '',
                endTime: '',
                typeCds: []
            }
        },
        _initMethod: function() {
            vc.component._initEditActivitiesInfo();
            $that._loadEditActivitiesType();
        },
        _initEvent: function() {
            vc.on('editActivitiesView', 'openEditActivitiesModal', function(_params) {
                vc.component.refreshEditActivitiesInfo();
                $that.editActivitiesViewInfo.activitiesId = _params.activitiesId;
                $that._listEditActivitiess();
            });
            vc.on('editActivitiesView', 'activitiesEditActivitiesInfo', function(_params) {
                vc.component.refreshEditActivitiesInfo();
                $that.editActivitiesViewInfo.activitiesId = _params.activitiesId;
                $that._listEditActivitiess();
            });
            vc.on("editActivitiesView", "notifyUploadImage", function(_param) {
                if (_param.length > 0) {
                    vc.component.editActivitiesViewInfo.headerImg = _param[0].fileId;
                } else {
                    vc.component.editActivitiesViewInfo.headerImg = ''
                }
            });
        },
        methods: {
            editActivitiesValidate: function() {
                return vc.validate.validate({
                    editActivitiesViewInfo: vc.component.editActivitiesViewInfo
                }, {
                    'editActivitiesViewInfo.title': [{
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
                    'editActivitiesViewInfo.typeCd': [{
                        limit: "required",
                        param: "",
                        errInfo: "活动类型不能为空"
                    }],
                    'editActivitiesViewInfo.headerImg': [{
                        limit: "required",
                        param: "",
                        errInfo: "头部照片不能为空"
                    }],
                    'editActivitiesViewInfo.context': [{
                        limit: "required",
                        param: "",
                        errInfo: "活动内容不能为空"
                    }],
                    'editActivitiesViewInfo.startTime': [{
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
                    'editActivitiesViewInfo.endTime': [{
                            limit: "required",
                            param: "",
                            errInfo: "结束时间不能为空"
                        },
                        {
                            limit: "dateTime",
                            param: "",
                            errInfo: "结束时间格式错误"
                        },
                    ],
                    'editActivitiesViewInfo.activitiesId': [{
                        limit: "required",
                        param: "",
                        errInfo: "活动ID不能为空"
                    }]
                });
            },
            editActivities: function() {
                if (!vc.component.editActivitiesValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.component.editActivitiesViewInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/activities.updateActivities',
                    JSON.stringify(vc.component.editActivitiesViewInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            vc.emit('activitiesManage', 'listActivities', {});
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
            refreshEditActivitiesInfo: function() {
                let _typeCds = $that.editActivitiesViewInfo.typeCds;
                vc.component.editActivitiesViewInfo = {
                    activitiesId: '',
                    title: '',
                    typeCd: '',
                    headerImg: '',
                    context: '',
                    startTime: '',
                    endTime: '',
                    typeCds: _typeCds
                }
            },
            _initEditActivitiesInfo: function() {
                $('.editActivitiesStartTime').datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd hh:ii:ss',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.editActivitiesStartTime').datetimepicker()
                    .on('changeDate', function(ev) {
                        var value = $(".editActivitiesStartTime").val();
                        vc.component.editActivitiesViewInfo.startTime = value;
                    });
                $('.editActivitiesEndTime').datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd hh:ii:ss',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.editActivitiesEndTime').datetimepicker()
                    .on('changeDate', function(ev) {
                        var value = $(".editActivitiesEndTime").val();
                        vc.component.editActivitiesViewInfo.endTime = value;
                    });
                //防止多次点击时间插件失去焦点
                document.getElementsByClassName('form-control editActivitiesStartTime')[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }

                document.getElementsByClassName("form-control editActivitiesEndTime")[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }

                let $summernote = $('.eidtSummernote').summernote({
                    lang: 'zh-CN',
                    height: 300,
                    placeholder: '必填，请输入公告内容',
                    callbacks: {
                        onImageUpload: function(files, editor, $editable) {
                            vc.component.sendEditFile($summernote, files);
                        },
                        onChange: function(contents, $editable) {
                            vc.component.editActivitiesViewInfo.context = contents;
                        }
                    }
                });
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
            closeEditActivitiesInfo: function() {
                vc.emit('activitiesManage', 'listActivities', {});
            },
            _loadEditActivitiesType: function() {
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
                        $that.editActivitiesViewInfo.typeCds = _data;
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _listEditActivitiess: function(_page, _rows) {
                var param = {
                    params: {
                        page: 1,
                        row: 1,
                        communityId: vc.getCurrentCommunity().communityId,
                        activitiesId: $that.editActivitiesViewInfo.activitiesId
                    }
                };
                //发送get请求
                vc.http.apiGet('activities.listActivitiess',
                    param,
                    function(json, res) {
                        let _params = JSON.parse(json).activitiess[0];
                        _params.context = filterXSS(_params.context);
                        vc.copyObject(_params, vc.component.editActivitiesViewInfo);
                        $(".eidtSummernote").summernote('code', vc.component.editActivitiesViewInfo.context);
                        var photos = [];
                        photos.push(vc.component.editActivitiesViewInfo.headerImg);
                        vc.emit('editActivitiesView', 'uploadImageUrl', 'notifyPhotos', photos);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
        }
    });
})(window.vc, window.vc.component);