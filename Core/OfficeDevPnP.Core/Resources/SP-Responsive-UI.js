/* PnP SharePoint - Responsiveness */
(function () {
    "use strict";
    var PnPResponsiveApp = PnPResponsiveApp || {};

    PnPResponsiveApp.responsivizeSettings = function () {
        // return if no longer on Settings page
        if (window.location.href.indexOf('/settings.aspx') < 0) return;

        // find the Settings root element, or wait if not available yet
        var settingsRoot = $(".ms-siteSettings-root");
        if (!settingsRoot.length) {
            setTimeout(PnPResponsiveApp.responsivizeSettings, 100);
            return;
        }

        $(".ms-siteSettings-root .ms-linksection-level1").each(function () {
            var self = $(this),
                settingsDiv = $('<div>');
            settingsDiv.addClass("pnp-settingsdiv");
            self.find(".ms-linksection-iconCell img").appendTo(settingsDiv);
            self.find(".ms-linksection-textCell").children().appendTo(settingsDiv);
            settingsDiv.appendTo(settingsRoot);
        });
        settingsRoot.find("table").remove();
    };


    PnPResponsiveApp.setUpToggling = function () {
        // if it is already responsivized, return
        if ($("#navbar-toggle").length)
            return;

        // Set up sidenav toggling
        var topNav = $('#DeltaTopNavigation'),
            topNavClone = topNav.clone();
        topNavClone.addClass('mobile-only');
        topNavClone.attr('id', topNavClone.attr('id') + "_mobileClone");
        topNav.addClass('no-mobile');
        $('#sideNavBox').append(topNavClone);

        var sideNavToggle = $('<button id="navbar-toggle" class="mobile-only burger" type="button"><span></span></button>');
        sideNavToggle.click(function (event) {
            event.preventDefault();
            $("body").toggleClass('shownav');
            $(this).toggleClass('selected');
        });
        $("#pageTitle").before(sideNavToggle);
    };

    PnPResponsiveApp.init = function () {
        if (!window.jQuery) {
            // jQuery is needed for PnP Responsive UI to run, and is not fully loaded yet, try later
            setTimeout(PnPResponsiveApp.init, 100);
        } else {
            $(function () { // only execute when DOM is fully loaded

                // embedding and loading of all necessary CSS files and JS libraries
                var currentScriptUrl = $('#PnPResponsiveUI').attr('src');
                if (typeof currentScriptUrl != "undefined") {
                    var currentScriptBaseUrl = currentScriptUrl.substring(0, currentScriptUrl.lastIndexOf("/") + 1);

                    addViewport();
                    loadCSS(currentScriptBaseUrl + 'sp-responsive-ui.css');
                }

                PnPResponsiveApp.setUpToggling();
                PnPResponsiveApp.responsivizeSettings();

                // also listen for dynamic page change to Settings page
                window.onhashchange = function () {
                    PnPResponsiveApp.responsivizeSettings();
                };

                // extend/override some SP native functions to fix resizing quirks
                var FixRibbonAndWorkspaceDimensions = function () {
                    // let SharePoint do its thing
                    originalResizeFunction();
                    // fix the body container width
                    $("#s4-bodyContainer").width($("#s4-workspace").width());
                };
                var originalResizeFunction = FixRibbonAndWorkspaceDimensions;

            });
        }
    };

    /* Dynamic CSS/JS embedding and loading */
    function loadCSS(url) {
        var head = document.getElementsByTagName('head')[0],
            style = document.createElement('link');
        style.type = 'text/css';
        style.rel = 'stylesheet';
        style.href = url;
        head.appendChild(style);
    }

    function loadScript(url, callback) {
        var head = document.getElementsByTagName('head')[0],
            script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;
        script.onreadystatechange = callback;
        script.onload = callback;
        head.appendChild(script);
    }

    function addViewport() {
        var head = document.getElementsByTagName('head')[0],
            viewport = document.createElement('meta');
        viewport.name = "viewport";
        viewport.content = "width=device-width, initial-scale=1";
        head.appendChild(viewport);
    }


// embedding of jQuery, and initialization of responsiveness when ready
    loadScript("//code.jquery.com/jquery-1.12.0.min.js", function () {
        PnPResponsiveApp.init();
    });
}());
