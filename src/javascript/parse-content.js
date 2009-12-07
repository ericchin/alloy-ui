/*
* Alloy UI ParseContent Plugin (YUI3)
*
* Copyright (c) 2009 Eduardo Lundgren (eduardo.lundgren@liferay.com)
* and Nate Cavanaugh (nate.cavanaugh@liferay.com)
*
*	 Example: node.plug(A.Plugin.ParseContent);
*
*  - After plug ParseContent on a A.Node instance the javascript chunks will be executed (remote and inline scripts).
*  - All the javascripts within a content will be executed according to the order of apparition.
*
* NOTE: The inspiration of ParseContent cames from the "Caridy Patino" Node Dispatcher Plugin
* 		http://github.com/caridy/yui3-gallery/blob/master/src/gallery-dispatcher/
*/
AUI.add('parse-content', function(A) {

var L = A.Lang,
	isString = L.isString,

	APPEND = 'append',
	DOCUMENT_ELEMENT = 'documentElement',
	FIRST_CHILD = 'firstChild',
	HEAD = 'head',
	HOST = 'host',
	INNER_HTML = 'innerHTML',
	SCRIPT = 'script',
	SRC = 'src';

function ParseContent(config) {
	ParseContent.superclass.constructor.apply(this, arguments);
}

A.mix(ParseContent, {
	NAME: 'ParseContent',

	NS: 'ParseContent'
});

A.extend(ParseContent, A.Plugin.Base, {
	_queue: null,

	initializer: function() {
		var instance = this;

		ParseContent.superclass.initializer.apply(this, arguments);

		instance._queue = new A.AsyncQueue();

		instance._bindAOP();
	},

	globalEval: function(data) {
		var doc = A.getDoc();
		var head = doc.one(HEAD) || doc.get(DOCUMENT_ELEMENT);

		// NOTE: A.Node.create('<script></script>') doesn't work correctly on Opera
		var newScript = document.createElement(SCRIPT);

		newScript.type = 'text/javascript';

		if (data) {
			// NOTE: newScript.set(TEXT, data) breaks on IE, YUI BUG.
			newScript.text = L.trim(data);
		}

		head.appendChild(newScript).remove(); //removes the script node immediately after executing it
	},

	parseContent: function(content) {
		var instance = this;
		var output = instance._clean(content);

		instance._dispatch(output);

		return output;
	},

	_bindAOP: function() {
		var instance = this;

		// overloading node.insert() arguments, affects append/prepend methods
		this.doBefore('insert', function(content) {
			var args = Array.prototype.slice.call(arguments);
			var output = instance.parseContent(content);

			// replace the first argument with the clean fragment
			args.splice(0, 1, output.fragment);

			return new A.Do.AlterArgs(null, args);
		});

		// overloading node.setContent() arguments
		this.doBefore('setContent', function(content) {
			var output = instance.parseContent(content);

			return new A.Do.AlterArgs(null, [
				output.fragment.get(INNER_HTML)
			]);
		});
	},

	_clean: function(content) {
		var output = {};
		var fragment = A.Node.create('<div></div>');

		// instead of fix all tags to "XHTML"-style, make the firstChild be a valid non-empty tag
		fragment.append('<div>_</div>');

		if (isString(content)) {
			// create fragment from {String}
			if (A.UA.ie) {
				// TODO: use A.DOM.addHTML for all browsers after YUI fix the ticket http://yuilibrary.com/projects/yui3/ticket/2528452
				fragment.getDOM().innerHTML += content;
			}
			else {
				A.DOM.addHTML(fragment, content, APPEND);
			}
		}
		else {
			// create fragment from {Y.Node | HTMLElement}
			fragment.append(content);
		}

		output.js = fragment.all(SCRIPT).each(
			function(node, i) {
				node.remove();
			}
		);

		// remove padding node
		fragment.get(FIRST_CHILD).remove();

		output.fragment = fragment;

		return output;
	},

	_dispatch: function(output) {
		var instance = this;
		var queue = instance._queue;

		output.js.each(function(node, i) {
			var src = node.get(SRC);

			if (src) {
				queue.add({
					autoContinue: false,
					fn: function () {
						A.Get.script(src, {
							onEnd: function (o) {
								o.purge(); //removes the script node immediately after executing it
								queue.run();
							}
						});
					}
				});
			}
			else {
				queue.add({
					fn: function () {
						var dom = node._node;

						instance.globalEval(
							dom.text || dom.textContent || dom.innerHTML || ''
						);
					}
				});
			}
		});

		queue.run();
	}
});

A.namespace('Plugin');
A.Plugin.ParseContent = ParseContent;


}, '@VERSION' , { requires: [ 'async-queue', 'io', 'plugin' ] });