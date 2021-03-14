import axios, { AxiosRequestConfig } from "axios";
import {
  hostName,
  loginLocalStorageName,
  pathProject,
} from "../../../service/constants/defaultValues";
import { getNotification } from "../../../service/notification";
import { LoginDataModel } from "../../auth/generate-token/Type";
import { getWindowAfterSSR } from "../../../service/public";
import fileDownload from "js-file-download"



export interface Header {
  key: string;
  value: string;
}

export interface Cancellation {
  source: any;
  token: any;
}

export interface Connect {
  headers: Array<Header>;
  requestBody: any;
  url: string;
  sourceToken: any;
}

let bearerTokenKey: string = loginLocalStorageName;

// handle headers
function makeGeneralHeaderByNeeds(headers: Array<Header>) {
  let header = {
    Authorization: "bearer " + checkAuthorized(),
    "Content-Type": "application/json",
  };
  for (let i = 0; i < headers.length; i++) {
    header = { ...header, ...headers[i] };
  }

  return header;
}

// handle requestBody
function makeGeneralRequestBody(requestBody: any) {
  if (requestBody !== undefined && requestBody !== null) {
    return JSON.stringify(requestBody);
  } else {
    getNotification("Wrong Request", "RequestBody have not been provided.");
  }
}

//cancellation token
export function makeCancellationTokenAndSource(): Cancellation {
  const cancelToken = axios.CancelToken;
  const source = cancelToken.source();

  let cancellationObject: Cancellation = {
    source: source,
    token: cancelToken,
  };

  return cancellationObject;
}

//handle token and authorization
function checkAuthorized(): string {
  if (getWindowAfterSSR()) {
    let value = localStorage.getItem(bearerTokenKey);
    if (value !== undefined && value !== null && value !== "") {
      let loginObject: LoginDataModel = JSON.parse(value);
      return loginObject.token;
    } else {
      return "";
    }
  } else {
    return "";
  }
}

function switchToLogin() {
  if (getWindowAfterSSR()) {
    for (let i = 0; i < localStorage.length; i++) {
      let key = localStorage.key(i);
      if (
        key !== null &&
        key !== undefined &&
        (key as string) === bearerTokenKey
      ) {
        if (bearerTokenKey !== key) {
          sessionStorage.removeItem(key);
        }
      }
    }
  }
  window.location.replace(`${window.location.origin}${pathProject.login}`);
}

function setBearerTokenInLocalStorage(tokenValue: string) {
  if (getWindowAfterSSR()) {
    let value = localStorage.getItem(bearerTokenKey);
    let oldLoginObject: LoginDataModel = {
      token: "",
      role: {
        name: "",
        feature: [],
        id: "",
      },
    };

    if (value !== undefined && value !== null && value !== "") {
      if (value.includes("time")) {
        oldLoginObject = JSON.parse(value);
      }
    }

    let loginObject: LoginDataModel = {
      token: tokenValue,
      role: oldLoginObject.role,
    };

    localStorage.setItem(bearerTokenKey, JSON.stringify(loginObject));
  }
}

function updateToken(headers: any) {
  if (headers !== undefined && headers !== null) {
    if (headers.hasOwnProperty("new-token")) {
      setBearerTokenInLocalStorage(headers["new-token"]);
    }
  }
}

export function sendRequest(
  connect: Connect,
  onResponse: Function,
  defaultValue: any,
  dispatch: any
) {
  let generalHeaders = {
    headers: makeGeneralHeaderByNeeds(connect.headers),
    cancelToken: connect.sourceToken.source.token,
  };
  let generalRequestBody = makeGeneralRequestBody(connect.requestBody);

  axios
    .post(`${connect.url}`, generalRequestBody, generalHeaders)
    .then(function(response) {
      updateToken(response.headers);
      onResponse(response.data, dispatch);
    })
    .catch(function(error) {
      if (!error.response) {
        // network error
        let response = {
          ...defaultValue,
          error: { code: 1000000, data: [] },
        };
        onResponse(response, dispatch);
      } else {
        // http status code
        const code = error.response.status;
        if (code === 401) {
          // show message without cancellation
          switchToLogin();
        } else if (code === 404) {
          //show message
        } else if (code === 403) {
          // show message without cancellation
        } else if (code === 500) {
          // server problem that has many issues
        }else if (code === 400) {
          let response = {
            ...defaultValue,
            error : {
              code : 400,
              data : ["Could not add at the moment"]
            }
          }
          onResponse(response , dispatch)
          return
        }
        let response = {
          ...defaultValue,
          message: `User Access Or Server is down`,
        };
        onResponse(response, dispatch);
      }
    });
}

export function getRequestWithAuthorization(
  url: string,
  onResponse: Function,
  defaultValue: any,
  dispatch: any,
  sourceToken: Cancellation
) {
  let header = {
    Authorization: "bearer " + checkAuthorized(),
  };
  let generalHeaders = {
    headers: header,
    cancelToken: sourceToken.source.token,
  };

  axios
    .get(`${url}`, generalHeaders)
    .then(function(response) {
      updateToken(response.headers);
      onResponse(response.data, dispatch);
    })
    .catch(function(error) {
      if (!error.response) {
        // network error
        let response = {
          ...defaultValue,
        };
        onResponse(response, dispatch);
      } else {
        // http status code
        const code = error.response.status;
        if (code === 401) {
          // show message without cancellation
          switchToLogin();
        } else if (code === 404) {
          //show message
        } else if (code === 403) {
          // show message without cancellation
        } else if (code === 500) {
          // server problem that has many issues
        }
        let response = {
          ...defaultValue,
          message: `User Access Or Server is down`,
        };
        onResponse(response, dispatch);
      }
    });
}

export function getRequest(
  url: string,
  onResponse: Function,
  defaultValue: any,
  dispatch: any
) {
  axios
    .get(`${url}`)
    .then(function(response) {
      updateToken(response.headers);
      onResponse(response.data, dispatch);
    })
    .catch(function(error) {
      if (!error.response) {
        // network error
        let response = {
          ...defaultValue,
          error: { code: 1000000, data: [] },
        };
        onResponse(response, dispatch);
      } else {
        // http status code
        const code = error.response.status;
        if (code === 401) {
          // show message without cancellation
          switchToLogin();
        } else if (code === 404) {
          //show message
        } else if (code === 403) {
          // show message without cancellation
        } else if (code === 500) {
          // server problem that has many issues
        }
        let response = {
          ...defaultValue,
          message: `User Access Or Server is down`,
        };
        onResponse(response, dispatch);
      }
    });
}

export function authorizedDownload(url: string , mainUserName : string) {
  const optionsValue: AxiosRequestConfig = {
    responseType: "blob",
    headers: {
      Authorization: "bearer " + checkAuthorized(),
      "Content-Type": "application/json",
    },
  };

  axios
    .get(url, optionsValue)
    .then((response) => {
      fileDownload(response.data , `${mainUserName}.zip`)
    })
    .catch(function(error) {
      console.log("Report generator Error; ", error);
    });
}


export function download(url: string , fileName : string) {
  const optionsValue: AxiosRequestConfig = {
    responseType: "blob",
    headers: {
      "Content-Type": "application/json",
    },
  };

  axios
    .get(url, optionsValue)
    .then((response) => {
      fileDownload(response.data , `${fileName}`)
    })
    .catch(function(error) {
      console.log("Report generator Error; ", error);
    });
}