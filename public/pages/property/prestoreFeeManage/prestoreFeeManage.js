/**
    入驻小区
**/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            roomUnits:[],
            prestoreFeeManageInfo: {
                rooms:[],
                prestoreFees: [],
                total: 0,
                records: 1,
                moreCondition: false,
                prestoreFeeId: '',
                // prestoreFeeType: '',
                // prestoreFeeAmount: '',
                // state:'',
                conditions: {

                    floorId:'',
                    floorName:'',
                    unitId:'',
                    roomNum:'',

                    prestoreFeeType: '',
                    prestoreFeeAmount: '',
                    state: '',
                    roomId: '',
                    communityId: vc.getCurrentCommunity().communityId,
                }
            }
        },
        _initMethod: function () {
            vc.component._listPrestoreFees(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {

            vc.on('prestoreFeeManage', 'listPrestoreFee', function (_param) {
                vc.component._listPrestoreFees(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listPrestoreFees(_currentPage, DEFAULT_ROWS);
            });
        },
        _openChooseFloorMethod:function(){
            alert("---");
            vc.emit('searchFloor','openSearchFloorModel',{});
        },
        methods: {
            _listPrestoreFees: function (_page, _rows) {

                vc.component.prestoreFeeManageInfo.conditions.page = _page;
                vc.component.prestoreFeeManageInfo.conditions.row = _rows;

                var param = {
                    params: vc.component.prestoreFeeManageInfo.conditions
                };

                console.log(param);

                //发送get请求
                vc.http.apiGet('/prestoreFee/queryPrestoreFee',
                    param,
                    function (json, res) {
                        var _prestoreFeeManageInfo = JSON.parse(json);
                        vc.component.prestoreFeeManageInfo.total = _prestoreFeeManageInfo.total;
                        vc.component.prestoreFeeManageInfo.records = _prestoreFeeManageInfo.records;
                        vc.component.prestoreFeeManageInfo.prestoreFees = _prestoreFeeManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.prestoreFeeManageInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddPrestoreFeeModal: function () {
                vc.emit('addPrestoreFee', 'openAddPrestoreFeeModal', {});
            },
            _openEditPrestoreFeeModel: function (_prestoreFee) {
                vc.emit('editPrestoreFee', 'openEditPrestoreFeeModal', _prestoreFee);
            },
            _openDeletePrestoreFeeModel: function (_prestoreFee) {
                vc.emit('deletePrestoreFee', 'openDeletePrestoreFeeModal', _prestoreFee);
            },
            _queryPrestoreFeeMethod: function () {
                vc.component._listPrestoreFees(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _moreCondition: function () {
                if (vc.component.prestoreFeeManageInfo.moreCondition) {
                    vc.component.prestoreFeeManageInfo.moreCondition = false;
                } else {
                    vc.component.prestoreFeeManageInfo.moreCondition = true;
                }
            }


        }
    });
})(window.vc);
