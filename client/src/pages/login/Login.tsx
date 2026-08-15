import { Link } from 'react-router'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { loginSchema, type LoginType } from '../../libs/formvalidation'
import { zodResolver } from '@hookform/resolvers/zod'
import { login as loginUser } from '../../api/auth'
import { toast } from 'sonner'
import { useAuth } from '../../context'
import axios from 'axios'



export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginType>({
    resolver: zodResolver(loginSchema),
  })
const { setUser, setAccessToken } = useAuth()
  const onFormSubmit: SubmitHandler<LoginType> = async (data) => {
    try {
      const result = await loginUser(data.email, data.password)
      const { user, accessToken } = result

      if (accessToken) {
        setAccessToken(accessToken)
      }

      if (user) {
        setUser({ id: user._id ?? user.id, username: user.username })
      }

      toast.success('Login successful!')
    } catch (error: any) {
      console.log(error)
      const message = axios.isAxiosError(error) ? error.response?.data?.message : 'Login failed. Please try again.'
      toast.error(message)
    }
  }

  return (
    <form className="py-6 px-4 space-y-5" onSubmit={handleSubmit(onFormSubmit)}>
      <h1 className="font-semibold text-md">Login Into Your Account</h1>
      <fieldset className="fieldset">
        <legend className="fieldset-legend">Email</legend>
        <input type="email" className="input" placeholder="your@email.com" {...register('email')} />
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
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </form>
  )
}
