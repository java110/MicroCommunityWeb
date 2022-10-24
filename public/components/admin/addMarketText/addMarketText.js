(function(vc){

    vc.extends({
        propTypes: {
               callBackListener:vc.propTypes.string, //父组件名称
               callBackFunction:vc.propTypes.string //父组件监听方法
        },
        data:{
            addMarketTextInfo:{
                textId:'',
                name:'',
sendRate:'',
textContent:'',

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
            vc.on('addMarketText','openAddMarketTextModal',function(){
                $('#addMarketTextModel').modal('show');
            });
        },
        methods:{
            addMarketTextValidate(){
                return vc.validate.validate({
                    addMarketTextInfo:vc.component.addMarketTextInfo
                },{
                    'addMarketTextInfo.name':[
{
                            limit:"required",
                            param:"",
                            errInfo:"名称不能为空"
                        },
 {
                            limit:"maxLength",
                            param:"64",
                            errInfo:"名称不能超过64"
                        },
                    ],
'addMarketTextInfo.sendRate':[
{
                            limit:"required",
                            param:"",
                            errInfo:"发送频率不能为空"
                        },
 {
                            limit:"maxLength",
                            param:"30",
                            errInfo:"发送频率不能超过30"
                        },
                    ],
'addMarketTextInfo.textContent':[
{
                            limit:"required",
                            param:"",
                            errInfo:"备注'不能为空"
                        },
 {
                            limit:"maxLength",
                            param:"512",
                            errInfo:"备注'不能超过512"
                        },
                    ],




                });
            },
            saveMarketTextInfo:function(){
                if(!vc.component.addMarketTextValidate()){
                    vc.toast(vc.validate.errInfo);

                    return ;
                }

                vc.component.addMarketTextInfo.communityId = vc.getCurrentCommunity().communityId;
                //不提交数据将数据 回调给侦听处理
                if(vc.notNull($props.callBackListener)){
                    vc.emit($props.callBackListener,$props.callBackFunction,vc.component.addMarketTextInfo);
                    $('#addMarketTextModel').modal('hide');
                    return ;
                }

                vc.http.apiPost(
                    'marketText.saveMarketText',
                    JSON.stringify(vc.component.addMarketTextInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addMarketTextModel').modal('hide');
                            vc.component.clearAddMarketTextInfo();
                            vc.emit('marketTextManage','listMarketText',{});

                            return ;
                        }
                        vc.message(_json.msg);

                     },
                     function(errInfo,error){
                        console.log('请求失败处理');

                        vc.message(errInfo);

                     });
            },
            clearAddMarketTextInfo:function(){
                vc.component.addMarketTextInfo = {
                                            name:'',
sendRate:'',
textContent:'',

                                        };
            }
        }
    });

})(window.vc);
