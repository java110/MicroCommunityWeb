/**
 入驻小区
 **/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            roomStructureInfo: {
                rooms: [],

            }
        },
        _initMethod: function() {

        },
        _initEvent: function() {

            vc.on('roomStructure', 'switchUnit', function(_param) {
                $that._loadRooms(_param.unitId)
            });

        },
        methods: {

            _loadRooms: function(_unitId) {
                let param = {
                    params: {
                        page: 1,
                        row: 100,
                        unitId: _unitId,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                }
                vc.http.apiGet('/room.listRoomStructure',
                    param,
                    function(json, res) {
                        let listRoomData = JSON.parse(json);
                        $that.roomStructureInfo.rooms = listRoomData.data;
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _getBgColor: function(room) {
                if (!room.ownerName) {
                    return "#1AB394";
                }
                if (room.oweAmount > 0) {
                    return "#DC3545";
                }
                return "#1296db"
            },
            _toSimplifyAcceptance: function(_room) {
                let _date = new Date();
                vc.saveData("JAVA110_IS_BACK", _date.getTime());
                vc.saveData('simplifyAcceptanceSearch', {
                    searchType: '1',
                    searchValue: _room.floorNum + "-" + _room.unitNum + "-" + _room.roomNum,
                    searchPlaceholder: '请输入房屋编号 楼栋-单元-房屋 如1-1-1',
                })

                vc.jumpToPage('/#/pages/property/simplifyAcceptance?tab=业务受理');

            }

        }
    });
})(window.vc);