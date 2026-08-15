import { useForm, type SubmitHandler } from 'react-hook-form'
import { registerSchema, type RegisterType } from '../../libs/formvalidation'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router'
import { register as registerUser } from '../../api/auth'
import { toast } from 'sonner'
import { useAuth } from '../../context'
import axios from 'axios'

export default function Register() {
  const navigate = useNavigate()
  const { setUser, setAccessToken } = useAuth()

        navigate('/')


  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterType>({
    resolver: zodResolver(registerSchema),
  })

  const onFormSubmit: SubmitHandler<RegisterType> = async (data) => {
    try {
      const result = await registerUser(data.username, data.email, data.password)
      const { user, accessToken } = result

      if (accessToken) {
        setAccessToken(accessToken)
      }

      if (user) {
        setUser({ id: user._id ?? user.id, username: user.username })
      }

      toast.success('Registration successful!')
      navigate('/my-tasks')
    } catch (error: any) {
      console.log(error)
      const message = axios.isAxiosError(error) ? error.response?.data?.message : 'Registration failed. Please try again.'
      toast.error(message)
    }
  }


  return (
   <form className="py-6 px-4 space-y-5" onSubmit={handleSubmit(onFormSubmit)}>
      <h1 className="font-semibold text-md">Register An Account</h1>
      <fieldset className="fieldset">
        <legend className="fieldset-legend">Username</legend>
        <input type="text" className="input" placeholder="Your Username" {...register('username')} />
        {errors?.username && (
          <p className="text-red-500 label">{errors?.username?.message}</p>
        )}
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">Email</legend>
        <input type="email" className="input" placeholder="Your email" {...register('email')} />
        {errors?.email && (
          <p className="text-red-500 label">{errors.email.message}</p>
        )}
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">Password</legend>
        <input type="password" className="input" placeholder="*****" {...register('password')} />
        {errors?.password && (
          <p className="text-red-500 label">{errors.password.message}</p>
        )}
      </fieldset>
      <button type="submit" className="btn bg-textPurple text-white w-80 btn-lg py-5" disabled={isSubmitting}>
        {isSubmitting ? <span className="loading loading-spinner loading-sm"></span> : 'Submit'}
      </button>
      
      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </form>
  )
}
