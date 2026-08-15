import { Plus, } from 'lucide-react';
import { Link } from 'react-router';
import { getUserTaskApi } from '../../api/task';
import { useAuth } from '../../context';
import { useEffect, useState } from 'react';
import type { TaskProps } from '../../libs/types';
import axios from 'axios';
import { toast } from 'sonner';
import SuspenseUi from '../../componets/SuspenseUi';
import TaskCard from '../../componets/TaskCard';

export default function MyTasks() {
  const [data, setData] = useState<TaskProps[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { accessToken } = useAuth();

  useEffect(() => {
    const getTasks = async () => {
      if (!accessToken) return;

      setLoading(true);
      setError(null);

      try {
        const res = await getUserTaskApi(accessToken);
      
        
        if (res.status ===200){
          setData(res.data.tasks)
        }

      } catch (err) {
      
        const message = axios.isAxiosError(err)
          ? err.response?.data?.message ?? 'Failed to load tasks. Please try again.'
          : 'Failed to load tasks. Please try again.';
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    getTasks();
  }, [accessToken]);

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

console.log(data)
  return (
    <div className="container mx-auto py-8 px-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="font-medium text-2xl md:text-[50px] text-textBlack">My Tasks</h1>
        <Link to="/new-task">
          <button className="btn btn-ghost btn-lg text-textPurple">
            <Plus />
            Add New Task
          </button>
        </Link>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {data.length === 0 ? (
        <p className="text-textGray">No tasks found.</p>
      ) : (
        data.map((task) => (
          <TaskCard task={task} key={task._id} />
          
        ))
      )}
    </div>
  );
}
