import { Trash } from "lucide-react";
import { useAuth } from "../context";
import { useState,useRef } from "react";
import { toast } from "sonner";
import { deleteTaskApi } from "../api/task";
import axios from "axios";
import { useNavigate } from "react-router";
import type { TaskProps } from "../libs/types";

export default function DeleteModal({ task }: { task: TaskProps }) {
  const { accessToken } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const dialogRef = useRef<HTMLDialogElement | null>(null);


  console.log(task._id)

  const deleteTask = async () => {
    setLoading(true);
    try {
      const res = await deleteTaskApi(task._id, accessToken);
      if (res.status === 200) {
        toast.message(res.data.msg);
        navigate(0);

      }
    } catch (error) {
      console.log(error)
      const message =
        axios.isAxiosError(error) &&
        error?.response?.data &&
        typeof (error?.response?.data as { error?: unknown }).error === "string"
          ? (error?.response?.data as { error: string }).error
          : "something went wrong"
      toast.error(message);
    } finally {
      setLoading(false)
    }
  };

  return (
    <>
      {/* Open the modal using document.getElementById('ID').showModal() method */}
      <button
        className="btn btn-outline border-textPurple  bg-white text-textPurple"
        onClick={() => {
          
          dialogRef.current?.showModal();
        }}>

        <Trash /> Delete
      </button>
      <dialog ref={dialogRef}  className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Delete Task!{task.title}</h3>
          <p className="py-4">Are You Sure You Want To Delete This Task</p>
          <div className="modal-action">
            <button
              className="btn btn-error"
              disabled={loading}
              onClick={deleteTask}>
              {loading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "Delete"
              )}
            </button>
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}
