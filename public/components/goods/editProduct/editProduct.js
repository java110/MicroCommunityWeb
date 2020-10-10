(function(vc,vm){

    vc.extends({
        data:{
            editProductInfo:{
                productId:'',
categoryId:'',
prodName:'',
prodDesc:'',
keyword:'',
barCode:'',
unitName:'',
sort:'',
isPostage:'',
postage:'',

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
             vc.on('editProduct','openEditProductModal',function(_params){
                vc.component.refreshEditProductInfo();
                $('#editProductModel').modal('show');
                vc.copyObject(_params, vc.component.editProductInfo );
                vc.component.editProductInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods:{
            editProductValidate:function(){
                        return vc.validate.validate({
                            editProductInfo:vc.component.editProductInfo
                        },{
                            'editProductInfo.categoryId':[
{
                            limit:"required",
                            param:"",
                            errInfo:"商品大类不能为空"
                        },
 {
                            limit:"num",
                            param:"",
                            errInfo:"商品大类错误"
                        },
                    ],
'editProductInfo.prodName':[
{
                            limit:"required",
                            param:"",
                            errInfo:"商品名称不能为空"
                        },
 {
                            limit:"maxLength",
                            param:"128",
                            errInfo:"商品名称不能超过128位"
                        },
                    ],
'editProductInfo.prodDesc':[
{
                            limit:"required",
                            param:"",
                            errInfo:"商品简介不能为空"
                        },
 {
                            limit:"maxLength",
                            param:"256",
                            errInfo:"商品简介不能超过256位"
                        },
                    ],
'editProductInfo.keyword':[
{
                            limit:"required",
                            param:"",
                            errInfo:"关键词不能为空"
                        },
 {
                            limit:"maxLength",
                            param:"256",
                            errInfo:"关键词不能超过256位"
                        },
                    ],
'editProductInfo.barCode':[
 {
                            limit:"maxLength",
                            param:"15",
                            errInfo:"产品条码不能超过15位"
                        },
                    ],
'editProductInfo.unitName':[
 {
                            limit:"maxLength",
                            param:"32",
                            errInfo:"单位不能超过32位"
                        },
                    ],
'editProductInfo.sort':[
 {
                            limit:"num",
                            param:"",
                            errInfo:"排序格式错误"
                        },
                    ],
'editProductInfo.isPostage':[
 {
                            limit:"num",
                            param:"",
                            errInfo:"是否包邮格式错误"
                        },
                    ],
'editProductInfo.postage':[
 {
                            limit:"money",
                            param:"",
                            errInfo:"邮费格式错误,请填写如 3.00"
                        },
                    ],
'editProductInfo.productId':[
{
                            limit:"required",
                            param:"",
                            errInfo:"商品ID不能为空"
                        }]

                        });
             },
            editProduct:function(){
                if(!vc.component.editProductValidate()){
                    vc.toast(vc.validate.errInfo);
                    return ;
                }

                vc.http.apiPost(
                    'product.updateProduct',
                    JSON.stringify(vc.component.editProductInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editProductModel').modal('hide');
                             vc.emit('productManage','listProduct',{});
                            return ;
                        }
                        vc.message(_json.msg);
                     },
                     function(errInfo,error){
                        console.log('请求失败处理');

                        vc.message(errInfo);
                     });
            },
            refreshEditProductInfo:function(){
                vc.component.editProductInfo= {
                  productId:'',
categoryId:'',
prodName:'',
prodDesc:'',
keyword:'',
barCode:'',
unitName:'',
sort:'',
isPostage:'',
postage:'',

                }
            }
        }
    });

})(window.vc,window.vc.component);
