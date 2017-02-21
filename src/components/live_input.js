var React = require('react');

var playstate = 1;

var InputBox = React.createClass({
    render: function(){
        if(playstate == 0){
            return (
                <div id='inputbox' className={this.props.inputstate}>
                    <div className='input size_44 color_838181 float_left' id='input'>
                        <input type='text' maxLength='60' placeholder='和大家一起聊聊吧' className='size_44 float_left' id='text' ref='content' onTouchStart={this.props.login} onFocus={this.props._focus} onBlur={this.props._blur} />
                    </div>
                    <div className='sharelive float_left' id='share' onTouchEnd={this.props.share}></div>
                    <div className='send size_48 color_fff float_left' id='send' onTouchEnd={this.props.handleSubmit} onClick={this.props.handleSubmit}>发送</div>
                </div>
            );
        }
        else if(playstate == 1){
            return (
                <div className='share' id='share' onTouchEnd={this.props.share}></div>
            );
        }
        
    }
});

module.exports = InputBox;