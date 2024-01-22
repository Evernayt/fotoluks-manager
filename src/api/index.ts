import axios from 'axios';
import { SERVER_API_URL } from 'constants/api';
import { getToken } from 'helpers/localStorage';
import packageInfo from '../../release/app/package.json';

const $host = axios.create({
  baseURL: SERVER_API_URL,
});

const $authHost = axios.create({
  baseURL: SERVER_API_URL,
});

const unauthInterceptor = async (config: any) => {
  config.headers.authorization = `desktop:${packageInfo.version}`;
  return config;
};

const authInterceptor = async (config: any) => {
  config.headers.authorization = `Bearer ${getToken()} desktop:${
    packageInfo.version
  }`;
  return config;
};

$host.interceptors.request.use(unauthInterceptor);
$authHost.interceptors.request.use(authInterceptor);

export { $host, $authHost };
