
import './HourConfig.css'
import React, { useState, useContext } from 'react'
import InputTime from './InputTime'
import InputSelect from './InputSelect'
import Space from './Space'
import Button from './Button'
import { useEffect } from 'react'
import { Ring } from '@uiball/loaders'


export default function HourConfig({ infos, onChange }) {
    const [info, setInfo] = useState(false)
    const timezones = [
        { timezone: 'America/Sao_Paulo', name: '(UTC-03:00) Brasilia' },
        { timezone: 'Europe/Andorra', name: '(UTC+01:00) Andorra' },
        { timezone: 'Asia/Dubai', name: '(UTC+04:00) Dubai' },
        { timezone: 'Asia/Kabul', name: '(UTC+04:30) Kabul' },
        { timezone: 'Europe/Tirane', name: '(UTC+01:00) Tirana' },
        { timezone: 'Asia/Yerevan', name: '(UTC+04:00) Yerevan' },
        { timezone: 'Antarctica/Casey', name: '(UTC+08:00) Casey' },
        { timezone: 'Antarctica/Davis', name: '(UTC+07:00) Davis' },
        { timezone: 'Antarctica/DumontDUrville', name: '(UTC+10:00) Dumont d’Urville' },
        { timezone: 'Antarctica/Mawson', name: '(UTC+05:00) Mawson' },
        { timezone: 'Antarctica/Palmer', name: '(UTC-03:00) Palmer' },
        { timezone: 'Antarctica/Rothera', name: '(UTC-03:00) Rothera' },
        { timezone: 'Antarctica/Syowa', name: '(UTC+03:00) Syowa' },
        { timezone: 'Antarctica/Troll', name: '(UTC+00:00) Troll' },
        { timezone: 'Antarctica/Vostok', name: '(UTC+06:00) Vostok' },
        { timezone: 'America/Argentina/Buenos_Aires', name: '(UTC-03:00) Buenos Aires' },
        { timezone: 'America/Argentina/Cordoba', name: '(UTC-03:00) Córdoba' },
        { timezone: 'America/Argentina/Salta', name: '(UTC-03:00) Salta' },
        { timezone: 'America/Argentina/Jujuy', name: '(UTC-03:00) Jujuy' },
        { timezone: 'America/Argentina/Tucuman', name: '(UTC-03:00) Tucumán' },
        { timezone: 'America/Argentina/Catamarca', name: '(UTC-03:00) Catamarca' },
        { timezone: 'America/Argentina/La_Rioja', name: '(UTC-03:00) La Rioja' },
        { timezone: 'America/Argentina/San_Juan', name: '(UTC-03:00) San Juan' },
        { timezone: 'America/Argentina/Mendoza', name: '(UTC-03:00) Mendoza' },
        { timezone: 'America/Argentina/San_Luis', name: '(UTC-03:00) San Luis' },
        { timezone: 'America/Argentina/Rio_Gallegos', name: '(UTC-03:00) Río Gallegos' },
        { timezone: 'America/Argentina/Ushuaia', name: '(UTC-03:00) Ushuaia' },
        { timezone: 'Pacific/Pago_Pago', name: '(UTC-11:00) Pago Pago' },
        { timezone: 'Europe/Vienna', name: '(UTC+01:00) Vienna' },
        { timezone: 'Australia/Lord_Howe', name: '(UTC+10:30) Lord Howe' },
        { timezone: 'Antarctica/Macquarie', name: '(UTC+11:00) Macquarie' },
        { timezone: 'Australia/Hobart', name: '(UTC+10:00) Hobart' },
        { timezone: 'Australia/Currie', name: '(UTC+10:00) Currie' },
        { timezone: 'Australia/Melbourne', name: '(UTC+10:00) Melbourne' },
        { timezone: 'Australia/Sydney', name: '(UTC+10:00) Sydney' },
        { timezone: 'Australia/Broken_Hill', name: '(UTC+09:30) Broken Hill' },
        { timezone: 'Australia/Brisbane', name: '(UTC+10:00) Brisbane' },
        { timezone: 'Australia/Lindeman', name: '(UTC+10:00) Lindeman' },
        { timezone: 'Australia/Adelaide', name: '(UTC+09:30) Adelaide' },
        { timezone: 'Australia/Darwin', name: '(UTC+09:30) Darwin' },
        { timezone: 'Australia/Perth', name: '(UTC+08:00) Perth' },
        { timezone: 'Australia/Eucla', name: '(UTC+08:45) Eucla' },
        { timezone: 'Asia/Baku', name: '(UTC+04:00) Baku' },
        { timezone: 'America/Barbados', name: '(UTC-04:00) Barbados' },
        { timezone: 'Asia/Dhaka', name: '(UTC+06:00) Dhaka' },
        { timezone: 'Europe/Brussels', name: '(UTC+01:00) Brussels' },
        { timezone: 'Europe/Sofia', name: '(UTC+02:00) Sofia' },
        { timezone: 'Atlantic/Bermuda', name: '(UTC-04:00) Bermuda' },
        { timezone: 'Asia/Brunei', name: '(UTC+08:00) Brunei' },
        { timezone: 'America/La_Paz', name: '(UTC-04:00) La Paz' },
        { timezone: 'America/Noronha', name: '(UTC-02:00) Noronha' },
        { timezone: 'America/Belem', name: '(UTC-03:00) Belém' },
        { timezone: 'America/Fortaleza', name: '(UTC-03:00) Fortaleza' },
        { timezone: 'America/Recife', name: '(UTC-03:00) Recife' },
        { timezone: 'America/Araguaina', name: '(UTC-03:00) Araguaina' },
        { timezone: 'America/Maceio', name: '(UTC-03:00) Maceió' },
        { timezone: 'America/Bahia', name: '(UTC-03:00) Salvador' },
        { timezone: 'America/Campo_Grande', name: '(UTC-04:00) Campo Grande' },
        { timezone: 'America/Cuiaba', name: '(UTC-04:00) Cuiabá' },
        { timezone: 'America/Santarem', name: '(UTC-03:00) Santarém' },
        { timezone: 'America/Porto_Velho', name: '(UTC-04:00) Porto Velho' },
        { timezone: 'America/Boa_Vista', name: '(UTC-04:00) Boa Vista' },
        { timezone: 'America/Manaus', name: '(UTC-04:00) Manaus' },
        { timezone: 'America/Eirunepe', name: '(UTC-05:00) Eirunepé' },
        { timezone: 'America/Rio_Branco', name: '(UTC-05:00) Rio Branco' },
        { timezone: 'America/Nassau', name: '(UTC-05:00) Nassau' },
        { timezone: 'Asia/Thimphu', name: '(UTC+06:00) Thimphu' },
        { timezone: 'Europe/Minsk', name: '(UTC+03:00) Minsk' },
        { timezone: 'America/Belize', name: '(UTC-06:00) Belize' },
        { timezone: 'America/St_Johns', name: '(UTC-03:30) St. John’s' },
        { timezone: 'America/Halifax', name: '(UTC-04:00) Halifax' },
        { timezone: 'America/Glace_Bay', name: '(UTC-04:00) Glace Bay' },
        { timezone: 'America/Moncton', name: '(UTC-04:00) Moncton' },
        { timezone: 'America/Goose_Bay', name: '(UTC-04:00) Goose Bay' },
        { timezone: 'America/Blanc-Sablon', name: '(UTC-04:00) Blanc-Sablon' },
        { timezone: 'America/Toronto', name: '(UTC-05:00) Toronto' },
        { timezone: 'America/Nipigon', name: '(UTC-05:00) Nipigon' },
        { timezone: 'America/Thunder_Bay', name: '(UTC-05:00) Thunder Bay' },
        { timezone: 'America/Iqaluit', name: '(UTC-05:00) Iqaluit' },
        { timezone: 'America/Pangnirtung', name: '(UTC-05:00) Pangnirtung' },
        { timezone: 'America/Atikokan', name: '(UTC-05:00) Atikokan' },
        { timezone: 'America/Winnipeg', name: '(UTC-06:00) Winnipeg' },
        { timezone: 'America/Rainy_River', name: '(UTC-06:00) Rainy River' },
        { timezone: 'America/Resolute', name: '(UTC-06:00) Resolute' },
        { timezone: 'America/Rankin_Inlet', name: '(UTC-06:00) Rankin Inlet' },
        { timezone: 'America/Regina', name: '(UTC-06:00) Regina' },
        { timezone: 'America/Swift_Current', name: '(UTC-06:00) Swift Current' },
        { timezone: 'America/Edmonton', name: '(UTC-07:00) Edmonton' },
        { timezone: 'America/Cambridge_Bay', name: '(UTC-07:00) Cambridge Bay' },
        { timezone: 'America/Yellowknife', name: '(UTC-07:00) Yellowknife' },
        { timezone: 'America/Inuvik', name: '(UTC-07:00) Inuvik' },
        { timezone: 'America/Creston', name: '(UTC-07:00) Creston' },
        { timezone: 'America/Dawson_Creek', name: '(UTC-07:00) Dawson Creek' },
        { timezone: 'America/Fort_Nelson', name: '(UTC-07:00) Fort Nelson' },
        { timezone: 'America/Vancouver', name: '(UTC-08:00) Vancouver' },
        { timezone: 'America/Whitehorse', name: '(UTC-08:00) Whitehorse' },
        { timezone: 'America/Dawson', name: '(UTC-08:00) Dawson' },
        { timezone: 'Indian/Cocos', name: '(UTC+06:30) Cocos' },
        { timezone: 'Europe/Zurich', name: '(UTC+01:00) Zürich' },
        { timezone: 'Africa/Abidjan', name: '(UTC+00:00) Abidjan' },
        { timezone: 'Pacific/Rarotonga', name: '(UTC-10:00) Rarotonga' },
        { timezone: 'America/Santiago', name: '(UTC-04:00) Santiago' },
        { timezone: 'America/Punta_Arenas', name: '(UTC-03:00) Punta Arenas' },
        { timezone: 'Pacific/Easter', name: '(UTC-06:00) Easter Island' },
        { timezone: 'Asia/Shanghai', name: '(UTC+08:00) Shanghai' },
        { timezone: 'Asia/Urumqi', name: '(UTC+06:00) Ürümqi' },
        { timezone: 'America/Bogota', name: '(UTC-05:00) Bogotá' },
        { timezone: 'America/Costa_Rica', name: '(UTC-06:00) Costa Rica' },
        { timezone: 'America/Havana', name: '(UTC-05:00) Havana' },
        { timezone: 'Atlantic/Cape_Verde', name: '(UTC-01:00) Cape Verde' },
        { timezone: 'America/Curacao', name: '(UTC-04:00) Curaçao' },
        { timezone: 'Indian/Christmas', name: '(UTC+07:00) Christmas' },
        { timezone: 'Asia/Nicosia', name: '(UTC+02:00) Nicosia' },
        { timezone: 'Asia/Famagusta', name: '(UTC+03:00) Famagusta' },
        { timezone: 'Europe/Prague', name: '(UTC+01:00) Prague' },
        { timezone: 'Europe/Berlin', name: '(UTC+01:00) Berlin' },
        { timezone: 'Europe/Copenhagen', name: '(UTC+01:00) Copenhagen' },
        { timezone: 'America/Santo_Domingo', name: '(UTC-04:00) Santo Domingo' },
        { timezone: 'Africa/Algiers', name: '(UTC+01:00) Algiers' },
        { timezone: 'America/Guayaquil', name: '(UTC-05:00) Guayaquil' },
        { timezone: 'Pacific/Galapagos', name: '(UTC-06:00) Galapagos' },
        { timezone: 'Europe/Tallinn', name: '(UTC+02:00) Tallinn' },
        { timezone: 'Africa/Cairo', name: '(UTC+02:00) Cairo' },
        { timezone: 'Africa/El_Aaiun', name: '(UTC+00:00) El Aaiún' },
        { timezone: 'Europe/Madrid', name: '(UTC+01:00) Madrid' },
        { timezone: 'Africa/Ceuta', name: '(UTC+01:00) Ceuta' },
        { timezone: 'Atlantic/Canary', name: '(UTC+00:00) Canary Islands' },
        { timezone: 'Europe/Helsinki', name: '(UTC+02:00) Helsinki' },
        { timezone: 'Pacific/Fiji', name: '(UTC+12:00) Fiji' },
        { timezone: 'Atlantic/Stanley', name: '(UTC-03:00) Stanley' },
        { timezone: 'Pacific/Chuuk', name: '(UTC+10:00) Chuuk' },
        { timezone: 'Pacific/Pohnpei', name: '(UTC+11:00) Pohnpei' },
        { timezone: 'Pacific/Kosrae', name: '(UTC+11:00) Kosrae' },
        { timezone: 'Atlantic/Faroe', name: '(UTC+00:00) Faroe' },
        { timezone: 'Europe/Paris', name: '(UTC+01:00) Paris' },
        { timezone: 'Europe/London', name: '(UTC+00:00) London' },
        { timezone: 'Asia/Tbilisi', name: '(UTC+04:00) Tbilisi' },
        { timezone: 'America/Cayenne', name: '(UTC-03:00) Cayenne' },
        { timezone: 'Africa/Accra', name: '(UTC+00:00) Accra' },
        { timezone: 'Europe/Gibraltar', name: '(UTC+01:00) Gibraltar' },
        { timezone: 'America/Godthab', name: '(UTC-03:00) Nuuk' },
        { timezone: 'America/Danmarkshavn', name: '(UTC+00:00) Danmarkshavn' },
        { timezone: 'America/Scoresbysund', name: '(UTC-01:00) Ittoqqortoormiit' },
        { timezone: 'America/Thule', name: '(UTC-04:00) Thule' },
        { timezone: 'Europe/Athens', name: '(UTC+02:00) Athens' },
        { timezone: 'Atlantic/South_Georgia', name: '(UTC-02:00) South Georgia' },
        { timezone: 'America/Guatemala', name: '(UTC-06:00) Guatemala' },
        { timezone: 'Pacific/Guam', name: '(UTC+10:00) Guam' },
        { timezone: 'Africa/Bissau', name: '(UTC+00:00) Bissau' },
        { timezone: 'America/Guyana', name: '(UTC-04:00) Guyana' },
        { timezone: 'Asia/Hong_Kong', name: '(UTC+08:00) Hong Kong' },
        { timezone: 'America/Tegucigalpa', name: '(UTC-06:00) Tegucigalpa' },
        { timezone: 'America/Port-au-Prince', name: '(UTC-05:00) Port-au-Prince' },
        { timezone: 'Europe/Budapest', name: '(UTC+01:00) Budapest' },
        { timezone: 'Asia/Jakarta', name: '(UTC+07:00) Jakarta' },
        { timezone: 'Asia/Pontianak', name: '(UTC+07:00) Pontianak' },
        { timezone: 'Asia/Makassar', name: '(UTC+08:00) Makassar' },
        { timezone: 'Asia/Jayapura', name: '(UTC+09:00) Jayapura' },
        { timezone: 'Europe/Dublin', name: '(UTC+00:00) Dublin' },
        { timezone: 'Asia/Jerusalem', name: '(UTC+02:00) Jerusalem' },
        { timezone: 'Asia/Kolkata', name: '(UTC+05:30) Kolkata' },
        { timezone: 'Indian/Chagos', name: '(UTC+06:00) Chagos' },
        { timezone: 'Asia/Baghdad', name: '(UTC+03:00) Baghdad' },
        { timezone: 'Asia/Tehran', name: '(UTC+03:30) Tehran' },
        { timezone: 'Atlantic/Reykjavik', name: '(UTC+00:00) Reykjavík' },
        { timezone: 'Europe/Rome', name: '(UTC+01:00) Rome' },
        { timezone: 'America/Jamaica', name: '(UTC-05:00) Jamaica' },
        { timezone: 'Asia/Amman', name: '(UTC+02:00) Amman' },
        { timezone: 'Asia/Tokyo', name: '(UTC+09:00) Tokyo' },
        { timezone: 'Africa/Nairobi', name: '(UTC+03:00) Nairobi' },
        { timezone: 'Asia/Bishkek', name: '(UTC+06:00) Bishkek' },
        { timezone: 'Pacific/Tarawa', name: '(UTC+12:00) Tarawa' },
        { timezone: 'Pacific/Enderbury', name: '(UTC+13:00) Enderbury' },
        { timezone: 'Pacific/Kiritimati', name: '(UTC+14:00) Kiritimati' },
        { timezone: 'Asia/Pyongyang', name: '(UTC+09:00) Pyongyang' },
        { timezone: 'Asia/Seoul', name: '(UTC+09:00) Seoul' },
        { timezone: 'Asia/Almaty', name: '(UTC+06:00) Almaty' },
        { timezone: 'Asia/Qyzylorda', name: '(UTC+05:00) Qyzylorda' },
        { timezone: 'Asia/Qostanay', name: '(UTC+06:00) Qostanay' },
        { timezone: 'Asia/Aqtobe', name: '(UTC+05:00) Aqtobe' },
        { timezone: 'Asia/Aqtau', name: '(UTC+05:00) Aqtau' },
        { timezone: 'Asia/Atyrau', name: '(UTC+05:00) Atyrau' },
        { timezone: 'Asia/Oral', name: '(UTC+05:00) Oral' },
        { timezone: 'Asia/Beirut', name: '(UTC+02:00) Beirut' },
        { timezone: 'Asia/Colombo', name: '(UTC+05:30) Colombo' },
        { timezone: 'Africa/Monrovia', name: '(UTC+00:00) Monrovia' },
        { timezone: 'Europe/Vilnius', name: '(UTC+02:00) Vilnius' },
        { timezone: 'Europe/Luxembourg', name: '(UTC+01:00) Luxembourg' },
        { timezone: 'Europe/Riga', name: '(UTC+02:00) Riga' },
        { timezone: 'Africa/Tripoli', name: '(UTC+02:00) Tripoli' },
        { timezone: 'Africa/Casablanca', name: '(UTC+01:00) Casablanca' },
        { timezone: 'Europe/Monaco', name: '(UTC+01:00) Monaco' },
        { timezone: 'Europe/Chisinau', name: '(UTC+02:00) Chisinau' },
        { timezone: 'Pacific/Majuro', name: '(UTC+12:00) Majuro' },
        { timezone: 'Pacific/Kwajalein', name: '(UTC+12:00) Kwajalein' },
        { timezone: 'Asia/Yangon', name: '(UTC+06:30) Yangon' },
        { timezone: 'Asia/Ulaanbaatar', name: '(UTC+08:00) Ulaanbaatar' },
        { timezone: 'Asia/Hovd', name: '(UTC+07:00) Hovd' },
        { timezone: 'Asia/Choibalsan', name: '(UTC+08:00) Choibalsan' },
        { timezone: 'Asia/Macau', name: '(UTC+08:00) Macau' },
        { timezone: 'America/Martinique', name: '(UTC-04:00) Martinique' },
        { timezone: 'Europe/Malta', name: '(UTC+01:00) Malta' },
        { timezone: 'Indian/Mauritius', name: '(UTC+04:00) Mauritius' },
        { timezone: 'Indian/Maldives', name: '(UTC+05:00) Maldives' },
        { timezone: 'America/Mexico_City', name: '(UTC-06:00) Mexico City' },
        { timezone: 'America/Cancun', name: '(UTC-05:00) Cancún' },
        { timezone: 'America/Merida', name: '(UTC-06:00) Mérida' },
        { timezone: 'America/Monterrey', name: '(UTC-06:00) Monterrey' },
        { timezone: 'America/Matamoros', name: '(UTC-06:00) Matamoros' },
        { timezone: 'America/Mazatlan', name: '(UTC-07:00) Mazatlán' },
        { timezone: 'America/Chihuahua', name: '(UTC-07:00) Chihuahua' },
        { timezone: 'America/Ojinaga', name: '(UTC-07:00) Ojinaga' },
        { timezone: 'America/Hermosillo', name: '(UTC-07:00) Hermosillo' },
        { timezone: 'America/Tijuana', name: '(UTC-08:00) Tijuana' },
        { timezone: 'America/Bahia_Banderas', name: '(UTC-06:00) Bahía Banderas' },
        { timezone: 'Asia/Kuala_Lumpur', name: '(UTC+08:00) Kuala Lumpur' },
        { timezone: 'Asia/Kuching', name: '(UTC+08:00) Kuching' },
        { timezone: 'Africa/Maputo', name: '(UTC+02:00) Maputo' },
        { timezone: 'Africa/Windhoek', name: '(UTC+02:00) Windhoek' },
        { timezone: 'Pacific/Noumea', name: '(UTC+11:00) Nouméa' },
        { timezone: 'Pacific/Norfolk', name: '(UTC+11:00) Norfolk Island' },
        { timezone: 'Africa/Lagos', name: '(UTC+01:00) Lagos' },
        { timezone: 'America/Managua', name: '(UTC-06:00) Managua' },
        { timezone: 'Europe/Amsterdam', name: '(UTC+01:00) Amsterdam' },
        { timezone: 'Europe/Oslo', name: '(UTC+01:00) Oslo' },
        { timezone: 'Asia/Kathmandu', name: '(UTC+05:45) Kathmandu' },
        { timezone: 'Pacific/Nauru', name: '(UTC+12:00) Nauru' },
        { timezone: 'Pacific/Niue', name: '(UTC-11:00) Niue' },
        { timezone: 'Pacific/Auckland', name: '(UTC+12:00) Auckland' },
        { timezone: 'Pacific/Chatham', name: '(UTC+12:45) Chatham' },
        { timezone: 'America/Panama', name: '(UTC-05:00) Panama' },
        { timezone: 'America/Lima', name: '(UTC-05:00) Lima' },
        { timezone: 'Pacific/Tahiti', name: '(UTC-10:00) Tahiti' },
        { timezone: 'Pacific/Marquesas', name: '(UTC-09:30) Marquesas' },
        { timezone: 'Pacific/Gambier', name: '(UTC-09:00) Gambier' },
        { timezone: 'Pacific/Port_Moresby', name: '(UTC+10:00) Port Moresby' },
        { timezone: 'Pacific/Bougainville', name: '(UTC+11:00) Bougainville' },
        { timezone: 'Asia/Manila', name: '(UTC+08:00) Manila' },
        { timezone: 'Asia/Karachi', name: '(UTC+05:00) Karachi' },
        { timezone: 'Europe/Warsaw', name: '(UTC+01:00) Warsaw' },
        { timezone: 'America/Miquelon', name: '(UTC-03:00) Miquelon' },
        { timezone: 'Pacific/Pitcairn', name: '(UTC-08:00) Pitcairn' },
        { timezone: 'America/Puerto_Rico', name: '(UTC-04:00) Puerto Rico' },
        { timezone: 'Asia/Gaza', name: '(UTC+02:00) Gaza' },
        { timezone: 'Asia/Hebron', name: '(UTC+02:00) Hebron' },
        { timezone: 'Europe/Lisbon', name: '(UTC+00:00) Lisbon' },
        { timezone: 'Atlantic/Madeira', name: '(UTC+00:00) Madeira' },
        { timezone: 'Atlantic/Azores', name: '(UTC-01:00) Azores' },
        { timezone: 'Pacific/Palau', name: '(UTC+09:00) Palau' },
        { timezone: 'America/Asuncion', name: '(UTC-04:00) Asunción' },
        { timezone: 'Asia/Qatar', name: '(UTC+03:00) Qatar' },
        { timezone: 'Indian/Reunion', name: '(UTC+04:00) Réunion' },
        { timezone: 'Europe/Bucharest', name: '(UTC+02:00) Bucharest' },
        { timezone: 'Europe/Belgrade', name: '(UTC+01:00) Belgrade' },
        { timezone: 'Europe/Kaliningrad', name: '(UTC+02:00) Kaliningrad' },
        { timezone: 'Europe/Moscow', name: '(UTC+03:00) Moscow' },
        { timezone: 'Europe/Simferopol', name: '(UTC+03:00) Simferopol' },
        { timezone: 'Europe/Kirov', name: '(UTC+03:00) Kirov' },
        { timezone: 'Europe/Astrakhan', name: '(UTC+04:00) Astrakhan' },
        { timezone: 'Europe/Volgograd', name: '(UTC+04:00) Volgograd' },
        { timezone: 'Europe/Saratov', name: '(UTC+04:00) Saratov' },
        { timezone: 'Europe/Ulyanovsk', name: '(UTC+04:00) Ulyanovsk' },
        { timezone: 'Europe/Samara', name: '(UTC+04:00) Samara' },
        { timezone: 'Asia/Yekaterinburg', name: '(UTC+05:00) Yekaterinburg' },
        { timezone: 'Asia/Omsk', name: '(UTC+06:00) Omsk' },
        { timezone: 'Asia/Novosibirsk', name: '(UTC+07:00) Novosibirsk' },
        { timezone: 'Asia/Barnaul', name: '(UTC+07:00) Barnaul' },
        { timezone: 'Asia/Tomsk', name: '(UTC+07:00) Tomsk' },
        { timezone: 'Asia/Novokuznetsk', name: '(UTC+07:00) Novokuznetsk' },
        { timezone: 'Asia/Krasnoyarsk', name: '(UTC+07:00) Krasnoyarsk' },
        { timezone: 'Asia/Irkutsk', name: '(UTC+08:00) Irkutsk' },
        { timezone: 'Asia/Chita', name: '(UTC+09:00) Chita' },
        { timezone: 'Asia/Yakutsk', name: '(UTC+09:00) Yakutsk' },
        { timezone: 'Asia/Khandyga', name: '(UTC+09:00) Khandyga' },
        { timezone: 'Asia/Vladivostok', name: '(UTC+10:00) Vladivostok' },
        { timezone: 'Asia/Ust-Nera', name: '(UTC+10:00) Ust-Nera' },
        { timezone: 'Asia/Magadan', name: '(UTC+11:00) Magadan' },
        { timezone: 'Asia/Sakhalin', name: '(UTC+11:00) Sakhalin' },
        { timezone: 'Asia/Srednekolymsk', name: '(UTC+11:00) Srednekolymsk' },
        { timezone: 'Asia/Kamchatka', name: '(UTC+12:00) Kamchatka' },
        { timezone: 'Asia/Anadyr', name: '(UTC+12:00) Anadyr' },
        { timezone: 'Asia/Riyadh', name: '(UTC+03:00) Riyadh' },
        { timezone: 'Pacific/Guadalcanal', name: '(UTC+11:00) Guadalcanal' },
        { timezone: 'Indian/Mahe', name: '(UTC+04:00) Mahé' },
        { timezone: 'Africa/Khartoum', name: '(UTC+02:00) Khartoum' },
        { timezone: 'Europe/Stockholm', name: '(UTC+01:00) Stockholm' },
        { timezone: 'Asia/Singapore', name: '(UTC+08:00) Singapore' },
        { timezone: 'America/Paramaribo', name: '(UTC-03:00) Paramaribo' },
        { timezone: 'Africa/Juba', name: '(UTC+03:00) Juba' },
        { timezone: 'Africa/Sao_Tome', name: '(UTC+00:00) São Tomé' },
        { timezone: 'America/El_Salvador', name: '(UTC-06:00) El Salvador' },
        { timezone: 'Asia/Damascus', name: '(UTC+02:00) Damascus' },
        { timezone: 'America/Grand_Turk', name: '(UTC-04:00) Grand Turk' },
        { timezone: 'Africa/Ndjamena', name: '(UTC+01:00) N’Djamena' },
        { timezone: 'Indian/Kerguelen', name: '(UTC+05:00) Kerguelen' },
        { timezone: 'Asia/Bangkok', name: '(UTC+07:00) Bangkok' },
        { timezone: 'Asia/Dushanbe', name: '(UTC+05:00) Dushanbe' },
        { timezone: 'Pacific/Fakaofo', name: '(UTC+13:00) Fakaofo' },
        { timezone: 'Asia/Dili', name: '(UTC+09:00) Dili' },
        { timezone: 'Asia/Ashgabat', name: '(UTC+05:00) Ashgabat' },
        { timezone: 'Africa/Tunis', name: '(UTC+01:00) Tunis' },
        { timezone: 'Pacific/Tongatapu', name: '(UTC+13:00) Tongatapu' },
        { timezone: 'Europe/Istanbul', name: '(UTC+03:00) Istanbul' },
        { timezone: 'America/Port_of_Spain', name: '(UTC-04:00) Port of Spain' },
        { timezone: 'Pacific/Funafuti', name: '(UTC+12:00) Funafuti' },
        { timezone: 'Asia/Taipei', name: '(UTC+08:00) Taipei' },
        { timezone: 'Europe/Kiev', name: '(UTC+02:00) Kyiv' },
        { timezone: 'Europe/Uzhgorod', name: '(UTC+02:00) Uzhhorod' },
        { timezone: 'Europe/Zaporozhye', name: '(UTC+02:00) Zaporizhzhia' },
        { timezone: 'Pacific/Wake', name: '(UTC+12:00) Wake' },
        { timezone: 'America/New_York', name: '(UTC-05:00) New York' },
        { timezone: 'America/Detroit', name: '(UTC-05:00) Detroit' },
        { timezone: 'America/Kentucky/Louisville', name: '(UTC-05:00) Louisville' },
        { timezone: 'America/Kentucky/Monticello', name: '(UTC-05:00) Monticello' },
        { timezone: 'America/Indiana/Indianapolis', name: '(UTC-05:00) Indianapolis' },
        { timezone: 'America/Indiana/Vincennes', name: '(UTC-05:00) Vincennes' },
        { timezone: 'America/Indiana/Winamac', name: '(UTC-05:00) Winamac' },
        { timezone: 'America/Indiana/Marengo', name: '(UTC-05:00) Marengo' },
        { timezone: 'America/Indiana/Petersburg', name: '(UTC-05:00) Petersburg' },
        { timezone: 'America/Indiana/Vevay', name: '(UTC-05:00) Vevay' },
        { timezone: 'America/Chicago', name: '(UTC-06:00) Chicago' },
        { timezone: 'America/Indiana/Tell_City', name: '(UTC-06:00) Tell City' },
        { timezone: 'America/Indiana/Knox', name: '(UTC-06:00) Knox' },
        { timezone: 'America/Menominee', name: '(UTC-06:00) Menominee' },
        { timezone: 'America/North_Dakota/Center', name: '(UTC-06:00) Center' },
        { timezone: 'America/North_Dakota/New_Salem', name: '(UTC-06:00) New Salem' },
        { timezone: 'America/North_Dakota/Beulah', name: '(UTC-06:00) Beulah' },
        { timezone: 'America/Denver', name: '(UTC-07:00) Denver' },
        { timezone: 'America/Boise', name: '(UTC-07:00) Boise' },
        { timezone: 'America/Phoenix', name: '(UTC-07:00) Phoenix' },
        { timezone: 'America/Los_Angeles', name: '(UTC-08:00) Los Angeles' },
        { timezone: 'America/Anchorage', name: '(UTC-09:00) Anchorage' },
        { timezone: 'America/Juneau', name: '(UTC-09:00) Juneau' },
        { timezone: 'America/Sitka', name: '(UTC-09:00) Sitka' },
        { timezone: 'America/Metlakatla', name: '(UTC-09:00) Metlakatla' },
        { timezone: 'America/Yakutat', name: '(UTC-09:00) Yakutat' },
        { timezone: 'America/Nome', name: '(UTC-09:00) Nome' },
        { timezone: 'America/Adak', name: '(UTC-10:00) Adak' },
        { timezone: 'Pacific/Honolulu', name: '(UTC-10:00) Honolulu' },
        { timezone: 'America/Montevideo', name: '(UTC-03:00) Montevideo' },
        { timezone: 'Asia/Samarkand', name: '(UTC+05:00) Samarkand' },
        { timezone: 'Asia/Tashkent', name: '(UTC+05:00) Tashkent' },
        { timezone: 'America/Caracas', name: '(UTC-04:00) Caracas' },
        { timezone: 'Asia/Ho_Chi_Minh', name: '(UTC+07:00) Ho Chi Minh' },
        { timezone: 'Pacific/Efate', name: '(UTC+11:00) Efate' },
        { timezone: 'Pacific/Wallis', name: '(UTC+12:00) Wallis' },
        { timezone: 'Pacific/Apia', name: '(UTC+13:00) Apia' },
        { timezone: 'Africa/Johannesburg', name: '(UTC+02:00) Johannesburg' }
    ]
    useEffect(() => {
        setInfo(infos)
        console.log(infos);
        return () => {
            setInfo(null)
        }
    }, [infos])
    /*  function selectTimezones(timezones, info) {
         var data = 
 
         var infoCopy = { ...info }
         infoCopy.openingHours = infoCopy.openingHours.map((day) => { return { ...day, timezone: 'America/Sao_Paulo' } })
         onChange(infoCopy)
 
         return data
     } */
    if (info) {
        return (
            <div className='hour-container'>
                <Space></Space>
                <InputSelect
                    placeholder="Fuso Horário"
                    data={timezones.map((timezone) => {
                        return { name: timezone.name, value: timezone.timezone, selected: timezone.timezone === infos.timezone }
                    })}
                    onChange={(value) => {
                        var infoCopy = { ...info, timezone: value }
                        onChange(infoCopy)
                    }}
                />
                <Space></Space>
                {
                    info?.openingHours.map((day, index) => {
                        return <HourComponent
                            key={index + day.dayName}
                            day={day}
                            onChange={(value) => {
                                var infoCopy = { ...info }
                                infoCopy.openingHours[index] = { ...infoCopy.openingHours[index], ...value }
                                onChange(infoCopy)
                            }} />
                    })
                }
            </div>
        )
    }
    else {
        return (
            <div className="ring-container" style={{ minWidth: '23rem', height: '35rem', alignItems: 'center', padding: 0 }}>
                <Ring
                    size={60}
                    lineWeight={5}
                    speed={2}
                    color="blue"
                />
            </div>
        )

    }
}


function HourComponent({ day, onChange }) {
    const [initialHour, setInitialHour] = useState(null)
    const [finalHour, setFinalHour] = useState(null)
    useEffect(() => {
        setFinalHour(day?.finalHour)
        setInitialHour(day?.initialHour)
        return () => {
            setFinalHour(null)
            setInitialHour(null)
        }
    }, [day])

    function revertToUTC(date) {
        if (date && date !== '') {
            return `${(new Date(date).toLocaleString()).substring(12, 17)}`
        }
        return ''

    }
    const handleCheckboxChange = (e) => {
        onChange({ allHour: e.target.checked })
        // Atualiza o estado com o valor do checkbox
    };
    return (
        <div className="hour-content">
            <div className="nameDay" style={{ fontWeight: 'bold', fontSize: '10pt', marginLeft: '.5rem' }}> {day.dayName}</div>
            {day ?
                <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <Button status={day?.status} onChange={(value) => {
                        onChange({ status: value })
                    }} />

                    {day?.status && !day?.allHour ?
                        <>
                            <InputTime id='initialHour' dataDefault={revertToUTC(day?.initialHour)} onChange={(value) => {
                                console.log(value);
                                onChange({ initialHour: value.replace(/\s+\(.*\)$/, '') })
                            }} />
                            até
                            <InputTime id='finalHour' dataDefault={revertToUTC(day?.finalHour)} onChange={(value) => {
                                onChange({ finalHour: value.replace(/\s+\(.*\)$/, '') })
                            }} />
                            <input id='allHour' checked={day?.allHour} onChange={handleCheckboxChange} type='checkbox' /> 24h
                        </> :
                        <>
                            <InputTime disabled id='initialHour' dataDefault={revertToUTC(initialHour)} />
                            até
                            <InputTime disabled id='finalHour' dataDefault={revertToUTC(finalHour)} />
                            <input id='allHour' checked={day?.allHour} onChange={handleCheckboxChange} type='checkbox' /> 24h
                        </>
                    }
                </div> : null}

        </div>
    )
}