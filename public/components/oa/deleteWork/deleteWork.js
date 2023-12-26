(function(vc,vm){

    vc.extends({
        data:{
            deleteWorkInfo:{

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
             vc.on('deleteWork','openDeleteWorkModal',function(_params){

                $that.deleteWorkInfo = _params;
                $('#deleteWorkModel').modal('show');

            });
        },
        methods:{
            deleteWork:function(){
                $that.deleteWorkInfo.communityId=vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/work.deleteWorkPool',
                    JSON.stringify($that.deleteWorkInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteWorkModel').modal('hide');
                            vc.emit('startWork', 'listStartWork',{});
                            return ;
                        }
                        vc.toast(_json.msg);
                     },
                     function(errInfo,error){
                        console.log('请求失败处理');
                        vc.toast(json);

                     });
            },
            closeDeleteWorkModel:function(){
                $('#deleteWorkModel').modal('hide');
            }
        }
    });

})(window.vc,window.$that);
