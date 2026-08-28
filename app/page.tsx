import TodoApp from "@/components/TodoApp";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center bg-zinc-50 dark:bg-black min-h-screen">
      <TodoApp />
    </div>
  );
}
