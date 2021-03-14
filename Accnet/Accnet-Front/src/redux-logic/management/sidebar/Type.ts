export interface Setting {
  sideBar: string
}

export interface TikbedSettingType {
  type: "TIKBED_SETTING"
  response: Setting
}

export type TikbedSetting = TikbedSettingType
