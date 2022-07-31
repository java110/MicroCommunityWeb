(function(vc,vm){

    vc.extends({
        data:{
            deleteFeeComboMemberInfo:{

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
             vc.on('deleteFeeComboMember','openDeleteFeeComboMemberModal',function(_params){
                vc.component.deleteFeeComboMemberInfo = _params;
                $('#deleteFeeComboMemberModel').modal('show');
            });
        },
        methods:{
            deleteFeeComboMember:function(){
                vc.component.deleteFeeComboMemberInfo.communityId=vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/feeComboMember.deleteFeeComboMember',
                    JSON.stringify(vc.component.deleteFeeComboMemberInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteFeeComboMemberModel').modal('hide');
                            vc.emit('feeComboMemberManage', 'listFeeComboMember',{});
                            return ;
                        }
                        vc.message(_json.msg);
                     },
                     function(errInfo,error){
                        console.log('请求失败处理');
                        vc.message(json);

                     });
            },
            closeDeleteFeeComboModel:function(){
                $('#deleteFeeComboMemberModel').modal('hide');
            }
        }
    });

})(window.vc,window.vc.component);
