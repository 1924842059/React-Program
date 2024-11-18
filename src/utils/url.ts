import { URLSearchParamsInit, useSearchParams } from "react-router-dom";
import { useMemo } from "react";
import { cleanObject, subset } from "utils/index";
/**
 * 返回页面url中，指定键的参数值
 */
export const useUrlQueryParam = <K extends string>(keys: K[]) => {
  const [searchParams] = useSearchParams();
  const setSearchParams = useSetUrlSearchParam();
  return [
    useMemo(
      () =>
        subset(Object.fromEntries(searchParams), keys) as {
          [key in K]: string;
        },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [searchParams],
    ),
    (params: Partial<{ [key in K]: unknown }>) => {
      // iterator
      // iterator: https://codesandbox.io/s/upbeat-wood-bum3j?file=/src/index.js
      return setSearchParams(params);
    },
  ] as const;
};
export const useSetUrlSearchParam = () => {
  const [searchParams, setSearchParam] = useSearchParams();
  return (params: { [key in string]: unknown }) => {
    const o = cleanObject({
      ...Object.fromEntries(searchParams),
      ...params,
    }) as URLSearchParamsInit;
    return setSearchParam(o);
  };
};
/**
 * 该代码是一个 React 自定义 Hook，用于获取和设置页面 URL 中指定的查询参数。代码解析如下：

useUrlQueryParam Hook：

这个 Hook 接收一个 keys 数组作为参数，用于指定需要从 URL 中获取的查询参数的键。
它返回一个数组，包含两个值：当前查询参数的值对象和更新查询参数的方法。
useSearchParams：

useSearchParams 是 React Router 提供的 Hook，用于获取和设置 URL 查询参数。
searchParams 是一个 URLSearchParams 实例，包含了当前 URL 的查询参数。
setSearchParam 是用于更新查询参数的函数。
使用 useMemo 优化查询参数获取：

useMemo 缓存了由 keys 数组指定的查询参数的值对象，只有在 searchParams 变化时才会重新计算。
Object.fromEntries(searchParams) 将查询参数转换为普通对象，再通过 subset 函数提取出指定的键值对。
更新查询参数的函数：

第二个返回的函数接收一个对象参数 params，用于设置新的查询参数。
它首先将 searchParams 转换为普通对象，并合并新的参数对象。
合并后的对象经过 cleanObject 函数清理，去除无效或空值，再使用 setSearchParam 更新查询参数。
 */
