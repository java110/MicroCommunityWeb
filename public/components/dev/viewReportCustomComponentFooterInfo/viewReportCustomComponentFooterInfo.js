/**
    组件统计 组件
**/
(function(vc){

    vc.extends({
        propTypes: {
           callBackListener:vc.propTypes.string, //父组件名称
           callBackFunction:vc.propTypes.string //父组件监听方法
        },
        data:{
            viewReportCustomComponentFooterInfo:{
                index:0,
                flowComponent:'viewReportCustomComponentFooterInfo',
                componentId:'',
name:'',
queryModel:'',
javaScript:'',
componentSql:'',
remark:'',

            }
        },
        _initMethod:function(){
            //根据请求参数查询 查询 业主信息
            vc.component._loadReportCustomComponentFooterInfoData();
        },
        _initEvent:function(){
            vc.on('viewReportCustomComponentFooterInfo','chooseReportCustomComponentFooter',function(_app){
                vc.copyObject(_app, vc.component.viewReportCustomComponentFooterInfo);
                vc.emit($props.callBackListener,$props.callBackFunction,vc.component.viewReportCustomComponentFooterInfo);
            });

            vc.on('viewReportCustomComponentFooterInfo', 'onIndex', function(_index){
                vc.component.viewReportCustomComponentFooterInfo.index = _index;
            });

        },
        methods:{

            _openSelectReportCustomComponentFooterInfoModel(){
                vc.emit('chooseReportCustomComponentFooter','openChooseReportCustomComponentFooterModel',{});
            },
            _openAddReportCustomComponentFooterInfoModel(){
                vc.emit('addReportCustomComponentFooter','openAddReportCustomComponentFooterModal',{});
            },
            _loadReportCustomComponentFooterInfoData:function(){

            }
        }
    });

})(window.vc);
