(function(vc,vm){

    vc.extends({
        data:{
            deleteRentingPoolInfo:{

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
             vc.on('deleteRentingPool','openDeleteRentingPoolModal',function(_params){

                vc.component.deleteRentingPoolInfo = _params;
                $('#deleteRentingPoolModel').modal('show');

            });
        },
        methods:{
            deleteRentingPool:function(){
                vc.component.deleteRentingPoolInfo.communityId=vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/renting/deleteRentingPool',
                    JSON.stringify(vc.component.deleteRentingPoolInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteRentingPoolModel').modal('hide');
                            vc.emit('rentingPoolManage','listRentingPool',{});
                            return ;
                        }
                        vc.message(_json.msg);
                     },
                     function(errInfo,error){
                        console.log('请求失败处理');
                        vc.message(json);

                     });
            },
            closeDeleteRentingPoolModel:function(){
                $('#deleteRentingPoolModel').modal('hide');
            }
        }
    });

})(window.vc,window.vc.component);
