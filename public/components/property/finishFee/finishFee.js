(function(vc,vm){

    vc.extends({
        data:{
            finishFeeInfo:{

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
             vc.on('finishFee','openFinishFeeModal',function(_params){

                vc.component.finishFeeInfo = _params;
                $('#finishFeeModel').modal('show');

            });
        },
        methods:{
            finishFee:function(){
                vc.component.finishFeeInfo.communityId=vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    'fee.finishFee',
                    JSON.stringify(vc.component.finishFeeInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        if(res.status == 200){
                            //关闭model
                            $('#finishFeeModel').modal('hide');
                            vc.emit('listRoomFee','notify',{});
                            vc.emit('listParkingSpaceFee','notify',{});
                            vc.emit('simplifyRoomFee', 'notify',{});
                            vc.emit('simplifyCarFee', 'notify',{});
                            vc.toast("结束费用成功");
                            return ;
                        }
                        vc.toast(json);
                     },
                     function(errInfo,error){
                        console.log('请求失败处理');
                        vc.toast(json);
                     });
            },
            closeFinishFeeModel:function(){
                $('#finishFeeModel').modal('hide');
            }
        }
    });

})(window.vc,window.vc.component);
