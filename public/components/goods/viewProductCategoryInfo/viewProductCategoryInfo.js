/**
    商品分类 组件
**/
(function(vc){

    vc.extends({
        propTypes: {
           callBackListener:vc.propTypes.string, //父组件名称
           callBackFunction:vc.propTypes.string //父组件监听方法
        },
        data:{
            viewProductCategoryInfo:{
                index:0,
                flowComponent:'viewProductCategoryInfo',
                categoryName:'',
seq:'',
isShow:'',

            }
        },
        _initMethod:function(){
            //根据请求参数查询 查询 业主信息
            vc.component._loadProductCategoryInfoData();
        },
        _initEvent:function(){
            vc.on('viewProductCategoryInfo','chooseProductCategory',function(_app){
                vc.copyObject(_app, vc.component.viewProductCategoryInfo);
                vc.emit($props.callBackListener,$props.callBackFunction,vc.component.viewProductCategoryInfo);
            });

            vc.on('viewProductCategoryInfo', 'onIndex', function(_index){
                vc.component.viewProductCategoryInfo.index = _index;
            });

        },
        methods:{

            _openSelectProductCategoryInfoModel(){
                vc.emit('chooseProductCategory','openChooseProductCategoryModel',{});
            },
            _openAddProductCategoryInfoModel(){
                vc.emit('addProductCategory','openAddProductCategoryModal',{});
            },
            _loadProductCategoryInfoData:function(){

            }
        }
    });

})(window.vc);
