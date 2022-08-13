(function(vc){

    vc.extends({
        data:{
            addResourceEnterQuantityInfo:{
                enterQuantity:'',
                resName:'',
                resCode:'',
                price:'',
                stock:'',
                resId:'',
                applyOrderId:'',
                description:''
            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
            vc.on('addResourceQuantity','openAddResourceQuantityModal',function(_data){
                let data = _data._purchaseApply;
                vc.component.addResourceEnterQuantityInfo.stock = data.stock;
                vc.component.addResourceEnterQuantityInfo.price = data.price;
                vc.component.addResourceEnterQuantityInfo.resCode = data.resCode;
                vc.component.addResourceEnterQuantityInfo.resId = data.resId;
                vc.component.addResourceEnterQuantityInfo.resName = data.resName;
                vc.component.addResourceEnterQuantityInfo.description = data.description;
                $('#addResourceQuantityModel').modal('show');
            });
        },
        methods:{
            addValidate(){
                return vc.validate.validate({
                    addResourceEnterQuantityInfo:vc.component.addResourceEnterQuantityInfo
                },{
                    'addResourceEnterQuantityInfo.enterQuantity':[
                        {
                            limit:"required",
                            param:"",
                            errInfo:"数量不能为空"
                        }
                    ]
                });
            },
            saveResourceEnterQuantityInfo:function(){
                if(!vc.component.addValidate()){
                    vc.toast(vc.validate.errInfo);
                    return ;
                }
                vc.component.addResourceEnterQuantityInfo.stock = vc.component.addResourceEnterQuantityInfo.stock + vc.component.addResourceEnterQuantityInfo.enterQuantity
                vc.http.apiPost(
                    '/resourceStore.updateResourceStore',
                    JSON.stringify(vc.component.addResourceEnterQuantityInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        if(res.status == 200){
                            //关闭model
                            $('#addDemoModel').modal('hide');
                            vc.component.clearAddFloorInfo();
                            vc.emit('listDemo','listDemoData',{});

                            return ;
                        }
                        vc.component.addFloorInfo.errorInfo = json;

                     },
                     function(errInfo,error){
                        console.log('请求失败处理');

                        vc.component.addFloorInfo.errorInfo = errInfo;

                     });
            },
            clearAddFloorInfo:function(){
                vc.component.addResourceEnterQuantityInfo = {
                    enterQuantity:''
                };
            }
        }
    });

})(window.vc);