/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            applicationKeyManageInfo: {
                applicationKeys: [],
                total: 0,
                records: 1,
                moreCondition: false,
                showComponent: 'applicationKeyManage',
                name: '',
                conditions: {
                    name: '',
                    typeCd: '',
                    tel: '',
                    idCard: ''
                }
            }
        },
        _initMethod: function () {
            vc.component._listApplicationKeys(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {
            vc.on('applicationKeyManage', 'listApplicationKey', function (_param) {
                vc.component._listApplicationKeys(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listApplicationKeys(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listApplicationKeys: function (_page, _rows) {
                vc.component.applicationKeyManageInfo.showComponent = 'applicationKeyManage';
                vc.component.applicationKeyManageInfo.conditions.page = _page;
                vc.component.applicationKeyManageInfo.conditions.row = _rows;
                vc.component.applicationKeyManageInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                var param = {
                    params: vc.component.applicationKeyManageInfo.conditions
                };
                param.params.name = param.params.name.trim();
                param.params.tel = param.params.tel.trim();
                param.params.idCard = param.params.idCard.trim();
                //发送get请求
                vc.http.apiGet('/applicationKey.listApplicationKeys',
                    param,
                    function (json, res) {
                        var _applicationKeyManageInfo = JSON.parse(json);
                        vc.component.applicationKeyManageInfo.total = _applicationKeyManageInfo.total;
                        vc.component.applicationKeyManageInfo.records = _applicationKeyManageInfo.records;
                        vc.component.applicationKeyManageInfo.applicationKeys = _applicationKeyManageInfo.applicationKeys;
                        vc.emit('pagination', 'init', {
                            total: vc.component.applicationKeyManageInfo.records,
                            dataCount: vc.component.applicationKeyManageInfo.total,
                            currentPage: _page
                        });
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddApplicationKeyModal: function () {
                //vc.emit('addApplicationKey', 'openAddApplicationKeyModal', {});
                vc.component.applicationKeyManageInfo.showComponent = 'addApplicationKey';
                vc.emit('addApplicationKey', "_initAddApplicationKeyData", {});
            },
            _openEditApplicationKeyModel: function (_applicationKey) {
                vc.emit('editApplicationKey', 'openEditApplicationKeyModal', _applicationKey);
                vc.component.applicationKeyManageInfo.showComponent = 'editApplicationKey';
                vc.emit('editApplicationKey', "_initEditApplicationKeyData", {});
            },
            _openDeleteApplicationKeyModel: function (_applicationKey) {
                vc.emit('deleteApplicationKey', 'openDeleteApplicationKeyModal', _applicationKey);
            },
            //查询
            _queryApplicationKeyMethod: function () {
                vc.component._listApplicationKeys(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetApplicationKeyMethod: function () {
                vc.component.applicationKeyManageInfo.conditions.name = "";
                vc.component.applicationKeyManageInfo.conditions.typeCd = "";
                vc.component.applicationKeyManageInfo.conditions.tel = "";
                vc.component.applicationKeyManageInfo.conditions.idCard = "";
                vc.component._listApplicationKeys(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function () {
                if (vc.component.applicationKeyManageInfo.moreCondition) {
                    vc.component.applicationKeyManageInfo.moreCondition = false;
                } else {
                    vc.component.applicationKeyManageInfo.moreCondition = true;
                }
            }
        }
    });
})(window.vc);