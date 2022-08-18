/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            serviceImplManageInfo: {
                serviceImpls: [],
                total: 0,
                records: 1,
                moreCondition: false,
                name: '',
                conditions: {
                    businessTypeCd: '',
                    name: '',
                    invokeType: '',
                    messageTopic: ''
                }
            }
        },
        _initMethod: function () {
            vc.component._listServiceImpls(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {
            vc.on('serviceImplManage', 'listServiceImpl', function (_param) {
                vc.component._listServiceImpls(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listServiceImpls(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listServiceImpls: function (_page, _rows) {
                vc.component.serviceImplManageInfo.conditions.page = _page;
                vc.component.serviceImplManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.serviceImplManageInfo.conditions
                };
                param.params.businessTypeCd = param.params.businessTypeCd.trim();
                param.params.name = param.params.name.trim();
                param.params.messageTopic = param.params.messageTopic.trim();
                //发送get请求
                vc.http.apiGet('/serviceImpl.listServiceImpls',
                    param,
                    function (json, res) {
                        var _serviceImplManageInfo = JSON.parse(json);
                        vc.component.serviceImplManageInfo.total = _serviceImplManageInfo.total;
                        vc.component.serviceImplManageInfo.records = _serviceImplManageInfo.records;
                        vc.component.serviceImplManageInfo.serviceImpls = _serviceImplManageInfo.serviceImpls;
                        vc.emit('pagination', 'init', {
                            total: vc.component.serviceImplManageInfo.records,
                            dataCount: vc.component.serviceImplManageInfo.total,
                            currentPage: _page
                        });
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddServiceImplModal: function () {
                vc.emit('addServiceImpl', 'openAddServiceImplModal', {});
            },
            _openEditServiceImplModel: function (_serviceImpl) {
                vc.emit('editServiceImpl', 'openEditServiceImplModal', _serviceImpl);
            },
            _openDeleteServiceImplModel: function (_serviceImpl) {
                vc.emit('deleteServiceImpl', 'openDeleteServiceImplModal', _serviceImpl);
            },
            //查询
            _queryServiceImplMethod: function () {
                vc.component._listServiceImpls(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetServiceImplMethod: function () {
                vc.component.serviceImplManageInfo.conditions.businessTypeCd = "";
                vc.component.serviceImplManageInfo.conditions.name = "";
                vc.component.serviceImplManageInfo.conditions.invokeType = "";
                vc.component.serviceImplManageInfo.conditions.messageTopic = "";
                vc.component._listServiceImpls(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function () {
                if (vc.component.serviceImplManageInfo.moreCondition) {
                    vc.component.serviceImplManageInfo.moreCondition = false;
                } else {
                    vc.component.serviceImplManageInfo.moreCondition = true;
                }
            }
        }
    });
})(window.vc);