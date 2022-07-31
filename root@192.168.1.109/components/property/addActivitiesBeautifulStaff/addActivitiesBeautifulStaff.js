(function (vc) {
    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addActivitiesBeautifulStaffInfo: {
                beId: '',
                ruleId: '',
                staffId: '',
                activitiesNum: '',
                workContent: '',
                activitiesRules: []
            }
        },
        _initMethod: function () {
            $that._initAddActivitiesBeautifulStaffInfo();
        },
        _initEvent: function () {
            vc.on('addActivitiesBeautifulStaff', 'openAddActivitiesBeautifulStaffModal', function () {
                $that._listAddActivitiesRules();
            });
            vc.on("addActivitiesBeautifulStaff", "notify", function (_param) {
                if (_param.hasOwnProperty("staffId")) {
                    vc.component.addActivitiesBeautifulStaffInfo.staffId = _param.staffId;
                }
            });
        },
        methods: {
            addActivitiesBeautifulStaffValidate() {
                return vc.validate.validate({
                    addActivitiesBeautifulStaffInfo: vc.component.addActivitiesBeautifulStaffInfo
                }, {
                    'addActivitiesBeautifulStaffInfo.ruleId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "活动规则不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "活动规则格式错误"
                        },
                    ],
                    'addActivitiesBeautifulStaffInfo.staffId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "员工不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "128",
                            errInfo: "员工名称太长"
                        },
                    ],
                    'addActivitiesBeautifulStaffInfo.activitiesNum': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "员工编号不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "编号必须为数字"
                        },
                    ],
                    'addActivitiesBeautifulStaffInfo.workContent': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "工作简介不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "1024",
                            errInfo: "工作简介说明太长"
                        },
                    ],
                });
            },
            saveActivitiesBeautifulStaffInfo: function () {
                if (!vc.component.addActivitiesBeautifulStaffValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.component.addActivitiesBeautifulStaffInfo.communityId = vc.getCurrentCommunity().communityId;
                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.addActivitiesBeautifulStaffInfo);
                    $('#addActivitiesBeautifulStaffModel').modal('hide');
                    return;
                }
                vc.http.apiPost(
                    '/activitiesRule/saveActivitiesBeautifulStaff',
                    JSON.stringify(vc.component.addActivitiesBeautifulStaffInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addActivitiesBeautifulStaffModel').modal('hide');
                            vc.component.clearAddActivitiesBeautifulStaffInfo();
                            vc.emit('activitiesBeautifulStaffManage', 'listActivitiesBeautifulStaff', {});
                            return;
                        }
                        vc.message(_json.msg);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.message(errInfo);
                    });
            },
            clearAddActivitiesBeautifulStaffInfo: function () {
                vc.component.addActivitiesBeautifulStaffInfo = {
                    ruleId: '',
                    staffId: '',
                    activitiesNum: '',
                    workContent: '',
                    activitiesRules: []
                };
            },
            _listAddActivitiesRules: function (_page, _rows) {
                let _that = $that.addActivitiesBeautifulStaffInfo;
                var param = {
                    params: {
                        page: 1,
                        row: 50,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('/activitiesRule/queryActivitiesRule',
                    param,
                    function (json, res) {
                        var _activitiesRuleManageInfo = JSON.parse(json);
                        _that.activitiesRules = _activitiesRuleManageInfo.data;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _closeAddActivitiesBeauifulStaffInfo: function () {
                vc.emit('activitiesBeautifulStaffManage', 'listActivitiesBeautifulStaff', {});
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
                            $summernote.summernote('insertImage', "/callComponent/download/getFile/file?fileId=" + data.fileId + "&communityId=" + vc.getCurrentCommunity().communityId);
                            return;
                        }
                        vc.toast(json);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });

            },
            _initAddActivitiesBeautifulStaffInfo: function () {
                let $summernote = $('.summernote').summernote({
                    lang: 'zh-CN',
                    height: 300,
                    placeholder: '必填，请输入工作简介',
                    callbacks: {
                        onImageUpload: function (files, editor, $editable) {
                            vc.component.sendFile($summernote, files);
                        },
                        onChange: function (contents, $editable) {
                            vc.component.addActivitiesBeautifulStaffInfo.workContent = contents;
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
        }
    });
})(window.vc);
