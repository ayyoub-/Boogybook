/**
* PSP.Page Namespace initialization
*
* @param {object} root The existing namespace container, if any, or an empty object.
*/
; (function (root) {
    var _modules = [];
    root.Page = {
        /** 
        * Register a module to be executed on the page 
        * @param {string} moduleName module name/path.
        * @param {object} options literal object to be passed to the module constructor.
        */
        registerModule: function (moduleName, options) {
            
            if (!moduleName || moduleName.length === 0 || /^\s+$/g.test(moduleName)) {
                throw new TypeError('moduleName');
            }
            moduleName = window.bundleUrl.replace("{0}", moduleName);
            _modules.push({
                name: moduleName,
                options: options || {}
            });
            
            if (window.modules != undefined) {
                
                var insertid = _modules.length - 1;
                
                window.modules.push(_modules[insertid]);

                var dupes = {};
                var singles = [];

                $.each(window.modules, function(i, el) {
                    if (!dupes[el.name]) {
                        dupes[el.name] = true;
                        singles.push(el);
                    } else {
                        $.each(singles, function(j, item) {
                            if (item.name == el.name) {
                                singles[j] = el;
                            }
                        });
                    }
                });
                window.modules = singles;
            } else {
                window.modules=_modules;
            }
            
        },
        /** 
        * Returns an array of module definition objects. 
        * Each object contains 
        * a [name] property (path of the module) and an [options] property 
        * @param {string} moduleName module name/path.
        * @param {object} options literal object to be passed to the module constructor.
        */
        getAllRegisteredModules: function () {
            return window.modules;
        },
        deleteAllRegisteredModules: function () {
            window.modules = [];
        }, 
        /**
         Returns significant module for Load
         * @param {string} moduleName module name/path.
        */
        loadSignificantModule: function(moduleName) {
                    var registeredModules = window.modules;
                    moduleName = window.bundleUrl.replace("{0}", moduleName);
                    var singles = [];
                    $.each(registeredModules, function(i,el) {
                        if (moduleName == el.name) {
                            singles.push(el);
                        }
                    });
                     return singles;
        }
    };
} (window.PSP = window.PSP || {}));