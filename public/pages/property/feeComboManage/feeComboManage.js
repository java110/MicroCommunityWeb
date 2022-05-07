/**
    入驻小区
**/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            feeComboManageInfo: {
                feeCombos: [],
                total: 0,
                records: 1,
                moreCondition: false,
                comboId: '',
                conditions: {
                    comboId: '',
                    comboName: '',
                    communityId: vc.getCurrentCommunity().communityId,

                }
            }
        },
        _initMethod: function () {
            vc.component._listFeeCombos(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {

            vc.on('feeComboManage', 'listFeeCombo', function (_param) {
                vc.component._listFeeCombos(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listFeeCombos(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listFeeCombos: function (_page, _rows) {

                vc.component.feeComboManageInfo.conditions.page = _page;
                vc.component.feeComboManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.feeComboManageInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/feeCombo.listFeeCombo',
                    param,
                    function (json, res) {
                        var _feeComboManageInfo = JSON.parse(json);
                        vc.component.feeComboManageInfo.total = _feeComboManageInfo.total;
                        vc.component.feeComboManageInfo.records = _feeComboManageInfo.records;
                        vc.component.feeComboManageInfo.feeCombos = _feeComboManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.feeComboManageInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddFeeComboModal: function () {
                vc.emit('addFeeCombo', 'openAddFeeComboModal', {});
            },
            _openEditFeeComboModel: function (_feeCombo) {
                vc.emit('editFeeCombo', 'openEditFeeComboModal', _feeCombo);
            },
            _openDeleteFeeComboModel: function (_feeCombo) {
                vc.emit('deleteFeeCombo', 'openDeleteFeeComboModal', _feeCombo);
            },
            _queryFeeComboMethod: function () {
                vc.component._listFeeCombos(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _moreCondition: function () {
                if (vc.component.feeComboManageInfo.moreCondition) {
                    vc.component.feeComboManageInfo.moreCondition = false;
                } else {
                    vc.component.feeComboManageInfo.moreCondition = true;
                }
            }


        }
    });
})(window.vc);
