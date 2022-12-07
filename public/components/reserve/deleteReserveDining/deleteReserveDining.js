(function(vc,vm){

    vc.extends({
        data:{
            deleteReserveDiningInfo:{

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
             vc.on('deleteReserveDining','openDeleteReserveDiningModal',function(_params){

                vc.component.deleteReserveDiningInfo = _params;
                $('#deleteReserveDiningModel').modal('show');

            });
        },
        methods:{
            deleteReserveDining:function(){
                vc.component.deleteReserveDiningInfo.communityId=vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/reserve.deleteReserveGoods',
                    JSON.stringify(vc.component.deleteReserveDiningInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteReserveDiningModel').modal('hide');
                            vc.emit('reserveDiningManage','listReserveDining',{});
                            vc.emit('reserveServiceManage', 'listReserveService',{});
                            
                            return ;
                        }
                        vc.message(_json.msg);
                     },
                     function(errInfo,error){
                        console.log('请求失败处理');
                        vc.message(json);

                     });
            },
            closeDeleteReserveDiningModel:function(){
                $('#deleteReserveDiningModel').modal('hide');
            }
        }
    });

})(window.vc,window.vc.component);
