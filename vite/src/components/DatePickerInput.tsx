import { Flex, IconButton, Text } from "@chakra-ui/react";
import DatePicker from "react-datepicker";
import { TbCalendar } from "react-icons/tb";
import { FC } from "react";

interface DatePickerInputProps {
  label: string;
  selectedDate: number;
  onChange: (date: number) => void;
  pickerOpen: boolean;
  onClickPicker: () => void;
  onClosePicker: () => void;
  minDate: Date;
  minTime: Date;
}

const DatePickerInput: FC<DatePickerInputProps> = ({
  label,
  selectedDate,
  onChange,
  pickerOpen,
  onClickPicker,
  onClosePicker,
  minDate,
  minTime,
}) => {
  return (
    <Flex flexDir="column" color="white" p={4} w="41%">
      <Flex h="40px" justifyContent="start" alignItems="center">
        <Text fontWeight="bold" fontSize="20px">
          {label}
        </Text>
      </Flex>
      <Flex
        border="2px solid"
        borderColor="gray.300"
        borderRadius="md"
        h="50px"
        alignItems="center"
        justifyContent="space-between"
        gap={2}
      >
        <DatePicker
          className="datepicker"
          selected={new Date(selectedDate)}
          onChange={(date: Date | null) => {
            if (date) {
              onChange(date.getTime());
            }
          }}
          dateFormat="yyyy년 MM월 dd일 hh:mm aa"
          shouldCloseOnSelect
          minDate={minDate}
          minTime={minTime}
          timeInputLabel="시간"
          showTimeInput
          open={pickerOpen}
          onClickOutside={onClosePicker}
          readOnly={true}
          onKeyDown={(e) => {
            e.preventDefault();
          }}
        />
        <IconButton
          color="teal"
          bgColor="backgroundColor"
          aria-label="Open calendar"
          icon={<TbCalendar size="30px" />}
          _hover={{ bgColor: "gray.700" }}
          onClick={onClickPicker}
        />
      </Flex>
    </Flex>
  );
};

export default DatePickerInput;
