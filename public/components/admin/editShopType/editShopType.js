(function(vc,vm){

    vc.extends({
        data:{
            editShopTypeInfo:{
                shopTypeId:'',
shopTypeId:'',
typeName:'',
isShow:'',
isDefault:'',
seq:'',
remark:'',

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
             vc.on('editShopType','openEditShopTypeModal',function(_params){
                vc.component.refreshEditShopTypeInfo();
                $('#editShopTypeModel').modal('show');
                vc.copyObject(_params, vc.component.editShopTypeInfo );
                vc.component.editShopTypeInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods:{
            editShopTypeValidate:function(){
                        return vc.validate.validate({
                            editShopTypeInfo:vc.component.editShopTypeInfo
                        },{
'editShopTypeInfo.typeName':[
{
                            limit:"required",
                            param:"",
                            errInfo:"店铺类型不能为空"
                        },
 {
                            limit:"maxLength",
                            param:"30",
                            errInfo:"店铺类型太长"
                        },
                    ],
'editShopTypeInfo.isShow':[
{
                            limit:"required",
                            param:"",
                            errInfo:"是否展示不能为空"
                        },],
'editShopTypeInfo.isDefault':[
{
                            limit:"required",
                            param:"",
                            errInfo:"是否默认不能为空"
                        },],
'editShopTypeInfo.seq':[
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
'editShopTypeInfo.remark':[
 {
                            limit:"maxLength",
                            param:"120",
                            errInfo:"描述太长"
                        },
                    ],
'editShopTypeInfo.shopTypeId':[
{
                            limit:"required",
                            param:"",
                            errInfo:"店铺类型id不能为空"
                        }]

                        });
             },
            editShopType:function(){
                if(!vc.component.editShopTypeValidate()){
                    vc.toast(vc.validate.errInfo);
                    return ;
                }

                vc.http.apiPost(
                    '/shopType/updateShopType',
                    JSON.stringify(vc.component.editShopTypeInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editShopTypeModel').modal('hide');
                             vc.emit('shopTypeManage','listShopType',{});
                            return ;
                        }
                        vc.message(_json.msg);
                     },
                     function(errInfo,error){
                        console.log('请求失败处理');

                        vc.message(errInfo);
                     });
            },
            refreshEditShopTypeInfo:function(){
                vc.component.editShopTypeInfo= {
                  shopTypeId:'',
shopTypeId:'',
typeName:'',
isShow:'',
isDefault:'',
seq:'',
remark:'',

                }
            }
        }
    });

})(window.vc,window.vc.component);
