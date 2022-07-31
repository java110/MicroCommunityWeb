/**
    仓库 组件
**/
(function(vc){

    vc.extends({
        propTypes: {
           callBackListener:vc.propTypes.string, //父组件名称
           callBackFunction:vc.propTypes.string //父组件监听方法
        },
        data:{
            viewStorehouseInfo:{
                index:0,
                flowComponent:'viewStorehouseInfo',
                shName:'',
shType:'',
shDesc:'',

            }
        },
        _initMethod:function(){
            //根据请求参数查询 查询 业主信息
            vc.component._loadStorehouseInfoData();
        },
        _initEvent:function(){
            vc.on('viewStorehouseInfo','chooseStorehouse',function(_app){
                vc.copyObject(_app, vc.component.viewStorehouseInfo);
                vc.emit($props.callBackListener,$props.callBackFunction,vc.component.viewStorehouseInfo);
            });

            vc.on('viewStorehouseInfo', 'onIndex', function(_index){
                vc.component.viewStorehouseInfo.index = _index;
            });

        },
        methods:{

            _openSelectStorehouseInfoModel(){
                vc.emit('chooseStorehouse','openChooseStorehouseModel',{});
            },
            _openAddStorehouseInfoModel(){
                vc.emit('addStorehouse','openAddStorehouseModal',{});
            },
            _loadStorehouseInfoData:function(){

            }
        }
    });

})(window.vc);
