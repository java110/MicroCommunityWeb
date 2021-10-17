/**
    岗亭 组件
**/
(function(vc){

    vc.extends({
        propTypes: {
           callBackListener:vc.propTypes.string, //父组件名称
           callBackFunction:vc.propTypes.string //父组件监听方法
        },
        data:{
            viewParkingBoxInfo:{
                index:0,
                flowComponent:'viewParkingBoxInfo',
                boxName:'',
tempCarIn:'',
fee:'',
blueCarIn:'',
yelowCarIn:'',
remark:'',

            }
        },
        _initMethod:function(){
            //根据请求参数查询 查询 业主信息
            vc.component._loadParkingBoxInfoData();
        },
        _initEvent:function(){
            vc.on('viewParkingBoxInfo','chooseParkingBox',function(_app){
                vc.copyObject(_app, vc.component.viewParkingBoxInfo);
                vc.emit($props.callBackListener,$props.callBackFunction,vc.component.viewParkingBoxInfo);
            });

            vc.on('viewParkingBoxInfo', 'onIndex', function(_index){
                vc.component.viewParkingBoxInfo.index = _index;
            });

        },
        methods:{

            _openSelectParkingBoxInfoModel(){
                vc.emit('chooseParkingBox','openChooseParkingBoxModel',{});
            },
            _openAddParkingBoxInfoModel(){
                vc.emit('addParkingBox','openAddParkingBoxModal',{});
            },
            _loadParkingBoxInfoData:function(){

            }
        }
    });

})(window.vc);
