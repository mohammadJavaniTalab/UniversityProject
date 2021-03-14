import  notification  from "antd/lib/notification"

export function getNotification(
  message: string = "",
  description: string = "",
  duration: number = 7
) {
  notification.open({
    message: message,
    description: description,
    duration : duration ,
    onClick: () => {},
  })
}
