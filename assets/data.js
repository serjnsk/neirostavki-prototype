/* =====================================================================
   Нейроставки — данные, модель и форматирование (общие для всех страниц)
   ===================================================================== */
const CDN = 'https://cdn-ec.pb06e2-resources.ru/ContentCommon/';
const L = p => (typeof LOGOS !== 'undefined' && LOGOS['t/' + p]) || CDN + 'Logotypes/TeamLogos/' + p;
const F = c => (typeof LOGOS !== 'undefined' && LOGOS['f/' + c]) || CDN + 'NewFlags/Circle/' + c + '.svg';
const TODAY = new Date(2026, 8, 22, 12, 0); // прототип: «сегодня» — вт, 22 сентября 2026
const UPDATED = '22 сен, 14:20';

const ICONS = {
  football:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7.2l4.6 3.3-1.8 5.4H9.2l-1.8-5.4z"/><path d="M12 3v4.2M7.4 10.5L3.6 8.6M16.6 10.5l3.8-1.9M9.2 15.9L7 19.4M14.8 15.9L17 19.4"/></svg>',
  hockey:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 3.5l7.3 11.6c.4.6 1 .9 1.7.9H16"/><rect x="12" y="17" width="9" height="3.5" rx="1.7"/></svg>',
  tennis:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M5.6 6.2c3.2 2.3 3.2 9.3 0 11.6M18.4 6.2c-3.2 2.3-3.2 9.3 0 11.6"/></svg>',
  basketball:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 3v18M3 12h18M6 5.6c3.2 3 3.2 9.8 0 12.8M18 5.6c-3.2 3-3.2 9.8 0 12.8"/></svg>',
  esports:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="7" width="19" height="11" rx="4.5"/><path d="M8 10.5v4M6 12.5h4M15.5 11.5h.01M17.8 13.5h.01"/></svg>',
  mma:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M8.3 3h7.4l5.3 5.3v7.4L15.7 21H8.3L3 15.7V8.3z"/><path d="M9 12h6"/></svg>',
  volleyball:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 3c-1.2 4.2 1 8.4 6.2 10.4M3.4 9.6c4.2 1.2 9.2-.2 12.2-3.4M4.6 16.2c4.2-2 9.4-1 12.4 2.2"/></svg>'
};
const FLIP_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/></svg>';
const SPORTS = {
  football:{n:'Футбол'}, hockey:{n:'Хоккей'}, tennis:{n:'Теннис'}, basketball:{n:'Баскетбол'},
  esports:{n:'Киберспорт'}, mma:{n:'ММА'}, volleyball:{n:'Волейбол'}
};
const INDIVIDUAL = {tennis:1, mma:1};
const SRC_DEFAULT = {
  football:['Opta','Sofascore','Transfermarkt','Пресс-конференции','Официальный сайт лиги','Гисметео'],
  hockey:['KHL.ru','Sofascore','InStat','Пресс-службы клубов','Спортс.ру'],
  tennis:['ATP Tour','Tennis Abstract','Sofascore','Flashscore','Пресс-служба турнира'],
  basketball:['Sofascore','Basketnews','Basketball Reference','ESPN','Пресс-службы клубов'],
  esports:['HLTV','Liquipedia','Bo3.gg','Соцсети команд'],
  mma:['UFC Stats','Tapology','Sherdog','Медиа-день'],
  volleyball:['CEV','Volleybox','Sofascore','Пресс-служба ЧЕ']
};
const BK = [
  {id:'fonbet', name:'Фонбет', c:'#E11D2E', m:'Ф'},
  {id:'pari', name:'PARI', c:'#F2CB05', m:'P', ink:'#111'},
  {id:'winline', name:'Винлайн', c:'#FF6A00', m:'W', ink:'#111'},
  {id:'olimp', name:'Олимп', c:'#1F5AE0', m:'О'},
  {id:'liga', name:'Лига Ставок', c:'#12804A', m:'Л'},
  {id:'betcity', name:'Бетсити', c:'#1348B8', m:'Б'},
  {id:'betboom', name:'Бетбум', c:'#0E2A6B', m:'ББ'}
];
const BKMAP = Object.fromEntries(BK.map(b => [b.id, b]));
const STRENGTH_LABEL = {strong:'высокий валуй', mid:'умеренный валуй', weak:'слабый валуй', none:'рынок точен'};
const TIP_VAL = 'Валуй — ожидаемая доходность ставки при нашей вероятности и лучшем кэфе на рынке: p × кэф − 1. Например, 49% × 2,35 − 1 = +15%';
const TIP_FAIR = 'Справедливый коэффициент = 1 / наша вероятность. Всё, что выше на рынке, — плюсовое ожидание';

/* p — наши вероятности исходов; base — центр рыночной линии (котировки PARI на 22.09.2026),
   odds — явные котировки 7 БК; factors.w — вес фактора, нормируется к разнице «наша оценка − рынок»;
   detail — ручные данные для страницы события (у остальных событий генерируются) */
const EVENTS = [
  {id:1, sport:'football', league:'РПЛ', sub:'11 тур', dt:'2026-10-03T16:30', venue:'Ozon Арена, Краснодар · судья Карасёв',
   t1:{n:'Краснодар', s:'Краснодар', l:L('Football/Russia/Krasnodar_new.png')}, t2:{n:'ЦСКА', s:'ЦСКА', l:L('Football/Russia/CSKA_Moscow_new.png')},
   way:3, p:[.49,.26,.25], tot:[2.75, 2.62],
   odds:{fonbet:[2.35,3.30,2.95], pari:[2.30,3.35,3.00], winline:[2.28,3.40,2.90], olimp:[2.26,3.30,2.98], liga:[2.25,3.25,3.00], betcity:[2.22,3.35,2.92], betboom:[2.20,3.30,2.95]},
   factors:[
     {t:'Кордоба вернулся в заявку после травмы: 0,7 гола за матч в прошлом сезоне', w:3},
     {t:'У ЦСКА третий матч за 8 дней и перелёт из Грозного', w:2.5},
     {t:'Домашняя серия Краснодара — 7 матчей без поражений', w:2},
     {t:'ЦСКА лучше по xG в последних 5 турах: 8,4 против 7,1', w:-1.2},
     {t:'Судья Карасёв: хозяева выигрывают 61% его матчей в РПЛ', w:.6}],
   hist:[2.20,2.22,2.25,2.25,2.30,2.33,2.35],
   detail:{
     place:'Ozon Арена, Краснодар', referee:'Сергей Карасёв (Москва)', weather:'+21 °C, ясно, ветер 3 м/с', note:'Ожидается аншлаг: продано 33 000 билетов',
     markets:[
       {n:'Угловые ТБ 10,5', p:.56, base:1.86},
       {n:'Жёлтые карточки ТБ 4,5', p:.60, base:1.76},
       {n:'ИТБ1 1,5', p:.56, base:1.86},
       {n:'Кордоба забьёт', p:.38, base:2.60},
       {n:'Обе забьют — да', p:.57, base:1.74},
       {n:'Гол в 1-м тайме — да', p:.75, base:1.30}],
     form:{t1:[{d:'20 сен',opp:'Ростов',h:true,s:'2:0',r:'W'},{d:'13 сен',opp:'Динамо',h:false,s:'1:1',r:'D'},{d:'30 авг',opp:'Ахмат',h:true,s:'3:1',r:'W'},{d:'23 авг',opp:'Зенит',h:false,s:'0:1',r:'L'},{d:'16 авг',opp:'Рубин',h:true,s:'2:1',r:'W'}],
           t2:[{d:'19 сен',opp:'Ахмат',h:false,s:'1:1',r:'D'},{d:'14 сен',opp:'Спартак',h:true,s:'2:1',r:'W'},{d:'31 авг',opp:'Локомотив',h:false,s:'0:2',r:'L'},{d:'24 авг',opp:'Пари НН',h:true,s:'3:0',r:'W'},{d:'17 авг',opp:'Балтика',h:false,s:'1:0',r:'W'}]},
     h2h:[{d:'12 апр 2026',home:'ЦСКА',away:'Краснодар',s:'1:1',comp:'РПЛ'},{d:'26 окт 2025',home:'Краснодар',away:'ЦСКА',s:'2:1',comp:'РПЛ'},{d:'3 мая 2025',home:'Краснодар',away:'ЦСКА',s:'1:0',comp:'РПЛ'},{d:'15 мар 2025',home:'ЦСКА',away:'Краснодар',s:'0:0',comp:'Кубок России'},{d:'9 ноя 2024',home:'ЦСКА',away:'Краснодар',s:'2:0',comp:'РПЛ'}],
     absences:{t1:[{n:'Кордоба', st:'вернулся', why:'травма бедра, в общей группе с 20 сентября'},{n:'Сперцян', st:'под вопросом', why:'ушиб, решение в день матча'}],
               t2:[{n:'Акинфеев', st:'травма', why:'до середины октября'},{n:'Мойзес', st:'дисквалификация', why:'четыре жёлтые карточки'},{n:'Обляков', st:'под вопросом', why:'перелёт после матчей сборной'}]},
     stats:[{n:'xG за матч',a:1.9,b:1.6,f:1},{n:'xGA за матч',a:0.9,b:1.1,f:1,low:true},{n:'Удары в створ',a:5.4,b:4.8,f:1},{n:'Владение, %',a:58,b:52,f:0},{n:'Угловые за матч',a:6.1,b:5.2,f:1},{n:'Жёлтые за матч',a:2.1,b:2.4,f:1,low:true}],
     timeline:[
       {f:0, ts:'22 сен, 14:02', src:'Пресс-конференция ФК «Краснодар»', text:'Кордоба тренируется в общей группе и готов к матчу'},
       {f:1, ts:'21 сен, 20:30', src:'Календарь РПЛ и Кубка', text:'У ЦСКА подтверждён кубковый матч в Грозном 30 сентября — третий матч за 8 дней с перелётом'},
       {f:2, ts:'20 сен, 18:10', src:'Opta', text:'Домашняя серия Краснодара достигла 7 матчей без поражений (5 побед)'},
       {f:3, ts:'20 сен, 18:10', src:'Opta', text:'По xG за 5 туров ЦСКА сильнее: 8,4 против 7,1 — поправка вниз'},
       {f:4, ts:'19 сен, 12:00', src:'Назначения судей РПЛ', text:'Матч обслуживает Карасёв: хозяева выигрывают 61% его матчей'}],
     watch:['Стартовые составы за 60 минут до матча: если Сперцян не играет, оценка П1 снизится примерно на 2 п.п.',
            'Если лучший кэф на П1 опустится ниже 2,10 — валуй исчезнет, уведомим подписчиков',
            'Дождь или сильный ветер почти не влияют на основной исход, но снижают вероятность «Тотал Б 2,5»'],
     history:{labels:['12 сен','13','14','15','16','17','18','19','20','21','22'],
              mkt:[44.5,44.3,44.0,43.6,43.2,42.9,42.5,42.0,41.6,41.1,40.8],
              ours:[44.0,44.0,44.5,44.5,44.5,45.0,45.2,45.9,48.3,48.3,49.0],
              notes:{7:'Назначен Карасёв', 8:'Серия 7 матчей · поправка по xG', 10:'Кордоба в общей группе'}}
   }},

  {id:2, sport:'hockey', league:'КХЛ', sub:'регулярный чемпионат', dt:'2026-09-22T19:30', venue:'Нижний Новгород, КРК «Нагорный»',
   t1:{n:'Торпедо НН', s:'Торпедо', l:L('Hockey/KHL/new/Torpedo_NNovgorod_new.png')}, t2:{n:'Авангард', s:'Авангард', l:L('Hockey/Russia/Avangard_new.png')},
   way:3, p:[.41,.22,.37], base:[2.65,4.20,2.30],
   factors:[
     {t:'Торпедо: 5 побед в 6 последних домашних матчах', w:2.2},
     {t:'Авангард на 4-й игре выездной серии, вчера — перелёт 6 часов', w:2},
     {t:'Основной вратарь Авангарда отдыхает — в воротах второй номер', w:1.6},
     {t:'Большинство Торпедо 28% — лучшее в лиге', w:1},
     {t:'Авангард выше по качеству бросков (xG 3,1 за матч)', w:-.9}],
   hist:[2.45,2.50,2.55,2.60,2.65,2.65]},

  {id:3, sport:'football', league:'Лига наций УЕФА', sub:'дивизион A · 2 тур', dt:'2026-09-24T22:45', venue:'Амстердам, «Йохан Кройф Арена»',
   t1:{n:'Нидерланды', s:'Нидерланды', l:F('Netherlands')}, t2:{n:'Германия', s:'Германия', l:F('Germany')},
   way:3, p:[.36,.28,.36], base:[2.40,3.85,2.70],
   factors:[
     {t:'Последние 4 очных матча — 3 ничьи', w:2},
     {t:'У обеих сборных ротация: 6 новых игроков в старте Германии', w:1.5},
     {t:'Низкий темп: обе команды в топ-5 по владению и сдержанному прессингу', w:1.2},
     {t:'Дома Нидерланды чаще дожимают: 9 побед из 14', w:-.6}],
   hist:[3.60,3.65,3.70,3.75,3.80,3.85]},

  {id:4, sport:'esports', league:'Dota 2 · PGL Wallachia S9', sub:'групповой этап · Bo3', dt:'2026-09-22T14:00', venue:'Бухарест · онлайн-стадия',
   t1:{n:'Natus Vincere', s:'NAVI', l:L('Esports/Natus_Vincere.png')}, t2:{n:'1W Team', s:'1W', l:L('Esports/Dota_2/1win.png')},
   way:2, p:[.62,.38], base:[1.72,2.12], src:['Liquipedia','Dotabuff','Stratz','Соцсети команд'],
   factors:[
     {t:'NAVI 7–1 по картам на двух последних турнирах', w:3},
     {t:'1W без основного керри (виза), стендин из академии', w:2.5},
     {t:'Патч 7.40: мета под сигнатурных героев мидера NAVI', w:1.3},
     {t:'Очная история за год 2–4 не в пользу NAVI', w:-1}],
   hist:[1.80,1.78,1.75,1.74,1.72,1.72]},

  {id:5, sport:'basketball', league:'Суперкубок Турции', sub:'финал', dt:'2026-09-23T21:00', venue:'Стамбул, «Юлкер Спортс Арена»',
   t1:{n:'Фенербахче', s:'Фенербахче', l:L('Basketball/Turkey/Fenerbahce_Istanbul-new.png')}, t2:{n:'Бешикташ', s:'Бешикташ', l:L('Football/Turkey/Besiktas_new.png')},
   way:2, p:[.70,.30], base:[1.32,3.40],
   factors:[
     {t:'Бешикташ усилился летом: 4 новых легионера', w:1.5},
     {t:'У Фенербахче нет двух ротационных игроков (сборные)', w:1},
     {t:'Фенербахче выиграл 6 последних очных', w:-.5}],
   hist:[3.30,3.35,3.40,3.40]},

  {id:6, sport:'tennis', league:'ATP 250 · Чэнду', sub:'хард · 1-й круг', dt:'2026-09-22T09:30', venue:'Чэнду, Sichuan International Tennis Center',
   t1:{n:'Мюллер А.', s:'Мюллер', l:L('Tennis/Muller_Alexandre_new.png')}, t2:{n:'Павлович Л.', s:'Павлович', l:L('Tennis/Pavlovic_Luka.png')},
   way:2, p:[.65,.35], base:[1.62,2.20],
   factors:[
     {t:'Мюллер 11–3 на харде в сезоне, два титула на «250»', w:3},
     {t:'Павлович из квалификации: 3 матча за 4 дня', w:2.5},
     {t:'Очные 2–0 в пользу Мюллера, оба матча на харде', w:1.4},
     {t:'Павлович выиграл 78% очков на первой подаче в квалификации', w:-.8}],
   hist:[1.70,1.68,1.65,1.62,1.62]},

  {id:7, sport:'hockey', league:'КХЛ', sub:'регулярный чемпионат', dt:'2026-09-22T19:30', venue:'Москва, «ВТБ Арена»',
   t1:{n:'Динамо Москва', s:'Динамо', l:L('Hockey/Russia/Dynamo_Moskva-new.png')}, t2:{n:'Барыс', s:'Барыс', l:L('Hockey/KHL/new/Barys_new.png')},
   way:3, p:[.58,.22,.20], base:[1.75,4.30,4.05],
   factors:[
     {t:'Барыс: 5 поражений подряд на выезде, 2,1 гола за игру', w:2},
     {t:'Динамо в полном составе, вернулся Уил', w:1.5},
     {t:'Барыс лучше по реализации большинства (22%)', w:-.4}],
   hist:[1.80,1.78,1.77,1.75,1.75]},

  {id:8, sport:'football', league:'Лига наций УЕФА', sub:'дивизион A · 2 тур', dt:'2026-09-24T22:45', venue:'Лиссабон, «Жозе Алваладе»',
   t1:{n:'Португалия', s:'Португалия', l:F('Portugal')}, t2:{n:'Уэльс', s:'Уэльс', l:F('Wales')},
   way:3, p:[.80,.14,.06], base:[1.23,6.10,14.00],
   factors:[
     {t:'Португалия дома: 12 побед подряд в официальных матчах', w:1.5},
     {t:'Уэльс без Джеймса и Уилсона — половина голов сборной', w:1},
     {t:'Ротация Португалии: Роналду в запасе (по данным пресс-конференции)', w:-.5}],
   hist:[1.22,1.22,1.23,1.23]},

  {id:9, sport:'football', league:'Лига наций УЕФА', sub:'дивизион A · 2 тур', dt:'2026-09-24T22:45', venue:'Осло, «Уллевол»',
   t1:{n:'Норвегия', s:'Норвегия', l:F('Norway')}, t2:{n:'Дания', s:'Дания', l:F('Denmark')},
   way:3, p:[.50,.26,.24], base:[1.80,3.95,4.20],
   factors:[
     {t:'Дания: 4 матча без поражений, лучшая защита группы (0,6 xGA)', w:1.2},
     {t:'Холанд: 9 голов в 6 матчах за сборную, но 0 в 3 последних очных', w:.4},
     {t:'Дождь и +7 °C: у обеих сборных 60% ничьих в матчах с тоталом < 2,5', w:.6}],
   hist:[3.80,3.85,3.90,3.95]},

  {id:10, sport:'football', league:'Лига наций УЕФА', sub:'дивизион A · 2 тур', dt:'2026-09-24T22:45', venue:'Белград, «Райко Митич»',
   t1:{n:'Сербия', s:'Сербия', l:F('Serbia')}, t2:{n:'Греция', s:'Греция', l:F('Greece')},
   way:3, p:[.41,.28,.31], base:[2.65,3.30,2.75],
   factors:[
     {t:'Влахович и Митрович оба в строю — впервые с марта', w:2.5},
     {t:'Греция без Бакасетаса (травма) — ключевой креативщик', w:2},
     {t:'Сербия дома: 6 побед в 7 матчах при 2,3 гола за игру', w:1.6},
     {t:'Греция лучше по xGA в отборе (0,8)', w:-.9}],
   hist:[2.50,2.55,2.58,2.60,2.65,2.65]},

  {id:11, sport:'football', league:'Лига наций УЕФА', sub:'дивизион A · 2 тур', dt:'2026-09-25T22:45', venue:'Конья, «Конья Бююкшехир»',
   t1:{n:'Турция', s:'Турция', l:F('Turkey')}, t2:{n:'Франция', s:'Франция', l:F('France')},
   way:3, p:[.16,.23,.61], base:[6.60,4.60,1.47],
   factors:[
     {t:'Франция без Мбаппе и Дембеле (травмы) — 43% голов сборной', w:2},
     {t:'Турция дома в Конье: 3 ничьи в 4 последних матчах', w:1.2},
     {t:'Ротация Франции перед вторым матчем окна', w:.8},
     {t:'Франция не проигрывала в Лиге наций 9 матчей', w:-.7}],
   hist:[4.40,4.45,4.50,4.55,4.60]},

  {id:12, sport:'football', league:'Лига наций УЕФА', sub:'дивизион A · 2 тур', dt:'2026-09-25T22:45', venue:'Милан, «Сан-Сиро»',
   t1:{n:'Италия', s:'Италия', l:F('Italy')}, t2:{n:'Бельгия', s:'Бельгия', l:F('Belgium')},
   way:3, p:[.44,.28,.28], base:[2.13,3.60,3.35],
   factors:[
     {t:'Италия дома в Лиге наций: 5 матчей без поражений', w:.5},
     {t:'Бельгия без Де Брёйне — креатив на Доку и Тросаре', w:.5},
     {t:'Обе сборные с ротацией на второй матч окна', w:.4}],
   hist:[3.50,3.55,3.60,3.60]},

  {id:13, sport:'hockey', league:'КХЛ', sub:'регулярный чемпионат', dt:'2026-09-23T12:00', venue:'Хабаровск, «Платинум Арена»',
   t1:{n:'Амур', s:'Амур', l:L('Hockey/Russia/Amur.png')}, t2:{n:'ЦСКА', s:'ЦСКА', l:L('Hockey/KHL/new/HC_CSKA_Moscow.png')},
   way:3, p:[.26,.22,.52], base:[4.20,4.20,1.72],
   factors:[
     {t:'ЦСКА: 3-й матч выездной серии на Дальнем Востоке, +7 часов', w:2.5},
     {t:'Амур дома 4–1 в сезоне, вратарь Дорожко — 93,4% отражённых', w:2},
     {t:'ЦСКА без первого звена (болезнь, по данным клуба)', w:1.5},
     {t:'ЦСКА выиграл 8 из 10 последних очных', w:-.5}],
   hist:[3.80,3.90,4.00,4.10,4.20,4.20]},

  {id:14, sport:'hockey', league:'КХЛ', sub:'регулярный чемпионат', dt:'2026-09-23T17:00', venue:'Уфа, «Уфа-Арена»',
   t1:{n:'Салават Юлаев', s:'Салават', l:L('Hockey/KHL/new/Salavat_Yulaev_Ufa.png')}, t2:{n:'Металлург Мг', s:'Металлург', l:L('Hockey/KHL/new/Metallurg_Mg.png')},
   way:3, p:[.31,.23,.46], base:[3.20,4.30,1.97],
   factors:[
     {t:'Салават дома: 3 победы в 4 матчах сезона', w:.8},
     {t:'Металлург играет второй матч за два дня, вчера — Казань', w:.9},
     {t:'Металлург: лучшая реализация бросков в лиге (12,4%)', w:-.4}],
   hist:[3.10,3.15,3.20,3.20]},

  {id:15, sport:'hockey', league:'КХЛ', sub:'регулярный чемпионат', dt:'2026-09-22T19:30', venue:'Санкт-Петербург, «СКА Арена»',
   t1:{n:'Шанхай Дрэгонс', s:'Шанхай', l:L('Hockey/China/Shanghai_Dragons_new.png')}, t2:{n:'Автомобилист', s:'Автомобилист', l:L('Hockey/KHL/new/Avtomobilist_Yekaterinburg.png')},
   way:3, p:[.32,.22,.46], base:[2.80,4.20,2.15],
   factors:[
     {t:'Автомобилист: 7 побед в 9 последних матчах', w:1.2},
     {t:'У Шанхая 4 легионера под вопросом (визы)', w:1},
     {t:'Шанхай дома 5–2 в сезоне', w:-.6}],
   hist:[2.10,2.12,2.15,2.15]},

  {id:16, sport:'esports', league:'CS2 · G Play Connect', sub:'групповой этап · Bo3', dt:'2026-09-22T17:00', venue:'Онлайн · Европа',
   t1:{n:'B8', s:'B8', l:L('Esports/CounterStrike/B8-new.png')}, t2:{n:'Luminosity', s:'Luminosity', l:L('Esports/Luminosity.png')},
   way:2, p:[.56,.44], base:[1.58,2.38],
   factors:[
     {t:'Luminosity 3–0 по картам против B8 в 2026 году', w:2},
     {t:'B8 сменил ин-гейм лидера две недели назад', w:1.5},
     {t:'Пул карт: Luminosity сильнее на Nuke и Ancient — вероятные пики', w:1.2},
     {t:'B8 выше в рейтинге HLTV (#21 против #34)', w:-.6}],
   hist:[2.30,2.32,2.35,2.38,2.38]},

  {id:17, sport:'esports', league:'Dota 2 · PGL Wallachia S9', sub:'групповой этап · Bo3', dt:'2026-09-22T11:00', venue:'Бухарест · онлайн-стадия',
   t1:{n:'Team Nemesis', s:'Nemesis', l:L('Esports/Universal/Team_Nemesis.png')}, t2:{n:'GamerLegion', s:'GamerLegion', l:L('Esports/Universal/GamerLegion-new.png')},
   way:2, p:[.44,.56], base:[2.20,1.67], src:['Liquipedia','Dotabuff','Stratz','Соцсети команд'],
   factors:[
     {t:'Nemesis 2–1 в очных на патче 7.40', w:1},
     {t:'GamerLegion сильнее по среднему нетворсу к 15-й минуте', w:-.4},
     {t:'У Nemesis стендин на позиции 4', w:-.3}],
   hist:[2.15,2.18,2.20,2.20]},

  {id:18, sport:'mma', league:'UFC Fight Night 289 · Лас-Вегас', sub:'главный бой · легчайший вес · 5 раундов', dt:'2026-09-27T06:40', venue:'UFC Apex, Лас-Вегас',
   t1:{n:'Рауль Росас-мл.', s:'Росас', l:L('MMA/Raul_Rosas_Jr..png')}, t2:{n:'Раони Барселос', s:'Барселос', l:L('MMA/Raoni_Barcelos.png')},
   way:2, p:[.70,.30], base:[1.52,2.60],
   factors:[
     {t:'Росас: 6 побед подряд, 4 досрочно', w:3},
     {t:'Барселосу 38, два поражения в трёх последних боях', w:2.2},
     {t:'Стилевое: 4,1 тейкдауна за бой у Росаса против 58% защиты Барселоса', w:2},
     {t:'Барселос точнее в стойке (52% ударов в цель)', w:-.3}],
   hist:[1.60,1.58,1.55,1.55,1.52]},

  {id:19, sport:'mma', league:'UFC 333 · Абу-Даби', sub:'титульный бой · легчайший вес · 5 раундов', dt:'2026-10-25T02:45', venue:'Etihad Arena, остров Яс',
   t1:{n:'Петр Ян', s:'Ян', l:L('MMA/PetrYan.png')}, t2:{n:'Мераб Двалишвили', s:'Двалишвили', l:L('MMA/Merab_Dvalishvili.png')},
   way:2, p:[.60,.40], base:[1.53,2.58],
   factors:[
     {t:'Двалишвили: 13 побед подряд, рекордный темп тейкдаунов (7,2 за бой)', w:1.8},
     {t:'Ян выиграл первый бой (2023), но Мераб с тех пор прибавил в защите от ударов', w:.8},
     {t:'Ян: 5 побед в 6 последних, лучший ударник дивизиона по точности', w:-.8}],
   hist:[2.50,2.55,2.58,2.58]},

  {id:20, sport:'volleyball', league:'Чемпионат Европы', sub:'1/4 финала', dt:'2026-09-22T16:55', venue:'Болонья, «Унипол Арена»',
   t1:{n:'Польша', s:'Польша', l:F('Poland')}, t2:{n:'Германия', s:'Германия', l:F('Germany')},
   way:2, p:[.86,.14], base:[1.11,6.00],
   factors:[
     {t:'Польша: 12 побед подряд на чемпионатах Европы, лучший блок турнира', w:1},
     {t:'Германия прошла группу с двумя поражениями', w:.6},
     {t:'У Польши не играет Леон (отдых, по данным штаба)', w:-.4}],
   hist:[1.10,1.11,1.11]},

  {id:21, sport:'volleyball', league:'Чемпионат Европы', sub:'1/4 финала', dt:'2026-09-22T19:55', venue:'Болонья, «Унипол Арена»',
   t1:{n:'Франция', s:'Франция', l:F('France')}, t2:{n:'Румыния', s:'Румыния', l:F('Romania')},
   way:2, p:[.84,.16], base:[1.14,5.20],
   factors:[
     {t:'Франция — действующий олимпийский чемпион, состав без потерь', w:1},
     {t:'Румыния впервые в 1/4 за 40 лет — фактор давления', w:.7},
     {t:'Франция теряла сеты в 3 из 4 матчей группы', w:-.3}],
   hist:[1.13,1.14,1.14]},

  {id:22, sport:'basketball', league:'WNBA · плей-офф', sub:'полуфинал · матч 3', dt:'2026-09-23T04:00', venue:'Индианаполис, «Гейнбридж Филдхаус»',
   t1:{n:'Индиана Фивер', s:'Индиана', l:L('Basketball/NBA_women/Indiana_Fever.png')}, t2:{n:'Миннесота Линкс', s:'Миннесота', l:L('Basketball/NBA_women/Minnesota_Lynx.png')},
   way:2, p:[.55,.45], base:[1.95,1.85],
   factors:[
     {t:'Кларк вернулась после травмы: +12 очков и +8 передач к средним команды', w:3},
     {t:'Миннесота: третий матч за 5 дней с перелётом', w:1.8},
     {t:'Индиана дома 15–3 в сезоне', w:1.5},
     {t:'Миннесота лучше по рейтингу защиты (97,1)', w:-.7}],
   hist:[2.05,2.02,2.00,1.98,1.95]},

  {id:23, sport:'tennis', league:'ATP 250 · Ханчжоу', sub:'хард · квалификация · финал', dt:'2026-09-22T09:30', venue:'Ханчжоу, Olympic Sports Expo Center',
   t1:{n:'Вебер А.', s:'Вебер', l:L('Tennis/Weber_Arthur.png')}, t2:{n:'Мацуока Х.', s:'Мацуока', l:L('Tennis/Matsuoka_Hayato.png')},
   way:2, p:[.36,.64], base:[2.60,1.47],
   factors:[
     {t:'Мацуока: 4 победы подряд в квалификациях на азиатском харде', w:.5},
     {t:'Вебер лучше по проценту выигранных очков на первой подаче (74%)', w:-.3},
     {t:'Очных встреч не было', w:.1}],
   hist:[1.45,1.47,1.47]},

  {id:24, sport:'tennis', league:'ATP 250 · Ханчжоу', sub:'хард · квалификация · финал', dt:'2026-09-22T09:30', venue:'Ханчжоу, Olympic Sports Expo Center',
   t1:{n:'Сврчина Д.', s:'Сврчина', l:L('Tennis/svrcina_dalibor.png')}, t2:{n:'Секулич Ф.', s:'Секулич', l:L('Tennis/philip_sekulic.png')},
   way:2, p:[.79,.21], base:[1.23,3.90],
   factors:[
     {t:'Сврчина: 9–2 на харде за два месяца, титул на челленджере', w:1.8},
     {t:'Секулич отыграл три сета вчера — 2 ч 41 мин на корте', w:1.2},
     {t:'Секулич выиграл единственную очную (2025, грунт)', w:-.4}],
   hist:[1.25,1.24,1.23,1.23]},

  {id:25, sport:'football', league:'Лига чемпионов', sub:'основной этап · 2 тур', dt:'2026-09-30T22:00', venue:'Ливерпуль, «Энфилд»',
   t1:{n:'Ливерпуль', s:'Ливерпуль', l:L('Football/England/Liverpool_new.png')}, t2:{n:'Реал Мадрид', s:'Реал', l:L('Football/Spain/Real_Madrid.png')},
   way:3, p:[.50,.25,.25], base:[2.10,3.70,3.30],
   factors:[
     {t:'Реал: 4 матча за 11 дней, Винисиус под вопросом (мышечное)', w:2},
     {t:'Ливерпуль дома в Лиге чемпионов: 11 побед в 12 последних', w:1.8},
     {t:'Салах: 5+1 в четырёх матчах сезона', w:1.2},
     {t:'Реал лучше по xG за 90 минут в сезоне (2,3)', w:-.4}],
   hist:[2.00,2.02,2.05,2.05,2.08,2.10]},

  {id:26, sport:'football', league:'РПЛ', sub:'11 тур', dt:'2026-10-04T19:30', venue:'Москва, «Лукойл Арена»',
   t1:{n:'Спартак', s:'Спартак', l:L('Football/Russia/Spartak_Moscow-new.png')}, t2:{n:'Рубин', s:'Рубин', l:L('Football/Russia/Rubin.png')},
   way:3, p:[.52,.27,.21], base:[1.75,3.80,4.60],
   factors:[
     {t:'Рубин: 5 матчей без поражений, лучшая оборона нижней половины таблицы', w:1},
     {t:'Спартак теряет очки дома: 3 ничьи в 5 последних', w:.9},
     {t:'У Спартака вернулись Угальде и Барко', w:-.5}],
   hist:[3.70,3.75,3.80,3.80]}
];

/* =====================================================================
   МОДЕЛЬ: котировки 7 БК → лучший кэф и консенсус без маржи → валуй (EV)
   ===================================================================== */
const BIAS = {fonbet:.012, pari:.006, winline:.004, olimp:0, liga:-.004, betcity:-.008, betboom:-.012};
function rnd(seed){ const x = Math.sin(seed * 9301 + 49297) * 233280; return x - Math.floor(x); }
function oddsOne(base, seed){ return Math.max(1.01, Math.round(base * 100) / 100); }
function genOdds(ev){
  const out = {};
  BK.forEach((b, bi) => {
    out[b.id] = ev.base.map((o, i) => {
      const noise = (rnd(ev.id * 31 + bi * 7 + i * 13) - .5) * .034;
      return Math.max(1.01, Math.round(o * (1 + BIAS[b.id] + noise) * 100) / 100);
    });
  });
  return out;
}
function genOddsLine(base, seed){ // 7 цен на один рынок
  return BK.map((b, bi) => Math.max(1.01, Math.round(base * (1 + BIAS[b.id] + (rnd(seed + bi * 7) - .5) * .034) * 100) / 100));
}
const VAL_TOP = .05;                                   // порог «Топ по валую»
function strength(v){ return v >= .10 ? 'strong' : v >= .05 ? 'mid' : v >= .02 ? 'weak' : 'none'; }
function analyze(ev){
  if (ev._a) return ev._a;
  const n = ev.way, odds = ev.odds || genOdds(ev);
  const bks = BK.map(b => ({...b, o: odds[b.id]}));
  const best = [], avg = [];
  for (let i = 0; i < n; i++){
    let bb = bks[0]; bks.forEach(b => { if (b.o[i] > bb.o[i]) bb = b; });
    best.push({o: bb.o[i], bk: bb});
    avg.push(bks.reduce((s, b) => s + b.o[i], 0) / bks.length);
  }
  const imp = avg.map(x => 1 / x), s = imp.reduce((x, y) => x + y, 0);
  const mkt = imp.map(v => v / s);                             // рыночная вероятность без маржи
  const fair = ev.p.map(p => 1 / p);                            // наш справедливый кэф
  const val = ev.p.map((p, i) => p * best[i].o - 1);            // валуй при лучшем кэфе
  let pick = 0; val.forEach((v, i) => { if (v > val[pick]) pick = i; });
  const mktR = Math.round(mkt[pick] * 1000) / 10, pR = Math.round(ev.p[pick] * 1000) / 10;
  const diff = Math.round((pR - mktR) * 10) / 10;
  const wsum = ev.factors.reduce((x, f) => x + f.w, 0);
  const k = wsum > 0 ? diff / wsum : 0;
  const factors = ev.factors.map(f => ({t: f.t, pp: Math.round(f.w * k * 10) / 10}));
  const resid = Math.round((diff - factors.reduce((x, f) => x + f.pp, 0)) * 10) / 10;
  if (resid && factors.length){ let m = 0; factors.forEach((f, i) => { if (Math.abs(f.pp) > Math.abs(factors[m].pp)) m = i; }); factors[m].pp = Math.round((factors[m].pp + resid) * 10) / 10; }
  const labels = n === 3 ? ['П1', 'X', 'П2'] : ['П1', 'П2'];
  const subs = n === 3 ? [ev.t1.s, 'ничья', ev.t2.s] : [ev.t1.s, ev.t2.s];
  const h = ev.hist ? ev.hist.slice(0, -1) : [Math.round(best[pick].o * 98) / 100]; h.push(best[pick].o);
  ev._a = {n, bks, best, avg, mkt, mktR, pR, diff, val, fair, pick, factors, labels, subs, hist: h, strength: strength(val[pick]), src: ev.src || SRC_DEFAULT[ev.sport]};
  return ev._a;
}
function offersFor(ev, a, i){
  const list = a.bks.map(b => ({bk: b, o: b.o[i], ev: ev.p[i] * b.o[i] - 1})).sort((x, y) => y.o - x.o);
  const max = list[0].o, min = list[list.length - 1].o;
  return {list, min, max, cost: (max - min) / min};
}
const topVal = e => analyze(e).val[analyze(e).pick];
const pickName = (ev, a) => a.n === 3 && a.pick === 1 ? 'ничья' : (a.pick === 0 ? ev.t1.n : ev.t2.n);

/* =====================================================================
   ФОРМАТ
   ===================================================================== */
const fO = v => v.toFixed(2).replace('.', ',');
const fPct = v => Math.round(v * 100) + '%';
const fPct1 = v => v.toFixed(1).replace('.', ',') + '%';
const fPP = v => (v > 0 ? '+' : v < 0 ? '−' : '') + Math.abs(v).toFixed(1).replace('.', ',');
const fEV = v => (v > 0 ? '+' : v < 0 ? '−' : '') + Math.abs(Math.round(v * 100)) + '%';
const fRub = v => (v < 0 ? '−' : '') + Math.abs(Math.round(v)).toLocaleString('ru-RU') + ' ₽';
const fNum = (v, f) => (f === 0 ? Math.round(v).toString() : v.toFixed(f == null ? 1 : f)).replace('.', ',');
const DAYS = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
const MONTHS = ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
function parse(dt){ const [d, t] = dt.split('T'); const [y, m, dd] = d.split('-').map(Number); const [hh, mm] = t.split(':').map(Number); return new Date(y, m - 1, dd, hh, mm); }
function dayDiff(d){ return Math.round((new Date(d.getFullYear(), d.getMonth(), d.getDate()) - new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate())) / 864e5); }
function dayLabel(d){ const k = dayDiff(d); return k === 0 ? 'Сегодня' : k === 1 ? 'Завтра' : DAYS[d.getDay()]; }
function fullDate(d){ return DAYS[d.getDay()].toLowerCase() + ', ' + d.getDate() + ' ' + MONTHS[d.getMonth()]; }
function shortDate(d){ return d.getDate() + ' ' + MONTHS[d.getMonth()]; }
function timeStr(d){ return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'); }
function plural(n, f){ const a = Math.abs(n) % 100, b = a % 10; return n + ' ' + (a > 10 && a < 20 ? f[2] : b > 1 && b < 5 ? f[1] : b === 1 ? f[0] : f[2]); }
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

/* =====================================================================
   ДЕТАЛИ СОБЫТИЯ: ручные данные (ev.detail) + генератор для остальных
   ===================================================================== */
const MARKET_TPL = { // дополнительные рынки; стандартные ставки — в stdLine()
  football:[['Обе забьют — да',1.75],['Обе забьют — нет',2.05],['Угловые ТБ 9,5',1.85],['Жёлтые карточки ТБ 4,5',1.80],['ИТБ1 1,5',1.90],['Гол в 1-м тайме — да',1.35]],
  hockey:[['Обе забьют — да',1.30],['ИТБ1 2,5',1.80],['ИТБ2 2,5',1.95],['Тотал 1-го периода Б 1,5',1.90],['Гол в большинстве — да',1.40]],
  tennis:[['Победа в 1-м сете — П1',1.60],['Будет 3-й сет — да',2.40],['Тай-брейк в матче — да',2.20],['ИТБ1 по геймам 11,5',1.85]],
  basketball:[['Победа в 1-й четверти — П1',1.95],['ИТБ1 84,5',1.90],['ИТБ2 80,5',1.90],['Тотал 1-й половины Б 81,5',1.90]],
  esports:[['Победа на 1-й карте — П1',1.75],['Победа на 2-й карте — П1',1.80],['Первая кровь на 1-й карте — П1',1.85]],
  mma:[['Победа досрочно — П1',2.30],['Победа решением — П1',2.80],['Победа досрочно — П2',3.60],['Бой пройдёт всю дистанцию — да',1.75]],
  volleyball:[['Победа в 1-м сете — П1',1.30],['Тотал очков в 1-м сете Б 45,5',1.85],['ИТБ1 по очкам 75,5',1.85]]
};
const STAT_TPL = {
  football:[['xG за матч',1.0,2.2,1],['xGA за матч',0.8,1.8,1,1],['Удары в створ',3.5,6.5,1],['Владение, %',44,62,0],['Угловые за матч',4,7,1],['Жёлтые за матч',1.5,3,1,1]],
  hockey:[['Голы за матч',2.3,3.8,1],['Пропущено за матч',2.0,3.5,1,1],['Броски в створ',26,36,0],['Реализация большинства, %',14,28,0],['Отражённые броски, %',89,93.5,1],['Штраф, мин',6,12,0,1]],
  tennis:[['Очки на 1-й подаче, %',68,80,0],['Очки на 2-й подаче, %',46,58,0],['Эйсы за матч',3,11,1],['Двойные за матч',1.5,4.5,1,1],['Реализация брейк-пойнтов, %',35,50,0],['Геймы на приёме, %',18,32,0]],
  basketball:[['Очки за матч',74,92,1],['Пропущено',72,90,1,1],['Рейтинг атаки',98,114,1],['Рейтинг защиты',96,112,1,1],['Подборы',32,42,1],['Процент с игры',42,50,1]],
  esports:[['Винрейт карт за 3 месяца, %',45,68,0],['Средний рейтинг игроков',1.0,1.18,2],['Пистолетные раунды, %',40,62,0],['Первые убийства, %',46,56,0]],
  mma:[['Точные удары в минуту',3.0,6.0,1],['Точность ударов, %',42,58,0],['Тейкдауны за бой',0.5,4.5,1],['Защита от тейкдаунов, %',50,85,0],['Досрочные победы, %',40,80,0]],
  volleyball:[['Эффективность атаки, %',44,56,0],['Блоков за сет',1.8,3.2,1],['Эйсов за сет',0.8,2.0,1],['Приём, %',48,62,0]]
};
const POOLS = {
  'РПЛ':['Зенит','Спартак','Динамо','Локомотив','Ростов','Рубин','Ахмат','Балтика','Сочи','Оренбург','Крылья Советов','Акрон','Пари НН'],
  'Лига наций УЕФА':['Испания','Хорватия','Швейцария','Австрия','Шотландия','Венгрия','Польша','Чехия'],
  'Лига чемпионов':['Арсенал','Бавария','Интер','ПСЖ','Атлетико','Боруссия Д','Ювентус','Милан'],
  'КХЛ':['СКА','Ак Барс','Трактор','Локомотив','Спартак','Северсталь','Лада','Сибирь','Нефтехимик','Куньлунь'],
  'Суперкубок Турции':['Анадолу Эфес','Галатасарай','Тюрк Телеком','Каршияка','Бурсаспор'],
  'WNBA · плей-офф':['Лас-Вегас','Нью-Йорк','Сиэтл','Атланта','Финикс','Даллас'],
  'Чемпионат Европы':['Сербия','Словения','Болгария','Турция','Нидерланды','Бельгия'],
  tennis:['Рун Х.','Фриц Т.','Тиафо Ф.','Шелтон Б.','Хуркач Х.','Баутиста-Агут Р.','Чорич Б.','Нисиока Ё.','Бублик А.','Этчеверри Т.'],
  esports:['Team Spirit','Vitality','G2','Falcons','Team Liquid','Tundra','BetBoom Team','Aurora'],
  mma:['соперник из топ-15','соперник из топ-10','ветеран дивизиона','дебютант UFC','бывший претендент']
};
const ROLES = {
  football:['Основной центральный защитник','Опорный полузащитник','Правый вингер','Второй вратарь','Капитан команды'],
  hockey:['Центр первого звена','Вратарь № 1','Защитник первой пары','Крайний нападающий второго звена'],
  basketball:['Разыгрывающий основы','Центровой','Шестой игрок'],
  esports:['Основной керри','Капитан команды','Снайпер'],
  volleyball:['Доигровщик основы','Либеро','Связующий']
};
const STATUS_W = [['травма', .4], ['под вопросом', .3], ['дисквалификация', .15], ['вернулся', .15]];
const TL_TIMES = ['22 сен, 13:40','22 сен, 09:15','21 сен, 19:30','21 сен, 11:05','20 сен, 18:10','20 сен, 10:00','19 сен, 16:20'];

function pickStatus(r){ let acc = 0; for (const [s, w] of STATUS_W){ acc += w; if (r <= acc) return s; } return 'травма'; }
function genScore(sport, win, r1, r2){
  const g = (lo, hi, r) => lo + Math.floor(r * (hi - lo + 1));
  if (sport === 'football'){ let a = g(0, 3, r1), b = g(0, 3, r2); if (win === 'W' && a <= b) a = b + 1; if (win === 'L' && b <= a) b = a + 1; if (win === 'D') b = a; return a + ':' + b; }
  if (sport === 'hockey'){ let a = g(1, 5, r1), b = g(1, 5, r2); if (win === 'W' && a <= b) a = b + 1; if (win === 'L' && b <= a) b = a + 1; if (win === 'D') b = a; return a + ':' + b; }
  if (sport === 'basketball'){ let a = g(70, 95, r1), b = g(70, 95, r2); if (win === 'W' && a <= b) a = b + g(1, 9, r2); if (win === 'L' && b <= a) b = a + g(1, 9, r1); return a + ':' + b; }
  if (sport === 'tennis' || sport === 'esports') return win === 'W' ? (r1 < .6 ? '2:0' : '2:1') : (r1 < .6 ? '0:2' : '1:2');
  if (sport === 'volleyball') return win === 'W' ? ['3:0', '3:1', '3:2'][g(0, 2, r1)] : ['0:3', '1:3', '2:3'][g(0, 2, r1)];
  if (sport === 'mma') return (win === 'W' ? 'победа' : 'поражение') + ' · ' + ['UD', 'KO/TKO R2', 'SUB R1', 'SD', 'KO/TKO R3'][g(0, 4, r1)];
  return '';
}
function genForm(ev, a, side, seed){
  const sport = ev.sport, pool = POOLS[ev.league] || POOLS[sport] || ['Соперник'];
  const own = side === 0 ? ev.t1.s : ev.t2.s;
  const pWin = Math.min(.8, Math.max(.3, (side === 0 ? ev.p[0] : ev.p[a.n - 1]) + .12));
  const dates = ['20 сен', '16 сен', '12 сен', '7 сен', '3 сен'];
  if (sport === 'mma') dates.splice(0, 5, '14 июн', '8 фев', '19 окт 2025', '15 июн 2025', '22 фев 2025');
  if (sport === 'tennis') dates.splice(0, 5, '19 сен', '17 сен', '11 сен', '9 сен', '3 сен');
  const out = [];
  for (let i = 0; i < 5; i++){
    const r = rnd(seed + i * 11), r2 = rnd(seed + i * 11 + 3), r3 = rnd(seed + i * 11 + 5);
    let res = r < pWin ? 'W' : (sport === 'football' || sport === 'hockey') && r2 < .3 ? 'D' : 'L';
    let opp = pool[Math.floor(r3 * pool.length)]; if (opp === own) opp = pool[(Math.floor(r3 * pool.length) + 1) % pool.length];
    out.push({d: dates[i], opp, h: INDIVIDUAL[sport] ? null : i % 2 === side, s: genScore(sport, res, r2, r3), r: res});
  }
  return out;
}
function genH2H(ev, a, seed){
  const out = [], ds = ['12 апр 2026', '26 окт 2025', '3 мая 2025', '15 мар 2025', '9 ноя 2024'];
  for (let i = 0; i < (INDIVIDUAL[ev.sport] ? 3 : 5); i++){
    const r = rnd(seed + i * 17), r2 = rnd(seed + i * 17 + 2);
    const homeFirst = i % 2 === 0, res = r < ev.p[0] + .05 ? 'W' : (a.n === 3 && r2 < .28 ? 'D' : 'L');
    const s = genScore(ev.sport, homeFirst ? res : (res === 'W' ? 'L' : res === 'L' ? 'W' : 'D'), r, r2);
    out.push({d: ds[i], home: homeFirst ? ev.t1.s : ev.t2.s, away: homeFirst ? ev.t2.s : ev.t1.s, s, comp: ev.league});
  }
  return out;
}
function genAbsences(ev, seed){
  if (INDIVIDUAL[ev.sport]) return {t1: [{n: 'Состояние', st: 'готов', why: 'проблем со здоровьем не заявлено'}], t2: [{n: 'Состояние', st: rnd(seed) < .5 ? 'готов' : 'под вопросом', why: rnd(seed) < .5 ? 'проблем со здоровьем не заявлено' : 'дискомфорт в плече на тренировке, по данным пресс-службы'}]};
  const roles = ROLES[ev.sport] || ROLES.football, mk = (s, off) => {
    const n = Math.floor(rnd(s) * 3); const list = [];
    for (let i = 0; i < n; i++){ const r = rnd(s + i * 7 + off); list.push({n: roles[Math.floor(rnd(s + i * 3 + off) * roles.length)], st: pickStatus(r), why: ['растяжение, 2–3 недели', 'решение в день матча', 'перебор карточек', 'после травмы, в общей группе'][Math.min(3, Math.floor(r * 4))]}); }
    return list;
  };
  return {t1: mk(seed, 1), t2: mk(seed + 101, 2)};
}
function genStats(ev, seed){
  const tpl = STAT_TPL[ev.sport] || STAT_TPL.football, bias = ev.p[0] - ev.p[ev.p.length - 1];
  return tpl.map((t, i) => {
    const [n, lo, hi, f, low] = t, w = hi - lo;
    const base = lo + w * (.35 + rnd(seed + i * 13) * .3), delta = w * .12 * bias * (low ? -1 : 1);
    return {n, a: Math.round((base + delta + (rnd(seed + i * 5) - .5) * w * .1) * 100) / 100, b: Math.round((base - delta + (rnd(seed + i * 9) - .5) * w * .1) * 100) / 100, f, low: !!low};
  });
}
function genHistory(ev, a, seed){
  const labels = ['12 сен', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22'], n = labels.length;
  const mktEnd = a.mktR, oursEnd = a.pR;
  const mktStart = Math.round((mktEnd + .5 + rnd(seed) * 2.2) * 10) / 10;
  const oursStart = Math.round((mktStart - .4 + rnd(seed + 1) * .6) * 10) / 10;
  const pos = a.factors.filter(f => f.pp > 0), tot = pos.reduce((x, f) => x + f.pp, 0) || 1;
  const steps = [3, 6, 8, 9].slice(0, Math.max(1, Math.min(4, pos.length)));
  const mkt = [], ours = [], notes = {};
  let gained = 0;
  for (let i = 0; i < n; i++){
    mkt.push(Math.round((mktStart + (mktEnd - mktStart) * i / (n - 1) + (i && i < n - 1 ? (rnd(seed + i * 3) - .5) * .4 : 0)) * 10) / 10);
    const k = steps.indexOf(i);
    if (k >= 0){ gained += pos[k].pp / tot; notes[i] = pos[k].t.length > 48 ? pos[k].t.slice(0, 46) + '…' : pos[k].t; }
    ours.push(Math.round((oursStart + (oursEnd - oursStart) * gained) * 10) / 10);
  }
  ours[n - 1] = oursEnd; mkt[n - 1] = mktEnd;
  return {labels, mkt, ours, notes};
}
function genDetail(ev, a){
  const seed = ev.id * 977;
  const tpl = MARKET_TPL[ev.sport] || MARKET_TPL.football;
  const markets = tpl.map((m, i) => {
    let base = m[1];
    if (/^Победа (в|на) \d-/.test(m[0])) base = Math.round(100 / (Math.min(.85, Math.max(.12, ev.p[0] * .9 + .05)) * 1.06)) / 100;
    m = [m[0], base];
    const imp = 1 / m[1] / 1.06;                              // вероятность без маржи
    const dev = (rnd(seed + i * 19) - .45) * .16 + (i === 0 ? .06 : 0); // отклонение нашей оценки
    return {n: m[0], p: Math.round(Math.min(.92, Math.max(.08, imp * (1 + dev))) * 100) / 100, base: m[1]};
  });
  const watch = ['Стартовые составы и заявки — за 60 минут до начала, оценка будет пересчитана автоматически',
    `Если лучший кэф на ${a.labels[a.pick]} опустится ниже ${fO(a.fair[a.pick] * 1.02)}, валуй исчезнет — уведомим подписчиков`];
  if (ev.sport === 'football') watch.push('Погода и состояние поля влияют на тоталы, а не на основной исход');
  if (ev.sport === 'hockey') watch.push('Заявка вратарей объявляется за час до матча — ключевой фактор для тотала');
  if (ev.sport === 'tennis') watch.push('Жара и влажность снижают процент первой подачи — следим за прогнозом на корте');
  return {markets, form: {t1: genForm(ev, a, 0, seed + 5), t2: genForm(ev, a, 1, seed + 55)}, h2h: genH2H(ev, a, seed + 7), absences: genAbsences(ev, seed + 9), stats: genStats(ev, seed + 11), history: genHistory(ev, a, seed + 13), watch, weather: ev.sport === 'football' ? '+' + (12 + Math.floor(rnd(seed) * 14)) + ' °C, ' + (rnd(seed + 2) < .5 ? 'переменная облачность' : 'ясно') : null};
}
function getDetail(ev){
  if (ev._d) return ev._d;
  const a = analyze(ev);
  const d = Object.assign(genDetail(ev, a), ev.detail || {});
  d.markets = d.markets.map((m, i) => {
    const odds = genOddsLine(m.base, ev.id * 101 + i * 17);
    const list = BK.map((b, bi) => ({bk: b, o: odds[bi]})).sort((x, y) => y.o - x.o);
    const best = list[0], val = m.p * best.o - 1;
    return {...m, list, best, fair: 1 / m.p, val, strength: strength(val)};
  }).sort((x, y) => y.val - x.val);
  d.timeline = d.timeline
    ? d.timeline.map(t => ({...t, text: t.text || a.factors[t.f].t, dp: t.dp != null ? t.dp : a.factors[t.f].pp}))
    : a.factors.map((f, i) => ({ts: TL_TIMES[i % TL_TIMES.length], src: a.src[i % a.src.length], text: f.t, dp: f.pp}));
  ev._d = d;
  return d;
}

/* =====================================================================
   СТАНДАРТНЫЕ СТАВКИ, как в линии Фонбета: исходы, двойные шансы, форы,
   тоталы, итоговая победа. Наши вероятности и рыночные считаются одной
   моделью, поэтому все рынки согласованы с оценкой исхода 1/X/2.
   ===================================================================== */
const normCdf = x => { const t = 1 / (1 + .2316419 * Math.abs(x)), dd = .3989423 * Math.exp(-x * x / 2); const q = dd * t * (.3193815 + t * (-.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274)))); return x > 0 ? 1 - q : q; };
const bisect = (f, target, lo = 0, hi = 1) => { for (let i = 0; i < 60; i++){ const m = (lo + hi) / 2; if (f(m) < target) lo = m; else hi = m; } return (lo + hi) / 2; };
const normInv = p => bisect(normCdf, p, -6, 6);
const fLine = h => (h > 0 ? '+' : h < 0 ? '−' : '') + fNum(Math.abs(h));
function poisArr(l, n){ const r = [Math.exp(-l)]; for (let i = 1; i <= n; i++) r.push(r[i - 1] * l / i); return r; }
function poisCdf(l, k){ return poisArr(l, k).reduce((x, y) => x + y, 0); }
// разница голов по Пуассону, перевзвешенная под вероятности 1/X/2
function goalDiff(p1, px, p2, T){
  let best = null;
  for (let s = .12; s <= .88; s += .004){
    const a1 = poisArr(T * s, 14), a2 = poisArr(T * (1 - s), 14), d = {};
    for (let i = 0; i <= 14; i++) for (let j = 0; j <= 14; j++) d[i - j] = (d[i - j] || 0) + a1[i] * a2[j];
    let w = 0, l = 0; for (const k in d){ if (+k > 0) w += d[k]; else if (+k < 0) l += d[k]; }
    const err = Math.abs((w - l) - (p1 - p2));
    if (!best || err < best.err) best = {err, d, w, l};
  }
  const out = {}; for (const k in best.d){ const kk = +k; out[kk] = best.d[k] * (kk > 0 ? p1 / best.w : kk < 0 ? p2 / best.l : px / best.d[0]); }
  return out;
}
function bkLine(pm, seed, margin){
  return BK.map((b, bi) => Math.max(1.01, Math.round(1 / (pm * (1 + margin)) * (1 + BIAS[b.id] + (rnd(seed + bi * 7) - .5) * .03) * 100) / 100));
}
function stdLine(ev){
  if (ev._s) return ev._s;
  const a = analyze(ev), seed = ev.id * 613, p = ev.p, pm = a.mkt, sp = ev.sport, T1 = ev.t1.s, T2 = ev.t2.s;
  const groups = [], col = (lbl, line, pO, pM, name, extra) => Object.assign({lbl, line, p: pO, pm: pM, name}, extra || {});
  const tv = rnd(seed) - .5, tv2 = rnd(seed + 1) - .5;
  const hcCols = (unit, h1, c1o, c1m) => [col('Фора 1', fLine(h1), c1o, c1m, `Фора 1 (${fLine(h1)})${unit} · ${T1}`), col('Фора 2', fLine(-h1), 1 - c1o, 1 - c1m, `Фора 2 (${fLine(-h1)})${unit} · ${T2}`)];
  const totCols = (unit, tl, po, pmo) => [col('Б', fNum(tl), po, pmo, `ТБ ${fNum(tl)}${unit}`), col('М', fNum(tl), 1 - po, 1 - pmo, `ТМ ${fNum(tl)}${unit}`)];
  groups.push({name: 'Исходы', cols: a.n === 3
    ? [col('1', '', p[0], pm[0], `П1 · ${T1}`, {res: 0}), col('X', '', p[1], pm[1], 'X · ничья', {res: 1}), col('2', '', p[2], pm[2], `П2 · ${T2}`, {res: 2})]
    : [col('1', '', p[0], pm[0], `П1 · ${T1}`, {res: 0}), col('2', '', p[1], pm[1], `П2 · ${T2}`, {res: 1})]});
  if (a.n === 3) groups.push({name: 'Двойные шансы', margin: .025, cols: [
    col('1X', '', p[0] + p[1], pm[0] + pm[1], `1X · ${T1} или ничья`), col('12', '', p[0] + p[2], pm[0] + pm[2], '12 · без ничьей'), col('X2', '', p[1] + p[2], pm[1] + pm[2], `X2 · ничья или ${T2}`)]});
  if (sp === 'football' || sp === 'hockey'){
    const base = sp === 'football' ? 2.55 : 5.3;
    const Tm = ev.tot ? ev.tot[1] : base * (1 + tv * .16), To = ev.tot ? ev.tot[0] : Tm * (1 + tv2 * .08);
    const dO = goalDiff(p[0], p[1], p[2], To), dM = goalDiff(pm[0], pm[1], pm[2], Tm);
    const h1 = pm[0] >= pm[2] ? -1.5 : 1.5, hc = (dd, h) => { let s = 0; for (const k in dd) if (+k + h > 0) s += dd[k]; return s; };
    groups.push({name: 'Форы', cols: hcCols('', h1, hc(dO, h1), hc(dM, h1))});
    const tl = sp === 'football' ? (Tm > 3.05 ? 3.5 : 2.5) : (Tm < 4.9 ? 4.5 : 5.5);
    groups.push({name: 'Тоталы', cols: totCols('', tl, 1 - poisCdf(To, Math.floor(tl)), 1 - poisCdf(Tm, Math.floor(tl)))});
    if (sp === 'hockey'){
      const ot = (x1, x0, x2) => { const q = .5 + (x1 / (x1 + x2) - .5) * .6; return [x1 + x0 * q, x2 + x0 * (1 - q)]; };
      const o = ot(p[0], p[1], p[2]), m = ot(pm[0], pm[1], pm[2]);
      groups.push({name: 'Итоговая победа', cols: [col('1', '', o[0], m[0], `Итоговая победа · ${T1}`), col('2', '', o[1], m[1], `Итоговая победа · ${T2}`)]});
    }
  } else if (sp === 'basketball' || sp === 'tennis'){
    const tn = sp === 'tennis', sd = tn ? 5.5 : 12, unit = tn ? ' по геймам' : '';
    const muO = sd * normInv(p[0]), muM = sd * normInv(pm[0]);
    const h1 = -(Math.round(Math.abs(muM) - .5) + .5) * (muM < 0 ? -1 : 1), hcN = (mu, h) => 1 - normCdf((-h - mu) / sd);
    groups.push({name: tn ? 'Форы по геймам' : 'Форы', cols: hcCols(unit, h1, hcN(muO, h1), hcN(muM, h1))});
    const baseT = tn ? 22.2 : (/WNBA/.test(ev.league) ? 164 : 158), tsd = tn ? 3.4 : 15;
    const Tm = baseT * (1 + tv * (tn ? .06 : .04)), To = Tm * (1 + tv2 * (tn ? .05 : .03)), tl = Math.round(Tm - .5) + .5;
    groups.push({name: tn ? 'Тоталы геймов' : 'Тоталы', cols: totCols(tn ? ' геймов' : '', tl, 1 - normCdf((tl - To) / tsd), 1 - normCdf((tl - Tm) / tsd))});
  } else if (sp === 'esports'){
    const f = q => q * q * (3 - 2 * q), qO = bisect(f, p[0]), qM = bisect(f, pm[0]), fav = pm[0] >= pm[1];
    const c1 = q => fav ? q * q : 1 - (1 - q) * (1 - q);       // Фора 1 (−1,5) = 2:0, (+1,5) = хотя бы одна карта
    groups.push({name: 'Форы по картам', cols: hcCols(' по картам', fav ? -1.5 : 1.5, c1(qO), c1(qM))});
    const t3 = q => 2 * q * (1 - q);
    groups.push({name: 'Тоталы карт', cols: totCols(' карт', 2.5, t3(qO), t3(qM))});
  } else if (sp === 'volleyball'){
    const f = s => s * s * s * (1 + 3 * (1 - s) + 6 * (1 - s) * (1 - s)), sO = bisect(f, p[0]), sM = bisect(f, pm[0]), fav = pm[0] >= pm[1];
    const w31 = s => s * s * s * (1 + 3 * (1 - s)), c1 = s => fav ? w31(s) : 1 - w31(1 - s);
    groups.push({name: 'Форы по сетам', cols: hcCols(' по сетам', fav ? -1.5 : 1.5, c1(sO), c1(sM))});
    const o35 = s => 1 - s * s * s - (1 - s) * (1 - s) * (1 - s);
    groups.push({name: 'Тоталы сетов', cols: totCols(' сетов', 3.5, o35(sO), o35(sM))});
  } else if (sp === 'mma'){
    const tl = /5 раунд/.test(ev.sub) ? 3.5 : 2.5, pmo = .44 + rnd(seed + 3) * .16, po = Math.min(.85, Math.max(.15, pmo + tv2 * .12));
    groups.push({name: 'Тоталы раундов', cols: totCols(' раундов', tl, po, pmo)});
  }
  let id = 0;
  groups.forEach(g => g.cols.forEach(c => {
    c.id = id++;
    c.odds = c.res != null ? a.bks.map(b => b.o[c.res]) : bkLine(c.pm, seed + c.id * 37, g.margin || .035);
    let bi = 0; c.odds.forEach((o, i) => { if (o > c.odds[bi]) bi = i; });
    c.best = {o: c.odds[bi], bk: BK[bi], bi}; c.fair = 1 / c.p; c.val = c.p * c.best.o - 1;
  }));
  ev._s = {groups, cols: groups.flatMap(g => g.cols)};
  return ev._s;
}
