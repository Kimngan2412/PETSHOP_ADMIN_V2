export default {
  meEndpoint: '/auth/me',
  loginEndpoint: '/auth/admin/login',
  registerEndpoint: '/jwt/register',
  storageTokenKeyName: 'accessToken',
  onTokenExpiration: 'refreshToken'
}
