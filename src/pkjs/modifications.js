///////modifies the behaviour of the clay settings page

module.exports = function(minified) {
    var config = this;

    // Shows the six individual random-layout toggles only when the master
    // "Randomise" toggle is on. This is purely a config-page UI convenience
    // -- it doesn't gate anything on the watch side. Each RandomHour.../
    // RandomMinute... toggle already works independently once it's visible
    // (see prv_apply_random_layout() in monolith.c), and keeps whatever
    // value it was last set to even while hidden -- switching "Randomise"
    // back off does not turn them off, it just hides them from view.
    var updateRandomSectionVisibility = function() {
        var randomise = config.getItemByMessageKey("Randomise");
        if (!randomise) return;

        var isRandomiseOn = !!randomise.get();

        var keysToToggle = [
            "RandomHourLocation",
            "RandomMinuteLocation",
            "RandomHourSize",
            "RandomMinuteSize",
            "RandomHourFont",
            "RandomMinuteFont"
        ];

        for (var i = 0; i < keysToToggle.length; i++) {
            var item = config.getItemByMessageKey(keysToToggle[i]);
            if (item) {
                if (isRandomiseOn) { item.show(); } else { item.hide(); }
            }
        }
    };

    config.on(config.EVENTS.AFTER_BUILD, function () {
        var randomise = config.getItemByMessageKey("Randomise");
        if (randomise) {
            randomise.on('change', updateRandomSectionVisibility);
        }
        // Set the correct initial state as soon as the page has built,
        // rather than waiting for the first change event.
        updateRandomSectionVisibility();
    });
};