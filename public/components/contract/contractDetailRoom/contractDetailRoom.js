/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            contractDetailRoomInfo: {
                rooms: [],
                contractId: '',
                roomNum: '',
                totalArea: '0'
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('contractDetailRoom', 'switch', function (_data) {
                $that.contractDetailRoomInfo.contractId = _data.contractId;
                $that._loadContractDetailRoomData(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('contractDetailRoom', 'paginationPlus', 'page_event',
                function (_currentPage) {
                    vc.component._loadContractDetailRoomData(_currentPage, DEFAULT_ROWS);
                });
            vc.on('contractDetailRoom', 'notify', function (_data) {
                $that._loadContractDetailRoomData(DEFAULT_PAGE, DEFAULT_ROWS);
            })
        },
        methods: {
            _loadContractDetailRoomData: function (_page, _row) {
                let param = {
                    params: {
                        contractId: $that.contractDetailRoomInfo.contractId,
                        page: 1,
                        row: 100
                    }
                }
                //发送get请求
                vc.http.apiGet('/contract/queryContractRoom',
                    param,
                    function (json, res) {
                        var _contractTFile = JSON.parse(json);
                        $that.contractDetailRoomInfo.rooms = _contractTFile.data;
                        $that._sumRoomArea();
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            //查询
            _qureyContractDetailRoom: function () {
                $that._loadContractDetailRoomData(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _toSimplifyAcceptance: function (_room) {
                let _date = new Date();
                vc.saveData("JAVA110_IS_BACK", _date.getTime());
                vc.saveData('simplifyAcceptanceSearch', {
                    searchType: '1',
                    searchValue: _room.floorNum + "-" + _room.unitNum + "-" + _room.roomNum,
                    searchPlaceholder: '请输入房屋编号 楼栋-单元-房屋 如1-1-1',
                })
                vc.jumpToPage('/#/pages/property/simplifyAcceptance?tab=业务受理');
            },
            _sumRoomArea:function(){

                if(!$that){
                    return;
                }

                let _rooms = $that.contractDetailRoomInfo.rooms;
                if(!_rooms || _rooms.length<1){
                    $that.contractDetailRoomInfo.totalArea = '0';
                    return 0;
                }

                let _totalArea = 0;

                _rooms.forEach(_room => {
                    _totalArea += parseFloat(_room.builtUpArea)
                });
                $that.contractDetailRoomInfo.totalArea = _totalArea.toFixed(2);

                return _totalArea.toFixed(2);
            },
            _openAddContractRoom:function(){
                vc.jumpToPage('/#/pages/admin/contractChangeDetail?param=contractChangeAssets');
            }
            
        }
    });
})(window.vc);