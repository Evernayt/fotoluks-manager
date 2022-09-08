import axios from 'axios';
import { SERVER_API_URL } from 'constants/api';
import { TOKEN_KEY } from 'constants/localStorage';

const $host = axios.create({
  baseURL: SERVER_API_URL,
});

const $authHost = axios.create({
  baseURL: SERVER_API_URL,
});

const authInterceptor = async (config: any) => {
  config.headers.authorization = `Bearer ${localStorage.getItem(TOKEN_KEY)}`;
  return config;
};

$authHost.interceptors.request.use(authInterceptor);

export { $host, $authHost };
