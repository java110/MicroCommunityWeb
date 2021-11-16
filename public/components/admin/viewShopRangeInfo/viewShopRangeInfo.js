/**
    经营范围 组件
**/
(function(vc){

    vc.extends({
        propTypes: {
           callBackListener:vc.propTypes.string, //父组件名称
           callBackFunction:vc.propTypes.string //父组件监听方法
        },
        data:{
            viewShopRangeInfo:{
                index:0,
                flowComponent:'viewShopRangeInfo',
                shopRangeId:'',
shopTypeId:'',
rangeName:'',
isShow:'',
isDefault:'',
seq:'',
remark:'',

            }
        },
        _initMethod:function(){
            //根据请求参数查询 查询 业主信息
            vc.component._loadShopRangeInfoData();
        },
        _initEvent:function(){
            vc.on('viewShopRangeInfo','chooseShopRange',function(_app){
                vc.copyObject(_app, vc.component.viewShopRangeInfo);
                vc.emit($props.callBackListener,$props.callBackFunction,vc.component.viewShopRangeInfo);
            });

            vc.on('viewShopRangeInfo', 'onIndex', function(_index){
                vc.component.viewShopRangeInfo.index = _index;
            });

        },
        methods:{

            _openSelectShopRangeInfoModel(){
                vc.emit('chooseShopRange','openChooseShopRangeModel',{});
            },
            _openAddShopRangeInfoModel(){
                vc.emit('addShopRange','openAddShopRangeModal',{});
            },
            _loadShopRangeInfoData:function(){

            }
        }
    });

})(window.vc);
