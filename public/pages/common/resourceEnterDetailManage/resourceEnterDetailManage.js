/**
 入驻小区
 **/
(function(vc){
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 1;
    vc.extends({
        data:{
            purchaseApplyDetailInfo:{
                    resourceNames:'',
                    state:'',
                    totalPrice:'',
                    applyOrderId:'',
                    description:'',
                    createTime:'',
                    userName:'',
                    stateName:'',
                    resOrderType:'',
                    purchaseApplyDetailVo:[]
            }
        },
        _initMethod:function(){
            vc.component._listPurchaseApply(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent:function(){
            vc.component.purchaseApplyDetailInfo.applyOrderId = vc.getParam('applyOrderId');
            vc.component.purchaseApplyDetailInfo.resOrderType = vc.getParam('resOrderType');
        },
        methods:{
            _listPurchaseApply:function(_page, _rows){
                var param = {
                    params:{
                        page:_page,
                        row:_rows,
                        applyOrderId:vc.component.purchaseApplyDetailInfo.applyOrderId,
                        resOrderType:vc.component.purchaseApplyDetailInfo.resOrderType,
                    }
                };

                //发送get请求
                vc.http.get('purchaseApplyManage',
                    'list',
                    param,
                    function(json,res){
                        var _purchaseApplyDetailInfo=JSON.parse(json);
                        var _purchaseApply = _purchaseApplyDetailInfo.purchaseApplys;
                        vc.component.purchaseApplyDetailInfo = _purchaseApply[0];
                    },function(errInfo,error){
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddResourceQuantityModel:function (_purchaseApply) {
                vc.emit('addResourceQuantity', 'openAddResourceQuantityModal', {_purchaseApply});
            }
        }
    });
})(window.vc);
