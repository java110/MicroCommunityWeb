(function(vc,vm){

    vc.extends({
        data:{
            deleteReserveParamsInfo:{

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
             vc.on('deleteReserveParams','openDeleteReserveParamsModal',function(_params){

                vc.component.deleteReserveParamsInfo = _params;
                $('#deleteReserveParamsModel').modal('show');

            });
        },
        methods:{
            deleteReserveParams:function(){
                vc.component.deleteReserveParamsInfo.communityId=vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/reserve.deleteReserveParams',
                    JSON.stringify(vc.component.deleteReserveParamsInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteReserveParamsModel').modal('hide');
                            vc.emit('reserveParamsManage','listReserveParams',{});
                            return ;
                        }
                        vc.message(_json.msg);
                     },
                     function(errInfo,error){
                        console.log('请求失败处理');
                        vc.message(json);

                     });
            },
            closeDeleteReserveParamsModel:function(){
                $('#deleteReserveParamsModel').modal('hide');
            }
        }
    });

})(window.vc,window.vc.component);
