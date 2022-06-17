(function(vc){

    vc.extends({
        propTypes: {
               callBackListener:vc.propTypes.string, //父组件名称
               callBackFunction:vc.propTypes.string //父组件监听方法
        },
        data:{
            addChainSupplierInfo:{
                csId:'',
                name:'',
appId:'',
appSecure:'',
mchId:'',
mchKey:'',
url:'',
remark:'',

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
            vc.on('addChainSupplier','openAddChainSupplierModal',function(){
                $('#addChainSupplierModel').modal('show');
            });
        },
        methods:{
            addChainSupplierValidate(){
                return vc.validate.validate({
                    addChainSupplierInfo:vc.component.addChainSupplierInfo
                },{
                    'addChainSupplierInfo.name':[
{
                            limit:"required",
                            param:"",
                            errInfo:"供应商名称不能为空"
                        },
 {
                            limit:"maxLength",
                            param:"30",
                            errInfo:"供应商名称不能超过30"
                        },
                    ],
'addChainSupplierInfo.appId':[
{
                            limit:"required",
                            param:"",
                            errInfo:"接口应用ID不能为空"
                        },
 {
                            limit:"maxLength",
                            param:"32",
                            errInfo:"接口应用ID不能为空"
                        },
                    ],
'addChainSupplierInfo.appSecure':[
{
                            limit:"required",
                            param:"",
                            errInfo:"接口秘钥不能为空"
                        },
 {
                            limit:"maxLength",
                            param:"128",
                            errInfo:"接口秘钥不能为空"
                        },
                    ],
'addChainSupplierInfo.mchId':[
{
                            limit:"required",
                            param:"",
                            errInfo:"商户ID不能为空"
                        },
 {
                            limit:"maxLength",
                            param:"32",
                            errInfo:"商户ID不能为空"
                        },
                    ],
'addChainSupplierInfo.mchKey':[
{
                            limit:"required",
                            param:"",
                            errInfo:"秘钥不能为空"
                        },
 {
                            limit:"maxLength",
                            param:"128",
                            errInfo:"秘钥不能为空"
                        },
                    ],
'addChainSupplierInfo.url':[
{
                            limit:"required",
                            param:"",
                            errInfo:"接口地址不能为空"
                        },
 {
                            limit:"maxLength",
                            param:"128",
                            errInfo:"接口地址不能为空"
                        },
                    ],
'addChainSupplierInfo.remark':[
{
                            limit:"required",
                            param:"",
                            errInfo:"备注不能为空"
                        },
 {
                            limit:"maxLength",
                            param:"200",
                            errInfo:"描述不能为空"
                        },
                    ],




                });
            },
            saveChainSupplierInfo:function(){
                if(!vc.component.addChainSupplierValidate()){
                    vc.toast(vc.validate.errInfo);

                    return ;
                }

                vc.component.addChainSupplierInfo.communityId = vc.getCurrentCommunity().communityId;
                //不提交数据将数据 回调给侦听处理
                if(vc.notNull($props.callBackListener)){
                    vc.emit($props.callBackListener,$props.callBackFunction,vc.component.addChainSupplierInfo);
                    $('#addChainSupplierModel').modal('hide');
                    return ;
                }

                vc.http.apiPost(
                    'chainSupplier.saveChainSupplier',
                    JSON.stringify(vc.component.addChainSupplierInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addChainSupplierModel').modal('hide');
                            vc.component.clearAddChainSupplierInfo();
                            vc.emit('chainSupplierManage','listChainSupplier',{});

                            return ;
                        }
                        vc.message(_json.msg);

                     },
                     function(errInfo,error){
                        console.log('请求失败处理');

                        vc.message(errInfo);

                     });
            },
            clearAddChainSupplierInfo:function(){
                vc.component.addChainSupplierInfo = {
                                            name:'',
appId:'',
appSecure:'',
mchId:'',
mchKey:'',
url:'',
remark:'',

                                        };
            }
        }
    });

})(window.vc);
