/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            listPropertyManageInfo: {
                listPropertys: [],
                total: 0,
                records: 1,
                moreCondition: false,
                conditions: {
                    name: '',
                    staffName: '',
                    tel: ''
                }
            }
        },
        _initMethod: function () {
            vc.component._listListPropertys(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {

            vc.on('listPropertyManage', 'listListProperty', function (_param) {
                vc.component._listListPropertys(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listListPropertys(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listListPropertys: function (_page, _rows) {
                vc.component.listPropertyManageInfo.conditions.page = _page;
                vc.component.listPropertyManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.listPropertyManageInfo.conditions
                };

                //发送get请求
                vc.http.get('listStoreManage',
                    'list',
                    param,
                    function (json, res) {
                        var _listPropertyManageInfo = JSON.parse(json);
                        vc.component.listPropertyManageInfo.total = _listPropertyManageInfo.total;
                        vc.component.listPropertyManageInfo.records = _listPropertyManageInfo.records;
                        vc.component.listPropertyManageInfo.listPropertys = _listPropertyManageInfo.stores;
                        vc.emit('pagination', 'init', {
                            total: vc.component.listPropertyManageInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openPropertysCommunityModel: function (_listProperty) {
                vc.emit('storesCommunity','openStoresCommunity', _listProperty);
            },
            _queryListPropertyMethod: function () {
                vc.component._listListPropertys(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _moreCondition: function () {
                if (vc.component.listPropertyManageInfo.moreCondition) {
                    vc.component.listPropertyManageInfo.moreCondition = false;
                } else {
                    vc.component.listPropertyManageInfo.moreCondition = true;
                }
            }


        }
    });
})(window.vc);
