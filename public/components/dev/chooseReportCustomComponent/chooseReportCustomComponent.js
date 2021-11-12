(function(vc){
    vc.extends({
        propTypes: {
           emitChooseReportCustomComponent:vc.propTypes.string,
           emitLoadData:vc.propTypes.string
        },
        data:{
            chooseReportCustomComponentInfo:{
                reportCustomComponents:[],
                _currentReportCustomComponentName:'',
            }
        },
        _initMethod:function(){
        },
        _initEvent:function(){
            vc.on('chooseReportCustomComponent','openChooseReportCustomComponentModel',function(_param){
                $('#chooseReportCustomComponentModel').modal('show');
                vc.component._refreshChooseReportCustomComponentInfo();
                vc.component._loadAllReportCustomComponentInfo(1,10,'');
            });
        },
        methods:{
            _loadAllReportCustomComponentInfo:function(_page,_row,_name){
                var param = {
                    params:{
                        page:_page,
                        row:_row,
                        communityId:vc.getCurrentCommunity().communityId,
                        name:_name
                    }
                };

                //发送get请求
               vc.http.apiGet('reportCustomComponent.listReportCustomComponents',
                             param,
                             function(json){
                                var _reportCustomComponentInfo = JSON.parse(json);
                                vc.component.chooseReportCustomComponentInfo.reportCustomComponents = _reportCustomComponentInfo.reportCustomComponents;
                             },function(){
                                console.log('请求失败处理');
                             }
                           );
            },
            chooseReportCustomComponent:function(_reportCustomComponent){
                if(_reportCustomComponent.hasOwnProperty('name')){
                     _reportCustomComponent.reportCustomComponentName = _reportCustomComponent.name;
                }
                vc.emit($props.emitChooseReportCustomComponent,'chooseReportCustomComponent',_reportCustomComponent);
                vc.emit($props.emitLoadData,'listReportCustomComponentData',{
                    reportCustomComponentId:_reportCustomComponent.reportCustomComponentId
                });
                $('#chooseReportCustomComponentModel').modal('hide');
            },
            queryReportCustomComponents:function(){
                vc.component._loadAllReportCustomComponentInfo(1,10,vc.component.chooseReportCustomComponentInfo._currentReportCustomComponentName);
            },
            _refreshChooseReportCustomComponentInfo:function(){
                vc.component.chooseReportCustomComponentInfo._currentReportCustomComponentName = "";
            }
        }

    });
})(window.vc);
