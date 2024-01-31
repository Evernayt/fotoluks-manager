import { useAppDispatch } from 'hooks/redux';
import { Item, ItemParams } from 'react-contexify';
import { controlActions } from 'store/reducers/ControlSlice';
import { ContextMenu } from 'components';
import 'react-contexify/ReactContexify.css';
import { IconCircle, IconCircleCheck } from '@tabler/icons-react';
import { CONTEXT_MENU_ICON_STYLE, ICON_SIZE, ICON_STROKE } from 'constants/app';
import { IReport } from 'models/api/IReport';
import ReportAPI from 'api/ReportAPI/ReportAPI';

export const REPORTS_MENU_ID = 'REPORTS_MENU_ID';

const ReportsContextMenu = () => {
  const dispatch = useAppDispatch();

  const toggleCompleted = (params: ItemParams<IReport>) => {
    const report = params.props;
    if (!report) return;
    ReportAPI.update({ id: report.id, completed: !report.completed }).then(
      () => {
        dispatch(controlActions.setForceUpdate(true));
      }
    );
  };

  const isHidden = (params: ItemParams<IReport>) => {
    return params.props?.completed || false;
  };

  return (
    <ContextMenu id={REPORTS_MENU_ID}>
      <Item hidden={(e) => isHidden(e as ItemParams)} onClick={toggleCompleted}>
        <IconCircleCheck
          size={ICON_SIZE}
          stroke={ICON_STROKE}
          style={CONTEXT_MENU_ICON_STYLE}
        />
        Выполнено
      </Item>
      <Item
        hidden={(e) => !isHidden(e as ItemParams)}
        onClick={toggleCompleted}
      >
        <IconCircle
          size={ICON_SIZE}
          stroke={ICON_STROKE}
          style={CONTEXT_MENU_ICON_STYLE}
        />
        Не выполнено
      </Item>
    </ContextMenu>
  );
};

export default ReportsContextMenu;
