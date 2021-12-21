(function(vc){
    vc.extends({
        propTypes: {
           emitChooseReportCustom:vc.propTypes.string,
           emitLoadData:vc.propTypes.string
        },
        data:{
            chooseReportCustomInfo:{
                reportCustoms:[],
                _currentReportCustomName:'',
            }
        },
        _initMethod:function(){
        },
        _initEvent:function(){
            vc.on('chooseReportCustom','openChooseReportCustomModel',function(_param){
                $('#chooseReportCustomModel').modal('show');
                vc.component._refreshChooseReportCustomInfo();
                vc.component._loadAllReportCustomInfo(1,10,'');
            });
        },
        methods:{
            _loadAllReportCustomInfo:function(_page,_row,_name){
                var param = {
                    params:{
                        page:_page,
                        row:_row,
                        communityId:vc.getCurrentCommunity().communityId,
                        name:_name
                    }
                };

                //发送get请求
               vc.http.apiGet('reportCustom.listReportCustoms',
                             param,
                             function(json){
                                var _reportCustomInfo = JSON.parse(json);
                                vc.component.chooseReportCustomInfo.reportCustoms = _reportCustomInfo.reportCustoms;
                             },function(){
                                console.log('请求失败处理');
                             }
                           );
            },
            chooseReportCustom:function(_reportCustom){
                if(_reportCustom.hasOwnProperty('name')){
                     _reportCustom.reportCustomName = _reportCustom.name;
                }
                vc.emit($props.emitChooseReportCustom,'chooseReportCustom',_reportCustom);
                vc.emit($props.emitLoadData,'listReportCustomData',{
                    reportCustomId:_reportCustom.reportCustomId
                });
                $('#chooseReportCustomModel').modal('hide');
            },
            queryReportCustoms:function(){
                vc.component._loadAllReportCustomInfo(1,10,vc.component.chooseReportCustomInfo._currentReportCustomName);
            },
            _refreshChooseReportCustomInfo:function(){
                vc.component.chooseReportCustomInfo._currentReportCustomName = "";
            }
        }

    });
})(window.vc);
