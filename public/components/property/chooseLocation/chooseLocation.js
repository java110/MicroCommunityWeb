(function(vc){
    vc.extends({
        propTypes: {
           emitChooseLocation:vc.propTypes.string,
           emitLoadData:vc.propTypes.string
        },
        data:{
            chooseLocationInfo:{
                locations:[],
                _currentLocationName:'',
            }
        },
        _initMethod:function(){
        },
        _initEvent:function(){
            vc.on('chooseLocation','openChooseLocationModel',function(_param){
                $('#chooseLocationModel').modal('show');
                vc.component._refreshChooseLocationInfo();
                vc.component._loadAllLocationInfo(1,10,'');
            });
        },
        methods:{
            _loadAllLocationInfo:function(_page,_row,_name){
                var param = {
                    params:{
                        page:_page,
                        row:_row,
                        communityId:vc.getCurrentCommunity().communityId,
                        name:_name
                    }
                };

                //发送get请求
               vc.http.apiGet('location.listLocations',
                             param,
                             function(json){
                                var _locationInfo = JSON.parse(json);
                                vc.component.chooseLocationInfo.locations = _locationInfo.locations;
                             },function(){
                                console.log('请求失败处理');
                             }
                           );
            },
            chooseLocation:function(_location){
                if(_location.hasOwnProperty('name')){
                     _location.locationName = _location.name;
                }
                vc.emit($props.emitChooseLocation,'chooseLocation',_location);
                vc.emit($props.emitLoadData,'listLocationData',{
                    locationId:_location.locationId
                });
                $('#chooseLocationModel').modal('hide');
            },
            queryLocations:function(){
                vc.component._loadAllLocationInfo(1,10,vc.component.chooseLocationInfo._currentLocationName);
            },
            _refreshChooseLocationInfo:function(){
                vc.component.chooseLocationInfo._currentLocationName = "";
            }
        }

    });
})(window.vc);
