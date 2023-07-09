// ** React Imports
import { createContext, ReactNode, useEffect, useState } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Config
import authConfig from 'src/configs/auth'

// ** Types
import axios from 'src/configs/axios-interceptor'
import { AuthValuesType, ErrCallbackType, LoginParams, RegisterParams } from './types'

// ** Defaults
const defaultProvider: AuthValuesType = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve()
}

const AuthContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const AuthProvider = ({ children }: Props) => {
  // ** States
  const [user, setUser] = useState<any>(defaultProvider.user)
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading)

  // ** Hooks
  const router = useRouter()

  useEffect(() => {
    const initAuth = async (): Promise<void> => {
      const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)!
      if (storedToken) {
        // setLoading(true)
        await axios
          .get(authConfig.meEndpoint, {
            headers: {
              Authorization: storedToken
            }
          })
          .then(async response => {
            console.log('TODO:', response)
            const hardUser = {
              userName: 'admin',
              email: 'lovenco0410@gmail.com',
              apiKey: 'ouSBAhW8P5DZLxAv_dmEgFziP9-RhQBW',
              walletKey: 'FT-OCPtZOZxIokFHsSWUMaUQQ3LPBmXx',
              balance: 0,
              totalDeposited: 0,
              limitKeysToCreate: 1000000,
              noOfCreatedKeys: 0,
              role: 'Admin'
            }
            setLoading(false)
            setUser({ ...hardUser })
          })
          .catch(() => {
            localStorage.removeItem('userData')
            localStorage.removeItem('refreshToken')
            localStorage.removeItem('accessToken')
            setUser(null)
            setLoading(false)
            if (authConfig.onTokenExpiration === 'logout' && !router.pathname.includes('login')) {
              router.replace('/login')
            }
          })

      } else {
        setLoading(false)
      }
    }

    initAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLogin = (params: LoginParams, errorCallback?: ErrCallbackType) => {
    axios
      .post(authConfig.loginEndpoint, params)
      .then(async response => {
        console.log(response)
        window.localStorage.setItem(authConfig.storageTokenKeyName, response.data.accessToken)
        const returnUrl = router.query.returnUrl

        const hardUser = {
          userName: 'admin',
          email: 'lovenco0410@gmail.com',
          apiKey: 'ouSBAhW8P5DZLxAv_dmEgFziP9-RhQBW',
          walletKey: 'FT-OCPtZOZxIokFHsSWUMaUQQ3LPBmXx',
          balance: 0,
          totalDeposited: 0,
          limitKeysToCreate: 1000000,
          noOfCreatedKeys: 0,
          role: 'Admin'
        }
        setUser({ ...hardUser })
        params.rememberMe ? window.localStorage.setItem('userData', JSON.stringify(hardUser)) : null

        const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'

        router.replace(redirectURL as string)
      })

      .catch(err => {
        if (errorCallback) errorCallback(err)
      })
  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('userData')
    window.localStorage.removeItem(authConfig.storageTokenKeyName)
    router.push('/login')
  }

  const handleRegister = (params: RegisterParams, errorCallback?: ErrCallbackType) => {
    axios
      .post(authConfig.registerEndpoint, params)
      .then(res => {
        if (res.data.error) {
          if (errorCallback) errorCallback(res.data.error)
        } else {
          handleLogin({
            email: params.email, password: params.password,
            userName: ''
          })
        }
      })
      .catch((err: { [key: string]: string }) => (errorCallback ? errorCallback(err) : null))
  }

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    login: handleLogin,
    logout: handleLogout,
    register: handleRegister
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }

