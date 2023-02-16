import { IUpdate } from './../../models/IUpdate';

export const INITIAL_CHECK_UPDATE: IUpdate = {
  pending: true,
  success: false,
  failure: false,
};

export const INITIAL_DOWNLOAD_UPDATE: IUpdate = {
  pending: false,
  success: false,
  failure: false,
};
