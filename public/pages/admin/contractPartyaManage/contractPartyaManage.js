/**
    入驻小区
**/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            contractPartyaManageInfo: {
                contractPartyas: [],
                total: 0,
                records: 1,
                moreCondition: false,
                partyaId: '',
                conditions: {
                    partyA: '',
                    aContacts: '',
                    aLink: '',

                }
            }
        },
        _initMethod: function () {
            vc.component._listContractPartyas(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {

            vc.on('contractPartyaManage', 'listContractPartya', function (_param) {
                vc.component._listContractPartyas(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listContractPartyas(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listContractPartyas: function (_page, _rows) {

                vc.component.contractPartyaManageInfo.conditions.page = _page;
                vc.component.contractPartyaManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.contractPartyaManageInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/contractPartya/queryContractPartya',
                    param,
                    function (json, res) {
                        var _contractPartyaManageInfo = JSON.parse(json);
                        vc.component.contractPartyaManageInfo.total = _contractPartyaManageInfo.total;
                        vc.component.contractPartyaManageInfo.records = _contractPartyaManageInfo.records;
                        vc.component.contractPartyaManageInfo.contractPartyas = _contractPartyaManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.contractPartyaManageInfo.records,
                            dataCount: vc.component.contractPartyaManageInfo.total,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddContractPartyaModal: function () {
                vc.emit('addContractPartya', 'openAddContractPartyaModal', {});
            },
            _openEditContractPartyaModel: function (_contractPartya) {
                vc.emit('editContractPartya', 'openEditContractPartyaModal', _contractPartya);
            },
            _openDeleteContractPartyaModel: function (_contractPartya) {
                vc.emit('deleteContractPartya', 'openDeleteContractPartyaModal', _contractPartya);
            },
            _queryContractPartyaMethod: function () {
                vc.component._listContractPartyas(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _moreCondition: function () {
                if (vc.component.contractPartyaManageInfo.moreCondition) {
                    vc.component.contractPartyaManageInfo.moreCondition = false;
                } else {
                    vc.component.contractPartyaManageInfo.moreCondition = true;
                }
            }


        }
    });
})(window.vc);
