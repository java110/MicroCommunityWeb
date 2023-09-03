(function(vc, vm) {

    vc.extends({
        data: {
            communitySpacePersonTimeInfo: {
                openTimes: []
            }
        },
        _initMethod: function() {

        },
        _initEvent: function() {
            vc.on('communitySpacePersonTime', 'openEditCommunitySpaceModal', function(_params) {
                $that.communitySpacePersonTimeInfo.openTimes = _params.openTimes;
                $('#communitySpacePersonTimeModel').modal('show');
            });
        },
        methods: {
            

        }
    });

})(window.vc, window.vc.component);