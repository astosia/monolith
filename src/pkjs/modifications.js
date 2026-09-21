///////modifies the behaviour of the clay settings page

module.exports = function(minified) {
    var config = this;

    // -----------------------------------------------------------------
    // Randomise master toggle: shows/hides the six individual
    // random-layout toggles. Each RandomHour.../
    // RandomMinute... toggle works independently once it's
    // visible (see prv_apply_random_layout() in monolith.c), and keeps
    // whatever value it was last set to even while hidden -- switching
    // "Randomise" back off turns all random settings off in monolith.c
    // -----------------------------------------------------------------
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

    // -----------------------------------------------------------------
    // Custom Colours sub-section: shows "Custom Colours"
    // heading and color pickers when ThemeSelect is set to "cu"
    // -----------------------------------------------------------------
    var updateCustomColoursSectionVisibility = function() {
        var themeSelect = config.getItemByMessageKey("ThemeSelect");
        if (!themeSelect) return;

        var isCustom = themeSelect.get() === "cu";

        var heading = config.getItemById("CUSTOM_COLOURS_HEADING");
        if (heading) {
            if (isCustom) { heading.show(); } else { heading.hide(); }
        }

        var keysToToggle = [
            "BackgroundColor",
            "HourDigitsColor",
            "MinuteDigitsColor",
            "BatteryLineColor",
            "BTQTColor"
        ];

        for (var j = 0; j < keysToToggle.length; j++) {
            var item = config.getItemByMessageKey(keysToToggle[j]);
            if (item) {
                if (isCustom) { item.show(); } else { item.hide(); }
            }
        }
    };

    // -----------------------------------------------------------------
    // Live layout preview: draws a canvas approximating the watchface,
    // redrawn on all relevant settings changes. This mirrors the
    // geometry, font-size scaling and text-anchor logic from monolith.c
    //   - HourTransparency/MinuteTransparency: the watch blends toward
    //     black via fctx_set_color_bias (a dither-like effect), which
    //     this approximates with plain canvas alpha. Directionally
    //     correct (higher setting = fainter), not a pixel-exact match.
    // -----------------------------------------------------------------

    // ---- Subsetted watch fonts (digits 0-9 only), for the preview ----
    // These are subsets based on Underground (Johnston) and Tangent (Tandelle) ttf fonts
    var JOHNSTON_DIGITS_WOFF2_B64 = "d09GMgABAAAAAAQgAA0AAAAABwgAAAPSAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGhYbIBwqBmAANAqIGIZ9ATYCJANMCywABCAFBgcgG1wFUVQungh+JGRnQ1cBZR+T2L2z4IHes95MskqTBXUgVjkA+gLd9mAnHWDR///9Jnjk/IaJv49d1GZiTTSpRRJbyGuFWbacvfkGrKIoUE0Igz1cbbq0bk9IgpEgDLIVj3AvHUJahunlQRnvBhGADreARCDQlO9AI5xIROWqtU3cUQEsCwDCPIkkI/fz7Nqqb3eCg8FtVU4VM3EBOVk2BGqpR0VzCoo6IG0uCuddlVIFBCfrZNXNEuXJTwmlj+UKd4bfoXbxVC5ZjEYBJKgefxSERSUaKkSgxFg58luceLURC/g1IBXwBeEKYhxQFjABkBZXQCJoWG56K0hV9dbV4FDDJSrAcA3R9QBjiKunWycXXbU7HGKU02mbYrcz8sYNzekUoxza5BuMtNu6NHDVOhy35E1NHA7mZLp8QwPd7qjYYA9N8Rop3EQXRsNCxjb6vSajDGlDQ1MUbVTDF29nsiO3wcHozRvxTQxTNzfY/Hw95e40sOmK5nnbrTdpLqUNXRgDtZ7FBn2HzQz+BynsWuMKI6/WOJP1z6wR+BO2etPUnM4G92eqTp5461aDFYu+GDPGx4eJtbZUqxEjvNa/tb89bJj/R43lcmJP4HfosEDbdCIyBTczZ9ZcXLUK3M2YCf7cKojLvbOEi4R6KxIioyJrKOgYaayTJ3RvbXRPHQxqa5QNTX1L125OTutV+L9qXjA7lOmuI7ynq6KdbgWlznT2xOdhUzs9EbSxX6spoffZPs0J98btVZfmk3+9k49Ls30y/ayBFUPLkMDXd+NFWLUvBqv0Fvmd8a4K5KYLIEoy3iXNWJS/G8F3Q+Fwwrx3XSs6ZhHyr61CPrOQ9B5mTZ5kDO743jr7aGFszneJfOdZZhhl4x4IS2uSeGY8TFi9ukr3TqAfdsB7PUuFRsPb12bnwLzD2eiz+Lx9ZnvFNj/rB0V6IBvGR1c8CQelaHm54i0z4yo58TGg8GFWBYc9FQvxPqrVcdpSyE0I/hLdg3OiMaTj28eHC+Oyv2dmdQ3bZxDyra9CPnheMa4m7SPsG+sCHG9XbHa83dCtWIwJ47hCnk/JS7N4vxEWHzvku5X8Lr3nf4URDwHN+iSDlGjigQUq00g84u5csOKjOkA2HrA+y0TF1614k/jFzSG3dJP00k8AAvy2poVX6W/uUcpLgGuOmc8Anl+Z2u5//f+33bepOuCOBEDAfxDziA0yWlk7EHDv+MhgkDFo7CdevEGTsQfaIj9CocAHIeb+FDEKaaJaLVG2APWdKIrQnNKURAABNMTNCFWECytmmyvKQVhLKQgH";
    var TANDELLE_DIGITS_WOFF2_B64 = "d09GMgABAAAAAARQAA0AAAAAB2QAAAQBAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAG4JCHBoGYAA0ERAKhxyFfAE2AiQDLAsYAAQgBQYHIBvHBVGUTM5rIL46iMe4pjrPmMiqa/7K+k3QJPoVlWnwRHn//anqzr153WM6Y6/kZMAvaUWs6CVcAaBuKzVqKIb0cIOgICLzHDlHjWaO02cuc1IPjNPRPOAIO8vJTYqvUKmwUZfq7VduDeQfACu1lI4fO0zXRw5Is9KFiliAAhowzsTONW3m2S0h6O9BgEATOiEbl+3cTIoHMEMA2bBq+2ZSQADBo4CQIjTCAxV0Ygwb2ccJ7uA5vuIXFEVQwBNQSqhlb5KYlUzLJqlpBWKklry1xAIl47JxapEKQ7DiUVvevGye2lPUkFoto9a8ncS8ZLtsmhqCIQmAwyJnUBgDBKAC6DBMqetgpElLxMQQJ6uOEX+iUYd6CQ4rX8g5EtDnNAdy9dPyKT34O02UJHWgeECgF82aP20qw+hGf/3ENvV2R3gVEAAt65tAMxRQwAG1cAhJnmbwkIX+ZkA3I/c9YYcjRamG2McBKcKBOkANkIEgy4BUC0YUReBM5RKHeh9CaNvDx6b1K6ctqgR5Xkwq++WVk0pZgT8QckkOzs7RA7EQd3BuTIJEHwlzCXLw0Y73PvvsgyIHrwn5XRjvisVHcOChenc99dx9ECU7GHLfzlsffDYWT99/Mxz4sNXt91+vL4RcJHLgbvrGa0UOPhKCxELmujBvVhY1EggSMoKEKWbdiy6e4N41Ia8XU1g6OQcB6cs8dAdjUbFxz7yekugyK0JlCWlWnNx/fRNGu9vv9h689cZ7225/PHHjg8/On9x9iQfpAwsmAcxOJOiS3hXyV2TMLtoOu7B5T6i4u07Dx7avqz79Q/Z9tHMTdPOO0789Rax4a9fqx6VJcp00taVHm7oF+PmPvninW3uwO9mpUpan/aleHdF5Q2rLVIPLGo2pUUnuSg2bkTcGRwE3LlYLBOryrBDXlv/aqcPv3J7MHDExtOxNmycJ4qfbe6eL07K0Dgbrv8MMg41nSrYJTIDT313TiDw/iy0CPPxtu2mK2amzI/zs4ynHffB3H29T0H9T7GyeHpvSq3WQCHnag8Ea0bnFZew5RvzpfNsMmWFn0OGpHc1Tt6e2NU5lpyVqFZjG1SnSrc4KIpGh3ekJ+M2qN2Zk3ZGxlCeOftTqkfPXNwyIiaH73ded1BG2Tg8eObVbSDu5bvd99RHiAHt5213LlQKvcaDzSgNWg2qgm49PF6hrTQKRqVYNODiK+NP56briulSZVoYeHPYsuWKlHgCi3d/0zW0Bf0AeK9D3GlpkVQf9ljZ1PwC8sOaF3QDfvfdrL7vbuObuWiBFARBwRwwNXd8AcmCsYnPUZtTBqMRnNFW3SolUAhUC0TQqRKmCvxLeBZGtlBmMT5fpUkq4pbArGA8A";

    // Dripicons: 'z' (glyph name "bluetooth") for the BT icon and 
    // U+E061 (glyph name "volume-off", used as the mute-style
    // icon for quiet time) for the QT icon
    var DRIPICONS_ICONS_WOFF2_B64 = "d09GMgABAAAAAAH4AAwAAAAAA3AAAAGsAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGhYGVgA8EQgKgjyCJQE2AiQDCAsIAAQgBQYHIBt8AgCOwziGvERM5UNTYjMien6szb5/oohVSyRChkTFs5Zk0jx3SPUy/v+vtft30VlMtImnFWUWMa/mcSRiUkmeoHFIdNVI22e246FNeGAz+4nudjfwLNYAoyBNu1umuQ1Rf4uwdUwwAUSUiBTyg65BNKwd7OdbM4HeoHSHAMgCAA7ay1uxi5v7JnZP90grhiCAQsOKJmA6ttFzUb9BBExaWN+IiuSfUKCBHnq4BvcAVgBN22pKv1HIlVX24yUfAc6kGCGwwiL4iiv+Vjz5iirOylN+1UYDclgj+Vi4ZQGeRJWqYj+QmXKqkpc4jh23TaKPwC378RYHaQZeRfZ8K6yyr+hjiaDLZhuNjB9e/bkf6bS/br/37a1tbUQVXm063ZH7baYdx4+O814V/b5/v28Tv7h7uzzu7st1vna+AHLbVZ5TGp89dj2SHzXadi7hJ8F5Xq2NvSMSe87thcVi844OIlFRif+R2930Ftnor7gE58At5J3ZeFrLJ3sHQ3i/2ftvcM+bOakUgF+ftVVvVDYUTMHAQIFQIcJO4YLQ88MUcItFQYuXKQionkYK";

    var PREVIEW_FONT_WIDE = "MonolithJohnstonPreview";
    var PREVIEW_FONT_TALL = "MonolithTandellePreview";
    var PREVIEW_FONT_ICONS = "MonolithDripiconsPreview";

    var previewFontsReady = null; // Promise, set once loading starts

    var loadPreviewFonts = function() {
        if (previewFontsReady) return previewFontsReady;

        if (typeof FontFace === 'undefined' || typeof document === 'undefined' || !document.fonts) {
            previewFontsReady = Promise.resolve();
            return previewFontsReady;
        }

        var johnstonFace = new FontFace(
            PREVIEW_FONT_WIDE,
            "url(data:font/woff2;base64," + JOHNSTON_DIGITS_WOFF2_B64 + ")"
        );
        var tandelleFace = new FontFace(
            PREVIEW_FONT_TALL,
            "url(data:font/woff2;base64," + TANDELLE_DIGITS_WOFF2_B64 + ")"
        );
        var dripiconsFace = new FontFace(
            PREVIEW_FONT_ICONS,
            "url(data:font/woff2;base64," + DRIPICONS_ICONS_WOFF2_B64 + ")"
        );

        previewFontsReady = Promise.all([johnstonFace.load(), tandelleFace.load(), dripiconsFace.load()])
            .then(function(loadedFaces) {
                for (var i = 0; i < loadedFaces.length; i++) {
                    document.fonts.add(loadedFaces[i]);
                }
            })
            .catch(function(err) {
                console.error("Preview font load failed, falling back to system fonts:", err);
            });

        return previewFontsReady;
    };

    var PLATFORM_SCREENS = {
        aplite:  { w: 144, h: 168, round: false, bw: true  },
        basalt:  { w: 144, h: 168, round: false, bw: false },
        chalk:   { w: 180, h: 180, round: true,  bw: false, battYRatio: 0.94, battWidthPx: 86,  battHeightPx: 2 },
        diorite: { w: 144, h: 168, round: false, bw: true  },
        emery:   { w: 200, h: 228, round: false, bw: false },
        flint:   { w: 144, h: 168, round: false, bw: true  },
        gabbro:  { w: 260, h: 260, round: true,  bw: false, battYRatio: 0.92, battWidthPx: 124, battHeightPx: 3 }
    };

    // Pebble's reflective LCD renders the raw 64-color palette differently
    // than the nominal RGB values suggest -- colors read more muted under
    // real lighting than a plain hex swatch implies. This is the official
    // sunlight-corrected table (the same data behind the Sunlight/
    // Uncorrected toggle on developer.rebble.io's Color Picker Tool, and
    // the "Sunlight, color-corrected for HD displays" .aseprite palette
    // linked from the Images guide): each of the 64 raw palette hexes
    // mapped to the hex that actually approximates how it looks on-device.
    // Applied to every resolved color right before drawing (see
    // applySunlightCorrection() below), whether it came from a ThemeSelect
    // preset or a custom color picker.
    var SUNLIGHT_CORRECTED = {
        "000000": "000000", "000055": "001E41", "0000AA": "004387", "0000FF": "0068CA", "005500": "2B4A2C", "005555": "27514F", "0055AA": "16638D", "0055FF": "007DCE", "00AA00": "5E9860", "00AA55": "5C9B72", "00AAAA": "57A5A2", "00AAFF": "4CB4DB", "00FF00": "8EE391", "00FF55": "8EE69E", "00FFAA": "8AEBC0", "00FFFF": "84F5F1", "550000": "4A161B", "550055": "482748", "5500AA": "40488A", "5500FF": "2F6BCC", "555500": "564E36", "555555": "545454", "5555AA": "4F6790", "5555FF": "4180D0", "55AA00": "759A64", "55AA55": "759D76", "55AAAA": "71A6A4", "55AAFF": "69B5DD", "55FF00": "9EE594", "55FF55": "9DE7A0", "55FFAA": "9BECC2", "55FFFF": "95F6F2", "AA0000": "99353F", "AA0055": "983E5A", "AA00AA": "955694", "AA00FF": "8F74D2", "AA5500": "9D5B4D", "AA5555": "9D6064", "AA55AA": "9A7099", "AA55FF": "9587D5", "AAAA00": "AFA072", "AAAA55": "AEA382", "AAAAAA": "ABABAB", "AAAAFF": "A7BAE2", "AAFF00": "C9E89D", "AAFF55": "C9EAA7", "AAFFAA": "C7F0C8", "AAFFFF": "C3F9F7", "FF0000": "E35462", "FF0055": "E25874", "FF00AA": "E16AA3", "FF00FF": "DE83DC", "FF5500": "E66E6B", "FF5555": "E6727C", "FF55AA": "E37FA7", "FF55FF": "E194DF", "FFAA00": "F1AA86", "FFAA55": "F1AD93", "FFAAAA": "EFB5B8", "FFAAFF": "ECC3EB", "FFFF00": "FFEEAB", "FFFF55": "FFF1B5", "FFFFAA": "FFF6D3", "FFFFFF": "FFFFFF"
    };

    var applySunlightCorrection = function(hex) {
        if (!hex) return hex;
        var key = String(hex).replace('#', '').toUpperCase();
        var corrected = SUNLIGHT_CORRECTED[key];
        return corrected ? ('#' + corrected) : hex;
    };

    // Hardcoded per-theme GColors from monolith.c ThemeSelect branches
    // (prv_inbox_received_handler) -- these values exist only in the C
    // code, nowhere in the JS settings, so a preview has to duplicate
    // them to show what a non-"cu" theme will actually look like.
    var THEME_COLORS = {
        bw: {
            wh: { bg: "#FFFFFF", hour: "#AAAAAA", minute: "#000000", battery: "#000000", btqt: "#000000" },
            bl: { bg: "#000000", hour: "#AAAAAA", minute: "#FFFFFF", battery: "#FFFFFF", btqt: "#FFFFFF" }
        },
        color: {
            wh: { bg: "#FFFFFF", hour: "#555500", minute: "#0000AA", battery: "#AA0000", btqt: "#AAAAAA" },
            bl: { bg: "#000000", hour: "#FFFF00", minute: "#00FFFF", battery: "#AA0000", btqt: "#55AAFF" },
            bu: { bg: "#0000FF", hour: "#000055", minute: "#FFFF00", battery: "#00FF00", btqt: "#55AAFF" },
            pl: { bg: "#AA00AA", hour: "#000000", minute: "#FFAAFF", battery: "#550000", btqt: "#550055" },
            gr: { bg: "#000000", hour: "#005500", minute: "#00FF00", battery: "#FFFF00", btqt: "#000000" }
        }
    };

    // -----------------------------------------------------------------
    // Platform detection for the preview, with a manual escape hatch.
    // Pebble.getActiveWatchInfo().platform is meant to auto-detect the
    // connected watch, but this isn't working.  
    // "PreviewPlatformOverride" instead lets the user select which watch they have.
    // -----------------------------------------------------------------
    var getPlatformInfo = function() {
        var overrideItem = config.getItemByMessageKey("PreviewPlatformOverride");
        var overrideVal = overrideItem && overrideItem.get();
        if (overrideVal && overrideVal !== "auto" && PLATFORM_SCREENS[overrideVal]) {
            return PLATFORM_SCREENS[overrideVal];
        }

        var platform = (typeof Pebble !== 'undefined' && Pebble.getActiveWatchInfo &&
                         Pebble.getActiveWatchInfo().platform) || 'basalt';
        return PLATFORM_SCREENS[platform] || PLATFORM_SCREENS.basalt;
    };

    // Matches HourPositionX/MinutePositionX's switch in update_proc():
    // the three X stops differ depending on whether the wide or tall
    // font is selected.
    var computeAxisX = function(tallFont, posSetting, width) {
        var stops = tallFont
            ? [width * 1 / 4, width * 2 / 4, width * 3 / 4]
            : [width * 1 / 3, width * 2 / 4, width * 2 / 3];
        return stops[posSetting] !== undefined ? stops[posSetting] : stops[2];
    };

    // Matches HourPositionY/MinutePositionY -- round platforms use
    // 1/10, 5/10, 9/10; rect uses 5/100, 50/100, 95/100.
    var computeAxisY = function(posSetting, height, round) {
        var stops = round
            ? [height * 1 / 10, height * 5 / 10, height * 9 / 10]
            : [height * 5 / 100, height * 50 / 100, height * 95 / 100];
        return stops[posSetting] !== undefined ? stops[posSetting] : stops[2];
    };

    // Matches hour_scale/minute_scale -- same three values used for
    // both Hour and Minute, different table for round vs. rect
    var computeCapHeight = function(sizeSetting, screenHeight, round) {
        var stops = round ? [400, 550, 700] : [500, 650, 800];
        var scale = stops[sizeSetting] !== undefined ? stops[sizeSetting] : stops[2];
        return screenHeight * scale / 1000;
    };

    var parseClayColor = function(value, fallback) {
        if (value === undefined || value === null || value === '') return fallback;
        var hex;
        if (typeof value === 'number') {
            hex = value.toString(16);
        } else {
            hex = String(value).replace(/^#|^0x/i, '');
        }
        while (hex.length < 6) hex = '0' + hex;
        if (hex.length > 6) hex = hex.slice(-6); // defensive: drop a stray alpha byte
        if (!/^[0-9a-fA-F]{6}$/.test(hex)) return fallback;
        return '#' + hex.toUpperCase();
    };

    var getVal = function(key, fallback) {
        var item = config.getItemByMessageKey(key);
        if (!item) return fallback;
        var v = item.get();
        return (v === undefined || v === null || v === '') ? fallback : v;
    };

    var getIntVal = function(key, fallback) {
        var v = parseInt(getVal(key, fallback), 10);
        return isNaN(v) ? fallback : v;
    };

    var getBoolVal = function(key, fallback) {
        var item = config.getItemByMessageKey(key);
        if (!item) return fallback;
        return !!item.get();
    };

    // Multiple preview instances since sticky isn't available
    // Add more ids to PREVIEW_ANCHOR_IDS (and a matching "text" item with that "id" in
    // config.js) for further instances if needed.
    var PREVIEW_ANCHOR_IDS = ["LAYOUT_PREVIEW", "LAYOUT_PREVIEW_2"];
    var previewInstances = []; // [{ id, canvas, ctx }, ...]

    var ensurePreviewCanvases = function() {
        for (var i = 0; i < PREVIEW_ANCHOR_IDS.length; i++) {
            var id = PREVIEW_ANCHOR_IDS[i];

            var alreadyBuilt = false;
            for (var j = 0; j < previewInstances.length; j++) {
                if (previewInstances[j].id === id) { alreadyBuilt = true; break; }
            }
            if (alreadyBuilt) continue;

            // The "text" component's own template
            // (templates/components/text.tpl) never binds {{id}} onto any
            // element -- a plain "text" item's id is a JS-side ClayItem
            // property only, never a real HTML id attribute -- so
            // document.getElementById(id) can never find one of these and
            // isn't worth trying. This goes via config.getItemById()'s
            // $manipulatorTarget instead: the inner
            // <p data-manipulator-target> the text component actually
            // renders, not its outer wrapping <div class="component
            // component-text">.
            var container = null;
            var anchor = config.getItemById(id);
            if (anchor && anchor.$manipulatorTarget) {
                container = anchor.$manipulatorTarget[0] || anchor.$manipulatorTarget;
            }

            if (!container || !container.parentNode) {
                console.error(id + " anchor not found in the built page -- that preview canvas was not inserted.");
                continue;
            }

            var wrapper = document.createElement('div');
            wrapper.style.display = 'flex';
            wrapper.style.justifyContent = 'center';
            wrapper.style.padding = '12px 0';

            var canvas = document.createElement('canvas');
            canvas.style.maxWidth = '200px';
            canvas.style.width = '100%';
            canvas.style.height = 'auto';
            canvas.style.border = '1px solid #888';
            canvas.style.borderRadius = '4px';

            wrapper.appendChild(canvas);
            container.parentNode.replaceChild(wrapper, container);

            previewInstances.push({ id: id, canvas: canvas, ctx: canvas.getContext('2d') });
        }

        return previewInstances.length > 0;
    };

    var drawPreview = function() {
        if (!ensurePreviewCanvases()) return;

        var screen = getPlatformInfo();
        var w = screen.w;
        var h = screen.h;

        var palette = screen.bw ? THEME_COLORS.bw : THEME_COLORS.color;

        var theme = getVal("ThemeSelect", "bl");
        var themeColors = palette[theme]; // undefined when theme === "cu"

        var bg, hourColor, minuteColor, batteryColor, btqtColor;
        if (themeColors) {
            bg = themeColors.bg;
            hourColor = themeColors.hour;
            minuteColor = themeColors.minute;
            batteryColor = themeColors.battery;
            btqtColor = themeColors.btqt;
        } else {
            bg = parseClayColor(getVal("BackgroundColor"), "#000000");
            hourColor = parseClayColor(getVal("HourDigitsColor"), "#AAAAAA");
            minuteColor = parseClayColor(getVal("MinuteDigitsColor"), "#FFFFFF");
            batteryColor = parseClayColor(getVal("BatteryLineColor"), "#FFFFFF");
            btqtColor = parseClayColor(getVal("BTQTColor"), "#FFFFFF");
        }

        // Sunlight-corrected values from here onwards, regardless of whether the
        // color came from a theme preset or a custom picker.
        bg = applySunlightCorrection(bg);
        hourColor = applySunlightCorrection(hourColor);
        minuteColor = applySunlightCorrection(minuteColor);
        batteryColor = applySunlightCorrection(batteryColor);
        btqtColor = applySunlightCorrection(btqtColor);

        // ---- Hour / Minute digits ----
        var hourTall = getBoolVal("HourFontChoice", false);
        var minuteTall = getBoolVal("MinuteFontChoice", false);

        var hourX = computeAxisX(hourTall, getIntVal("HourPositionX", 0), w);
        var hourY = computeAxisY(getIntVal("HourPositionY", 0), h, screen.round);
        var minuteX = computeAxisX(minuteTall, getIntVal("MinutePositionX", 1), w);
        var minuteY = computeAxisY(getIntVal("MinutePositionY", 2), h, screen.round);

        var hourCap = computeCapHeight(getIntVal("HourSize", screen.round ? 0 : 1), h, screen.round);
        var minuteCap = computeCapHeight(getIntVal("MinuteSize", screen.round ? 1 : 2), h, screen.round);

        // "Opaque" (0) through "Invisible" (80) is the full
        // transparency range -- 80 is the maximum defined value.
        // BW platforms always render opaque regardless of this
        // setting so preview ignores HourTransparency/MinuteTransparency
        // when screen.bw is true.
        var hourOpacity = screen.bw ? 1 : (1 - getIntVal("HourTransparency", 30) / 80);
        var minuteOpacity = screen.bw ? 1 : (1 - getIntVal("MinuteTransparency", 30) / 80);

        // Fixed preview time: 9:47. Real hour/minute values make the
        // preview redraw every minute for no visual reason once the
        // settings themselves are stable, and a fixed time makes it easier
        // to compare screenshots/layouts across changes. Zero-padding
        // mirrors update_time_buffers() in monolith.c exactly: 12-hour
        // mode omits the leading zero unless AddZero12h is on; 24-hour
        // mode keeps it unless RemoveZero24h is on. 9am is the same digit
        // either way (9, not 09-vs-21), so only the padding differs
        // between modes here.
        //
        // clock_is_24h_style() has no direct equivalent available to a
        // Clay config page. The Intl-based guess below approximates it
        // from the WebView's locale, but that's a guess about the
        // *phone's* locale, not the watch's actual Date & Time format
        // setting -- the two aren't guaranteed to agree, and when they
        // don't, AddZero12h/RemoveZero24h look broken (whichever one
        // actually matches the watch has no visible effect on the
        // preview, since the preview thinks it's in the other mode).
        // PreviewTimeFormatOverride is the same escape hatch pattern as
        // PreviewPlatformOverride above: "auto" keeps the Intl guess,
        // otherwise the explicit choice wins outright.
        var timeFormatOverride = getVal("PreviewTimeFormatOverride", "auto");
        var is24h;
        if (timeFormatOverride === "12h") {
            is24h = false;
        } else if (timeFormatOverride === "24h") {
            is24h = true;
        } else {
            is24h = false;
            try {
                is24h = !Intl.DateTimeFormat(undefined, { hour: 'numeric' }).resolvedOptions().hour12;
            } catch (e) {
                is24h = false; // Intl unavailable or threw -- default to 12-hour
            }
        }

        var FIXED_HOUR_24 = 9;
        var FIXED_MINUTE = 47;

        var hourNoLeadingZero = (!is24h && !getBoolVal("AddZero12h", false)) ||
                                 (is24h && getBoolVal("RemoveZero24h", false));
        var hourText = hourNoLeadingZero
            ? String(FIXED_HOUR_24)
            : (FIXED_HOUR_24 < 10 ? '0' + FIXED_HOUR_24 : String(FIXED_HOUR_24));
        var minuteText = (FIXED_MINUTE < 10 ? '0' : '') + FIXED_MINUTE;

        var hourPosY = getIntVal("HourPositionY", 0);
        var minutePosY = getIntVal("MinutePositionY", 2);
        var showBattery = getBoolVal("EnableBatteryLine", true);
        var showBtqt = getBoolVal("ShowBTQTIcons", true);

        // posSetting 0/1/2 (Top/Middle/Bottom) matches fctx's
        // FTextAnchorCapTop/CapMiddle/Baseline -- all three are defined
        // relative to the glyph's cap height, not the font's em box.
        // ctx.measureText() is per-context state, so this (and everything
        // below it) has to run once per canvas instance, not once overall
        // -- unlike the values above, which are the same for every canvas
        // and are computed only once.
        var drawDigits = function(ctx, text, x, y, capHeightPx, tall, color, opacity, posSetting) {
            ctx.save();
            ctx.globalAlpha = opacity;
            ctx.fillStyle = color;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'alphabetic';

            var family = tall
                ? "'" + PREVIEW_FONT_TALL + "', 'Arial Narrow', 'Helvetica Neue Condensed', sans-serif"
                : "'" + PREVIEW_FONT_WIDE + "', 'Helvetica Neue', Arial, sans-serif";

            // Two-pass sizing: CSS font-size sets the em box, not the
            // cap height, and that ratio varies per font. Render at a
            // trial size, measure the actual cap height it produced,
            // then scale so the *measured* cap height matches
            // capHeightPx exactly, rather than guessing a fixed
            // multiplier.
            var trialPx = Math.max(1, Math.round(capHeightPx));
            ctx.font = trialPx + "px " + family;
            var trialMetrics = ctx.measureText(text);
            var trialAscent = trialMetrics.actualBoundingBoxAscent || (trialPx * 0.72);

            var fontPx = trialAscent > 0 ? Math.round(trialPx * (capHeightPx / trialAscent)) : trialPx;
            ctx.font = fontPx + "px " + family;

            var metrics = ctx.measureText(text);
            var ascent = metrics.actualBoundingBoxAscent || capHeightPx;

            var baselineY;
            if (posSetting === 0) {          // Top: digit starts at y, grows downward
                baselineY = y + ascent;
            } else if (posSetting === 1) {   // Middle: digit centred on y
                baselineY = y + ascent / 2;
            } else {                          // Bottom: digit's baseline sits at y
                baselineY = y;
            }

            ctx.fillText(text, x, baselineY);
            ctx.restore();
        };

        var paintOneCanvas = function(instance) {
            var canvas = instance.canvas;
            var ctx = instance.ctx;
            canvas.width = w;
            canvas.height = h;

            // ---- Background (clipped to a circle on round platforms) ----
            ctx.save();
            if (screen.round) {
                ctx.beginPath();
                ctx.arc(w / 2, h / 2, Math.min(w, h) / 2, 0, Math.PI * 2);
                ctx.clip();
            }
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, w, h);

            drawDigits(ctx, minuteText, minuteX, minuteY, minuteCap, minuteTall, minuteColor, minuteOpacity, minutePosY);
            drawDigits(ctx, hourText, hourX, hourY, hourCap, hourTall, hourColor, hourOpacity, hourPosY);

            // ---- Battery line ----
            if (showBattery) {
                var battPct = 0.65; // representative fill level -- preview only, not live battery data
                var battH, battY, battContainerW, battFillW, battFillX;

                if (screen.battYRatio !== undefined) {
                    battH = screen.battHeightPx;
                    battY = h * screen.battYRatio;
                    battContainerW = screen.battWidthPx;
                    battFillW = battContainerW * battPct;
                    battFillX = (w - battFillW) / 2;
                } else if (screen.round) {
                    battH = Math.max(2, h * 0.018);
                    battY = h * 9 / 10 - battH;
                    battContainerW = w * 0.65;
                    battFillW = battContainerW * battPct;
                    battFillX = (w - battFillW) / 2;
                } else {
                    battH = Math.max(2, h * 0.018);
                    battY = h - battH;
                    battContainerW = w;
                    battFillW = battContainerW * battPct;
                    battFillX = 0;
                }

                ctx.globalAlpha = 1;
                ctx.fillStyle = batteryColor;
                ctx.fillRect(battFillX, battY, battFillW, battH);
            }

            // ---- Bluetooth / Quiet Time icons ----
            // Uses dripicons font
            if (showBtqt) {
                var iconSize = w * 0.09;
                ctx.globalAlpha = 1;
                ctx.fillStyle = btqtColor;
                ctx.font = Math.round(iconSize) + "px '" + PREVIEW_FONT_ICONS + "', sans-serif";
                ctx.textAlign = 'center';
                ctx.textBaseline = 'top';

                if (screen.round) {
                    var btqtGap = iconSize * 1.1;
                    var btqtRoundY = h * 0.00;
                    ctx.fillText('z', w / 2 - btqtGap / 2, btqtRoundY);      // bluetooth
                    ctx.fillText('\uE061', w / 2 + btqtGap / 2, btqtRoundY); // quiet time
                } else {
                    ctx.fillText('\uE061', w * 0.90, h * 0.02); // quiet time
                    ctx.fillText('z', w * 0.80, h * 0.02);      // bluetooth
                }
            }

            ctx.restore();

            canvas.style.borderRadius = screen.round ? '50%' : '4px';
        };

        for (var k = 0; k < previewInstances.length; k++) {
            paintOneCanvas(previewInstances[k]);
        }
    };

    // Every settings key that visibly affects the preview. Random keys
    // are deliberately excluded -- they change what happens live on the
    // watch minute to minute, not the base layout on the preview
    var PREVIEW_WATCHED_KEYS = [
        "HourPositionX", "HourPositionY", "HourSize", "HourFontChoice",
        "MinutePositionX", "MinutePositionY", "MinuteSize", "MinuteFontChoice",
        "ThemeSelect", "BackgroundColor", "HourDigitsColor", "MinuteDigitsColor",
        "BatteryLineColor", "BTQTColor", "HourTransparency", "MinuteTransparency",
        "EnableBatteryLine", "ShowBTQTIcons", "AddZero12h", "RemoveZero24h",
        "PreviewPlatformOverride", "PreviewTimeFormatOverride"
    ];

    config.on(config.EVENTS.AFTER_BUILD, function () {
        var randomise = config.getItemByMessageKey("Randomise");
        if (randomise) {
            randomise.on('change', updateRandomSectionVisibility);
        }
        // Set the correct initial state as soon as the page has built,
        // rather than waiting for the first change event.
        updateRandomSectionVisibility();

        var themeSelectItem = config.getItemByMessageKey("ThemeSelect");
        if (themeSelectItem) {
            themeSelectItem.on('change', updateCustomColoursSectionVisibility);
        }
        updateCustomColoursSectionVisibility();

        var restoreBtn = config.getItemById("RESTORE_DEFAULTS_BUTTON");
        if (restoreBtn) {
            restoreBtn.on('click', restoreDefaults);
        }

        for (var i = 0; i < PREVIEW_WATCHED_KEYS.length; i++) {
            var item = config.getItemByMessageKey(PREVIEW_WATCHED_KEYS[i]);
            if (item) {
                item.on('change', drawPreview);
            }
        }

        // Draw immediately with system-font stand-ins so something
        // useful shows right away, then redraw with the real watch
        // fonts once they've finished loading (typically well under
        // 50ms given how small these subsets are).
        drawPreview();
        loadPreviewFonts().then(drawPreview);


    });
};