/**
    商品规格 组件
**/
(function(vc){

    vc.extends({
        propTypes: {
           callBackListener:vc.propTypes.string, //父组件名称
           callBackFunction:vc.propTypes.string //父组件监听方法
        },
        data:{
            viewProductSpecInfo:{
                index:0,
                flowComponent:'viewProductSpecInfo',
                specName:'',

            }
        },
        _initMethod:function(){
            //根据请求参数查询 查询 业主信息
            vc.component._loadProductSpecInfoData();
        },
        _initEvent:function(){
            vc.on('viewProductSpecInfo','chooseProductSpec',function(_app){
                vc.copyObject(_app, vc.component.viewProductSpecInfo);
                vc.emit($props.callBackListener,$props.callBackFunction,vc.component.viewProductSpecInfo);
            });

            vc.on('viewProductSpecInfo', 'onIndex', function(_index){
                vc.component.viewProductSpecInfo.index = _index;
            });

        },
        methods:{

            _openSelectProductSpecInfoModel(){
                vc.emit('chooseProductSpec','openChooseProductSpecModel',{});
            },
            _openAddProductSpecInfoModel(){
                vc.emit('addProductSpec','openAddProductSpecModal',{});
            },
            _loadProductSpecInfoData:function(){

            }
        }
    });

})(window.vc);
