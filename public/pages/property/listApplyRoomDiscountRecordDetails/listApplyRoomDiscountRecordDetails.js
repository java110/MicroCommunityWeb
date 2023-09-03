/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            applyRoomDiscountRecordDetailsInfo: {
                applyRoomDiscountRecordDetails: [],
                total: 0,
                records: 1,
                moreCondition: false,
                conditions: {
                    ardrId: '',
                    roomName: '',
                    state: '',
                    roomId: '',
                    communityId: vc.getCurrentCommunity().communityId
                }
            }
        },
        _initMethod: function () {
            vc.component.applyRoomDiscountRecordDetailsInfo.conditions.ardrId = vc.getParam('ardrId');
            vc.component.applyRoomDiscountRecordDetailsInfo.conditions.roomName = vc.getParam('roomName');
            vc.component.applyRoomDiscountRecordDetailsInfo.conditions.state = vc.getParam('state');
            vc.component._listApplyRoomDiscountRecordDetails(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {
            vc.on('listApplyRoomDiscountRecordDetails', 'listApplyRoomDiscountRecordDetails', function (_param) {
                vc.component._listApplyRoomDiscountRecordDetails(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listApplyRoomDiscountRecordDetails(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listApplyRoomDiscountRecordDetails: function (_page, _rows) {
                vc.component.applyRoomDiscountRecordDetailsInfo.conditions.page = _page;
                vc.component.applyRoomDiscountRecordDetailsInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.applyRoomDiscountRecordDetailsInfo.conditions
                };
                //发送get请求
                vc.http.apiGet('/applyRoomDiscountRecord/queryApplyRoomDiscountRecordDetail',
                    param,
                    function (json, res) {
                        var _applyRoomDiscountRecordDetailsInfo = JSON.parse(json);
                        vc.component.applyRoomDiscountRecordDetailsInfo.total = _applyRoomDiscountRecordDetailsInfo.total;
                        vc.component.applyRoomDiscountRecordDetailsInfo.records = _applyRoomDiscountRecordDetailsInfo.records;
                        vc.component.applyRoomDiscountRecordDetailsInfo.applyRoomDiscountRecordDetails = _applyRoomDiscountRecordDetailsInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.applyRoomDiscountRecordDetailsInfo.records,
                            dataCount: vc.component.applyRoomDiscountRecordDetailsInfo.total,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _moreCondition: function () {
                if (vc.component.applyRoomDiscountRecordDetailsInfo.moreCondition) {
                    vc.component.applyRoomDiscountRecordDetailsInfo.moreCondition = false;
                } else {
                    vc.component.applyRoomDiscountRecordDetailsInfo.moreCondition = true;
                }
            },
            _goBack: function () {
                vc.goBack();
            },
            showImg: function (e) {
                vc.emit('viewImage', 'showImage', {url: e});
            }
        }
    });
})(window.vc);
