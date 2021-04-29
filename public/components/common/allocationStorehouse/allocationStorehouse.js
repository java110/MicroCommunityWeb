(function (vc) {
    vc.extends({
        data: {
            allocationStorehouseInfo: {
                resId: '',
                resName: '',
                resCode: '',
                remark: '',
                stock: 0,
                curStock: 0,
                shIdz: '',
                shIda: '',
                shName: '',
                storehouses: []
            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('allocationStorehouse', 'openAllocationStorehouseModal', function (_param) {
                $that._listAllocationStorehouse();
                $('#allocationStorehouseModel').modal('show');
            });
        },
        methods: {
            allocationStorehouseValidate() {
                return vc.validate.validate({
                    allocationStorehouseInfo: vc.component.allocationStorehouseInfo
                }, {
                    'allocationStorehouseInfo.resId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "物品名称不能为空"
                        }
                    ],
                    'allocationStorehouseInfo.remark': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "备注不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "512",
                            errInfo: "备注太长"
                        }
                    ],
                    'allocationStorehouseInfo.stock': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "调拨数量不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "调拨数量必须为正整数"
                        },
                    ],
                    'allocationStorehouseInfo.shIdz': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "目标仓库不能为空"
                        }
                    ]
                });
            },
            _allocationStorehouse: function () {
                if (!$that.allocationStorehouseValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                $that.allocationStorehouseInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    'resourceStore.saveAllocationStorehouse',
                    JSON.stringify(vc.component.allocationStorehouseInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
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
                    resId: '',
                    resName: '',
                    resCode: '',
                    remark: '',
                    stock: 0,
                    curStock: 0,
                    shIdz: '',
                    shIda: '',
                    shName: '',
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
