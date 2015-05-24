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

		children: {},

		init: function () {
			var me = this,
				id = me[me.widget.primaryKey];

			if (!id) {
				id = '-new-' + MK.randomString();
				me[me.widget.primaryKey] = id;
			}

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
				parent: function (me) {
					me.bindNode(me.widget.parentKey, ':sandbox', {
						setValue: function (val, evt) {
							var widget = evt.self.widget;
							if (me.old[widget.parentKey] != val) {
								if (me[widget.primaryKey] in widget.parentIdCollections) {
									var oldParentList = widget.collection[
										widget.parentIdCollections[
											me[widget.primaryKey]
											]
										];

									var exists = oldParentList.filter(
										function (item) {
											return item[widget.primaryKey] == me[widget.primaryKey];
										}
									);

									if (exists.length) {
										var removed = oldParentList.delWithDom(exists[0])[0];
										console.log(removed[widget.indexKey]);
										widget.collection[val].splice_(removed[widget.indexKey], 0, removed, {moveSandbox: true});
									}
								}
							}
							widget.parentIdCollections[me[widget.primaryKey]] = me[widget.parentKey];
						}
					})
				},
				index: function (me) {
					me.bindNode(me.widget.indexKey, ':sandbox', {
						setValue: function (val, evt) {
							var widget = evt.self.widget;
							if (me.old[widget.indexKey] != val) {
								var list = me.parent,
									removed = list.delWithDom(me)[0];
								list.splice_(me[widget.indexKey], 0, removed, {moveSandbox: true});
							}
						}
					})
				},
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
