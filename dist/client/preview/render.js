'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderError = renderError;
exports.renderMain = renderMain;
exports.default = renderPreview;

require('airbnb-js-shims');

var _virtualElement = require('virtual-element');

var _virtualElement2 = _interopRequireDefault(_virtualElement);

var _deku = require('deku');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import React from 'react';
// import ReactDOM from 'react-dom';
// import ErrorDisplay from './error_display';
//
var rootEl = document.getElementById('root'); /** @jsx dom */

var previousKind = '';
var previousStory = '';

function renderError(error) {
  // We always need to render redbox in the mainPage if we get an error.
  // Since this is an error, this affects to the main page as well.
  var realError = new Error(error.message);
  realError.stack = error.stack;
  var redBox = (0, _virtualElement2.default)(
    'div',
    { style: 'color: white; background: red; padding: 1rem; margin: 0; position: absolute; top: 0; right: 0; bottom: 0; left: 0;' },
    (0, _virtualElement2.default)(
      'pre',
      null,
      error.stack
    )
  );

  return (0, _deku.render)((0, _deku.tree)(redBox), rootEl);
}
//
function renderMain(data, storyStore) {
  if (storyStore.size() === 0) return null;

  var NoPreview = function NoPreview() {
    return (0, _virtualElement2.default)(
      'p',
      null,
      'No Preview Available!'
    );
  };
  var noPreview = (0, _virtualElement2.default)(NoPreview, null);
  var selectedKind = data.selectedKind;
  var selectedStory = data.selectedStory;


  var story = storyStore.getStory(selectedKind, selectedStory);
  if (!story) {
    return (0, _deku.render)((0, _deku.tree)(noPreview), rootEl);
    // return ReactDOM.render(noPreview, rootEl);
  }

  // Unmount the previous story only if selectedKind or selectedStory has changed.
  // renderMain() gets executed after each action. Actions will cause the whole
  // story to re-render without this check.
  //    https://github.com/kadirahq/react-storybook/issues/116
  if (selectedKind !== previousKind || previousStory !== selectedStory) {
    // We need to unmount the existing set of components in the DOM node.
    // Otherwise, React may not recrease instances for every story run.
    // This could leads to issues like below:
    //    https://github.com/kadirahq/react-storybook/issues/81
    previousKind = selectedKind;
    previousStory = selectedStory;
    // ReactDOM.unmountComponentAtNode(rootEl);
    console.warn('Should unmount component');
  }

  var context = {
    kind: selectedKind,
    story: selectedStory
  };

  try {
    return (0, _deku.render)((0, _deku.tree)(story(context)), rootEl);
    // return ReactDOM.render(story(context), rootEl);
  } catch (ex) {
    return renderError(ex);
  }
}

function renderPreview(_ref) {
  var reduxStore = _ref.reduxStore;
  var storyStore = _ref.storyStore;

  var state = reduxStore.getState();

  if (state.error) {
    return renderError(state.error);
  }

  return renderMain(state, storyStore);
}