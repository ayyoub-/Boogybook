// Filename: main.js
/**
* Require/js entry point file.
* This file defines require's standard configuration,
* loads and launches registered modules.
*/

require.config({
    waitSeconds: 60,
    paths: {
        jquery: window.bundleUrl.replace("{0}", "Jquery"),
        backbone: window.bundleUrl.replace("{0}", "Backbone"),
        kendo: window.bundleUrl.replace("{0}", "Kendo"),
        jquery_validate: window.bundleUrl.replace("{0}", "JqueryValidation"),
        jquery_plugins: window.bundleUrl.replace("{0}", "JqueryPlugins"),
        jquery_unobtrusive: window.bundleUrl.replace("{0}", "JqueryUnobtrusive"),
        psp: window.bundleUrl.replace("{0}", "PSP"),
        grid_common: window.bundleUrl.replace("{0}", "GridCommon"),
        session: window.bundleUrl.replace("{0}", "Session"),
        accountCancellation: window.bundleUrl.replace("{0}", "AccountCancellation"),
        confirmationContract: window.bundleUrl.replace("{0}", "ConfirmationContract"),
        billingConfiguration: window.bundleUrl.replace("{0}", "BillingConfiguration"),
        acquirerApplication: window.bundleUrl.replace("{0}", "AcquirerApplication"),
        completionDetail: window.bundleUrl.replace("{0}", "CompletionDetail"),
        mpiExternalConfiguration: window.bundleUrl.replace("{0}", "MPIExternalConfiguration"),
        multipleUID: window.bundleUrl.replace("{0}", "MultipleUID"),
        pmGroupActivation: window.bundleUrl.replace("{0}", "PMGroupActivation"),
        otherEntity: window.bundleUrl.replace("{0}", "OtherEntity"),
        currency: window.bundleUrl.replace("{0}", "Currency"),
        alias: window.bundleUrl.replace("{0}", "Alias"),
        actionTrace: window.bundleUrl.replace("{0}", "ActionTrace")       
    },
    shim: {
        'jquery': {
            exports: '$'
        },
        'backbone': {
            deps: ['jquery'],
            exports: 'Backbone'
        },
        'kendo': {
            deps: ['jquery'],
            exports: 'Kendo'
        },
        'jquery_validate': {
            deps: ['jquery'],
            exports: '$'
        },
        'jquery_plugins': {
            deps: ['jquery'],
            exports: 'JqueryPlugin'
        },
        'grid_common': {
            deps: ['jquery'],
            exports: 'gridCommon'
        },
        'jquery_unobtrusive': {
            deps: ['jquery'],
            exports: 'Unobtrusive'
        }
    }
});

require(['jquery', 'backbone', 'psp'], function ($, Backbone, PSP) {
    $(function () {
        if (!window.PSP || !window.PSP.Page) {
            throw new ReferenceError('window.PSP or window.PSP.PageModules not defined. Check bootstrap code.');
        }
        PSP.init();
        PSP.ModuleManager.startAll(window.PSP.Page.getAllRegisteredModules());

    });
});
define(['kendo'], function (Kendo) {
});