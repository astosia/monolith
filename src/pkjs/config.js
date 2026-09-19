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
    "items": [
      {
        "type": "heading",
        "defaultValue": "Digit Size & Position"
      },
      {
        "type": "toggle",
        "label": "Hour Digit Font",
        "messageKey": "HourFontChoice",
        "description": "Off = Wide, On = Tall",
        "defaultValue": false
      },
      {
        "type": "toggle",
        "label": "Minute Digit Font",
        "messageKey": "MinuteFontChoice",
        "description": "Off = Wide, On = Tall",
        "defaultValue": false
      }, 
      { "type": "select",
        "messageKey": "HourSize",
        "defaultValue": 0,
        "label": "Hour Size",
        "description": "Default = Small",
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
        "label": "Hour Position X",
        "description": "Default = Left",
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
        "label": "Hour Position Y",
        "description": "Default = Top",
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
        "label": "Minute Size",
        "description": "Default = Large",
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
        "label": "Minute Position X",
        "description": "Default = Centre",
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
        "label": "Minute Position Y",
        "description": "Default = Bottom",
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
        "label": "Randomise",
        "messageKey": "Randomise",
        "description": "Overrides the layout options above. Changes happen every minute",
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
  {
    "type": "submit",
    "defaultValue": "Save"
  },
//   {
//     "type": "section",
//     "capabilities": ["NOT_PLATFORM_APLITE", "NOT_PLATFORM_BASALT", "NOT_PLATFORM_CHALK", "NOT_PLATFORM_DIORITE", "NOT_PLATFORM_FLINT"],
//     "items": [
//     {
//         "type": "heading",
//         "defaultValue": "Weather"
//     },
//     {
//         "type": "toggle",
//         "messageKey": "UseWeather",
//         "label": "Show Weather",
//         "description": "current & forecast temp & condition icon replaces battery value",
//         "defaultValue": false
//     },
//     {
//         "type": "select",
//         "messageKey": "WeatherProv",
//         "defaultValue": "ds",
//         "label": "Weather Provider",
//         "options": [
//           {
//             "label": "Open-Meteo",
//             "value": "ds"
//           },
//           {
//             "label": "OpenWeatherMap",
//             "value": "owm"
//           }
//         ]
//       },
//       {
//         "type": "input",
//         "messageKey": "LocationQuery",
//         "label": "Location",
//         "description": "Start typing a city, place name or postcode/zipcode... Leave blank to use GPS location for weather and sunrise/sunset times. Location search data uses ©OpenStreetMap.",
//         "attributes": {
//           "placeholder": "e.g.: London, UK (leave blank to use GPS)"
//         }
//       },
//       {
//         "type": "input",
//         "messageKey": "Lat",
//         "defaultValue": ""
//       },
//       {
//         "type": "input",
//         "messageKey": "Long",
//         "defaultValue": ""
//       },
//       {
//         "type": "text",
//         "id": "LOCATION_DEBUG",
//         "defaultValue": ""
//       },
//       {
//         "type": "input",
//         "messageKey": "APIKEY_User",
//         "defaultValue": "",
//         "label": "OWM API Key",
//         "description": "Weather data uses Open-Meteo by default which does not require an API key.  If you prefer OpenWeatherMap, you can <a href =https://home.openweathermap.org/users/sign_up/>register for a free personal API key here</a>.",
//         "attributes": {
//           "placeholder": "Paste OpenWeatherMap API Key here, leave blank for Open-Meteo"
//         }
//       },
//       {
//         "type": "slider",
//         "messageKey": "UpSlider",
//         "defaultValue": 30,
//         "label": "Weather update frequency (minutes)",
//         "description": "More frequent requests will drain your phone battery more quickly",
//         "min": 15,
//         "max": 120,
//         "step": 15
//       },
//       {
//         "type": "toggle",
//         "messageKey": "RefreshWeatherOnLaunch",
//         "label": "Also Refresh Weather on Relaunch",
//         "description": "In addition to update interval above, also request fresh weather every time watchface loads. Off = keeps last known reading between relaunches",
//         "defaultValue": false
//       },
//       {
//         "type": "toggle",
//         "messageKey": "WeatherUnit",
//         "label": "Temperature in °C (off) or °F (on)",
//         "defaultValue": false
//       },
//       {
//         "type": "submit",
//         "defaultValue": "Save"
//       }
//     ]
//   },
  {
    "type": "section",
    "capabilities": [ "COLOR" ],
    "items": [
      {
        "type": "heading",
        "defaultValue": "Colours"
      },
      { "type": "select",
        "messageKey": "HourTransparency",
        "defaultValue": 30,
        "label": "Hour Transparency",
        "description": "Default = Slightly Transparent",
        "options": [
          {
            "label": "Opaque",
            "value": 0
          },
          {
            "label": "Slightly Transparent",
            "value": 30
          },
          {
            "label": "Very Transparent",
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
        "defaultValue": 30,
        "label": "Minute Transparency",
        "description": "Default = Slightly Transparent",
        "options": [
          {
            "label": "Opaque",
            "value": 0
          },
          {
            "label": "Slightly Transparent",
            "value": 30
          },
          {
            "label": "Very Transparent",
            "value": 50
          },
          {
            "label": "Invisible",
            "value": 80
          }
        ]
      },
      {
        "type": "radiogroup",
        "messageKey": "ThemeSelect",
        "capabilities": [ "COLOR" ],
        "defaultValue": "bl",
        "label": "COLOUR THEME SELECT",
        "options": [
          {
            "label": "White Background",
            "value": "wh"
          },
          {
            "label": "Black Background",
            "value": "bl"
          },
          {
              "label": "Blue Background",
              "value": "bu"
          },
          {
              "label": "Purple Background",
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
        "type": "radiogroup",
        "messageKey": "ThemeSelect",
        "capabilities": [ "BW" ],
        "defaultValue": "bl",
        "label": "COLOUR THEME SELECT",
        "options": [
          {
            "label": "White Background",
            "value": "wh"
          },
          {
            "label": "Black Background",
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
           "defaultValue": "Custom Colours"
      },
      {
        "type": "color",
        "label": "Background Colour",
        "messageKey": "BackgroundColor",
        "defaultValue": "000000"
      },
      {
        "type": "color",
        "label": "Hours Digits Colour",
        "messageKey": "HourDigitsColor",
        "capabilities": [ "BW" ],
        "allowGray": true,
        "defaultValue": "555555"
      },
      {
        "type": "color",
        "label": "Hours Digits Colour",
        "messageKey": "HourDigitsColor",
        "capabilities": [ "COLOR" ],
        "defaultValue": "FFFFAA"
      },
      {
        "type": "color",
        "label": "Minutes Digits Colour",
        "messageKey": "MinuteDigitsColor",
        "capabilities": [ "BW" ],
        "allowGray": true,
        "defaultValue": "000000"
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
        "defaultValue": "FF5500"
      },
      {
        "type": "color",
        "label": "Quiet Time and Bluetooth Icon Colour",
        "messageKey": "BTQTColor",
        "defaultValue": "000000"
      }
    ]
  },
  {
    "type": "submit",
    "defaultValue": "Save"
  },
];