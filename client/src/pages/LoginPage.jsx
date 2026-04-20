import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import AuthForm from '../features/auth/components/AuthForm'
import AuthLayout from '../features/auth/components/AuthLayout'
import { useAuth } from '../features/auth/context/useAuth'

const loginFields = [
  {
    name: 'email',
    label: 'Work email',
    type: 'email',
    placeholder: 'you@business.com',
    autoComplete: 'email',
  },
  {
    name: 'password',
    label: 'Password',
    type: 'password',
    placeholder: 'Enter your password',
    autoComplete: 'current-password',
  },
]

function LoginPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { login } = useAuth()
  const [values, setValues] = useState({
    email: '',
    password: '',
  })
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const destination = location.state?.from?.pathname || '/inbox'

  function handleChange(event) {
    const { name, value } = event.target

    setValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setErrorMessage('')
    setIsSubmitting(true)

    try {
      await login(values)
      navigate(destination, { replace: true })
    } catch (error) {
      setErrorMessage(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout
      eyebrow="Login"
      title="Welcome back"
      description="Sign in to open your protected WACRM workspace."
      footer={
        <p>
          New to WACRM?{' '}
          <Link className="font-semibold text-emerald-700" to="/signup">
            Create your account
          </Link>
        </p>
      }
    >
      <AuthForm
        fields={loginFields}
        values={values}
        onChange={handleChange}
        onSubmit={handleSubmit}
        submitLabel="Sign in"
        helperText="Use the account created from the signup screen or the auth API."
        errorMessage={errorMessage}
        isSubmitting={isSubmitting}
      />
    </AuthLayout>
  )
}

export default LoginPage
