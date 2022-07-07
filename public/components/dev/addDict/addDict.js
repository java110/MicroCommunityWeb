(function(vc){

    vc.extends({
        propTypes: {
               callBackListener:vc.propTypes.string, //父组件名称
               callBackFunction:vc.propTypes.string //父组件监听方法
        },
        data:{
            addDictInfo:{
                id:'',
                statusCd:'',
name:'',
description:'',
tableName:'',

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
            vc.on('addDict','openAddDictModal',function(){
                $('#addDictModel').modal('show');
            });
        },
        methods:{
            addDictValidate(){
                return vc.validate.validate({
                    addDictInfo:vc.component.addDictInfo
                },{
                    'addDictInfo.statusCd':[
{
                            limit:"required",
                            param:"",
                            errInfo:"值不能为空"
                        },
 {
                            limit:"maxLength",
                            param:"64",
                            errInfo:"值不能超过64"
                        },
                    ],
'addDictInfo.name':[
{
                            limit:"required",
                            param:"",
                            errInfo:"名称不能为空"
                        },
 {
                            limit:"maxLength",
                            param:"50",
                            errInfo:"名称不能超过50"
                        },
                    ],
'addDictInfo.description':[
{
                            limit:"required",
                            param:"",
                            errInfo:"描述不能为空"
                        },
 {
                            limit:"maxLength",
                            param:"200",
                            errInfo:"描述不能超过200"
                        },
                    ],
'addDictInfo.tableName':[
{
                            limit:"required",
                            param:"",
                            errInfo:"表字段说明不能为空"
                        },
 {
                            limit:"maxLength",
                            param:"50",
                            errInfo:"表字段说明不能超过50"
                        },
                    ],




                });
            },
            saveDictInfo:function(){
                if(!vc.component.addDictValidate()){
                    vc.toast(vc.validate.errInfo);

                    return ;
                }

                vc.component.addDictInfo.communityId = vc.getCurrentCommunity().communityId;
                //不提交数据将数据 回调给侦听处理
                if(vc.notNull($props.callBackListener)){
                    vc.emit($props.callBackListener,$props.callBackFunction,vc.component.addDictInfo);
                    $('#addDictModel').modal('hide');
                    return ;
                }

                vc.http.apiPost(
                    'dict.saveDict',
                    JSON.stringify(vc.component.addDictInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addDictModel').modal('hide');
                            vc.component.clearAddDictInfo();
                            vc.emit('dictManage','listDict',{});

                            return ;
                        }
                        vc.message(_json.msg);

                     },
                     function(errInfo,error){
                        console.log('请求失败处理');

                        vc.message(errInfo);

                     });
            },
            clearAddDictInfo:function(){
                vc.component.addDictInfo = {
                                            statusCd:'',
name:'',
description:'',
tableName:'',

                                        };
            }
        }
    });

})(window.vc);
