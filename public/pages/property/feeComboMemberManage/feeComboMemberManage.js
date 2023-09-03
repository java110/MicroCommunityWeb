/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            feeComboMemberManageInfo: {
                feeComboMembers: [],
                total: 0,
                records: 1,
                moreCondition: false,
                comboId: '',
                comboName: '',
                conditions: {
                    comboId: '',
                    comboName: '',
                    communityId: vc.getCurrentCommunity().communityId,
                }
            }
        },
        _initMethod: function () {
            $that.feeComboMemberManageInfo.conditions.comboId = vc.getParam('comboId')
            $that.feeComboMemberManageInfo.comboName = vc.getParam('comboName')
            vc.component._listFeeComboMembers(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {
            vc.on('feeComboMemberManage', 'listFeeComboMember', function (_param) {
                vc.component._listFeeComboMembers(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listFeeComboMembers(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listFeeComboMembers: function (_page, _rows) {
                vc.component.feeComboMemberManageInfo.conditions.page = _page;
                vc.component.feeComboMemberManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.feeComboMemberManageInfo.conditions
                };
                //发送get请求
                vc.http.apiGet('/feeComboMember.listFeeComboMember',
                    param,
                    function (json, res) {
                        var _feeComboMemberManageInfo = JSON.parse(json);
                        vc.component.feeComboMemberManageInfo.total = _feeComboMemberManageInfo.total;
                        vc.component.feeComboMemberManageInfo.records = _feeComboMemberManageInfo.records;
                        vc.component.feeComboMemberManageInfo.feeComboMembers = _feeComboMemberManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.feeComboMemberManageInfo.records,
                            dataCount: vc.component.feeComboMemberManageInfo.total,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddFeeComboMemberModal: function () {
                vc.emit('addFeeComboMember', 'openAddFeeComboMemberModal', {
                    comboId: $that.feeComboMemberManageInfo.conditions.comboId
                });
            },
            _openDeleteFeeComboMemberModel: function (_feeComboMember) {
                vc.emit('deleteFeeComboMember', 'openDeleteFeeComboMemberModal', _feeComboMember);
            },
            _queryFeeComboMemberMethod: function () {
                vc.component._listFeeComboMembers(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _goBack: function () {
                vc.goBack();
            },
            _moreCondition: function () {
                if (vc.component.feeComboMemberManageInfo.moreCondition) {
                    vc.component.feeComboMemberManageInfo.moreCondition = false;
                } else {
                    vc.component.feeComboMemberManageInfo.moreCondition = true;
                }
            }
        }
    });
})(window.vc);
