(function(vc,vm){

    vc.extends({
        data:{
            deleteWorkTypeInfo:{

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
             vc.on('deleteWorkType','openDeleteWorkTypeModal',function(_params){

                $that.deleteWorkTypeInfo = _params;
                $('#deleteWorkTypeModel').modal('show');

            });
        },
        methods:{
            deleteWorkType:function(){
                $that.deleteWorkTypeInfo.communityId=vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/workType.deleteWorkType',
                    JSON.stringify($that.deleteWorkTypeInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteWorkTypeModel').modal('hide');
                            vc.emit('workType','listWorkType',{});
                            return ;
                        }
                        vc.toast(_json.msg);
                     },
                     function(errInfo,error){
                        console.log('请求失败处理');
                        vc.toast(json);

                     });
            },
            closeDeleteWorkTypeModel:function(){
                $('#deleteWorkTypeModel').modal('hide');
            }
        }
    });

})(window.vc,window.$that);
