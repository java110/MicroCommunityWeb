(function(vc,vm){

    vc.extends({
        data:{
            deleteMarketTextInfo:{

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
             vc.on('deleteMarketText','openDeleteMarketTextModal',function(_params){

                vc.component.deleteMarketTextInfo = _params;
                $('#deleteMarketTextModel').modal('show');

            });
        },
        methods:{
            deleteMarketText:function(){
                vc.http.apiPost(
                    '/marketText.deleteMarketText',
                    JSON.stringify(vc.component.deleteMarketTextInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteMarketTextModel').modal('hide');
                            vc.emit('marketTextManage','listMarketText',{});
                            return ;
                        }
                        vc.message(_json.msg);
                     },
                     function(errInfo,error){
                        console.log('请求失败处理');
                        vc.message(json);

                     });
            },
            closeDeleteMarketTextModel:function(){
                $('#deleteMarketTextModel').modal('hide');
            }
        }
    });

})(window.vc,window.vc.component);
