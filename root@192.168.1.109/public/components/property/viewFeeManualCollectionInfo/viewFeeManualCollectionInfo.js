/**
    人工托收 组件
**/
(function(vc){

    vc.extends({
        propTypes: {
           callBackListener:vc.propTypes.string, //父组件名称
           callBackFunction:vc.propTypes.string //父组件监听方法
        },
        data:{
            viewFeeManualCollectionInfo:{
                index:0,
                flowComponent:'viewFeeManualCollectionInfo',
                roomName:'',
ownerName:'',
link:'',
roomArea:'',
squarePrice:'',
remark:'',

            }
        },
        _initMethod:function(){
            //根据请求参数查询 查询 业主信息
            vc.component._loadFeeManualCollectionInfoData();
        },
        _initEvent:function(){
            vc.on('viewFeeManualCollectionInfo','chooseFeeManualCollection',function(_app){
                vc.copyObject(_app, vc.component.viewFeeManualCollectionInfo);
                vc.emit($props.callBackListener,$props.callBackFunction,vc.component.viewFeeManualCollectionInfo);
            });

            vc.on('viewFeeManualCollectionInfo', 'onIndex', function(_index){
                vc.component.viewFeeManualCollectionInfo.index = _index;
            });

        },
        methods:{

            _openSelectFeeManualCollectionInfoModel(){
                vc.emit('chooseFeeManualCollection','openChooseFeeManualCollectionModel',{});
            },
            _openAddFeeManualCollectionInfoModel(){
                vc.emit('addFeeManualCollection','openAddFeeManualCollectionModal',{});
            },
            _loadFeeManualCollectionInfoData:function(){

            }
        }
    });

})(window.vc);
