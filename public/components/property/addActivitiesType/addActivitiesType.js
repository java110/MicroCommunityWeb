(function(vc){

    vc.extends({
        propTypes: {
               callBackListener:vc.propTypes.string, //父组件名称
               callBackFunction:vc.propTypes.string //父组件监听方法
        },
        data:{
            addActivitiesTypeInfo:{
                typeCd:'',
                typeName:'',
typeDesc:'',
seq:'',
defalutShow:'',

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
            vc.on('addActivitiesType','openAddActivitiesTypeModal',function(){
                $('#addActivitiesTypeModel').modal('show');
            });
        },
        methods:{
            addActivitiesTypeValidate(){
                return vc.validate.validate({
                    addActivitiesTypeInfo:vc.component.addActivitiesTypeInfo
                },{
                    'addActivitiesTypeInfo.typeName':[
{
                            limit:"required",
                            param:"",
                            errInfo:"大类名称不能为空"
                        },
 {
                            limit:"maxLength",
                            param:"100",
                            errInfo:"大类名称超过100位"
                        },
                    ],
'addActivitiesTypeInfo.typeDesc':[
 {
                            limit:"maxLength",
                            param:"500",
                            errInfo:"描述超过500位"
                        },
                    ],
'addActivitiesTypeInfo.seq':[
{
                            limit:"required",
                            param:"",
                            errInfo:"显示序号不能为空"
                        },
 {
                            limit:"num",
                            param:"",
                            errInfo:"显示序号不是有效数字"
                        },
                    ],
'addActivitiesTypeInfo.defalutShow':[
{
                            limit:"required",
                            param:"",
                            errInfo:"是否显示不能为空"
                        },
 {
                            limit:"maxLength",
                            param:"2",
                            errInfo:"是否显示格式错误"
                        },
                    ],




                });
            },
            saveActivitiesTypeInfo:function(){
                if(!vc.component.addActivitiesTypeValidate()){
                    vc.toast(vc.validate.errInfo);

                    return ;
                }

                vc.component.addActivitiesTypeInfo.communityId = vc.getCurrentCommunity().communityId;
                //不提交数据将数据 回调给侦听处理
                if(vc.notNull($props.callBackListener)){
                    vc.emit($props.callBackListener,$props.callBackFunction,vc.component.addActivitiesTypeInfo);
                    $('#addActivitiesTypeModel').modal('hide');
                    return ;
                }

                vc.http.apiPost(
                    'activitiesType.saveActivitiesType',
                    JSON.stringify(vc.component.addActivitiesTypeInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addActivitiesTypeModel').modal('hide');
                            vc.component.clearAddActivitiesTypeInfo();
                            vc.emit('activitiesTypeManage','listActivitiesType',{});

                            return ;
                        }
                        vc.message(_json.msg);

                     },
                     function(errInfo,error){
                        console.log('请求失败处理');

                        vc.message(errInfo);

                     });
            },
            clearAddActivitiesTypeInfo:function(){
                vc.component.addActivitiesTypeInfo = {
                                            typeName:'',
typeDesc:'',
seq:'',
defalutShow:'',

                                        };
            }
        }
    });

})(window.vc);
