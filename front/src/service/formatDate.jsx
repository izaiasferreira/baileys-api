import moment from "moment";
import 'moment/locale/pt-br';
export default function formatDate(date, format) {
    return moment(date).locale('pt').utc().format(format || 'DD/MM/YYYY')
}