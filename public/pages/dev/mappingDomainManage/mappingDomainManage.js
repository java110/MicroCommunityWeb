/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            mappingDomainManageInfo: {
                mappingDomains: [],
                total: 0,
                records: 1,
                moreCondition: false,
                id: '',
                conditions: {
                    id: '',
                    domain: '',
                    seq: ''
                }
            }
        },
        _initMethod: function () {
            vc.component._listMappingDomains(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {
            vc.on('mappingDomainManage', 'listMappingDomain', function (_param) {
                vc.component._listMappingDomains(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listMappingDomains(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listMappingDomains: function (_page, _rows) {
                vc.component.mappingDomainManageInfo.conditions.page = _page;
                vc.component.mappingDomainManageInfo.conditions.row = _rows;
                let param = {
                    params: vc.component.mappingDomainManageInfo.conditions
                };
                //发送get请求
                vc.http.apiGet('/mapping.listMappingDomain',
                    param,
                    function (json, res) {
                        let _mappingDomainManageInfo = JSON.parse(json);
                        vc.component.mappingDomainManageInfo.total = _mappingDomainManageInfo.total;
                        vc.component.mappingDomainManageInfo.records = _mappingDomainManageInfo.records;
                        vc.component.mappingDomainManageInfo.mappingDomains = _mappingDomainManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.mappingDomainManageInfo.records,
                            dataCount: vc.component.mappingDomainManageInfo.total,
                            currentPage: _page
                        });
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddMappingDomainModal: function () {
                vc.emit('addMappingDomain', 'openAddMappingDomainModal', {});
            },
            _openEditMappingDomainModel: function (_mappingDomain) {
                vc.emit('editMappingDomain', 'openEditMappingDomainModal', _mappingDomain);
            },
            _openDeleteMappingDomainModel: function (_mappingDomain) {
                vc.emit('deleteMappingDomain', 'openDeleteMappingDomainModal', _mappingDomain);
            },
            //查询
            _queryMappingDomainMethod: function () {
                vc.component._listMappingDomains(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetMappingDomainMethod: function () {
                vc.component.mappingDomainManageInfo.conditions.domain = "";
                vc.component.mappingDomainManageInfo.conditions.domainName = "";
                vc.component._listMappingDomains(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function () {
                if (vc.component.mappingDomainManageInfo.moreCondition) {
                    vc.component.mappingDomainManageInfo.moreCondition = false;
                } else {
                    vc.component.mappingDomainManageInfo.moreCondition = true;
                }
            }
        }
    });
})(window.vc);