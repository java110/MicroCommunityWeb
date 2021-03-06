/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            roomDecorationRecordsInfo: {
                roomRenovationRecords: [],
                roomRenovation: [],
                total: 0,
                records: 1,
                moreCondition: false,
                conditions: {
                    rId: '',
                    roomName: '',
                    roomId: '',
                    stateName: '',
                    state: '',
                    communityId: vc.getCurrentCommunity().communityId
                }
            }
        },
        _initMethod: function () {
            vc.component.roomDecorationRecordsInfo.conditions.rId = vc.getParam('rId');
            vc.component.roomDecorationRecordsInfo.conditions.roomId = vc.getParam('roomId');
            vc.component.roomDecorationRecordsInfo.conditions.roomName = vc.getParam('roomName');
            vc.component.roomDecorationRecordsInfo.conditions.state = vc.getParam('state')
            vc.component.roomDecorationRecordsInfo.conditions.stateName = vc.getParam('stateName')
            vc.component._listRoomRenovationRecords(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {
            vc.on('listRoomDecorationRecord', 'listRoomRenovationRecords', function (_param) {
                vc.component._listRoomRenovationRecords(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listRoomRenovationRecords(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listRoomRenovationRecords: function (_page, _rows) {
                vc.component.roomDecorationRecordsInfo.conditions.page = _page;
                vc.component.roomDecorationRecordsInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.roomDecorationRecordsInfo.conditions
                };
                //发送get请求
                vc.http.apiGet('/roomRenovation/queryRoomRenovationRecord',
                    param,
                    function (json, res) {
                        var _roomDecorationRecordsInfo = JSON.parse(json);
                        vc.component.roomDecorationRecordsInfo.total = _roomDecorationRecordsInfo.total;
                        vc.component.roomDecorationRecordsInfo.records = _roomDecorationRecordsInfo.records;
                        vc.component.roomDecorationRecordsInfo.roomRenovationRecords = _roomDecorationRecordsInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.roomDecorationRecordsInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            //添加
            _openAddModal: function (roomRenovation) {
                roomRenovation.push(vc.component.roomDecorationRecordsInfo.conditions.rId)
                roomRenovation.push(vc.component.roomDecorationRecordsInfo.conditions.roomId)
                roomRenovation.push(vc.component.roomDecorationRecordsInfo.conditions.roomName)
                roomRenovation.push(vc.component.roomDecorationRecordsInfo.conditions.state)
                roomRenovation.push(vc.component.roomDecorationRecordsInfo.conditions.stateName)
                vc.emit('roomDecorationRecord', 'openDecorationRecordModal', roomRenovation);
            },
            //删除
            _openDeleteRoomRenovationRecordModel: function (_roomDecorationRecord) {
                vc.emit('deleteRoomDecorationRecord', 'openDeleteRoomDecorationRecordModal', _roomDecorationRecord);
            },
            //查看详情
            _openRoomRenovationRecordDetailsModel: function (_roomDecorationRecord) {
                vc.jumpToPage('/admin.html#/pages/property/listRoomRenovationRecordDetails?recordId=' + _roomDecorationRecord.recordId
                    + '&roomName=' + _roomDecorationRecord.roomName);
            },
            _moreCondition: function () {
                if (vc.component.roomDecorationRecordsInfo.moreCondition) {
                    vc.component.roomDecorationRecordsInfo.moreCondition = false;
                } else {
                    vc.component.roomDecorationRecordsInfo.moreCondition = true;
                }
            },
            _goBack: function () {
                vc.goBack();
            }
        }
    });
})(window.vc);
