import { CSSProperties } from 'react';

export enum Placements {
  bottomStart = 'bottom-start',
  bottomEnd = 'bottom-end',
  topStart = 'top-start',
  topEnd = 'top-end',
  leftStart = 'left-start',
  leftEnd = 'left-end',
  rightStart = 'right-start',
  rightEnd = 'right-end',
}

const calcPlacement = (
  placement: Placements,
  margin: string = '8px'
): CSSProperties => {
  switch (placement) {
    case Placements.bottomStart:
      return { right: 'auto', marginTop: margin };
    case Placements.bottomEnd:
      return { right: '0', marginTop: margin };
    case Placements.topStart:
      return { bottom: '100%', right: 'auto', marginBottom: margin };
    case Placements.topEnd:
      return { bottom: '100%', right: '0', marginBottom: margin };
    case Placements.leftStart:
      return { top: '0', right: '100%', marginRight: margin };
    case Placements.leftEnd:
      return { bottom: '0', right: '100%', marginRight: margin };
    case Placements.rightStart:
      return { top: '0', left: '100%', marginLeft: margin };
    case Placements.rightEnd:
      return { bottom: '0', left: '100%', marginLeft: margin };
    default:
      return { right: 'auto', marginTop: margin };
  }
};

export default calcPlacement;
