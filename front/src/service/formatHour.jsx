import moment from "moment-timezone";
import 'moment/locale/pt-br';
export default function formatHour(date, format) {
   return moment(date).utc().format(format || 'HH:mm')
}