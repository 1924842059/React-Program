import React from "react";
import { useTasksSearchParams } from "screens/kanban/util";
import { useSetUrlSearchParam } from "utils/url";
import { Row } from "components/lib";
import { Button, Input } from "antd";
import { UserSelect } from "components/user-select";
import { TaskTypeSelect } from "components/task-type-select";
export const SearchPanel = () => {
  const searchParams = useTasksSearchParams();
  const setSearchParams = useSetUrlSearchParam();
  const reset = () => {
    setSearchParams({
      typeId: undefined,
      processorId: undefined,
      tagId: undefined,
      name: undefined,
    });
    /**
    功能：reset 函数用于重置搜索条件。通过调用 setSearchParams，它将所有筛选条件（如 typeId、processorId、tagId 和 name）清空，
    即设置为 undefined，从而将搜索面板恢复到默认状态。
         */
  };
  return (
    <Row marginBottom={4} gap={true}>
      <Input
        style={{ width: "20rem" }}
        placeholder={"任务名"}
        value={searchParams.name}
        onChange={(evt) => setSearchParams({ name: evt.target.value })}
      />
      <UserSelect
        defaultOptionName={"经办人"}
        value={searchParams.processorId}
        onChange={(value) => setSearchParams({ processorId: value })}
      />
      <TaskTypeSelect
        defaultOptionName={"类型"}
        value={searchParams.typeId}
        onChange={(value) => setSearchParams({ typeId: value })}
      />
      <Button onClick={reset}>清除筛选器</Button>
    </Row>
    /**
         Row 组件被用来水平排列这些表单项，并为它们设置间距（marginBottom={4} 和 gap={true}）。这可能是一个自定义的布局组件，用于简化栅格布局。
         Input 组件：

         用于输入任务名称。它的 value 绑定到 searchParams.name，表示当前的任务名称筛选条件。
         用户输入时，会触发 onChange 事件，调用 setSearchParams 更新 URL 中的 name 参数。
         UserSelect 组件： 

        用于选择任务的经办人。value 绑定到 searchParams.processorId，表示当前筛选的经办人。
        用户选择不同的经办人时，会触发 onChange 事件，调用 setSearchParams 更新 processorId 参数。
        TaskTypeSelect 组件：

        用于选择任务类型。value 绑定到 searchParams.typeId，表示当前筛选的任务类型。
        用户选择任务类型时，触发 onChange 更新 typeId 参数。
        Button 组件：

        一个按钮，点击后会触发 reset 函数，清除所有的筛选条件，恢复到初始状态
         */
  );
};
