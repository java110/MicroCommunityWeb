(function(vc){

    vc.extends({
        propTypes: {
               callBackListener:vc.propTypes.string, //父组件名称
               callBackFunction:vc.propTypes.string //父组件监听方法
        },
        data:{
            addWechatSmsTemplateInfo:{
                templateId:'',
                templateType:'',
smsTemplateId:'',
remark:'',

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
            vc.on('addWechatSmsTemplate','openAddWechatSmsTemplateModal',function(){
                $('#addWechatSmsTemplateModel').modal('show');
            });
        },
        methods:{
            addWechatSmsTemplateValidate(){
                return vc.validate.validate({
                    addWechatSmsTemplateInfo:vc.component.addWechatSmsTemplateInfo
                },{
                    'addWechatSmsTemplateInfo.templateType':[
{
                            limit:"required",
                            param:"",
                            errInfo:"模板类型不能为空"
                        },
 {
                            limit:"num",
                            param:"",
                            errInfo:"模板格式错误"
                        },
                    ],
'addWechatSmsTemplateInfo.smsTemplateId':[
{
                            limit:"required",
                            param:"",
                            errInfo:"微信模板ID不能为空"
                        },
 {
                            limit:"maxLength",
                            param:"64",
                            errInfo:"微信模板ID太长"
                        },
                    ],
'addWechatSmsTemplateInfo.remark':[
 {
                            limit:"maxLength",
                            param:"500",
                            errInfo:"说明不能超过500位"
                        },
                    ],




                });
            },
            saveWechatSmsTemplateInfo:function(){
                if(!vc.component.addWechatSmsTemplateValidate()){
                    vc.toast(vc.validate.errInfo);

                    return ;
                }

                vc.component.addWechatSmsTemplateInfo.communityId = vc.getCurrentCommunity().communityId;
                //不提交数据将数据 回调给侦听处理
                if(vc.notNull($props.callBackListener)){
                    vc.emit($props.callBackListener,$props.callBackFunction,vc.component.addWechatSmsTemplateInfo);
                    $('#addWechatSmsTemplateModel').modal('hide');
                    return ;
                }

                vc.http.apiPost(
                    'wechatSmsTemplate.saveWechatSmsTemplate',
                    JSON.stringify(vc.component.addWechatSmsTemplateInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addWechatSmsTemplateModel').modal('hide');
                            vc.component.clearAddWechatSmsTemplateInfo();
                            vc.emit('wechatSmsTemplateManage','listWechatSmsTemplate',{});

                            return ;
                        }
                        vc.message(_json.msg);

                     },
                     function(errInfo,error){
                        console.log('请求失败处理');

                        vc.message(errInfo);

                     });
            },
            clearAddWechatSmsTemplateInfo:function(){
                vc.component.addWechatSmsTemplateInfo = {
                                            templateType:'',
smsTemplateId:'',
remark:'',

                                        };
            }
        }
    });

})(window.vc);
