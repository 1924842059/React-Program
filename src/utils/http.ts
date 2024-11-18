//封装网络请求
import qs from "qs";
import * as auth from "auth-provider";
import React, { useCallback } from "react";
import { useAuth } from "context/auth-context";
const apiUrl = process.env.REACT_APP_API_URL;

interface Config extends RequestInit {
  token?: string;
  data?: object;
}
export const http = async (
  endpoint: string,
  { data, token, headers, ...customConfig }: Config = {},
) => {
  const config = {
    method: "GET",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": data ? `application/json` : "",
    },
    ...customConfig,
  };
  if (config.method.toUpperCase() === "GET") {
    //判断是否为GET方法，toUpperCase转换大写
    /*
       如果请求方法为 GET，则使用 qs.stringify(data) 将 data 对象转换为查询参数字符串。

       通过 endpoint += ?${qs.stringify(data)}``，将这些查询参数附加到请求的 endpoint URL 之后。
       这样可以将数据添加到 URL 参数中，而不是作为请求体（因为 GET 请求不包含请求体）。

       如果请求方法不是 GET，例如 POST、PUT 或 DELETE，则将 data 对象序列化为 JSON 字符串。
       使用 config.body = JSON.stringify(data || {}) 将请求体 body 设置为该字符串，
       确保即使 data 为空，config.body 也会得到一个空对象 {} 的字符串形式。

        */
    endpoint += `?${qs.stringify(data)}`;
  } else {
    config.body = JSON.stringify(data || {});
  } //get是默认类型，...customconfig会覆盖前面的值,cunstomconfig里面存在了method
  //axios和fetch的表现不一样，axios可以在返回状态不为2xx的时候返回异常
  return window
    .fetch(`${apiUrl}/${endpoint}`, config)
    .then(async (response) => {
      if (response.status === 401) {
        await auth.logout(); //调用auth中的loggout方法退出
        window.location.reload(); //刷新页面，重新登录
        return Promise.reject({ message: "请重新登录" });
      }
      const data = await response.json(); //将响应体解析为 JSON 格式的数据对象 data
      if (response.ok) {
        return data;
      } else {
        return Promise.reject(data); //为什么要手动抛出，因为fetch不会抛出异常，只有在断网或网络错误时fetch才会抛出
      }
    });
};
export const useHttp = () => {
  //自定义hook
  const { user } = useAuth();

  return useCallback(
    (...[endpoint, config]: Parameters<typeof http>) =>
      http(endpoint, { ...config, token: user?.token }),
    [user?.token],
  );
  /*{
    TS联合类型（utillty type）
    
    
    }*/
};
