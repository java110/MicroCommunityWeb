(function (vc) {
    vc.extends({
        data: {
            allocationStorehouseInfo: {
                resId: '',
                resName: '',
                resCode: '',
                remark: '',
                stock:0,
                curStock:0,
                shId: '',
                curShId:'',
                shName:'',
                storehouses: []
            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('allocationStorehouse', 'openAllocationStorehouseModal', function (_param) {
                $that._listAllocationStorehouse();
                let _that = $that.allocationStorehouseInfo;
                _that.resId = _param.resId;
                _that.resName = _param.resName;
                _that.curStock = _param.stock;
                _that.shName = _param.shName;
                _that.curShId = _param.shId;
                $('#allocationStorehouseModel').modal('show');
            });
        },
        methods: {
            allocationStorehouseValidate() {
                return vc.validate.validate({
                    allocationStorehouseInfo: vc.component.allocationStorehouseInfo
                }, {
                    'allocationStorehouseInfo.resName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "物品名称不能为空"
                        },
                        {
                            limit: "maxin",
                            param: "2,100",
                            errInfo: "物品名称长度为2至100"
                        },
                    ],
                    'allocationStorehouseInfo.resCode': [
                        {
                            limit: "maxLength",
                            param: "50",
                            errInfo: "物品编码不能超过50位"
                        },
                    ],
                    'allocationStorehouseInfo.price': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "物品价格不能为空"
                        },
                        {
                            limit: "money",
                            param: "",
                            errInfo: "物品价格格式错误"
                        },
                    ],
                    'allocationStorehouseInfo.description': [
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "描述不能为空"
                        },
                    ],
                    'allocationStorehouseInfo.showMobile': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "手机端显示不能为空"
                        },
                    ],
                    'allocationStorehouseInfo.outLowPrice': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "最低收费标准不能为空"
                        },
                        {
                            limit: "money",
                            param: "",
                            errInfo: "收费标准格式错误"
                        },
                    ],
                    'allocationStorehouseInfo.outHighPrice': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "最高收费标准不能为空"
                        },
                        {
                            limit: "money",
                            param: "",
                            errInfo: "收费标准格式错误"
                        },
                    ],
                    'allocationStorehouseInfo.unitCode': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "单位不能为空"
                        },
                    ],
                    'allocationStorehouseInfo.goodsType': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "物品类型不能为空"
                        },
                    ],
                    'allocationStorehouseInfo.shId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "仓库不能为空"
                        },
                    ],
                });
            },
            saveResourceStoreInfo: function () {
                if (!vc.component.allocationStorehouseValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.component.allocationStorehouseInfo.communityId = vc.getCurrentCommunity().communityId;

                vc.http.post(
                    'allocationStorehouse',
                    'save',
                    JSON.stringify(vc.component.allocationStorehouseInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        if (res.status == 200) {
                            //关闭model
                            $('#allocationStorehouseModel').modal('hide');
                            vc.component.clearAllocationStorehouseInfo();
                            vc.emit('resourceStoreManage', 'listResourceStore', {});
                            return;
                        }
                        vc.toast(json);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            clearAllocationStorehouseInfo: function () {
                vc.component.allocationStorehouseInfo = {
                    resName: '',
                    resCode: '',
                    price: '',
                    description: '',
                    outLowPrice: '',
                    outHighPrice: '',
                    showMobile: '',
                    remark: '',
                    goodsType: '',
                    goodsTypes: [],
                    unitCode: '',
                    shId: '',
                    unitCodes: [],
                    storehouses: []
                };
            },
            _listAllocationStorehouse: function (_page, _rows) {

                var param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };

                //发送get请求
                vc.http.apiGet('resourceStore.listStorehouses',
                    param,
                    function (json, res) {
                        let _storehouseManageInfo = JSON.parse(json);
                        vc.component.allocationStorehouseInfo.storehouses = _storehouseManageInfo.data;

                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
        }
    });
})(window.vc);
