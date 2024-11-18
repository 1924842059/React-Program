import React, { ReactNode } from "react";
import * as auth from "auth-provider";
import { FullPageErrorFallback, FullPageLoading } from "components/lib";

/**
 这行代码导入了 auth-provider 模块中的所有导出内容，并将它们命名为 auth，
 以便通过 auth.someFunction 的形式来访问其中的任何导出内容。

 import * as auth：表示导入 auth-provider 中所有的导出内容，并将它们收集到一个对象 auth 中。
例如：auth.login(data);
auth.register(data);
auth.logout();
 */
import { User } from "screens/project-list/search-panel";
import { http } from "utils/http";
import { useMount } from "utils";
import { useAsync } from "utils/use-async";
import { useQueryClient } from "react-query";
interface AuthForm {
  username: string;
  password: string;
}
const bootstrapUser = async () => {
  let user = null;
  const token = auth.getToken(); //获取用户登录token
  if (token) {
    const data = await http("me", { token }); //http('me', { token }) 表示向 /me 端点发起请求，并将 token 作为请求参数传递。通常，/me 端点会返回当前用户的信息。
    user = data.user;
  }
  return user;
}; //保存登录状态

const AuthContext = React.createContext<
  | {
      user: User | null;
      register: (form: AuthForm) => Promise<void>;
      login: (form: AuthForm) => Promise<void>;
      logout: () => Promise<void>;
    }
  | undefined
>(undefined);
AuthContext.displayName = "Authcontext";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  //这里要引入childern
  const {
    data: user,
    error,
    isLoading,
    isIdle,
    isError,
    run,
    setData: setUser,
  } = useAsync<User | null>();
  const queryClient = useQueryClient();
  // const [user, setUser] = useState<User | null>(null)
  const login = (form: AuthForm) => auth.login(form).then(setUser); //(user => setUser(user)和这个一致，消参)
  const register = (form: AuthForm) =>
    auth.register(form).then((user) => setUser(user ?? null)); //问题，返回了undefined，这样是将undefined转换为null否则类型不匹配
  const logout = () =>
    auth.logout().then(() => {
      setUser(null);
      queryClient.clear(); //登出后清除之前的query数据
    });
  useMount(() => {
    // bootstrapUser().then(setUser)
    run(bootstrapUser());
  });
  if (isIdle || isLoading) {
    return <FullPageLoading />; //页面加载
  }
  //return <AuthContext.Provider children={children} value={{ user, login, register, logout }} />
  if (isError) {
    return <FullPageErrorFallback error={error} />;
  }
  return (
    <AuthContext.Provider
      children={children}
      value={{ user, login, register, logout }}
    />
  );
};
export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth必须在AuthProvider中使用");
  }
  return context;
  /*
    const context = React.useContext(AuthContext);：通过 React.useContext 获取 AuthContext 提供的上下文数据，
    通常包含用户信息（例如 user）以及登录、注册、登出的方法。
    useContext 可以使 useAuth 直接访问 AuthContext 的值，而无需在每个使用的组件中传递 AuthContext。

    if (!context) {...}：检查 context 是否存在。
    useContext 在组件未被 AuthProvider 包裹时，会返回 null，此时会执行 throw new Error(...)。

    如果 context 存在，则直接返回 context，
    这样组件可以通过 useAuth 获得 AuthContext 中的所有数据（例如 user、login、register、logout 方法等）。
    * */
};
