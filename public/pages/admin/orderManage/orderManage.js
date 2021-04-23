//订单查询
(function(vc){
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data:{
            orderManageInfo:{
                orderDataVos:[],
                total:0,
                records:1,
                orderDetail:false,
                conditions:{
                    oId:'',
                    extTransactionId:'',
                    orderTypeCd:'',
                    appId:'',
                }
            }
        },
        _initMethod:function(){
            vc.component._listOrders(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent:function(){
            vc.on('orderManage','goBack',function(_param){
                vc.component.orderManageInfo.orderDetail = false;
            });
             vc.on('pagination','page_event',function(_currentPage){
                vc.component._listOrders(_currentPage,DEFAULT_ROWS);
            });
        },
        methods:{
            _listOrders:function(_page, _rows){
                vc.component.orderManageInfo.conditions.page = _page;
                vc.component.orderManageInfo.conditions.row = _rows;
                var param = {
                    params:vc.component.orderManageInfo.conditions
               };
               //发送get请求
               vc.http.get('corderManage',
                            'list',
                             param,
                             function(json,res){
                                var _orderManageInfo=JSON.parse(json);
                                vc.component.orderManageInfo.total = _orderManageInfo.total;
                                vc.component.orderManageInfo.records = _orderManageInfo.records;
                                vc.component.orderManageInfo.orderDataVos = _orderManageInfo.corderDataVos;
                                vc.component.orderManageInfo.orderDataVos.map(item=>{
                                    item.requestTime=item.requestTime.substring(0,4)+"-"+item.requestTime.substring(4,6)+"-"+item.requestTime.substring(6,8)+"  "+item.requestTime.substring(8,10)+":"+item.requestTime.substring(10,12)+":"+item.requestTime.substring(12,14)
                                })
                                vc.emit('pagination','init',{
                                     total:vc.component.orderManageInfo.records,
                                     currentPage:_page
                                 });
                             },function(errInfo,error){
                                console.log('请求失败处理');
                             }
                           );
            },
            _queryOrdersMethod:function(){
                vc.component._listOrders(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _openOrderDetailModel:function(_order){
                vc.component.orderManageInfo.orderDetail = true;
                vc.emit('orderDetailManage','listOrderDetails',_order.cBusiness);
            }
        }
    });
})(window.vc);
