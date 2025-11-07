import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/pl";

dayjs.locale("pl");

export const formatPolishDate = (date: string | Dayjs | Date): string => {
  return dayjs(date).format("DD MMMM YYYY");
};

export const formatPolishDateShort = (date: string | Dayjs | Date): string => {
  return dayjs(date).format("DD.MM.YYYY");
};
