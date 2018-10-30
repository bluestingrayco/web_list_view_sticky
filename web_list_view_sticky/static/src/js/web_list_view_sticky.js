odoo.define('web.FreezeTableHeader', function (require) {
    "use strict";

    var core = require('web.core');
    var ListView = require('web.ListView');
    var ViewManager = require('web.ViewManager');
    var _t = core._t;

    var sticky = {
        currentTables: [],

        enable: function($el, clear) {
            if(clear) {
                sticky.clear_all();
            }

            var scrollArea = $el.parents('.o_view_manager_content').find('.o_list_view')[0];
            if(scrollArea) {
                $el.find('table.o_list_view').each(function() {
                    var closestViewManager = $(this).closest('.o_view_manager_content');
                    if(closestViewManager.length && closestViewManager[0].classList.length === 1) {
                        if($(this).data('sticky') !== '1') {
                            $(this).data('sticky', '1');
                            sticky.currentTables.push($(this));

                            var headerHeight = 21;
                            $(this).stickyTableHeaders({
                                scrollableArea: scrollArea,
                                leftOffset: scrollArea,
                                fixedOffset: 1,
                                topOffset: $('html nav').height() + $('.o_control_panel').height() + headerHeight,
                                cacheHeaderHeight: headerHeight,
                            });
                        }
                    }
                });
            }
        },

        clear_all: function() {
            sticky.currentTables.forEach(function($el, i) {
                console.log('resetting: ', $el);
                $el.data('sticky', 0);
                $el.stickyTableHeaders('destroy');
            });
            sticky.currentTables = [];
        },
    };

    ListView.include({
        /**
         * Override load_list to enable sticky table headers every time the
         * list view is loaded.
         */
        load_list: function () {
            var self = this;
            var res = self._super.apply(this, arguments);
            setTimeout(function() {
                sticky.enable(self.$el);
            }, 100);
            return res;
        },
    });

    ViewManager.include({
        switch_mode: function(view_type, view_options) {
            sticky.clear_all();
            return this._super.apply(this, arguments);
        },
    });

    $(window).resize(function() {
        $('table').trigger('resize.stickyTableHeaders');
    });
});

