/**
    入驻小区
**/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            contractCollectionPlanManageInfo: {
                contractCollectionPlans: [],
                total: 0,
                records: 1,
                moreCondition: false,
                planId: '',
                conditions: {
                    planName: '',
                    feeName: '',
                    contractCode: '',

                }
            }
        },
        _initMethod: function () {
            vc.component._listContractCollectionPlans(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {

            vc.on('contractCollectionPlanManage', 'listContractCollectionPlan', function (_param) {
                vc.component._listContractCollectionPlans(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listContractCollectionPlans(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listContractCollectionPlans: function (_page, _rows) {

                vc.component.contractCollectionPlanManageInfo.conditions.page = _page;
                vc.component.contractCollectionPlanManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.contractCollectionPlanManageInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('contractCollectionPlan.listContractCollectionPlans',
                    param,
                    function (json, res) {
                        var _contractCollectionPlanManageInfo = JSON.parse(json);
                        vc.component.contractCollectionPlanManageInfo.total = _contractCollectionPlanManageInfo.total;
                        vc.component.contractCollectionPlanManageInfo.records = _contractCollectionPlanManageInfo.records;
                        vc.component.contractCollectionPlanManageInfo.contractCollectionPlans = _contractCollectionPlanManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.contractCollectionPlanManageInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddContractCollectionPlanModal: function () {
                vc.emit('addContractCollectionPlan', 'openAddContractCollectionPlanModal', {});
            },
            _openContractCollectionPlanFeeModel: function (_contractCollectionPlan) {
                //vc.emit('editContractCollectionPlan', 'openEditContractCollectionPlanModal', _contractCollectionPlan);
            },
            _openDeleteContractCollectionPlanModel: function (_contractCollectionPlan) {
                vc.emit('deleteContractCollectionPlan', 'openDeleteContractCollectionPlanModal', _contractCollectionPlan);
            },
            _queryContractCollectionPlanMethod: function () {
                vc.component._listContractCollectionPlans(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _moreCondition: function () {
                if (vc.component.contractCollectionPlanManageInfo.moreCondition) {
                    vc.component.contractCollectionPlanManageInfo.moreCondition = false;
                } else {
                    vc.component.contractCollectionPlanManageInfo.moreCondition = true;
                }
            }


        }
    });
})(window.vc);
