(function (vc) {

    vc.extends({
        data: {
            addTemplateViewInfo: {
                contractTypeId: '',
                context: '',
                templateId: ''
            }
        },
        _initMethod: function () {
            vc.component._initTemplateInfo();
        },
        _initEvent: function () {

            vc.on('addTemplateView', 'openTemplate', function (_param) {
                $that.clearaddTemplateViewInfo();
                $that.addTemplateViewInfo.contractTypeId = _param.contractTypeId;
                $that._loadTemplate();
            })

        },
        methods: {
            addTemplateValidate() {
                return vc.validate.validate({
                    addTemplateViewInfo: vc.component.addTemplateViewInfo
                }, {
                    'addTemplateViewInfo.contractTypeId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "合同类型不能为空"
                        }
                    ],
                    'addTemplateViewInfo.context': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "模板内容必填"
                        },
                    ]

                });
            },
            saveTemplateInfo: function () {
                let _url = "/contract/saveContractTypeTemplate";
                if ($that.addTemplateViewInfo.templateId != '' && $that.addTemplateViewInfo.templateId != '-1') {
                    _url = "/contract/updateContractTypeTemplate";
                }

                vc.http.apiPost(_url,
                    JSON.stringify(vc.component.addTemplateViewInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        if (res.status == 200) {
                            //关闭model
                            vc.component.clearaddTemplateViewInfo();
                            vc.emit('contractTypeManage', 'componentShow', {});
                            return;
                        }
                        vc.toast(json);

                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.toast(errInfo);

                    });
            },
            clearaddTemplateViewInfo: function () {
                vc.component.addTemplateViewInfo = {
                    contractTypeId: '',
                    context: '',
                    templateId: ''

                };
            },
            _initTemplateInfo: function () {
                vc.component.addTemplateViewInfo.startTime = vc.dateFormat(new Date().getTime());
                var $summernote = $('.summernote').summernote({
                    lang: 'zh-CN',
                    height: 300,
                    placeholder: '必填，请输入合同模板',
                    callbacks: {
                        onImageUpload: function (files, editor, $editable) {
                            vc.component.sendFile($summernote, files);
                        },
                        onChange: function (contents, $editable) {
                            vc.component.addTemplateViewInfo.context = contents;
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
                        ['view', ['fullscreen', 'codeview']],
                        ['help', ['help']]
                    ],
                });
            },
            closeTemplateInfo: function () {
                vc.emit('contractTypeManage', 'componentShow', {});

            },

            _loadTemplate: function () {
                let param = {
                    params: {
                        page: 1,
                        row: 1,
                        contractTypeId: $that.addTemplateViewInfo.contractTypeId
                    }
                }
                //发送get请求
                vc.http.apiGet('/contract/queryContractTypeTemplate',
                    param,
                    function (json, res) {
                        var _contractTypeManageInfo = JSON.parse(json);

                        let _contractTypeTemplates = _contractTypeManageInfo.data;

                        if (_contractTypeTemplates.length < 1) {
                            return;
                        }
                        $that.addTemplateViewInfo.templateId = _contractTypeTemplates[0].templateId;
                        $that.addTemplateViewInfo.context = _contractTypeTemplates[0].context;
                        $(".summernote").summernote('code',  $that.addTemplateViewInfo.context);

                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            }

        }
    });

})(window.vc);
