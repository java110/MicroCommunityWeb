/**
    场地 组件
**/
(function(vc){

    vc.extends({
        propTypes: {
           callBackListener:vc.propTypes.string, //父组件名称
           callBackFunction:vc.propTypes.string //父组件监听方法
        },
        data:{
            viewCommunitySpaceInfo:{
                index:0,
                flowComponent:'viewCommunitySpaceInfo',
                name:'',
startTime:'',
endTime:'',
feeMoney:'',
adminName:'',
tel:'',
state:'',

            }
        },
        _initMethod:function(){
            //根据请求参数查询 查询 业主信息
            vc.component._loadCommunitySpaceInfoData();
        },
        _initEvent:function(){
            vc.on('viewCommunitySpaceInfo','chooseCommunitySpace',function(_app){
                vc.copyObject(_app, vc.component.viewCommunitySpaceInfo);
                vc.emit($props.callBackListener,$props.callBackFunction,vc.component.viewCommunitySpaceInfo);
            });

            vc.on('viewCommunitySpaceInfo', 'onIndex', function(_index){
                vc.component.viewCommunitySpaceInfo.index = _index;
            });

        },
        methods:{

            _openSelectCommunitySpaceInfoModel(){
                vc.emit('chooseCommunitySpace','openChooseCommunitySpaceModel',{});
            },
            _openAddCommunitySpaceInfoModel(){
                vc.emit('addCommunitySpace','openAddCommunitySpaceModal',{});
            },
            _loadCommunitySpaceInfoData:function(){

            }
        }
    });

})(window.vc);
