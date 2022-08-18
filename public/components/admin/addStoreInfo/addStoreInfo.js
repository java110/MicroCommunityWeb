(function(vc) {
    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addStoreInfoInfo: {
                storeInfoId: '',
                name: '',
                convenienceMenusId: '',
                isShow: '',
                icon: '',
                tel: '',
                site: '',
                seq: '',
                workTime: '',
                remark: '',

            }
        },
        _initMethod: function() {
            $that._initAddProduct();
        },
        _initEvent: function() {
            vc.on('addStoreInfo', 'openAddStoreInfoModal', function() {
                $('#addStoreInfoModel').modal('show');
            });
            vc.on("addIcon", "notifyUploadCoverImage", function(_param) {
                if (_param.length > 0) {
                    vc.component.addStoreInfoInfo.icon = _param[0];
                } else {
                    vc.component.addStoreInfoInfo.icon = '';
                }
            });
        },
        methods: {
            addStoreInfoValidate() {
                return vc.validate.validate({
                    addStoreInfoInfo: vc.component.addStoreInfoInfo
                }, {
                    'addStoreInfoInfo.name': [{
                            limit: "required",
                            param: "",
                            errInfo: "商户名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "50",
                            errInfo: "商户名称太长"
                        },
                    ],
                    'addStoreInfoInfo.tel': [{
                        limit: "maxLength",
                        param: "13",
                        errInfo: "电话太长"
                    }, ],
                    'addStoreInfoInfo.site': [{
                        limit: "maxLength",
                        param: "100",
                        errInfo: "商户位置太长"
                    }, ],
                    'addStoreInfoInfo.seq': [{
                            limit: "required",
                            param: "",
                            errInfo: "显示序号不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "显示序号不是有效数字"
                        },
                    ],
                    'addStoreInfoInfo.workTime': [{
                        limit: "maxLength",
                        param: "200",
                        errInfo: "工作时间太长"
                    }, ],
                    'addStoreInfoInfo.remark': [{
                        limit: "maxLength",
                        param: "5000",
                        errInfo: "备注太长"
                    }, ],


                });
            },
            saveStoreInfoInfo: function() {
                if (!vc.component.addStoreInfoValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.addStoreInfoInfo);
                    $('#addStoreInfoModel').modal('hide');
                    return;
                }
                vc.http.apiPost(
                    '/storeInfo/saveStoreInfo',

                    JSON.stringify(vc.component.addStoreInfoInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addStoreInfoModel').modal('hide');
                            vc.component.clearAddStoreInfoInfo();
                            vc.emit('storeInfoManage', 'listStoreInfo', {});
                            vc.toast(_json.msg);
                            return;
                        }
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            _initAddProduct: function() {
                let $summernote = $('.summernote').summernote({
                    lang: 'zh-CN',
                    height: 300,
                    placeholder: '必填，请输入商家信息',
                    callbacks: {
                        onImageUpload: function(files, editor, $editable) {
                            $that.sendFile($summernote, files);
                        },
                        onChange: function(contents, $editable) {
                            $that.addStoreInfoInfo.remark = contents;
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
                            $summernote.summernote('insertImage', "/callComponent/download/getFile/file?fileId=" + data.fileId + "&communityId=-1");
                            return;
                        }
                        vc.toast(json);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            _closeAddProductInfo: function() {
                $that.clearAddStoreInfoInfo();
                vc.emit('storeInfoManage', 'listStoreInfo', {});
            },
            clearAddStoreInfoInfo: function() {
                vc.component.addStoreInfoInfo = {
                    name: '',
                    convenienceMenusId: '',
                    isShow: '',
                    icon: '',
                    tel: '',
                    site: '',
                    seq: '',
                    workTime: '',
                    remark: '',
                };
            }
        }
    });
})(window.vc);