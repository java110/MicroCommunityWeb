/**
    报表组 组件
**/
(function(vc){

    vc.extends({
        propTypes: {
           callBackListener:vc.propTypes.string, //父组件名称
           callBackFunction:vc.propTypes.string //父组件监听方法
        },
        data:{
            viewReportCustomGroupInfo:{
                index:0,
                flowComponent:'viewReportCustomGroupInfo',
                name:'',
url:'',
remark:'',

            }
        },
        _initMethod:function(){
            //根据请求参数查询 查询 业主信息
            vc.component._loadReportCustomGroupInfoData();
        },
        _initEvent:function(){
            vc.on('viewReportCustomGroupInfo','chooseReportCustomGroup',function(_app){
                vc.copyObject(_app, vc.component.viewReportCustomGroupInfo);
                vc.emit($props.callBackListener,$props.callBackFunction,vc.component.viewReportCustomGroupInfo);
            });

            vc.on('viewReportCustomGroupInfo', 'onIndex', function(_index){
                vc.component.viewReportCustomGroupInfo.index = _index;
            });

        },
        methods:{

            _openSelectReportCustomGroupInfoModel(){
                vc.emit('chooseReportCustomGroup','openChooseReportCustomGroupModel',{});
            },
            _openAddReportCustomGroupInfoModel(){
                vc.emit('addReportCustomGroup','openAddReportCustomGroupModal',{});
            },
            _loadReportCustomGroupInfoData:function(){

            }
        }
    });

})(window.vc);
