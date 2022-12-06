/**
    入驻小区
**/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            reserveDiningManageInfo: {
                reserveDinings: [],
                catalogs:[],
                total: 0,
                records: 1,
                moreCondition: false,
                goodsId: '',
                conditions: {
                    goodsId: '',
                    goodsName: '',
                    type:'1001',
                    state: '',
                    catalogId:'',
                    communityId:vc.getCurrentCommunity().communityId
                }
            }
        },
        _initMethod: function () {
            $that._listReserveCatalogs();
        },
        _initEvent: function () {

            vc.on('reserveDiningManage', 'listReserveDining', function (_param) {
                vc.component._listReserveDinings(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listReserveDinings(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listReserveDinings: function (_page, _rows) {

                vc.component.reserveDiningManageInfo.conditions.page = _page;
                vc.component.reserveDiningManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.reserveDiningManageInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/reserve.listReserveGoods',
                    param,
                    function (json, res) {
                        var _reserveDiningManageInfo = JSON.parse(json);
                        vc.component.reserveDiningManageInfo.total = _reserveDiningManageInfo.total;
                        vc.component.reserveDiningManageInfo.records = _reserveDiningManageInfo.records;
                        vc.component.reserveDiningManageInfo.reserveDinings = _reserveDiningManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.reserveDiningManageInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddReserveDiningModal: function () {
                if(!$that.reserveDiningManageInfo.conditions.catalogId){
                    vc.toast('请先添加目录');
                    return ;
                }
                vc.jumpToPage('/#/pages/reserve/addReserveDining?catalogId='+$that.reserveDiningManageInfo.conditions.catalogId);
            },
            _openEditReserveDiningModel: function (_reserveDining) {
                vc.jumpToPage('/#/pages/reserve/editReserveDining?goodsId='+_reserveDining.goodsId);
            },
            _openDeleteReserveDiningModel: function (_reserveDining) {
                vc.emit('deleteReserveDining', 'openDeleteReserveDiningModal', _reserveDining);
            },
            _queryReserveDiningMethod: function () {
                vc.component._listReserveDinings(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _moreCondition: function () {
                if (vc.component.reserveDiningManageInfo.moreCondition) {
                    vc.component.reserveDiningManageInfo.moreCondition = false;
                } else {
                    vc.component.reserveDiningManageInfo.moreCondition = true;
                }
            },
            _listReserveCatalogs: function () {
                let param = {
                    params: {
                        page:1,
                        row:100,
                        communityId:vc.getCurrentCommunity().communityId,
                        type:'1001'
                    }
                };

                //发送get请求
                vc.http.apiGet('/reserve.listReserveCatalog',
                    param,
                    function (json, res) {
                        let _reserveCatalogManageInfo = JSON.parse(json);
                        vc.component.reserveDiningManageInfo.catalogs = _reserveCatalogManageInfo.data;
                        if(_reserveCatalogManageInfo.data && _reserveCatalogManageInfo.data.length>0){
                            $that.swatchReserveCatalog(_reserveCatalogManageInfo.data[0]);
                        }
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            swatchReserveCatalog:function(_item){
                $that.reserveDiningManageInfo.conditions.catalogId = _item.catalogId;
                vc.component._listReserveDinings(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _addCatalog:function(){
                vc.jumpToPage('/#/pages/reserve/reserveCatalogManage?tab=预约目录')
            }


        }
    });
})(window.vc);
