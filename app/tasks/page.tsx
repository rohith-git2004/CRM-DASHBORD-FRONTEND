"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Sidebar from "../components/sidebar";
import Topbar from "../components/topbar";

import {
  Plus,
  CircleCheck,
  Clock,
} from "lucide-react";

import { Task, getTasks } from "@/services/tasks";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (error) {
      console.error("Task Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#111827]">

      <Sidebar />

      <div className="flex-1 flex flex-col">

        <Topbar />

        <main className="p-8">

          <div className="mb-8 flex items-center justify-between">

            <div>

              <h1 className="text-3xl font-bold text-white">
                Tasks
              </h1>

              <p className="mt-1 text-gray-400">
                Manage your daily tasks
              </p>

            </div>

            <Link
  href="/tasks/new"
  className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-white transition hover:bg-blue-700"
>
  <Plus size={18} />
  Add Task
</Link>

          </div>

          {loading ? (

            <div className="py-20 text-center text-white">
              Loading Tasks...
            </div>

          ) : tasks.length === 0 ? (

            <div className="rounded-xl bg-[#1F2937] p-8 text-center text-gray-400">
              No Tasks Found
            </div>

          ) : (

            <div className="space-y-4">

              {tasks.map((task) => (

                <div
                  key={task._id}
                  className="flex items-center justify-between rounded-2xl border border-[#374151] bg-[#1F2937] p-5 hover:border-blue-500 transition"
                >

                  <div className="flex items-center gap-4">

                    {task.status === "Completed" ? (
  <CircleCheck className="text-green-500" size={24} />
) : (
  <Clock className="text-yellow-400" size={24} />
)}

                    <div>

                      <h3 className="font-semibold text-white">
                        {task.title}
                      </h3>

                      <p className="mt-2 text-sm text-gray-400">
                        {task.description}
                      </p>

                      <span
  className={`mt-3 inline-block rounded-full px-3 py-1 text-xs ${
    task.status === "Completed"
      ? "bg-green-500/20 text-green-400"
      : task.status === "In Progress"
      ? "bg-blue-500/20 text-blue-400"
      : "bg-yellow-500/20 text-yellow-400"
  }`}
>
  {task.status}
</span>

                    </div>

                  </div>

                  <button className="rounded-lg border border-[#374151] px-4 py-2 text-white hover:bg-[#374151]">
                    View
                  </button>

                </div>

              ))}

            </div>

          )}

        </main>

      </div>

    </div>
  );
}