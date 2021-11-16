(function(vc){
    vc.extends({
        propTypes: {
           emitChooseReportCustomComponentRel:vc.propTypes.string,
           emitLoadData:vc.propTypes.string
        },
        data:{
            chooseReportCustomComponentRelInfo:{
                reportCustomComponentRels:[],
                _currentReportCustomComponentRelName:'',
            }
        },
        _initMethod:function(){
        },
        _initEvent:function(){
            vc.on('chooseReportCustomComponentRel','openChooseReportCustomComponentRelModel',function(_param){
                $('#chooseReportCustomComponentRelModel').modal('show');
                vc.component._refreshChooseReportCustomComponentRelInfo();
                vc.component._loadAllReportCustomComponentRelInfo(1,10,'');
            });
        },
        methods:{
            _loadAllReportCustomComponentRelInfo:function(_page,_row,_name){
                var param = {
                    params:{
                        page:_page,
                        row:_row,
                        communityId:vc.getCurrentCommunity().communityId,
                        name:_name
                    }
                };

                //发送get请求
               vc.http.apiGet('reportCustomComponentRel.listReportCustomComponentRels',
                             param,
                             function(json){
                                var _reportCustomComponentRelInfo = JSON.parse(json);
                                vc.component.chooseReportCustomComponentRelInfo.reportCustomComponentRels = _reportCustomComponentRelInfo.reportCustomComponentRels;
                             },function(){
                                console.log('请求失败处理');
                             }
                           );
            },
            chooseReportCustomComponentRel:function(_reportCustomComponentRel){
                if(_reportCustomComponentRel.hasOwnProperty('name')){
                     _reportCustomComponentRel.reportCustomComponentRelName = _reportCustomComponentRel.name;
                }
                vc.emit($props.emitChooseReportCustomComponentRel,'chooseReportCustomComponentRel',_reportCustomComponentRel);
                vc.emit($props.emitLoadData,'listReportCustomComponentRelData',{
                    reportCustomComponentRelId:_reportCustomComponentRel.reportCustomComponentRelId
                });
                $('#chooseReportCustomComponentRelModel').modal('hide');
            },
            queryReportCustomComponentRels:function(){
                vc.component._loadAllReportCustomComponentRelInfo(1,10,vc.component.chooseReportCustomComponentRelInfo._currentReportCustomComponentRelName);
            },
            _refreshChooseReportCustomComponentRelInfo:function(){
                vc.component.chooseReportCustomComponentRelInfo._currentReportCustomComponentRelName = "";
            }
        }

    });
})(window.vc);
