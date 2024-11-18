import { useEffect, useState, useRef } from "react";

export const isFalsy = (value: any) => (value === 0 ? false : !true);
//这个函数用于检查一个值是否为假。
//它特别检查值是否为 0。如果是，它返回 false。
//对于其他所有值，它返回 true，因为 !true 总是 false。
export const cleanObject = (object: { [key: string]: unknown }) => {
  //
  const result = { ...object };
  Object.keys(result).forEach((key) => {
    if (
      result[key] === " " ||
      result[key] === null ||
      result[key] === undefined
    ) {
      delete result[key];
    }
  });
  return result;
};

//这个函数接受一个对象，并移除所有假值的属性
//它使用扩展运算符 ({ ...object }) 创建了输入对象的浅拷贝
//然后，它遍历拷贝对象的键。对于每个键，它检查值是否为假。如果是，就从结果对象中删除该键。
//最后，它返回清理后的对象，只包含真值的属性。

export const useMount = (callback: () => void) => {
  useEffect(() => {
    callback();
    //依赖项加callback会无限循环，和usecallback，usememo有关
    //eslint-disable-next-line react-hooks/exhaustive-deps
    //忽略规则
  }, []);
}; //将渲染一次的状态用usemount展示出来
//使用泛型规范类型，V的值可以在value中找到，指定的是param的类型
//unknow的用法
//let valueNumber=1
//valuenumber =value 会报错，因为unknow不能赋与任何值状态
export const useDebounce = <V>(value: V, delay?: number) => {
  //表示delay要么不写，要么是一个数字,给usedebounce提交范型，定义v那么debouncedvalue也是v
  const [debouncedValue, setDebouncedValue] = useState(value); //usestate的初始值是value，那么debouncedvalue的类型与usestate一致为V
  useEffect(() => {
    //每次在value变化后，设置一个定时器
    const timeout = setTimeout(() => setDebouncedValue(value), delay); //注意这里的括号！！！
    return () => clearTimeout(timeout); //每次在上一个useeffect处理完后执行
  }, [value, delay]);
  return debouncedValue;
};
export const useArray = <T>(initialArray: T[]) => {
  const [value, setValue] = useState(initialArray);
  return {
    value,
    setValue,
    add: (item: T) => setValue([...value, item]),
    clear: () => setValue([]),
    removeIndex: (index: number) => {
      const copy = [...value];
      copy.splice(index, 1);
      setValue(copy);
    },
  };
};
export const useDocumentTitle = (
  title: string,
  keepOnMount: boolean = true,
) => {
  //每个页面标题组件
  const oldTitle = useRef(document.title).current;
  useEffect(() => {
    document.title = title;
  }, [title]);

  useEffect(() => {
    return () => {
      if (!keepOnMount) {
        document.title = oldTitle;
      }
    };
  }, []);
};
export const resetRoute = () => (window.location.href = window.location.origin);
/**
 * 传入一个对象，和键集合，返回对应的对象中的键值对
 * @param obj
 * @param keys
 */
export const subset = <
  O extends { [key in string]: unknown },
  K extends keyof O,
>(
  obj: O,
  keys: K[],
) => {
  const filteredEntries = Object.entries(obj).filter(([key]) =>
    keys.includes(key as K),
  );
  return Object.fromEntries(filteredEntries) as Pick<O, K>;
};
/**
 * 返回组件的挂载状态，如果还没挂载或者已经卸载，返回false；反之，返回true
 */
export const useMountedRef = () => {
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  });

  return mountedRef;
};
