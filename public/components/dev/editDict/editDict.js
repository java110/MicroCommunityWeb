(function(vc,vm){

    vc.extends({
        data:{
            editDictInfo:{
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
             vc.on('editDict','openEditDictModal',function(_params){
                vc.component.refreshEditDictInfo();
                $('#editDictModel').modal('show');
                vc.copyObject(_params, vc.component.editDictInfo );
                vc.component.editDictInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods:{
            editDictValidate:function(){
                        return vc.validate.validate({
                            editDictInfo:vc.component.editDictInfo
                        },{
                            'editDictInfo.statusCd':[
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
'editDictInfo.name':[
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
'editDictInfo.description':[
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
'editDictInfo.tableName':[
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
'editDictInfo.id':[
{
                            limit:"required",
                            param:"",
                            errInfo:"id不能为空"
                        }]

                        });
             },
            editDict:function(){
                if(!vc.component.editDictValidate()){
                    vc.toast(vc.validate.errInfo);
                    return ;
                }

                vc.http.apiPost(
                    'dict.updateDict',
                    JSON.stringify(vc.component.editDictInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editDictModel').modal('hide');
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
            refreshEditDictInfo:function(){
                vc.component.editDictInfo= {
                  id:'',
statusCd:'',
name:'',
description:'',
tableName:'',

                }
            }
        }
    });

})(window.vc,window.vc.component);
