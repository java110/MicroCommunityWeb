(function(vc,vm){

    vc.extends({
        data:{
            deleteMarketSmsInfo:{

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
             vc.on('deleteMarketSms','openDeleteMarketSmsModal',function(_params){

                vc.component.deleteMarketSmsInfo = _params;
                $('#deleteMarketSmsModel').modal('show');

            });
        },
        methods:{
            deleteMarketSms:function(){
                vc.component.deleteMarketSmsInfo.communityId=vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    'marketSms.deleteMarketSms',
                    JSON.stringify(vc.component.deleteMarketSmsInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteMarketSmsModel').modal('hide');
                            vc.emit('marketSmsManage','listMarketSms',{});
                            return ;
                        }
                        vc.message(_json.msg);
                     },
                     function(errInfo,error){
                        console.log('请求失败处理');
                        vc.message(json);

                     });
            },
            closeDeleteMarketSmsModel:function(){
                $('#deleteMarketSmsModel').modal('hide');
            }
        }
    });

})(window.vc,window.vc.component);
