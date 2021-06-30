(function (vc, vm) {

    vc.extends({
        data: {
            editHousekeepingServInfo: {
                servId: '',
                servName: '',
                servDesc: '',
                hktId: '',
                sales: '',
                sort: '',
                state: '',
                repairWay: '',
                returnVisitFlag: '',
                keyword: '',
                coverPhoto: '',
                context:'',
                carouselFigurePhoto: [],
                housekeepingTypes: []

            }
        },
        _initMethod: function () {
            $that._initEditHousekeepingServ();
            $that._listEditHousekeepingTypes();
        },
        _initEvent: function () {
            vc.on('editHousekeepingServ', 'openEditHousekeepingServModal', function (_params) {
                vc.component.refreshEditHousekeepingServInfo();
                $('#editHousekeepingServModel').modal('show');
                _params.context = filterXSS(_params.context);
                vc.copyObject(_params, vc.component.editHousekeepingServInfo);
                //处理封面喝轮播图修改不显示问题
                let _photos = [];
                _photos.push(vc.component.editHousekeepingServInfo.coverPhoto);
                vc.emit('editHousekeepingServCover','uploadImage', 'notifyPhotos',_photos);
                //轮播图
                vc.emit('editHousekeepingServCarouselFigure','uploadImage', 'notifyPhotos',vc.component.editHousekeepingServInfo.carouselFigurePhoto);
                $(".editServSummernote").summernote('code', vc.component.editHousekeepingServInfo.context);
            });
            vc.on("editHousekeepingServ", "notifyUploadCoverImage", function (_param) {
                if (_param.length > 0) {
                    vc.component.editHousekeepingServInfo.coverPhoto = _param[0];
                } else {
                    vc.component.editHousekeepingServInfo.coverPhoto = '';
                }
            });
            vc.on("editHousekeepingServ", "notifyUploadCarouselFigureImage", function (_param) {
                vc.component.editHousekeepingServInfo.carouselFigurePhoto = _param;
            });
        },
        methods: {
            editHousekeepingServValidate: function () {
                return vc.validate.validate({
                    editHousekeepingServInfo: vc.component.editHousekeepingServInfo
                }, {
                    'editHousekeepingServInfo.servId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "服务ID不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "30",
                            errInfo: "服务ID太长"
                        },
                    ],
                    'editHousekeepingServInfo.servName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "服务名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "30",
                            errInfo: "服务名称太长"
                        },
                    ],
                    'editHousekeepingServInfo.servDesc': [
                        {
                            limit: "maxLength",
                            param: "256",
                            errInfo: "物品名称太长"
                        },
                    ],
                    'editHousekeepingServInfo.hktId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "家政类型不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "30",
                            errInfo: "必填，家政类型太长"
                        },
                    ],
                    'editHousekeepingServInfo.keyword': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "关键字不能为空"
                        }
                    ],
                    'editHousekeepingServInfo.sales': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "销量不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "销量不是有效数字"
                        },
                    ],
                    'editHousekeepingServInfo.repairWay': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "派单方式不能为空"
                        }
                    ],
                    'editHousekeepingServInfo.returnVisitFlag': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "回访方式不能为空"
                        }
                    ],
                    'editHousekeepingServInfo.sort': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "排序不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "排序不是有效数字"
                        },
                    ],
                    'editHousekeepingServInfo.state': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "上架状态不能为空"
                        }],
                        'editHousekeepingServInfo.servId': [
                            {
                                limit: "required",
                                param: "",
                                errInfo: "服务ID不能为空"
                            }]

                        });
            },
            editHousekeepingServ: function () {
                if (!vc.component.editHousekeepingServValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                $that.editHousekeepingServInfo.shopId=vc.getCurrentCommunity().shopId;
                vc.http.apiPost(
                    '/housekeepingServ/updateHousekeepingServ',
                    JSON.stringify(vc.component.editHousekeepingServInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editHousekeepingServModel').modal('hide');
                            vc.emit('housekeepingServManage', 'listHousekeepingServ', {});
                            return;
                        }
                        vc.message(_json.msg);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);
                    });
            },
            _listEditHousekeepingTypes: function (_page, _rows) {
                let param = {
                    params: {
                        page: 1,
                        row: 50,
                        typeCd:1001,
                        shopId:vc.getCurrentCommunity().shopId
                    }
                };

                //发送get请求
                vc.http.apiGet('/housekeepingType/queryHousekeepingType',
                    param,
                    function (json, res) {
                        var _housekeepingTypeManageInfo = JSON.parse(json);
                        vc.component.editHousekeepingServInfo.housekeepingTypes = _housekeepingTypeManageInfo.data;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _initEditHousekeepingServ: function () {
                let $summernote = $('.editServSummernote').summernote({
                    lang: 'zh-CN',
                    height: 300,
                    placeholder: '必填，请输入服务描述',
                    callbacks: {
                        onImageUpload: function (files, editor, $editable) {
                            $that.sendEditFile($summernote, files);
                        },
                        onChange: function (contexts, $editable) {
                            $that.editHousekeepingServInfo.context = contexts;
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
            sendEditFile: function ($summernote, files) {
                console.log('上传图片', files);

                var param = new FormData();
                param.append("uploadFile", files[0]);

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
                            $summernote.summernote('insertImage', "/callComponent/download/getFile/file?fileId=" + data.fileId);
                            return;
                        }
                        vc.toast(json);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });

            },
            _refreshEditHousekeepingServInfo:function(){
                 $that.refreshEditHousekeepingServInfo();
                 vc.emit('housekeepingServManage', 'listHousekeepingServ', {});
            },
            refreshEditHousekeepingServInfo: function () {
                let _houseKeepingTypes = $that.editHousekeepingServInfo.housekeepingTypes;
                vc.component.editHousekeepingServInfo = {
                    servId: '',
                    servName: '',
                    servDesc: '',
                    hktId: '',
                    sales: '',
                    sort: '',
                    state: '',
                    repairWay: '',
                    returnVisitFlag: '',
                    keyword: '',
                    coverPhoto: '',
                    context:'',
                    carouselFigurePhoto: [],
                    housekeepingTypes: _houseKeepingTypes

                }
            }
        }
    });

})(window.vc, window.vc.component);
