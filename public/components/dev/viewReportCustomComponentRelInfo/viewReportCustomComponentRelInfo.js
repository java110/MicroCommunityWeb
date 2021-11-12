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
            viewReportCustomComponentRelInfo:{
                index:0,
                flowComponent:'viewReportCustomComponentRelInfo',
                componentId:'',
customId:'',
seq:'',

            }
        },
        _initMethod:function(){
            //根据请求参数查询 查询 业主信息
            vc.component._loadReportCustomComponentRelInfoData();
        },
        _initEvent:function(){
            vc.on('viewReportCustomComponentRelInfo','chooseReportCustomComponentRel',function(_app){
                vc.copyObject(_app, vc.component.viewReportCustomComponentRelInfo);
                vc.emit($props.callBackListener,$props.callBackFunction,vc.component.viewReportCustomComponentRelInfo);
            });

            vc.on('viewReportCustomComponentRelInfo', 'onIndex', function(_index){
                vc.component.viewReportCustomComponentRelInfo.index = _index;
            });

        },
        methods:{

            _openSelectReportCustomComponentRelInfoModel(){
                vc.emit('chooseReportCustomComponentRel','openChooseReportCustomComponentRelModel',{});
            },
            _openAddReportCustomComponentRelInfoModel(){
                vc.emit('addReportCustomComponentRel','openAddReportCustomComponentRelModal',{});
            },
            _loadReportCustomComponentRelInfoData:function(){

            }
        }
    });

})(window.vc);
