/**
    入驻小区
**/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            reserveParamsManageInfo: {
                reserveParamss: [],
                total: 0,
                records: 1,
                moreCondition: false,
                paramsId: '',
                conditions: {
                    name: '',
                    startTime: '',
                    hoursMaxQuantity: '',
                    communityId:vc.getCurrentCommunity().communityId,
                }
            }
        },
        _initMethod: function () {
            vc.component._listReserveParamss(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {

            vc.on('reserveParamsManage', 'listReserveParams', function (_param) {
                vc.component._listReserveParamss(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listReserveParamss(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listReserveParamss: function (_page, _rows) {

                vc.component.reserveParamsManageInfo.conditions.page = _page;
                vc.component.reserveParamsManageInfo.conditions.row = _rows;
                let param = {
                    params: vc.component.reserveParamsManageInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/reserve.listReserveParams',
                    param,
                    function (json, res) {
                        var _reserveParamsManageInfo = JSON.parse(json);
                        vc.component.reserveParamsManageInfo.total = _reserveParamsManageInfo.total;
                        vc.component.reserveParamsManageInfo.records = _reserveParamsManageInfo.records;
                        vc.component.reserveParamsManageInfo.reserveParamss = _reserveParamsManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.reserveParamsManageInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddReserveParamsModal: function () {
                vc.emit('addReserveParams', 'openAddReserveParamsModal', {});
            },
            _openEditReserveParamsModel: function (_reserveParams) {
                vc.emit('editReserveParams', 'openEditReserveParamsModal', _reserveParams);
            },
            _openSettingReserveParamsOpenTimeModel:function(_reserveParams){
                vc.emit('editReserveParamsOpenTime', 'openEditReserveParamsModal', _reserveParams);
            },
            _openDeleteReserveParamsModel: function (_reserveParams) {
                vc.emit('deleteReserveParams', 'openDeleteReserveParamsModal', _reserveParams);
            },
            _queryReserveParamsMethod: function () {
                vc.component._listReserveParamss(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _moreCondition: function () {
                if (vc.component.reserveParamsManageInfo.moreCondition) {
                    vc.component.reserveParamsManageInfo.moreCondition = false;
                } else {
                    vc.component.reserveParamsManageInfo.moreCondition = true;
                }
            }


        }
    });
})(window.vc);
