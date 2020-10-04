(function (vc) {

    vc.extends({
        data: {
            addSysDocumentViewInfo: {
                docId: '',
                docTitle: '',
                docCode: '',
                docContent: ''
            }
        },
        _initMethod: function () {
            vc.component._initSysDocumentInfo();

            $that._loadAddSysDocumentType();

        },
        _initEvent: function () {
            vc.on('addSysDocumentView', 'openAddSysDocumentView', function () {
                //vc.component._initSysDocumentInfo();

            });
        },
        methods: {
            addSysDocumentValidate() {
                return vc.validate.validate({
                    addSysDocumentViewInfo: vc.component.addSysDocumentViewInfo
                }, {
                    'addSysDocumentViewInfo.docTitle': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "文档标题不能为空"
                        },
                        {
                            limit: "maxin",
                            param: "1,200",
                            errInfo: "文档标题不能超过200位"
                        },
                    ],
                    'addSysDocumentViewInfo.docCode': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "文档编码不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "文档编码超过200位"
                        },
                    ],
                    'addSysDocumentViewInfo.docContext': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "活动内容不能为空"
                        }
                    ]


                });
            },
            saveSysDocumentInfo: function () {
                if (!vc.component.addSysDocumentValidate()) {
                    vc.toast(vc.validate.errInfo);

                    return;
                }


                vc.http.apiPost(
                    '/sysDocument/saveSysDocument',
                    JSON.stringify(vc.component.addSysDocumentViewInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            vc.component.clearaddSysDocumentViewInfo();
                            vc.emit('sysDocumentManage', 'listSysDocument', {});

                            return;
                        }
                        vc.toast(_json.msg);

                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.toast(errInfo);

                    });
            },
            clearaddSysDocumentViewInfo: function () {
                vc.component.addSysDocumentViewInfo = {
                    docId: '',
                    docTitle: '',
                    docCode: '',
                    docContent: ''

                };
            },
            _initSysDocumentInfo: function () {
                var $summernote = $('.summernote').summernote({
                    lang: 'zh-CN',
                    height: 300,
                    placeholder: '必填，请输入公告内容',
                    callbacks: {
                        onImageUpload: function (files, editor, $editable) {
                            vc.component.sendFile($summernote, files);
                        },
                        onChange: function (contents, $editable) {
                            vc.component.addSysDocumentViewInfo.docContext = contents;
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
            closeSysDocumentInfo: function () {
                vc.emit('sysDocumentManage', 'listSysDocument', {});

            },
            sendFile: function ($summernote, files) {
                console.log('上传图片', files);

                var param = new FormData();
                param.append("uploadFile", files[0]);
                param.append('communityId', vc.getCurrentCommunity().communityId);

                vc.http.upload(
                    'addActivitiesView',
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

        }
    });

})(window.vc);
