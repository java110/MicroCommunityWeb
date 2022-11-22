(function(vc){

    vc.extends({
        propTypes: {
               callBackListener:vc.propTypes.string, //父组件名称
               callBackFunction:vc.propTypes.string //父组件监听方法
        },
        data:{
            addCouponRuleCppsInfo:{
                crcId:'',
                cppId:'',
quantity:'',

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
            vc.on('addCouponRuleCpps','openAddCouponRuleCppsModal',function(){
                $('#addCouponRuleCppsModel').modal('show');
            });
        },
        methods:{
            addCouponRuleCppsValidate(){
                return vc.validate.validate({
                    addCouponRuleCppsInfo:vc.component.addCouponRuleCppsInfo
                },{
                    'addCouponRuleCppsInfo.cppId':[
{
                            limit:"required",
                            param:"",
                            errInfo:"优惠券不能为空"
                        },
 {
                            limit:"maxLength",
                            param:"64",
                            errInfo:"优惠券不能超过64"
                        },
                    ],
'addCouponRuleCppsInfo.quantity':[
{
                            limit:"required",
                            param:"",
                            errInfo:"赠送数量不能为空"
                        },
 {
                            limit:"maxLength",
                            param:"30",
                            errInfo:"赠送数量不能超过30"
                        },
                    ],




                });
            },
            saveCouponRuleCppsInfo:function(){
                if(!vc.component.addCouponRuleCppsValidate()){
                    vc.toast(vc.validate.errInfo);

                    return ;
                }

                vc.component.addCouponRuleCppsInfo.communityId = vc.getCurrentCommunity().communityId;
                //不提交数据将数据 回调给侦听处理
                if(vc.notNull($props.callBackListener)){
                    vc.emit($props.callBackListener,$props.callBackFunction,vc.component.addCouponRuleCppsInfo);
                    $('#addCouponRuleCppsModel').modal('hide');
                    return ;
                }

                vc.http.apiPost(
                    'couponRuleCpps.saveCouponRuleCpps',
                    JSON.stringify(vc.component.addCouponRuleCppsInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addCouponRuleCppsModel').modal('hide');
                            vc.component.clearAddCouponRuleCppsInfo();
                            vc.emit('couponRuleCppsManage','listCouponRuleCpps',{});

                            return ;
                        }
                        vc.message(_json.msg);

                     },
                     function(errInfo,error){
                        console.log('请求失败处理');

                        vc.message(errInfo);

                     });
            },
            clearAddCouponRuleCppsInfo:function(){
                vc.component.addCouponRuleCppsInfo = {
                                            cppId:'',
quantity:'',

                                        };
            }
        }
    });

})(window.vc);
