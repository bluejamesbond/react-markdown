'use strict';

var React = require('react');
var commonmark = require('commonmark');

// ignoring keys in (b) that are not found in (a)
var srcEquals = function srcEquals(a, b) {
    for (var k in a) {
        if (a[k] !== b[k]) {
            return false;
        }
    }

    return true;
};

var copyKeys = function copyKeys(keys, b) {
    var obj = {};
    for (var i = 0; i < keys.length; i++) {
        var k = keys[i];
        obj[k] = b[k];
    }

    return obj;
};

var ReactMarkdown = React.createClass({
    displayName: 'ReactMarkdown',

    propTypes: {
        className: React.PropTypes.string,
        containerTagName: React.PropTypes.string,
        source: React.PropTypes.string.isRequired,
        sourcePos: React.PropTypes.bool,
        escapeHtml: React.PropTypes.bool,
        skipHtml: React.PropTypes.bool,
        softBreak: React.PropTypes.string,
        highlight: React.PropTypes.func
    },

    getDefaultProps: function getDefaultProps() {
        return {
            containerTagName: 'div',
            source: ''
        };
    },

    getInitialState: function getInitialState() {

        var state = {
            source: this.props.source || '',
            sourcePos: undefined,
            escapeHtml: undefined,
            skipHtml: undefined,
            softBreak: undefined,
            highlight: undefined
        };

        this.stateKeys = Object.keys(state);

        return state;
    },

    shouldComponentUpdate: function shouldComponentUpdate(nextProps) {
        if (this.props.containerTagName !== nextProps.containerTagName || this.props.className !== nextProps.className) {
            return true;
        }

        nextProps.source = nextProps.source || '';

        if (!srcEquals(this.state, nextProps)) {
            this.setState(copyKeys(this.stateKeys, nextProps));
            this._setMarkdown(this.state.source, this.state);
        }

        return false;
    },

    _setMarkdown: function _setMarkdown(text, opts) {
        var reader = new commonmark.Parser(opts);
        var writer = new commonmark.HtmlRenderer(opts);
        var parsed = reader.parse(text);
        var html = writer.parse(parsed);

        React.findDOMNode(this.refs.container).innerHTML = html;
    },

    componentDidUpdate: function componentDidUpdate() {
        this._setMarkdown(this.state.source, this.state);
    },

    componentDidMount: function componentDidMount() {
        this._setMarkdown(this.state.source, this.state);
    },

    render: function render() {
        var Container = this.props.containerTagName;

        return React.createElement(Container, { ref: 'container', className: this.props.className || '' });
    }
});

module.exports = ReactMarkdown;
