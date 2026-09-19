#include <pebble.h>
#include "monolith.h"
#include <pebble-fctx/fctx.h>
#include <pebble-fctx/fpath.h>
#include <pebble-fctx/ffont.h>

//#define BACKLIGHTON   ///Use this for ShareX screencapture GIFs

static Window *s_window;
static Layer *s_time_layer;
static Layer *s_battery_layer;
static Layer *s_canvas_qt_icon_layer;
static Layer *s_canvas_bt_icon_layer;

/////FCTX fonts
static FFont *s_font_wide;
static FFont *s_font_tall;
static GFont FontBTQTIcons;
//static FFont *s_font_wide_outline;

static char s_hour_buffer[3];
static char s_minute_buffer[3];

static ClaySettings settings;

typedef struct {
  GRect BTIconRect[1];
  GRect QTIconRect[1];
  GRect BatteryLineRect[1];
} UIConfig;

#ifdef PBL_PLATFORM_EMERY
static const UIConfig config = {
  .BTIconRect = {{{200-40,2}, {20, 20}}},
  .QTIconRect = {{{200-20, 2}, {20, 20}}},
  .BatteryLineRect = {{{0, 224}, {200, 4}}}
};
#elif defined(PBL_PLATFORM_GABBRO)
static const UIConfig config = {
  .BTIconRect = {{{130-20, 2}, {20, 20}}},
  .QTIconRect = {{{130, 2}, {20, 20}}},
  .BatteryLineRect = {{{0, 260*0.92}, {124, 3}}}
};
#elif defined(PBL_PLATFORM_CHALK)
static const UIConfig config = {
  .BTIconRect = {{{90-20, 0}, {20, 20}}},
  .QTIconRect = {{{90, 0}, {20, 20}}},
  .BatteryLineRect = {{{0, 180*0.94}, {86, 2}}}
};
#else
static const UIConfig config = {
  .BTIconRect = {{{144-40, 0}, {20, 20}}},
  .QTIconRect = {{{144-20, 0}, {20, 20}}},
  .BatteryLineRect = {{{0, 166}, {144, 3}}}
};
#endif

bool connected = true;
bool ignore_next_tap = false;

static void prv_save_settings(void) {
  persist_write_data(SETTINGS_KEY, &settings, sizeof(settings));
}

static void prv_default_settings(void) {
 
//  settings.EnableDate = true;
  settings.AddZero12h = false;
  settings.RemoveZero24h = false;
  settings.EnableBatteryLine = true;
  settings.VibeMode = 0;

  settings.HourTransparency = 30;
  settings.MinuteTransparency = 30;
  settings.HourPositionX = 0;
  settings.HourPositionY = 0;
  settings.MinutePositionX = 1;
  settings.MinutePositionY = 2;

  #ifdef PBL_ROUND
  settings.HourSize = 0;
  settings.MinuteSize = 1;
  #else
  settings.HourSize = 1;
  settings.MinuteSize = 2;
  #endif


  settings.HourFontChoice = false;  //false = Underground/wide, true = Tangent/tall
  settings.MinuteFontChoice = false; //false = Undergroun/wide, true = Tangent/tall

  settings.Randomise = false;
  settings.RandomHourLocation = false;
  settings.RandomMinuteLocation = false;
  settings.RandomHourSize = false;
  settings.RandomMinuteSize = false;
  settings.RandomHourFont = false;
  settings.RandomMinuteFont = false;

  settings.ShowBTQTIcons = true;


  #ifdef PBL_COLOR
  settings.BackgroundColor = GColorBlack;
  settings.HourDigitsColor = GColorYellow;
  settings.MinuteDigitsColor = GColorCyan;
  settings.BatteryLineColor = GColorDarkCandyAppleRed;
  settings.BTQTColor = GColorPictonBlue;
  snprintf(settings.ThemeSelect, sizeof(settings.ThemeSelect), "%s", "bl");
  #else
  settings.BackgroundColor = GColorBlack;
  settings.HourDigitsColor = GColorLightGray;
  settings.MinuteDigitsColor = GColorWhite;
  settings.BatteryLineColor = GColorWhite;
  settings.BTQTColor = GColorWhite;
  snprintf(settings.ThemeSelect, sizeof(settings.ThemeSelect), "%s", "bl");
  #endif

  //snprintf(settings.DateFormat, sizeof(settings.DateFormat), "%s", "0");
  
  
}

static void quiet_time_icon () {

    layer_set_hidden(s_canvas_qt_icon_layer, !settings.ShowBTQTIcons || !quiet_time_is_active());

}

static void prv_update_bt_icon_visibility(bool connected) {
  layer_set_hidden(s_canvas_bt_icon_layer, !settings.ShowBTQTIcons || connected);
}

static void bluetooth_vibe_icon (bool connected) {

   prv_update_bt_icon_visibility(connected);

    if (!connected && settings.VibeMode != 2) {
    if (settings.VibeMode == 1 || !quiet_time_is_active()) {
      vibes_double_pulse();
    }
  }

}

static void prv_load_settings(void) {
  prv_default_settings();
  persist_read_data(SETTINGS_KEY, &settings, sizeof(settings));
}



// ---------------------------------------------------------------------------
// Time handling
// ---------------------------------------------------------------------------
// Hours follow the watch's live 12h/24h setting (Settings > Date & Time 12h/24h on the watch)
static void update_time_buffers(struct tm *tick_time) {
  int hour = tick_time->tm_hour;

  if (!clock_is_24h_style()) {
    hour = hour % 12;
    if (hour == 0) {
      hour = 12;
    }
  }

  if ((!clock_is_24h_style() && !settings.AddZero12h) || (clock_is_24h_style() && settings.RemoveZero24h)) {
  snprintf(s_hour_buffer, sizeof(s_hour_buffer), "%d", hour);}
  else {
  snprintf(s_hour_buffer, sizeof(s_hour_buffer), "%02d", hour);
  }
  snprintf(s_minute_buffer, sizeof(s_minute_buffer), "%02d", tick_time->tm_min);
}

// ---------------------------------------------------------------------------
// Drawing
// ---------------------------------------------------------------------------
static void update_proc(Layer *layer, GContext *ctx) {
  GRect bounds = layer_get_unobstructed_bounds(layer);
  GRect full_bounds = layer_get_bounds(layer);

  // Solid background 
  graphics_context_set_fill_color(ctx, settings.BackgroundColor);
  graphics_fill_rect(ctx, bounds, 0, GCornerNone);

  FContext fctx;
  fctx_init_context(&fctx, ctx);
  #ifdef PBL_COLOR
   fctx_enable_aa(true);
  #endif

  int16_t hour_scale;
  int16_t minute_scale;

  int HourPositionX;
  int HourPositionY;

  int MinutePositionX;
  int MinutePositionY;

  #ifdef PBL_ROUND  //// Settings for round watches
  switch (settings.HourSize) {
        case 0:  hour_scale = 400; break;
        case 1:  hour_scale = 550; break;
        default: hour_scale = 700; break; // default size and any unexpected value
  }

  switch (settings.MinuteSize) {
        case 0:  minute_scale = 400; break;
        case 1:  minute_scale = 550; break;
        default: minute_scale = 700; break; // default size and any unexpected value
  }

  switch(settings.HourFontChoice) {
        case false:
            switch (settings.HourPositionX) {
            case 0:  HourPositionX = bounds.size.w * 1 / 3; break;
            case 1:  HourPositionX = bounds.size.w * 2 / 4; break;
            default: HourPositionX = bounds.size.w * 2 / 3; break; // default size and any unexpected value
            }
        break;
        default:
            switch (settings.HourPositionX) {
            case 0:  HourPositionX = bounds.size.w * 1 / 4; break;
            case 1:  HourPositionX = bounds.size.w * 2 / 4; break;
            default: HourPositionX = bounds.size.w * 3 / 4; break; // default size and any unexpected value
            }
        break; 
  }

  switch (settings.HourPositionY) {
        case 0:  HourPositionY = bounds.size.h * 1 / 10; break;
        case 1:  HourPositionY = bounds.size.h * 5 / 10; break;
        default: HourPositionY = bounds.size.h * 9 / 10; break; // default size and any unexpected value
  }

  switch(settings.MinuteFontChoice) {
        case false:
            switch(settings.MinutePositionX) {
            case 0:  MinutePositionX = bounds.size.w * 1 / 3; break;
            case 1:  MinutePositionX = bounds.size.w * 2 / 4; break;
            default: MinutePositionX = bounds.size.w * 2 / 3; break; // default size and any unexpected value
            }
        break;
        default:
            switch(settings.MinutePositionX) {
            case 0:  MinutePositionX = bounds.size.w * 1 / 4; break;
            case 1:  MinutePositionX = bounds.size.w * 2 / 4; break;
            default: MinutePositionX = bounds.size.w * 3 / 4; break; // default size and any unexpected value
            }
        break;
  }

  switch(settings.MinutePositionY) {
        case 0:  MinutePositionY = bounds.size.h * 1 / 10; break;
        case 1:  MinutePositionY = bounds.size.h * 5 / 10; break;
        default: MinutePositionY = bounds.size.h * 9 / 10; break; // default size and any unexpected value
  }

  #else  //settings for rectangular watches
  switch (settings.HourSize) {
        case 0:  hour_scale = 500; break;
        case 1:  hour_scale = 650; break;
        default: hour_scale = 800; break; // default size and any unexpected value
      }

  switch (settings.MinuteSize) {
        case 0:  minute_scale = 500; break;
        case 1:  minute_scale = 650; break;
        default: minute_scale = 800; break; // default size and any unexpected value
  }

  switch(settings.HourFontChoice) {
        case false:
            switch (settings.HourPositionX) {
            case 0:  HourPositionX = bounds.size.w * 1 / 3; break;
            case 1:  HourPositionX = bounds.size.w * 2 / 4; break;
            default: HourPositionX = bounds.size.w * 2 / 3; break; // default size and any unexpected value
            }
        break;
        default:
            switch (settings.HourPositionX) {
            case 0:  HourPositionX = bounds.size.w * 1 / 4; break;
            case 1:  HourPositionX = bounds.size.w * 2 / 4; break;
            default: HourPositionX = bounds.size.w * 3 / 4; break; // default size and any unexpected value
            }
        break; 
  }

  switch (settings.HourPositionY) {
        case 0:  HourPositionY = bounds.size.h * 5 / 100;  break;
        case 1:  HourPositionY = bounds.size.h * 50 / 100;  break;
        default: HourPositionY = bounds.size.h * 95 / 100;  break ; // default size and any unexpected value
  }

  switch(settings.MinuteFontChoice) {
        case false:
            switch(settings.MinutePositionX) {
            case 0:  MinutePositionX = bounds.size.w * 1 / 3; break;
            case 1:  MinutePositionX = bounds.size.w * 2 / 4; break;
            default: MinutePositionX = bounds.size.w * 2 / 3; break; // default size and any unexpected value
            }
        break;
        default:
            switch(settings.MinutePositionX) {
            case 0:  MinutePositionX = bounds.size.w * 1 / 4; break;
            case 1:  MinutePositionX = bounds.size.w * 2 / 4; break;
            default: MinutePositionX = bounds.size.w * 3 / 4; break; // default size and any unexpected value
            }
        break;
  }

  switch(settings.MinutePositionY) {
        case 0:  MinutePositionY = bounds.size.h * 5 / 100;  break;
        case 1:  MinutePositionY = bounds.size.h * 50 / 100;  break;
        default: MinutePositionY = bounds.size.h * 95 / 100;  break; // default size and any unexpected value
  }
  #endif

  int minute_size =  (int)(full_bounds.size.h * minute_scale/1000 * bounds.size.h/full_bounds.size.h );
  int hour_size   =  (int)(full_bounds.size.h * hour_scale/1000 * bounds.size.h/full_bounds.size.h);

  int16_t hour_opacity = settings.HourTransparency;
  int16_t minute_opacity = settings.MinuteTransparency;

  GColor minute_color = settings.MinuteDigitsColor;
  GColor hour_color = settings.HourDigitsColor;

  // ---- Minutes
  fctx_set_fill_color(&fctx, minute_color);
  fctx_set_color_bias(&fctx, -minute_opacity/10);
  fctx_begin_fill(&fctx);
  fctx_set_offset(&fctx, FPointI(MinutePositionX, MinutePositionY));
  #ifdef BACKLIGHTON  // show a static minute value for screenshots and debugging
  switch(settings.MinuteFontChoice) {
        case false: fctx_set_text_cap_height (&fctx, s_font_wide, minute_size); 
              switch(settings.MinutePositionY) {
              case 0:   fctx_draw_string(&fctx, "43", s_font_wide, GTextAlignmentCenter, FTextAnchorCapTop); break;
              case 1:   fctx_draw_string(&fctx, "43", s_font_wide, GTextAlignmentCenter, FTextAnchorCapMiddle); break;
              default:  fctx_draw_string(&fctx, "43", s_font_wide, GTextAlignmentCenter, FTextAnchorBaseline); break; // default size and any unexpected value
              }
        break;
        default: fctx_set_text_cap_height (&fctx, s_font_tall, minute_size); 
              switch(settings.MinutePositionY) {
              case 0:   fctx_draw_string(&fctx, "43", s_font_tall, GTextAlignmentCenter, FTextAnchorCapTop); break;
              case 1:   fctx_draw_string(&fctx, "43", s_font_tall, GTextAlignmentCenter, FTextAnchorCapMiddle); break;
              default:  fctx_draw_string(&fctx, "43", s_font_tall, GTextAlignmentCenter, FTextAnchorBaseline); break; // default size and any unexpected value
              }
        break; // default size and any unexpected value
  }
  #else
  switch(settings.MinuteFontChoice) {
        case false: fctx_set_text_cap_height (&fctx, s_font_wide, minute_size); 
              switch(settings.MinutePositionY) {
              case 0:   fctx_draw_string(&fctx, s_minute_buffer, s_font_wide, GTextAlignmentCenter, FTextAnchorCapTop); break;
              case 1:   fctx_draw_string(&fctx, s_minute_buffer, s_font_wide, GTextAlignmentCenter, FTextAnchorCapMiddle); break;
              default:  fctx_draw_string(&fctx, s_minute_buffer, s_font_wide, GTextAlignmentCenter, FTextAnchorBaseline); break; // default size and any unexpected value
              }
        break;
        default: fctx_set_text_cap_height (&fctx, s_font_tall, minute_size); 
              switch(settings.MinutePositionY) {
              case 0:   fctx_draw_string(&fctx, s_minute_buffer, s_font_tall, GTextAlignmentCenter, FTextAnchorCapTop); break;
              case 1:   fctx_draw_string(&fctx, s_minute_buffer, s_font_tall, GTextAlignmentCenter, FTextAnchorCapMiddle); break;
              default:  fctx_draw_string(&fctx, s_minute_buffer, s_font_tall, GTextAlignmentCenter, FTextAnchorBaseline); break; // default size and any unexpected value
              }
        break; // default size and any unexpected value
  }
  #endif
  
  fctx_end_fill(&fctx);

  // ---- Hours
  fctx_set_fill_color(&fctx, hour_color);
  fctx_set_color_bias(&fctx, -hour_opacity/10);
  fctx_begin_fill(&fctx);

  fctx_set_offset(&fctx, FPointI(HourPositionX, HourPositionY));
  #ifdef BACKLIGHTON //show a static hour value for screenshots and debugging
  switch(settings.HourFontChoice) {
        case false: fctx_set_text_cap_height (&fctx, s_font_wide, hour_size); 
            switch(settings.HourPositionY) {
                  case 0:   fctx_draw_string(&fctx, "12", s_font_wide, GTextAlignmentCenter, FTextAnchorCapTop); break;
                  case 1:   fctx_draw_string(&fctx, "12", s_font_wide, GTextAlignmentCenter, FTextAnchorCapMiddle); break;
                  default:  fctx_draw_string(&fctx, "12", s_font_wide, GTextAlignmentCenter, FTextAnchorBaseline); break; // default size and any unexpected value
            }  
        break;
        default: fctx_set_text_cap_height (&fctx, s_font_tall, hour_size); 
            switch(settings.HourPositionY) {
                  case 0:   fctx_draw_string(&fctx, "12", s_font_tall, GTextAlignmentCenter, FTextAnchorCapTop); break;
                  case 1:   fctx_draw_string(&fctx, "12", s_font_tall, GTextAlignmentCenter, FTextAnchorCapMiddle); break;
                  default:  fctx_draw_string(&fctx, "12", s_font_tall, GTextAlignmentCenter, FTextAnchorBaseline); break; // default size and any unexpected value
            }  
        break; // default size and any unexpected value
  }
  #else
  switch(settings.HourFontChoice) {
        case false: fctx_set_text_cap_height (&fctx, s_font_wide, hour_size); 
            switch(settings.HourPositionY) {
                  case 0:   fctx_draw_string(&fctx, s_hour_buffer, s_font_wide, GTextAlignmentCenter, FTextAnchorCapTop); break;
                  case 1:   fctx_draw_string(&fctx, s_hour_buffer, s_font_wide, GTextAlignmentCenter, FTextAnchorCapMiddle); break;
                  default:  fctx_draw_string(&fctx, s_hour_buffer, s_font_wide, GTextAlignmentCenter, FTextAnchorBaseline); break; // default size and any unexpected value
            }  
        break;
        default: fctx_set_text_cap_height (&fctx, s_font_tall, hour_size); 
            switch(settings.HourPositionY) {
                  case 0:   fctx_draw_string(&fctx, s_hour_buffer, s_font_tall, GTextAlignmentCenter, FTextAnchorCapTop); break;
                  case 1:   fctx_draw_string(&fctx, s_hour_buffer, s_font_tall, GTextAlignmentCenter, FTextAnchorCapMiddle); break;
                  default:  fctx_draw_string(&fctx, s_hour_buffer, s_font_tall, GTextAlignmentCenter, FTextAnchorBaseline); break; // default size and any unexpected value
            }  
        break; // default size and any unexpected value
  }
  #endif
  
  fctx_end_fill(&fctx);

  fctx_deinit_context(&fctx);
}

static void layer_update_proc_qt(Layer * layer, GContext * ctx){

    GRect bounds = layer_get_unobstructed_bounds(layer);
    GRect full_bounds = layer_get_bounds(layer);

    if (!grect_equal(&full_bounds, &bounds)) {
      return;
    }


  GRect QTIconRect = config.QTIconRect[0];

  quiet_time_icon(); //checks whether quiet time is active

  graphics_context_set_text_color(ctx, settings.BTQTColor);
  
  graphics_context_set_antialiased(ctx, true);
  graphics_draw_text(ctx, "\U0000E061", FontBTQTIcons, QTIconRect, GTextOverflowModeFill,GTextAlignmentCenter, NULL);

}

static void layer_update_proc_bt(Layer * layer, GContext * ctx){
  GRect bounds = layer_get_unobstructed_bounds(layer);
  GRect full_bounds = layer_get_bounds(layer);

  if (!grect_equal(&full_bounds, &bounds)) {
    return;
  }

  GRect BTIconRect = config.BTIconRect[0];


 graphics_context_set_text_color(ctx, settings.BTQTColor);
 
 graphics_context_set_antialiased(ctx, true);
 graphics_draw_text(ctx, "z", FontBTQTIcons, BTIconRect, GTextOverflowModeFill,GTextAlignmentCenter, NULL);


}

static void battery_update_proc(Layer *layer, GContext *ctx) {

    GRect bounds = layer_get_unobstructed_bounds(layer);
    GRect full_bounds = layer_get_bounds(layer);

    // If not enabled in config, stop
    if (!settings.EnableBatteryLine) {
        return;
    }

    int s_battery_level = battery_state_service_peek().charge_percent;

    // Draw battery line
   
    if (settings.EnableBatteryLine) {
        int width_rect = (s_battery_level * config.BatteryLineRect[0].size.w) / 100 * bounds.size.h/full_bounds.size.h;
        int rect_x_pos = PBL_IF_ROUND_ELSE((bounds.size.w/2) - (width_rect/2), 0);

        GRect BatteryLineRect = GRect(rect_x_pos,config.BatteryLineRect[0].origin.y,width_rect, config.BatteryLineRect[0].size.h);
        graphics_context_set_antialiased(ctx, true);
        graphics_context_set_fill_color(ctx, settings.BatteryLineColor);
        graphics_fill_rect(ctx,BatteryLineRect, 1, GCornersBottom);
    }
    
}

// ---------------------------------------------------------------------------
// Random layout settings 
// ---------------------------------------------------------------------------

static void prv_apply_random_layout(void) {

  if (settings.Randomise && settings.RandomHourLocation) {
    settings.HourPositionY = rand() % 3;
    settings.HourPositionX = rand() % 3;
  }
  if (settings.Randomise && settings.RandomMinuteLocation) {
    settings.MinutePositionY = rand() % 3;
    settings.MinutePositionX = rand() % 3;
  }
  if (settings.Randomise && settings.RandomHourSize) {
    settings.HourSize = rand() % 3;
  }
  if (settings.Randomise && settings.RandomMinuteSize) {
    settings.MinuteSize = rand() % 3;
  }
  if (settings.Randomise && settings.RandomHourFont) {
    settings.HourFontChoice = (rand() % 2) != 0;
  }
  if (settings.Randomise && settings.RandomMinuteFont) {
    settings.MinuteFontChoice = (rand() % 2) != 0;
  }
}

// ---------------------------------------------------------------------------
// Tick / AppMessage handlers
// ---------------------------------------------------------------------------
static void tick_handler(struct tm *tick_time, TimeUnits units_changed) {
  update_time_buffers(tick_time);

  //upate random layout elements if true in settings
  if (settings.Randomise && (settings.RandomHourLocation || settings.RandomMinuteLocation ||
      settings.RandomHourSize || settings.RandomMinuteSize ||
      settings.RandomHourFont || settings.RandomMinuteFont)) {
    prv_apply_random_layout();
  }

  layer_mark_dirty(s_time_layer);
}

static void prv_inbox_received_handler(DictionaryIterator *iter, void *context) {
#ifdef LOG
  APP_LOG(APP_LOG_LEVEL_INFO, "Received message");
#endif

  bool settings_changed = false;
  
  Tuple *addzero12_t = dict_find(iter, MESSAGE_KEY_AddZero12h);
  Tuple *remzero24_t = dict_find(iter, MESSAGE_KEY_RemoveZero24h);
  Tuple *enable_battery_line_t = dict_find(iter, MESSAGE_KEY_EnableBatteryLine);
  Tuple *vibe_t = dict_find(iter, MESSAGE_KEY_VibeMode);

  //Tuple *enable_date_t = dict_find(iter, MESSAGE_KEY_EnableDate);
  //Tuple *datelang_t = dict_find(iter, MESSAGE_KEY_DateLanguage);

  Tuple *hourtransp_t = dict_find(iter, MESSAGE_KEY_HourTransparency);
  Tuple *minutetransp_t = dict_find(iter, MESSAGE_KEY_MinuteTransparency);
  Tuple *hourposx_t = dict_find(iter, MESSAGE_KEY_HourPositionX);
  Tuple *hourposy_t = dict_find(iter, MESSAGE_KEY_HourPositionY);
  Tuple *minuteposx_t = dict_find(iter, MESSAGE_KEY_MinutePositionX);
  Tuple *minuteposy_t = dict_find(iter, MESSAGE_KEY_MinutePositionY);

  Tuple *hoursize_t = dict_find(iter, MESSAGE_KEY_HourSize);
  Tuple *minutesize_t = dict_find(iter, MESSAGE_KEY_MinuteSize);

  Tuple *hourfont_t = dict_find(iter, MESSAGE_KEY_HourFontChoice);
  Tuple *minutefont_t = dict_find(iter, MESSAGE_KEY_MinuteFontChoice);
  Tuple *random_t = dict_find(iter, MESSAGE_KEY_Randomise);
  Tuple *random_hour_location_t = dict_find(iter, MESSAGE_KEY_RandomHourLocation);
  Tuple *random_minute_location_t = dict_find(iter, MESSAGE_KEY_RandomMinuteLocation);
  Tuple *random_hour_size_t = dict_find(iter, MESSAGE_KEY_RandomHourSize);
  Tuple *random_minute_size_t = dict_find(iter, MESSAGE_KEY_RandomMinuteSize);
  Tuple *random_hour_font_t = dict_find(iter, MESSAGE_KEY_RandomHourFont);
  Tuple *random_minute_font_t = dict_find(iter, MESSAGE_KEY_RandomMinuteFont);

  Tuple *background_color_t = dict_find(iter, MESSAGE_KEY_BackgroundColor);
  Tuple *hour_color_t = dict_find(iter, MESSAGE_KEY_HourDigitsColor);
  Tuple *minute_color_t = dict_find(iter, MESSAGE_KEY_MinuteDigitsColor);
  Tuple *battery_line_color_t = dict_find(iter, MESSAGE_KEY_BatteryLineColor);
  Tuple *btqt_color_t = dict_find(iter, MESSAGE_KEY_BTQTColor);
  Tuple *show_btqt_icons_t = dict_find(iter, MESSAGE_KEY_ShowBTQTIcons);
  // Tuple *date_color_t = dict_find(iter, MESSAGE_KEY_DateColor);


  Tuple *themeselect_t = dict_find(iter, MESSAGE_KEY_ThemeSelect);
 

  if (addzero12_t) {
    settings.AddZero12h = addzero12_t->value->int32 != 0;
    settings_changed = true;
  }

  if (remzero24_t) {
    settings.RemoveZero24h = remzero24_t->value->int32 != 0;
    settings_changed = true;
  }

  if (enable_battery_line_t) {
    settings.EnableBatteryLine = enable_battery_line_t->value->int32 == 1;
    settings_changed = true;
  }

  if (vibe_t) {
    int vibevalue = atoi(vibe_t->value->cstring);
    if (vibevalue >= 0 && vibevalue <= 6) {
        settings.VibeMode = vibevalue;
    }
    settings_changed = true;
  }

  if (hourtransp_t) {
  int hourtvalue = atoi(hourtransp_t->value->cstring);
    if (hourtvalue >= 0 && hourtvalue <= 100) {
        settings.HourTransparency = hourtvalue;
    }
    settings_changed = true;
  }

  if (minutetransp_t) {
  int mintvalue = atoi(minutetransp_t->value->cstring);
    if (mintvalue >= 0 && mintvalue <= 100) {
        settings.MinuteTransparency = mintvalue;
    }
    settings_changed = true;
  }

  if (hourposx_t) {
  int hourxvalue = atoi(hourposx_t->value->cstring);
    if (hourxvalue >= 0 && hourxvalue <= 100) {
        settings.HourPositionX = hourxvalue;
    }
    settings_changed = true;
  }

  if (hourposy_t) {
  int houryvalue = atoi(hourposy_t->value->cstring);
    if (houryvalue >= 0 && houryvalue <= 100) {
        settings.HourPositionY = houryvalue;
    }
    settings_changed = true;
  }

  if (minuteposx_t) {
  int minutexvalue = atoi(minuteposx_t->value->cstring);
    if (minutexvalue >= 0 && minutexvalue <= 100) {
        settings.MinutePositionX = minutexvalue;
    }
    settings_changed = true;
  }

  if (minuteposy_t) {
  int minuteyvalue = atoi(minuteposy_t->value->cstring);
    if (minuteyvalue >= 0 && minuteyvalue <= 100) {
        settings.MinutePositionY = minuteyvalue;
    }
    settings_changed = true;
  }

  if (minutesize_t) {
  int minsizevalue = atoi(minutesize_t->value->cstring);
    if (minsizevalue >= 0 && minsizevalue <= 100) {
        settings.MinuteSize = minsizevalue;
    }
    settings_changed = true;
  }

  if (hoursize_t) {
  int hoursizevalue = atoi(hoursize_t->value->cstring);
    if (hoursizevalue >= 0 && hoursizevalue <= 100) {
        settings.HourSize = hoursizevalue;
    }
    settings_changed = true;
  }

  if (hourfont_t) {
    settings.HourFontChoice = hourfont_t->value->int32 != 0;
    settings_changed = true;
  }

  if (minutefont_t) {
    settings.MinuteFontChoice = minutefont_t->value->int32 != 0;
    settings_changed = true;
  }

  if (random_t) {
    settings.Randomise = random_t->value->int32 != 0;
    settings_changed = true;
  }

  if (random_hour_location_t) {
    settings.RandomHourLocation = random_hour_location_t->value->int32 != 0;
    settings_changed = true;
  }

  if (random_minute_location_t) {
    settings.RandomMinuteLocation = random_minute_location_t->value->int32 != 0;
    settings_changed = true;
  }

  if (random_hour_size_t) {
    settings.RandomHourSize = random_hour_size_t->value->int32 != 0;
    settings_changed = true;
  }

  if (random_minute_size_t) {
    settings.RandomMinuteSize = random_minute_size_t->value->int32 != 0;
    settings_changed = true;
  }

  if (random_hour_font_t) {
    settings.RandomHourFont = random_hour_font_t->value->int32 != 0;
    settings_changed = true;
  }

  if (random_minute_font_t) {
    settings.RandomMinuteFont = random_minute_font_t->value->int32 != 0;
    settings_changed = true;
  }

  // if (dateform_t) {
  //   strncpy(settings.DateFormat, dateform_t->value->cstring, sizeof(settings.DateFormat)); 
  //   layer_mark_dirty(s_date_battery_logo_layer);
  // }
 

  // if (enable_date_t) {
  //   settings.EnableDate = enable_date_t->value->int32 == 1;
  //   layer_mark_dirty(s_canvas_layer);
  //   layer_mark_dirty(s_date_battery_logo_layer);
  // }

  // if (datelang_t) {
  //   snprintf(settings.DateLanguage, sizeof(settings.DateLanguage), "%s", datelang_t->value->cstring);
  //   settings_changed = true;
  // }






#ifdef PBL_BW
  if (themeselect_t) {
          // Compare the string value received from the phone
          if (strcmp(themeselect_t->value->cstring, "wh") == 0) {
              // Set the theme and other settings for "wh"
                    //settings.DateColor = GColorBlack;
                    settings.BackgroundColor = GColorWhite;
                    settings.HourDigitsColor = GColorLightGray;
                    settings.MinuteDigitsColor = GColorBlack;
                    settings.BatteryLineColor = GColorBlack;
                    settings.BTQTColor = GColorBlack;
                 
                    settings_changed = true;
                    //    APP_LOG(APP_LOG_LEVEL_DEBUG, "Theme white selected");
          } else if (strcmp(themeselect_t->value->cstring, "bl") == 0) {
              // Set the theme and other settings for "bl"
                    //settings.DateColor = GColorWhite;
                    settings.BackgroundColor = GColorBlack;
                    settings.HourDigitsColor = GColorLightGray;
                    settings.MinuteDigitsColor = GColorWhite;
                    settings.BatteryLineColor = GColorWhite;
                    settings.BTQTColor = GColorWhite;
                    
                    settings_changed = true;
                    //    APP_LOG(APP_LOG_LEVEL_DEBUG, "Theme black selected");
          } else if (strcmp(themeselect_t->value->cstring, "cu") == 0) {
              // Set the theme for "cu" and handle custom colors
              //settings.DateColor = GColorFromHEX(bwdate_color_t->value->int32);
                  if (background_color_t) {
                    settings.BackgroundColor = GColorFromHEX(background_color_t->value->int32);
                    settings_changed = true;
                  }

                  if (hour_color_t) {
                    settings.HourDigitsColor = GColorFromHEX(hour_color_t->value->int32);
                    settings_changed = true;
                  }

                  if (minute_color_t) {
                    settings.MinuteDigitsColor = GColorFromHEX(minute_color_t->value->int32);
                    settings_changed = true;
                  }

                  if (battery_line_color_t) {
                    settings.BatteryLineColor = GColorFromHEX(battery_line_color_t->value->int32);
                    settings_changed = true;
                  }
                  
                  if (btqt_color_t) {
                    settings.BTQTColor = GColorFromHEX(btqt_color_t->value->int32);
                    settings_changed = true;
                  }
                }
          }
/////////////////////////////////////
#else
  if (themeselect_t) {
          // Compare the string value received from the phone
          if (strcmp(themeselect_t->value->cstring, "wh") == 0) {
              // Set the theme and other settings for "wh"
                    //settings.DateColor = GColorWhite;
                    settings.BackgroundColor = GColorWhite;
                    settings.HourDigitsColor = GColorArmyGreen;
                    settings.MinuteDigitsColor = GColorDukeBlue;
                    settings.BatteryLineColor = GColorDarkCandyAppleRed;
                    settings.BTQTColor = GColorLightGray;
                 
                      settings_changed = true;
                    //    APP_LOG(APP_LOG_LEVEL_DEBUG, "Theme white selected");
          } else if (strcmp(themeselect_t->value->cstring, "bl") == 0) {
              // Set the theme and other settings for "bl"
                    //settings.DateColor = GColorWhite;
                    settings.BackgroundColor = GColorBlack;
                    settings.HourDigitsColor = GColorYellow;
                    settings.MinuteDigitsColor = GColorCyan;
                    settings.BatteryLineColor = GColorDarkCandyAppleRed;
                    settings.BTQTColor = GColorPictonBlue;
                    
                      settings_changed = true;
                      //  APP_LOG(APP_LOG_LEVEL_DEBUG, "Theme black selected");
          } else if (strcmp(themeselect_t->value->cstring, "bu") == 0) {
              // Set the theme and other settings for "bu"
                    //settings.DateColor = GColorWhite;
                    settings.BackgroundColor = GColorBlue;
                    settings.HourDigitsColor = GColorOxfordBlue;
                    settings.MinuteDigitsColor = GColorYellow;
                    settings.BatteryLineColor = GColorGreen;
                    settings.BTQTColor = GColorPictonBlue;
                    
                      settings_changed = true;
                      //  APP_LOG(APP_LOG_LEVEL_DEBUG, "Theme blue selected");
          } else if (strcmp(themeselect_t->value->cstring, "pl") == 0) {
              // Set the theme and other settings for "pl"
                    //settings.DateColor = GColorWhite;
                    settings.BackgroundColor = GColorPurple;
                    settings.HourDigitsColor = GColorBlack;
                    settings.MinuteDigitsColor = GColorRichBrilliantLavender;
                    settings.BatteryLineColor = GColorBulgarianRose;
                    settings.BTQTColor = GColorImperialPurple;
                    
                      settings_changed = true;
                      //  APP_LOG(APP_LOG_LEVEL_DEBUG, "Theme purple selected");
          } else if (strcmp(themeselect_t->value->cstring, "gr") == 0) {
              // Set the theme and other settings for "gr"
                    //settings.DateColor = GColorWhite;
                    settings.BackgroundColor = GColorBlack;
                    settings.HourDigitsColor = GColorDarkGreen;
                    settings.MinuteDigitsColor = GColorGreen;
                    settings.BatteryLineColor = GColorYellow;
                    settings.BTQTColor = GColorBlack;
                    
                      settings_changed = true;
                      //  APP_LOG(APP_LOG_LEVEL_DEBUG, "Theme black & green selected");
          } else if (strcmp(themeselect_t->value->cstring, "cu") == 0) {
              // Set the theme for "cu" and handle custom colors
                  //settings.DateColor = GColorFromHEX(bwdate_color_t->value->int32);
                  if (background_color_t) {
                    settings.BackgroundColor = GColorFromHEX(background_color_t->value->int32);
                    settings_changed = true;
                  }

                  if (hour_color_t) {
                    settings.HourDigitsColor = GColorFromHEX(hour_color_t->value->int32);
                    settings_changed = true;
                  }

                  if (minute_color_t) {
                    settings.MinuteDigitsColor = GColorFromHEX(minute_color_t->value->int32);
                    settings_changed = true;
                  }

                  if (battery_line_color_t) {
                    settings.BatteryLineColor = GColorFromHEX(battery_line_color_t->value->int32);
                    settings_changed = true;
                  }
                  
                  if (btqt_color_t) {
                    settings.BTQTColor = GColorFromHEX(btqt_color_t->value->int32);
                    settings_changed = true;
                  }
                }
          }
          #endif

                  ///////////////////////////////

  if (show_btqt_icons_t) {
    settings.ShowBTQTIcons = show_btqt_icons_t->value->int32 != 0;
    settings_changed = true;
  }

  if (settings_changed) {
    time_t now = time(NULL);
    struct tm *tick_time = localtime(&now);
    update_time_buffers(tick_time);

    layer_mark_dirty(s_time_layer);
    layer_mark_dirty(s_battery_layer);
    layer_mark_dirty(s_canvas_bt_icon_layer);
    layer_mark_dirty(s_canvas_qt_icon_layer);

    quiet_time_icon();
    prv_update_bt_icon_visibility(connection_service_peek_pebble_app_connection());
  }

  prv_save_settings();

}

// ---------------------------------------------------------------------------
// Window lifecycle
// ---------------------------------------------------------------------------
static void window_load(Window *window) {

  #ifdef BACKLIGHTON
    light_enable(true);  ///for ShareX screencapture gifs.  Must comment out declaration at top of file before publishing, otherwise the backlight will stay on!
  #endif

  Layer *window_layer = window_get_root_layer(window);
  GRect bounds = layer_get_bounds(window_layer);

  s_font_wide = ffont_create_from_resource(RESOURCE_ID_FONT_JOHNSTON);
  s_font_tall = ffont_create_from_resource(RESOURCE_ID_FONT_TANGENT);

  FontBTQTIcons = fonts_load_custom_font(resource_get_handle(RESOURCE_ID_FONT_DRIPICONS_16));

  s_time_layer = layer_create(bounds);
  s_battery_layer = layer_create(bounds);
  s_canvas_qt_icon_layer = layer_create(bounds);
  s_canvas_bt_icon_layer = layer_create(bounds);

  layer_set_update_proc(s_time_layer, update_proc);
  layer_add_child(window_layer, s_time_layer);

  layer_set_update_proc(s_battery_layer, battery_update_proc);
  layer_add_child(window_layer, s_battery_layer);
 
  layer_set_update_proc(s_canvas_qt_icon_layer, layer_update_proc_qt);
  layer_add_child(window_layer, s_canvas_qt_icon_layer);
  quiet_time_icon();

  layer_set_update_proc(s_canvas_bt_icon_layer, layer_update_proc_bt);
  layer_add_child(window_layer, s_canvas_bt_icon_layer);

  connection_service_subscribe((ConnectionHandlers) {
    .pebble_app_connection_handler = bluetooth_vibe_icon
  });
  prv_update_bt_icon_visibility(connection_service_peek_pebble_app_connection());

  time_t now = time(NULL);
  struct tm *tick_time = localtime(&now);
  update_time_buffers(tick_time);
}

static void window_unload(Window *window) {

  #ifdef BACKLIGHTON
    light_enable(false);
  #endif

  layer_destroy(s_time_layer);
  layer_destroy(s_battery_layer);
  layer_destroy(s_canvas_qt_icon_layer);
  layer_destroy(s_canvas_bt_icon_layer);
  ffont_destroy(s_font_wide);
  ffont_destroy(s_font_tall);
  fonts_unload_custom_font(FontBTQTIcons);

  connection_service_unsubscribe();
  battery_state_service_unsubscribe();
  tick_timer_service_unsubscribe();

}

// ---------------------------------------------------------------------------
// App lifecycle
// ---------------------------------------------------------------------------
static void init(void) {
  prv_load_settings();

  s_window = window_create();
  window_set_window_handlers(s_window, (WindowHandlers) {
    .load = window_load,
    .unload = window_unload,
  });
  window_stack_push(s_window, true);

  tick_timer_service_subscribe(MINUTE_UNIT, tick_handler);

  app_message_register_inbox_received(prv_inbox_received_handler);
  app_message_open(app_message_inbox_size_maximum(), app_message_outbox_size_maximum());
}

static void deinit(void) {
    window_destroy(s_window);
}

int main(void) {
  init();
  app_event_loop();
  deinit();
}