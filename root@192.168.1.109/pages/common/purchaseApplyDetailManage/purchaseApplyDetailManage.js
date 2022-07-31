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
            vc.component._initDate();
            vc.component._queryStorehouses();
            vc.component._listPurchaseApplyDetails(DEFAULT_PAGE, DEFAULT_ROWS);
            vc.getDict('purchase_apply', "state", function(_data) {
                vc.component.purchaseApplyDetailManageInfo.states = _data;
            });
            vc.getDict('purchase_apply', "warehousing_way", function(_data) {
                vc.component.purchaseApplyDetailManageInfo.warehousingWays = _data;
            });
            vc.getDict('purchase_apply', "res_order_type", function(_data) {
                vc.component.purchaseApplyDetailManageInfo.resOrderTypes = _data;
            });
            $that._listResourceStoreTypes();
            $that._listResourceStoreSpecifications();
        },
        _initEvent: function() {
            $that._listResourceSupplier();
            vc.on('purchaseApplyDetailManage', 'listPurchaseApplyDetail', function(_param) {
                vc.component._listPurchaseApplyDetails(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function(_currentPage) {
                vc.component._listPurchaseApplyDetails(_currentPage, DEFAULT_ROWS);
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
                        vc.component.purchaseApplyDetailManageInfo.conditions.startTime = value;
                    });
                $('.endTime').datetimepicker()
                    .on('changeDate', function(ev) {
                        var value = $(".endTime").val();
                        vc.component.purchaseApplyDetailManageInfo.conditions.endTime = value;
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
                vc.component.purchaseApplyDetailManageInfo.conditions.page = _page;
                vc.component.purchaseApplyDetailManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.purchaseApplyDetailManageInfo.conditions
                };
                param.params.applyOrderId = param.params.applyOrderId.trim();
                param.params.userName = param.params.userName.trim();
                param.params.endUserName = param.params.endUserName.trim();
                param.params.resName = param.params.resName.trim();
                //发送get请求
                vc.http.get('purchaseApplyDetailManage',
                    'list',
                    param,
                    function(json, res) {
                        var _purchaseApplyDetailManageInfo = JSON.parse(json);
                        vc.component.purchaseApplyDetailManageInfo.total = _purchaseApplyDetailManageInfo.total;
                        vc.component.purchaseApplyDetailManageInfo.records = _purchaseApplyDetailManageInfo.records;
                        vc.component.purchaseApplyDetailManageInfo.purchaseApplyDetails = _purchaseApplyDetailManageInfo.purchaseApplyDetails;
                        vc.component.purchaseApplyDetailManageInfo.purchaseApplyDetails.forEach((item) => {
                            item.purchaseQuantity = item.purchaseQuantity ? item.purchaseQuantity : 0;
                            item.price = item.price ? item.price : 0;
                            item.totalApplyPrice = (item.purchaseQuantity * item.price).toFixed(2);
                        });
                        vc.emit('pagination', 'init', {
                            total: vc.component.purchaseApplyDetailManageInfo.records,
                            dataCount: vc.component.purchaseApplyDetailManageInfo.total,
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
                        vc.component.purchaseApplyDetailManageInfo.resourceSuppliers = _resourceSupplierManageInfo.data;
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
                vc.component._listPurchaseApplyDetails(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetInspectionPlanMethod: function() {
                vc.component.purchaseApplyDetailManageInfo.conditions.applyOrderId = "";
                vc.component.purchaseApplyDetailManageInfo.conditions.state = "";
                vc.component.purchaseApplyDetailManageInfo.conditions.userName = "";
                vc.component.purchaseApplyDetailManageInfo.conditions.endUserName = "";
                vc.component.purchaseApplyDetailManageInfo.conditions.resName = "";
                vc.component.purchaseApplyDetailManageInfo.conditions.warehousingWay = "";
                vc.component.purchaseApplyDetailManageInfo.conditions.resOrderType = "";
                vc.component.purchaseApplyDetailManageInfo.conditions.startTime = "";
                vc.component.purchaseApplyDetailManageInfo.conditions.endTime = "";
                vc.component.purchaseApplyDetailManageInfo.conditions.rsId = "";
                vc.component.purchaseApplyDetailManageInfo.conditions.parentRstId = "";
                vc.component.purchaseApplyDetailManageInfo.conditions.rstId = "";
                vc.component.purchaseApplyDetailManageInfo.conditions.rssId = "";
                vc.component.purchaseApplyDetailManageInfo.conditions.shId = "";
                vc.component.purchaseApplyDetailManageInfo.conditions.shName = "";
                vc.component.purchaseApplyDetailManageInfo.resourceStoreSonTypes = [];
                vc.component.purchaseApplyDetailManageInfo.resourceStoreSpecifications = [];
                vc.component._listPurchaseApplyDetails(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function() {
                if (vc.component.purchaseApplyDetailManageInfo.moreCondition) {
                    vc.component.purchaseApplyDetailManageInfo.moreCondition = false;
                } else {
                    vc.component.purchaseApplyDetailManageInfo.moreCondition = true;
                }
            },
            _listResourceStoreTypes: function() {
                var param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.get('resourceStoreTypeManage',
                    'list',
                    param,
                    function(json, res) {
                        var _resourceStoreTypeManageInfo = JSON.parse(json);
                        vc.component.purchaseApplyDetailManageInfo.resourceStoreTypes = _resourceStoreTypeManageInfo.data;
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _listResourceStoreSonTypes: function() {
                vc.component.purchaseApplyDetailManageInfo.conditions.rstId = '';
                vc.component.purchaseApplyDetailManageInfo.resourceStoreSonTypes = [];
                if (vc.component.purchaseApplyDetailManageInfo.conditions.parentRstId == '') {
                    return;
                }
                var param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId,
                        parentId: vc.component.purchaseApplyDetailManageInfo.conditions.parentRstId
                    }
                };
                //发送get请求
                vc.http.get('resourceStoreTypeManage',
                    'list',
                    param,
                    function(json, res) {
                        var _resourceStoreTypeManageInfo = JSON.parse(json);
                        vc.component.purchaseApplyDetailManageInfo.resourceStoreSonTypes = _resourceStoreTypeManageInfo.data;
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _listResourceStoreSpecifications: function() {
                vc.component.purchaseApplyDetailManageInfo.resourceStoreSpecifications = [];
                vc.component.purchaseApplyDetailManageInfo.conditions.rssId = '';
                var param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId,
                        rstId: vc.component.purchaseApplyDetailManageInfo.conditions.rstId
                    }
                };
                //发送get请求
                vc.http.apiGet('resourceStore.listResourceStoreSpecifications',
                    param,
                    function(json, res) {
                        var _purchaseApplyDetailManageInfo = JSON.parse(json);
                        vc.component.purchaseApplyDetailManageInfo.resourceStoreSpecifications = _purchaseApplyDetailManageInfo.data;
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
                vc.component._listPurchaseApplyDetails(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _exportExcel: function() {
                vc.jumpToPage('/callComponent/exportReportFee/exportData?pagePath=purchaseApplyDetail&' + vc.objToGetParam($that.purchaseApplyDetailManageInfo.conditions));
            }
        }
    });
})(window.vc);