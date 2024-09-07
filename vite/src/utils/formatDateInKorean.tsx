import { format, toZonedTime } from "date-fns-tz";

const TIMEZONE = "Asia/Seoul";

export const formatDateInKorean = (dateNumber: number) => {
  const date = new Date(dateNumber);
  const zonedDate = toZonedTime(date, TIMEZONE);

  const formattedDate = format(zonedDate, "yyyy-MM-dd a h시 mm분", {
    timeZone: TIMEZONE,
  });

  const period = formattedDate.includes("AM") ? "오전" : "오후";
  const formattedDateInKorean = formattedDate
    .replace("AM", period)
    .replace("PM", period);

  return formattedDateInKorean;
};
