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
		indexKey: 'pos',

		list: null,
		collection: null,
		parentIdCollections: null,

		init: function () {
			var me = this;
			me.collection = {};
			me.parentIdCollections = {};

			me.clsList = IS.cls(
				me.clsListBlock,
				$.extend(
					true,
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
					$(rec.$nodes.name).focus();
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
						return item[me.primaryKey] == dataItem[me.primaryKey];
					});

					if (!exists.length) {
						// change parent
						if (dataItem[me.primaryKey] in me.parentIdCollections) {
							var oldParentList = me.collection[
								me.parentIdCollections[
									dataItem[me.primaryKey]
									]
								];
							exists = oldParentList.filter(
								function (item) {
									return item[me.primaryKey] == dataItem[me.primaryKey];
								}
							);
						}
					}

					if (exists.length) {
						exists[0].iSet(dataItem);
					}
					else {
						var record = dataItem;
						if (!(record instanceof MK.Object)) {
							record = new list.Model(dataItem);
						}
						record.parent = list;

						list.splice(record[me.indexKey], 0, record);
					}
				}
			});
			me.trigger(action, data);
		}

	});
});