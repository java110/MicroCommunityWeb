/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            carBlackWhiteManageInfo: {
                carBlackWhites: [],
                total: 0,
                records: 1,
                moreCondition: false,
                carNum: '',
                conditions: {
                    blackWhite: '2222',
                    carNum: '',
                    bwId: ''
                },
                blackWhites: [
                    {
                        name: '白名单',
                        statusCd: '2222'
                    },
                    {
                        name: '黑名单',
                        statusCd: '1111'
                    }
                ]
            }
        },
        _initMethod: function () {
            vc.component._listCarBlackWhites(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {
            vc.on('carBlackWhiteManage', 'listCarBlackWhite', function (_param) {
                vc.component._listCarBlackWhites(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listCarBlackWhites(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            swatchBlackWhiteType: function (_item) {
                $that.carBlackWhiteManageInfo.conditions.blackWhite = _item.statusCd;
                vc.component._listCarBlackWhites(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _listCarBlackWhites: function (_page, _rows) {
                vc.component.carBlackWhiteManageInfo.conditions.page = _page;
                vc.component.carBlackWhiteManageInfo.conditions.row = _rows;
                vc.component.carBlackWhiteManageInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                var param = {
                    params: vc.component.carBlackWhiteManageInfo.conditions
                };
                param.params.bwId = param.params.bwId.trim();
                param.params.carNum = param.params.carNum.trim();
                //发送get请求
                vc.http.apiGet('/carBlackWhite.listCarBlackWhites',
                    param,
                    function (json, res) {
                        var _carBlackWhiteManageInfo = JSON.parse(json);
                        vc.component.carBlackWhiteManageInfo.total = _carBlackWhiteManageInfo.total;
                        vc.component.carBlackWhiteManageInfo.records = _carBlackWhiteManageInfo.records;
                        vc.component.carBlackWhiteManageInfo.carBlackWhites = _carBlackWhiteManageInfo.carBlackWhites;
                        vc.emit('pagination', 'init', {
                            total: vc.component.carBlackWhiteManageInfo.records,
                            dataCount: vc.component.carBlackWhiteManageInfo.total,
                            currentPage: _page
                        });
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddCarBlackWhiteModal: function () {
                vc.emit('addCarBlackWhite', 'openAddCarBlackWhiteModal', {});
            },
            _openEditCarBlackWhiteModel: function (_carBlackWhite) {
                vc.emit('editCarBlackWhite', 'openEditCarBlackWhiteModal', _carBlackWhite);
            },
            _openDeleteCarBlackWhiteModel: function (_carBlackWhite) {
                vc.emit('deleteCarBlackWhite', 'openDeleteCarBlackWhiteModal', _carBlackWhite);
            },
            //查询
            _queryCarBlackWhiteMethod: function () {
                vc.component._listCarBlackWhites(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetCarBlackWhiteMethod: function () {
                vc.component.carBlackWhiteManageInfo.conditions.bwId = "";
                vc.component.carBlackWhiteManageInfo.conditions.carNum = "";
                vc.component.carBlackWhiteManageInfo.conditions.blackWhite = "";
                vc.component._listCarBlackWhites(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function () {
                if (vc.component.carBlackWhiteManageInfo.moreCondition) {
                    vc.component.carBlackWhiteManageInfo.moreCondition = false;
                } else {
                    vc.component.carBlackWhiteManageInfo.moreCondition = true;
                }
            }
        }
    });
})(window.vc);