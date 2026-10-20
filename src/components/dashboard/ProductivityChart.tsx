"use client";

import React, { useState } from "react";
import { useTodo } from "@/lib/context/TodoContext";
import { TrendingUp, CheckCircle, PlusCircle } from "lucide-react";

export function ProductivityChart() {
  const { stats } = useTodo();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const data = stats.weeklyProductivity;
  const maxVal = Math.max(...data.map((d) => Math.max(d.completed, d.created)), 4);

  const chartHeight = 150;

  const totalWeeklyCompleted = data.reduce((acc, curr) => acc + curr.completed, 0);
  const totalWeeklyCreated = data.reduce((acc, curr) => acc + curr.created, 0);

  return (
    <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-slate-900 dark:text-white text-base">
              Weekly Productivity Velocity
            </h3>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
              Last 7 Days
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real task activity from your database
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
            <span className="text-slate-600 dark:text-slate-400">Completed ({totalWeeklyCompleted})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-blue-500/50" />
            <span className="text-slate-600 dark:text-slate-400">Created ({totalWeeklyCreated})</span>
          </div>
        </div>
      </div>

      {/* SVG Interactive Chart */}
      <div className="relative pt-4 pb-2">
        <div className="flex items-end justify-between h-[150px] gap-2 px-2 border-b border-slate-100 dark:border-slate-800">
          {data.map((item, index) => {
            const completedHeight = Math.max((item.completed / maxVal) * chartHeight, 4);
            const createdHeight = Math.max((item.created / maxVal) * chartHeight, 4);
            const isHovered = hoveredIndex === index;

            return (
              <div
                key={item.date}
                className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Tooltip on hover */}
                {isHovered && (
                  <div className="absolute -top-12 z-20 bg-slate-900 dark:bg-slate-800 text-white text-[11px] py-1.5 px-2.5 rounded-lg shadow-xl pointer-events-none whitespace-nowrap border border-slate-700 animate-in-fast">
                    <p className="font-semibold text-slate-200">{item.day} ({item.date})</p>
                    <p className="text-emerald-400 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> {item.completed} completed
                    </p>
                    <p className="text-blue-300 flex items-center gap-1">
                      <PlusCircle className="w-3 h-3" /> {item.created} created
                    </p>
                  </div>
                )}

                {/* Bars side-by-side */}
                <div className="flex items-end gap-1.5 w-full justify-center">
                  {/* Completed bar */}
                  <div
                    style={{ height: `${completedHeight}px` }}
                    className={`w-3.5 sm:w-4 rounded-t-md transition-all duration-300 ${
                      item.completed > 0
                        ? "bg-gradient-to-t from-emerald-600 to-emerald-400"
                        : "bg-slate-200 dark:bg-slate-800"
                    } ${isHovered ? "ring-2 ring-emerald-400/50" : ""}`}
                  />
                  {/* Created bar */}
                  <div
                    style={{ height: `${createdHeight}px` }}
                    className={`w-3.5 sm:w-4 rounded-t-md transition-all duration-300 ${
                      item.created > 0
                        ? "bg-gradient-to-t from-blue-600 to-blue-400 opacity-60"
                        : "bg-slate-200 dark:bg-slate-800"
                    } ${isHovered ? "opacity-100" : ""}`}
                  />
                </div>

                <div className="mt-2 text-center">
                  <span className={`text-[11px] font-medium block ${isHovered ? "text-blue-500 font-bold" : "text-slate-400"}`}>
                    {item.day}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
        <span className="flex items-center gap-1">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
          <span>Productivity updates automatically on task actions</span>
        </span>
        <span>
          Net throughput:{" "}
          <strong className={totalWeeklyCompleted >= totalWeeklyCreated ? "text-emerald-500" : "text-amber-500"}>
            {totalWeeklyCompleted >= totalWeeklyCreated ? "+" : ""}
            {totalWeeklyCompleted - totalWeeklyCreated}
          </strong>
        </span>
      </div>
    </div>
  );
}
