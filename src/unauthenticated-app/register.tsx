import { useAuth } from "context/auth-context";
import React from "react";
import { Form, Input } from "antd";
import { LongButton } from "unauthenticated-app";
import { useAsync } from "utils/use-async";
export const RegisterScreen = ({
  onError,
}: {
  onError: (error: Error) => void;
}) => {
  //定义error属性
  const { register } = useAuth(); //登录注册
  const { run, isLoading } = useAsync();
  //HTMLFormElement extend FormEvent**
  /*const handleSubmit = (event: FormEvent<HTMLFormElement>) => {//为什么直接写FormEvent也不会报错呢，打开handlesubmit的.d.tx文件后我们可以发现它会自动返回(默认类型)一个element的泛型（只需要返回element） ，但onsubmit要求我们返回的是HTMLFormElement,而HTMLFormElement是继承element
        event.preventDefault()
        const username = (event.currentTarget.elements[0] as HTMLInputElement).value
        const password = (event.currentTarget.elements[1] as HTMLInputElement).value
        /*{
        event.currentTarget.elements[0]浏览器自定义属性，表示username
        event.currentTarget.elements[1]浏览器自定义属性，表示password
        as HTMLFormElement强制将element转换成HTMLTnputElement，因为element中没有value属性
        }
        register({ username, password })
    }*/
  const handleSubmit = ({
    cpassword,
    ...values
  }: {
    username: string;
    password: string;
    cpassword: string;
  }) => {
    if (cpassword != values.password) {
      onError(new Error("草泥马，密码输错了不知道？"));
      return;
    } //密码是否相同判断
    run(register(values)).catch(onError); //register错误时调用
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
      <Form.Item
        name={"cpassword"}
        rules={[{ required: true, message: "请确认密码" }]}
      >
        <Input placeholder="确认密码" type="password" id={"cpassword"} />
      </Form.Item>
      <LongButton loading={isLoading} htmlType={"submit"} type={"primary"}>
        注册
      </LongButton>
    </Form>
  ); //antd样式引入
};
