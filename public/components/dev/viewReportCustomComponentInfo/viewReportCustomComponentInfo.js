/**
    报表组件 组件
**/
(function(vc){

    vc.extends({
        propTypes: {
           callBackListener:vc.propTypes.string, //父组件名称
           callBackFunction:vc.propTypes.string //父组件监听方法
        },
        data:{
            viewReportCustomComponentInfo:{
                index:0,
                flowComponent:'viewReportCustomComponentInfo',
                name:'',
componentType:'',
queryModel:'',
sql:'',
javaScript:'',
remark:'',

            }
        },
        _initMethod:function(){
            //根据请求参数查询 查询 业主信息
            vc.component._loadReportCustomComponentInfoData();
        },
        _initEvent:function(){
            vc.on('viewReportCustomComponentInfo','chooseReportCustomComponent',function(_app){
                vc.copyObject(_app, vc.component.viewReportCustomComponentInfo);
                vc.emit($props.callBackListener,$props.callBackFunction,vc.component.viewReportCustomComponentInfo);
            });

            vc.on('viewReportCustomComponentInfo', 'onIndex', function(_index){
                vc.component.viewReportCustomComponentInfo.index = _index;
            });

        },
        methods:{

            _openSelectReportCustomComponentInfoModel(){
                vc.emit('chooseReportCustomComponent','openChooseReportCustomComponentModel',{});
            },
            _openAddReportCustomComponentInfoModel(){
                vc.emit('addReportCustomComponent','openAddReportCustomComponentModal',{});
            },
            _loadReportCustomComponentInfoData:function(){

            }
        }
    });

})(window.vc);
