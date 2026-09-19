module.exports = [
  {
    "type": "heading",
    "defaultValue": "Monolith"
  },
  {
    "type": "text",
    "defaultValue": "<p>by astosia</p>"
  },
  {
    "type": "section",
    "items": [
      {
        "type": "heading",
        "defaultValue": "Features"
      },
      
    //   {
    //     "type": "toggle",
    //     "label": "Digit Style",
    //     "messageKey": "Roman",
    //     "description": "Off = Numbers, On = Roman Numerals",
    //     "defaultValue": false
    //   },
    //   {
    //     "type": "toggle",
    //     "label": "Date visible",
    //     "messageKey": "EnableDate",
    //     "defaultValue": true
    //   },
    //   {
    //     "type": "radiogroup",
    //     "messageKey": "DateFormat",
    //     "defaultValue": "0",
    //     "options": [
    //       {
    //         "label": "DDD D (WED 9)", 
    //         "value": "0"
    //       },
    //       {
    //         "label": "MMM D (AUG 9)",
    //         "value": "1" 
    //       },
    //       {
    //          "label": "D MMM (9 AUG)", 
    //          "value": "2" 
    //       },
    //       {
    //          "label": "D (9), one digit day", 
    //          "value": "3" 
    //       },
    //       {
    //          "label": "DD (09), two digit day", 
    //          "value": "4" 
    //       }
    //     ]
    //   },
    //   {
    //     "type": "select",
    //     "messageKey": "DateLanguage",
    //     "defaultValue": "auto",
    //     "label": "Date Language",
    //     "options": [
    //       { "label": "Automatic (match watch)", "value": "auto" },
    //       { "label": "English",  "value": "en_EN" },
    //       { "label": "Español",  "value": "es_ES" },
    //       { "label": "Français", "value": "fr_FR" },
    //       { "label": "Deutsch",  "value": "de_DE" },
    //       { "label": "Italiano", "value": "it_IT" },
    //       { "label": "Português","value": "pt_PT" },
    //       { "label": "Svenska",  "value": "sv_SE" },
    //       { "label": "Dansk",    "value": "da_DK" },
    //       { "label": "Norsk",    "value": "no_NO" },
    //       { "label": "Suomi",   "value": "fi_FI" },
    //       { "label": "Nederlands","value": "nl_NL" }
    //     ]
    //   },
    //   {
    //     "type": "toggle",
    //     "label": "Battery Value visible",
    //     "messageKey": "EnableBattery",
    //     "defaultValue": true
    //   },
      {
        "type": "toggle",
        "label": "Battery Meter visible",
        "messageKey": "EnableBatteryLine",
        "defaultValue": true
      },
      {
        "type": "toggle",
        "label": "Bluetooth & Quiet Time Icons visible",
        "messageKey": "ShowBTQTIcons",
        "description": "Off hides both the Bluetooth-disconnected and Quiet Time icons whenever they'd otherwise appear.",
        "defaultValue": true
      },
      {
        "type": "toggle",
        "messageKey": "AddZero12h",
        "label": "Add leading zero to 12h time",
        "description": "Applies when 12h time selected in watch settings",
        "defaultValue": false
      },
      {
        "type": "toggle",
        "messageKey": "RemoveZero24h",
        "label": "Remove leading zero from 24h time",
        "description": "Applies when 24h time selected in watch settings",
        "defaultValue": false
      },
      {
        "type": "radiogroup",
        "messageKey": "VibeMode",
        "label": "Vibrate on Bluetooth Disconnect",
        "defaultValue": 0,
        "options": [
          {
            "label": "Respects Quiet Time", 
            "value": 0
          },
          {
            "label": "Always Vibrate on BT disconnect",
            "value": 1   
          },
          {
             "label": "Never Vibrate on BT disconnect", 
             "value": 2 
          }
          ]
        }
    ]
  },
  {
    "type": "section",
//    "capabilities": [ "COLOR" ],
    "items": [
      {
        "type": "heading",
        "defaultValue": "Colours",
        "capabilities": [ "COLOR" ]
      },
      {
        "type": "heading",
        "defaultValue": "Default Transparency = Semi-Opaque",
        "capabilities": [ "COLOR" ],
        "size": 5
      },
      {
        "type": "heading",
        "defaultValue": "Colours",
        "capabilities": [ "BW" ]
      },
      { "type": "select",
        "messageKey": "HourTransparency",
        "capabilities": [ "COLOR" ],
        "defaultValue": 30,
        "label": "Hour Transparency",
       // "description": "Default = Slight",
        "options": [
          {
            "label": "Solid/Opaque",
            "value": 0
          },
          {
            "label": "Semi-Opaque",
            "value": 30
          },
          {
            "label": "Faint",
            "value": 50
          },
          {
            "label": "Invisible",
            "value": 80
          }
        ]
      },
      { "type": "select",
        "messageKey": "MinuteTransparency",
        "capabilities": [ "COLOR" ],
        "defaultValue": 30,
        "label": "Minute Transparency",
        "options": [
          {
            "label": "Solid/Opaque",
            "value": 0
          },
          {
            "label": "Semi-Opaque",
            "value": 30
          },
          {
            "label": "Faint",
            "value": 50
          },
          {
            "label": "Invisible",
            "value": 80
          }
        ]
      },
      {
        "type": "select",
        "messageKey": "ThemeSelect",
        "capabilities": [ "COLOR" ],
        "defaultValue": "bl",
        "label": "COLOUR THEME",
        "options": [
          {
            "label": "White",
            "value": "wh"
          },
          {
            "label": "Black",
            "value": "bl"
          },
          {
              "label": "Blue",
              "value": "bu"
          },
          {
              "label": "Purple",
              "value": "pl"
          },
          {
              "label": "Black & Green",
              "value": "gr"
          },
          {
            "label": "Custom Colours",
            "value": "cu"
          }
        ]
      },
      {
        "type": "select",
        "messageKey": "ThemeSelect",
        "capabilities": [ "BW" ],
        "defaultValue": "bl",
        "label": "COLOUR THEME",
        "options": [
          {
            "label": "White",
            "value": "wh"
          },
          {
            "label": "Black",
            "value": "bl"
          },
          {
            "label": "Custom Colours",
            "value": "cu"
          }
        ]
      },
      {
           "type": "heading",
           "id": "CUSTOM_COLOURS_HEADING",
           "defaultValue": "Custom Colours"
      },
      {
        "type": "color",
        "label": "Background Colour",
        "messageKey": "BackgroundColor",
        "defaultValue": "000000",
        "allowGray": true
      },
      {
        "type": "color",
        "label": "Hours Digits Colour",
        "messageKey": "HourDigitsColor",
        "capabilities": [ "BW" ],
        "allowGray": true,
        "defaultValue": "AAAAAA"
      },
      {
        "type": "color",
        "label": "Hours Digits Colour",
        "messageKey": "HourDigitsColor",
        "capabilities": [ "COLOR" ],
        "defaultValue": "FFFF00"
      },
      {
        "type": "color",
        "label": "Minutes Digits Colour",
        "messageKey": "MinuteDigitsColor",
        "capabilities": [ "BW" ],
        "allowGray": true,
        "defaultValue": "FFFFFF"
      },
    {
        "type": "color",
        "label": "Minutes Digits Colour",
        "messageKey": "MinuteDigitsColor",
        "capabilities": [ "COLOR" ],
        "defaultValue": "00FFFF"
      },
    //   {
    //     "type": "color",
    //     "label": "Date, Battery & Weather Text Colour",
    //     "messageKey": "DateColor",
    //     "defaultValue": "000000"
    //   },
      {
        "type": "color",
        "label": "Battery Line Colour",
        "messageKey": "BatteryLineColor",
        "capabilities": [ "BW" ],
        "allowGray": true,
        "defaultValue": "FFFFFF"
      },
      {
        "type": "color",
        "label": "Battery Line Colour",
        "messageKey": "BatteryLineColor",
        "capabilities": [ "COLOR" ],
        "defaultValue": "AA0000"
      },
      {
        "type": "color",
        "label": "Quiet Time and Bluetooth Icon Colour",
        "messageKey": "BTQTColor",
        "capabilities": [ "COLOR" ],
        "defaultValue": "55AAFF"
      },
      {
        "type": "color",
        "label": "Quiet Time and Bluetooth Icon Colour",
        "messageKey": "BTQTColor",
        "capabilities": [ "BW" ],
        "allowGray": true,
        "defaultValue": "FFFFFF"
      }
    ]
  },
  {
        "type": "select",
        "messageKey": "PreviewPlatformOverride",
        "label": "Watch Model (if preview wrong)",
        "defaultValue": "auto",
        "options": [
          { "label": "Auto-detect (default)", "value": "auto" },
          { "label": "Pebble / Pebble Steel", "value": "aplite" },
          { "label": "Pebble Time / Time Steel", "value": "basalt" },
          { "label": "Pebble Time Round", "value": "chalk" },
          { "label": "Pebble 2 HR/SE", "value": "diorite" },
          { "label": "Pebble Time 2", "value": "emery" },
          { "label": "Pebble 2 Duo", "value": "flint" },
          { "label": "Pebble Round 2", "value": "gabbro" }
        ]
  },
  {
        "type": "text",
        "id": "LAYOUT_PREVIEW",
        "defaultValue": ""
  },
  {
    "type": "section",
    "items": [
      {
        "type": "heading",
        "defaultValue": "Digit Size & Position"
      },
      {
        "type": "toggle",
        "label": "Hour Font: Off = Wide, On = Narrow",
        "messageKey": "HourFontChoice",
        // "description": "Off = Wide, On = Tall",
        "defaultValue": false
      },
      {
        "type": "toggle",
        "label": "Minute Font: Off = Wide, On = Narrow",
        "messageKey": "MinuteFontChoice",
        //"description": "Off = Wide, On = Tall",
        "defaultValue": false
      }, 
      { "type": "select",
        "messageKey": "HourSize",
        "defaultValue": 1,
        "capabilities": [ "RECT" ],
        "label": "Hour Size, Default = Medium",
        //"description": "Default = Small",
        "options": [
          {
            "label": "Small",
            "value": 0
          },
          {
            "label": "Medium",
            "value": 1
          },
          {
            "label": "Large",
            "value": 2
          }
        ]
      },
       { "type": "select",
        "messageKey": "HourSize",
        "defaultValue": 0,
        "capabilities": [ "ROUND" ],
        "label": "Hour Size, Default = Small",
        //"description": "Default = Small",
        "options": [
          {
            "label": "Small",
            "value": 0
          },
          {
            "label": "Medium",
            "value": 1
          },
          {
            "label": "Large",
            "value": 2
          }
        ]
      },
      { "type": "select",
        "messageKey": "HourPositionX",
        "defaultValue": 0,
        "label": "Hour X, Default = Left",
        //"description": "Default = Left",
        "options": [
          {
            "label": "Left",
            "value": 0
          },
          {
            "label": "Centre",
            "value": 1
          },
          {
            "label": "Right",
            "value": 2
          }
        ]
      }, 
      { "type": "select",
        "messageKey": "HourPositionY",
        "defaultValue": 0,
        "label": "Hour Y, Default = Top",
       // "description": "Default = Top",
        "options": [
          {
            "label": "Top",
            "value": 0
          },
          {
            "label": "Middle",
            "value": 1
          },
          {
            "label": "Bottom",
            "value": 2
          }
        ]
      }, 
      { "type": "select",
        "messageKey": "MinuteSize",
        "defaultValue": 2,
        "capabilities": [ "RECT"],
        "label": "Minute Size, Default = Large",
        //"description": "Default = Large",
        "options": [
          {
            "label": "Small",
            "value": 0
          },
          {
            "label": "Medium",
            "value": 1
          },
          {
            "label": "Large",
            "value": 2
          }
        ]
      },
      { "type": "select",
        "messageKey": "MinuteSize",
        "defaultValue": 1,
        "capabilities": ["ROUND"],
        "label": "Minute Size, Default = Medium",
        //"description": "Default = Large",
        "options": [
          {
            "label": "Small",
            "value": 0
          },
          {
            "label": "Medium",
            "value": 1
          },
          {
            "label": "Large",
            "value": 2
          }
        ]
      },
      { "type": "select",
        "messageKey": "MinutePositionX",
        "defaultValue": 1,
        "label": "Minute X, Default = Centre",
        //"description": "Default = Centre",
        "options": [
          {
            "label": "Left",
            "value": 0
          },
          {
            "label": "Centre",
            "value": 1
          },
          {
            "label": "Right",
            "value": 2
          }
        ]
      }, 
      { "type": "select",
        "messageKey": "MinutePositionY",
        "defaultValue": 2,
        "label": "Minute Y, Default = Bottom",
        //"description": "Default = Bottom",
        "options": [
          {
            "label": "Top",
            "value": 0
          },
          {
            "label": "Middle",
            "value": 1
          },
          {
            "label": "Bottom",
            "value": 2
          }
        ]
      }, 
    ]
  },
  {
    "type": "section",
    "items": [
    //   {
    //     "type": "heading",
    //     "defaultValue": "Random Layout Options"
    //   },
      {
        "type": "toggle",
        "label": "Randomise Layout",
        "messageKey": "Randomise",
        "description": "Can't decide on a layout?  Randomise overrides the fixed layouts above every minute.  Turn on to see more options",
        "defaultValue": false
      },
      {
        "type": "toggle",
        "label": "Random Hour Position",
        "messageKey": "RandomHourLocation",
       // "description": "Overrides Hour Position X & Y",
        "defaultValue": false
      },
      {
        "type": "toggle",
        "label": "Random Minute Position",
        "messageKey": "RandomMinuteLocation",
       // "description": "Overrides Minute Position X & Y",
        "defaultValue": false
      },
      {
        "type": "toggle",
        "label": "Random Hour Size",
        "messageKey": "RandomHourSize",
       // "description": "Overrides Hour Size",
        "defaultValue": false
      },
      {
        "type": "toggle",
        "label": "Random Minute Size",
        "messageKey": "RandomMinuteSize",
       // "description": "Overrides Minute Size",
        "defaultValue": false
      },
      {
        "type": "toggle",
        "label": "Random Hour Font",
        "messageKey": "RandomHourFont",
        //"description": "Overrides Hour Digit Font",
        "defaultValue": false
      },
      {
        "type": "toggle",
        "label": "Random Minute Font",
        "messageKey": "RandomMinuteFont",
        //"description": "Overrides Minute Digit Font",
        "defaultValue": false
      },
    ]
  },
//   {
//     "type": "section",
//     "items": [
//       {
//         "type": "button",
//         "id": "RESTORE_DEFAULTS_BUTTON",
//         "defaultValue": "Restore to Defaults",
//         "description": "Resets every setting back to default. Does not save until you press Save below."
//       }
//     ]
//   },
  {
    "type": "submit",
    "defaultValue": "Save"
  },
];