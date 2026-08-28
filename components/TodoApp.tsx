"use client";

import { useEffect, useMemo, useState } from "react";

type Todo = {
  id: string;
  text: string;
  done: boolean;
  createdAt: number;
};

type Filter = "all" | "active" | "done";

const STORAGE_KEY = "todo2.todos";

function loadTodos(): Todo[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [text, setText] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration from localStorage on mount
    setTodos(loadTodos());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos, loaded]);

  const remaining = useMemo(() => todos.filter((t) => !t.done).length, [todos]);

  const visibleTodos = useMemo(() => {
    switch (filter) {
      case "active":
        return todos.filter((t) => !t.done);
      case "done":
        return todos.filter((t) => t.done);
      default:
        return todos;
    }
  }, [todos, filter]);

  function addTodo() {
    const trimmed = text.trim();
    if (!trimmed) return;
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text: trimmed,
      done: false,
      createdAt: Date.now(),
    };
    setTodos((prev) => [newTodo, ...prev]);
    setText("");
  }

  function toggleTodo(id: string) {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  }

  function deleteTodo(id: string) {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }

  function clearDone() {
    setTodos((prev) => prev.filter((t) => !t.done));
  }

  return (
    <div className="w-full max-w-md mx-auto py-16 px-4">
      <h1 className="text-3xl font-semibold text-zinc-900 dark:text-zinc-50 mb-6 text-center">
        TODO
      </h1>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") addTodo();
          }}
          placeholder="やることを入力..."
          className="flex-1 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2 text-zinc-900 dark:text-zinc-50 outline-none focus:ring-2 focus:ring-zinc-400"
        />
        <button
          onClick={addTodo}
          className="rounded-lg bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 px-4 py-2 font-medium hover:opacity-90 transition-opacity"
        >
          追加
        </button>
      </div>

      <div className="flex items-center justify-between mb-3 text-sm text-zinc-500 dark:text-zinc-400">
        <span>{remaining} 件 未完了</span>
        <div className="flex gap-1">
          {(["all", "active", "done"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-2 py-1 rounded-md ${
                filter === f
                  ? "bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900"
                  : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
            >
              {f === "all" ? "すべて" : f === "active" ? "未完了" : "完了"}
            </button>
          ))}
        </div>
      </div>

      <ul className="flex flex-col gap-2">
        {visibleTodos.length === 0 && (
          <li className="text-center text-zinc-400 dark:text-zinc-600 py-8">
            タスクがありません
          </li>
        )}
        {visibleTodos.map((todo) => (
          <li
            key={todo.id}
            className="flex items-center gap-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-3"
          >
            <input
              type="checkbox"
              checked={todo.done}
              onChange={() => toggleTodo(todo.id)}
              className="h-5 w-5 accent-zinc-900 dark:accent-zinc-50"
            />
            <span
              className={`flex-1 break-words ${
                todo.done
                  ? "line-through text-zinc-400 dark:text-zinc-600"
                  : "text-zinc-900 dark:text-zinc-50"
              }`}
            >
              {todo.text}
            </span>
            <button
              onClick={() => deleteTodo(todo.id)}
              aria-label="削除"
              className="text-zinc-400 hover:text-red-500 transition-colors"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>

      {todos.some((t) => t.done) && (
        <div className="mt-4 text-right">
          <button
            onClick={clearDone}
            className="text-sm text-zinc-500 hover:text-red-500 transition-colors"
          >
            完了済みを削除
          </button>
        </div>
      )}
    </div>
  );
}
