/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            roomRenovationRecordDetailsInfo: {
                roomRenovationRecordDetails: [],
                total: 0,
                records: 1,
                moreCondition: false,
                conditions: {
                    recordId: '',
                    roomName: '',
                    roomId: '',
                    communityId: vc.getCurrentCommunity().communityId
                }
            }
        },
        _initMethod: function () {
            vc.component.roomRenovationRecordDetailsInfo.conditions.recordId = vc.getParam('recordId');
            vc.component.roomRenovationRecordDetailsInfo.conditions.roomName = vc.getParam('roomName');
            vc.component._listRoomRenovationRecordDetails(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {
            vc.on('listRoomRenovationRecordDetails', 'listRoomRenovationRecordDetails', function (_param) {
                vc.component._listRoomRenovationRecordDetails(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listRoomRenovationRecordDetails(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listRoomRenovationRecordDetails: function (_page, _rows) {
                vc.component.roomRenovationRecordDetailsInfo.conditions.page = _page;
                vc.component.roomRenovationRecordDetailsInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.roomRenovationRecordDetailsInfo.conditions
                };
                //发送get请求
                vc.http.apiGet('/roomRenovation/queryRoomRenovationRecordDetail',
                    param,
                    function (json, res) {
                        var _roomRenovationRecordDetailsInfo = JSON.parse(json);
                        console.log("here")
                        console.log(_roomRenovationRecordDetailsInfo)
                        vc.component.roomRenovationRecordDetailsInfo.total = _roomRenovationRecordDetailsInfo.total;
                        vc.component.roomRenovationRecordDetailsInfo.records = _roomRenovationRecordDetailsInfo.records;
                        vc.component.roomRenovationRecordDetailsInfo.roomRenovationRecordDetails = _roomRenovationRecordDetailsInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.roomRenovationRecordDetailsInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _moreCondition: function () {
                if (vc.component.roomRenovationRecordDetailsInfo.moreCondition) {
                    vc.component.roomRenovationRecordDetailsInfo.moreCondition = false;
                } else {
                    vc.component.roomRenovationRecordDetailsInfo.moreCondition = true;
                }
            },
            _goBack: function () {
                vc.goBack();
            }
        }
    });
})(window.vc);
