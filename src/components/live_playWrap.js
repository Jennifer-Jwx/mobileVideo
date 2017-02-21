var React = require('react');

var playstate = 1;

var PlayWrap = React.createClass({  //播放区域
    render: function(){
        var loadwarpNodes = function(){
            return (
                <div className="loadwarp">
                    <div className="loader-inner line-spin-fade-loader">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                </div>
            );
        };
        if(playstate == 0){  //直播
            return (
                <div className={this.props.readyclass}>
                    <img src='http://y1.ifengimg.com/a/2015/0701newsf/w16_h9.png' />
                    <video ref='video' className={this.props.scale} src={this.props.videoLive} id='video' onTouchEnd={this.props._play}/>
                    <div className='state color_yellow size_36 color_ff0000'>·直播中</div>
                    <div className='livefull' id='full' onTouchEnd={this.props.full}></div>
                    {loadwarpNodes()}
                </div>
            );
        }
        else if(playstate == 1){  //回放
            return (
                <div className={this.props.videoclass} id='playwrap'>
                    <img src='http://y1.ifengimg.com/a/2015/0701newsf/w16_h9.png' />
                    <video ref='video' className={this.props.scale} poster={this.props.vpic} src={this.props.videoLive} id='video' />
                    <div className='state color_yellow size_36 color_fa200'>·精彩回放</div>
                    <div className={this.props.playclass} onTouchEnd={this.props._play}></div>
                    <div className={this.props.uastate} id='controlwrap'>
                        <div className='control'>
                            <div className='control_play float_left' onTouchEnd={this.props._play}></div>
                            <div className='control_center float_left'>
                                <div className='control_time color_fff size_30 float_left'>{this.props._currenttime}</div>
                                <div className='control_schedulewrap float_left' id='control_schedulewrap'>
                                    <div className='schedule' id='schedule'></div>
                                    <div className='circlewrap' id='circlewrap'>
                                        <div className='circle' id='circle'></div>
                                    </div>
                                </div>
                                <div className='control_duration color_fff size_30 float_left'>{this.props._duration}</div>
                            </div>
                            <div className='control_full float_right' onTouchEnd={this.props.full}></div>
                            <div className='control_exitfull float_right' onTouchEnd={this.props.exitfull}></div>
                        </div>
                    </div>
                </div>
            );
                
        }
    }
});

module.exports = PlayWrap;