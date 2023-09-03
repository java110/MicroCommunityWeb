/**
    店铺类型 组件
**/
(function(vc){

    vc.extends({
        propTypes: {
           callBackListener:vc.propTypes.string, //父组件名称
           callBackFunction:vc.propTypes.string //父组件监听方法
        },
        data:{
            viewShopTypeInfo:{
                index:0,
                flowComponent:'viewShopTypeInfo',
                shopTypeId:'',
typeName:'',
isShow:'',
isDefault:'',
seq:'',
remark:'',

            }
        },
        _initMethod:function(){
            //根据请求参数查询 查询 业主信息
            vc.component._loadShopTypeInfoData();
        },
        _initEvent:function(){
            vc.on('viewShopTypeInfo','chooseShopType',function(_app){
                vc.copyObject(_app, vc.component.viewShopTypeInfo);
                vc.emit($props.callBackListener,$props.callBackFunction,vc.component.viewShopTypeInfo);
            });

            vc.on('viewShopTypeInfo', 'onIndex', function(_index){
                vc.component.viewShopTypeInfo.index = _index;
            });

        },
        methods:{

            _openSelectShopTypeInfoModel(){
                vc.emit('chooseShopType','openChooseShopTypeModel',{});
            },
            _openAddShopTypeInfoModel(){
                vc.emit('addShopType','openAddShopTypeModal',{});
            },
            _loadShopTypeInfoData:function(){

            }
        }
    });

})(window.vc);
