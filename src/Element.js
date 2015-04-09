"use strict";
/**
 * Infinity Systems widget Tree
 * Component: Element
 *
 * @author Igor Sapegin aka Rendol <sapegin.in@gmail.com>
 */
IS.reg('widget.Tree.Element', function () {
	var __ext__ = IS.get('components.Object');
	return MK.extend({}, __ext__, {

		primaryKey: 'id',
		parentKey: 'parent_id',

		children: {},

		init: function () {
			var me = this,
				id = me[me.primaryKey];

			me.widget.collection[id] = new me.parent.widget.clsList({
				parent: me,
				widget: me.widget,
				target: me.bound('childList')
			});

			me.children = me.parent.widget.collection[id];

			__ext__.init.apply(me);
		},

		_bindings: MK.extend(__ext__._bindings,
			{
				children: function (me) {
					me.bindNode('childList', ':sandbox .js-list')
				},
				name: function (me) {
					me.bindNode('name', ':sandbox .js-name', MK.binders.innerHTML())
				}
			}
		)
	});
});
