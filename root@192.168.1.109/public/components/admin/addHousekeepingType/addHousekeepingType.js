(function (vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addHousekeepingTypeInfo: {
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
            addHousekeepingType:{
                shops:[],
                products:[]
            }
        },
        _initMethod: function () {
            vc.component._listShops();
        },
        _initEvent: function () {
            vc.on('addHousekeepingType', 'openAddHousekeepingTypeModal', function () {
                $('#addHousekeepingTypeModel').modal('show');
            });
            vc.on("addHousekeepingType", "notifyUploadCoverImage", function (_param) {
                if (_param.length > 0) {
                    vc.component.addHousekeepingTypeInfo.hktIcon = _param[0];
                } else {
                    vc.component.addHousekeepingTypeInfo.hktIcon = '';
                }
            });
        },
        methods: {
            addHousekeepingTypeValidate() {
                return vc.validate.validate({
                    addHousekeepingTypeInfo: vc.component.addHousekeepingTypeInfo
                }, {
                    'addHousekeepingTypeInfo.hktName': [
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
                    'addHousekeepingTypeInfo.hktIcon': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "小图标不能为空"
                        }
                    ],
                    'addHousekeepingTypeInfo.hktDesc': [
                        {
                            limit: "maxLength",
                            param: "50",
                            errInfo: "服务描述太长"
                        },
                    ],
                    'addHousekeepingTypeInfo.label': [
                        {
                            limit: "maxLength",
                            param: "15",
                            errInfo: "标签描述太长"
                        },
                    ],
                    'addHousekeepingTypeInfo.seq': [
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
                    'addHousekeepingTypeInfo.isShow': [
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
                    'addHousekeepingTypeInfo.typeCd': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "请选择类型"
                        }
                    ]
                });
            },
            saveHousekeepingTypeInfo: function () {
                if (!vc.component.addHousekeepingTypeValidate()) {
                    vc.toast(vc.validate.errInfo);

                    return;
                }
                if($that.addHousekeepingTypeInfo.skipType == 'S'){
                    if($that.addHousekeepingTypeInfo.shopId == ""){
                        vc.toast("请选择店铺");
                        return;
                    }
                    $that.addHousekeepingTypeInfo.url = '/pages/cate/cate?shopId='+$that.addHousekeepingTypeInfo.shopId;
                }
                if( $that.addHousekeepingTypeInfo.skipType == 'P'){
                    if($that.addHousekeepingTypeInfo.shopId == ""){
                        vc.toast("请选择店铺");
                        return;
                    }
                    if($that.addHousekeepingTypeInfo.productId == ""){
                        vc.toast("请选择商品");
                        return;
                    }
                    $that.addHousekeepingTypeInfo.url = '/pages/goods/goods?productId=' + $that.addHousekeepingTypeInfo.productId + '&shopId='+$that.addHousekeepingTypeInfo.shopId;
                }
                $that.addHousekeepingTypeInfo.shopId = '9999';
                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.addHousekeepingTypeInfo);
                    $('#addHousekeepingTypeModel').modal('hide');
                    return;
                }
                vc.http.apiPost(
                    '/housekeepingType/saveHousekeepingType',
                    JSON.stringify(vc.component.addHousekeepingTypeInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addHousekeepingTypeModel').modal('hide');
                            vc.component.clearAddHousekeepingTypeInfo();
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
            _listShops: function () {
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
                        vc.component.addHousekeepingType.shops = _shopManageInfo.data;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _listProducts: function () {
                var param = {
                    params : {
                        page : 1,
                        row : 100,
                        shopId:vc.component.addHousekeepingTypeInfo.shopId,
                        storeId:vc.component.addHousekeepingTypeInfo.storeId
                    }
                };
                //发送get请求
                vc.http.apiGet('/product/queryProduct',
                    param,
                    function (json, res) {
                        var _productManageInfo = JSON.parse(json);
                        vc.component.addHousekeepingType.products = _productManageInfo.data;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            // 分类改变事件
            selProducts: function () {
                if (vc.component.addHousekeepingTypeInfo.shopId == '') {
                    vc.component.addHousekeepingType.products = [];
                    return;
                }
                if(vc.component.addHousekeepingTypeInfo.skipType =="P"){
                    vc.component.addHousekeepingType.shops.forEach((item, index) => {
                        if (item.shopId == vc.component.addHousekeepingTypeInfo.shopId ) {
                            vc.component.addHousekeepingTypeInfo.storeId = item.storeId;
                        }
                    });
                    vc.component._listProducts();
                }
            },
            clearAddHousekeepingTypeInfo: function () {
                vc.component.addHousekeepingTypeInfo = {
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
                    productId: '',
                    storeId: ''
                };
                vc.component.addHousekeepingType.shops=[];
                vc.component.addHousekeepingType.products=[];
            }
        }
    });

})(window.vc);
