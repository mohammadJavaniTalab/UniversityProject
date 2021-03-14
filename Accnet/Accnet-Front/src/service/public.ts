import { UploadFile } from "antd/lib/upload/interface";

export function getLocalStorage(key: string, defaultValue: any) {
  let value = defaultValue;
  if (getWindowAfterSSR()) {
    value = localStorage.getItem(key) || defaultValue;
  }
  return value;
}

export function getWindowAfterSSR() {
  if (typeof window !== "undefined") {
    return window;
  }
}

export function setLocalStorage(key: string, value: string) {
  if (getWindowAfterSSR()) {
    localStorage.setItem(key, value);
  }
}

export function publicCheckArray(array: any) {
  if (array === null || array === undefined) {
    return false;
  }
  return true;
}

export function checkFieldIsOk(field: any) {
  if (field === null || field === undefined || field === "") {
    return false;
  }
  return true;
}

export function getTimeAndDate(time: string = "", type: string) {
  if (time === null || time === undefined) {
    return "";
  } else {
    const timeSplit = time.split("T");
    switch (type) {
      case "TIME":
        return timeSplit.length === 2
          ? `${timeSplit[1].split(":")[0]}:${timeSplit[1].split(":")[1]}`
          : " ";
      case "DATE":
        return timeSplit.length === 2 ? timeSplit[0] : " ";
      default:
        return "";
    }
  }
}

export function getActiveNav(state: any, check: any) {
  if (state === check) {
    return "active";
  }
  return "";
}

export function getIdFromUploadFile(upload: Array<UploadFile>): Array<string> {
  let temp: Array<string> = [];
  for (let index in upload) {
    if (upload[index].response !== undefined) {
      if (upload[index].response.data !== undefined) {
        temp.push(upload[index].response.data);
      }
    }
  }
  return temp;
}

export function getFieldValueFromList(
  list: Array<any>,
  field: string
): Array<any> {
  let temp: Array<string> = [];
  for (let index in list) {
    if (field in list[index]) {
      temp.push(list[index][field]);
    }
  }
  return temp;
}

export function getValueFromParam(fieldName: string): string {
  let temp: string = "";
  if (getWindowAfterSSR()) {
    const urlParams = new URLSearchParams(window.location.search);
    const paramValue = urlParams.get(fieldName);
    temp = paramValue !== null ? paramValue : "";
  }
  return temp;
}


export function getUrlParameter(name: string, url: string) {
  name = name.replace(/[\]]/, "\\]")
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)")
  var results = regex.exec(url)
  return results === null
    ? ""
    : decodeURIComponent(results[1].replace(/\+/g, " "))
}