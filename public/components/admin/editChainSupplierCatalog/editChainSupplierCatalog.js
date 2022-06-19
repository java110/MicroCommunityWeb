(function(vc,vm){

    vc.extends({
        data:{
            editChainSupplierCatalogInfo:{
                catalogId:'',
catalogName:'',
csId:'',
intfUrlParam:'',
seq:'',

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
             vc.on('editChainSupplierCatalog','openEditChainSupplierCatalogModal',function(_params){
                vc.component.refreshEditChainSupplierCatalogInfo();
                $('#editChainSupplierCatalogModel').modal('show');
                vc.copyObject(_params, vc.component.editChainSupplierCatalogInfo );
                vc.component.editChainSupplierCatalogInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods:{
            editChainSupplierCatalogValidate:function(){
                        return vc.validate.validate({
                            editChainSupplierCatalogInfo:vc.component.editChainSupplierCatalogInfo
                        },{
                            'editChainSupplierCatalogInfo.catalogName':[
{
                            limit:"required",
                            param:"",
                            errInfo:"分类名称不能为空"
                        },
 {
                            limit:"maxLength",
                            param:"30",
                            errInfo:"供应商分类名称不能超过32"
                        },
                    ],
'editChainSupplierCatalogInfo.csId':[
{
                            limit:"required",
                            param:"",
                            errInfo:"供应商ID不能为空"
                        },
 {
                            limit:"maxLength",
                            param:"32",
                            errInfo:"供应商ID不能为空"
                        },
                    ],
'editChainSupplierCatalogInfo.intfUrlParam':[
{
                            limit:"required",
                            param:"",
                            errInfo:"对端接口参数不能为空"
                        },
 {
                            limit:"maxLength",
                            param:"64",
                            errInfo:"对端接口参数不能为空"
                        },
                    ],
'editChainSupplierCatalogInfo.seq':[
{
                            limit:"required",
                            param:"",
                            errInfo:"排序不能为空"
                        },
 {
                            limit:"maxLength",
                            param:"10",
                            errInfo:"排序不能为空"
                        },
                    ],
'editChainSupplierCatalogInfo.catalogId':[
{
                            limit:"required",
                            param:"",
                            errInfo:"供应商分类ID不能为空"
                        }]

                        });
             },
            editChainSupplierCatalog:function(){
                if(!vc.component.editChainSupplierCatalogValidate()){
                    vc.toast(vc.validate.errInfo);
                    return ;
                }

                vc.http.apiPost(
                    'chainSupplierCatalog.updateChainSupplierCatalog',
                    JSON.stringify(vc.component.editChainSupplierCatalogInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editChainSupplierCatalogModel').modal('hide');
                             vc.emit('chainSupplierCatalogManage','listChainSupplierCatalog',{});
                            return ;
                        }
                        vc.message(_json.msg);
                     },
                     function(errInfo,error){
                        console.log('请求失败处理');

                        vc.message(errInfo);
                     });
            },
            refreshEditChainSupplierCatalogInfo:function(){
                vc.component.editChainSupplierCatalogInfo= {
                  catalogId:'',
catalogName:'',
csId:'',
intfUrlParam:'',
seq:'',

                }
            }
        }
    });

})(window.vc,window.vc.component);
