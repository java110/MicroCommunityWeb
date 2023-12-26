(function (vc) {
    vc.extends({
        data: {
            textareaInfo: {
                content: '',
            }
        },
        _initMethod: function () {
        
        },
        _initEvent: function () {
            vc.on('textarea', 'init', function (_param) {
                $that.textareaInfo = _param;
                $that._initTextarea();
            });
            vc.on('textarea','setText',function(content){
                $(".summernote").summernote('code', content);
            })
        },
        methods: {
            _initTextarea: function () {
                let $summernote = $('.summernote').summernote({
                    lang: 'zh-CN',
                    height: 300,
                    placeholder: '必填，请输入内容',
                    callbacks: {
                        onImageUpload: function (files, editor, $editable) {
                            $that.sendTextareaFile($summernote, files);
                        },
                        onChange: function (contents, $editable) {
                            $that.textareaInfo.content = contents;
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
                        ['insert', ['link', 'picture']]
                    ],
                });
            },
            sendTextareaFile: function ($summernote, files) {
                let param = new FormData();
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