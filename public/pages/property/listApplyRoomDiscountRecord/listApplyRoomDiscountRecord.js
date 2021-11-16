/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            listApplyRoomDiscountRecordsInfo: {
                listApplyRoomDiscountRecords: [],
                applyRoomDiscount: [],
                total: 0,
                records: 1,
                moreCondition: false,
                conditions: {
                    ardId: '',
                    roomId: '',
                    roomName: '',
                    stateName: '',
                    state: '',
                    communityId: vc.getCurrentCommunity().communityId
                }
            }
        },
        _initMethod: function () {
            vc.component.listApplyRoomDiscountRecordsInfo.conditions.ardId = vc.getParam('ardId');
            vc.component.listApplyRoomDiscountRecordsInfo.conditions.state = vc.getParam('state')
            vc.component.listApplyRoomDiscountRecordsInfo.conditions.stateName = vc.getParam('stateName')
            vc.component.listApplyRoomDiscountRecordsInfo.conditions.roomId = vc.getParam('roomId')
            vc.component.listApplyRoomDiscountRecordsInfo.conditions.roomName = vc.getParam('roomName')
            vc.component._listApplyRoomDiscountRecords(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {
            vc.on('listApplyRoomDiscountRecord', 'listApplyRoomDiscountRecords', function (_param) {
                vc.component._listApplyRoomDiscountRecords(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listApplyRoomDiscountRecords(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listApplyRoomDiscountRecords: function (_page, _rows) {
                vc.component.listApplyRoomDiscountRecordsInfo.conditions.page = _page;
                vc.component.listApplyRoomDiscountRecordsInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.listApplyRoomDiscountRecordsInfo.conditions
                };
                //发送get请求
                vc.http.apiGet('/applyRoomDiscountRecord/queryApplyRoomDiscountRecord',
                    param,
                    function (json, res) {
                        var _ApplyRoomDiscountRecordsInfo = JSON.parse(json);
                        vc.component.listApplyRoomDiscountRecordsInfo.total = _ApplyRoomDiscountRecordsInfo.total;
                        vc.component.listApplyRoomDiscountRecordsInfo.records = _ApplyRoomDiscountRecordsInfo.records;
                        vc.component.listApplyRoomDiscountRecordsInfo.listApplyRoomDiscountRecords = _ApplyRoomDiscountRecordsInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.listApplyRoomDiscountRecordsInfo.records,
                            dataCount: vc.component.listApplyRoomDiscountRecordsInfo.total,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            //添加
            _openAddModal: function (applyRoomDiscount) {
                applyRoomDiscount.push(vc.component.listApplyRoomDiscountRecordsInfo.conditions.ardId)
                applyRoomDiscount.push(vc.component.listApplyRoomDiscountRecordsInfo.conditions.state)
                applyRoomDiscount.push(vc.component.listApplyRoomDiscountRecordsInfo.conditions.stateName)
                applyRoomDiscount.push(vc.component.listApplyRoomDiscountRecordsInfo.conditions.roomId)
                applyRoomDiscount.push(vc.component.listApplyRoomDiscountRecordsInfo.conditions.roomName)
                vc.emit('applyRoomDiscountRecord', 'openApplyRoomDiscountRecordModal', applyRoomDiscount);
            },
            //删除
            _openDeleteApplyRoomDiscountRecordModel: function (_applyRoomDiscountRecord) {
                vc.emit('deleteApplyRoomDiscountRecord', 'openDeleteApplyRoomDiscountRecordModal', _applyRoomDiscountRecord);
            },
            //查看详情
            _openApplyRoomDiscountRecordDetailsModel: function (_applyRoomDiscountRecord) {
                vc.jumpToPage('/admin.html#/pages/property/listApplyRoomDiscountRecordDetails?ardrId=' + _applyRoomDiscountRecord.ardrId
                    + '&roomName=' + _applyRoomDiscountRecord.roomName  + '&state=' + _applyRoomDiscountRecord.state);
            },
            _moreCondition: function () {
                if (vc.component.listApplyRoomDiscountRecordsInfo.moreCondition) {
                    vc.component.listApplyRoomDiscountRecordsInfo.moreCondition = false;
                } else {
                    vc.component.listApplyRoomDiscountRecordsInfo.moreCondition = true;
                }
            },
            _goBack: function () {
                vc.goBack();
            }
        }
    });
})(window.vc);
