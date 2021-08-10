(function(vc){
    vc.extends({
        propTypes: {
           emitChooseReportInfoBackCity:vc.propTypes.string,
           emitLoadData:vc.propTypes.string
        },
        data:{
            chooseReportInfoBackCityInfo:{
                reportInfoBackCitys:[],
                _currentReportInfoBackCityName:'',
            }
        },
        _initMethod:function(){
        },
        _initEvent:function(){
            vc.on('chooseReportInfoBackCity','openChooseReportInfoBackCityModel',function(_param){
                $('#chooseReportInfoBackCityModel').modal('show');
                vc.component._refreshChooseReportInfoBackCityInfo();
                vc.component._loadAllReportInfoBackCityInfo(1,10,'');
            });
        },
        methods:{
            _loadAllReportInfoBackCityInfo:function(_page,_row,_name){
                var param = {
                    params:{
                        page:_page,
                        row:_row,
                        communityId:vc.getCurrentCommunity().communityId,
                        name:_name
                    }
                };

                //发送get请求
               vc.http.apiGet('reportInfoBackCity.listReportInfoBackCitys',
                             param,
                             function(json){
                                var _reportInfoBackCityInfo = JSON.parse(json);
                                vc.component.chooseReportInfoBackCityInfo.reportInfoBackCitys = _reportInfoBackCityInfo.reportInfoBackCitys;
                             },function(){
                                console.log('请求失败处理');
                             }
                           );
            },
            chooseReportInfoBackCity:function(_reportInfoBackCity){
                if(_reportInfoBackCity.hasOwnProperty('name')){
                     _reportInfoBackCity.reportInfoBackCityName = _reportInfoBackCity.name;
                }
                vc.emit($props.emitChooseReportInfoBackCity,'chooseReportInfoBackCity',_reportInfoBackCity);
                vc.emit($props.emitLoadData,'listReportInfoBackCityData',{
                    reportInfoBackCityId:_reportInfoBackCity.reportInfoBackCityId
                });
                $('#chooseReportInfoBackCityModel').modal('hide');
            },
            queryReportInfoBackCitys:function(){
                vc.component._loadAllReportInfoBackCityInfo(1,10,vc.component.chooseReportInfoBackCityInfo._currentReportInfoBackCityName);
            },
            _refreshChooseReportInfoBackCityInfo:function(){
                vc.component.chooseReportInfoBackCityInfo._currentReportInfoBackCityName = "";
            }
        }

    });
})(window.vc);
