(function (vc, vm) {

    vc.extends({
        data: {
            editSysDocumentViewInfo: {
                docId: '',
                docTitle: '',
                docCode: '',
                docContent: ''
            }
        },
        _initMethod: function () {
            vc.component._initEditSysDocumentInfo();
           
        },
        _initEvent: function () {
            vc.on('editSysDocumentView', 'openEditSysDocumentModal', function (_params) {
                vc.component.refreshEditSysDocumentInfo();
                _params.context = filterXSS(_params.context);
                vc.component.editSysDocumentViewInfo = _params;


            });
            vc.on('editSysDocumentView', 'sysDocumentEditSysDocumentInfo', function (_params) {
                vc.component.refreshEditSysDocumentInfo();
                _params.context = filterXSS(_params.context);
                vc.copyObject(_params, vc.component.editSysDocumentViewInfo);
                $(".eidtSummernote").summernote('code', vc.component.editSysDocumentViewInfo.context);
                var photos = [];
                photos.push(vc.component.editSysDocumentViewInfo.headerImg);
                vc.emit('editSysDocumentView', 'uploadImage', 'notifyPhotos', photos);
            });

            vc.on("editSysDocumentView", "notifyUploadImage", function (_param) {
                if (!vc.isEmpty(_param) && _param.length > 0) {
                    vc.component.editSysDocumentViewInfo.headerImg = _param[0];
                } else {
                    vc.component.editSysDocumentViewInfo.headerImg = '';
                }
            });

        },
        methods: {
            editSysDocumentValidate: function () {
                return vc.validate.validate({
                    editSysDocumentViewInfo: vc.component.editSysDocumentViewInfo
                }, {
                    'editSysDocumentViewInfo.docTitle': [
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
                    'editSysDocumentViewInfo.docCode': [
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
                    'editSysDocumentViewInfo.docContext': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "活动内容不能为空"
                        }
                    ],
                    'editSysDocumentViewInfo.docId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "文档ID不能为空"
                        }]

                });
            },
            editSysDocument: function () {
                if (!vc.component.editSysDocumentValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.component.editSysDocumentViewInfo.communityId = vc.getCurrentCommunity().communityId;

                vc.http.apiPost(
                    '/sysDocument/updateSysDocument',
                    JSON.stringify(vc.component.editSysDocumentViewInfo),
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
            refreshEditSysDocumentInfo: function () {
                vc.component.editSysDocumentViewInfo = {
                    docId: '',
                    docTitle: '',
                    docCode: '',
                    docContent: ''
                }
            },
            _initEditSysDocumentInfo: function () {
                $('.eidtSummernote').summernote({
                    lang: 'zh-CN',
                    height: 300,
                    placeholder: '必填，请输入公告内容',
                    callbacks: {
                        onImageUpload: function (files, editor, $editable) {
                            vc.component.sendEditFile(files);
                        },
                        onChange: function (contents, $editable) {
                            vc.component.editSysDocumentViewInfo.docContext = contents;
                        }
                    }
                });

            },
            sendEditFile: function (files) {
                console.log('上传图片');
            },
            closeEditSysDocumentInfo: function () {
                vc.emit('sysDocumentManage', 'listSysDocument', {});

            }
        }
    });

})(window.vc, window.vc.component);
