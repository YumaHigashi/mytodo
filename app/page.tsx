"use client";

import debounce from "lodash.debounce";
import React, { useState, useEffect, useCallback } from "react";
import "@/components/ui/index.css";
import { Button } from "@/components/ui/button";
import { TaskFilter } from "@/components/filter-dropdown";
import { Input } from "@/components/ui/input";
import {
  HiArchive,
  HiPencilAlt,
  HiOutlineTrash,
  HiOutlineClock,
} from "react-icons/hi";

export default function MyToDo() {
  const [text, setText] = useState<string>("");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [date, setDate] = useState<Date>(new Date());

  // TODOの更新処理を遅延させる関数
  const updateTodo = useCallback(
    debounce(
      <K extends keyof Todo, V extends Todo[K]>(
        key: K,
        value: V,
        id?: number
      ) => {
        fetch("/api/todos", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ input: { id: id, [key]: value } }),
        });
      },
      1000
    ),
    []
  );

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(new Date(e.target.value));
  };

  const handleSubmit = async () => {
    if (!text) return;
    if (!date) return;

    const newTodo: Todo = {
      value: text,
      // idはDBが自動で割り当てる
      checked: false,
      removed: false,
      completedAt: date,
    };
    // DBにデータを追加する
    fetch("/api/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ input: newTodo }),
    })
      .then((res) => res.json())
      .then((data) => setTodos([...todos, data]));
    setText("");
    setDate(new Date());
  };

  // TODO情報を更新する関数
  const handleTodo = <K extends keyof Todo, V extends Todo[K]>(
    key: K,
    value: V,
    id?: number
  ) => {
    // 先にクライアント側で更新しておく
    setTodos((todos) => {
      const newTodos = todos.map((todo) => {
        if (todo.id === id) {
          return { ...todo, [key]: value }; // [key]: valueはコンピューテッドプロパティ名
        } else {
          return todo;
        }
      });
      return newTodos;
    });
    updateTodo(key, value, id);
  };

  const handleFilter = (filter: Filter) => {
    setFilter(filter);
  };

  const handleEmpty = () => {
    // フィルターがremovedの場合のみ削除処理を行う
    const removedTodos = todos.filter((todo) => todo.removed);
    const ids = removedTodos.map((todo) => todo.id);
    fetch("/api/todos", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ids: ids }),
    });
    setTodos((todos) => todos.filter((todo) => !todo.removed));
  };

  const filteredTodos = todos.filter((todo) => {
    // filterステートの値に応じて異なる内容の配列を返す
    switch (filter) {
      case "all":
        return !todo.removed;
      case "checked":
        return todo.checked && !todo.removed;
      case "unchecked":
        return !todo.checked && !todo.removed;
      case "removed":
        return todo.removed;
      default:
        return todo;
    }
  });

  // ページリロード時にのみDBに保存されたTODOリストを取得する
  useEffect(() => {
    fetch("/api/todos", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => setTodos(data));
  }, []);

  useEffect(() => {
    return () => updateTodo.cancel();
  }, [updateTodo]);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-slate-100">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <TaskFilter
          handleFilter={handleFilter}
          currentFilter={filter}
          className="flex cursor-pointer px-4 py-2 bg-rose-800 hover:bg-rose-900 text-neutral-50 rounded-md"
        />
        {filter === "removed" ? (
          <Button
            onClick={handleEmpty}
            disabled={todos.filter((todo) => todo.removed).length === 0}
            className="bg-rose-500 hover:bg-rose-700"
          >
            <HiOutlineTrash />
            ごみ箱を空にする
          </Button>
        ) : (
          filter !== "checked" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
            >
              <div className="flex items-center gap-2">
                <div className="grid grid-cols-[1fr_auto_auto] items-center">
                  <Input
                    type="text"
                    placeholder="TODOを入力"
                    value={text}
                    onChange={(e) => handleTextChange(e)}
                    className="focus-visible:outline-none focus-visible:ring focus-visible:ring-red-300"
                  />
                  <HiOutlineClock className="size-5" />
                  <Input
                    type="date"
                    value={date.toISOString().split("T")[0]}
                    onChange={(e) => handleDateChange(e)}
                    className="focus-visible:outline-none focus-visible:ring focus-visible:ring-red-300"
                  />
                </div>
                <Button
                  type="submit"
                  onSubmit={handleSubmit}
                  className="bg-rose-500 hover:bg-rose-700"
                >
                  <HiPencilAlt />
                  追加
                </Button>
              </div>
            </form>
          )
        )}
        <ul>
          {filteredTodos.map((todo) => {
            return (
              <li key={todo.id}>
                <div className="grid grid-cols-[auto_1fr_auto] gap-2 items-center">
                  <Input
                    type="checkbox"
                    disabled={todo.removed}
                    checked={todo.checked}
                    onChange={() =>
                      handleTodo("checked", !todo.checked, todo.id)
                    }
                    className="size-6"
                  />
                  <div className="grid grid-cols-[auto_1fr_auto] items-center">
                    <Input
                      type="text"
                      disabled={todo.checked || todo.removed}
                      value={todo.value}
                      onChange={(e) =>
                        handleTodo("value", e.target.value, todo.id)
                      }
                      className="focus-visible:outline-none focus-visible:ring focus-visible:ring-red-300"
                    />
                    <HiOutlineClock className="size-5" />
                    <Input
                      type="date"
                      disabled={todo.checked || todo.removed}
                      value={
                        todo.completedAt
                          ? new Date(todo.completedAt)
                              .toISOString()
                              .split("T")[0]
                          : ""
                      }
                      onChange={(e) => {
                        handleTodo(
                          "completedAt",
                          new Date(e.target.value),
                          todo.id
                        );
                      }}
                      className="focus-visible:outline-none focus-visible:ring focus-visible:ring-red-300"
                    />
                  </div>
                  <Button
                    onClick={() =>
                      handleTodo("removed", !todo.removed, todo.id)
                    }
                    className="bg-indigo-700 hover:bg-indigo-900"
                  >
                    <HiArchive />
                    {todo.removed ? "復元?" : "削除"}
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      </main>
    </div>
  );
}
