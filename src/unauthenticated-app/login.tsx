import { useAuth } from "context/auth-context";
import React from "react";
import { Form, Input } from "antd";
import { useAsync } from "utils/use-async";
import { LongButton } from "unauthenticated-app";

export const LoginScreen = ({
  onError,
}: {
  onError: (error: Error) => void;
}) => {
  const { login } = useAuth(); //登录注册
  const { run, isLoading } = useAsync(); //登录加载展示

  /* //HTMLFormElement extend FormEvent**
     const handleSubmit = (event: FormEvent<HTMLFormElement>) => {//为什么直接写FormEvent也不会报错呢，打开handlesubmit的.d.tx文件后我们可以发现它会自动返回(默认类型)一个element的泛型（只需要返回element） ，但onsubmit要求我们返回的是HTMLFormElement,而HTMLFormElement是继承element
         event.preventDefault()
         const username = (event.currentTarget.elements[0] as HTMLInputElement).value;
         const password = (event.currentTarget.elements[1] as HTMLInputElement).value;
         /*{
         event.currentTarget.elements[0]浏览器自定义属性，表示username
         event.currentTarget.elements[1]浏览器自定义属性，表示password
         as HTMLFormElement强制将element转换成HTMLTnputElement，因为element中没有value属性
         }
         login({ username, password })
     }*/
  const handleSubmit = (values: { username: string; password: string }) => {
    run(login(values)).catch(onError); //login错误时调用，调用run函数
    /*
        try catch的写法
        const handelsubmit=async (values:{username:string,password:string})=>{
        try{
        await login(calues)
        }catch(e){
        onError(e)
        }
        }
        为什么要写async await呢，因为login是异步函数，如果不加await他不会等login执行完再抛出错误，而是直接抛出错误，这样就无法显示
        */
  }; //antd所特有的属性
  return (
    <Form onFinish={handleSubmit}>
      <Form.Item
        name={"username"}
        rules={[{ required: true, message: "请输入用户名" }]}
      >
        <Input placeholder={"用户名"} type="text" id={"username"} />
      </Form.Item>
      <Form.Item
        name={"password"}
        rules={[{ required: true, message: "请输入密码" }]}
      >
        <Input placeholder="密码" type="password" id={"password"} />
      </Form.Item>
      <LongButton loading={isLoading} htmlType={"submit"} type={"primary"}>
        登录
      </LongButton>
    </Form>
  ); //antd样式引入
};
