/**
    位置管理 组件
**/
(function(vc){

    vc.extends({
        propTypes: {
           callBackListener:vc.propTypes.string, //父组件名称
           callBackFunction:vc.propTypes.string //父组件监听方法
        },
        data:{
            viewLocationInfo:{
                index:0,
                flowComponent:'viewLocationInfo',
                locationName:'',
locationType:'',

            }
        },
        _initMethod:function(){
            //根据请求参数查询 查询 业主信息
            vc.component._loadLocationInfoData();
        },
        _initEvent:function(){
            vc.on('viewLocationInfo','chooseLocation',function(_app){
                vc.copyObject(_app, vc.component.viewLocationInfo);
                vc.emit($props.callBackListener,$props.callBackFunction,vc.component.viewLocationInfo);
            });

            vc.on('viewLocationInfo', 'onIndex', function(_index){
                vc.component.viewLocationInfo.index = _index;
            });

        },
        methods:{

            _openSelectLocationInfoModel(){
                vc.emit('chooseLocation','openChooseLocationModel',{});
            },
            _openAddLocationInfoModel(){
                vc.emit('addLocation','openAddLocationModal',{});
            },
            _loadLocationInfoData:function(){

            }
        }
    });

})(window.vc);
