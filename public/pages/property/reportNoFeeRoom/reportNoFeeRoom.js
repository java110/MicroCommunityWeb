/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            reportNoFeeRoomInfo: {
                rooms: [],
                total: 0,
                records: 1,
                moreCondition: false,
                conditions: {
                    floorNum: '',
                    unitNum: '',
                    roomNum: '',
                    ownerName: '',
                    link: ''
                }
            }
        },
        _initMethod: function () {
            vc.component._listRepairs(DEFAULT_PAGE, DEFAULT_ROWS);
            $(".popover-show").mouseover(() => {
                $('.popover-show').popover('show');
            })
            $(".popover-show").mouseleave(() => {
                $('.popover-show').popover('hide');
            })
        },
        _initEvent: function () {
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listRepairs(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            //查询
            _queryMethod: function () {
                vc.component._listRepairs(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //查询方法
            _listRepairs: function (_page, _rows) {
                vc.component.reportNoFeeRoomInfo.conditions.page = _page;
                vc.component.reportNoFeeRoomInfo.conditions.row = _rows;
                vc.component.reportNoFeeRoomInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                var param = {
                    params: vc.component.reportNoFeeRoomInfo.conditions
                };
                //发送get请求
                vc.http.apiGet('/reportFeeMonthStatistics/queryNoFeeRooms',
                    param,
                    function (json, res) {
                        var _reportNoFeeRoomInfo = JSON.parse(json);
                        vc.component.reportNoFeeRoomInfo.total = _reportNoFeeRoomInfo.total;
                        vc.component.reportNoFeeRoomInfo.records = _reportNoFeeRoomInfo.records;
                        vc.component.reportNoFeeRoomInfo.rooms = _reportNoFeeRoomInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.reportNoFeeRoomInfo.records,
                            currentPage: _page,
                            dataCount: vc.component.reportNoFeeRoomInfo.total
                        });
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _moreCondition: function () {
                if (vc.component.reportNoFeeRoomInfo.moreCondition) {
                    vc.component.reportNoFeeRoomInfo.moreCondition = false;
                } else {
                    vc.component.reportNoFeeRoomInfo.moreCondition = true;
                }
            },
            //导出
            _exportExcel: function () {
                vc.jumpToPage('/callComponent/exportReportFee/exportData?communityId=' + vc.getCurrentCommunity().communityId + "&pagePath=reportNoFeeRoom");
            }
        }
    });
})(window.vc);