/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            myRepairDispatchInfo: {
                ownerRepairs: [],
                total: 0,
                records: 1,
                moreCondition: false,
                repairName: '',
                currentRepairId: '',
                repairTypes: [],
                states: [],
                conditions: {
                    pageFlag: 'myRepairDispatch',
                    repairId: '',
                    repairName: '',
                    tel: '',
                    repairType: '',
                    roomId: '',
                    roomName: '',
                    ownerId: '',
                    state: ''
                }
            }
        },
        _initMethod: function () {
            vc.getDict('r_repair_pool', "state", function (_data) {
                vc.component.myRepairDispatchInfo.states = _data;
            });
            vc.component._listOwnerRepairs(DEFAULT_PAGE, DEFAULT_ROWS);
            vc.component._listRepairTypes(DEFAULT_PAGE, DEFAULT_ROWS);
            //与字典表关联
            vc.getDict('r_repair_pool', "state", function (_data) {
                vc.component.myRepairDispatchInfo.states = _data;
            });
        },
        _initEvent: function () {
            vc.on('myRepairDispatch', 'listOwnerRepair', function (_param) {
                vc.component._listOwnerRepairs(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listOwnerRepairs(_currentPage, DEFAULT_ROWS);
            });
            vc.on('myRepairDispatch', 'notifyData', function (_param) {
                vc.component._closeRepairDispatchOrder(_param);
            });
        },
        methods: {
            _listOwnerRepairs: function (_page, _rows) {
                vc.component.myRepairDispatchInfo.conditions.page = _page;
                vc.component.myRepairDispatchInfo.conditions.row = _rows;
                vc.component.myRepairDispatchInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                var param = {
                    params: vc.component.myRepairDispatchInfo.conditions
                };
                param.params.repairId = param.params.repairId.trim();
                param.params.repairName = param.params.repairName.trim();
                param.params.tel = param.params.tel.trim();
                //发送get请求
                vc.http.apiGet('ownerRepair.listStaffFinishRepairs',
                    param,
                    function (json, res) {
                        var _myRepairDispatchInfo = JSON.parse(json);
                        vc.component.myRepairDispatchInfo.total = _myRepairDispatchInfo.total;
                        vc.component.myRepairDispatchInfo.records = _myRepairDispatchInfo.records;
                        vc.component.myRepairDispatchInfo.ownerRepairs = _myRepairDispatchInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.myRepairDispatchInfo.records,
                            dataCount: vc.component.myRepairDispatchInfo.total,
                            currentPage: _page
                        });
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openDealRepair: function (_ownerRepair) {
                vc.component.myRepairDispatchInfo.currentRepairId = _ownerRepair.repairId;
                vc.emit('closeOrder', 'openCloseOrderModal', {});
            },
            //查询报修类型
            _listRepairTypes: function (_page, _rows) {
                var param = {
                    params: {
                        page: _page,
                        row: _rows,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('repair.listRepairSettings',
                    param,
                    function (json, res) {
                        var _repairTypesInfo = JSON.parse(json);
                        vc.component.myRepairDispatchInfo.repairTypes = _repairTypesInfo.data;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _moreCondition: function () {
                if (vc.component.myRepairDispatchInfo.moreCondition) {
                    vc.component.myRepairDispatchInfo.moreCondition = false;
                } else {
                    vc.component.myRepairDispatchInfo.moreCondition = true;
                }
            },
            _openRepairDetail: function (_repairPool) {
                vc.jumpToPage('/#/pages/property/ownerRepairDetail?repairId=' + _repairPool.repairId)
            },
            _closeRepairDispatchOrder: function (_orderInfo) {
                var _repairDispatchParam = {
                    repairId: vc.component.myRepairDispatchInfo.currentRepairId,
                    context: _orderInfo.remark,
                    communityId: vc.getCurrentCommunity().communityId
                };
                if (_orderInfo.state == '1100') {
                    _repairDispatchParam.state = '10002';
                } else {
                    _repairDispatchParam.state = '10003';
                }
                vc.http.apiPost(
                    '/ownerRepair.closeRepairDispatch',
                    JSON.stringify(_repairDispatchParam), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        if (res.status == 200) {
                            //关闭model
                            vc.component._listOwnerRepairs(DEFAULT_PAGE, DEFAULT_ROWS);
                            vc.toast("操作成功");
                            return;
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            _openDispatchRepairDetail: function (_ownerRepair) {
                vc.emit('ownerRepairDetail', 'openOwnerRepairDetailModal', _ownerRepair);
            },
            //查询
            _queryMyRepairDispatchMethod: function () {
                vc.component._listOwnerRepairs(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetMyRepairDispatchMethod: function () {
                vc.component.myRepairDispatchInfo.conditions.repairId = "";
                vc.component.myRepairDispatchInfo.conditions.repairName = "";
                vc.component.myRepairDispatchInfo.conditions.tel = "";
                vc.component.myRepairDispatchInfo.conditions.repairType = "";
                vc.component.myRepairDispatchInfo.conditions.state = "";
                vc.component._listOwnerRepairs(DEFAULT_PAGE, DEFAULT_ROWS);
            }
        }
    });
})(window.vc);