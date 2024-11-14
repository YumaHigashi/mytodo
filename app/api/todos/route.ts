//
// APIエンドポイントの処理を記述するファイル
//
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// データベースから全てのTodoを取得する(条件分けはフロント側で行う)
export const GET = async () => {
  try {
    console.log("Attempting to fetch todos from the database...");
    const todos: Todo[] = await prisma.todo.findMany();
    if (!todos) throw new Error("No todos found");
    return NextResponse.json(todos);
  } catch (error) {
    return NextResponse.json({ error: { error } }, { status: 500 });
  }
};

// データベースにTodoを追加する
export const POST = async (request: Request) => {
  try {
    const { input }: { input: Todo } = await request.json();
    const newTodo: Todo = await prisma.todo.create({
      data: {
        value: input.value,
        checked: input.checked,
        removed: input.removed,
        completedAt: input.completedAt ? input.completedAt : null,
      },
    });
    return NextResponse.json(newTodo);
  } catch (error) {
    return NextResponse.json({ error: { error } }, { status: 500 });
  }
};

// データベースのTodoの一部を一件更新する
export const PATCH = async (request: Request) => {
  try {
    const { input }: { input: Todo } = await request.json();
    const updatedTodo: Todo = await prisma.todo.update({
      where: { id: input.id },
      data: {
        value: input.value,
        checked: input.checked,
        removed: input.removed,
        completedAt: input.completedAt ? input.completedAt : null,
      },
    });
    return NextResponse.json(updatedTodo);
  } catch (error) {
    return NextResponse.json({ error: { error } }, { status: 500 });
  }
};

// 複数のTODOの削除処理
export const DELETE = async (request: Request) => {
  try {
    const { ids }: { ids: number[] } = await request.json();
    if (!ids) {
      // idsがない場合はエラーを返す
      return NextResponse.json({ error: "ids are required" }, { status: 400 });
    }
    const deletedTodos = await prisma.todo.deleteMany({
      where: { id: { in: ids } },
    });
    return NextResponse.json(deletedTodos);
  } catch (error) {
    return NextResponse.json({ error: { error } }, { status: 500 });
  }
};
