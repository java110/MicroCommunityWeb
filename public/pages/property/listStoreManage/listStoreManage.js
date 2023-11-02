/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            listStoreManageInfo: {
                listStores: [],
                total: 0,
                records: 1,
                moreCondition: false,
                conditions: {
                    name: '',
                    storeTypeCd: '',
                    tel: ''
                }
            }
        },
        _initMethod: function () {
            $that._listListStores(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {

            vc.on('listStoreManage', 'listListStore', function (_param) {
                $that._listListStores(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                $that._listListStores(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listListStores: function (_page, _rows) {
                $that.listStoreManageInfo.conditions.page = _page;
                $that.listStoreManageInfo.conditions.row = _rows;
                var param = {
                    params: $that.listStoreManageInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/store.listStores',
                    param,
                    function (json, res) {
                        var _listStoreManageInfo = JSON.parse(json);
                        $that.listStoreManageInfo.total = _listStoreManageInfo.total;
                        $that.listStoreManageInfo.records = _listStoreManageInfo.records;
                        $that.listStoreManageInfo.listStores = _listStoreManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: $that.listStoreManageInfo.records,
                            dataCount: $that.listStoreManageInfo.total,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openStoresCommunityModel: function (_listStore) {
                vc.emit('storesCommunity','openStoresCommunity', _listStore);
            },
            _queryListStoreMethod: function () {
                $that._listListStores(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _moreCondition: function () {
                if ($that.listStoreManageInfo.moreCondition) {
                    $that.listStoreManageInfo.moreCondition = false;
                } else {
                    $that.listStoreManageInfo.moreCondition = true;
                }
            }


        }
    });
})(window.vc);
