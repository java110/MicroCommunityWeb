/**
    商品信息 组件
**/
(function(vc){

    vc.extends({
        propTypes: {
           callBackListener:vc.propTypes.string, //父组件名称
           callBackFunction:vc.propTypes.string //父组件监听方法
        },
        data:{
            viewProductInfo:{
                index:0,
                flowComponent:'viewProductInfo',
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
            //根据请求参数查询 查询 业主信息
            vc.component._loadProductInfoData();
        },
        _initEvent:function(){
            vc.on('viewProductInfo','chooseProduct',function(_app){
                vc.copyObject(_app, vc.component.viewProductInfo);
                vc.emit($props.callBackListener,$props.callBackFunction,vc.component.viewProductInfo);
            });

            vc.on('viewProductInfo', 'onIndex', function(_index){
                vc.component.viewProductInfo.index = _index;
            });

        },
        methods:{

            _openSelectProductInfoModel(){
                vc.emit('chooseProduct','openChooseProductModel',{});
            },
            _openAddProductInfoModel(){
                vc.emit('addProduct','openAddProductModal',{});
            },
            _loadProductInfoData:function(){

            }
        }
    });

})(window.vc);
