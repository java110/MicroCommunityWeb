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
                applyOrderId:''
            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
            vc.on('addResourceQuantity','openAddResourceQuantityModal',function(_data){
                console.log("收到传参："+JSON.stringify(_data._purchaseApply));
                vc.component.addResourceEnterQuantityInfo.stock = _data.stock;
                vc.component.addResourceEnterQuantityInfo.price = _data.price;
                vc.component.addResourceEnterQuantityInfo.resCode = _data.resCode;
                vc.component.addResourceEnterQuantityInfo.resId = _data.resId;
                vc.component.addResourceEnterQuantityInfo.resName = _data.resName;
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
                vc.http.post(
                    'editResourceStore',
                    'update',
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