(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 100;
    vc.extends({
        data: {
            printAllocationStorehouseInfo: {
                resourceStores: [],
                conditions: {}
            },
            printFlag: '0'
        },
        _initMethod: function () {
            vc.component._initPrintAllocationStorehouseInfo();
            vc.component._listPrintAllocationStorehouse(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {
            vc.on('printAllocationStorehouse', 'openPrintAllocationStorehouseModal', function (_allocationStorehouseDetailInfo) {
                $that.printAllocationStorehouseInfo = _allocationStorehouseDetailInfo;
                $('#printAllocationStorehouseModel').modal('show');
            });
        },
        methods: {
            _initPrintAllocationStorehouseInfo: function () {
                let applyId = vc.getParam('applyId');
                var param = {
                    params: {
                        page: 1,
                        row: 1,
                        applyId: applyId
                    }
                };
                //发送get请求
                vc.http.apiGet('/resourceStore.listAllocationStorehouseApplys',
                    param,
                    function (json, res) {
                        var _allocationStorehouseDetailInfo = JSON.parse(json);
                        console.log("66666")
                        console.log(_allocationStorehouseDetailInfo)
                        var _allocationStorehouse = _allocationStorehouseDetailInfo.data[0];
                        vc.component.printAllocationStorehouseInfo.conditions = _allocationStorehouse;
                        // vc.copyObject(_allocationStorehouse, $that.printAllocationStorehouseInfo);
                        // vc.component.printAllocationStorehouseInfo = _allocationStorehouse[0];
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _listPrintAllocationStorehouse: function (_page, _rows) {
                let applyId = vc.getParam('applyId');
                let param = {
                    params: {
                        page: _page,
                        row: _rows,
                        applyId: applyId
                    }
                };
                //发送get请求
                vc.http.apiGet('/resourceStore.listAllocationStorehouses',
                    param,
                    function (json, res) {
                        let _allocationStorehouseDetailInfo = JSON.parse(json);
                        let _purchaseApply = _allocationStorehouseDetailInfo.data;
                        vc.component.printAllocationStorehouseInfo.resourceStores = _purchaseApply;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _printAllocationStorehouseDiv: function () {
                $that.printFlag = '1';
                console.log('console.log($that.printFlag);', $that.printFlag);
                document.getElementById("print-btn").style.display = "none";//隐藏
                window.print();
                //$that.printFlag = false;
                window.opener = null;
                window.close();
            },
            _closePage: function () {
                window.opener = null;
                window.close();
            }
        }
    });
})(window.vc);
