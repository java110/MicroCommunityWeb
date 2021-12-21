(function(vc){
    vc.extends({
        propTypes: {
           emitChooseReportCustomComponentFooter:vc.propTypes.string,
           emitLoadData:vc.propTypes.string
        },
        data:{
            chooseReportCustomComponentFooterInfo:{
                reportCustomComponentFooters:[],
                _currentReportCustomComponentFooterName:'',
            }
        },
        _initMethod:function(){
        },
        _initEvent:function(){
            vc.on('chooseReportCustomComponentFooter','openChooseReportCustomComponentFooterModel',function(_param){
                $('#chooseReportCustomComponentFooterModel').modal('show');
                vc.component._refreshChooseReportCustomComponentFooterInfo();
                vc.component._loadAllReportCustomComponentFooterInfo(1,10,'');
            });
        },
        methods:{
            _loadAllReportCustomComponentFooterInfo:function(_page,_row,_name){
                var param = {
                    params:{
                        page:_page,
                        row:_row,
                        communityId:vc.getCurrentCommunity().communityId,
                        name:_name
                    }
                };

                //发送get请求
               vc.http.apiGet('reportCustomComponentFooter.listReportCustomComponentFooters',
                             param,
                             function(json){
                                var _reportCustomComponentFooterInfo = JSON.parse(json);
                                vc.component.chooseReportCustomComponentFooterInfo.reportCustomComponentFooters = _reportCustomComponentFooterInfo.reportCustomComponentFooters;
                             },function(){
                                console.log('请求失败处理');
                             }
                           );
            },
            chooseReportCustomComponentFooter:function(_reportCustomComponentFooter){
                if(_reportCustomComponentFooter.hasOwnProperty('name')){
                     _reportCustomComponentFooter.reportCustomComponentFooterName = _reportCustomComponentFooter.name;
                }
                vc.emit($props.emitChooseReportCustomComponentFooter,'chooseReportCustomComponentFooter',_reportCustomComponentFooter);
                vc.emit($props.emitLoadData,'listReportCustomComponentFooterData',{
                    reportCustomComponentFooterId:_reportCustomComponentFooter.reportCustomComponentFooterId
                });
                $('#chooseReportCustomComponentFooterModel').modal('hide');
            },
            queryReportCustomComponentFooters:function(){
                vc.component._loadAllReportCustomComponentFooterInfo(1,10,vc.component.chooseReportCustomComponentFooterInfo._currentReportCustomComponentFooterName);
            },
            _refreshChooseReportCustomComponentFooterInfo:function(){
                vc.component.chooseReportCustomComponentFooterInfo._currentReportCustomComponentFooterName = "";
            }
        }

    });
})(window.vc);
