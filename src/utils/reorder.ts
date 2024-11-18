/**
 * 在本地对排序进行乐观更新
 * @param fromId 要排序的项目的id
 * @param type 'before' | 'after'
 * @param referenceId 参照id
 * @param list 要排序的列表, 比如tasks, kanbans
 */
export const reorder = ({
  fromId,
  type,
  referenceId,
  list,
  /**
    list: 一个包含项目的数组，每个项目有一个 id 字段。
    fromId: 要移动的项目的 id。
    type: 插入类型，可以是 "before" 或 "after"，表示目标项的前或后。
    referenceId: 作为参考项的 id，用来确定插入的位置。
     */
}: {
  list: { id: number }[];
  fromId: number;
  type: "after" | "before";
  referenceId: number;
}) => {
  const copiedList = [...list];
  // 找到fromId对应项目的下标
  const movingItemIndex = copiedList.findIndex((item) => item.id === fromId);
  if (!referenceId) {
    return insertAfter([...copiedList], movingItemIndex, copiedList.length - 1);
  } //如果 referenceId 为 null 或 undefined，表示没有指定目标项，则将目标项插入到列表的最后。

  const targetIndex = copiedList.findIndex((item) => item.id === referenceId);
  const insert = type === "after" ? insertAfter : insertBefore;
  return insert([...copiedList], movingItemIndex, targetIndex);
  //如果指定了 referenceId，则找到目标项 referenceId 对应的下标，并根据 type（"before" 或 "after"）选择调用 insertBefore 或 insertAfter。
};
/**
 * 在list中，把from放在to的前边
 * @param list
 * @param from
 * @param to
 */

//insertBefore 用于将从 from 索引处的项插入到 to 索引处的项前面。
/**
 通过 splice 移除 from 位置的项。
获取目标项 toItem，并找到其位置。
使用 splice 将被移除的项插入到目标项的前面。
 * @param list 
 * @param from 
 * @param to 
 * @returns 
 */
const insertBefore = (list: unknown[], from: number, to: number) => {
  const toItem = list[to];
  const removedItem = list.splice(from, 1)[0];
  const toIndex = list.indexOf(toItem);
  list.splice(toIndex, 0, removedItem);
  return list;
};
/**
 * 在list中，把from放在to的后面
 * @param list
 * @param from
 * @param to
 */
const insertAfter = (list: unknown[], from: number, to: number) => {
  const toItem = list[to];
  const removedItem = list.splice(from, 1)[0];
  const toIndex = list.indexOf(toItem);
  list.splice(toIndex + 1, 0, removedItem);
  return list;
};
/**
 *假设我们有一个列表 list = [{ id: 1 }, { id: 2 }, { id: 3 }]，并想将 id 为 2 的项移动到 id 为 3 的项后面。
 {
 const list = [{ id: 1 }, { id: 2 }, { id: 3 }];
const result = reorder({
    list,
    fromId: 2,
    type: "after",
    referenceId: 3,
});

console.log(result);
// 输出：[{ id: 1 }, { id: 3 }, { id: 2 }]

 }
 */
