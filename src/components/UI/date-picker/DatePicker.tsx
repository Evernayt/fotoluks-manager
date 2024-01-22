import { FC, forwardRef } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import ReactDatePicker, {
  ReactDatePickerProps,
  registerLocale,
} from 'react-datepicker';
import { Input, InputGroup, InputRightElement } from '@chakra-ui/react';
import { IconCalendar } from '@tabler/icons-react';
import { isWeekday } from './DatePicker.service';
import { ICON_SIZE, ICON_STROKE } from 'constants/app';
import ru from 'date-fns/locale/ru';
registerLocale('ru', ru);
import './DatePicker.scss';
import moment from 'moment';

const CustomInput = forwardRef<any, any>((props, ref) => {
  return (
    <InputGroup>
      <Input {...props} variant="filled" ref={ref} />
      <InputRightElement
        userSelect="none"
        pointerEvents="none"
        pr="12px"
        children={<IconCalendar size={ICON_SIZE} stroke={ICON_STROKE} />}
      />
    </InputGroup>
  );
});

// const CustomHeader = (props: any) => {
//   return (
//     <Stack pb={1} isInline alignItems="center" textAlign="left" pl={4} pr={2}>
//       <Text color="gray.700" flex={1} fontSize="sm" fontWeight="medium">
//         {new Intl.DateTimeFormat('ru-RU', {
//           year: 'numeric',
//           month: 'long',
//         }).format(date)}
//       </Text>
//       <IconButton
//         borderRadius="full"
//         size="sm"
//         variant="ghost"
//         aria-label="Previous Month"
//         icon={<IconChevronLeft fontSize="14px" />}
//         onClick={decreaseMonth}
//         disabled={prevMonthButtonDisabled}
//       />
//       <IconButton
//         borderRadius="full"
//         size="sm"
//         variant="ghost"
//         aria-label="Next Month"
//         icon={<IconChevronRight fontSize="14px" />}
//         onClick={increaseMonth}
//         disabled={nextMonthButtonDisabled}
//       />
//     </Stack>
//   );
// };

interface DatePickerProps
  extends Omit<
    ReactDatePickerProps,
    'onChange' | 'selectsRange' | 'startDate' | 'endDate'
  > {
  startDate: string;
  endDate?: string;
  selectsRange?: boolean;
  onChange: (startDate: string, endDate?: string) => void;
}

const DatePicker: FC<DatePickerProps> = ({
  startDate = '',
  endDate = '',
  selectsRange,
  onChange,
  ...props
}) => {
  const formattedStartDate = startDate ? moment(startDate).toDate() : null;
  const formattedEndDate = endDate ? moment(endDate).toDate() : null;

  const onChangeHandler = (dates: [Date, Date]) => {
    if (selectsRange) {
      const [start, end] = dates;
      const startDate = start ? start.toISOString() : '';
      const endDate = end ? end.toISOString() : '';
      onChange(startDate, endDate);
    } else {
      onChange((dates as unknown as Date)?.toISOString(), '');
    }
  };

  return (
    <ReactDatePicker
      placeholderText="Выберите дату"
      {...props}
      selected={formattedStartDate}
      startDate={formattedStartDate}
      endDate={formattedEndDate}
      selectsRange={selectsRange}
      onChange={onChangeHandler}
      showPopperArrow={false}
      customInput={<CustomInput />}
      locale="ru"
      showTimeSelect
      dateFormat={selectsRange ? 'P' : 'Pp'}
      peekNextMonth
      showYearDropdown
    />
  );
};

export default DatePicker;
