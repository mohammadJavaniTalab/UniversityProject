import { TikbedSetting, Setting } from "./Type"

export const changeSideBar = (sideBar: string): TikbedSetting => {
  switch (sideBar) {
    case "menu-default menu-sub-hidden":
      return {
        type: "TIKBED_SETTING",
        response: {
          sideBar: "menu-default menu-sub-hidden main-hidden sub-hidden",
        },
      }
    case "menu-default menu-sub-hidden main-hidden sub-hidden":
      return {
        type: "TIKBED_SETTING",
        response: { sideBar: "menu-default menu-sub-hidden" },
      }
    default:
      return {
        type: "TIKBED_SETTING",
        response: {
          sideBar: "menu-default menu-sub-hidden main-hidden sub-hidden",
        },
      }
  }
}

// switch (sideBar) {
//   case "menu-default menu-sub-hidden sub-show-temporary":
//     return {
//       type: "TIKBED_SETTING",
//       response: { sideBar: "menu-default menu-sub-hidden" },
//     }
//   case "menu-default menu-sub-hidden":
//     return {
//       type: "TIKBED_SETTING",
//       response: {
//         sideBar: "menu-default menu-sub-hidden main-hidden sub-hidden",
//       },
//     }
//   case "menu-default menu-sub-hidden main-hidden sub-hidden":
//     return {
//       type: "TIKBED_SETTING",
//       response: { sideBar: "menu-default menu-sub-hidden sub-hidden" },
//     }
//   case "menu-default menu-sub-hidden sub-hidden":
//     return {
//       type: "TIKBED_SETTING",
//       response: {
//         sideBar: "menu-default menu-sub-hidden sub-show-temporary",
//       },
//     }
//   default:
//     return {
//       type: "TIKBED_SETTING",
//       response: {
//         sideBar: "menu-default menu-sub-hidden main-hidden sub-hidden",
//       },
//     }
// }
