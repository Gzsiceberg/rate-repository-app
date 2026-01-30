import { useContext } from 'react';
import AuthStorageContext from '../AuthStorageContext';

const useAuthStorage = () => {
  return useContext(AuthStorageContext);
};

export default useAuthStorage;