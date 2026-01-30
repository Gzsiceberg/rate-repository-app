import AsyncStorage from '@react-native-async-storage/async-storage';

class AuthStorage {
  constructor(namespace = 'auth') {
    this.namespace = namespace;
  }

  getAccessToken() {
    const accessTokenKey = `${this.namespace}:accessToken`;
    return AsyncStorage.getItem(accessTokenKey);
  }

  setAccessToken(accessToken) {
    const accessTokenKey = `${this.namespace}:accessToken`;
    return AsyncStorage.setItem(accessTokenKey, accessToken);
  }

  removeAccessToken() {
    const accessTokenKey = `${this.namespace}:accessToken`;
    return AsyncStorage.removeItem(accessTokenKey);
  }
}

export default AuthStorage;
