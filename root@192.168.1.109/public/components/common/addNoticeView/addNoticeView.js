(function (vc) {
    vc.extends({
        data: {
            addNoticeViewInfo: {
                title: '',
                noticeTypeCd: '',
                context: '',
                startTime: '',
                endTime: '',
                objType: '',
                objId: '',
                floorId: '',
                unitId: '',
                roomId: '',
                state: '3000',
                isAll: 'N'
            }
        },
        _initMethod: function () {
            vc.component._initNoticeInfo();
        },
        _initEvent: function () {
            vc.on('addNoticeView', 'notify', function (_param) {
                //vc.component._initNoticeInfo();
                if (_param.hasOwnProperty('floorId')) {
                    $that.addNoticeViewInfo.floorId = _param.floorId;
                }
                if (_param.hasOwnProperty('unitId')) {
                    $that.addNoticeViewInfo.unitId = _param.unitId;
                }
                if (_param.hasOwnProperty('roomId')) {
                    $that.addNoticeViewInfo.roomId = _param.roomId;
                }
            });
        },
        methods: {
            addNoticeValidate() {
                return vc.validate.validate({
                    addNoticeViewInfo: vc.component.addNoticeViewInfo
                }, {
                    'addNoticeViewInfo.title': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "标题不能为空"
                        }
                    ],
                    'addNoticeViewInfo.noticeTypeCd': [
                        {
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
                    'addNoticeViewInfo.context': [
                        {
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
                    'addNoticeViewInfo.startTime': [
                        {
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
                    'addNoticeViewInfo.endTime': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "结束时间不能为空"
                        },
                        {
                            limit: "dateTime",
                            param: "",
                            errInfo: "开始时间不是有效的日期"
                        },
                    ]
                });
            },
            saveNoticeInfo: function () {
                if ($that.addNoticeViewInfo.noticeTypeCd != '1003') {
                    $that.addNoticeViewInfo.objType = '001';
                }
                if ($that.addNoticeViewInfo.objType == '001'
                    || $that.addNoticeViewInfo.objType == '005') {
                    $that.addNoticeViewInfo.objId = vc.getCurrentCommunity().communityId;
                } else if ($that.addNoticeViewInfo.objType == '002') {
                    $that.addNoticeViewInfo.objId = $that.addNoticeViewInfo.floorId;
                } else if ($that.addNoticeViewInfo.objType == '003') {
                    $that.addNoticeViewInfo.objId = $that.addNoticeViewInfo.unitId;
                } else {
                    $that.addNoticeViewInfo.objId = $that.addNoticeViewInfo.roomId;
                }
                if ($that.addNoticeViewInfo.noticeTypeCd == '1003') {
                    $that.addNoticeViewInfo.state = '1000';
                }
                if (!vc.component.addNoticeValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                if ($that.addNoticeViewInfo.objId == "") {
                    vc.toast("未选择发布范围");
                    return;
                }
                vc.component.addNoticeViewInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.post(
                    'addNoticeView',
                    'save',
                    JSON.stringify(vc.component.addNoticeViewInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        if (res.status == 200) {
                            //关闭model
                            vc.component.clearaddNoticeViewInfo();
                            vc.emit('noticeManage', 'listNotice', {});
                            vc.toast("添加成功")
                            return;
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            clearaddNoticeViewInfo: function () {
                vc.emit('addNoticeView', 'floorSelect2', 'clearFloor', {});
                vc.emit('addNoticeView', 'unitSelect2', 'clearUnit', {});
                vc.emit('addNoticeView', 'roomSelect2', 'clearRoom', {});
                vc.component.addNoticeViewInfo = {
                    title: '',
                    noticeTypeCd: '',
                    context: '',
                    startTime: '',
                    endTime: '',
                    objType: '',
                    objId: '',
                    floorId: '',
                    unitId: '',
                    roomId: '',
                    state: '3000',
                    isAll: 'N'
                };
            },
            _initNoticeInfo: function () {
                vc.component.addNoticeViewInfo.startTime = vc.dateTimeFormat(new Date().getTime());
                $('.addNoticeStartTime').datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd hh:ii:ss',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.addNoticeStartTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".addNoticeStartTime").val();
                        vc.component.addNoticeViewInfo.startTime = value;
                        let start = Date.parse(new Date(vc.component.addNoticeViewInfo.startTime))
                        let end = Date.parse(new Date(vc.component.addNoticeViewInfo.endTime))
                        if (end != 0 && start - end >= 0) {
                            vc.toast("开始时间必须小于结束时间")
                            vc.component.addNoticeViewInfo.startTime = '';
                        }
                    });
                $('.addNoticeEndTime').datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd hh:ii:ss',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.addNoticeEndTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".addNoticeEndTime").val();
                        vc.component.addNoticeViewInfo.endTime = value;
                        let start = Date.parse(new Date(vc.component.addNoticeViewInfo.startTime))
                        let end = Date.parse(new Date(vc.component.addNoticeViewInfo.endTime))
                        if (start - end >= 0) {
                            vc.toast("结束时间必须大于开始时间")
                            vc.component.addNoticeViewInfo.endTime = '';
                        }
                    });
                //防止多次点击时间插件失去焦点
                document.getElementsByClassName('form-control addNoticeStartTime')[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }

                document.getElementsByClassName("form-control addNoticeEndTime")[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }
                var $summernote = $('.summernote').summernote({
                    lang: 'zh-CN',
                    height: 300,
                    placeholder: '必填，请输入公告内容',
                    callbacks: {
                        onImageUpload: function (files, editor, $editable) {
                            vc.component.sendFile($summernote, files);
                        },
                        onChange: function (contents, $editable) {
                            vc.component.addNoticeViewInfo.context = contents;
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
            closeNoticeInfo: function () {
                vc.emit('noticeManage', 'listNotice', {});
            },
            sendFile: function ($summernote, files) {
                console.log('上传图片', files);
                var param = new FormData();
                param.append("uploadFile", files[0]);
                param.append('communityId', vc.getCurrentCommunity().communityId);
                vc.http.upload(
                    'addNoticeView',
                    'uploadImage',
                    param,
                    {
                        emulateJSON: true,
                        //添加请求头
                        headers: {
                            "Content-Type": "multipart/form-data"
                        }
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        if (res.status == 200) {
                            var data = JSON.parse(json);
                            //关闭model
                            //$summernote.summernote('insertImage', "/callComponent/download/getFile/file?fileId=" + data.fileId + "&communityId=" + vc.getCurrentCommunity().communityId);
                            $summernote.summernote('insertImage',  data.url);
                            return;
                        }
                        vc.toast(json);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            _changeObjType: function () {
            }
        }
    });
})(window.vc);
