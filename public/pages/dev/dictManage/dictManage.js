/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            dictManageInfo: {
                dicts: [],
                dictSpecs: [],
                total: 0,
                records: 1,
                moreCondition: false,
                id: '',
                conditions: {
                    id: '',
                    statusCd: '',
                    name: '',
                    specId: ''
                }
            }
        },
        _initMethod: function () {
            $that._listDictSpecs();
            vc.component._listDicts(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {
            vc.on('dictManage', 'listDict', function (_param) {
                vc.component._listDicts(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listDicts(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listDicts: function (_page, _rows) {
                vc.component.dictManageInfo.conditions.page = _page;
                vc.component.dictManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.dictManageInfo.conditions
                };
                param.params.statusCd = param.params.statusCd.trim();
                param.params.name = param.params.name.trim();
                //发送get请求
                vc.http.apiGet('/dict.listDict',
                    param,
                    function (json, res) {
                        var _dictManageInfo = JSON.parse(json);
                        vc.component.dictManageInfo.total = _dictManageInfo.total;
                        vc.component.dictManageInfo.records = _dictManageInfo.records;
                        vc.component.dictManageInfo.dicts = _dictManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.dictManageInfo.records,
                            dataCount: vc.component.dictManageInfo.total,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _listDictSpecs: function () {
                let param = {
                    params: {
                        page: 1,
                        row: 1000
                    }
                };
                //发送get请求
                vc.http.apiGet('/dictSpec.listDictSpec',
                    param,
                    function (json, res) {
                        let _dictManageInfo = JSON.parse(json);
                        $that.dictManageInfo.dictSpecs = _dictManageInfo.data;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddDictModal: function () {
                vc.emit('addDict', 'openAddDictModal', {});
            },
            _openEditDictModel: function (_dict) {
                vc.emit('editDict', 'openEditDictModal', _dict);
            },
            _openDeleteDictModel: function (_dict) {
                vc.emit('deleteDict', 'openDeleteDictModal', _dict);
            },
            //查询
            _queryDictMethod: function () {
                vc.component._listDicts(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetDictMethod: function () {
                vc.component.dictManageInfo.conditions.specId = "";
                vc.component.dictManageInfo.conditions.statusCd = "";
                vc.component.dictManageInfo.conditions.name = "";
                vc.component._listDicts(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function () {
                if (vc.component.dictManageInfo.moreCondition) {
                    vc.component.dictManageInfo.moreCondition = false;
                } else {
                    vc.component.dictManageInfo.moreCondition = true;
                }
            }
        }
    });
})(window.vc);
