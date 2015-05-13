"use strict";
/**
 * Infinity Systems widget Tree
 * Component: Element
 * Mixin: Keyboard
 *
 * @author Igor Sapegin aka Rendol <sapegin.in@gmail.com>
 */
var KEY_TAB = 9,
	KEY_ENTER = 13,
	KEY_UP = 38,
	KEY_DOWN = 40,
	KEY_DELETE = 46;
IS.reg('widget.Tree.mixins.Element.Keyboard', function () {
	return MK.extend({}, {

		_bindings: {
			name: function (me) {
				me.bindNode('name', ':sandbox .js-name', MK.binders.input())
			}
		},
		_events: {
			Keyboard: function (me) {
				var self = me.mixins.Keyboard;
				me.on('keydown::name', function (evt) {
					var e = evt.domEvent, item;

					if (e.keyCode == KEY_ENTER) {
						me.widget.trigger('element-create', self.goNew.call(me, me));

						if (e.preventDefault) {
							e.preventDefault();
						}
					}

					if (e.keyCode == KEY_TAB) {

						// left
						if (e.shiftKey) {
							item = self.goLeft.call(me, me);
						}
						// right
						else {
							item = self.goRight.call(me, me);
						}

						if (e.preventDefault) {
							e.preventDefault();
						}
					}

					if ([KEY_UP, KEY_DOWN, KEY_DELETE].indexOf(e.keyCode) !== -1) {
						if (e.ctrlKey) {
							// up
							if (e.keyCode == KEY_UP) {
								item = self.goPrev.call(me, me);
							}
							// down
							if (e.keyCode == KEY_DOWN) {
								item = self.goNext.call(me, me);
							}
							// delete
							if (e.keyCode == KEY_DELETE) {
								item = self.getNext.call(me, me, true);
								if (!item) {
									item = self.getPrev.call(me, me);
								}
								me.parent.del(me);
							}
						}
						else {
							// up
							if (e.keyCode == KEY_UP) {
								item = self.getPrev.call(me, me);
							}
							// down
							if (e.keyCode == KEY_DOWN) {
								item = self.getNext.call(me, me);
							}
						}
					}

					// focus
					if (item) {
						$(item.$nodes.name).focus();
					}

					if ([KEY_TAB, KEY_ENTER, KEY_UP, KEY_DOWN].indexOf(e.keyCode) != -1) {
						if (item) {
							item.pos = me.parent.index(item);
							me.widget.trigger('element-change', item);
						}
					}
				});
			}
		},

		getPrev: function (item, noRecursive) {
			var list = item.parent,
				index = list.index(item) - 1;

			if (index == -1) {
				return list.parent;
			}
			else if (index >= 0) {
				if (!noRecursive && list[index].children.length) {
					return item.mixins.Keyboard.getLastRecursive(list[index]);
				}
				else {
					return list[index];
				}
			}
		},

		getLastRecursive: function (item) {
			if (item.children && item.children.length) {
				return item.mixins.Keyboard.getLastRecursive(item.children[item.children.length - 1]);
			}
			else {
				return item;
			}
		},

		getNext: function (item, noChild) {
			var list = item.parent,
				index = list.index(item) + 1;

			if (!noChild && item.children.length) {
				return item.children[0];
			}
			else if (index >= list.length && list.parent) {
				return item.mixins.Keyboard.getNext(list.parent, true);
			}
			else {
				return list[index];
			}
		},

		goLeft: function (item) {
			var list = item.parent,
				removed
				;
			if (list && list.parent && list.parent.parent) {
				removed = list.delWithDom(item)[0];
				list.parent.parent.splice_(
					list.parent.parent.index(list.parent) + 1, 0,
					removed,
					{moveSandbox: true}
				);
				removed[this.widget.parentKey] = list.parent.parent.parent ?
					list.parent.parent.parent[this.widget.primaryKey] : 0;
				return removed;
			}
		},

		goRight: function (item) {
			var prev = item.mixins.Keyboard.getPrev(item, true),
				list = item.parent,
				removed
				;
			if (prev && prev.parent == list) {
				removed = list.delWithDom(item)[0];
				prev.children.push_(removed, {moveSandbox: true});
				removed[this.widget.parentKey] = prev[this.widget.primaryKey];
				return removed;
			}
		},

		moveVertical: function (item, num) {
			var list = item.parent,
				index = list.index(item),
				removed
				;
			if (list && (index > 0 || num > 0) && index < list.length) {
				removed = list.delWithDom(item)[0];
				list.splice_(index + num, 0, removed, {moveSandbox: true});
				return removed;
			}
		},

		goPrev: function (item) {
			return item.mixins.Keyboard.moveVertical(item, -1);
		},

		goNext: function (item) {
			return item.mixins.Keyboard.moveVertical(item, +1);
		},

		goNew: function (item) {
			var list = item.parent,
				index = list.index(item),
				params = {
					name: 'New',
					pos: index + 1
				};
			params[this.widget.parentKey] = !list.parent ? 0 : list.parent[this.widget.primaryKey];
			return new list.Model(params);
		}
	});
});
