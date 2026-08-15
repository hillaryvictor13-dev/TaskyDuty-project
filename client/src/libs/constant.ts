import type { TaskProps } from "./types";

export const tasks: TaskProps = [
  {
    id: 1,
    tag: "Urgent",
    title: "FinTech Website Update",
    description: "Revamp the user financial data.",
  },
  {
    id: 2,
    tag: "Important",
    title: "Taskduty Update",
    description: "Revamp the user financial data.",
  },
  {
    id: 3,
    tag: "Urgent",
    title: "Online Class Update",
    description: "Revamp the user financial data.",
  },
] as const
