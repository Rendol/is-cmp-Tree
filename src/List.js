"use strict";
/**
 * Infinity Systems widget Tree
 * Component: List
 *
 * @author Igor Sapegin aka Rendol <sapegin.in@gmail.com>
 */
IS.reg('widget.Tree.List', function () {
	var __ext__ = IS.get('components.Array');
	return MK.extend({}, __ext__, {
		parent: null,
		widget: null,

		_bindings: MK.extend(__ext__._bindings, {
			container: function (me) {
				if (MK.$(':sandbox .js-container').length) {
					me.bindNode('container', ':sandbox .js-container');
				}
			}
		}),

		_events: MK.extend(__ext__._events, {
			add: function (me) {
				me.on('add', function (evt) {
					MK.each(evt.added, function (item) {
						item.parent = me;
						item.widget = me.widget;
					});
				});
			}
		})
	})
});