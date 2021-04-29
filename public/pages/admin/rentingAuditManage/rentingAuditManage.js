/**
    入驻小区
**/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            rentingPoolManageInfo: {
                rentingPools: [],
                total: 0,
                records: 1,
                moreCondition: false,
                rentingId: '',
                conditions: {
                    rentingTitle: '',
                    paymentType: '',
                    ownerName: '',
                    state: '0'
                }
            }
        },
        _initMethod: function () {
            vc.component._listRentingPools(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {

            vc.on('rentingPoolManage', 'listRentingPool', function (_param) {
                vc.component._listRentingPools(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('rentingAuditManage', 'audit', function (_auditInfo) {
                $that._auditRenting(_auditInfo);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listRentingPools(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listRentingPools: function (_page, _rows) {

                vc.component.rentingPoolManageInfo.conditions.page = _page;
                vc.component.rentingPoolManageInfo.conditions.row = _rows;
                vc.component.rentingPoolManageInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                var param = {
                    params: vc.component.rentingPoolManageInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/renting/queryRentingPool',
                    param,
                    function (json, res) {
                        var _rentingPoolManageInfo = JSON.parse(json);
                        vc.component.rentingPoolManageInfo.total = _rentingPoolManageInfo.total;
                        vc.component.rentingPoolManageInfo.records = _rentingPoolManageInfo.records;
                        vc.component.rentingPoolManageInfo.rentingPools = _rentingPoolManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.rentingPoolManageInfo.records,
                            dataCount: vc.component.rentingPoolManageInfo.total,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAuditModal: function (_renting) {
                $that.rentingPoolManageInfo.rentingId = _renting.rentingId;
                vc.emit('audit', 'openAuditModal', {});
            },
            _openEditRentingPoolModel: function (_rentingPool) {
                vc.emit('editRentingPool', 'openEditRentingPoolModal', _rentingPool);
            },
            _openDeleteRentingPoolModel: function (_rentingPool) {
                vc.emit('deleteRentingPool', 'openDeleteRentingPoolModal', _rentingPool);
            },
            _queryRentingPoolMethod: function () {
                vc.component._listRentingPools(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _moreCondition: function () {
                if (vc.component.rentingPoolManageInfo.moreCondition) {
                    vc.component.rentingPoolManageInfo.moreCondition = false;
                } else {
                    vc.component.rentingPoolManageInfo.moreCondition = true;
                }
            },
            _auditRenting: function (_auditInfo) {
                let _user = vc.getData('/nav/getUserInfo');

                let _userRole = 4; // 运营团队

                if (_user.storeTypeCd == '800900000002') {
                    _userRole = 3;
                }

                let _state = "2002";

                if (_auditInfo.state == '1200') {
                    _state = "3003";//代理商审核失败
                }

                let _audtiInfo = {
                    userRole: _userRole,
                    state: _state,
                    context: _auditInfo.remark,
                    rentingId: $that.rentingPoolManageInfo.rentingId
                }

                //发送get请求
                vc.http.apiPost(
                    '/renting/auditRenting',
                    JSON.stringify(_audtiInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addRentingConfigModel').modal('hide');
                            $that._listRentingPools(DEFAULT_PAGE, DEFAULT_ROWS);
                            return;
                        }
                        vc.message(_json.msg);

                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);

                    });
            },
            _toRentingHistory:function(rentingPool){
                vc.jumpToPage('/admin.html#/pages/admin/rentingDetail?rentingId='+rentingPool.rentingId);
            }


        }
    });
})(window.vc);
