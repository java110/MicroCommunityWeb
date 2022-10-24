/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            marketWayPicInfo: {
                marketPics: [],
                total: 0,
                records: 1,
                moreCondition: false,
                textId: '',
                conditions: {
                    name: '',

                }
            }
        },
        _initMethod: function () {
            vc.component._listMarketPics(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {
            vc.on('marketWayPic', 'switch', function (_data) {
                $that._listMarketPics(DEFAULT_PAGE, DEFAULT_ROWS);

            });
            vc.on('marketPicManage', 'listMarketPic', function (_data) {
                $that._listMarketPics(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('marketWayPic', 'paginationPlus', 'page_event',
                function (_currentPage) {
                    vc.component._listMarketPics(_currentPage, DEFAULT_ROWS);
                });
        },
        methods: {
            _listMarketPics: function (_page, _rows) {

                vc.component.marketWayPicInfo.conditions.page = _page;
                vc.component.marketWayPicInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.marketWayPicInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/marketPic.listMarketPic',
                    param,
                    function (json, res) {
                        let _marketWayPicInfo = JSON.parse(json);
                        vc.component.marketWayPicInfo.total = _marketWayPicInfo.total;
                        vc.component.marketWayPicInfo.records = _marketWayPicInfo.records;
                        vc.component.marketWayPicInfo.marketPics = _marketWayPicInfo.data;
                        vc.emit('marketWayPic', 'paginationPlus','init',{
                            total:vc.component.marketWayPicInfo.records,
                            currentPage:_page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddMarketPicModal: function () {
                vc.emit('addMarketPic', 'openAddMarketPicModal', {});
            },
            _openEditMarketPicModel: function (_marketPic) {
                vc.emit('editMarketPic', 'openEditMarketPicModal', _marketPic);
            },
            _openDeleteMarketPicModel: function (_marketPic) {
                vc.emit('deleteMarketPic', 'openDeleteMarketPicModal', _marketPic);
            },
            _queryMarketPicMethod: function () {
                vc.component._listMarketPics(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _moreCondition: function () {
                if (vc.component.marketWayPicInfo.moreCondition) {
                    vc.component.marketWayPicInfo.moreCondition = false;
                } else {
                    vc.component.marketWayPicInfo.moreCondition = true;
                }
            },
            _viewMarketWayPicImage: function(_url) {
                vc.emit('viewImage', 'showImage', {
                    url: _url
                });
            },
        }
    });
})(window.vc);