(function(vc){
    vc.extends({
        propTypes: {
           emitChoosePropertyCompany:vc.propTypes.string,
           emitLoadData:vc.propTypes.string
        },
        data:{
            choosePropertyCompanyInfo:{
                propertyCompanys:[],
                _currentPropertyCompanyName:'',
            }
        },
        _initMethod:function(){
        },
        _initEvent:function(){
            vc.on('choosePropertyCompany','openChoosePropertyCompanyModel',function(_param){
                $('#choosePropertyCompanyModel').modal('show');
                vc.component._refreshChoosePropertyCompanyInfo();
                vc.component._loadAllPropertyCompanyInfo(1,10,'');
            });
        },
        methods:{
            _loadAllPropertyCompanyInfo:function(_page,_row,_name){
                var param = {
                    params:{
                        page:_page,
                        row:_row,
                        communityId:vc.getCurrentCommunity().communityId,
                        name:_name
                    }
                };

                //发送get请求
               vc.http.apiGet('propertyCompany.listPropertyCompanys',
                             param,
                             function(json){
                                var _propertyCompanyInfo = JSON.parse(json);
                                vc.component.choosePropertyCompanyInfo.propertyCompanys = _propertyCompanyInfo.propertyCompanys;
                             },function(){
                                console.log('请求失败处理');
                             }
                           );
            },
            choosePropertyCompany:function(_propertyCompany){
                if(_propertyCompany.hasOwnProperty('name')){
                     _propertyCompany.propertyCompanyName = _propertyCompany.name;
                }
                vc.emit($props.emitChoosePropertyCompany,'choosePropertyCompany',_propertyCompany);
                vc.emit($props.emitLoadData,'listPropertyCompanyData',{
                    propertyCompanyId:_propertyCompany.propertyCompanyId
                });
                $('#choosePropertyCompanyModel').modal('hide');
            },
            queryPropertyCompanys:function(){
                vc.component._loadAllPropertyCompanyInfo(1,10,vc.component.choosePropertyCompanyInfo._currentPropertyCompanyName);
            },
            _refreshChoosePropertyCompanyInfo:function(){
                vc.component.choosePropertyCompanyInfo._currentPropertyCompanyName = "";
            }
        }

    });
})(window.vc);
