/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            advertManageInfo: {
                advertTypeName: ["", "站内", "站外", "不跳转"],
                adverts: [],
                total: 0,
                records: 1,
                moreCondition: false,
                adName: '',
                locationTypeCds: [],
                conditions: {
                    adName: '',
                    adTypeCd: '',
                    classify: '',
                    state: '',
                    locationTypeCd: ''
                }
            }
        },
        _initMethod: function () {
            vc.component._listAdverts(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {
            vc.on('advertManage', 'listAdvert', function (_param) {
                vc.component._listAdverts(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listAdverts(_currentPage, DEFAULT_ROWS);
            });
            //与字典表位置类型关联
            vc.getDict('advert', "location_type_cd", function (_data) {
                vc.component.advertManageInfo.locationTypeCds = _data;
            });
        },
        methods: {
            _listAdverts: function (_page, _rows) {
                vc.component.advertManageInfo.conditions.page = _page;
                vc.component.advertManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.advertManageInfo.conditions
                };
                param.params.adName = param.params.adName.trim();
                //发送get请求
                vc.http.apiGet('/advert.listAdverts',
                    param,
                    function (json, res) {
                        var _advertManageInfo = JSON.parse(json);
                        vc.component.advertManageInfo.total = _advertManageInfo.total;
                        vc.component.advertManageInfo.records = _advertManageInfo.records;
                        vc.component.advertManageInfo.adverts = _advertManageInfo.adverts;
                        vc.emit('pagination', 'init', {
                            total: vc.component.advertManageInfo.records,
                            dataCount: vc.component.advertManageInfo.total,
                            currentPage: _page
                        });
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddAdvertModal: function () {
                vc.emit('addAdvert', 'openAddAdvertModal', {});
            },
            _openEditAdvertModel: function (_advert) {
                vc.emit('editAdvert', 'openEditAdvertModal', _advert);
            },
            _openDeleteAdvertModel: function (_advert) {
                vc.emit('deleteAdvert', 'openDeleteAdvertModal', _advert);
            },
            //查询
            _queryAdvertMethod: function () {
                vc.component._listAdverts(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetAdvertMethod: function () {
                vc.component.advertManageInfo.conditions.adName = "";
                vc.component.advertManageInfo.conditions.classify = "";
                vc.component.advertManageInfo.conditions.state = "";
                vc.component.advertManageInfo.conditions.locationTypeCd = "";
                vc.component._listAdverts(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _viewAdvertPhotoOrPhoto: function () {
                vc.emit('writeAdvertMachine', 'openWriteAdvertMachineModal', {});
            },
            _moreCondition: function () {
                if (vc.component.advertManageInfo.moreCondition) {
                    vc.component.advertManageInfo.moreCondition = false;
                } else {
                    vc.component.advertManageInfo.moreCondition = true;
                }
            }
        }
    });
})(window.vc);