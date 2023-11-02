(function (vc) {
    vc.extends({
        data: {
            addExamineStaffInfo: {
                esId: '',
                orgName: '',
                staffName: '',
                staffId: '',
                post: '',
                introduction: '',
                headerImg: '',
                projects: [],
                projectIds: []
            }
        },
        _initMethod: function () {
            $that._listExamineProjects();
            $that._initTextArea();
        },
        _initEvent: function () {
            vc.on("addExamineStaff", "notifyUploadImage", function (_param) {
                if (_param.length > 0) {
                    vc.component.addExamineStaffInfo.headerImg = _param[0].fileId;
                } else {
                    vc.component.addExamineStaffInfo.headerImg = ''
                }
            });
        },
        methods: {
            addExamineStaffValidate() {
                return vc.validate.validate({
                    addExamineStaffInfo: vc.component.addExamineStaffInfo
                }, {
                    'addExamineStaffInfo.staffId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "员工名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "30",
                            errInfo: "员工不能超过30"
                        }
                    ]
                });
            },
            saveExamineStaffInfo: function () {
                if (!vc.component.addExamineStaffValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.component.addExamineStaffInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/examine.saveExamineStaff',
                    JSON.stringify(vc.component.addExamineStaffInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            vc.goBack();
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
            chooseStaff: function () {
                vc.emit('selectStaff', 'openStaff', $that.addExamineStaffInfo);
            },
            _listExamineProjects: function (_page, _rows) {
                let param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('/examine.listExamineProject',
                    param,
                    function (json, res) {
                        let _examineProjectManageInfo = JSON.parse(json);
                        $that.addExamineStaffInfo.projects = _examineProjectManageInfo.data;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _goBack: function () {
                vc.goBack();
            },
            _initTextArea: function () {
                var $summernote = $('.summernote').summernote({
                    lang: 'zh-CN',
                    height: 300,
                    placeholder: '必填，请输入员工简介',
                    callbacks: {
                        onImageUpload: function (files, editor, $editable) {
                            $that.sendFile($summernote, files);
                        },
                        onChange: function (contents, $editable) {
                            if (contents && contents.indexOf("<p>") != -1 && contents.indexOf("</p>") != -1) {
                                contents = contents.substring(3, contents.length - 4);
                            }
                            vc.component.addExamineStaffInfo.introduction = contents;
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
                    ],
                });
            },
            sendFile: function ($summernote, files) {
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
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        if (res.status == 200) {
                            var data = JSON.parse(json);
                            //关闭model
                            //$summernote.summernote('insertImage', "/callComponent/download/getFile/file?fileId=" + data.fileId + "&communityId=" + vc.getCurrentCommunity().communityId);
                            $summernote.summernote('insertImage', data.url);
                            return;
                        }
                        vc.toast(json);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
        }
    });
})(window.vc);