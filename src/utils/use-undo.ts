import { useCallback, useReducer } from "react";

const UNDO = "UNDO";
const REDO = "REDO";
const SET = "SET";
const RESET = "RESET";
type State<T> = {
  past: T[];
  present: T;
  future: T[];
};
type Action<T> = {
  newPresent?: T;
  type: typeof UNDO | typeof REDO | typeof SET | typeof RESET;
};
const undoReducer = <T>(state: State<T>, action: Action<T>) => {
  const { past, present, future } = state;
  const { newPresent } = action;
  switch (action.type) {
    case UNDO: {
      if (past.length === 0) return state;
      const previous = past[past.length - 1];
      const newPast = past.slice(0, past.length - 1);
      return {
        past: newPast,
        present: previous,
        future: [present, ...future],
      };
    }
    /**
         undo 使用 useCallback 记忆化。每次调用 undo 时，如果 past 中有历史记录，则会将 past 中的最新状态设为 present，
         并将之前的 present 加入 future 中。
         如果没有历史记录，则直接返回当前状态不作更改。
         */
    case REDO: {
      if (future.length === 0) return state;
      const next = future[0];
      const newFuture = future.slice(1);
      return {
        past: [...past, present],
        present: next,
        future: newFuture,
      };
    }
    /**
     * redo 也使用了 useCallback，且逻辑类似于 undo，但作用于 future。
     * 当存在 future 状态时，将其第一个状态设为 present，并将当前 present 加入 past。
     */
    case SET: {
      if (newPresent === present) {
        return state;
      }
      return {
        past: [...past, present],
        present: newPresent,
        future: [],
      };
    }
    /**
         * set 用于将新状态加入 present。如果新状态和当前状态相同，则不更新，以避免重复状态进入历史记录。
          每次设置新状态后，future 被清空，以确保无法在此状态后重做过去的状态。
         */
    case RESET: {
      return {
        past: [],
        present: newPresent,
        future: [],
      };
    }
  }
  return state;
};
export const useUndo = <T>(initialPresent: T) => {
  const [state, dispatch] = useReducer(undoReducer, {
    past: [],
    present: initialPresent,
    future: [],
  } as State<T>);
  const canUndo = state.past.length !== 0;
  const canRedo = state.future.length !== 0;
  const undo = useCallback(() => dispatch({ type: UNDO }), []);
  const redo = useCallback(() => dispatch({ type: REDO }), []);
  const set = useCallback(
    (newPresent: T) => dispatch({ type: SET, newPresent }),
    [],
  );
  const reset = useCallback(
    (newPresent: T) => dispatch({ type: RESET, newPresent }),
    [],
  );
  return [state, { set, reset, undo, redo, canUndo, canRedo }] as const;
  /**
   * Hook 返回一个状态对象 state，包含 past、present、future 以及一组操作方法（set、reset、undo、redo）和状态标志（canUndo 和 canRedo）。
   */
};
