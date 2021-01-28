/**
    入驻小区
**/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            roomRenovationDetailManageInfo: {
                roomRenovationDetails: [],
                total: 0,
                records: 1,
                moreCondition: false,
                rId: '',
                roomName:''
            }
        },
        _initMethod: function () {
            
            $that.roomRenovationDetailManageInfo.rId = vc.getParam('rId');
            $that.roomRenovationDetailManageInfo.roomName = vc.getParam('roomName');
            vc.component._listRoomRenovationDetails(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listRoomRenovationDetails(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listRoomRenovationDetails: function (_page, _rows) {

                var param = {
                    params: {
                        page:_page,
                        row:_rows,
                        rId:$that.roomRenovationDetailManageInfo.rId,
                        communityId:vc.getCurrentCommunity().communityId
                    }
                };

                //发送get请求
                vc.http.apiGet('/roomRenovation/queryRoomRenovationDetail',
                    param,
                    function (json, res) {
                        var _roomRenovationDetailManageInfo = JSON.parse(json);
                        vc.component.roomRenovationDetailManageInfo.total = _roomRenovationDetailManageInfo.total;
                        vc.component.roomRenovationDetailManageInfo.records = _roomRenovationDetailManageInfo.records;
                        vc.component.roomRenovationDetailManageInfo.roomRenovationDetails = _roomRenovationDetailManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.roomRenovationDetailManageInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _getStateName:function(_state){
                if(_state == '1000'){
                    return '待装修';
                }else if(_state == '2000'){
                    return '待验收';
                }else if(_state == '3000'){
                    return '验收成功';
                }else if(_state == '4000'){
                    return '验收失败';
                }

                return "";

            },
            _openDecorationAcceptanceModel:function(_room){
                vc.emit('roomDecorationAcceptance', 'openRoomDecorationAcceptanceModal',_room);
            },
            _goBack: function () {
                vc.goBack();
            }
        }
    });
})(window.vc);
