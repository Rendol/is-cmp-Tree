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

		primaryKey: 'id',
		parentKey: 'parent_id',

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
			me.list[me.primaryKey] = 0;
			me.collection[me.list[me.primaryKey]] = me.list;

			__ext__.init.apply(me);
		},

		_bindings: MK.extend(__ext__._bindings, {
			list: function (me) {
				me.bindNode('list', ':sandbox .js-list')
			}
		}),

		_events: MK.extend(__ext__._events, {
			'element-create': function (me) {
				me.on('element-create', function (rec) {
					me.create(rec);
					rec.$bound('name').focus();
				})
			}
		}),

		load: function (data) {
			this._update(data, 'load');
		},
		create: function (data) {
			this._update(data, 'create');
		},
		update: function (data) {
			this._update(data, 'update');
		},

		_update: function (data, action) {
			var me = this;
			if (!(data instanceof Array)) {
				data = [data];
			}
			$.each(data, function () {
				var dataItem = this;
				var list = me.collection[dataItem[me.parentKey]];
				if (list) {
					var exists = list.filter(function (item) {
						return item.id == dataItem.id;
					});
					if (exists.length) {
						exists[0].set(dataItem);
					}
					else {
						var method = 'push';
						if (list.modeReverseLoad && action == 'load') {
							method = 'unshift';
						}
						var record = dataItem;
						if (!(record instanceof MK.Object)) {
							record = new list.Model(dataItem);
						}
						record.parent = list;
						list[method](record);
					}
				}
			});
			me.trigger(action, data);
		}

	});
})
;