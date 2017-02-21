var React = require('react');
var Showdown = require('showdown');
var utils = require('../components/utils');
var converter = new Showdown.Converter();
var Comment = React.createClass({
    componentDidMount: function(){
        utils.setScroll();
    },
    render: function() {
        var rawHtml = converter.makeHtml(this.props.children.toString());
        var returnHtml;

        if(this.props.host_type == '1'){  //主持人
            return (
                <li className={this.props.isown} key={this.props.conId}>
                    <div className='header float_left'><div className='img' style={{backgroundImage:'url(' + this.props.host_avatar + ')'}}></div></div>
                    <div className='nickname size_30 color_989897'><span className='host color_fff size_26 '>主持人</span>{this.props.host_name}<span className='colon'>：</span></div> 
                    <div className='content size_40 color_000'>
                        <span className='border'><em></em></span>
                        <span dangerouslySetInnerHTML={{__html: rawHtml}} />
                    </div>
                    <div className='clear'></div>
                </li>
            );
        }
        else{   //普通用户
            return (
                <li className={this.props.isown} key={this.props.conId}>
                    <div className='header float_left'><div className='img' style={{backgroundImage:'url(' + this.props.host_avatar + ')'}}></div></div>
                    <div className='nickname size_30 color_989897'>{this.props.host_name}<span className='colon'>：</span></div> 
                    <div className='content size_40 color_000'>
                        <span className='border'><em></em></span>
                        <span dangerouslySetInnerHTML={{__html: rawHtml}} />
                    </div>
                    <div className='clear'></div>
                </li>
            );
        }
    }
});

module.exports = Comment;