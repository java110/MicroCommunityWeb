(function(vc,vm){

    vc.extends({
        data:{
            changeFeeTempConfigInfo:{
                configId:"",
                squarePrice:"",
                feeTypeCd:"",
                additionalAmount:""
            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
             vc.on('configFeeTempConfigInfo','openConfigParkingSpaceFeeModel',function(_params){
                vc.copyObject(_params, vc.component.changeFeeTempConfigInfo);
                $('#configFeeTempConfigInfoModel').modal('show');
            });
        },
        methods:{
            /**
                根据楼ID加载房屋
            **/

            changeFeeConfigValidate:function(){
                        return vc.validate.validate({
                            changeFeeTempConfigInfo:vc.component.changeFeeTempConfigInfo
                        },{
                            'changeFeeTempConfigInfo.squarePrice':[
                                {
                                    limit:"required",
                                    param:"",
                                    errInfo:"每小时单价不能为空"
                                },
                                {
                                    limit:"money",
                                    param:"",
                                    errInfo:"必须是金额，如300.00"
                                }
                            ],
                            'changeFeeTempConfigInfo.additionalAmount':[
                                {
                                    limit:"required",
                                    param:"",
                                    errInfo:"前两小时费用不能为空"
                                },
                                {
                                    limit:"money",
                                    param:"",
                                    errInfo:"必须是金额，如300.00"
                                },
                            ],


                        });
             },
            saveTempParkingSpaceConfigFee:function(){
                if(!vc.component.changeFeeConfigValidate()){
                    vc.toast(vc.validate.errInfo);
                    return ;
                }
                vc.component.changeFeeTempConfigInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.post(
                    'configParkingSpaceTempFee',
                    'change',
                    JSON.stringify(vc.component.changeFeeTempConfigInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        if(res.status == 200){
                            //关闭model
                            $('#configFeeTempConfigInfoModel').modal('hide');
                            vc.emit('viewParkingSpaceFeeConfig','loadParkingSpaceConfigFee',vc.component.changeFeeTempConfigInfo);
                            return ;
                        }
                        vc.toast(json);
                     },
                     function(errInfo,error){
                        console.log('请求失败处理');

                        vc.toast(errInfo);
                     });
            }
        }
    });

})(window.vc,window.vc.component);