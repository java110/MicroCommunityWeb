(function(vc,vm){

    vc.extends({
        data:{
            deleteMarketPicInfo:{

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
             vc.on('deleteMarketPic','openDeleteMarketPicModal',function(_params){

                vc.component.deleteMarketPicInfo = _params;
                $('#deleteMarketPicModel').modal('show');

            });
        },
        methods:{
            deleteMarketPic:function(){
                vc.http.apiPost(
                    '/marketPic.deleteMarketPic',
                    JSON.stringify(vc.component.deleteMarketPicInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteMarketPicModel').modal('hide');
                            vc.emit('marketPicManage','listMarketPic',{});
                            return ;
                        }
                        vc.message(_json.msg);
                     },
                     function(errInfo,error){
                        console.log('请求失败处理');
                        vc.message(json);

                     });
            },
            closeDeleteMarketPicModel:function(){
                $('#deleteMarketPicModel').modal('hide');
            }
        }
    });

})(window.vc,window.vc.component);
