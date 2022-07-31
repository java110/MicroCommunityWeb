/**
    报表 组件
**/
(function(vc){

    vc.extends({
        propTypes: {
           callBackListener:vc.propTypes.string, //父组件名称
           callBackFunction:vc.propTypes.string //父组件监听方法
        },
        data:{
            viewReportCustomInfo:{
                index:0,
                flowComponent:'viewReportCustomInfo',
                customId:'',
groupId:'',
title:'',
seq:'',
remark:'',

            }
        },
        _initMethod:function(){
            //根据请求参数查询 查询 业主信息
            vc.component._loadReportCustomInfoData();
        },
        _initEvent:function(){
            vc.on('viewReportCustomInfo','chooseReportCustom',function(_app){
                vc.copyObject(_app, vc.component.viewReportCustomInfo);
                vc.emit($props.callBackListener,$props.callBackFunction,vc.component.viewReportCustomInfo);
            });

            vc.on('viewReportCustomInfo', 'onIndex', function(_index){
                vc.component.viewReportCustomInfo.index = _index;
            });

        },
        methods:{

            _openSelectReportCustomInfoModel(){
                vc.emit('chooseReportCustom','openChooseReportCustomModel',{});
            },
            _openAddReportCustomInfoModel(){
                vc.emit('addReportCustom','openAddReportCustomModal',{});
            },
            _loadReportCustomInfoData:function(){

            }
        }
    });

})(window.vc);
