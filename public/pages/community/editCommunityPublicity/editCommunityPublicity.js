(function(vc) {

    vc.extends({
        data: {
            editCommunityPublicityInfo: {
                pubId: '',
                title: '',
                pubType: '',
                pubTypes: [],
                headerImg: '',
                context: '',
            }
        },
        _initMethod: function() {
            $that._initTextArea();
            $that.editCommunityPublicityInfo.pubId = vc.getParam('pubId');
            $that._loadCommunityPublicity();

            vc.getDict('community_publicity', 'pub_type', function(_data) {
                $that.editCommunityPublicityInfo.pubTypes = _data;
            });

        },
        _initEvent: function() {
            vc.on('editCommunityPublicity', 'openAddCommunityPublicityModal', function() {
                $('#editCommunityPublicityModel').modal('show');
            });
            vc.on("editCommunityPublicity", "notifyUploadImage", function(_param) {
                if (_param.length > 0) {
                    $that.editCommunityPublicityInfo.headerImg = _param[0].fileId;
                } else {
                    $that.editCommunityPublicityInfo.headerImg = ''
                }
            });
        },
        methods: {
            editCommunityPublicityValidate() {
                return vc.validate.validate({
                    editCommunityPublicityInfo: $that.editCommunityPublicityInfo
                }, {
                    'editCommunityPublicityInfo.title': [{
                            limit: "required",
                            param: "",
                            errInfo: "公示标题不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "公示标题不能超过200"
                        },
                    ],
                    'editCommunityPublicityInfo.pubType': [{
                        limit: "required",
                        param: "",
                        errInfo: "公示类型不能为空"
                    }],
                    'editCommunityPublicityInfo.headerImg': [{
                        limit: "required",
                        param: "",
                        errInfo: "头部照片,照片名称不能为空"
                    }],
                    'editCommunityPublicityInfo.context': [{
                        limit: "required",
                        param: "",
                        errInfo: "活动内容不能为空"
                    }],

                });
            },
            saveCommunityPublicityInfo: function() {
                if (!$that.editCommunityPublicityValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                $that.editCommunityPublicityInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/publicity.updateCommunityPublicity',
                    JSON.stringify($that.editCommunityPublicityInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            vc.goBack();
                            return;
                        }
                        vc.toast(_json.msg);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },

            _initTextArea: function() {
                let $summernote = $('.summernote').summernote({
                    lang: 'zh-CN',
                    height: 300,
                    placeholder: '必填，请输入公告内容',
                    callbacks: {
                        onImageUpload: function(files, editor, $editable) {
                            $that.sendFile($summernote, files);
                        },
                        onChange: function(contents, $editable) {
                            $that.editCommunityPublicityInfo.context = contents;
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
            sendFile: function($summernote, files) {
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
            _goBack: function() {
                vc.goBack();
            },
            _loadCommunityPublicity: function() {
                let param = {
                    params: {
                        page: 1,
                        row: 1,
                        communityId: vc.getCurrentCommunity().communityId,
                        pubId: $that.editCommunityPublicityInfo.pubId
                    }
                };

                //发送get请求
                vc.http.apiGet('/publicity.listCommunityPublicity',
                    param,
                    function(json, res) {
                        let _communityPublicityManageInfo = JSON.parse(json);
                        vc.copyObject(_communityPublicityManageInfo.data[0], $that.editCommunityPublicityInfo);
                        $(".summernote").summernote('code', $that.editCommunityPublicityInfo.context);
                        let photos = [];
                        photos.push($that.editCommunityPublicityInfo.headerImg);
                        vc.emit('editCommunityPublicity', 'uploadImageUrl', 'notifyPhotos', photos);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            }
        }
    });

})(window.vc);