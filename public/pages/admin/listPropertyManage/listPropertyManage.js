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
                    tel: '',
                    relCd: '600311000001'
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
                vc.http.apiGet('/storeStaff/getPropertyStaffs',
                    param,
                    function (json, res) {
                        var _listPropertyManageInfo = JSON.parse(json);
                        vc.component.listPropertyManageInfo.total = _listPropertyManageInfo.total;
                        vc.component.listPropertyManageInfo.records = _listPropertyManageInfo.records;
                        vc.component.listPropertyManageInfo.listPropertys = _listPropertyManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.listPropertyManageInfo.records,
                            dataCount: vc.component.listPropertyManageInfo.total,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openPropertysCommunityModel: function (_listProperty) {
                vc.emit('storesCommunity', 'openStoresCommunity', _listProperty);
            },
            _openAdminLoginPropertyModel: function (_listProperty) {
                vc.emit('adminLoginProperty', 'login', {
                    username: _listProperty.staffName,
                    userId: _listProperty.staffId,
                    curUserName: vc.getData('/nav/getUserInfo').name
                })
            },
            _openUpdateStoreStateModel: function (_listProperty, state) {
                vc.emit('updateStoreState', 'open', {
                    storeId: _listProperty.storeId,
                    state: state,
                    stateName: state == '48002' ? '限制登录' : '恢复登录'
                })
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
