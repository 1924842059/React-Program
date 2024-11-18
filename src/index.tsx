import "./utils/wydr";
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { DevTools, loadServer } from "jira-dev-tool";
import { AppProviders } from "context";
import { QueryClient, QueryClientProvider } from "react-query";
const queryClient = new QueryClient();

// 务必在jira-dev-tool后面引入

loadServer(() =>
  ReactDOM.render(
    //dom节点挂载渲染到页面
    //queryclient引用
    <QueryClientProvider client={queryClient}>
      <React.StrictMode>
        <AppProviders>
          <DevTools />
          <App />
        </AppProviders>
        ,
      </React.StrictMode>
      ,
    </QueryClientProvider>,

    document.getElementById("root"),
  ),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
