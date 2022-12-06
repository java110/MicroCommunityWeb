/**
    入驻小区
**/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            reserveServiceManageInfo: {
                reserveServices: [],
                catalogs:[],
                total: 0,
                records: 1,
                moreCondition: false,
                goodsId: '',
                conditions: {
                    goodsId: '',
                    goodsName: '',
                    type:'2002',
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

            vc.on('reserveServiceManage', 'listReserveService', function (_param) {
                vc.component._listReserveServices(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listReserveServices(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listReserveServices: function (_page, _rows) {

                vc.component.reserveServiceManageInfo.conditions.page = _page;
                vc.component.reserveServiceManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.reserveServiceManageInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/reserve.listReserveGoods',
                    param,
                    function (json, res) {
                        var _reserveServiceManageInfo = JSON.parse(json);
                        vc.component.reserveServiceManageInfo.total = _reserveServiceManageInfo.total;
                        vc.component.reserveServiceManageInfo.records = _reserveServiceManageInfo.records;
                        vc.component.reserveServiceManageInfo.reserveServices = _reserveServiceManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.reserveServiceManageInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddReserveServiceModal: function () {
                if(!$that.reserveServiceManageInfo.conditions.catalogId){
                    vc.toast('请先添加目录');
                    return ;
                }
                vc.jumpToPage('/#/pages/reserve/addReserveService?catalogId='+$that.reserveServiceManageInfo.conditions.catalogId);
            },
            _openEditReserveServiceModel: function (_reserveService) {
                vc.jumpToPage('/#/pages/reserve/editReserveService?goodsId='+_reserveService.goodsId);
            },
            _openDeleteReserveServiceModel: function (_reserveService) {
                vc.emit('deleteReserveDining', 'openDeleteReserveDiningModal', _reserveService);
            },
            _queryReserveServiceMethod: function () {
                vc.component._listReserveServices(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _moreCondition: function () {
                if (vc.component.reserveServiceManageInfo.moreCondition) {
                    vc.component.reserveServiceManageInfo.moreCondition = false;
                } else {
                    vc.component.reserveServiceManageInfo.moreCondition = true;
                }
            },
            _listReserveCatalogs: function () {
                let param = {
                    params: {
                        page:1,
                        row:100,
                        communityId:vc.getCurrentCommunity().communityId,
                        type:'2002'
                    }
                };

                //发送get请求
                vc.http.apiGet('/reserve.listReserveCatalog',
                    param,
                    function (json, res) {
                        let _reserveCatalogManageInfo = JSON.parse(json);
                        vc.component.reserveServiceManageInfo.catalogs = _reserveCatalogManageInfo.data;
                        if(_reserveCatalogManageInfo.data && _reserveCatalogManageInfo.data.length>0){
                            $that.swatchReserveCatalog(_reserveCatalogManageInfo.data[0]);
                        }
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            swatchReserveCatalog:function(_item){
                $that.reserveServiceManageInfo.conditions.catalogId = _item.catalogId;
                vc.component._listReserveServices(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _addCatalog:function(){
                vc.jumpToPage('/#/pages/reserve/reserveCatalogManage?tab=预约目录')
            }


        }
    });
})(window.vc);
