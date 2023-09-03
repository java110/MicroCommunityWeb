/**
    权限组
**/
(function(vc){

    vc.extends({
        data:{
            feeConfigInfo:{
                configId:"",
                squarePrice:"",
                additionalAmount:""
            }
        },
        _initMethod:function(){
                vc.component.loadPropertyConfigFee();
        },
        _initEvent:function(){
            vc.on('viewPropertyFeeConfig','loadPropertyConfigFee',function(){
                vc.component.loadPropertyConfigFee();
            });

        },
        methods:{

            openConfigPropertyFeeModel:function(){
                vc.emit('configPropertyFee','openConfigPropertyFeeModel',vc.component.feeConfigInfo);
            },
            loadPropertyConfigFee:function(){
                var param = {
                    params:{
                        communityId:vc.getCurrentCommunity().communityId,
                        configId:vc.component.feeConfigInfo.configId
                    }
                };
                vc.http.get(
                    'viewPropertyFeeConfig',
                    'loadData',
                     param,
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        if(res.status == 200){
                            //关闭model
                            vc.copyObject(JSON.parse(json), vc.component.feeConfigInfo);
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

})(window.vc);