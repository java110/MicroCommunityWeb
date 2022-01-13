(function (vc, vm) {

    vc.extends({
        data: {
            editHousekeepingTypeInfo: {
                hktId: '',
                hktName: '',
                hktIcon: '',
                hktDesc: '',
                label: '',
                seq: '',
                url: '',
                skipType: '',
                isShow: '',
                typeCd: '',
                shopId: '',
                storeId: '',
                productId: ''
            },
            editHousekeepingType:{
                shops:[],
                products:[]
            }
        },
        _initMethod: function () {
            vc.component._listEditShops();
        },
        _initEvent: function () {
            vc.on('editHousekeepingType', 'openEditHousekeepingTypeModal', function (_params) {
                vc.component.refreshEditHousekeepingTypeInfo();
                $('#editHousekeepingTypeModel').modal('show');
                vc.copyObject(_params, vc.component.editHousekeepingTypeInfo);
                let _photos = [];
                _photos.push(_params.hktIcon);
                if( $that.editHousekeepingTypeInfo.skipType == 'P' ||$that.editHousekeepingTypeInfo.skipType == 'S'){
                    vc.component.editHousekeepingType.shops.forEach((item, index) => {
                        if ( vc.component.editHousekeepingTypeInfo.url.indexOf(item.shopId) != -1 ) {
                            vc.component.editHousekeepingTypeInfo.shopId = item.shopId;
                            vc.component.editHousekeepingTypeInfo.storeId = item.storeId;
                        }
                    });
                }
                if( $that.editHousekeepingTypeInfo.skipType == 'P'){
                    vc.component._listEditProducts();
                    vc.component.editHousekeepingTypeInfo.productId = vc.component.editHousekeepingTypeInfo.url.slice(29, 47);
                }
                vc.emit('editHousekeepingType', 'uploadImage', 'notifyPhotos', _photos);
            });
            vc.on("editHousekeepingType", "notifyUploadCoverImage", function (_param) {
                if (_param.length > 0) {
                    console.log(_param);
                    vc.component.editHousekeepingTypeInfo.hktIcon = _param[0];
                } else {
                    vc.component.editHousekeepingTypeInfo.hktIcon = '';
                }
            });
        },
        methods: {
            editHousekeepingTypeValidate: function () {
                return vc.validate.validate({
                    editHousekeepingTypeInfo: vc.component.editHousekeepingTypeInfo
                }, {
                    'editHousekeepingTypeInfo.hktName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "类别名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "30",
                            errInfo: "类别名称名称太长"
                        },
                    ],
                    'editHousekeepingTypeInfo.hktIcon': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "小图标不能为空"
                        }
                    ],
                    'editHousekeepingTypeInfo.hktDesc': [
                        {
                            limit: "maxLength",
                            param: "50",
                            errInfo: "服务描述太长"
                        },
                    ],
                    'editHousekeepingTypeInfo.label': [
                        {
                            limit: "maxLength",
                            param: "15",
                            errInfo: "标签描述太长"
                        },
                    ],
                    'editHousekeepingTypeInfo.seq': [
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
                    'editHousekeepingTypeInfo.isShow': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "是否显示不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "2",
                            errInfo: "是否显示格式错误"
                        },
                    ],
                    'editHousekeepingTypeInfo.hktId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "服务ID不能为空"
                        }],

                    'editHousekeepingTypeInfo.typeCd': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "请选择类型"
                        }
                    ]

                });
            },
            saveEditHousekeepingType: function () {
                if (!vc.component.editHousekeepingTypeValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                if($that.editHousekeepingTypeInfo.skipType == 'S'){
                    if($that.editHousekeepingTypeInfo.shopId == ""){
                        vc.toast("请选择店铺");
                        return;
                    }
                    $that.editHousekeepingTypeInfo.url = '/pages/cate/cate?shopId='+$that.editHousekeepingTypeInfo.shopId;
                }
                if( $that.editHousekeepingTypeInfo.skipType == 'P'){
                    if($that.editHousekeepingTypeInfo.shopId == ""){
                        vc.toast("请选择店铺");
                        return;
                    }
                    if($that.editHousekeepingTypeInfo.productId == ""){
                        vc.toast("请选择商品");
                        return;
                    }
                    $that.editHousekeepingTypeInfo.url = '/pages/goods/goods?productId=' + $that.editHousekeepingTypeInfo.productId + '&shopId='+$that.editHousekeepingTypeInfo.shopId;
                }

                $that.editHousekeepingTypeInfo.shopId = '9999';
                vc.http.apiPost(
                    '/housekeepingType/updateHousekeepingType',
                    JSON.stringify(vc.component.editHousekeepingTypeInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editHousekeepingTypeModel').modal('hide');
                            vc.emit('housekeepingTypeManage', 'listHousekeepingType', {});
                            return;
                        }
                        vc.message(_json.msg);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);
                    });
            },
            _listEditShops: function () {
                var param = {
                    params : {
                        page : 1,
                        row : 100
                    }
                };
                //发送get请求
                vc.http.apiGet('/shop/queryShopsByAdmin',
                    param,
                    function (json, res) {
                        var _shopManageInfo = JSON.parse(json);
                        vc.component.editHousekeepingType.shops = _shopManageInfo.data;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _listEditProducts: function () {
                var param = {
                    params : {
                        page : 1,
                        row : 100,
                        shopId:vc.component.editHousekeepingTypeInfo.shopId,
                        storeId:vc.component.editHousekeepingTypeInfo.storeId
                    }
                };
                //发送get请求
                vc.http.apiGet('/product/queryProduct',
                    param,
                    function (json, res) {
                        var _productManageInfo = JSON.parse(json);
                        vc.component.editHousekeepingType.products = _productManageInfo.data;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
             // 分类改变事件
             selEditProducts: function () {
                if (vc.component.editHousekeepingTypeInfo.shopId == '') {
                    vc.component.editHousekeepingType.products = [];
                    return;
                }
                if(vc.component.editHousekeepingTypeInfo.skipType =="P"){
                    vc.component.editHousekeepingType.shops.forEach((item, index) => {
                        if (item.shopId == vc.component.editHousekeepingTypeInfo.shopId ) {
                            vc.component.editHousekeepingTypeInfo.storeId = item.storeId;
                        }
                    });
                    vc.component._listEditProducts();
                }
            },
            refreshEditHousekeepingTypeInfo: function () {
                vc.component.editHousekeepingTypeInfo = {
                    hktId: '',
                    hktName: '',
                    hktIcon: '',
                    hktDesc: '',
                    label: '',
                    seq: '',
                    url: '',
                    skipType: '',
                    isShow: '',
                    typeCd: ''
                }
            }
        }
    });

})(window.vc, window.vc.component);
