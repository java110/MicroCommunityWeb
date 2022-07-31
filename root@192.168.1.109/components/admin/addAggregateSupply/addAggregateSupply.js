(function (vc, vm) {
    vc.extends({
        data: {
            addAggregateSupplyInfo: {
                shops: [],
                shopId:'',
                supplyProductId: '',
                id: '',
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            $that._listShops();
            vc.on('addAggregateSupply', 'openAddAggregateSupplyModal', function (_params) {
                $('#addAggregateSupplyModel').modal('show');
                vc.copyObject(_params, vc.component.addAggregateSupplyInfo);
                vc.component.addAggregateSupplyInfo.supplyProductId = vc.component.addAggregateSupplyInfo.id;
            });
        },
        methods: {
            addAggregateSupplyValidate: function () {
                return vc.validate.validate({
                    addAggregateSupplyInfo: vc.component.addAggregateSupplyInfo
                }, {

                    'addAggregateSupplyInfo.shopId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "店铺不能为空"
                        }
                    ]
                });
            },
            addAggregateSupply: function () {
                if (!vc.component.addAggregateSupplyValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.http.apiPost(
                    '/product/saveAggregateSupplyProduct',
                    JSON.stringify(vc.component.addAggregateSupplyInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addAggregateSupplyModel').modal('hide');
                            vc.emit('mainCategoryProductManage', 'listMainCategoryProduct', {});
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
                    params:  {
                        page:1,
                        row:100,
                        state: '002',
                    }}
                //发送get请求
                vc.http.apiGet('/shop/queryShopsByAdmin',
                    param,
                    function (json, res) {
                        var _shopManageInfo = JSON.parse(json);
                        vc.component.addAggregateSupplyInfo.shops = _shopManageInfo.data;
                        console.log("查询成功了啊怕",vc.component.addAggregateSupplyInfo.shops);
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            refreshAddAggregateSupplyInfo: function () {
                vc.component.addAggregateSupplyInfo = {
                    mcProductId: '',
                    mainCategoryId: '',
                    productId: '',
                    startTime: '',
                    endTime: '',
                    seq: ''
                }
            }
        }
    });
})(window.vc, window.vc.component);
