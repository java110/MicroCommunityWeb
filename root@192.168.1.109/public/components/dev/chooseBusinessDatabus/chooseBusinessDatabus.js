(function(vc){
    vc.extends({
        propTypes: {
           emitChooseBusinessDatabus:vc.propTypes.string,
           emitLoadData:vc.propTypes.string
        },
        data:{
            chooseBusinessDatabusInfo:{
                businessDatabuss:[],
                _currentBusinessDatabusName:'',
            }
        },
        _initMethod:function(){
        },
        _initEvent:function(){
            vc.on('chooseBusinessDatabus','openChooseBusinessDatabusModel',function(_param){
                $('#chooseBusinessDatabusModel').modal('show');
                vc.component._refreshChooseBusinessDatabusInfo();
                vc.component._loadAllBusinessDatabusInfo(1,10,'');
            });
        },
        methods:{
            _loadAllBusinessDatabusInfo:function(_page,_row,_name){
                var param = {
                    params:{
                        page:_page,
                        row:_row,
                        communityId:vc.getCurrentCommunity().communityId,
                        name:_name
                    }
                };

                //发送get请求
               vc.http.apiGet('businessDatabus.listBusinessDatabuss',
                             param,
                             function(json){
                                var _businessDatabusInfo = JSON.parse(json);
                                vc.component.chooseBusinessDatabusInfo.businessDatabuss = _businessDatabusInfo.businessDatabuss;
                             },function(){
                                console.log('请求失败处理');
                             }
                           );
            },
            chooseBusinessDatabus:function(_businessDatabus){
                if(_businessDatabus.hasOwnProperty('name')){
                     _businessDatabus.businessDatabusName = _businessDatabus.name;
                }
                vc.emit($props.emitChooseBusinessDatabus,'chooseBusinessDatabus',_businessDatabus);
                vc.emit($props.emitLoadData,'listBusinessDatabusData',{
                    businessDatabusId:_businessDatabus.businessDatabusId
                });
                $('#chooseBusinessDatabusModel').modal('hide');
            },
            queryBusinessDatabuss:function(){
                vc.component._loadAllBusinessDatabusInfo(1,10,vc.component.chooseBusinessDatabusInfo._currentBusinessDatabusName);
            },
            _refreshChooseBusinessDatabusInfo:function(){
                vc.component.chooseBusinessDatabusInfo._currentBusinessDatabusName = "";
            }
        }

    });
})(window.vc);
