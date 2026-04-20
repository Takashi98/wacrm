import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthForm from '../features/auth/components/AuthForm'
import AuthLayout from '../features/auth/components/AuthLayout'
import { useAuth } from '../features/auth/context/useAuth'

const signupFields = [
  {
    name: 'name',
    label: 'Your name',
    type: 'text',
    placeholder: 'Aarav Sharma',
    autoComplete: 'name',
  },
  {
    name: 'workspaceName',
    label: 'Business name',
    type: 'text',
    placeholder: 'Aarav Home Decor',
    autoComplete: 'organization',
    hint: 'This will be used as your workspace name.',
  },
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
    placeholder: 'Create a password',
    autoComplete: 'new-password',
    hint: 'Use at least 8 characters.',
  },
]

function SignupPage() {
  const navigate = useNavigate()
  const { signup } = useAuth()
  const [values, setValues] = useState({
    name: '',
    workspaceName: '',
    email: '',
    password: '',
  })
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

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
      await signup(values)
      navigate('/inbox', { replace: true })
    } catch (error) {
      setErrorMessage(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout
      eyebrow="Signup"
      title="Create your account"
      description="Start with a clean login foundation before the rest of the product grows."
      footer={
        <p>
          Already have an account?{' '}
          <Link className="font-semibold text-emerald-700" to="/login">
            Sign in
          </Link>
        </p>
      }
    >
      <AuthForm
        fields={signupFields}
        values={values}
        onChange={handleChange}
        onSubmit={handleSubmit}
        submitLabel="Create account"
        helperText="This creates your first user account and the first workspace for the business."
        errorMessage={errorMessage}
        isSubmitting={isSubmitting}
      />
    </AuthLayout>
  )
}

export default SignupPage
