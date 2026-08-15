import { Link, useParams,useNavigate } from 'react-router'
import { ChevronLeft } from 'lucide-react'
import {useForm,type SubmitHandler} from "react-hook-form"
import {createTaskSchema, type CreateTaskType} from "../../libs/formvalidation";
import {zodResolver} from "@hookform/resolvers/zod"
import { getSingleTaskApi,updateTaskApi } from '../../api/task';
import {  useState, useEffect } from 'react';
import { useAuth } from '../../context';
import axios from 'axios';
import {toast} from "sonner"
import type { TaskProps } from '../../libs/types'
import SuspenseUi from '../../componets/SuspenseUi';

export default function EditTask() {
  const { taskId } = useParams()
  const [singleTask,setSingleTask] = useState<TaskProps | null> (null)
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { accessToken } = useAuth();
  const navigate = useNavigate()

  console.log(singleTask)

  useEffect(() => {
    const getTask = async () => {
      if (!accessToken) return;

      setLoading(true);
      setError(null);

      try {
        const res = await getSingleTaskApi(taskId as string, accessToken);

        if (res.status === 200) {
          setSingleTask(res.data.task)
        }

      } catch (err) {
        console.error("Error loading task:", err);
        const message = axios.isAxiosError(err)
          ? err.response?.data?.message ?? err.message ?? 'Failed to load task. Please try again.'
          : 'Failed to load task. Please try again.';
        setError(message);
        toast.error(message)
      } finally {
        setLoading(false)
      }
    };

    getTask();
  }, [accessToken, taskId]);

  const { register, handleSubmit, formState: { errors, isSubmitting }, 
  setValue,
   } = useForm<CreateTaskType>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: singleTask?.title || "",
      description: singleTask?.description || "",
      tag: singleTask?.tag || "Urgent"
    }
  });

  console.log(singleTask)

  useEffect(() => {
    if (singleTask) {
      setValue("description", singleTask.description)
      setValue("title", singleTask.title)
      setValue("tag", singleTask.tag)
      }
    
  }, [singleTask, setValue])


  const onFormSubmit: SubmitHandler<CreateTaskType> = async (data) => {
    try {
      const res = await updateTaskApi(taskId as string, data, accessToken);
      if (res.status === 200) {
        toast.success("Task updated successfully");
            navigate("/my-tasks")
      }
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message ?? 'Failed to update task'
        : 'Failed to update task';
      toast.error(message);
    }
  }

if (loading) {
    return <SuspenseUi />;
  }

  if (error) {
    return (
      <div className='container mx-auto py-8 px-4'>
        <h1 className="text-center font-medium text-2xl text-red-500">{error}</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/my-tasks" className="flex items-center gap-2 text-primary mb-6">
        <ChevronLeft size={20} />
        Back to Tasks
      </Link>

      <div className="card bg-base-100 shadow-xl p-6">
        <h1 className="text-3xl font-bold mb-6">Edit Task</h1>

        <form onSubmit={handleSubmit(onFormSubmit)}>
          <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4 mb-4">
            <legend className="fieldset-legend">Title</legend>
            <input type="text" className="input w-full input-lg" placeholder="Task title" {...register("title")} />
            {errors.title && <p className="text-red-500 label">{errors.title.message}</p>}
          </fieldset>

          <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4 mb-4">
            <legend className="fieldset-legend">Description</legend>
            <textarea className="textarea w-full textarea-lg" placeholder="Briefly describe your task" {...register("description")} rows={8}></textarea>
            {errors.description && <p className="text-red-500 label">{errors.description.message}</p>}
          </fieldset>

          <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4 mb-6">
            <legend className="fieldset-legend">Tag</legend>
            <select className="select w-full" {...register("tag")}>
              <option disabled>Pick a Tag</option>
              <option value="Urgent">Urgent</option>
              <option value="Important">Important</option>
            </select>
            {errors.tag && <p className="text-red-500 label">{errors.tag.message}</p>}
          </fieldset>

          <button type="submit" className="btn bg-textPurple text-white w-full btn-lg" disabled={isSubmitting}>
            {isSubmitting ? <span className="loading loading-spinner loading-sm"></span> : "Update Task"}
          </button>
        </form>
      </div>
    </div>
  );
}
