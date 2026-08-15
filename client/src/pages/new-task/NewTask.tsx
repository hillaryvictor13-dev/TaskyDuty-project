import { Link, useNavigate } from "react-router";
import {useForm,type SubmitHandler} from "react-hook-form"
import {createTaskSchema, type CreateTaskType} from "../../libs/formvalidation";
import {zodResolver} from "@hookform/resolvers/zod"
import { ChevronLeft } from "lucide-react";
import {createTaskApi} from "../../api/task";
import {toast} from "sonner"
import {useAuth} from "../../context"
import axios from "axios";



export default function NewTask() {
const{register,handleSubmit,formState:{errors,isSubmitting}}=useForm<CreateTaskType>({
  resolver: zodResolver(createTaskSchema)
})
const {accessToken}=useAuth();
const navigate = useNavigate();


const onFormSubmit: SubmitHandler<CreateTaskType> = async (data) => {
  if (!accessToken) {
    toast.error("You must be logged in to create a task.");
    return;
  }

  try {
    const res = await createTaskApi(data, accessToken);
    toast.success("Task created successfully!");

    if (res.status === 201) {
      toast.success(res.data?.message ?? "Task created successfully!");
      navigate("/my-tasks");
    }
  } catch (error) {
    console.log(error);
    const message = axios.isAxiosError(error)
      ? error.response?.data?.message ?? 'Task creation failed. Please try again.'
      : 'Task creation failed. Please try again.';
    toast.error(message);
  }
};

  return (
    <div className="container py-8 px-4 mx-auto">
        <div className="flex gap-2 items-center text-[34px] text-textBlack ">
            <Link to="/my-tasks" > <ChevronLeft size={30}/></Link>
            <h1> New Task</h1>
        </div>
        <form onSubmit={handleSubmit(onFormSubmit)} className="w-full space-y-6">
<fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4">
  <legend className="fieldset-legend">Title</legend>
  <input type="text" className="input w-full" placeholder="Eg: Project Defence, Assignment" {...register("title")} />
  {errors.title && <p className="text-red-500 label">{errors.title.message}</p>}
</fieldset>

<fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4">
  <legend className="fieldset-legend">Description</legend>
  <textarea className="textarea w-full textarea-lg" placeholder="Briefly describe your task" {...register("description")} rows={8}></textarea>
  {errors.description && <p className="text-red-500 label">{errors.description.message}</p>}
</fieldset>

<fieldset className="fieldset  bg-base-200 border-base-300 rounded-box w-full border p-4">
  <legend className="fieldset-legend">Tag</legend>
  <select defaultValue="" className="select w-full" {...register("tag")} >
    <option value="" disabled>Pick a Tag</option>
    <option value="urgent">Urgent</option>
    <option value="important">Important</option>

  </select>
  {errors.tag && <p className="text-red-500 label">{errors.tag.message}</p>}
</fieldset>
<button type="submit" className="btn bg-textPurple text-white  w-full btn-lg" disabled={isSubmitting}>
    {isSubmitting? <span className="loading loading-spinner loading-sm"></span> :"Submit"}
</button>
        </form>
    </div>
  )
}
