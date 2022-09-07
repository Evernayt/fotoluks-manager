import { Modes } from 'constants/app';
import { IFeature, IFoundFeatures } from 'models/IFeature';
import { IEditFeatureModal } from 'models/IModal';

export const initialFeature: IFeature = {
  id: 0,
  name: '',
  pluralName: '',
};

export const initialFoundFeatures: IFoundFeatures = {
  featureData: { rows: [], count: 0 },
  searchText: '',
};

export const initialEditFeatureModal: IEditFeatureModal = {
  isShowing: false,
  featureId: 0,
  mode: Modes.ADD_MODE,
};
