"use strict";
/**
 * Infinity Systems widget Tree
 *
 * @author Igor Sapegin aka Rendol <sapegin.in@gmail.com>
 */
IS.reg('widget.Tree', function () {
	var __ext__ = IS.get('components.Base');
	return MK.extend({}, __ext__, {

		clsElement: 'widget.Tree.Element',
		clsListBlock: 'widget.Tree.List',

		list: {},
		collection: {},

		init: function () {
			var me = this;

			me.clsList = IS.cls(
				me.clsListBlock,
				MK.extend(
					{
						Model: IS.cls(me.clsElement)
					},
					me.list
				)
			);
			me.list = new me.clsList({
				widget: me,
				target: me.bound('list')
			});
			me.collection[0] = me.list;

			__ext__.init.apply(me);
		},

		_bindings: MK.extend(__ext__._bindings, {
			list: function (me) {
				me.bindNode('list', ':sandbox .js-list')
			}
		}),

		_events: MK.extend(__ext__._events, {}),

		load: function (parentId, data) {
			this.collection[parentId].load(data);
		}
	});
})
;