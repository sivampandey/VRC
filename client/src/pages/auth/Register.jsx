import React, { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useNavigate, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useRegisterMutation, useLoginMutation } from '../../store/api/authApi'
import { setCredentials } from '../../store/authSlice'
import toast from 'react-hot-toast'
import AuthContainer from './AuthContainer'

export default function Register() {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  
  // Read redirect param
  const redirectTo = new URLSearchParams(location.search).get('redirect') || '/'

  const [register, { isLoading: isLoadingRegister }] = useRegisterMutation()
  const [login, { isLoading: isLoadingLogin }] = useLoginMutation()

  // Listen for Google Auth Popup postMessage events
  useEffect(() => {
    const handleGoogleMessage = async (event) => {
      // Validate origin
      if (event.origin !== window.location.origin) return
      
      if (event.data?.type === 'GOOGLE_AUTH_SUCCESS') {
        const { email: googleEmail, name: googleName } = event.data.profile
        const defaultPassword = 'GoogleAuthPassword123!'
        const cleanedName = googleName || googleEmail.split('@')[0]

        const loadingToast = toast.loading('Connecting with Google...')
        try {
          // 1. Try logging in first (if user already exists)
          const response = await login({ email: googleEmail, password: defaultPassword }).unwrap()
          dispatch(setCredentials({ user: response, token: response.accessToken }))
          toast.dismiss(loadingToast)
          toast.success(`Welcome back, ${response.name}!`)
          navigate(redirectTo, { replace: true })
        } catch (err) {
          // 2. If user doesn't exist, register them
          try {
            await register({
              name: cleanedName,
              email: googleEmail,
              password: defaultPassword,
              phone: '+91 99999 99999'
            }).unwrap()

            // 3. Log in after registration
            const response = await login({ email: googleEmail, password: defaultPassword }).unwrap()
            dispatch(setCredentials({ user: response, token: response.accessToken }))
            toast.dismiss(loadingToast)
            toast.success(`Successfully registered and signed in with Google as ${response.name}!`)
            navigate(redirectTo, { replace: true })
          } catch (regErr) {
            toast.dismiss(loadingToast)
            console.error(regErr)
            toast.error(regErr.data?.message || 'Failed to authenticate Google account on database.')
          }
        }
      }
    }

    window.addEventListener('message', handleGoogleMessage)
    return () => window.removeEventListener('message', handleGoogleMessage)
  }, [redirectTo, login, register, dispatch, navigate])

  const handleLoginSubmit = async (data) => {
    try {
      const response = await login({ email: data.email, password: data.password }).unwrap()
      dispatch(setCredentials({ user: response, token: response.accessToken }))
      toast.success(`Welcome back, ${response.name}!`)
      navigate(redirectTo, { replace: true })
    } catch (err) {
      console.error(err)
      toast.error(err.data?.message || 'Login failed. Please verify credentials.')
    }
  }

  const handleRegisterSubmit = async (data) => {
    try {
      const payload = {
        name: data.name,
        password: data.password,
        email: data.signUpMethod === 'email' ? data.email.trim() : (data.email.trim() || undefined),
        phone: data.signUpMethod === 'phone' ? data.phone.trim() : (data.phone.trim() || undefined)
      }

      if (!payload.email) delete payload.email
      if (!payload.phone) delete payload.phone

      const response = await register(payload).unwrap()
      dispatch(setCredentials({ user: response, token: response.accessToken }))
      toast.success(`Account created successfully. Welcome, ${response.name}!`)
      navigate(redirectTo, { replace: true })
    } catch (err) {
      console.error(err)
      toast.error(err.data?.message || 'Registration failed. Please check details.')
    }
  }

  // Open the secure local mock Google sign-in window
  const handleGoogleSignUpPopup = () => {
    const width = 500
    const height = 600
    const left = window.top.outerWidth / 2 + window.top.screenX - width / 2
    const top = window.top.outerHeight / 2 + window.top.screenY - height / 2
    
    window.open(
      '/google-auth',
      'Google Sign In',
      `width=${width},height=${height},top=${top},left=${left},status=no,resizable=yes`
    )
  }

  return (
    <>
      <Helmet>
        <title>Create Account | Vaishnav Rug Collection</title>
        <meta name="description" content="Register an account with Vaishnav Rug Collection." />
      </Helmet>

      <AuthContainer
        isRegisterInitial={true}
        onLoginSubmit={handleLoginSubmit}
        onRegisterSubmit={handleRegisterSubmit}
        isLoadingLogin={isLoadingLogin}
        isLoadingRegister={isLoadingRegister}
        handleGoogleSignIn={handleGoogleSignUpPopup}
      />
    </>
  )
}
