(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            supplierCouponInfo: {
                suppliers: [],
                curSupplier: {},
                supplierCoupons: [],
                total: 0,
                records: 1,
                moreCondition: false,
                couponId: '',
                conditions: {
                    name: '',
                    supplierId: '',
                    supplierName: '',
                    businessKey: '',
                    valuePrice: '',
                }
            },
        },
        _initMethod: function () {
            $that._listSuppliers();
        },
        _initEvent: function () {
            vc.on('supplierCoupon', 'listSupplierCoupon', function (_param) {
                vc.component._listSupplierCoupons(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listSupplierCoupons(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _switchSupplier: function (_supplier) {
                $that.supplierCouponInfo.curSupplier = _supplier;
                $that.supplierCouponInfo.conditions.supplierId = _supplier.supplierId;
                vc.component._listSupplierCoupons(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _listSuppliers: function (_page, _rows) {
                let param = {
                    params: {
                        page: 1,
                        row: 100
                    }
                };

                //发送get请求
                vc.http.apiGet('/supplier.listSupplier',
                    param,
                    function (json, res) {
                        let _supplierManageInfo = JSON.parse(json);
                        $that.supplierCouponInfo.suppliers = _supplierManageInfo.data;
                        if (_supplierManageInfo.data && _supplierManageInfo.data.length > 0) {
                            $that._switchSupplier(_supplierManageInfo.data[0])
                        }

                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _listSupplierCoupons:function(_page, _rows){

                vc.component.supplierCouponInfo.conditions.page = _page;
                vc.component.supplierCouponInfo.conditions.row = _rows;
                let param = {
                    params:vc.component.supplierCouponInfo.conditions
               };

               //发送get请求
               vc.http.apiGet('/supplierCoupon.listSupplierCoupon',
                             param,
                             function(json,res){
                                let _supplierCouponInfo=JSON.parse(json);
                                vc.component.supplierCouponInfo.total = _supplierCouponInfo.total;
                                vc.component.supplierCouponInfo.records = _supplierCouponInfo.records;
                                vc.component.supplierCouponInfo.supplierCoupons = _supplierCouponInfo.data;
                                vc.emit('pagination','init',{
                                     total:vc.component.supplierCouponInfo.records,
                                     currentPage:_page
                                 });
                             },function(errInfo,error){
                                console.log('请求失败处理');
                             }
                           );
            },
            _openAddSupplierCouponModal:function(){
                if(!$that.supplierCouponInfo.curSupplier.supplierId){
                    vc.toast('请先选择供应商');
                    return ;
                }
                vc.emit('addSupplierCoupon','openAddSupplierCouponModal',{
                    supplierId: $that.supplierCouponInfo.curSupplier.supplierId
                });
            },
            _openEditSupplierCouponModel:function(_supplierCoupon){
                vc.emit('editSupplierCoupon','openEditSupplierCouponModal',_supplierCoupon);
            },
            _openDeleteSupplierCouponModel:function(_supplierCoupon){
                vc.emit('deleteSupplierCoupon','openDeleteSupplierCouponModal',_supplierCoupon);
            },
            _querySupplierCouponMethod:function(){
                vc.component._listSupplierCoupons(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _moreCondition:function(){
                if(vc.component.supplierCouponInfo.moreCondition){
                    vc.component.supplierCouponInfo.moreCondition = false;
                }else{
                    vc.component.supplierCouponInfo.moreCondition = true;
                }
            }
        },
    });
})(window.vc);