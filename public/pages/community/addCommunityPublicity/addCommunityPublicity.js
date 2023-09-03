(function (vc) {
    vc.extends({
        data: {
            addCommunityPublicityInfo: {
                pubId: '',
                title: '',
                pubType: '',
                pubTypes: [],
                headerImg: '',
                context: ''
            }
        },
        _initMethod: function () {
            $that._initTextArea();
            vc.getDict('community_publicity', 'pub_type', function (_data) {
                $that.addCommunityPublicityInfo.pubTypes = _data;
            })
        },
        _initEvent: function () {
            vc.on('addCommunityPublicity', 'openAddCommunityPublicityModal', function () {
                $('#addCommunityPublicityModel').modal('show');
            });
            vc.on("addCommunityPublicity", "notifyUploadImage", function (_param) {
                if (_param.length > 0) {
                    vc.component.addCommunityPublicityInfo.headerImg = _param[0].fileId;
                } else {
                    vc.component.addCommunityPublicityInfo.headerImg = ''
                }
            });
        },
        methods: {
            addCommunityPublicityValidate() {
                return vc.validate.validate({
                    addCommunityPublicityInfo: vc.component.addCommunityPublicityInfo
                }, {
                    'addCommunityPublicityInfo.title': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "公示标题不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "公示标题不能超过200"
                        }
                    ],
                    'addCommunityPublicityInfo.pubType': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "公示类型不能为空"
                        }
                    ],
                    'addCommunityPublicityInfo.headerImg': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "头部照片,照片名称不能为空"
                        }
                    ],
                    'addCommunityPublicityInfo.context': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "活动内容不能为空"
                        }
                    ]
                });
            },
            saveCommunityPublicityInfo: function () {
                if (!vc.component.addCommunityPublicityValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.component.addCommunityPublicityInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/publicity.saveCommunityPublicity',
                    JSON.stringify(vc.component.addCommunityPublicityInfo), {
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

            _initTextArea: function () {
                let $summernote = $('.summernote').summernote({
                    lang: 'zh-CN',
                    height: 300,
                    placeholder: '必填，请输入公告内容',
                    callbacks: {
                        onImageUpload: function (files, editor, $editable) {
                            vc.component.sendFile($summernote, files);
                        },
                        onChange: function (contents, $editable) {
                            vc.component.addCommunityPublicityInfo.context = contents;
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
                            // $summernote.summernote('insertImage', "/callComponent/download/getFile/file?fileId=" + data.fileId + "&communityId=" + vc.getCurrentCommunity().communityId);
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
            _goBack: function () {
                vc.goBack();
            }
        }
    });
})(window.vc);