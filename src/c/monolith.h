#pragma once
#include <pebble.h>

#define SETTINGS_KEY 1

typedef struct ClaySettings {
  bool EnableBatteryLine;
  //bool EnableDate;
  int VibeMode;
//  char DateFormat[4];
  bool AddZero12h;
  bool RemoveZero24h;
  bool showAMPM;
  bool HourFontChoice;
  bool MinuteFontChoice;
  int MinuteTransparency;
  int HourTransparency;
//   int MinuteCentreSize;
  char ThemeSelect[4];
  GColor BackgroundColor;
  //GColor DateColor;
  GColor HourDigitsColor;
  GColor MinuteDigitsColor;
  GColor BatteryLineColor;
  GColor BTQTColor;

  int HourPositionX;
  int HourPositionY;    
  int MinutePositionX;
  int MinutePositionY;
  int HourSize;
  int MinuteSize;
  //int UpSlider;
  bool RandomHourLocation;
  bool RandomMinuteLocation;
  bool RandomHourSize;
  bool RandomMinuteSize;
  bool RandomHourFont;
  bool RandomMinuteFont;
  bool ShowBTQTIcons;
  bool Randomise;
} __attribute__((__packed__)) ClaySettings;