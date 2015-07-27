'use strict';

var React = require('react');
var commonmark = require('commonmark');

// ignoring keys in (b) that are not found in (a)
var srcEquals = function (a, b) {
    for (var k in a) {
        if (a[k] !== b[k]) {
            return false;
        }
    }

    return true;
}

var copyKeys = function (keys, b) {
    var obj = {};
    for (var i = 0; i < keys.length; i++) {
        var k = keys[i];
        obj[k] = b[k]
    }

    return obj;
}

var ReactMarkdown = React.createClass({
    displayName: 'ReactMarkdown',

    propTypes: {
        parentClassName: React.PropTypes.string,
        className: React.PropTypes.string,
        containerTagName: React.PropTypes.string,
        source: React.PropTypes.string.isRequired,
        sourcePos: React.PropTypes.bool,
        escapeHtml: React.PropTypes.bool,
        skipHtml: React.PropTypes.bool,
        softBreak: React.PropTypes.string,
        highlight: React.PropTypes.func
    },

    getDefaultProps: function () {
        return {
            containerTagName: 'div',
            source: ''
        };
    },

    getInitialState: function () {

        var state = {
            source: this.props.source || '',
            sourcePos: undefined,
            escapeHtml: undefined,
            skipHtml: undefined,
            softBreak: undefined,
            highlight: undefined
        }

        this.stateKeys = Object.keys(state);

        return state;
    },

    shouldComponentUpdate: function (nextProps) {
        if (this.props.containerTagName !== nextProps.containerTagName ||
            this.props.className !== nextProps.className) {
            return true;
        }


        nextProps.source = nextProps.source || '';

        if (!srcEquals(this.state, nextProps)) {
            this.setState(copyKeys(this.stateKeys, nextProps))
            this._setMarkdown(this.state.source, this.state);
        }

        return false;
    },

    _setMarkdown: function (text, opts) {
        var reader = new commonmark.Parser(opts);
        var writer = new commonmark.HtmlRenderer(opts);
        var parsed = reader.parse(text);
        var html = writer.render(parsed);

        React.findDOMNode(this.refs.container).innerHTML = html;
    },

    componentDidUpdate: function () {
        this._setMarkdown(this.state.source, this.state);
    },

    componentDidMount: function () {
        this._setMarkdown(this.state.source, this.state);
    },

    render: function () {
        var Container = this.props.containerTagName;

        return (
            <div className={this.props.parentClassName}>
                <Container ref='container' className={this.props.className || ''}></Container>
            </div>
        );
    }
});

module.exports = ReactMarkdown;
