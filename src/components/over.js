require('../components/check');
require('../css/common.css');
require('../css/over.css');

var React = require('react');

var OverWrap = React.createClass({  //直播已结束
    getInitialState: function(){
        return {
            viewNum: 1233,
            overclass: 'over_warp'
        }
    },
    listener: function(){   //监听屏幕是否翻转
        var self = this;
        var evt = 'onorientationchange' in window ? 'orientationchange' : 'resize';
        var _rotate = window.orientation;
        _rotate = _rotate == undefined ? 0 : _rotate;
        if(_rotate != 0){ //初始非0为横屏状态
            self.setState({
                overclass: 'over_warp fullwrap'
            });
        }
        window.addEventListener(evt, function() {
            window.orientation != 0 ? self.setState({overclass: 'over_warp fullwrap'}) : self.setState({overclass: 'over_warp'});
        }, false);
    },
    componentDidMount: function(){
        this.listener();
    },
    render: function(){
        return (
            <div className={this.state.overclass}>
                <div>
                    <div className='text text_over color_fa200 size_72'>直播已结束</div>
                    <div className='text text_num color_fff size_48'><span className='color_fa200'>{this.state.viewNum}</span>人看过</div>
                </div>
            </div>
        );
    }
});

module.exports = OverWrap;