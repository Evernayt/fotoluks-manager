export enum GlobalMessageVariants {
  success = 'success',
  danger = 'danger',
  warning = 'warning',
}

export interface IGlobalMessage {
  message: string;
  variant: GlobalMessageVariants;
  isShowing: boolean;
}
