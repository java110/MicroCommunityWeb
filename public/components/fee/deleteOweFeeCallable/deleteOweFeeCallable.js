(function(vc,vm){

    vc.extends({
        data:{
            deleteOweFeeCallableInfo:{

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
             vc.on('deleteOweFeeCallable','openDeleteOweFeeCallableModal',function(_params){

                $that.deleteOweFeeCallableInfo = _params;
                $('#deleteOweFeeCallableModel').modal('show');

            });
        },
        methods:{
            deleteOweFeeCallable:function(){
                $that.deleteOweFeeCallableInfo.communityId=vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/oweFeeCallable.deleteOweFeeCallable',
                    JSON.stringify($that.deleteOweFeeCallableInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteOweFeeCallableModel').modal('hide');
                            vc.emit('oweFeeCallable', 'listOweFeeCallable', {});
                            vc.emit('simplifyCallable', 'listOwnerData', {});
                            return ;
                        }
                        vc.toast(_json.msg);
                     },
                     function(errInfo,error){
                        console.log('请求失败处理');
                        vc.toast(json);

                     });
            },
            closeDeleteOweFeeCallableModel:function(){
                $('#deleteOweFeeCallableModel').modal('hide');
            }
        }
    });

})(window.vc,window.$that);
