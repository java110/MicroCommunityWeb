/**
 采购组件
 **/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            purchaseApplyDetailManageInfo: {
                purchaseApplyDetails: [],
                total: 0,
                records: 1,
                moreCondition: false,
                states: [],
                warehousingWays: [],
                resOrderTypes: [],
                resourceSuppliers: [],
                storehouses: [],
                conditions: {
                    applyOrderId: '',
                    state: '',
                    userName: '',
                    resOrderType: '',
                    endUserName: '',
                    resName: '',
                    rsId: '',
                    rssId: '',
                    parentRstId: '',
                    rstId: '',
                    warehousingWay: '',
                    startTime: '',
                    endTime: '',
                    shId: '',
                    shName: '',
                    communityId: vc.getCurrentCommunity().communityId
                },
                resourceStoreTypes: [],
                resourceStoreSonTypes: [],
                resourceStoreSpecifications: []
            }
        },
        _initMethod: function() {
            $that._initDate();
            $that._queryStorehouses();
            $that._listPurchaseApplyDetails(DEFAULT_PAGE, DEFAULT_ROWS);
            vc.getDict('purchase_apply', "state", function(_data) {
                $that.purchaseApplyDetailManageInfo.states = _data;
            });
            vc.getDict('purchase_apply', "warehousing_way", function(_data) {
                $that.purchaseApplyDetailManageInfo.warehousingWays = _data;
            });
            vc.getDict('purchase_apply', "res_order_type", function(_data) {
                $that.purchaseApplyDetailManageInfo.resOrderTypes = [{
                    statusCd: '',
                    name: '全部'
                }];
                _data.forEach(item => {
                    $that.purchaseApplyDetailManageInfo.resOrderTypes.push(item);
                });
            });
            $that._listResourceStoreTypes();
            $that._listResourceStoreSpecifications();
            $that._listResourceSupplier();
        },
        _initEvent: function() {

            vc.on('purchaseApplyDetailManage', 'listPurchaseApplyDetail', function(_param) {
                $that._listPurchaseApplyDetails(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function(_currentPage) {
                $that._listPurchaseApplyDetails(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _initDate: function() {
                $(".startTime").datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd hh:ii:ss',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $(".endTime").datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd hh:ii:ss',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.startTime').datetimepicker()
                    .on('changeDate', function(ev) {
                        var value = $(".startTime").val();
                        $that.purchaseApplyDetailManageInfo.conditions.startTime = value;
                    });
                $('.endTime').datetimepicker()
                    .on('changeDate', function(ev) {
                        var value = $(".endTime").val();
                        $that.purchaseApplyDetailManageInfo.conditions.endTime = value;
                        let start = Date.parse(new Date($that.purchaseApplyDetailManageInfo.conditions.startTime))
                        let end = Date.parse(new Date($that.purchaseApplyDetailManageInfo.conditions.endTime))
                        if (start - end >= 0) {
                            vc.toast("结束时间必须大于开始时间")
                            $that.purchaseApplyDetailManageInfo.conditions.endTime = '';
                        }
                    });
                //防止多次点击时间插件失去焦点
                document.getElementsByClassName(' form-control startTime')[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }

                document.getElementsByClassName(" form-control endTime")[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }
            },
            //查询
            _listPurchaseApplyDetails: function(_page, _rows) {
                $that.purchaseApplyDetailManageInfo.conditions.page = _page;
                $that.purchaseApplyDetailManageInfo.conditions.row = _rows;
                let param = {
                    params: $that.purchaseApplyDetailManageInfo.conditions
                };
                param.params.applyOrderId = param.params.applyOrderId.trim();
                param.params.userName = param.params.userName.trim();
                param.params.endUserName = param.params.endUserName.trim();
                param.params.resName = param.params.resName.trim();
                //发送get请求
                vc.http.apiGet('/purchaseApplyDetail.listPurchaseApplyDetails',
                    param,
                    function(json, res) {
                        let _json = JSON.parse(json);
                        $that.purchaseApplyDetailManageInfo.total = _json.total;
                        $that.purchaseApplyDetailManageInfo.records = _json.records;
                        $that.purchaseApplyDetailManageInfo.purchaseApplyDetails = _json.purchaseApplyDetails;
                        $that.purchaseApplyDetailManageInfo.purchaseApplyDetails.forEach((item) => {
                            item.purchaseQuantity = item.purchaseQuantity ? item.purchaseQuantity : 0;
                            item.price = item.price ? item.price : 0;
                            item.totalApplyPrice = (item.purchaseQuantity * item.price).toFixed(2);
                        });
                        vc.emit('pagination', 'init', {
                            total: $that.purchaseApplyDetailManageInfo.records,
                            dataCount: $that.purchaseApplyDetailManageInfo.total,
                            currentPage: _page
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            //查询供应商
            _listResourceSupplier: function() {
                var param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('resourceSupplier.listResourceSuppliers',
                    param,
                    function(json, res) {
                        var _resourceSupplierManageInfo = JSON.parse(json);
                        $that.purchaseApplyDetailManageInfo.resourceSuppliers = _resourceSupplierManageInfo.data;
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openDetailPurchaseApplyDetailModel: function(_purchaseApplyDetail) {
                vc.jumpToPage("/#/pages/common/purchaseApplyDetail?applyOrderId=" + _purchaseApplyDetail.applyOrderId + "&resOrderType=10000");
            },
            //查询
            _queryPurchaseApplyDetailMethod: function() {
                $that._listPurchaseApplyDetails(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetInspectionPlanMethod: function() {
                $that.purchaseApplyDetailManageInfo.conditions.applyOrderId = "";
                $that.purchaseApplyDetailManageInfo.conditions.state = "";
                $that.purchaseApplyDetailManageInfo.conditions.userName = "";
                $that.purchaseApplyDetailManageInfo.conditions.endUserName = "";
                $that.purchaseApplyDetailManageInfo.conditions.resName = "";
                $that.purchaseApplyDetailManageInfo.conditions.warehousingWay = "";
                $that.purchaseApplyDetailManageInfo.conditions.resOrderType = "";
                $that.purchaseApplyDetailManageInfo.conditions.startTime = "";
                $that.purchaseApplyDetailManageInfo.conditions.endTime = "";
                $that.purchaseApplyDetailManageInfo.conditions.rsId = "";
                $that.purchaseApplyDetailManageInfo.conditions.parentRstId = "";
                $that.purchaseApplyDetailManageInfo.conditions.rstId = "";
                $that.purchaseApplyDetailManageInfo.conditions.rssId = "";
                $that.purchaseApplyDetailManageInfo.conditions.shId = "";
                $that.purchaseApplyDetailManageInfo.conditions.shName = "";
                $that.purchaseApplyDetailManageInfo.resourceStoreSonTypes = [];
                $that.purchaseApplyDetailManageInfo.resourceStoreSpecifications = [];
                $that._listPurchaseApplyDetails(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function() {
                if ($that.purchaseApplyDetailManageInfo.moreCondition) {
                    $that.purchaseApplyDetailManageInfo.moreCondition = false;
                } else {
                    $that.purchaseApplyDetailManageInfo.moreCondition = true;
                }
            },
            _listResourceStoreTypes: function() {
                var param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId,
                        parentId: '0'
                    }
                };
                //发送get请求
                vc.http.apiGet('/resourceStoreType.listResourceStoreTypes',
                    param,
                    function(json, res) {
                        var _resourceStoreTypeManageInfo = JSON.parse(json);
                        $that.purchaseApplyDetailManageInfo.resourceStoreTypes = _resourceStoreTypeManageInfo.data;
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _listResourceStoreSonTypes: function() {
                $that.purchaseApplyDetailManageInfo.conditions.rstId = '';
                $that.purchaseApplyDetailManageInfo.resourceStoreSonTypes = [];
                if ($that.purchaseApplyDetailManageInfo.conditions.parentRstId == '') {
                    return;
                }
                let param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId,
                        parentId: $that.purchaseApplyDetailManageInfo.conditions.parentRstId
                    }
                };
                //发送get请求
                vc.http.apiGet('/resourceStoreType.listResourceStoreTypes',
                    param,
                    function(json, res) {
                        var _resourceStoreTypeManageInfo = JSON.parse(json);
                        $that.purchaseApplyDetailManageInfo.resourceStoreSonTypes = _resourceStoreTypeManageInfo.data;
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _listResourceStoreSpecifications: function() {
                $that.purchaseApplyDetailManageInfo.resourceStoreSpecifications = [];
                $that.purchaseApplyDetailManageInfo.conditions.rssId = '';
                var param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId,
                        rstId: $that.purchaseApplyDetailManageInfo.conditions.rstId
                    }
                };
                //发送get请求
                vc.http.apiGet('/resourceStore.listResourceStoreSpecifications',
                    param,
                    function(json, res) {
                        var _purchaseApplyDetailManageInfo = JSON.parse(json);
                        $that.purchaseApplyDetailManageInfo.resourceStoreSpecifications = _purchaseApplyDetailManageInfo.data;
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            //查询仓库
            _queryStorehouses: function() {
                var param = {
                    params: {
                        page: 1,
                        row: 50,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('resourceStore.listStorehouses',
                    param,
                    function(json, res) {
                        var _storehouseManageInfo = JSON.parse(json);
                        $that.purchaseApplyDetailManageInfo.storehouses = _storehouseManageInfo.data;
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _queryInspectionPlanMethod: function() {
                $that._listPurchaseApplyDetails(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _viewPurchaseApplyDetail: function(item) {
                vc.emit('viewData', 'openViewDataModal', {
                    data: {
                        "备注": item.purchaseRemark
                    }
                })
            },
            _exportExcel: function() {
                vc.jumpToPage('/callComponent/exportReportFee/exportData?pagePath=purchaseApplyDetail&' + vc.objToGetParam($that.purchaseApplyDetailManageInfo.conditions));
            },
            swatchResOrderTypes: function(_item) {
                $that.purchaseApplyDetailManageInfo.conditions.resOrderType = _item.statusCd;
                $that._listPurchaseApplyDetails(DEFAULT_PAGE, DEFAULT_ROWS);
            },
        }
    });
})(window.vc);