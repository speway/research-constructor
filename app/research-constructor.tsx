"use client";

import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  ClipboardCheck,
  Copy,
  Download,
  FileJson,
  FileText,
  FlaskConical,
  HeartHandshake,
  Info,
  Layers3,
  LayoutDashboard,
  LibraryBig,
  ListChecks,
  Menu,
  Microscope,
  Network,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  Trash2,
  Upload,
  Users,
  X,
} from "lucide-react";
import { ChangeEvent, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { analysisGuide, branchRequirements, experimentNorms, experimentThreats, glossary, methodBank, reportingStandards, researchPathways, statDecisionStages } from "./research-data";
import type { MethodInfo } from "./research-data";
import { clearProjectStorage, LEGACY_STORAGE_KEY, STORAGE_KEY } from "./storage";

type StepId = "overview" | "logic" | "evidence" | "variables" | "design" | "sample" | "methods" | "protocol" | "analysis" | "ethics" | "report" | "audit";
type Hypothesis = { id: string; text: string; type: "directional" | "non-directional" | "null" };
type MethodItem = MethodInfo;
type KnowledgeTab = "terms" | "standards" | "methods" | "branch" | "experiment";
type VariableItem = { id: string; name: string; role: "predictor" | "outcome" | "mediator" | "moderator" | "covariate"; definition: string; indicator: string; scale: "nominal" | "ordinal" | "quantitative"; instrument: string };
type Project = {
  title: string;
  level: string;
  pathway: string;
  field: string;
  supervisor: string;
  deadline: string;
  topic: string;
  problem: string;
  relevance: string;
  aim: string;
  object: string;
  subject: string;
  question: string;
  tasks: string[];
  hypotheses: Hypothesis[];
  theory: string;
  keywords: string;
  databases: string[];
  searchQuery: string;
  literatureCriteria: string;
  evidenceGap: string;
  variables: VariableItem[];
  confounds: string;
  design: string;
  time: string;
  setting: string;
  designRationale: string;
  manipulation: string;
  assignmentPlan: string;
  blindingPlan: string;
  manipulationCheck: string;
  artifactPlan: string;
  experimentControls: string[];
  population: string;
  inclusion: string;
  exclusion: string;
  sampleSize: number;
  sampleEffect: string;
  samplePower: number;
  samplingMethod: string;
  attrition: number;
  recruitment: string;
  methods: MethodItem[];
  procedure: string;
  pilotPlan: string;
  stoppingRule: string;
  preregistrationChecks: string[];
  analysis: string;
  comparisonStructure: string;
  groupCount: string;
  normalityAssessment: string;
  varianceAssessment: string;
  primaryOutcome: string;
  secondaryOutcomes: string;
  effectMeasure: string;
  assumptionPlan: string;
  correctionPlan: string;
  missingData: string;
  alpha: string;
  ethicsChecks: string[];
  risk: string;
  storage: string;
  dataTypes: string;
  retentionPeriod: string;
  accessRoles: string;
  deletionPlan: string;
  incidentPlan: string;
  withdrawal: string;
  consent: string;
  reportingStandard: string;
  limitations: string;
  dissemination: string;
};

const defaultProject: Project = {
  title: "Новое исследование",
  level: "Курсовая работа",
  pathway: "quantitative",
  field: "Социальная психология",
  supervisor: "",
  deadline: "",
  topic: "",
  problem: "",
  relevance: "",
  aim: "",
  object: "",
  subject: "",
  question: "",
  tasks: ["Проанализировать теоретические подходы и эмпирические данные", "Уточнить содержание ключевых психологических понятий", "Операционализировать ключевые переменные", "Разработать программу и процедуру эмпирической проверки", "Проверить сформулированные гипотезы и интерпретировать результаты"],
  hypotheses: [{ id: "h1", text: "", type: "directional" }],
  theory: "",
  keywords: "",
  databases: ["Google Scholar"],
  searchQuery: "",
  literatureCriteria: "",
  evidenceGap: "",
  variables: [
    { id: "v1", name: "", role: "predictor", definition: "", indicator: "", scale: "quantitative", instrument: "" },
    { id: "v2", name: "", role: "outcome", definition: "", indicator: "", scale: "quantitative", instrument: "" },
  ],
  confounds: "",
  design: "correlational",
  time: "cross-sectional",
  setting: "online",
  designRationale: "",
  manipulation: "",
  assignmentPlan: "",
  blindingPlan: "",
  manipulationCheck: "",
  artifactPlan: "",
  experimentControls: [],
  population: "",
  inclusion: "",
  exclusion: "",
  sampleSize: 120,
  sampleEffect: "medium",
  samplePower: 0.8,
  samplingMethod: "convenience",
  attrition: 15,
  recruitment: "",
  methods: [],
  procedure: "",
  pilotPlan: "",
  stoppingRule: "Сбор завершается после достижения запланированного числа завершённых наблюдений; промежуточный просмотр основных эффектов не проводится.",
  preregistrationChecks: [],
  analysis: "",
  comparisonStructure: "independent",
  groupCount: "2",
  normalityAssessment: "Оценивать графики, форму распределения остатков и влиятельные наблюдения; не принимать решение только по тесту Шапиро—Уилка.",
  varianceAssessment: "Для независимых групп оценить неоднородность дисперсий и по умолчанию рассматривать тест Уэлча; для повторных измерений учитывать зависимость и сферичность либо использовать смешанную модель.",
  primaryOutcome: "",
  secondaryOutcomes: "",
  effectMeasure: "",
  assumptionPlan: "Проверить выбросы, форму распределения, линейность и гомоскедастичность; при нарушениях использовать заранее выбранный робастный вариант.",
  correctionPlan: "Главная гипотеза проверяется как первичная; для семейства вторичных тестов применяется коррекция Холма.",
  missingData: "Исключить анкеты с пропусками более 20%; для остальных — описать долю пропусков и выбранный способ обработки.",
  alpha: "0,05",
  ethicsChecks: [],
  risk: "",
  storage: "Обезличенные данные хранятся в зашифрованном хранилище; таблица соответствия кодов не создаётся.",
  dataTypes: "Ответы по методикам, возрастная категория и необходимые для гипотезы демографические признаки. ФИО, телефон, e-mail и аккаунты не собираются.",
  retentionPeriod: "До защиты и завершения возможной проверки результатов, затем безопасное удаление в срок, согласованный с научным руководителем и организацией.",
  accessRoles: "Только исследователь и научный руководитель; доступ выдаётся персонально и не передаётся третьим лицам.",
  deletionPlan: "Рабочие копии, корзина и резервные копии удаляются по журналу; после удаления проверяется отсутствие файлов во всех согласованных местах хранения.",
  incidentPlan: "При ошибочной публикации или утрате контроля над данными: прекратить доступ, сообщить руководителю и ответственному подразделению, задокументировать инцидент и оценить риск для участников.",
  withdrawal: "Участник может прекратить заполнение без объяснения причин до отправки формы.",
  consent: "",
  reportingStandard: "jars-quant",
  limitations: "",
  dissemination: "Результаты будут представлены в учебной работе и на защите в обобщённом виде без идентификации участников.",
};

const freshProject = () => JSON.parse(JSON.stringify(defaultProject)) as Project;

function sanitizeProject(value: unknown): Project {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Некорректная структура проекта");
  const incoming = value as Record<string, unknown>;
  const safe = freshProject() as unknown as Record<string, unknown>;
  for (const key of Object.keys(defaultProject)) {
    const candidate = incoming[key];
    const expected = safe[key];
    if (typeof candidate === typeof expected && !Array.isArray(expected)) safe[key] = candidate;
    if (Array.isArray(expected) && Array.isArray(candidate)) safe[key] = candidate;
  }
  safe.tasks = (safe.tasks as unknown[]).filter((item): item is string => typeof item === "string").slice(0, 30);
  safe.databases = (safe.databases as unknown[]).filter((item): item is string => typeof item === "string").slice(0, 20);
  safe.ethicsChecks = (safe.ethicsChecks as unknown[]).filter((item): item is string => typeof item === "string").slice(0, 30);
  safe.preregistrationChecks = (safe.preregistrationChecks as unknown[]).filter((item): item is string => typeof item === "string").slice(0, 30);
  safe.experimentControls = (safe.experimentControls as unknown[]).filter((item): item is string => typeof item === "string").slice(0, experimentThreats.length);
  const text = (item: unknown, fallback = "") => typeof item === "string" ? item.slice(0, 20_000) : fallback;
  const records = (item: unknown) => Array.isArray(item) ? item.filter((entry): entry is Record<string, unknown> => Boolean(entry) && typeof entry === "object" && !Array.isArray(entry)) : [];
  safe.hypotheses = records(safe.hypotheses).slice(0, 30).map((item) => ({
    id: text(item.id, uid()), text: text(item.text), type: ["directional", "non-directional", "null"].includes(text(item.type)) ? text(item.type) : "directional",
  }));
  safe.variables = records(safe.variables).slice(0, 40).map((item) => ({
    id: text(item.id, uid()), name: text(item.name), role: ["predictor", "outcome", "mediator", "moderator", "covariate"].includes(text(item.role)) ? text(item.role) : "covariate",
    definition: text(item.definition), indicator: text(item.indicator), scale: ["nominal", "ordinal", "quantitative"].includes(text(item.scale)) ? text(item.scale) : "quantitative", instrument: text(item.instrument),
  }));
  safe.methods = records(safe.methods).slice(0, 40).map((item) => ({
    id: text(item.id, uid()), name: text(item.name, "Без названия"), minutes: typeof item.minutes === "number" && Number.isFinite(item.minutes) ? Math.min(180, Math.max(0, item.minutes)) : 0,
    role: text(item.role, "Не указано"), source: text(item.source, "Источник не указан"), category: text(item.category, "Импорт"), items: text(item.items, "Уточнить"),
    fit: text(item.fit, "Требуется проверка"), caution: text(item.caution, "Проверить адаптацию, качество и условия использования."),
    url: /^https:\/\//i.test(text(item.url)) ? text(item.url) : "https://istina.msu.ru/",
  }));
  if (!(safe.hypotheses as unknown[]).length) safe.hypotheses = freshProject().hypotheses;
  if (!(safe.variables as unknown[]).length) safe.variables = freshProject().variables;
  return safe as unknown as Project;
}

const steps: { id: StepId; label: string; short: string; icon: typeof Target }[] = [
  { id: "overview", label: "Паспорт проекта", short: "Старт", icon: LayoutDashboard },
  { id: "logic", label: "Логика исследования", short: "Логика", icon: Target },
  { id: "evidence", label: "Литература и пробел", short: "Литература", icon: Search },
  { id: "variables", label: "Переменные и модель", short: "Модель", icon: Network },
  { id: "design", label: "Дизайн", short: "Дизайн", icon: FlaskConical },
  { id: "sample", label: "Выборка", short: "Выборка", icon: Users },
  { id: "methods", label: "Методы", short: "Методы", icon: BookOpen },
  { id: "protocol", label: "Протокол и процедура", short: "Протокол", icon: ListChecks },
  { id: "analysis", label: "План анализа", short: "Анализ", icon: Microscope },
  { id: "ethics", label: "Этика и данные", short: "Этика", icon: HeartHandshake },
  { id: "report", label: "Отчёт и защита", short: "Отчёт", icon: FileText },
  { id: "audit", label: "Аудит готовности", short: "Аудит", icon: ClipboardCheck },
];

const ethicsItems = [
  "Добровольное информированное согласие",
  "Понятное описание процедуры и длительности",
  "Право отказаться без негативных последствий",
  "Контакты исследователя и научного руководителя",
  "Минимизация риска и протокол помощи",
  "Обезличивание и ограничение доступа",
  "Срок хранения и порядок уничтожения данных",
  "Разрешение правообладателей методик проверено",
];


const uid = () => Math.random().toString(36).slice(2, 9);
const filled = (value: string) => value.trim().length >= 8;

function suggestedSample(effect: string, power: number, design: string) {
  const base = effect === "small" ? 390 : effect === "large" ? 44 : 128;
  const powerFactor = power >= 0.9 ? 1.32 : 1;
  const designFactor = design === "experimental" ? 1.05 : design === "qualitative" ? 0.18 : 1;
  return Math.max(12, Math.ceil((base * powerFactor * designFactor) / 10) * 10);
}

function Field({ label, hint, children, wide = false }: { label: string; hint?: string; children: ReactNode; wide?: boolean }) {
  return (
    <label className={`field ${wide ? "field--wide" : ""}`}>
      <span className="field__label">{label}</span>
      {children}
      {hint && <span className="field__hint">{hint}</span>}
    </label>
  );
}

function SectionHead({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return (
    <div className="section-head">
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      <p>{text}</p>
    </div>
  );
}

function Tip({ children }: { children: ReactNode }) {
  return <div className="tip"><Info size={18} aria-hidden="true" /><p>{children}</p></div>;
}

export default function ResearchConstructor() {
  const [project, setProject] = useState<Project>(defaultProject);
  const [active, setActive] = useState<StepId>("overview");
  const [hydrated, setHydrated] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [methodSearch, setMethodSearch] = useState("");
  const [methodCategory, setMethodCategory] = useState("Все");
  const [knowledgeOpen, setKnowledgeOpen] = useState(false);
  const [knowledgeSearch, setKnowledgeSearch] = useState("");
  const [knowledgeTab, setKnowledgeTab] = useState<KnowledgeTab>("terms");
  const [toast, setToast] = useState("");
  const importRef = useRef<HTMLInputElement>(null);
  const suppressNextSaveRef = useRef(false);

  useEffect(() => {
    queueMicrotask(() => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY) ?? localStorage.getItem(LEGACY_STORAGE_KEY);
        if (saved) setProject(sanitizeProject(JSON.parse(saved)));
      } catch { /* keep a clean project if browser data is damaged */ }
      setHydrated(true);
    });
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (suppressNextSaveRef.current) {
      suppressNextSaveRef.current = false;
      return;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
  }, [project, hydrated]);

  const update = <K extends keyof Project>(key: K, value: Project[K]) => setProject((current) => ({ ...current, [key]: value }));
  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2400);
  };
  const methodMinutes = project.methods.reduce((sum, method) => sum + method.minutes, 0);

  const audit = useMemo(() => [
    { label: "Тема конкретна и ограничена", ok: filled(project.topic), step: "logic" as StepId, group: "Логика" },
    { label: "Проблема описана как пробел или противоречие", ok: filled(project.problem), step: "logic" as StepId, group: "Логика" },
    { label: "Практическая или теоретическая актуальность объяснена", ok: filled(project.relevance), step: "logic" as StepId, group: "Логика" },
    { label: "Цель отвечает на исследовательский вопрос", ok: filled(project.aim) && filled(project.question), step: "logic" as StepId, group: "Логика" },
    { label: "Объект и предмет различены", ok: filled(project.object) && filled(project.subject) && project.object.trim().toLowerCase() !== project.subject.trim().toLowerCase(), step: "logic" as StepId, group: "Логика" },
    { label: "Задачи описывают путь к цели", ok: project.tasks.filter(filled).length >= 3, step: "logic" as StepId, group: "Логика" },
    { label: "Есть проверяемая гипотеза или обоснованный открытый вопрос", ok: project.pathway === "qualitative" ? filled(project.question) : project.hypotheses.some((item) => filled(item.text)), step: "logic" as StepId, group: "Логика" },
    { label: "Поиск литературы можно воспроизвести", ok: filled(project.searchQuery) && project.databases.length >= 2, step: "evidence" as StepId, group: "Основания" },
    { label: "Сформулирован конкретный пробел в знаниях", ok: filled(project.evidenceGap), step: "evidence" as StepId, group: "Основания" },
    { label: "Ключевые конструкты определены теоретически", ok: filled(project.theory), step: "evidence" as StepId, group: "Основания" },
    { label: "Предиктор и исход операционализированы", ok: project.variables.some((v) => v.role === "predictor" && filled(v.name) && filled(v.indicator)) && project.variables.some((v) => v.role === "outcome" && filled(v.name) && filled(v.indicator)), step: "variables" as StepId, group: "Модель" },
    { label: "Для переменных указаны шкалы и инструменты", ok: project.variables.filter((v) => filled(v.name)).every((v) => filled(v.instrument) && Boolean(v.scale)), step: "variables" as StepId, group: "Модель" },
    { label: "Альтернативные объяснения перечислены", ok: filled(project.confounds), step: "variables" as StepId, group: "Модель" },
    { label: "Дизайн обоснован через вопрос, а не удобство", ok: filled(project.designRationale), step: "design" as StepId, group: "Дизайн" },
    { label: "Время и условия сбора данных заданы", ok: Boolean(project.time && project.setting), step: "design" as StepId, group: "Дизайн" },
    { label: "Для воздействия определены манипуляция и распределение", ok: !["experimental", "quasi"].includes(project.design) || (filled(project.manipulation) && filled(project.assignmentPlan)), step: "design" as StepId, group: "Эксперимент" },
    { label: "Угрозы валидности разобраны и контролируются", ok: !["experimental", "quasi"].includes(project.design) || (project.experimentControls.length >= 4 && filled(project.artifactPlan)), step: "design" as StepId, group: "Эксперимент" },
    { label: "Границы генеральной совокупности заданы", ok: filled(project.population), step: "sample" as StepId, group: "Выборка" },
    { label: "Критерии включения и исключения описаны", ok: filled(project.inclusion) && filled(project.exclusion), step: "sample" as StepId, group: "Выборка" },
    { label: "Объём, способ набора и запас на отсев заданы", ok: project.sampleSize >= 12 && filled(project.recruitment) && project.attrition >= 0, step: "sample" as StepId, group: "Выборка" },
    { label: "Методы соответствуют операционализациям", ok: project.methods.length > 0 && project.variables.some((v) => filled(v.instrument)), step: "methods" as StepId, group: "Измерение" },
    { label: "Нагрузка участника остаётся приемлемой", ok: methodMinutes > 0 && methodMinutes <= 35, step: "methods" as StepId, group: "Измерение" },
    { label: "Процедура описана по шагам", ok: filled(project.procedure), step: "protocol" as StepId, group: "Протокол" },
    { label: "Есть пилот и правило завершения сбора", ok: filled(project.pilotPlan) && filled(project.stoppingRule), step: "protocol" as StepId, group: "Протокол" },
    { label: "Ключевые решения готовы к пререгистрации", ok: project.preregistrationChecks.length >= 6, step: "protocol" as StepId, group: "Протокол" },
    { label: "Первичный исход и основной анализ зафиксированы", ok: filled(project.primaryOutcome) && Boolean(project.analysis), step: "analysis" as StepId, group: "Анализ" },
    { label: "Эффект, предпосылки и множественность запланированы", ok: filled(project.effectMeasure) && filled(project.assumptionPlan) && filled(project.correctionPlan), step: "analysis" as StepId, group: "Анализ" },
    { label: "Зависимость наблюдений и диагностика модели учтены", ok: Boolean(project.comparisonStructure) && filled(project.normalityAssessment) && filled(project.varianceAssessment), step: "analysis" as StepId, group: "Анализ" },
    { label: "Обработка пропусков описана заранее", ok: filled(project.missingData), step: "analysis" as StepId, group: "Анализ" },
    { label: "Этический минимум закрыт", ok: project.ethicsChecks.length >= 6 && filled(project.risk), step: "ethics" as StepId, group: "Этика" },
    { label: "Минимизация, доступ и срок хранения описаны", ok: filled(project.dataTypes) && filled(project.accessRoles) && filled(project.retentionPeriod), step: "ethics" as StepId, group: "Данные" },
    { label: "Удаление и реакция на инцидент спланированы", ok: filled(project.deletionPlan) && filled(project.incidentPlan), step: "ethics" as StepId, group: "Данные" },
    { label: "Участнику подготовлен текст согласия", ok: filled(project.consent), step: "ethics" as StepId, group: "Этика" },
    { label: "Выбран стандарт отчётности", ok: Boolean(project.reportingStandard), step: "report" as StepId, group: "Отчёт" },
    { label: "Ограничения и распространение результатов описаны", ok: filled(project.limitations) && filled(project.dissemination), step: "report" as StepId, group: "Отчёт" },
  ], [project, methodMinutes]);

  const qualitySignals = useMemo(() => {
    const signals: { level: "critical" | "warning" | "good"; title: string; text: string; step: StepId }[] = [];
    const causalWords = /(влия(ет|ние)|приводит|вызывает|определяет|эффект)/i;
    if (project.design !== "experimental" && causalWords.test(`${project.topic} ${project.question} ${project.aim}`)) signals.push({ level: "critical", title: "Причинный язык без эксперимента", text: "Для наблюдательного дизайна замените «влияние» на «связь», «различия» или явно ограничьте причинный вывод.", step: "logic" });
    if (project.object.trim() && project.object.trim().toLowerCase() === project.subject.trim().toLowerCase()) signals.push({ level: "critical", title: "Объект совпадает с предметом", text: "Объект должен быть шире; предмет — конкретная сторона, связь или механизм внутри него.", step: "logic" });
    if (/\b(исследовани[ея]|изучени[ея])\b/i.test(project.topic) || project.topic.trim().split(/\s+/).filter(Boolean).length > 11) signals.push({ level: "warning", title: "Тема не проходит профиль филиала", text: "Уложитесь в 10–11 слов и уберите слова «изучение»/«исследование»; уточнения вынесите в скобки.", step: "logic" });
    if (/(студент|респондент|испытуем|участник|подростк|взросл)/i.test(project.object) && !/(псих|процесс|феномен|отношен|регуляц|деятельност|состояни)/i.test(project.object)) signals.push({ level: "critical", title: "Объект похож на выборку", text: "По требованиям кафедры объект — психологический феномен, процесс или образование. Люди и группы описываются в выборке.", step: "logic" });
    if (project.tasks.filter(filled).length > 0 && (project.tasks.filter(filled).length < 5 || project.tasks.filter(filled).length > 6)) signals.push({ level: "warning", title: "Проверьте число и уровень задач", text: "Локальный ориентир — 5–6 конкретных теоретических, методологических и эмпирических задач; при большем числе объедините однотипные.", step: "logic" });
    if (project.methods.length > 5 || methodMinutes > 35) signals.push({ level: "warning", title: "Перегруженная батарея", text: `Сейчас около ${methodMinutes} минут без инструкций. Усталость увеличит пропуски и случайные ответы.`, step: "methods" });
    if (project.sampleSize < Math.round(suggestedSample(project.sampleEffect, project.samplePower, project.design) * .8) && project.pathway === "quantitative") signals.push({ level: "warning", title: "Выборка ниже ориентира", text: "Проведите точный расчёт мощности под основной тест или честно ограничьте амбицию вывода.", step: "sample" });
    if (project.analysis === "regression" && project.variables.filter((v) => v.role === "predictor").length > Math.max(1, Math.floor(project.sampleSize / 15))) signals.push({ level: "critical", title: "Слишком много предикторов", text: "Модель рискует переобучиться. Сократите предикторы по теории или увеличьте выборку.", step: "analysis" });
    if (project.analysis === "mediation" && project.time === "cross-sectional") signals.push({ level: "warning", title: "Медиация в одном срезе", text: "Поперечные данные не устанавливают временной механизм. Формулируйте результат как косвенную статистическую связь.", step: "analysis" });
    if (project.hypotheses.filter((h) => filled(h.text)).length > 5 && !filled(project.correctionPlan)) signals.push({ level: "warning", title: "Много гипотез без семейства тестов", text: "Выделите первичную гипотезу и определите коррекцию или иерархию проверок.", step: "analysis" });
    if (project.pathway === "qualitative" && project.hypotheses.some((h) => filled(h.text))) signals.push({ level: "warning", title: "Гипотеза может сужать качественный поиск", text: "Для исследовательского качественного дизайна чаще полезны открытые вопросы и рефлексивная позиция.", step: "logic" });
    if (["experimental", "quasi"].includes(project.design) && project.experimentControls.length < 4) signals.push({ level: "critical", title: "Эксперимент без карты артефактов", text: "Отметьте реальные угрозы валидности и для каждой запишите контроль. Само наличие воздействия ещё не создаёт причинный вывод.", step: "design" });
    if (project.design === "experimental" && !/случайн|рандом/i.test(project.assignmentPlan)) signals.push({ level: "warning", title: "Неясное распределение по условиям", text: "Опишите генерацию последовательности, сокрытие распределения и единицу рандомизации — либо честно обозначьте квазиэксперимент.", step: "design" });
    if (["paired", "repeated"].includes(project.analysis) && project.comparisonStructure === "independent") signals.push({ level: "critical", title: "Анализ не соответствует зависимости", text: "Парные и повторные наблюдения нельзя анализировать как независимые. Согласуйте единицу анализа, структуру данных и модель.", step: "analysis" });
    if (!signals.length && audit.filter((item) => item.ok).length / audit.length >= .7) signals.push({ level: "good", title: "Критических противоречий не найдено", text: "Теперь нужен содержательный разбор руководителя: автоматический аудит проверяет структуру, но не научную истинность.", step: "audit" });
    return signals;
  }, [project, methodMinutes, audit]);

  const done = audit.filter((item) => item.ok).length;
  const readiness = Math.round((done / audit.length) * 100);
  const currentIndex = steps.findIndex((step) => step.id === active);
  const estimated = suggestedSample(project.sampleEffect, project.samplePower, project.design);
  const methodCategories = ["Все", ...Array.from(new Set(methodBank.map((method) => method.category)))];

  const go = (id: StepId) => {
    setActive(id);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(project, null, 2)], { type: "application/json" });
    const href = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    link.download = `${project.title || "research-project"}.json`;
    link.click();
    URL.revokeObjectURL(href);
    notify("Резервная копия скачана");
  };

  const exportDocx = async () => {
    const { Document, HeadingLevel, Packer, Paragraph, TextRun } = await import("docx");
    const section = (title: string, lines: string[]) => [
      new Paragraph({ text: title, heading: HeadingLevel.HEADING_1 }),
      ...lines.map((line) => new Paragraph({ children: [new TextRun(line || "—")] })),
    ];
    const doc = new Document({ sections: [{ children: [
      new Paragraph({ text: project.title || "Исследовательский проект", heading: HeadingLevel.TITLE }),
      new Paragraph({ text: `${project.level}${project.deadline ? ` · срок ${project.deadline}` : ""}` }),
      ...section("Логика исследования", [
        `Направление: ${project.field}; подход: ${project.pathway}.`,
        `Тема: ${project.topic}`, `Проблема: ${project.problem}`, `Актуальность: ${project.relevance}`, `Цель: ${project.aim}`,
        `Объект: ${project.object}`, `Предмет: ${project.subject}`, `Вопрос: ${project.question}`,
        ...project.tasks.map((task, i) => `Задача ${i + 1}: ${task}`),
        ...project.hypotheses.map((h, i) => `Гипотеза ${i + 1}: ${h.text}`),
      ]),
      ...section("Теоретические основания и литература", [
        `Теоретическая рамка: ${project.theory}`, `Ключевые слова: ${project.keywords}`,
        `Базы: ${project.databases.join(", ")}`, `Поисковый запрос: ${project.searchQuery}`,
        `Критерии отбора: ${project.literatureCriteria}`, `Пробел в знаниях: ${project.evidenceGap}`,
      ]),
      ...section("Переменные и операционализация", [
        ...project.variables.map((v) => `${v.name || "Переменная"} (${v.role}): ${v.definition}; показатель: ${v.indicator}; шкала: ${v.scale}; инструмент: ${v.instrument}.`),
        `Альтернативные объяснения: ${project.confounds}`,
      ]),
      ...section("Дизайн и выборка", [
        `Дизайн: ${project.design}; временной план: ${project.time}; формат: ${project.setting}.`,
        `Обоснование дизайна: ${project.designRationale}`,
        `Манипуляция / условия: ${project.manipulation}`, `Распределение: ${project.assignmentPlan}`,
        `Ослепление и стандартизация: ${project.blindingPlan}`, `Проверка манипуляции: ${project.manipulationCheck}`,
        `Угрозы валидности: ${project.experimentControls.join("; ") || "не отмечены"}`, `Контроль артефактов: ${project.artifactPlan}`,
        `Генеральная совокупность: ${project.population}`, `Плановый объём: ${project.sampleSize}`,
        `Способ выборки: ${project.samplingMethod}; запас на отсев: ${project.attrition}%.`,
        `Включение: ${project.inclusion}`, `Исключение: ${project.exclusion}`, `Набор: ${project.recruitment}`,
      ]),
      ...section("Протокол", [
        `Процедура: ${project.procedure}`, `Пилот: ${project.pilotPlan}`, `Правило остановки: ${project.stoppingRule}`,
        `Пререгистрация: ${project.preregistrationChecks.join("; ") || "не заполнена"}`,
      ]),
      ...section("Методы и анализ", [
        `Методы: ${project.methods.map((m) => m.name).join("; ") || "не выбраны"}`,
        `Первичный исход: ${project.primaryOutcome}`, `План анализа: ${project.analysis}`,
        `Структура наблюдений: ${project.comparisonStructure}; число групп/условий: ${project.groupCount}`,
        `Вторичные исходы: ${project.secondaryOutcomes}`, `Размер эффекта: ${project.effectMeasure}`,
        `Уровень значимости: ${project.alpha}`, `Предпосылки: ${project.assumptionPlan}`,
        `Оценка формы распределения и остатков: ${project.normalityAssessment}`, `Дисперсии и зависимость: ${project.varianceAssessment}`,
        `Множественные проверки: ${project.correctionPlan}`, `Пропуски: ${project.missingData}`,
      ]),
      ...section("Этика и данные", [
        `Риски: ${project.risk}`, `Хранение: ${project.storage}`, `Отказ от участия: ${project.withdrawal}`,
        `Минимальный состав данных: ${project.dataTypes}`, `Доступ: ${project.accessRoles}`,
        `Срок хранения: ${project.retentionPeriod}`, `Порядок удаления: ${project.deletionPlan}`,
        `Инцидент: ${project.incidentPlan}`,
        `Текст согласия: ${project.consent}`,
      ]),
      ...section("Отчёт и границы", [
        `Стандарт отчётности: ${project.reportingStandard}`, `Ограничения: ${project.limitations}`,
        `Распространение результатов: ${project.dissemination}`, `Готовность каркаса: ${readiness}% (${done}/${audit.length}).`,
      ]),
    ] }] });
    const blob = await Packer.toBlob(doc);
    const href = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    link.download = `${project.title || "research-project"}.docx`;
    link.click();
    URL.revokeObjectURL(href);
    notify("Документ DOCX собран");
  };

  const importJson = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 1_000_000) {
      notify("Файл больше 1 МБ: импорт отменён");
      event.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const incoming = JSON.parse(String(reader.result));
        setProject(sanitizeProject(incoming));
        notify("Проект проверен и восстановлен");
      } catch { notify("Не удалось прочитать файл"); }
    };
    reader.readAsText(file);
    event.target.value = "";
  };

  const resetProject = () => {
    if (!window.confirm("Безвозвратно удалить проект из этого браузера? При необходимости сначала скачайте JSON. Будут удалены текущий и прежний ключи конструктора.")) return;
    const cleared = clearProjectStorage(localStorage);
    suppressNextSaveRef.current = true;
    setProject(freshProject());
    go("overview");
    notify(cleared ? "Данные проекта удалены; открыт чистый проект" : "Не удалось подтвердить удаление в браузере");
  };

  const copyConsent = async () => {
    await navigator.clipboard.writeText(project.consent);
    notify("Текст согласия скопирован");
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="mobile-menu" onClick={() => setMobileOpen(true)} aria-label="Открыть навигацию"><Menu /></button>
        <button className="brand" onClick={() => go("overview")} aria-label="На главную">
          <span className="brand__mark">КИ</span>
          <span><b>Конструктор</b><small>исследования</small></span>
        </button>
        <div className="topbar__project">
          <span className="status-dot" />
          <span>{hydrated ? "Сохраняется в браузере" : "Загрузка проекта"}</span>
        </div>
        <div className="topbar__actions">
          <button className="button button--ghost" onClick={() => setKnowledgeOpen(true)}><LibraryBig size={17} /> Справочник</button>
          <button className="button button--ghost" onClick={exportJson}><FileJson size={17} /> JSON</button>
          <button className="button button--ink" onClick={exportDocx}><Download size={17} /> Скачать DOCX</button>
        </div>
      </header>

      <aside className={`sidebar ${mobileOpen ? "sidebar--open" : ""}`}>
        <div className="sidebar__mobile-head"><span>Разделы проекта</span><button onClick={() => setMobileOpen(false)} aria-label="Закрыть"><X /></button></div>
        <div className="project-mini">
          <span className="project-mini__label">Текущий проект</span>
          <strong>{project.title || "Без названия"}</strong>
          <small>{researchPathways.find((item) => item.id === project.pathway)?.title || project.pathway} · {project.field}</small>
          <div className="progress-row"><span>готовность</span><b>{readiness}%</b></div>
          <div className="progress"><i style={{ width: `${readiness}%` }} /></div>
        </div>
        <nav aria-label="Разделы конструктора">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const complete = audit.filter((a) => a.step === step.id).every((a) => a.ok) && audit.some((a) => a.step === step.id);
            return (
              <button key={step.id} className={active === step.id ? "nav-item nav-item--active" : "nav-item"} onClick={() => go(step.id)}>
                <span className="nav-item__number">{complete ? <Check size={14} /> : String(index + 1).padStart(2, "0")}</span>
                <Icon size={18} /><span>{step.label}</span><ChevronRight className="nav-item__chevron" size={16} />
              </button>
            );
          })}
        </nav>
        <div className="sidebar__tools">
          <button onClick={() => importRef.current?.click()}><Upload size={16} /> Импорт JSON</button>
          <button onClick={resetProject}><Trash2 size={16} /> Удалить данные проекта</button>
          <input ref={importRef} type="file" accept="application/json" onChange={importJson} hidden />
        </div>
      </aside>
      {mobileOpen && <button className="scrim" onClick={() => setMobileOpen(false)} aria-label="Закрыть меню" />}

      <main className="workspace">
        <div className="workspace__main">
          {active === "overview" && (
            <>
              <section className="hero">
                <div className="hero__copy">
                  <span className="eyebrow eyebrow--light">Рабочая среда · 01</span>
                  <h1>От идеи — к исследованию, которое выдержит вопросы.</h1>
                  <p>Соберите логику работы, дизайн, выборку, инструменты и план анализа в одном месте. Конструктор не пишет исследование за вас — он помогает не оставить в нём дыр.</p>
                  <button className="button button--amber" onClick={() => go("logic")}>Начать с логики <ArrowRight size={18} /></button>
                </div>
                <div className="hero__visual" aria-hidden="true">
                  <div className="orbit orbit--one" /><div className="orbit orbit--two" />
                  <div className="hero__score"><b>{readiness}</b><span>%</span><small>готовности</small></div>
                  <span className="hero__tag hero__tag--a">вопрос</span><span className="hero__tag hero__tag--b">метод</span><span className="hero__tag hero__tag--c">вывод</span>
                </div>
              </section>
              <section className="content-section">
                <SectionHead eyebrow="Паспорт" title="Сначала зафиксируйте рамку" text="Эти данные попадут в экспорт и помогут не потерять масштаб работы." />
                <div className="pathway-grid">
                  {researchPathways.map((pathway) => <button key={pathway.id} className={project.pathway === pathway.id ? "pathway-card pathway-card--active" : "pathway-card"} onClick={() => update("pathway", pathway.id)}><span>{project.pathway === pathway.id ? <Check size={15} /> : <Layers3 size={15} />}</span><strong>{pathway.title}</strong><p>{pathway.question}</p><small>{pathway.output}</small></button>)}
                </div>
                <div className="form-card form-grid">
                  <Field label="Рабочее название" wide><input value={project.title} onChange={(e) => update("title", e.target.value)} /></Field>
                  <Field label="Формат работы"><select value={project.level} onChange={(e) => update("level", e.target.value)}><option>Курсовая работа</option><option>ВКР бакалавра</option><option>Курсовая работа магистра</option><option>Магистерская диссертация</option><option>Статья</option><option>Самостоятельный проект</option></select></Field>
                  <Field label="Область психологии"><select value={project.field} onChange={(e) => update("field", e.target.value)}><option>Общая психология</option><option>Социальная психология</option><option>Психология личности</option><option>Психология развития</option><option>Организационная психология</option><option>Клиническая психология</option><option>Психофизиология</option><option>Психометрика</option><option>Междисциплинарное исследование</option></select></Field>
                  <Field label="Срок"><input type="date" value={project.deadline} onChange={(e) => update("deadline", e.target.value)} /></Field>
                  <Field label="Научный руководитель"><input placeholder="Фамилия, имя, степень — если есть" value={project.supervisor} onChange={(e) => update("supervisor", e.target.value)} /></Field>
                </div>
              </section>
              <section className="content-section">
                <div className="section-head section-head--row"><div><span className="eyebrow">Маршрут</span><h2>Двенадцать рабочих блоков</h2></div><p>{done} из {audit.length} контрольных точек закрыто</p></div>
                <div className="route-grid">
                  {steps.slice(1).map((step, index) => { const Icon = step.icon; return <button key={step.id} className="route-card" onClick={() => go(step.id)}><span>{String(index + 2).padStart(2, "0")}</span><Icon /><strong>{step.label}</strong><p>{routeDescription(step.id)}</p><ArrowRight size={18} /></button>; })}
                </div>
              </section>
              <section className="branch-profile">
                <div><span className="eyebrow eyebrow--light">Локальный профиль требований</span><h2>Кафедра психологии филиала МГУ в Ташкенте</h2><p>Встроены требования протокола № 3 от 28.09.2023 и рабочий план эмпирической части 2025 года: от формулировки темы до интерпретации и приложений.</p></div>
                <button className="button button--amber" onClick={() => { setKnowledgeTab("branch"); setKnowledgeOpen(true); }}>Открыть требования <ArrowRight size={17} /></button>
                <small>Материалы разных лет могут расходиться. Перед вёрсткой и сдачей обязательно сверяйте действующую редакцию с кафедрой и научным руководителем.</small>
              </section>
              <section className="principles">
                <div><Sparkles /><span className="eyebrow">Методологическая основа</span><h2>Психологическое исследование — система содержательных решений</h2><p>Каркас опирается на традиции факультета психологии МГУ: предметность психологического объяснения, связь теории и эмпирической проверки, анализ деятельности, развития и механизмов психики.</p></div>
                <ol><li><b>01</b><span><strong>От предмета — к методу</strong>Метод и статистика выбираются после определения психологической проблемы.</span></li><li><b>02</b><span><strong>Теория → механизм → показатель</strong>Операционализация должна сохранять смысл конструкта, а не только давать число.</span></li><li><b>03</b><span><strong>Единство объяснения и проверки</strong>Данные проверяют содержательную гипотезу; ограничения определяют силу вывода.</span></li></ol>
              </section>
              <section className="reference-shelf">
                <div className="section-head section-head--row"><div><span className="eyebrow">Основания и сверка</span><h2>МГУ — методологическое ядро, стандарты — контроль полноты</h2></div><p>Регламент кафедры и решение научного руководителя имеют приоритет.</p></div>
                <div className="reference-grid">
                  <a href="https://istina.msu.ru/publications/book/509770/" target="_blank" rel="noreferrer"><span>Психфак МГУ</span><strong>Методологические основы психологии</strong><p>Т. В. Корнилова и С. Д. Смирнов: предмет, принципы, критерии научности и психологическое объяснение.</p><ArrowRight /></a>
                  <a href="https://istina.msu.ru/publications/book/509830/" target="_blank" rel="noreferrer"><span>Экспериментальная школа МГУ</span><strong>Экспериментальная психология: практикум</strong><p>Связь предмета исследования, гипотез, экспериментального контроля, методических подходов и вывода.</p><ArrowRight /></a>
                  <a href="https://apastyle.apa.org/jars" target="_blank" rel="noreferrer"><span>Полнота отчёта</span><strong>APA JARS</strong><p>Стандарты описания количественных, качественных и смешанных исследований.</p><ArrowRight /></a>
                  <a href="https://help.osf.io/article/330-welcome-to-registrations" target="_blank" rel="noreferrer"><span>Открытая наука</span><strong>OSF Preregistration</strong><p>Шаблоны для фиксации гипотез, методов и анализа до начала исследования.</p><ArrowRight /></a>
                </div>
              </section>
            </>
          )}

          {active === "logic" && <LogicStep project={project} update={update} />}
          {active === "evidence" && <EvidenceStep project={project} update={update} />}
          {active === "variables" && <VariablesStep project={project} update={update} />}
          {active === "design" && <DesignStep project={project} update={update} />}
          {active === "sample" && <SampleStep project={project} update={update} estimated={estimated} />}
          {active === "methods" && <MethodsStep project={project} update={update} search={methodSearch} setSearch={setMethodSearch} totalMinutes={methodMinutes} category={methodCategory} setCategory={setMethodCategory} categories={methodCategories} />}
          {active === "protocol" && <ProtocolStep project={project} update={update} />}
          {active === "analysis" && <AnalysisStep project={project} update={update} />}
          {active === "ethics" && <EthicsStep project={project} update={update} copyConsent={copyConsent} />}
          {active === "report" && <ReportStep project={project} update={update} readiness={readiness} exportDocx={exportDocx} />}
          {active === "audit" && <AuditStep project={project} audit={audit} readiness={readiness} go={go} exportDocx={exportDocx} signals={qualitySignals} />}

          <div className="step-controls">
            <button className="button button--ghost" disabled={currentIndex === 0} onClick={() => go(steps[currentIndex - 1].id)}><ArrowLeft size={17} /> Назад</button>
            <span>{currentIndex + 1} / {steps.length}</span>
            {currentIndex < steps.length - 1 ? <button className="button button--ink" onClick={() => go(steps[currentIndex + 1].id)}>Дальше <ArrowRight size={17} /></button> : <button className="button button--amber" onClick={exportDocx}><Download size={17} /> DOCX</button>}
          </div>
        </div>

        <aside className="inspector">
          <div className="inspector__sticky">
            <span className="eyebrow">Контроль качества</span>
            <div className="inspector__score"><strong>{readiness}%</strong><div className="progress"><i style={{ width: `${readiness}%` }} /></div><span>{done} / {audit.length}</span></div>
            <h3>{readiness === 100 ? "Каркас готов к обсуждению" : "Следующая точка роста"}</h3>
            <p>{audit.find((item) => !item.ok)?.label || "Проверьте формулировки вместе с научным руководителем."}</p>
            {audit.find((item) => !item.ok) && <button className="text-button" onClick={() => go(audit.find((item) => !item.ok)!.step)}>Перейти к блоку <ArrowRight size={15} /></button>}
            {qualitySignals[0] && <button className={`signal-mini signal-mini--${qualitySignals[0].level}`} onClick={() => go(qualitySignals[0].step)}><b>{qualitySignals[0].title}</b><span>{qualitySignals[0].text}</span></button>}
            <hr />
            <div className="privacy-note"><ShieldCheck size={20} /><p><b>Локальный режим</b>Проект хранится только в вашем браузере. Данные участников сюда не вводите.</p></div>
          </div>
        </aside>
      </main>

      <footer><span>Конструктор исследования · психологическая методология и проектирование · 2026</span><strong>Запрещено основывать работу на созданных вами здесь заметках, формулировках и решениях или использовать их без проверки и одобрения научного руководителя. Это не улучшит работу — только повысит риск методологических ошибок и сделает хуже прежде всего вам.</strong></footer>
      {knowledgeOpen && <KnowledgeCenter search={knowledgeSearch} setSearch={setKnowledgeSearch} tab={knowledgeTab} setTab={setKnowledgeTab} close={() => setKnowledgeOpen(false)} />}
      {toast && <div className="toast" role="status"><CheckCircle2 size={18} />{toast}</div>}
    </div>
  );
}

function routeDescription(id: StepId) {
  return ({ logic: "Проблема, цель, задачи и гипотезы", evidence: "Поиск, теория и реальный пробел", variables: "Роли, показатели и схема связей", design: "Тип, время и границы вывода", sample: "Кого, сколько и как набирать", methods: "Батарея и качество измерения", protocol: "Пошаговая процедура и пререгистрация", analysis: "Основной тест, эффекты и предпосылки", ethics: "Согласие, риски и хранение", report: "Стандарт, ограничения и защита", audit: "Связность и готовность к обсуждению" } as Partial<Record<StepId, string>>)[id] || "";
}

type StepProps = { project: Project; update: <K extends keyof Project>(key: K, value: Project[K]) => void };

function LogicStep({ project, update }: StepProps) {
  const setHypothesis = (id: string, patch: Partial<Hypothesis>) => update("hypotheses", project.hypotheses.map((item) => item.id === id ? { ...item, ...patch } : item));
  const setTask = (index: number, value: string) => update("tasks", project.tasks.map((item, i) => i === index ? value : item));
  const topicWords = project.topic.trim() ? project.topic.trim().split(/\s+/).length : 0;
  const topicHasForbidden = /\b(исследовани[ея]|изучени[ея])\b/i.test(project.topic);
  return <section className="content-section step-page">
    <SectionHead eyebrow="Блок 02 · психологическая методология" title="Соберите логический позвоночник" text="В традициях психологической школы МГУ исследование начинается с предмета, теоретической проблемы и предполагаемого психологического механизма — не с понравившегося теста или статистики." />
    <div className="logic-map" aria-label="Логика исследования"><span>Теория</span><ChevronRight /><span>Проблема</span><ChevronRight /><span>Вопрос</span><ChevronRight /><span>Механизм</span><ChevronRight /><span>Проверка</span></div>
    <div className="branch-checks"><div className={topicWords > 0 && topicWords <= 11 ? "branch-check branch-check--ok" : "branch-check"}><b>{topicWords || "—"}</b><span>слов в теме<small>ориентир филиала: до 10–11</small></span></div><div className={!topicHasForbidden ? "branch-check branch-check--ok" : "branch-check branch-check--bad"}><b>{topicHasForbidden ? "!" : <Check size={18} />}</b><span>«изучение / исследование»<small>{topicHasForbidden ? "убрать из темы" : "не используются"}</small></span></div><div className={project.tasks.filter(filled).length >= 5 && project.tasks.filter(filled).length <= 6 ? "branch-check branch-check--ok" : "branch-check"}><b>{project.tasks.filter(filled).length}</b><span>содержательных задач<small>ориентир: 5–6</small></span></div></div>
    <div className="form-card form-grid">
      <Field label="Тема" hint="Кто/что + какой феномен + в каком контексте" wide><textarea rows={2} placeholder="Например: связь стратегий регуляции эмоций с академическим стрессом у студентов первого курса" value={project.topic} onChange={(e) => update("topic", e.target.value)} /></Field>
      <Field label="Проблема" hint="Не «тема мало изучена», а конкретный пробел или противоречие" wide><textarea rows={3} placeholder="Что уже известно — и чего не хватает для ответа?" value={project.problem} onChange={(e) => update("problem", e.target.value)} /></Field>
      <Field label="Актуальность" hint="Почему этот пробел важен для психологической теории, практики или человека" wide><textarea rows={3} placeholder="Что изменит получение ответа — и для кого?" value={project.relevance} onChange={(e) => update("relevance", e.target.value)} /></Field>
      <Field label="Объект" hint="Более широкая область психической реальности"><textarea rows={2} value={project.object} onChange={(e) => update("object", e.target.value)} /></Field>
      <Field label="Предмет" hint="Конкретная связь, свойство или процесс в объекте"><textarea rows={2} value={project.subject} onChange={(e) => update("subject", e.target.value)} /></Field>
      <Field label="Исследовательский вопрос" hint="Один вопрос, на который действительно ответят данные" wide><textarea rows={2} placeholder="Как связаны X и Y у Z?" value={project.question} onChange={(e) => update("question", e.target.value)} /></Field>
      <Field label="Цель" hint="Начните с действия: выявить, проверить, описать, сравнить" wide><textarea rows={2} value={project.aim} onChange={(e) => update("aim", e.target.value)} /></Field>
    </div>
    <div className="subsection-head"><div><span className="eyebrow">Путь к цели</span><h3>Исследовательские задачи</h3></div><button className="button button--soft" onClick={() => update("tasks", [...project.tasks, ""])}><Plus size={16} /> Добавить</button></div>
    <div className="task-list">{project.tasks.map((task, index) => <div key={index}><b>{index + 1}</b><input aria-label={`Задача ${index + 1}`} value={task} onChange={(e) => setTask(index, e.target.value)} /><button className="icon-button" aria-label="Удалить задачу" disabled={project.tasks.length <= 1} onClick={() => update("tasks", project.tasks.filter((_, i) => i !== index))}><Trash2 size={16} /></button></div>)}</div>
    <div className="subsection-head"><div><span className="eyebrow">Проверяемые ожидания</span><h3>Гипотезы</h3></div><button className="button button--soft" onClick={() => update("hypotheses", [...project.hypotheses, { id: uid(), text: "", type: "directional" }])}><Plus size={16} /> Добавить</button></div>
    <div className="hypothesis-list">{project.hypotheses.map((hypothesis, index) => <div className="hypothesis" key={hypothesis.id}><span className="hypothesis__index">H{index + 1}</span><textarea rows={2} aria-label={`Гипотеза ${index + 1}`} placeholder="Чем выше X, тем ниже Y…" value={hypothesis.text} onChange={(e) => setHypothesis(hypothesis.id, { text: e.target.value })} /><select aria-label="Тип гипотезы" value={hypothesis.type} onChange={(e) => setHypothesis(hypothesis.id, { type: e.target.value as Hypothesis["type"] })}><option value="directional">Направленная</option><option value="non-directional">Ненаправленная</option><option value="null">Нулевая</option></select><button className="icon-button" aria-label="Удалить гипотезу" disabled={project.hypotheses.length === 1} onClick={() => update("hypotheses", project.hypotheses.filter((h) => h.id !== hypothesis.id))}><Trash2 size={17} /></button></div>)}</div>
    <Tip>Быстрый тест психолога: что именно в психике или деятельности предполагается объяснить, какой механизм это связывает и какое наблюдение способно опровергнуть ожидание?</Tip>
  </section>;
}

function EvidenceStep({ project, update }: StepProps) {
  const databases = ["ИСТИНА МГУ", "eLIBRARY", "Google Scholar", "PsycINFO", "PubMed", "CyberLeninka"];
  const toggle = (item: string) => update("databases", project.databases.includes(item) ? project.databases.filter((v) => v !== item) : [...project.databases, item]);
  return <section className="content-section step-page">
    <SectionHead eyebrow="Блок 03 · основания" title="Постройте теоретическую рамку и найдите реальный пробел" text="Сначала реконструируйте подходы и понятия, затем сопоставьте современные обзоры и первичные исследования. Список найденных статей ещё не является теоретической главой." />
    <div className="evidence-layers">{[
      ["01", "Школа и понятия", "Как определяется предмет в культурно-историческом, деятельностном или другом обоснованном подходе?"],
      ["02", "Обзоры и метаанализы", "Что уже устойчиво известно и где результаты расходятся?"],
      ["03", "Первичные исследования", "Какие дизайны, выборки и операционализации дают конкретные эффекты?"],
      ["04", "Методические источники", "Насколько валидны измерения и применимы ли версии к вашей выборке?"],
    ].map(([n, title, text]) => <article key={n}><b>{n}</b><strong>{title}</strong><p>{text}</p></article>)}</div>
    <div className="form-card form-grid">
      <Field label="Теоретическая рамка" hint="Назовите подход, авторов, ключевые понятия и предполагаемый механизм" wide><textarea rows={5} placeholder="Например: культурно-исторический и деятельностный подходы; единица анализа; механизм регуляции…" value={project.theory} onChange={(e) => update("theory", e.target.value)} /></Field>
      <Field label="Ключевые слова" hint="Русские и английские термины, синонимы, названия конструктов" wide><textarea rows={3} value={project.keywords} onChange={(e) => update("keywords", e.target.value)} /></Field>
      <Field label="Поисковый запрос" hint="Сохраните точную строку, дату поиска и фильтры" wide><textarea rows={3} placeholder='("emotion regulation" OR reappraisal) AND (student* OR undergraduate*) AND stress' value={project.searchQuery} onChange={(e) => update("searchQuery", e.target.value)} /></Field>
      <Field label="Критерии отбора" hint="Период, язык, популяция, дизайн, тип публикации" wide><textarea rows={3} value={project.literatureCriteria} onChange={(e) => update("literatureCriteria", e.target.value)} /></Field>
      <Field label="Пробел в знаниях" hint="Чего именно не позволяют решить уже опубликованные работы" wide><textarea rows={4} placeholder="Не «мало исследований», а противоречие, неизвестный механизм, непроверенная граница или проблема измерения" value={project.evidenceGap} onChange={(e) => update("evidenceGap", e.target.value)} /></Field>
    </div>
    <div className="database-picks"><span>Где искать</span>{databases.map((item) => <button key={item} className={project.databases.includes(item) ? "chip chip--active" : "chip"} onClick={() => toggle(item)}>{project.databases.includes(item) && <Check size={14} />}{item}</button>)}</div>
    <div className="msu-note"><LibraryBig /><div><b>Опора МГУ</b><p>Проверяйте понятия по первоисточникам и работам научной школы, а современное состояние проблемы — по обзорам и актуальным эмпирическим данным. Не подменяйте теоретическое объяснение набором корреляций.</p><a href="https://istina.msu.ru/publications/book/509770/" target="_blank" rel="noreferrer">«Методологические основы психологии» — Т. В. Корнилова, С. Д. Смирнов <ArrowRight size={15} /></a></div></div>
  </section>;
}

function VariablesStep({ project, update }: StepProps) {
  const roleNames: Record<VariableItem["role"], string> = { predictor: "Предиктор / фактор", outcome: "Исход", mediator: "Медиатор", moderator: "Модератор", covariate: "Ковариата" };
  const setVariable = (id: string, patch: Partial<VariableItem>) => update("variables", project.variables.map((v) => v.id === id ? { ...v, ...patch } : v));
  return <section className="content-section step-page">
    <SectionHead eyebrow="Блок 04 · модель" title="Свяжите понятие, показатель и роль в объяснении" text="Переменная — не название столбца. Покажите переход от психологического конструкта к наблюдаемому индикатору и объясните, зачем он входит в модель." />
    <div className="model-strip"><span>X · условие или предиктор</span><ArrowRight /><span>M · предполагаемый механизм</span><ArrowRight /><span>Y · психологический исход</span><small>W меняет связь · C учитывается как ковариата</small></div>
    <div className="variable-list">{project.variables.map((variable, index) => <article className="variable-card" key={variable.id}>
      <div className="variable-card__head"><span>V{index + 1}</span><select aria-label={`Роль переменной ${index + 1}`} value={variable.role} onChange={(e) => setVariable(variable.id, { role: e.target.value as VariableItem["role"] })}>{Object.entries(roleNames).map(([id, label]) => <option value={id} key={id}>{label}</option>)}</select><button className="icon-button" disabled={project.variables.length <= 1} onClick={() => update("variables", project.variables.filter((v) => v.id !== variable.id))} aria-label="Удалить переменную"><Trash2 size={16} /></button></div>
      <div className="form-grid"><Field label="Название конструкта"><input value={variable.name} onChange={(e) => setVariable(variable.id, { name: e.target.value })} /></Field><Field label="Шкала данных"><select value={variable.scale} onChange={(e) => setVariable(variable.id, { scale: e.target.value as VariableItem["scale"] })}><option value="nominal">Номинальная</option><option value="ordinal">Порядковая</option><option value="quantitative">Количественная</option></select></Field><Field label="Теоретическое определение" wide><textarea rows={2} value={variable.definition} onChange={(e) => setVariable(variable.id, { definition: e.target.value })} /></Field><Field label="Наблюдаемый показатель"><input placeholder="Какое число или категория попадёт в анализ" value={variable.indicator} onChange={(e) => setVariable(variable.id, { indicator: e.target.value })} /></Field><Field label="Инструмент / процедура"><input placeholder="Методика, задача, кодирование…" value={variable.instrument} onChange={(e) => setVariable(variable.id, { instrument: e.target.value })} /></Field></div>
    </article>)}</div>
    <button className="button button--soft add-wide" onClick={() => update("variables", [...project.variables, { id: uid(), name: "", role: "covariate", definition: "", indicator: "", scale: "quantitative", instrument: "" }])}><Plus size={16} /> Добавить переменную</button>
    <div className="form-card"><Field label="Альтернативные объяснения и смешивающие факторы" hint="Какие различия могут одновременно быть связаны с X и Y?" wide><textarea rows={4} placeholder="Возраст, исходный уровень, контекст, самоотбор, порядок предъявления…" value={project.confounds} onChange={(e) => update("confounds", e.target.value)} /></Field></div>
    <Tip>Нельзя включать Y как предиктор самого себя. Блоки регрессии должны отражать теорию и этапы проверки; автоматический stepwise допустим только как явно обозначенный разведочный анализ.</Tip>
  </section>;
}

function DesignStep({ project, update }: StepProps) {
  const options = [
    ["correlational", "Корреляционный", "Наблюдаем связи без вмешательства"],
    ["comparative", "Сравнительный", "Сопоставляем существующие группы"],
    ["experimental", "Экспериментальный", "Манипулируем фактором и контролируем условия"],
    ["qualitative", "Качественный", "Исследуем опыт, смыслы и процессы"],
    ["mixed", "Смешанный", "Соединяем количественные и качественные данные"],
    ["quasi", "Квазиэкспериментальный", "Есть воздействие, но рандомизация ограничена"],
    ["longitudinal", "Лонгитюдный", "Изучаем изменение и временную последовательность"],
    ["review", "Систематический обзор", "Синтезируем исследования по прозрачному протоколу"],
    ["psychometric", "Психометрический", "Проверяем структуру и качество измерения"],
  ];
  const intervention = ["experimental", "quasi"].includes(project.design);
  const toggleThreat = (id: string) => update("experimentControls", project.experimentControls.includes(id) ? project.experimentControls.filter((item) => item !== id) : [...project.experimentControls, id]);
  return <section className="content-section step-page"><SectionHead eyebrow="Блок 05" title="Выберите дизайн до сбора данных" text="Дизайн задаёт границы допустимых выводов. Связь не доказывает причинность, а удобная выборка ограничивает обобщение." />
    <div className="choice-grid">{options.map(([id, title, text]) => <button key={id} className={project.design === id ? "choice-card choice-card--active" : "choice-card"} onClick={() => update("design", id)}><span className="choice-card__radio">{project.design === id && <i />}</span><strong>{title}</strong><p>{text}</p></button>)}</div>
    <div className="form-card form-grid">
      <Field label="Временной план"><select value={project.time} onChange={(e) => update("time", e.target.value)}><option value="cross-sectional">Одномоментный срез</option><option value="longitudinal">Лонгитюдный</option><option value="pre-post">До и после воздействия</option><option value="retrospective">Ретроспективный</option></select></Field>
      <Field label="Среда сбора"><select value={project.setting} onChange={(e) => update("setting", e.target.value)}><option value="online">Онлайн</option><option value="offline">Очно</option><option value="lab">Лаборатория</option><option value="field">Полевые условия</option><option value="hybrid">Гибридно</option></select></Field>
      <Field label="Почему этот дизайн отвечает вопросу" hint="Свяжите тип вывода, контроль, временной порядок и доступные данные" wide><textarea rows={4} value={project.designRationale} onChange={(e) => update("designRationale", e.target.value)} /></Field>
    </div>
    <div className="warning-grid"><div><CircleHelp /><strong>Какой вывод разрешён?</strong><p>{project.design === "experimental" ? "При направленной манипуляции, корректной рандомизации и достаточном контроле можно осторожно оценивать причинный эффект." : project.design === "quasi" ? "Воздействие и временной порядок усиливают вывод, но отсутствие полной рандомизации оставляет конкурентные объяснения." : project.design === "qualitative" ? "Можно описывать темы, механизмы и субъективный опыт; статистическое обобщение не является целью." : "Можно говорить о связи или различиях, но не приписывать одному фактору причинное влияние."}</p></div><div><ShieldCheck /><strong>Что зафиксировать заранее?</strong><p>Условия, критерии остановки, исключения, основные переменные и анализ. Это снижает свободу подгонки решений после просмотра результатов.</p></div></div>
    {intervention && <>
      <div className="subsection-head"><div><span className="eyebrow">Экспериментальный кокпит</span><h3>Манипуляция, распределение и контроль</h3></div><span className="control-count">{project.experimentControls.length} угроз разобрано</span></div>
      <div className="form-card form-grid">
        <Field label="Независимая переменная и уровни" hint="Что именно меняется между условиями; активный компонент и контроль" wide><textarea rows={4} placeholder="Фактор: тип обратной связи. Уровни: поддерживающая / нейтральная. Всё остальное одинаково." value={project.manipulation} onChange={(e) => update("manipulation", e.target.value)} /></Field>
        <Field label="Распределение по условиям" hint="Единица, генерация последовательности, сокрытие; если рандомизации нет — почему"><textarea rows={4} value={project.assignmentPlan} onChange={(e) => update("assignmentPlan", e.target.value)} /></Field>
        <Field label="Ослепление и стандартизация" hint="Кто знает условие; что автоматизировано; единые инструкции"><textarea rows={4} value={project.blindingPlan} onChange={(e) => update("blindingPlan", e.target.value)} /></Field>
        <Field label="Проверка манипуляции" hint="Показатель, не дублирующий основной исход, и момент измерения"><textarea rows={4} value={project.manipulationCheck} onChange={(e) => update("manipulationCheck", e.target.value)} /></Field>
        <Field label="План против артефактов" hint="Для каждой отмеченной угрозы: источник → конкретный контроль → остаточный риск" wide><textarea rows={5} value={project.artifactPlan} onChange={(e) => update("artifactPlan", e.target.value)} /></Field>
      </div>
      <div className="threat-grid">{experimentThreats.map((threat) => <label key={threat.id} className={project.experimentControls.includes(threat.id) ? "threat-card threat-card--active" : "threat-card"}><input type="checkbox" checked={project.experimentControls.includes(threat.id)} onChange={() => toggleThreat(threat.id)} /><span>{threat.validity}</span><strong>{threat.title}</strong><p>{threat.diagnostic}</p><small><b>Контроль:</b> {threat.control}</small></label>)}</div>
      <div className="norm-grid">{experimentNorms.map((item, index) => <article key={item.title}><b>{String(index + 1).padStart(2, "0")}</b><div><strong>{item.title}</strong><p>{item.text}</p></div></article>)}</div>
      <Tip>По Корниловой и Готтсданкеру эксперимент ценен не подтверждением любой ценой, а организацией проверки, в которой возможны данные против гипотезы и ограничены правдоподобные конкурирующие объяснения.</Tip>
    </>}
  </section>;
}

function SampleStep({ project, update, estimated }: StepProps & { estimated: number }) {
  const nonPower = project.pathway === "qualitative" || project.pathway === "review" || project.pathway === "psychometric";
  const invitationTarget = Math.ceil(project.sampleSize / Math.max(.05, 1 - project.attrition / 100));
  return <section className="content-section step-page"><SectionHead eyebrow="Блок 06" title="Спроектируйте выборку, а не просто число" text="Опишите, на кого распространяется вопрос, кто реально попадёт в данные и почему такой объём достаточен." />
    <div className="sample-layout"><div className="form-card form-grid">
      <Field label="Генеральная совокупность" wide><textarea rows={2} placeholder="Например: студенты очной формы 18–24 лет российских вузов" value={project.population} onChange={(e) => update("population", e.target.value)} /></Field>
      <Field label="Критерии включения"><textarea rows={4} placeholder="Возраст, статус, язык, опыт…" value={project.inclusion} onChange={(e) => update("inclusion", e.target.value)} /></Field>
      <Field label="Критерии исключения"><textarea rows={4} placeholder="Дубли, незавершённые анкеты…" value={project.exclusion} onChange={(e) => update("exclusion", e.target.value)} /></Field>
      <Field label="Способ выборки"><select value={project.samplingMethod} onChange={(e) => update("samplingMethod", e.target.value)}><option value="convenience">Доступная</option><option value="purposeful">Целевая</option><option value="snowball">Снежный ком</option><option value="stratified">Стратифицированная</option><option value="cluster">Кластерная</option><option value="probability">Вероятностная</option><option value="theoretical">Теоретическая / информационная</option></select></Field>
      <Field label="Запас на отсев, %"><input type="number" min={0} max={90} value={project.attrition} onChange={(e) => update("attrition", Number(e.target.value))} /></Field>
      <Field label="Стратегия набора" wide><textarea rows={3} placeholder="Где искать участников, как приглашать, будет ли вознаграждение" value={project.recruitment} onChange={(e) => update("recruitment", e.target.value)} /></Field>
    </div><div className="calculator">
      <span className="eyebrow eyebrow--light">Оценка для планирования</span><h3>Размер выборки</h3><p>Ориентир, не замена расчёту мощности под конкретный статистический тест.</p>
      {!nonPower && <><Field label="Ожидаемый эффект"><select value={project.sampleEffect} onChange={(e) => update("sampleEffect", e.target.value)}><option value="small">Малый</option><option value="medium">Средний</option><option value="large">Большой</option></select></Field><Field label="Желаемая мощность"><select value={project.samplePower} onChange={(e) => update("samplePower", Number(e.target.value))}><option value={0.8}>0,80</option><option value={0.9}>0,90</option></select></Field><div className="estimate"><span>грубый ориентир</span><strong>≈ {estimated}</strong><small>завершённых наблюдений</small></div></>}
      {nonPower && <div className="estimate estimate--text"><strong>{project.pathway === "qualitative" ? "Информационная достаточность" : project.pathway === "review" ? "Корпус источников" : "Модель измерения"}</strong><small>{project.pathway === "qualitative" ? "Обоснуйте разнообразие случаев, глубину материала и информационную силу." : project.pathway === "review" ? "Число определяется поиском и критериями, а не мощностью участников." : "Планируйте под сложность факторной модели, точность и независимую проверку."}</small></div>}
      <Field label="Плановый объём"><input type="number" min={1} value={project.sampleSize} onChange={(e) => update("sampleSize", Number(e.target.value))} /></Field>
      <p className="calculator__note">При отсеве {project.attrition}% пригласите не менее ≈ {invitationTarget}. Не меняйте правило остановки после просмотра основных эффектов.</p>
    </div></div>
    <Tip>Для итогового обоснования укажите тест, ожидаемый эффект и его источник, α, мощность, число групп/предикторов и запас на потерю данных.</Tip>
  </section>;
}

function MethodsStep({ project, update, search, setSearch, totalMinutes, category, setCategory, categories }: StepProps & { search: string; setSearch: (v: string) => void; totalMinutes: number; category: string; setCategory: (v: string) => void; categories: string[] }) {
  const filtered = methodBank.filter((m) => (category === "Все" || m.category === category) && `${m.name} ${m.role} ${m.fit}`.toLowerCase().includes(search.toLowerCase()));
  const selected = new Set(project.methods.map((m) => m.id));
  const toggle = (method: MethodItem) => update("methods", selected.has(method.id) ? project.methods.filter((m) => m.id !== method.id) : [...project.methods, method]);
  return <section className="content-section step-page"><SectionHead eyebrow="Блок 07" title="Подберите методы, а не коллекцию тестов" text="Для каждой переменной нужен показатель, процедура подсчёта, доказательства качества версии и право использования. Банк — карта поиска, а не разрешение и не диагностический ключ." />
    <div className="method-summary"><div><strong>{project.methods.length}</strong><span>инструментов</span></div><div><strong>≈ {totalMinutes}</strong><span>минут без инструкции</span></div><div><strong>{totalMinutes <= 20 ? "комфортно" : totalMinutes <= 35 ? "на границе" : "перегруз"}</strong><span>нагрузка участника</span></div></div>
    <div className="method-filters"><div className="search-box"><Search size={18} /><input aria-label="Поиск методик" placeholder="Найти по названию или конструкту" value={search} onChange={(e) => setSearch(e.target.value)} /></div><div className="chip-row">{categories.map((item) => <button key={item} className={category === item ? "chip chip--active" : "chip"} onClick={() => setCategory(item)}>{item}</button>)}</div></div>
    <div className="method-grid">{filtered.map((method) => <article className={selected.has(method.id) ? "method-card method-card--selected" : "method-card"} key={method.id}><div className="method-card__top"><span>{method.category} · {method.role}</span><b>{method.minutes} мин</b></div><h3>{method.name}</h3><p>{method.source} · {method.items}</p><dl><div><dt>Подходит для</dt><dd>{method.fit}</dd></div><div><dt>Осторожно</dt><dd>{method.caution}</dd></div></dl><div className="method-card__actions"><a href={method.url} target="_blank" rel="noreferrer" aria-label={`Источник ${method.name}`}><BookOpen size={16} /></a><button className={selected.has(method.id) ? "button button--soft" : "button button--ink"} onClick={() => toggle(method)}>{selected.has(method.id) ? <><Check size={16} /> В батарее</> : <><Plus size={16} /> Добавить</>}</button></div></article>)}</div>
    <div className="empty-method"><div><Plus /><div><strong>Не нашли инструмент?</strong><p>Добавьте запись вручную и затем проверьте источник, адаптацию, надёжность, валидность и право использования.</p></div></div><button className="button button--ghost" onClick={() => { const name = window.prompt("Название методики"); if (name) update("methods", [...project.methods, { id: uid(), name, minutes: 5, role: "Пользовательская", source: "Источник требуется уточнить", category: "Пользовательская", items: "Уточнить", fit: "Уточнить соответствие конструкту", caution: "Не использовать до проверки адаптации, психометрики и лицензии.", url: "https://istina.msu.ru/" }]); }}>Добавить свою</button></div>
  </section>;
}

function ProtocolStep({ project, update }: StepProps) {
  const items = ["Вопросы и гипотезы", "Первичный исход", "Размер и правило остановки", "Критерии исключения", "Процедура и порядок", "Основной анализ", "Пропуски и выбросы", "Разведочные анализы отдельно"];
  const toggle = (item: string) => update("preregistrationChecks", project.preregistrationChecks.includes(item) ? project.preregistrationChecks.filter((v) => v !== item) : [...project.preregistrationChecks, item]);
  return <section className="content-section step-page"><SectionHead eyebrow="Блок 08" title="Сделайте процедуру воспроизводимой" text="Другой исследователь должен понять, что происходит с участником или материалом от приглашения до готовой таблицы — без догадок и устных уточнений." />
    <div className="protocol-flow">{["Приглашение", "Согласие", "Инструкция", "Задания", "Дебрифинг", "Подготовка данных"].map((item, i) => <span key={item}><b>{i + 1}</b>{item}</span>)}</div>
    <div className="form-card form-grid"><Field label="Пошаговая процедура" hint="Порядок, длительность, рандомизация, перерывы, инструкции, дебрифинг" wide><textarea rows={7} value={project.procedure} onChange={(e) => update("procedure", e.target.value)} /></Field><Field label="Пилотирование" hint="Что проверяете и что будет основанием для изменения"><textarea rows={4} value={project.pilotPlan} onChange={(e) => update("pilotPlan", e.target.value)} /></Field><Field label="Правило завершения сбора" hint="Фиксированный N, дата или обоснованный критерий достаточности"><textarea rows={4} value={project.stoppingRule} onChange={(e) => update("stoppingRule", e.target.value)} /></Field></div>
    <div className="prereg-card"><div><span className="eyebrow">До просмотра исходов</span><h3>Пакет пререгистрации</h3><p>{project.preregistrationChecks.length} из {items.length} решений зафиксировано</p></div><div>{items.map((item) => <label className="light-check" key={item}><input type="checkbox" checked={project.preregistrationChecks.includes(item)} onChange={() => toggle(item)} /><span><Check size={14} /></span>{item}</label>)}</div></div>
    <Tip>Изменить план можно. Нельзя скрыть изменение: отметьте, что и почему было изменено, и отделите подтверждающий анализ от разведочного.</Tip>
  </section>;
}

function AnalysisStep({ project, update }: StepProps) {
  const outcomeScale = project.variables.find((variable) => variable.role === "outcome")?.scale || "quantitative";
  const suggestedId = project.pathway === "qualitative" ? "qualitative" : outcomeScale === "nominal" ? "categorical" : project.comparisonStructure === "association" ? "correlation" : project.comparisonStructure === "paired" ? "paired" : project.comparisonStructure === "repeated" ? "repeated" : project.groupCount === "2" ? "groups" : project.groupCount === "3+" ? "anova" : "regression";
  const suggestedAnalysis = analysisGuide.find((item) => item.id === suggestedId) || analysisGuide[0];
  return <section className="content-section step-page"><SectionHead eyebrow="Блок 09" title="Решите, как данные ответят на вопрос" text="Статистика — инструмент содержательной проверки психологической гипотезы. Зафиксируйте первичный исход, модель и границы интерпретации до просмотра результатов." />
    <div className="statlab-note"><Microscope /><div><span className="eyebrow eyebrow--light">Логика StatLab, усиленная методологией</span><h3>Сначала структура вопроса — потом название критерия</h3><p>Из StatLab перенесена полезная карта выбора анализа, но не загрузка данных. Конструктор принципиально не принимает таблицы участников. Тест нормальности не является автоматическим переключателем «параметрика / непараметрика»: важны дизайн, шкала, зависимость наблюдений, остатки, дисперсии, объём и устойчивость вывода.</p></div></div>
    <div className="decision-builder">
      <div className="form-card form-grid">
        <Field label="Структура вопроса"><select value={project.comparisonStructure} onChange={(e) => update("comparisonStructure", e.target.value)}><option value="association">Связь / прогноз</option><option value="independent">Независимые группы</option><option value="paired">Два связанных измерения</option><option value="repeated">Повторы / вложенность</option></select></Field>
        <Field label="Групп или условий"><select value={project.groupCount} onChange={(e) => update("groupCount", e.target.value)}><option value="1">Одна / непрерывный предиктор</option><option value="2">Две</option><option value="3+">Три и более</option></select></Field>
        <div className="decision-fact"><span>Шкала исхода</span><strong>{outcomeScale === "nominal" ? "Номинальная" : outcomeScale === "ordinal" ? "Порядковая" : "Количественная"}</strong><small>Берётся из переменной с ролью «исход»</small></div>
      </div>
      <div className="decision-result"><span>Стартовая модель</span><h3>{suggestedAnalysis.title}</h3><p><b>Основной ориентир:</b> {suggestedAnalysis.parametric}</p><p><b>Альтернатива:</b> {suggestedAnalysis.robust}</p><small>Это подсказка к обоснованию, не автоматическое решение.</small><button className="button button--amber" onClick={() => { update("analysis", suggestedAnalysis.id); update("effectMeasure", suggestedAnalysis.effect); }}>Выбрать и доработать</button></div>
    </div>
    <div className="decision-stages">{statDecisionStages.map((stage) => <article key={stage.number}><b>{stage.number}</b><div><strong>{stage.title}</strong><p>{stage.text}</p></div></article>)}</div>
    <div className="form-card form-grid"><Field label="Первичный исход" hint="Конкретный показатель главного вывода" wide><textarea rows={2} placeholder="Например: суммарный балл академического стресса" value={project.primaryOutcome} onChange={(e) => update("primaryOutcome", e.target.value)} /></Field><Field label="Вторичные исходы" hint="Отделите от главного и разведочного"><textarea rows={3} value={project.secondaryOutcomes} onChange={(e) => update("secondaryOutcomes", e.target.value)} /></Field><Field label="Уровень значимости"><select value={project.alpha} onChange={(e) => update("alpha", e.target.value)}><option>0,05</option><option>0,01</option><option>0,10</option></select></Field><Field label="Размер эффекта и интервал"><textarea rows={3} placeholder="r и 95% ДИ; d Хеджеса и 95% ДИ…" value={project.effectMeasure} onChange={(e) => update("effectMeasure", e.target.value)} /></Field><Field label="Общая диагностика и робастный вариант" wide><textarea rows={4} value={project.assumptionPlan} onChange={(e) => update("assumptionPlan", e.target.value)} /></Field><Field label="Форма распределения и остатки" hint="Графики, остатки и влияние, а не только Shapiro—Wilk" wide><textarea rows={3} value={project.normalityAssessment} onChange={(e) => update("normalityAssessment", e.target.value)} /></Field><Field label="Дисперсии и зависимость" hint="Уэлч, повторные измерения, вложенность, сферичность" wide><textarea rows={3} value={project.varianceAssessment} onChange={(e) => update("varianceAssessment", e.target.value)} /></Field><Field label="Множественные проверки" wide><textarea rows={3} value={project.correctionPlan} onChange={(e) => update("correctionPlan", e.target.value)} /></Field><Field label="Пропущенные значения" wide><textarea rows={3} value={project.missingData} onChange={(e) => update("missingData", e.target.value)} /></Field></div>
    <div className="subsection-head"><div><span className="eyebrow">Шпаргалка выбора</span><h3>Основной анализ</h3></div></div>
    <div className="analysis-grid">{analysisGuide.map((option) => <button key={option.id} className={project.analysis === option.id ? "analysis-card analysis-card--active" : "analysis-card"} onClick={() => { update("analysis", option.id); if (!project.effectMeasure) update("effectMeasure", option.effect); }}><span className="choice-card__radio">{project.analysis === option.id && <i />}</span><strong>{option.title}</strong><p>{option.question}</p><small><b>Основной:</b> {option.parametric}<br/><b>Робастный:</b> {option.robust}<br/><b>Отчёт:</b> {option.effect}</small></button>)}</div>
    <div className="analysis-plan"><span className="eyebrow eyebrow--light">Минимальный отчёт</span><h3>Не ограничивайтесь p-значением</h3><div><span><b>1</b>Описательная статистика и качество данных</span><span><b>2</b>Эффект с доверительным интервалом</span><span><b>3</b>Проверка предпосылок и чувствительности</span><span><b>4</b>Ограничения и альтернативные объяснения</span></div></div>
    <Tip>Если проверяется много гипотез или исходов, заранее определите основной анализ и семейство тестов. Не выбирайте критерий после сравнения p-значений разных вариантов.</Tip>
  </section>;
}

function EthicsStep({ project, update, copyConsent }: StepProps & { copyConsent: () => void }) {
  const toggle = (item: string) => update("ethicsChecks", project.ethicsChecks.includes(item) ? project.ethicsChecks.filter((v) => v !== item) : [...project.ethicsChecks, item]);
  const generate = () => update("consent", `Вас приглашают принять участие в исследовании «${project.title}». Цель исследования: ${project.aim || "[укажите цель]"}. Участие добровольное и займёт около ${Math.max(5, project.methods.reduce((s, m) => s + m.minutes, 0))} минут. ${project.risk || "[опишите возможные неудобства и способы их минимизации]"} ${project.withdrawal} ${project.storage} Перед началом вы сможете задать вопросы исследователю. Нажимая «Согласен(на)», вы подтверждаете, что прочитали информацию, достигли необходимого возраста и добровольно соглашаетесь участвовать.`);
  return <section className="content-section step-page"><SectionHead eyebrow="Блок 10" title="Защитите участника, данные и исследование" text="Этика — это не одна галочка. Собирайте только необходимое, разделяйте идентификаторы и ответы, ограничивайте доступ и заранее определяйте проверяемое удаление." />
    <div className="data-ban"><ShieldCheck /><div><b>В конструктор запрещено вводить данные участников</b><p>Здесь должны быть только план, формулировки и методические решения. Не вставляйте ФИО, контакты, ответы, идентификаторы, медицинские сведения или выгрузки исследования.</p></div></div>
    <div className="ethics-layout"><div className="checklist"><div className="subsection-head"><div><span className="eyebrow">Минимум до запуска</span><h3>{project.ethicsChecks.length} / {ethicsItems.length} пунктов</h3></div></div>{ethicsItems.map((item) => <label className="check-item" key={item}><input type="checkbox" checked={project.ethicsChecks.includes(item)} onChange={() => toggle(item)} /><span className="fake-check"><Check size={14} /></span><span>{item}</span></label>)}</div><div className="form-card form-grid"><Field label="Риски и дискомфорт" wide><textarea rows={4} placeholder="Эмоциональный дискомфорт, усталость, чувствительные вопросы; как снижаете риск?" value={project.risk} onChange={(e) => update("risk", e.target.value)} /></Field><Field label="Минимальный состав данных" wide><textarea rows={4} value={project.dataTypes} onChange={(e) => update("dataTypes", e.target.value)} /></Field><Field label="Хранение и защита" wide><textarea rows={4} value={project.storage} onChange={(e) => update("storage", e.target.value)} /></Field><Field label="Кто имеет доступ" wide><textarea rows={3} value={project.accessRoles} onChange={(e) => update("accessRoles", e.target.value)} /></Field><Field label="Срок хранения" wide><textarea rows={3} value={project.retentionPeriod} onChange={(e) => update("retentionPeriod", e.target.value)} /></Field><Field label="Отказ участника и удаление его данных" wide><textarea rows={3} value={project.withdrawal} onChange={(e) => update("withdrawal", e.target.value)} /></Field><Field label="Проверяемое уничтожение" wide><textarea rows={4} value={project.deletionPlan} onChange={(e) => update("deletionPlan", e.target.value)} /></Field><Field label="План реакции на инцидент" wide><textarea rows={4} value={project.incidentPlan} onChange={(e) => update("incidentPlan", e.target.value)} /></Field></div></div>
    <div className="storage-inventory"><div><span>Что хранит этот сайт</span><b>Один локальный JSON-проект</b><p>Ключи: <code>{STORAGE_KEY}</code> и удаляемый при очистке прежний <code>{LEGACY_STORAGE_KEY}</code>.</p></div><div><span>Чего сайт не делает</span><b>Нет аккаунта, облачной базы и аналитики проекта</b><p>Данные формы остаются в localStorage этого браузера, пока вы не удалите их или хранилище сайта.</p></div><div><span>Как удалить</span><b>«Удалить данные проекта»</b><p>Кнопка удаляет оба ключа конструктора и проверяет их отсутствие. Экспортированный вами JSON удаляется отдельно.</p></div></div>
    <div className="consent-builder"><div className="subsection-head"><div><span className="eyebrow">Черновик документа</span><h3>Информированное согласие</h3></div><div className="button-row"><button className="button button--soft" onClick={generate}><Sparkles size={16} /> Собрать из проекта</button><button className="button button--ghost" disabled={!project.consent} onClick={copyConsent}><Copy size={16} /> Копировать</button></div></div><textarea rows={10} placeholder="Соберите черновик кнопкой или напишите свой текст…" value={project.consent} onChange={(e) => update("consent", e.target.value)} /></div>
    <Tip>Для несовершеннолетних, клинических групп, обмана в процедуре или чувствительных тем нужен отдельный разбор рисков и требований вашей организации.</Tip>
  </section>;
}

function ReportStep({ project, update, readiness, exportDocx }: StepProps & { readiness: number; exportDocx: () => void }) {
  const standard = reportingStandards.find((item) => item.id === project.reportingStandard);
  const localVolume = project.level === "Курсовая работа" ? "45–50 страниц" : project.level === "ВКР бакалавра" ? "50–60 страниц" : project.level === "Курсовая работа магистра" ? "40–45 страниц" : project.level === "Магистерская диссертация" ? "70–80 страниц" : "определяется форматом издания";
  return <section className="content-section step-page"><SectionHead eyebrow="Блок 11" title="Спроектируйте отчёт и защиту заранее" text="Сильный текст показывает движение от теоретической проблемы к данным и обратно. Стандарт отчётности помогает не потерять детали, но не заменяет требования кафедры." />
    <div className="local-report-head"><div><span className="eyebrow eyebrow--light">Профиль филиала МГУ · протокол 2023</span><h3>{project.level}: {localVolume}</h3><p>Основной текст без приложений. Научный стиль, без первого лица единственного числа; допуск к защите предполагает проверку оригинальности.</p></div><small>Перед сдачей сверить текущую редакцию</small></div>
    <div className="branch-report-grid">{[
      ["01", "Введение · 1,5–2 стр.", "Актуальность → проблема → цель → объект/предмет → задачи → гипотезы → методология → методы → значимость"],
      ["02", "Теоретическая глава", "Понятия → подходы → классика + последние 5 лет + иностранные работы → противоречия → авторская позиция → выводы"],
      ["03", "Программа эмпирики", "Методологический раздел: интерпретация и операционализация. Процедурный: дизайн, выборка, методы, порядок"],
      ["04", "Результаты и анализ", "Качество инструментов → выборка/описания → каждая гипотеза → эффект и ДИ → отдельный разведочный анализ"],
      ["05", "Интерпретация", "Статистика → психологические механизмы → теория и литература → альтернативы/артефакты → практический смысл"],
      ["06", "Выводы и заключение", "5–7 содержательных выводов без p; затем цель/задачи, ограничения, значимость и перспективы"],
    ].map(([number, title, text]) => <article key={number}><b>{number}</b><div><strong>{title}</strong><p>{text}</p></div></article>)}</div>
    <div className="conflict-note"><CircleHelp /><p><b>Есть расхождение в ваших материалах.</b> Протокол 2023 задаёт для заключения 1–2 страницы, рабочий план 2025 — 2–3. Используйте указание, которое письменно подтвердит руководитель/кафедра.</p></div>
    <div className="report-structure">{[["Введение", "Проблема → теория → пробел → цель"], ["Метод", "Участники → дизайн → инструменты → процедура"], ["Результаты", "Качество данных → основной эффект → чувствительность"], ["Обсуждение", "Смысл → альтернативы → границы → следующий шаг"]].map(([title, text], i) => <article key={title}><b>{String(i + 1).padStart(2, "0")}</b><strong>{title}</strong><p>{text}</p></article>)}</div>
    <div className="subsection-head"><div><span className="eyebrow">Полнота описания</span><h3>Стандарт отчётности</h3></div></div>
    <div className="standards-grid">{reportingStandards.map((item) => <button key={item.id} className={project.reportingStandard === item.id ? "standard-card standard-card--active" : "standard-card"} onClick={() => update("reportingStandard", item.id)}><span>{project.reportingStandard === item.id && <Check size={15} />}</span><strong>{item.title}</strong><p>{item.fit}</p><small>{item.checks}</small></button>)}</div>
    {standard && <a className="standard-link" href={standard.url} target="_blank" rel="noreferrer">Открыть официальный чек-лист {standard.title} <ArrowRight size={16} /></a>}
    <div className="form-card form-grid"><Field label="Ограничения и угрозы валидности" hint="Что данные не позволяют утверждать и почему" wide><textarea rows={5} value={project.limitations} onChange={(e) => update("limitations", e.target.value)} /></Field><Field label="Распространение и обратная связь" hint="Кому, в каком виде и без каких идентификаторов сообщаются результаты" wide><textarea rows={4} value={project.dissemination} onChange={(e) => update("dissemination", e.target.value)} /></Field></div>
    <div className="defense-card"><div><span className="eyebrow eyebrow--light">Черновик к обсуждению</span><h3>{readiness}% структурной готовности</h3><p>Экспорт включает логику, литературу, модель переменных, протокол, этику, данные и план анализа.</p></div><button className="button button--amber" onClick={exportDocx}><Download size={17} /> Скачать DOCX</button></div>
  </section>;
}

function AuditStep({ project, audit, readiness, go, exportDocx, signals }: { project: Project; audit: { label: string; ok: boolean; step: StepId; group?: string }[]; readiness: number; go: (id: StepId) => void; exportDocx: () => void; signals: { level: "critical" | "warning" | "good"; title: string; text: string; step: StepId }[] }) {
  const critical = audit.filter((item) => !item.ok);
  return <section className="content-section step-page"><SectionHead eyebrow="Блок 12" title="Аудит связности проекта" text="Это не оценка научной истины, а проверка каркаса: каждый сильный вывод должен иметь вопрос, данные, метод и прозрачное ограничение." />
    <div className="audit-hero"><div className="audit-ring" style={{ "--score": `${readiness * 3.6}deg` } as React.CSSProperties}><span><b>{readiness}%</b><small>готовность</small></span></div><div><span className="eyebrow eyebrow--light">Диагностика</span><h3>{readiness >= 85 ? "Проект можно выносить на предметное обсуждение" : readiness >= 55 ? "Основа есть — закройте критические разрывы" : "Сначала соберите обязательный каркас"}</h3><p>{project.title}</p><button className="button button--amber" onClick={exportDocx}><FileText size={17} /> Скачать проект</button></div></div>
    {signals.length > 0 && <div className="signal-list">{signals.map((signal) => <button key={signal.title} className={`signal-card signal-card--${signal.level}`} onClick={() => go(signal.step)}><span>{signal.level === "critical" ? "Критично" : signal.level === "warning" ? "Проверить" : "Хорошо"}</span><strong>{signal.title}</strong><p>{signal.text}</p><ArrowRight size={17} /></button>)}</div>}
    <div className="audit-list">{audit.map((item) => <button key={item.label} className={item.ok ? "audit-item audit-item--ok" : "audit-item"} onClick={() => go(item.step)}><span>{item.ok ? <Check size={16} /> : <span>!</span>}</span><strong><small>{item.group}</small>{item.label}</strong><em>{item.ok ? "готово" : "доработать"}</em><ArrowRight size={17} /></button>)}</div>
    <div className="killer-questions"><span className="eyebrow">Вопросы перед встречей</span><h3>Проверьте себя как строгий рецензент</h3><div>{[
      "Какой именно факт заставит отказаться от главной гипотезы?",
      "Почему выбранный метод измеряет нужный конструкт, а не соседний?",
      "На кого нельзя переносить полученный вывод?",
      "Какое альтернативное объяснение результата наиболее вероятно?",
      "Какие решения были приняты до, а какие — после просмотра данных?",
      critical.length ? `Что мешает закрыть пункт: «${critical[0].label}»?` : "Что научный руководитель, вероятнее всего, попросит уточнить?",
    ].map((q, i) => <p key={q}><b>{String(i + 1).padStart(2, "0")}</b>{q}</p>)}</div></div>
    <div className="audit-disclaimer"><ShieldCheck /><p><b>Важно</b>Конструктор помогает проектировать и замечать разрывы, но не заменяет консультацию научного руководителя, локальные методические требования и решение этического комитета.</p></div>
  </section>;
}

function KnowledgeCenter({ search, setSearch, tab, setTab, close }: { search: string; setSearch: (v: string) => void; tab: KnowledgeTab; setTab: (v: KnowledgeTab) => void; close: () => void }) {
  const q = search.toLowerCase();
  return <div className="knowledge-overlay" role="dialog" aria-modal="true" aria-label="Справочник исследования"><button className="knowledge-scrim" onClick={close} aria-label="Закрыть справочник" /><aside className="knowledge-panel"><div className="knowledge-head"><div><span className="eyebrow">Живой справочник</span><h2>Методология, требования, методы</h2></div><button className="icon-button" onClick={close} aria-label="Закрыть"><X /></button></div><div className="knowledge-tabs"><button className={tab === "terms" ? "active" : ""} onClick={() => setTab("terms")}>Термины</button><button className={tab === "branch" ? "active" : ""} onClick={() => setTab("branch")}>Филиал МГУ</button><button className={tab === "experiment" ? "active" : ""} onClick={() => setTab("experiment")}>Эксперимент</button><button className={tab === "methods" ? "active" : ""} onClick={() => setTab("methods")}>Методы</button><button className={tab === "standards" ? "active" : ""} onClick={() => setTab("standards")}>Стандарты</button></div><div className="search-box"><Search size={18} /><input autoFocus value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Найти требование, понятие, метод или угрозу" /></div><div className="knowledge-results">
    {tab === "terms" && glossary.filter((item) => `${item.term} ${item.category} ${item.definition}`.toLowerCase().includes(q)).map((item) => <article key={item.term}><span>{item.category}</span><strong>{item.term}</strong><p>{item.definition}</p><small>Пример: {item.example}</small></article>)}
    {tab === "methods" && methodBank.filter((item) => `${item.name} ${item.role} ${item.category}`.toLowerCase().includes(q)).map((item) => <article key={item.id}><span>{item.category}</span><strong>{item.name}</strong><p>{item.fit}</p><small>{item.caution}</small></article>)}
    {tab === "standards" && reportingStandards.filter((item) => `${item.title} ${item.fit}`.toLowerCase().includes(q)).map((item) => <article key={item.id}><span>Отчётность</span><strong>{item.title}</strong><p>{item.fit}</p><a href={item.url} target="_blank" rel="noreferrer">Официальный источник <ArrowRight size={14} /></a></article>)}
    {tab === "branch" && branchRequirements.filter((item) => `${item.group} ${item.title} ${item.details} ${item.status}`.toLowerCase().includes(q)).map((item) => <article key={`${item.group}-${item.title}`} className={item.status === "Сверить" ? "knowledge-warning" : ""}><span>{item.group} · {item.status}</span><strong>{item.title}</strong><p>{item.details}</p></article>)}
    {tab === "experiment" && <>{experimentNorms.filter((item) => `${item.title} ${item.text}`.toLowerCase().includes(q)).map((item) => <article key={item.title}><span>Норма экспериментирования</span><strong>{item.title}</strong><p>{item.text}</p></article>)}{experimentThreats.filter((item) => `${item.title} ${item.diagnostic} ${item.control} ${item.validity}`.toLowerCase().includes(q)).map((item) => <article key={item.id}><span>{item.validity} валидность</span><strong>{item.title}</strong><p>{item.diagnostic}</p><small>Контроль: {item.control}</small></article>)}</>}
  </div><p className="knowledge-note">Профиль филиала основан на протоколе кафедры № 3 от 28.09.2023 и рабочем плане 2025 года. Справочник не заменяет актуальные указания кафедры, проверку адаптации/лицензии метода и решение научного руководителя.</p></aside></div>;
}
