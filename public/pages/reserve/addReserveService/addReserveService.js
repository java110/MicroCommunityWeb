(function (vc) {

    vc.extends({
        data: {
            addReserveServiceInfo: {
                goodsId: '',
                goodsName: '',
                goodsDesc: '',
                type: '2002',
                paramsId: '',
                price: '',
                sort: '',
                state: '',
                startDate: '',
                endDate: '',
                imgUrl: '',
                catalogId:'',
                content:'',
                reserveParamss:[]
            }
        },
        _initMethod: function () {
            $that.addReserveServiceInfo.catalogId = vc.getParam('catalogId');
            $that._listReserveParamss();
            $that._initGoodsContent();

            vc.initDate('reserveStartTime', function (_value) {
                $that.addReserveServiceInfo.startDate = _value;
            });
            vc.initDate('reserveEndTime', function (_value) {
                $that.addReserveServiceInfo.endDate = _value;
            });
        },
        _initEvent: function () {
            vc.on('addReserveService', 'notifyUploadCoverImage', function (data) {
                if (data.length > 0) {
                    $that.addReserveServiceInfo.imgUrl = data[0].url;
                }
            });
        },
        methods: {
            addReserveServiceValidate() {
                return vc.validate.validate({
                    addReserveServiceInfo: vc.component.addReserveServiceInfo
                }, {
                    'addReserveServiceInfo.goodsName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "128",
                            errInfo: "名称不能超过128"
                        },
                    ],
                    'addReserveServiceInfo.goodsDesc': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "商品简介不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "256",
                            errInfo: "商品简介不能超过256"
                        },
                    ],
                    'addReserveServiceInfo.type': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "类型不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "12",
                            errInfo: "类型不能超过12"
                        },
                    ],
                    'addReserveServiceInfo.paramsId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "参数ID不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "30",
                            errInfo: "参数ID不能超过30"
                        },
                    ],
                    'addReserveServiceInfo.price': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "单价不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "12",
                            errInfo: "单价不能超过12"
                        },
                    ],
                    'addReserveServiceInfo.sort': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "排序不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "12",
                            errInfo: "排序不能超过12"
                        },
                    ],
                    'addReserveServiceInfo.state': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "状态不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "12",
                            errInfo: "状态不能超过12"
                        },
                    ],
                    'addReserveServiceInfo.startDate': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "开始时间不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "12",
                            errInfo: "开始时间不能超过12"
                        },
                    ],
                    'addReserveServiceInfo.endDate': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "结束时间不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "12",
                            errInfo: "结束时间不能超过12"
                        },
                    ],
                    'addReserveServiceInfo.imgUrl': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "产品封面不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "512",
                            errInfo: "产品封面不能超过512"
                        },
                    ],
                });
            },
            saveReserveServiceInfo: function () {
                if (!vc.component.addReserveServiceValidate()) {
                    vc.toast(vc.validate.errInfo);

                    return;
                }

                vc.component.addReserveServiceInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/reserve.saveReserveGoods',
                    JSON.stringify(vc.component.addReserveServiceInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            vc.goBack();
                            return;
                        }
                        vc.toast(_json.msg);

                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.toast(errInfo);

                    });
            },
            _listReserveParamss: function (_page, _rows) {

                let param = {
                    params: {
                        page:1,
                        row:100,
                        communityId:vc.getCurrentCommunity().communityId,
                    }
                };

                //发送get请求
                vc.http.apiGet('/reserve.listReserveParams',
                    param,
                    function (json, res) {
                        let _reserveParamsManageInfo = JSON.parse(json);
                        vc.component.addReserveServiceInfo.reserveParamss = _reserveParamsManageInfo.data;
                     
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _initGoodsContent: function() {
                let $summernote = $('.summernote').summernote({
                    lang: 'zh-CN',
                    height: 300,
                    placeholder: '必填，请输入商品描述',
                    callbacks: {
                        onImageUpload: function(files, editor, $editable) {
                            $that.sendFile($summernote, files);
                        },
                        onChange: function(contents, $editable) {
                            $that.addReserveServiceInfo.content = contents;
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
        }
    });

})(window.vc);
