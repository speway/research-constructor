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
  Command,
  Copy,
  Download,
  FileJson,
  FileText,
  FlaskConical,
  Gauge,
  HeartHandshake,
  EyeOff,
  Info,
  Layers3,
  LayoutDashboard,
  LibraryBig,
  ListChecks,
  LockKeyhole,
  Menu,
  Microscope,
  Network,
  Plus,
  Redo2,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  Trash2,
  Undo2,
  Upload,
  Users,
  WandSparkles,
  X,
} from "lucide-react";
import { ChangeEvent, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { analysisGuide, branchRequirements, dataSafetyLevels, experimentDesigns, experimentNorms, experimentThreats, glossary, methodBank, reportingStandards, researchPathways, statDecisionStages, theoryFrameworks } from "./research-data";
import type { MethodInfo } from "./research-data";
import { analyzeTopic, experimentReadiness, findRepeatedIdentifierPath, findRestrictedDatasetPath } from "./research-logic";
import type { TopicProfile } from "./research-logic";
import { buildRecruitmentStressScenario, evidenceHealth } from "./research-metrics";
import { clearProjectStorage, LEGACY_STORAGE_KEY, STORAGE_KEY } from "./storage";

type StepId = "overview" | "logic" | "evidence" | "variables" | "design" | "sample" | "methods" | "protocol" | "analysis" | "ethics" | "report" | "audit";
type Hypothesis = { id: string; text: string; type: "directional" | "non-directional" | "null" };
type MethodItem = MethodInfo;
type KnowledgeTab = "terms" | "standards" | "methods" | "branch" | "experiment";
type VariableItem = { id: string; name: string; role: "predictor" | "outcome" | "mediator" | "moderator" | "covariate"; definition: string; indicator: string; scale: "nominal" | "ordinal" | "quantitative"; instrument: string };
type EvidenceItem = { id: string; citation: string; year: number; design: string; sample: string; finding: string; limitation: string; relevance: string; stance: "supports" | "mixed" | "contradicts" | "context" };
type DecisionItem = { id: string; date: string; decision: string; rationale: string; timing: "before-data" | "after-data"; status: "planned" | "adopted" | "revised" };
type Project = {
  title: string;
  level: string;
  requirementProfile: TopicProfile;
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
  evidenceItems: EvidenceItem[];
  variables: VariableItem[];
  confounds: string;
  design: string;
  time: string;
  setting: string;
  designRationale: string;
  manipulation: string;
  experimentStructure: string;
  controlCondition: string;
  counterbalancing: string;
  assignmentPlan: string;
  blindingPlan: string;
  manipulationCheck: string;
  fidelityPlan: string;
  debriefPlan: string;
  softwarePlan: string;
  trialPlan: string;
  qualityRules: string;
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
  expectedInvalidRate: number;
  recruitmentPerWeek: number;
  recruitment: string;
  methods: MethodItem[];
  procedure: string;
  pilotPlan: string;
  stoppingRule: string;
  preregistrationChecks: string[];
  decisionLog: DecisionItem[];
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
  dataSensitivity: string;
  retentionPeriod: string;
  accessRoles: string;
  deletionPlan: string;
  incidentPlan: string;
  withdrawal: string;
  consent: string;
  reportingStandard: string;
  limitations: string;
  dissemination: string;
  reviewResponses: Record<string, string>;
};

const defaultProject: Project = {
  title: "Новое исследование",
  level: "Исследовательский проект",
  requirementProfile: "universal",
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
  evidenceItems: [],
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
  experimentStructure: "between",
  controlCondition: "",
  counterbalancing: "",
  assignmentPlan: "",
  blindingPlan: "",
  manipulationCheck: "",
  fidelityPlan: "",
  debriefPlan: "",
  softwarePlan: "",
  trialPlan: "",
  qualityRules: "",
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
  expectedInvalidRate: 10,
  recruitmentPerWeek: 25,
  recruitment: "",
  methods: [],
  procedure: "",
  pilotPlan: "",
  stoppingRule: "Сбор завершается после достижения запланированного числа завершённых наблюдений; промежуточный просмотр основных эффектов не проводится.",
  preregistrationChecks: [],
  decisionLog: [],
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
  dataSensitivity: "internal",
  retentionPeriod: "До защиты и завершения возможной проверки результатов, затем безопасное удаление в срок, согласованный с научным руководителем и организацией.",
  accessRoles: "Только исследователь и научный руководитель; доступ выдаётся персонально и не передаётся третьим лицам.",
  deletionPlan: "Рабочие копии, корзина и резервные копии удаляются по журналу; после удаления проверяется отсутствие файлов во всех согласованных местах хранения.",
  incidentPlan: "При ошибочной публикации или утрате контроля над данными: прекратить доступ, сообщить руководителю и ответственному подразделению, задокументировать инцидент и оценить риск для участников.",
  withdrawal: "Участник может прекратить заполнение без объяснения причин до отправки формы.",
  consent: "",
  reportingStandard: "jars-quant",
  limitations: "",
  dissemination: "Результаты будут представлены в учебной работе и на защите в обобщённом виде без идентификации участников.",
  reviewResponses: {},
};

type ProjectTemplate = {
  id: string;
  title: string;
  label: string;
  description: string;
  patch: Partial<Project>;
};

const projectTemplates: ProjectTemplate[] = [
  {
    id: "survey",
    title: "Связи и предикторы",
    label: "Опросное исследование",
    description: "Корреляционный проект: конструкты, операционализация, выборка и регрессионная логика.",
    patch: { pathway: "quantitative", design: "correlational", time: "cross-sectional", setting: "online", comparisonStructure: "association", groupCount: "1", sampleSize: 180, analysis: "regression", reportingStandard: "jars-quant" },
  },
  {
    id: "experiment",
    title: "Причинная проверка",
    label: "Эксперимент",
    description: "Воздействие, контрольное условие, распределение, fidelity и проверка манипуляции.",
    patch: { pathway: "quantitative", design: "experimental", time: "cross-sectional", setting: "lab", experimentStructure: "between", comparisonStructure: "independent", groupCount: "2", sampleSize: 140, analysis: "groups", reportingStandard: "consort" },
  },
  {
    id: "qualitative",
    title: "Опыт и смыслы",
    label: "Качественный проект",
    description: "Открытый вопрос, обоснованный отбор, интервью или наблюдение и прозрачная аналитическая позиция.",
    patch: { pathway: "qualitative", design: "qualitative", time: "cross-sectional", setting: "hybrid", comparisonStructure: "association", groupCount: "1", sampleSize: 18, analysis: "qualitative", reportingStandard: "jars-qual", hypotheses: [{ id: "h1", text: "", type: "non-directional" }] },
  },
  {
    id: "mixed",
    title: "Два слоя данных",
    label: "Смешанный дизайн",
    description: "Количественная картина плюс качественное объяснение с заранее заданной точкой интеграции.",
    patch: { pathway: "mixed", design: "mixed", time: "cross-sectional", setting: "hybrid", comparisonStructure: "association", groupCount: "1", sampleSize: 160, analysis: "regression", reportingStandard: "jars-mixed" },
  },
  {
    id: "longitudinal",
    title: "Изменение во времени",
    label: "Лонгитюд",
    description: "Повторные измерения, отсев, временная логика и модель зависимых наблюдений.",
    patch: { pathway: "quantitative", design: "longitudinal", time: "longitudinal", setting: "hybrid", comparisonStructure: "repeated", groupCount: "1", sampleSize: 150, attrition: 25, analysis: "repeated", reportingStandard: "jars-quant" },
  },
];

const reviewerQuestions = [
  { id: "falsification", lens: "Опровержимость", question: "Какой результат заставит отказаться от главной гипотезы, а не придумать объяснение задним числом?" },
  { id: "construct", lens: "Конструктная валидность", question: "Почему выбранный показатель измеряет именно нужный психологический конструкт, а не его удобный суррогат?" },
  { id: "alternative", lens: "Альтернативы", question: "Какое конкурирующее объяснение результата сейчас самое сильное и чем дизайн его ослабляет?" },
  { id: "transfer", lens: "Границы переноса", question: "На какие группы, ситуации и периоды этот вывод нельзя переносить?" },
  { id: "measurement", lens: "Ошибка измерения", question: "Что произойдёт с выводом при невысокой надёжности, потолочном эффекте или систематической ошибке ответа?" },
  { id: "analysis", lens: "Аналитическая устойчивость", question: "Сохранится ли вывод при разумной робастной модели, другом правиле пропусков и исключении влиятельных наблюдений?" },
  { id: "ethics", lens: "Этика", question: "Какой риск для участника легко недооценить и какое решение реально уменьшает его, а не просто описывает?" },
  { id: "feasibility", lens: "Реализуемость", question: "Что с наибольшей вероятностью сорвёт набор, процедуру или качество данных — и какой резервный план готов?" },
] as const;

const freshProject = () => JSON.parse(JSON.stringify(defaultProject)) as Project;

function sanitizeProject(value: unknown): Project {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Некорректная структура проекта");
  const incoming = value as Record<string, unknown>;
  const safe = freshProject() as unknown as Record<string, unknown>;
  const text = (item: unknown, fallback = "") => typeof item === "string" ? item.slice(0, 20_000) : fallback;
  for (const key of Object.keys(defaultProject)) {
    const candidate = incoming[key];
    const expected = safe[key];
    if (typeof candidate === "string" && typeof expected === "string") safe[key] = text(candidate);
    else if (typeof candidate === typeof expected && !Array.isArray(expected)) safe[key] = candidate;
    if (Array.isArray(expected) && Array.isArray(candidate)) safe[key] = candidate;
  }
  safe.tasks = (safe.tasks as unknown[]).filter((item): item is string => typeof item === "string").slice(0, 30);
  safe.databases = (safe.databases as unknown[]).filter((item): item is string => typeof item === "string").slice(0, 20);
  safe.ethicsChecks = (safe.ethicsChecks as unknown[]).filter((item): item is string => typeof item === "string").slice(0, 30);
  safe.preregistrationChecks = (safe.preregistrationChecks as unknown[]).filter((item): item is string => typeof item === "string").slice(0, 30);
  safe.experimentControls = (safe.experimentControls as unknown[]).filter((item): item is string => typeof item === "string").slice(0, experimentThreats.length);
  safe.sampleSize = Math.min(1_000_000, Math.max(1, Number(safe.sampleSize) || defaultProject.sampleSize));
  safe.attrition = Math.min(100, Math.max(0, Number(safe.attrition) || 0));
  safe.expectedInvalidRate = Math.min(95, Math.max(0, Number(safe.expectedInvalidRate) || 0));
  safe.recruitmentPerWeek = Math.min(1_000_000, Math.max(1, Number(safe.recruitmentPerWeek) || defaultProject.recruitmentPerWeek));
  safe.samplePower = Math.min(.999, Math.max(.5, Number(safe.samplePower) || defaultProject.samplePower));
  const records = (item: unknown) => Array.isArray(item) ? item.filter((entry): entry is Record<string, unknown> => Boolean(entry) && typeof entry === "object" && !Array.isArray(entry)) : [];
  const short = (item: unknown, fallback = "") => text(item, fallback).slice(0, 4_000);
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
  const currentYear = new Date().getFullYear();
  safe.evidenceItems = records(safe.evidenceItems).slice(0, 100).map((item) => ({
    id: short(item.id, uid()).slice(0, 80), citation: short(item.citation), year: Math.min(currentYear, Math.max(1900, Number(item.year) || currentYear)),
    design: short(item.design), sample: short(item.sample), finding: short(item.finding), limitation: short(item.limitation), relevance: short(item.relevance),
    stance: ["supports", "mixed", "contradicts", "context"].includes(short(item.stance)) ? short(item.stance) : "context",
  }));
  safe.decisionLog = records(safe.decisionLog).slice(0, 120).map((item) => ({
    id: short(item.id, uid()).slice(0, 80), date: short(item.date).slice(0, 10), decision: short(item.decision), rationale: short(item.rationale),
    timing: short(item.timing) === "after-data" ? "after-data" : "before-data",
    status: ["planned", "adopted", "revised"].includes(short(item.status)) ? short(item.status) : "planned",
  }));
  const responseSource = safe.reviewResponses && typeof safe.reviewResponses === "object" && !Array.isArray(safe.reviewResponses)
    ? safe.reviewResponses as Record<string, unknown>
    : {};
  safe.reviewResponses = Object.fromEntries(
    reviewerQuestions
      .map((item) => [item.id, text(responseSource[item.id])])
      .filter(([, answer]) => Boolean(answer)),
  );
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
  { id: "protocol", label: "Процедура и прозрачность", short: "Процедура", icon: ListChecks },
  { id: "analysis", label: "План анализа", short: "Анализ", icon: Microscope },
  { id: "ethics", label: "Этика и данные", short: "Этика", icon: HeartHandshake },
  { id: "report", label: "Отчёт и защита", short: "Отчёт", icon: FileText },
  { id: "audit", label: "Аудит готовности", short: "Аудит", icon: ClipboardCheck },
];

const workflowPhases: { title: string; text: string; ids: StepId[] }[] = [
  { title: "Замысел", text: "Проблема, теория и вопрос", ids: ["overview", "logic", "evidence"] },
  { title: "Модель", text: "Переменные, дизайн, выборка и методы", ids: ["variables", "design", "sample", "methods"] },
  { title: "Проведение", text: "Процедура, пререгистрация, этика и данные", ids: ["protocol", "ethics"] },
  { title: "Результат", text: "Анализ, отчёт и аудит связности", ids: ["analysis", "report", "audit"] },
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
  const [labOpen, setLabOpen] = useState(false);
  const [knowledgeSearch, setKnowledgeSearch] = useState("");
  const [knowledgeTab, setKnowledgeTab] = useState<KnowledgeTab>("terms");
  const [privateSession, setPrivateSession] = useState(false);
  const [privacyShield, setPrivacyShield] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [commandQuery, setCommandQuery] = useState("");
  const [lastSavedAt, setLastSavedAt] = useState("");
  const [saveWarning, setSaveWarning] = useState("");
  const [historyState, setHistoryState] = useState({ undo: 0, redo: 0 });
  const [toast, setToast] = useState("");
  const importRef = useRef<HTMLInputElement>(null);
  const suppressNextSaveRef = useRef(false);
  const undoStackRef = useRef<Project[]>([]);
  const redoStackRef = useRef<Project[]>([]);
  const historyKeyRef = useRef("");
  const projectRef = useRef<Project>(defaultProject);

  useEffect(() => { projectRef.current = project; }, [project]);

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
    if (!hydrated || privateSession) return;
    if (suppressNextSaveRef.current) {
      suppressNextSaveRef.current = false;
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
      const savedAt = new Intl.DateTimeFormat("ru", { hour: "2-digit", minute: "2-digit" }).format(new Date());
      queueMicrotask(() => { setLastSavedAt(savedAt); setSaveWarning(""); });
    } catch {
      queueMicrotask(() => setSaveWarning("Не удалось сохранить локально"));
    }
  }, [project, hydrated, privateSession]);

  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2400);
  };
  const remember = (snapshot: Project) => {
    undoStackRef.current = [...undoStackRef.current.slice(-39), snapshot];
    redoStackRef.current = [];
    setHistoryState({ undo: undoStackRef.current.length, redo: 0 });
  };
  const update = <K extends keyof Project>(key: K, value: Project[K]) => {
    const current = projectRef.current;
    if (historyKeyRef.current !== String(key)) remember(current);
    historyKeyRef.current = String(key);
    const next = { ...current, [key]: value };
    projectRef.current = next;
    setProject(next);
  };
  const replaceProject = (next: Project) => {
    remember(project);
    historyKeyRef.current = "";
    projectRef.current = next;
    setProject(next);
  };
  const undo = () => {
    const previous = undoStackRef.current.at(-1);
    if (!previous) return;
    undoStackRef.current = undoStackRef.current.slice(0, -1);
    redoStackRef.current = [...redoStackRef.current.slice(-39), projectRef.current];
    historyKeyRef.current = "";
    projectRef.current = previous;
    setProject(previous);
    setHistoryState({ undo: undoStackRef.current.length, redo: redoStackRef.current.length });
    notify("Последнее изменение отменено");
  };
  const redo = () => {
    const next = redoStackRef.current.at(-1);
    if (!next) return;
    redoStackRef.current = redoStackRef.current.slice(0, -1);
    undoStackRef.current = [...undoStackRef.current.slice(-39), projectRef.current];
    historyKeyRef.current = "";
    projectRef.current = next;
    setProject(next);
    setHistoryState({ undo: undoStackRef.current.length, redo: redoStackRef.current.length });
    notify("Изменение возвращено");
  };
  const undoActionRef = useRef(undo);
  const redoActionRef = useRef(redo);
  useEffect(() => {
    undoActionRef.current = undo;
    redoActionRef.current = redo;
  });

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const editing = target?.matches("input, textarea, select, [contenteditable='true']");
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandOpen(true);
        return;
      }
      if (editing || !(event.ctrlKey || event.metaKey)) return;
      if (event.key.toLowerCase() === "z" && event.shiftKey) { event.preventDefault(); redoActionRef.current(); }
      else if (event.key.toLowerCase() === "z") { event.preventDefault(); undoActionRef.current(); }
      else if (event.key.toLowerCase() === "y") { event.preventDefault(); redoActionRef.current(); }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);
  const methodMinutes = project.methods.reduce((sum, method) => sum + method.minutes, 0);
  const topicAnalysis = useMemo(() => analyzeTopic(project.topic, project.requirementProfile, project.design), [project.topic, project.requirementProfile, project.design]);
  const evidenceSummary = useMemo(() => evidenceHealth(project.evidenceItems), [project.evidenceItems]);
  const recruitmentRisk = useMemo(() => buildRecruitmentStressScenario({ targetN: project.sampleSize, attritionRate: project.attrition, invalidRate: project.expectedInvalidRate, weeklyRate: project.recruitmentPerWeek, participantMinutes: methodMinutes }), [project.sampleSize, project.attrition, project.expectedInvalidRate, project.recruitmentPerWeek, methodMinutes]);
  const identifierRisk = useMemo(() => findRepeatedIdentifierPath(project), [project]);

  const audit = useMemo(() => [
    { label: "Тема конкретна и соответствует выбранному профилю", ok: filled(project.topic) && topicAnalysis.score >= 60, step: "logic" as StepId, group: "Логика" },
    { label: "Проблема описана как пробел или противоречие", ok: filled(project.problem), step: "logic" as StepId, group: "Логика" },
    { label: "Практическая или теоретическая актуальность объяснена", ok: filled(project.relevance), step: "logic" as StepId, group: "Логика" },
    { label: "Цель отвечает на исследовательский вопрос", ok: filled(project.aim) && filled(project.question), step: "logic" as StepId, group: "Логика" },
    { label: "Объект и предмет различены", ok: filled(project.object) && filled(project.subject) && project.object.trim().toLowerCase() !== project.subject.trim().toLowerCase(), step: "logic" as StepId, group: "Логика" },
    { label: "Задачи описывают путь к цели", ok: project.tasks.filter(filled).length >= 3, step: "logic" as StepId, group: "Логика" },
    { label: "Есть проверяемая гипотеза или обоснованный открытый вопрос", ok: project.pathway === "qualitative" ? filled(project.question) : project.hypotheses.some((item) => filled(item.text)), step: "logic" as StepId, group: "Логика" },
    { label: "Поиск литературы можно воспроизвести", ok: filled(project.searchQuery) && project.databases.length >= 2, step: "evidence" as StepId, group: "Основания" },
    { label: "Сформулирован конкретный пробел в знаниях", ok: filled(project.evidenceGap), step: "evidence" as StepId, group: "Основания" },
    { label: "Ключевые конструкты определены теоретически", ok: filled(project.theory), step: "evidence" as StepId, group: "Основания" },
    { label: "Источники разобраны по выводам, ограничениям и роли", ok: evidenceSummary.complete >= 3, step: "evidence" as StepId, group: "Основания" },
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
    { label: "Темп набора и доля непригодных данных учтены", ok: project.recruitmentPerWeek > 0 && project.expectedInvalidRate >= 0 && project.expectedInvalidRate <= 50, step: "sample" as StepId, group: "Выборка" },
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
  ], [project, methodMinutes, topicAnalysis, evidenceSummary]);

  const qualitySignals = useMemo(() => {
    const signals: { level: "critical" | "warning" | "good"; title: string; text: string; step: StepId }[] = [];
    const causalWords = /(влия(ет|ние)|приводит|вызывает|определяет|эффект)/i;
    if (project.design !== "experimental" && causalWords.test(`${project.topic} ${project.question} ${project.aim}`)) signals.push({ level: "critical", title: "Причинный язык без эксперимента", text: "Для наблюдательного дизайна замените «влияние» на «связь», «различия» или явно ограничьте причинный вывод.", step: "logic" });
    if (project.object.trim() && project.object.trim().toLowerCase() === project.subject.trim().toLowerCase()) signals.push({ level: "critical", title: "Объект совпадает с предметом", text: "Объект должен быть шире; предмет — конкретная сторона, связь или механизм внутри него.", step: "logic" });
    if (project.requirementProfile === "msu-branch" && topicAnalysis.score < 80) signals.push({ level: "warning", title: "Тема требует локальной сверки", text: "Учебный профиль проверяет краткость и локальный стиль. Откройте разбор темы: рекомендации показаны отдельно от общенаучных критериев.", step: "logic" });
    if (/(студент|респондент|испытуем|участник|подростк|взросл)/i.test(project.object) && !/(псих|процесс|феномен|отношен|регуляц|деятельност|состояни)/i.test(project.object)) signals.push({ level: "critical", title: "Объект похож на выборку", text: "По требованиям кафедры объект — психологический феномен, процесс или образование. Люди и группы описываются в выборке.", step: "logic" });
    if (project.tasks.filter(filled).length > 0 && (project.tasks.filter(filled).length < 5 || project.tasks.filter(filled).length > 6)) signals.push({ level: "warning", title: "Проверьте число и уровень задач", text: "Локальный ориентир — 5–6 конкретных теоретических, методологических и эмпирических задач; при большем числе объедините однотипные.", step: "logic" });
    if (methodMinutes > 60) signals.push({ level: "critical", title: "Критическая нагрузка участника", text: `Около ${methodMinutes} минут без инструкций и пауз. Такой протокол резко повышает усталость, отсев и механические ответы.`, step: "methods" });
    else if (project.methods.length > 5 || methodMinutes > 35) signals.push({ level: "warning", title: "Перегруженная батарея", text: `Сейчас около ${methodMinutes} минут без инструкций. Усталость увеличит пропуски и случайные ответы.`, step: "methods" });
    if (project.sampleSize < Math.round(suggestedSample(project.sampleEffect, project.samplePower, project.design) * .8) && project.pathway === "quantitative") signals.push({ level: "warning", title: "Выборка ниже ориентира", text: "Проведите точный расчёт мощности под основной тест или честно ограничьте амбицию вывода.", step: "sample" });
    if (recruitmentRisk.level === "critical") signals.push({ level: "critical", title: "Полевой сценарий не выдерживает стресс-тест", text: `При ухудшении набора потребуется около ${recruitmentRisk.stress.weeks} недель и ${recruitmentRisk.stress.invited} приглашений. Пересоберите канал набора, резерв или масштаб вывода.`, step: "sample" });
    else if (recruitmentRisk.level === "warning") signals.push({ level: "warning", title: "Набор чувствителен к потерям", text: `Базовый план — ${recruitmentRisk.base.weeks} нед., стресс-сценарий — ${recruitmentRisk.stress.weeks} нед. Заранее зафиксируйте резервный канал.`, step: "sample" });
    if (project.evidenceItems.length >= 3 && !evidenceSummary.hasCounterEvidence) signals.push({ level: "warning", title: "Матрица литературы слишком единодушна", text: "Все источники выглядят подтверждающими. Найдите конкурирующие результаты, альтернативную операционализацию или границы эффекта.", step: "evidence" });
    if (project.analysis === "regression" && project.variables.filter((v) => v.role === "predictor").length > Math.max(1, Math.floor(project.sampleSize / 15))) signals.push({ level: "critical", title: "Слишком много предикторов", text: "Модель рискует переобучиться. Сократите предикторы по теории или увеличьте выборку.", step: "analysis" });
    if (project.analysis === "mediation" && project.time === "cross-sectional") signals.push({ level: "warning", title: "Медиация в одном срезе", text: "Поперечные данные не устанавливают временной механизм. Формулируйте результат как косвенную статистическую связь.", step: "analysis" });
    if (project.time === "longitudinal" && project.attrition < 20) signals.push({ level: "warning", title: "Недооценён отсев в лонгитюде", text: "Повторные волны почти всегда теряют часть участников. Заложите резерв и заранее опишите анализ причин выбывания.", step: "sample" });
    if (project.methods.length > 0 && project.variables.some((variable) => filled(variable.name) && !filled(variable.instrument))) signals.push({ level: "critical", title: "Метод не привязан к переменной", text: "Выбранная батарея сама по себе не завершает операционализацию. Для каждого конструкта укажите конкретный показатель и инструмент.", step: "variables" });
    if (project.hypotheses.filter((h) => filled(h.text)).length > 5 && !filled(project.correctionPlan)) signals.push({ level: "warning", title: "Много гипотез без семейства тестов", text: "Выделите первичную гипотезу и определите коррекцию или иерархию проверок.", step: "analysis" });
    if (project.pathway === "qualitative" && project.hypotheses.some((h) => filled(h.text))) signals.push({ level: "warning", title: "Гипотеза может сужать качественный поиск", text: "Для исследовательского качественного дизайна чаще полезны открытые вопросы и рефлексивная позиция.", step: "logic" });
    if (["experimental", "quasi"].includes(project.design) && project.experimentControls.length < 4) signals.push({ level: "critical", title: "Эксперимент без карты артефактов", text: "Отметьте реальные угрозы валидности и для каждой запишите контроль. Само наличие воздействия ещё не создаёт причинный вывод.", step: "design" });
    if (project.design === "experimental" && !/случайн|рандом/i.test(project.assignmentPlan)) signals.push({ level: "warning", title: "Неясное распределение по условиям", text: "Опишите генерацию последовательности, сокрытие распределения и единицу рандомизации — либо честно обозначьте квазиэксперимент.", step: "design" });
    if (project.design === "experimental" && experimentReadiness({ manipulation: project.manipulation, controlCondition: project.controlCondition, assignmentPlan: project.assignmentPlan, counterbalancing: project.counterbalancing, manipulationCheck: project.manipulationCheck, fidelityPlan: project.fidelityPlan, qualityRules: project.qualityRules, experimentControls: project.experimentControls }).score < 50) signals.push({ level: "critical", title: "Причинный вывод пока не защищён", text: "Менее половины критических элементов эксперимента зафиксировано. Сначала закройте манипуляцию, контроль, распределение и контроль реализации.", step: "design" });
    if (project.dataSensitivity === "restricted" && project.setting === "online") signals.push({ level: "critical", title: "Чувствительные данные и обычный онлайн-сбор", text: "Остановитесь на уровне плана: нужна согласованная инфраструктура, формальная модель доступа и проверенная процедура инцидента.", step: "ethics" });
    if (identifierRisk) signals.push({ level: "critical", title: "Похожее на список контактов содержимое", text: "В проекте найдено несколько e-mail или телефонных номеров. Удалите данные участников: конструктор предназначен только для плана и методических решений.", step: "ethics" });
    if (["paired", "repeated"].includes(project.analysis) && project.comparisonStructure === "independent") signals.push({ level: "critical", title: "Анализ не соответствует зависимости", text: "Парные и повторные наблюдения нельзя анализировать как независимые. Согласуйте единицу анализа, структуру данных и модель.", step: "analysis" });
    if (!signals.length && audit.filter((item) => item.ok).length / audit.length >= .7) signals.push({ level: "good", title: "Критических противоречий не найдено", text: "Теперь нужен содержательный разбор руководителя: автоматический аудит проверяет структуру, но не научную истинность.", step: "audit" });
    return signals;
  }, [project, methodMinutes, audit, topicAnalysis, recruitmentRisk, evidenceSummary, identifierRisk]);

  const done = audit.filter((item) => item.ok).length;
  const readiness = Math.round((done / audit.length) * 100);
  const currentIndex = steps.findIndex((step) => step.id === active);
  const estimated = suggestedSample(project.sampleEffect, project.samplePower, project.design);
  const methodCategories = ["Все", ...Array.from(new Set(methodBank.map((method) => method.category)))];
  const phaseHealth = workflowPhases.map((phase) => {
    const points = audit.filter((item) => phase.ids.includes(item.step));
    const complete = points.filter((item) => item.ok).length;
    return { ...phase, score: points.length ? Math.round(complete / points.length * 100) : 0, complete, total: points.length };
  });
  const nextActions = audit.filter((item) => !item.ok).filter((item, index, list) => list.findIndex((candidate) => candidate.step === item.step) === index).slice(0, 3);
  const feasibilityChecks = [
    project.pathway === "qualitative" ? project.sampleSize >= 6 : project.sampleSize >= Math.max(12, Math.round(estimated * .8)),
    methodMinutes > 0 && methodMinutes <= 35,
    filled(project.recruitment),
    filled(project.procedure),
    filled(project.pilotPlan),
    project.time !== "longitudinal" || project.attrition >= 20,
    recruitmentRisk.base.weeks <= 52 && project.expectedInvalidRate <= 40,
  ];
  const feasibility = Math.round(feasibilityChecks.filter(Boolean).length / feasibilityChecks.length * 100);
  const reviewAnswers = reviewerQuestions.filter((item) => filled(project.reviewResponses[item.id] || "")).length;
  const researchBrief = `${project.topic || "Тема пока не сформулирована"}. ${project.question ? `Вопрос: ${project.question}` : "Сначала зафиксируйте один исследовательский вопрос."} ${project.designRationale ? `Дизайн: ${project.designRationale}` : "Затем обоснуйте дизайн через вопрос, а не удобство."}`;
  const traceNodes = [
    { id: "question", label: "Вопрос", detail: "Один вопрос, на который отвечают данные", ok: filled(project.question), step: "logic" as StepId },
    { id: "theory", label: "Механизм", detail: "Теория объясняет ожидаемую связь", ok: filled(project.theory) && filled(project.problem), step: "evidence" as StepId },
    { id: "evidence", label: "Основания", detail: "Есть выводы, ограничения и контраргументы", ok: evidenceSummary.complete >= 3, step: "evidence" as StepId },
    { id: "measure", label: "Измерение", detail: "Конструкты доведены до показателей", ok: project.variables.filter((item) => filled(item.name)).every((item) => filled(item.indicator) && filled(item.instrument)) && project.methods.length > 0, step: "variables" as StepId },
    { id: "design", label: "Проверка", detail: "Дизайн отделяет гипотезу от альтернатив", ok: filled(project.designRationale) && filled(project.procedure), step: "design" as StepId },
    { id: "analysis", label: "Вывод", detail: "Исход, анализ и границы заданы заранее", ok: filled(project.primaryOutcome) && Boolean(project.analysis) && filled(project.limitations), step: "analysis" as StepId },
  ];

  const go = (id: StepId) => {
    setActive(id);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const applyTemplate = (template: ProjectTemplate) => {
    const hasWork = Boolean(project.topic.trim() || project.problem.trim() || project.question.trim() || project.methods.length || project.title !== defaultProject.title);
    if (hasWork && !window.confirm(`Создать новый проект по сценарию «${template.label}»? Текущую версию лучше сначала скачать: она будет заменена.`)) return;
    const next = { ...freshProject(), ...template.patch, title: `Новый проект · ${template.label}` };
    replaceProject(next);
    notify(`Сценарий «${template.label}» применён`);
    go("logic");
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

  const exportSafeJson = () => {
    const safeCopy = { ...project, supervisor: "", deadline: "", recruitment: "", consent: "", accessRoles: "", incidentPlan: "" };
    const blob = new Blob([JSON.stringify(safeCopy, null, 2)], { type: "application/json" });
    const href = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    link.download = `${project.title || "research-project"}-safe.json`;
    link.click();
    URL.revokeObjectURL(href);
    notify("Скачана обезличенная копия плана");
  };

  const togglePrivateSession = () => {
    if (privateSession) {
      setPrivateSession(false);
      notify("Локальное автосохранение включено");
      return;
    }
    if (!window.confirm("Перейти в приватную сессию? Локальные копии конструктора будут удалены, а текущий проект останется только в памяти вкладки до её закрытия.")) return;
    const cleared = clearProjectStorage(localStorage);
    if (!cleared) {
      notify("Браузер не подтвердил удаление локальной копии");
      return;
    }
    setPrivateSession(true);
    notify("Приватная сессия: автосохранение отключено");
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
        `Направление: ${project.field}; подход: ${project.pathway}; профиль проверки: ${project.requirementProfile}.`,
        `Тема: ${project.topic}`, `Проблема: ${project.problem}`, `Актуальность: ${project.relevance}`, `Цель: ${project.aim}`,
        `Объект: ${project.object}`, `Предмет: ${project.subject}`, `Вопрос: ${project.question}`,
        ...project.tasks.map((task, i) => `Задача ${i + 1}: ${task}`),
        ...project.hypotheses.map((h, i) => `Гипотеза ${i + 1}: ${h.text}`),
      ]),
      ...section("Теоретические основания и литература", [
        `Теоретическая рамка: ${project.theory}`, `Ключевые слова: ${project.keywords}`,
        `Базы: ${project.databases.join(", ")}`, `Поисковый запрос: ${project.searchQuery}`,
        `Критерии отбора: ${project.literatureCriteria}`, `Пробел в знаниях: ${project.evidenceGap}`,
        ...project.evidenceItems.map((item, index) => `Источник ${index + 1}: ${item.citation} (${item.year}); дизайн: ${item.design}; выборка/материал: ${item.sample}; вывод: ${item.finding}; ограничение: ${item.limitation}; роль: ${item.relevance}; позиция: ${item.stance}.`),
      ]),
      ...section("Переменные и операционализация", [
        ...project.variables.map((v) => `${v.name || "Переменная"} (${v.role}): ${v.definition}; показатель: ${v.indicator}; шкала: ${v.scale}; инструмент: ${v.instrument}.`),
        `Альтернативные объяснения: ${project.confounds}`,
      ]),
      ...section("Дизайн и выборка", [
        `Дизайн: ${project.design}; временной план: ${project.time}; формат: ${project.setting}.`,
        `Обоснование дизайна: ${project.designRationale}`,
        `Структура эксперимента: ${project.experimentStructure}`, `Манипуляция / условия: ${project.manipulation}`,
        `Контрольное условие: ${project.controlCondition}`, `Распределение: ${project.assignmentPlan}`,
        `Порядок и контрбалансировка: ${project.counterbalancing}`, `Ослепление и стандартизация: ${project.blindingPlan}`, `Проверка манипуляции: ${project.manipulationCheck}`,
        `Верность реализации: ${project.fidelityPlan}`, `ПО и оборудование: ${project.softwarePlan}`,
        `Структура проб: ${project.trialPlan}`, `Правила качества: ${project.qualityRules}`, `Дебрифинг: ${project.debriefPlan}`,
        `Угрозы валидности: ${project.experimentControls.join("; ") || "не отмечены"}`, `Контроль артефактов: ${project.artifactPlan}`,
        `Генеральная совокупность: ${project.population}`, `Плановый объём: ${project.sampleSize}`,
        `Способ выборки: ${project.samplingMethod}; запас на отсев: ${project.attrition}%.`,
        `Ожидаемо непригодных наблюдений: ${project.expectedInvalidRate}%; темп приглашений: ${project.recruitmentPerWeek} в неделю.`,
        `Включение: ${project.inclusion}`, `Исключение: ${project.exclusion}`, `Набор: ${project.recruitment}`,
      ]),
      ...section("Протокол", [
        `Процедура: ${project.procedure}`, `Пилот: ${project.pilotPlan}`, `Правило остановки: ${project.stoppingRule}`,
        `Пререгистрация: ${project.preregistrationChecks.join("; ") || "не заполнена"}`,
        ...project.decisionLog.map((item, index) => `Решение ${index + 1} (${item.date || "без даты"}, ${item.timing}, ${item.status}): ${item.decision}; основание: ${item.rationale}.`),
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
        `Класс чувствительности: ${project.dataSensitivity}`, `Минимальный состав данных: ${project.dataTypes}`, `Доступ: ${project.accessRoles}`,
        `Срок хранения: ${project.retentionPeriod}`, `Порядок удаления: ${project.deletionPlan}`,
        `Инцидент: ${project.incidentPlan}`,
        `Текст согласия: ${project.consent}`,
      ]),
      ...section("Отчёт и границы", [
        `Стандарт отчётности: ${project.reportingStandard}`, `Ограничения: ${project.limitations}`,
        `Распространение результатов: ${project.dissemination}`, `Готовность каркаса: ${readiness}% (${done}/${audit.length}).`,
      ]),
      ...section("Стресс-рецензирование", reviewerQuestions.map((item) => `${item.lens}: ${project.reviewResponses[item.id] || "ответ не подготовлен"}`)),
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
        const restrictedPath = findRestrictedDatasetPath(incoming);
        if (restrictedPath) throw new Error(`Запрещённый массив данных: ${restrictedPath}`);
        const identifierPath = findRepeatedIdentifierPath(incoming);
        if (identifierPath) throw new Error(`Запрещённые идентификаторы: ${identifierPath}`);
        replaceProject(sanitizeProject(incoming));
        notify("Проект проверен и восстановлен");
      } catch (error) { notify(error instanceof Error && error.message.includes("Запрещён") ? "Импорт отклонён: похоже на данные участников" : "Не удалось прочитать файл"); }
    };
    reader.readAsText(file);
    event.target.value = "";
  };

  const resetProject = () => {
    if (!window.confirm("Безвозвратно удалить проект из этого браузера? При необходимости сначала скачайте JSON. Будут удалены текущий и прежний ключи конструктора.")) return;
    const cleared = clearProjectStorage(localStorage);
    undoStackRef.current = [];
    redoStackRef.current = [];
    historyKeyRef.current = "";
    setHistoryState({ undo: 0, redo: 0 });
    setPrivateSession(false);
    suppressNextSaveRef.current = true;
    const emptyProject = freshProject();
    projectRef.current = emptyProject;
    setProject(emptyProject);
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
          <span className="brand__mark" aria-hidden="true">Ψ</span>
          <span><b>Конструктор</b><small>исследования</small></span>
        </button>
        <div className="topbar__project">
          <span className={`status-dot ${privateSession ? "status-dot--private" : saveWarning ? "status-dot--warning" : ""}`} />
          <span>{!hydrated ? "Загрузка проекта" : privateSession ? "Приватная сессия · без сохранения" : saveWarning || (lastSavedAt ? `Сохранено локально · ${lastSavedAt}` : "Локально в этом браузере")}</span>
        </div>
        <div className="topbar__actions">
          <div className="history-controls" aria-label="История изменений">
            <button className="icon-button" disabled={!historyState.undo} onClick={undo} title="Отменить изменение" aria-label="Отменить изменение"><Undo2 size={17} /></button>
            <button className="icon-button" disabled={!historyState.redo} onClick={redo} title="Вернуть изменение" aria-label="Вернуть изменение"><Redo2 size={17} /></button>
          </div>
          <button className="button button--ghost command-button" onClick={() => setCommandOpen(true)}><Command size={17} /> Быстрый переход <kbd>Ctrl K</kbd></button>
          <button className="button button--ghost radar-button" onClick={() => setLabOpen(true)}><Gauge size={17} /> Радар проекта</button>
          <button className="button button--ghost" onClick={() => setKnowledgeOpen(true)}><LibraryBig size={17} /> Справочник</button>
          <button className={privateSession ? "button button--private" : "button button--ghost"} onClick={togglePrivateSession}><LockKeyhole size={17} /> {privateSession ? "Сохранить локально" : "Приватная сессия"}</button>
          <button className="button button--ghost privacy-shield-button" onClick={() => setPrivacyShield(true)}><EyeOff size={17} /> Скрыть экран</button>
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
          {workflowPhases.map((phase) => <div className="nav-phase" key={phase.title}><span className="nav-phase__label">{phase.title}</span>{phase.ids.map((id) => {
            const step = steps.find((item) => item.id === id)!;
            const index = steps.findIndex((item) => item.id === id);
            const Icon = step.icon;
            const complete = audit.filter((a) => a.step === step.id).every((a) => a.ok) && audit.some((a) => a.step === step.id);
            return <button key={step.id} className={active === step.id ? "nav-item nav-item--active" : "nav-item"} onClick={() => go(step.id)}><span className="nav-item__number">{complete ? <Check size={14} /> : String(index + 1).padStart(2, "0")}</span><Icon size={18} /><span>{step.label}</span><ChevronRight className="nav-item__chevron" size={16} /></button>;
          })}</div>)}
        </nav>
        <div className="sidebar__tools">
          <button onClick={() => { setMobileOpen(false); setCommandOpen(true); }}><Command size={16} /> Быстрый переход</button>
          <button onClick={() => { setMobileOpen(false); setLabOpen(true); }}><Gauge size={16} /> Радар проекта</button>
          <button onClick={() => importRef.current?.click()}><Upload size={16} /> Импорт JSON</button>
          <button onClick={exportJson}><FileJson size={16} /> Полная резервная копия</button>
          <button onClick={exportSafeJson}><ShieldCheck size={16} /> Безопасная копия</button>
          <button onClick={togglePrivateSession}><LockKeyhole size={16} /> {privateSession ? "Включить автосохранение" : "Приватная сессия"}</button>
          <button onClick={() => { setMobileOpen(false); setPrivacyShield(true); }}><EyeOff size={16} /> Скрыть содержимое</button>
          <button onClick={resetProject}><Trash2 size={16} /> Удалить данные проекта</button>
          <input ref={importRef} type="file" accept="application/json" onChange={importJson} hidden />
        </div>
      </aside>
      {mobileOpen && <button className="scrim" onClick={() => setMobileOpen(false)} aria-label="Закрыть меню" />}

      <main className="workspace">
        <div className="workspace__main">
          {active !== "overview" && <div className="orientation-strip"><div><span>Сейчас: {steps.find((step) => step.id === active)?.label}</span><strong>{routeDescription(active)}</strong></div><button onClick={() => setLabOpen(true)}>Проверить связи <Gauge size={15} /></button></div>}
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
                  <span className="hero__psi">Ψ</span>
                  <div className="hero__score"><b>{readiness}</b><span>%</span><small>готовности</small></div>
                  <span className="hero__tag hero__tag--a">вопрос</span><span className="hero__tag hero__tag--b">метод</span><span className="hero__tag hero__tag--c">вывод</span>
                </div>
              </section>
              <section className="content-section research-deck">
                <SectionHead eyebrow="Навигатор" title="Сразу видно, где проект держится, а где трещит" text="Четыре этапа оцениваются отдельно. Поэтому общий процент больше не прячет провал в логике, реализуемости или этике." />
                <div className="research-deck__grid">
                  <div className="health-board">
                    <div className="health-board__head"><div><span>Каркас</span><strong>{readiness}%</strong></div><div><span>Реализуемость</span><strong>{feasibility}%</strong></div><div><span>Стресс-рецензия</span><strong>{reviewAnswers}/{reviewerQuestions.length}</strong></div></div>
                    <div className="phase-health">{phaseHealth.map((phase, index) => <button key={phase.title} onClick={() => go(phase.ids[0])}><span>0{index + 1}</span><div><strong>{phase.title}</strong><small>{phase.complete} из {phase.total} точек</small></div><b>{phase.score}%</b><i><em style={{ width: `${phase.score}%` }} /></i></button>)}</div>
                  </div>
                  <div className="next-board">
                    <span className="eyebrow eyebrow--light">Следующие действия</span>
                    <h3>{nextActions.length ? "Не распыляйтесь: закройте эти три разрыва" : "Каркас заполнен — переходите к жёсткой проверке"}</h3>
                    <div>{nextActions.length ? nextActions.map((item, index) => <button key={item.label} onClick={() => go(item.step)}><b>{index + 1}</b><span><strong>{item.label}</strong><small>{steps.find((step) => step.id === item.step)?.label}</small></span><ArrowRight size={17} /></button>) : <button onClick={() => go("audit")}><b>✓</b><span><strong>Открыть стресс-рецензию</strong><small>Альтернативы, устойчивость и границы вывода</small></span><ArrowRight size={17} /></button>}</div>
                  </div>
                </div>
                <div className="live-brief"><div><span className="eyebrow">Живое резюме</span><p>{researchBrief}</p></div><button className="button button--ghost" onClick={async () => { await navigator.clipboard.writeText(researchBrief); notify("Краткое резюме скопировано"); }}><Copy size={16} /> Копировать</button></div>
                <button className="radar-launch" onClick={() => setLabOpen(true)}><span><Gauge size={22} /></span><div><small>Новый инструмент</small><strong>Открыть исследовательский радар</strong><p>Проверить цепочку вывода, сроки набора и историю решений в одном месте.</p></div><ArrowRight /></button>
              </section>
              <section className="content-section quick-start">
                <SectionHead eyebrow="Быстрый старт" title="Начните со структуры, а не с пустого экрана" text="Сценарий не пишет содержание за вас. Он выставляет согласованный маршрут, тип дизайна, основу анализа и объём планирования." />
                <div className="template-grid">{projectTemplates.map((template, index) => <button key={template.id} onClick={() => applyTemplate(template)}><span><b>{String(index + 1).padStart(2, "0")}</b>{template.label}</span><strong>{template.title}</strong><p>{template.description}</p><small>Создать новый каркас <ArrowRight size={14} /></small></button>)}</div>
                <div className="template-warning"><ShieldCheck size={18} /><p>Шаблон заменяет текущий проект только после предупреждения. Перед заменой можно скачать полную резервную копию.</p></div>
              </section>
              <section className="content-section">
                <SectionHead eyebrow="Паспорт" title="Сначала зафиксируйте рамку" text="Эти данные попадут в экспорт и помогут не потерять масштаб работы." />
                <div className="pathway-grid">
                  {researchPathways.map((pathway) => <button key={pathway.id} className={project.pathway === pathway.id ? "pathway-card pathway-card--active" : "pathway-card"} onClick={() => update("pathway", pathway.id)}><span>{project.pathway === pathway.id ? <Check size={15} /> : <Layers3 size={15} />}</span><strong>{pathway.title}</strong><p>{pathway.question}</p><small>{pathway.output}</small></button>)}
                </div>
                <div className="form-card form-grid">
                  <Field label="Рабочее название" wide><input value={project.title} onChange={(e) => update("title", e.target.value)} /></Field>
                  <Field label="Формат проекта"><select value={project.level} onChange={(e) => update("level", e.target.value)}><option>Исследовательский проект</option><option>Курсовая работа</option><option>ВКР бакалавра</option><option>Курсовая работа магистра</option><option>Магистерская диссертация</option><option>Статья</option><option>Пилотное исследование</option><option>Самостоятельный проект</option></select></Field>
                  <Field label="Профиль проверки" hint="Меняет рекомендации, но не научные факты"><select value={project.requirementProfile} onChange={(e) => update("requirementProfile", e.target.value as TopicProfile)}><option value="universal">Универсальная исследовательская логика</option><option value="msu-branch">Учебная работа · ТФ МГУ</option><option value="article">Научная статья</option></select></Field>
                  <Field label="Область психологии"><select value={project.field} onChange={(e) => update("field", e.target.value)}><option>Общая психология</option><option>Социальная психология</option><option>Психология личности</option><option>Психология развития</option><option>Организационная психология</option><option>Клиническая психология</option><option>Психофизиология</option><option>Психометрика</option><option>Междисциплинарное исследование</option></select></Field>
                  <Field label="Срок"><input type="date" value={project.deadline} onChange={(e) => update("deadline", e.target.value)} /></Field>
                  <Field label="Научный руководитель"><input placeholder="Фамилия, имя, степень — если есть" value={project.supervisor} onChange={(e) => update("supervisor", e.target.value)} /></Field>
                </div>
              </section>
              <section className="content-section">
                <div className="section-head section-head--row"><div><span className="eyebrow">Маршрут</span><h2>Четыре смысловых этапа</h2></div><p>{done} из {audit.length} контрольных точек закрыто</p></div>
                <div className="phase-grid">{workflowPhases.map((phase, index) => <button key={phase.title} onClick={() => go(phase.ids[0])}><span>0{index + 1}</span><strong>{phase.title}</strong><p>{phase.text}</p><small>{phase.ids.map((id) => steps.find((step) => step.id === id)?.short).join(" · ")}</small><ArrowRight /></button>)}</div>
                <div className="subsection-head"><div><span className="eyebrow">Точные действия</span><h3>Рабочие блоки</h3></div></div>
                <div className="route-grid">
                  {steps.slice(1).map((step, index) => { const Icon = step.icon; return <button key={step.id} className="route-card" onClick={() => go(step.id)}><span>{String(index + 2).padStart(2, "0")}</span><Icon /><strong>{step.label}</strong><p>{routeDescription(step.id)}</p><ArrowRight size={18} /></button>; })}
                </div>
              </section>
              <section className="branch-profile">
                <div><span className="eyebrow eyebrow--light">Учебный профиль</span><h2>Оформление без канцелярской стены</h2><p>Локальные ориентиры Ташкентского филиала вынесены в отдельный режим. Они помогают собрать учебную работу, но не подменяют общую исследовательскую логику и не навязываются самостоятельным проектам.</p></div>
                <button className="button button--amber" onClick={() => { setKnowledgeTab("branch"); setKnowledgeOpen(true); }}>Посмотреть ориентиры <ArrowRight size={17} /></button>
                <small>Актуальную форму сдачи и спорные детали подтверждает научный руководитель.</small>
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
          {active === "audit" && <AuditStep project={project} update={update} audit={audit} readiness={readiness} go={go} exportDocx={exportDocx} signals={qualitySignals} />}

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

      <nav className="mobile-phase-nav" aria-label="Этапы проекта">{workflowPhases.map((phase) => <button key={phase.title} className={phase.ids.includes(active) ? "active" : ""} onClick={() => go(phase.ids[0])}><span>{phase.title}</span></button>)}</nav>
      <footer className="site-footer"><div className="footer-identity"><span className="footer-psi">Ψ</span><div><b>Конструктор исследования</b><p>Психологическая методология, проектирование и проверка связности.</p></div></div><div className="footer-links"><span>Экосистема</span><a href="https://psy-msutf.vercel.app/ru" target="_blank" rel="noreferrer">Научный сектор психологии <ArrowRight size={14} /></a><a href="https://t.me/psy_msutf" target="_blank" rel="noreferrer">Telegram · @psy_msutf <ArrowRight size={14} /></a></div><div className="footer-author"><span>Создатель</span><a href="https://t.me/speway" target="_blank" rel="noreferrer">spw · @speway <ArrowRight size={14} /></a><small>Ташкентский филиал МГУ · 2026</small></div><strong className="footer-warning">Запрещено основывать работу на созданных вами здесь заметках, формулировках и решениях или использовать их без проверки и одобрения научного руководителя. Это не улучшит работу — только повысит риск методологических ошибок и сделает хуже прежде всего вам.</strong></footer>
      {commandOpen && <CommandCenter query={commandQuery} setQuery={setCommandQuery} close={() => { setCommandOpen(false); setCommandQuery(""); }} go={go} nextStep={nextActions[0]?.step || "audit"} openKnowledge={() => { setCommandOpen(false); setKnowledgeOpen(true); }} openLab={() => { setCommandOpen(false); setLabOpen(true); }} exportDocx={exportDocx} exportSafeJson={exportSafeJson} hideScreen={() => { setCommandOpen(false); setPrivacyShield(true); }} />}
      {labOpen && <ResearchLab project={project} update={update} close={() => setLabOpen(false)} go={go} traceNodes={traceNodes} readiness={readiness} feasibility={feasibility} />}
      {knowledgeOpen && <KnowledgeCenter search={knowledgeSearch} setSearch={setKnowledgeSearch} tab={knowledgeTab} setTab={setKnowledgeTab} close={() => setKnowledgeOpen(false)} />}
      {privacyShield && <div className="privacy-shield" role="dialog" aria-modal="true" aria-label="Содержимое скрыто"><div><span>Ψ</span><h2>Содержимое скрыто</h2><p>Проект остаётся открыт в этой вкладке, но текст не виден на экране.</p><button className="button button--amber" onClick={() => setPrivacyShield(false)}>Вернуться к проекту</button></div></div>}
      {toast && <div className="toast" role="status"><CheckCircle2 size={18} />{toast}</div>}
    </div>
  );
}

function routeDescription(id: StepId) {
  return ({ logic: "Проблема, цель, задачи и гипотезы", evidence: "Поиск, теория и реальный пробел", variables: "Роли, показатели и схема связей", design: "Тип, время и границы вывода", sample: "Кого, сколько и как набирать", methods: "Батарея и качество измерения", protocol: "Пошаговая процедура и пререгистрация", analysis: "Основной тест, эффекты и предпосылки", ethics: "Согласие, риски и хранение", report: "Стандарт, ограничения и защита", audit: "Связность и готовность к обсуждению" } as Partial<Record<StepId, string>>)[id] || "";
}

function CommandCenter({ query, setQuery, close, go, nextStep, openKnowledge, openLab, exportDocx, exportSafeJson, hideScreen }: { query: string; setQuery: (value: string) => void; close: () => void; go: (id: StepId) => void; nextStep: StepId; openKnowledge: () => void; openLab: () => void; exportDocx: () => void; exportSafeJson: () => void; hideScreen: () => void }) {
  const closeRef = useRef(close);
  useEffect(() => { closeRef.current = close; });
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") closeRef.current(); };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);
  const normalized = query.trim().toLowerCase();
  const routes = steps.filter((step) => `${step.label} ${step.short} ${routeDescription(step.id)}`.toLowerCase().includes(normalized));
  const actions = [
    { id: "next", title: "Перейти к следующему разрыву", text: "Открыть первую незакрытую контрольную точку", icon: Target, run: () => go(nextStep) },
    { id: "audit", title: "Запустить стресс-рецензию", text: "Проверить альтернативы, устойчивость и границы вывода", icon: Gauge, run: () => go("audit") },
    { id: "radar", title: "Открыть радар проекта", text: "Связность, полевой стресс-тест и журнал решений", icon: Network, run: openLab },
    { id: "knowledge", title: "Открыть научный справочник", text: "Термины, методы, стандарты и экспериментальные угрозы", icon: LibraryBig, run: openKnowledge },
    { id: "safe", title: "Скачать безопасную копию", text: "JSON без руководителя, набора, согласия и служебных деталей", icon: ShieldCheck, run: exportSafeJson },
    { id: "docx", title: "Собрать DOCX", text: "Выгрузить полный проект для обсуждения", icon: FileText, run: exportDocx },
    { id: "shield", title: "Мгновенно скрыть экран", text: "Закрыть содержание проекта защитным экраном", icon: EyeOff, run: hideScreen },
  ].filter((action) => `${action.title} ${action.text}`.toLowerCase().includes(normalized));
  const run = (action: () => void) => { close(); action(); };
  return <div className="command-overlay" role="dialog" aria-modal="true" aria-label="Быстрый переход"><button className="command-scrim" onClick={close} aria-label="Закрыть быстрый переход" /><div className="command-panel"><div className="command-search"><Search size={20} /><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Куда перейти или что сделать?" /><kbd>Esc</kbd></div><div className="command-body">{actions.length > 0 && <section><span>Действия</span>{actions.map((action) => { const Icon = action.icon; return <button key={action.id} onClick={() => run(action.run)}><Icon size={18} /><div><strong>{action.title}</strong><small>{action.text}</small></div><ArrowRight size={16} /></button>; })}</section>}{routes.length > 0 && <section><span>Разделы</span>{routes.map((step) => { const Icon = step.icon; return <button key={step.id} onClick={() => run(() => go(step.id))}><Icon size={18} /><div><strong>{step.label}</strong><small>{routeDescription(step.id) || "Обзор проекта и быстрый старт"}</small></div><ArrowRight size={16} /></button>; })}</section>}{!actions.length && !routes.length && <div className="command-empty"><CircleHelp size={28} /><strong>Ничего не найдено</strong><p>Попробуйте «выборка», «этика», «аудит» или «скачать».</p></div>}</div><p className="command-hint"><Command size={14} /> Ctrl/⌘ K открывает эту панель из любого раздела</p></div></div>;
}

type StepProps = { project: Project; update: <K extends keyof Project>(key: K, value: Project[K]) => void };

type TraceNode = { id: string; label: string; detail: string; ok: boolean; step: StepId };

function ResearchLab({ project, update, close, go, traceNodes, readiness, feasibility }: StepProps & { close: () => void; go: (id: StepId) => void; traceNodes: TraceNode[]; readiness: number; feasibility: number }) {
  const [tab, setTab] = useState<"trace" | "field" | "decisions">("trace");
  const closeRef = useRef(close);
  const scenario = buildRecruitmentStressScenario({ targetN: project.sampleSize, attritionRate: project.attrition, invalidRate: project.expectedInvalidRate, weeklyRate: project.recruitmentPerWeek, participantMinutes: project.methods.reduce((sum, method) => sum + method.minutes, 0) });
  const matrix = evidenceHealth(project.evidenceItems);
  const traceReady = traceNodes.filter((node) => node.ok).length;
  const claimContract = project.design === "experimental"
    ? { allowed: "Осторожная оценка причинного эффекта — только при выполненной манипуляции, корректном распределении и контроле реализации.", forbidden: "Нельзя скрывать нарушения рандомизации, fidelity и остаточные альтернативные объяснения." }
    : project.design === "qualitative"
      ? { allowed: "Описание опыта, смыслов, процессов и контекстных механизмов с явной аналитической позицией.", forbidden: "Нельзя превращать насыщенное описание в статистическое обобщение на популяцию." }
      : { allowed: "Связь, различия, прогноз или временная динамика в границах наблюдаемой выборки и дизайна.", forbidden: "Нельзя автоматически писать «влияет», «вызывает» или «определяет» без причинной идентификации." };
  useEffect(() => { closeRef.current = close; });
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") closeRef.current(); };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);
  const jump = (step: StepId) => { close(); go(step); };
  return <div className="research-lab-overlay" role="dialog" aria-modal="true" aria-label="Радар исследовательского проекта"><button className="research-lab-scrim" onClick={close} aria-label="Закрыть радар проекта" /><aside className="research-lab-panel">
    <div className="research-lab-head"><div><span className="eyebrow eyebrow--light">Исследовательский радар</span><h2>Проект как система, а не набор заполненных полей</h2><p>Проверяйте цепочку вывода, реальный полевой план и историю решений отдельно.</p></div><button className="icon-button" onClick={close} aria-label="Закрыть"><X /></button></div>
    <div className="research-lab-scores"><div><span>Каркас</span><strong>{readiness}%</strong></div><div><span>Реализуемость</span><strong>{feasibility}%</strong></div><div><span>Связность</span><strong>{traceReady}/{traceNodes.length}</strong></div></div>
    <div className="research-lab-tabs"><button className={tab === "trace" ? "active" : ""} onClick={() => setTab("trace")}>Цепочка вывода</button><button className={tab === "field" ? "active" : ""} onClick={() => setTab("field")}>Полевой стресс-тест</button><button className={tab === "decisions" ? "active" : ""} onClick={() => setTab("decisions")}>История решений</button></div>
    <div className="research-lab-body">
      {tab === "trace" && <><div className="trace-intro"><div><strong>{traceReady === traceNodes.length ? "Цепочка собрана" : `${traceNodes.length - traceReady} разрыва требуют внимания`}</strong><p>Каждый переход должен быть объясним: почему из теории следует показатель, а из показателя — именно такой вывод.</p></div><span>{Math.round(traceReady / traceNodes.length * 100)}%</span></div><div className="trace-chain">{traceNodes.map((node, index) => <button key={node.id} className={node.ok ? "trace-node trace-node--ok" : "trace-node"} onClick={() => jump(node.step)}><span>{node.ok ? <Check size={16} /> : String(index + 1).padStart(2, "0")}</span><div><strong>{node.label}</strong><small>{node.detail}</small></div><ArrowRight size={16} /></button>)}</div><div className="trace-evidence"><div><span>Матрица литературы</span><strong>{matrix.score}%</strong><small>{matrix.complete} полностью разобранных источника</small></div><div><span>Контраргумент</span><strong>{matrix.hasCounterEvidence ? "есть" : "не найден"}</strong><small>{matrix.hasCounterEvidence ? "Присутствует смешанный или противоречащий результат" : "Добавьте источник, который мешает красивой истории"}</small></div><button onClick={() => jump("evidence")}>Открыть матрицу <ArrowRight size={15} /></button></div><div className="claim-contract"><div><span>Разрешённый язык вывода</span><p>{claimContract.allowed}</p></div><div><span>Методологический стоп</span><p>{claimContract.forbidden}</p></div></div></>}
      {tab === "field" && <><div className={`stress-verdict stress-verdict--${scenario.level}`}><Gauge /><div><span>Вердикт стресс-теста</span><h3>{scenario.level === "critical" ? "План может сорваться" : scenario.level === "warning" ? "План чувствителен к потерям" : "План имеет рабочий резерв"}</h3><p>Стресс-сценарий: +15 п.п. отсева, +10 п.п. непригодных наблюдений и −30% темпа набора.</p></div></div><div className="lab-inputs"><Field label="Целевой анализируемый N"><input type="number" min={1} value={project.sampleSize} onChange={(event) => update("sampleSize", Number(event.target.value))} /></Field><Field label="Отсев, %"><input type="number" min={0} max={95} value={project.attrition} onChange={(event) => update("attrition", Number(event.target.value))} /></Field><Field label="Непригодные данные, %"><input type="number" min={0} max={95} value={project.expectedInvalidRate} onChange={(event) => update("expectedInvalidRate", Number(event.target.value))} /></Field><Field label="Приглашений в неделю"><input type="number" min={1} value={project.recruitmentPerWeek} onChange={(event) => update("recruitmentPerWeek", Number(event.target.value))} /></Field></div><div className="scenario-compare"><article><span>Базовый сценарий</span><strong>{scenario.base.weeks} нед.</strong><b>{scenario.base.invited} приглашений</b><small>{scenario.base.participantHours} ч суммарной нагрузки участников</small></article><article><span>Стресс-сценарий</span><strong>{scenario.stress.weeks} нед.</strong><b>{scenario.stress.invited} приглашений</b><small>Темп {scenario.stress.weeklyRate}/нед., потери {scenario.stress.attritionRate}% + {scenario.stress.invalidRate}%</small></article></div><button className="button button--ink" onClick={() => jump("sample")}>Доработать выборку <ArrowRight size={16} /></button></>}
      {tab === "decisions" && <><div className="decision-radar-head"><div><strong>{project.decisionLog.length ? `${project.decisionLog.length} решений записано` : "Журнал пока пуст"}</strong><p>После просмотра данных изменение не запрещено — запрещено маскировать его под первоначальный план.</p></div><button className="button button--soft" onClick={() => jump("protocol")}><Plus size={16} /> Добавить запись</button></div><div className="decision-radar-list">{project.decisionLog.slice(-5).reverse().map((item) => <article key={item.id}><span>{item.date || "без даты"}</span><strong>{item.decision || "Решение ещё не сформулировано"}</strong><p>{item.rationale || "Основание не записано"}</p><small>{item.timing === "after-data" ? "после просмотра данных" : "до просмотра данных"} · {item.status === "revised" ? "пересмотрено" : item.status === "adopted" ? "принято" : "запланировано"}</small></article>)}</div>{!project.decisionLog.length && <div className="decision-empty"><ListChecks /><div><strong>Начните с первого изменения</strong><p>Например: решение после пилота, замечание руководителя или вынужденная замена метода.</p></div></div>}</>}
    </div>
  </aside></div>;
}

function LogicStep({ project, update }: StepProps) {
  const setHypothesis = (id: string, patch: Partial<Hypothesis>) => update("hypotheses", project.hypotheses.map((item) => item.id === id ? { ...item, ...patch } : item));
  const setTask = (index: number, value: string) => update("tasks", project.tasks.map((item, i) => i === index ? value : item));
  const topic = analyzeTopic(project.topic, project.requirementProfile, project.design);
  return <section className="content-section step-page">
    <SectionHead eyebrow="Блок 02 · психологическая методология" title="Соберите логический позвоночник" text="В традициях психологической школы МГУ исследование начинается с предмета, теоретической проблемы и предполагаемого психологического механизма — не с понравившегося теста или статистики." />
    <div className="logic-map" aria-label="Логика исследования"><span>Теория</span><ChevronRight /><span>Проблема</span><ChevronRight /><span>Вопрос</span><ChevronRight /><span>Механизм</span><ChevronRight /><span>Проверка</span></div>
    <div className="topic-lab"><div className="topic-score"><strong>{topic.score}%</strong><span>ясность темы</span><small>{project.requirementProfile === "msu-branch" ? "учебный профиль ТФ МГУ" : project.requirementProfile === "article" ? "профиль статьи" : "универсальный профиль"}</small></div><div className="topic-signals">{topic.signals.map((signal) => <div className={signal.ok ? "topic-signal topic-signal--ok" : "topic-signal"} key={signal.id}><span>{signal.ok ? <Check size={14} /> : "!"}</span><div><b>{signal.label}</b>{!signal.ok && <small>{signal.advice}</small>}</div></div>)}</div><div className="topic-metric"><b>{topic.wordCount || "—"}</b><span>слов</span><small>Краткость — ориентир, а не замена содержанию.</small></div></div>
    <div className="form-card form-grid">
      <Field label="Тема" hint="Кто/что + какой феномен + в каком контексте" wide><textarea rows={2} placeholder="Например: связь стратегий регуляции эмоций с академическим стрессом у студентов первого курса" value={project.topic} onChange={(e) => update("topic", e.target.value)} /></Field>
      <Field label="Проблема" hint="Не «тема мало изучена», а конкретный пробел или противоречие" wide><textarea rows={3} placeholder="Что уже известно — и чего не хватает для ответа?" value={project.problem} onChange={(e) => update("problem", e.target.value)} /></Field>
      <Field label="Актуальность" hint="Почему этот пробел важен для психологической теории, практики или человека" wide><textarea rows={3} placeholder="Что изменит получение ответа — и для кого?" value={project.relevance} onChange={(e) => update("relevance", e.target.value)} /></Field>
      <Field label="Объект" hint="Более широкая область психической реальности"><textarea rows={2} value={project.object} onChange={(e) => update("object", e.target.value)} /></Field>
      <Field label="Предмет" hint="Конкретная связь, свойство или процесс в объекте"><textarea rows={2} value={project.subject} onChange={(e) => update("subject", e.target.value)} /></Field>
      <Field label="Исследовательский вопрос" hint="Один вопрос, на который действительно ответят данные" wide><textarea rows={2} placeholder="Как связаны X и Y у Z?" value={project.question} onChange={(e) => update("question", e.target.value)} /></Field>
      <Field label="Цель" hint="Начните с действия: выявить, проверить, описать, сравнить" wide><textarea rows={2} value={project.aim} onChange={(e) => update("aim", e.target.value)} /></Field>
    </div>
    <div className="live-blueprint"><div className="subsection-head"><div><span className="eyebrow">Результат меняется сразу</span><h3>Живая карта замысла</h3></div></div><div className="blueprint-flow"><article><span>01</span><small>Проблема</small><strong>{project.problem || "Что в знании не объяснено?"}</strong></article><ArrowRight /><article><span>02</span><small>Вопрос</small><strong>{project.question || "На какой вопрос ответят данные?"}</strong></article><ArrowRight /><article><span>03</span><small>Механизм</small><strong>{project.theory || "Как теория связывает условия и результат?"}</strong></article><ArrowRight /><article><span>04</span><small>Проверка</small><strong>{project.designRationale || "Какой дизайн отличит объяснение от альтернатив?"}</strong></article></div><p className="claim-preview"><b>Допустимый язык вывода:</b> {project.design === "experimental" ? "оценка причинного эффекта возможна только при выполненной манипуляции, распределении и контроле" : project.design === "qualitative" ? "описание опыта, смыслов и процессов с явными границами переноса" : "связь, различия или прогноз — без автоматического причинного вывода"}.</p></div>
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
  const setEvidence = (id: string, patch: Partial<EvidenceItem>) => update("evidenceItems", project.evidenceItems.map((item) => item.id === id ? { ...item, ...patch } : item));
  const addEvidence = () => update("evidenceItems", [...project.evidenceItems, { id: uid(), citation: "", year: new Date().getFullYear(), design: "", sample: "", finding: "", limitation: "", relevance: "", stance: "context" }]);
  const matrix = evidenceHealth(project.evidenceItems);
  const stanceNames: Record<EvidenceItem["stance"], string> = { supports: "Поддерживает ожидание", mixed: "Смешанный результат", contradicts: "Противоречит", context: "Даёт контекст" };
  return <section className="content-section step-page">
    <SectionHead eyebrow="Блок 03 · основания" title="Постройте теоретическую рамку и найдите реальный пробел" text="Сначала реконструируйте подходы и понятия, затем сопоставьте современные обзоры и первичные исследования. Список найденных статей ещё не является теоретической главой." />
    <div className="evidence-layers">{[
      ["01", "Школа и понятия", "Как определяется предмет в культурно-историческом, деятельностном или другом обоснованном подходе?"],
      ["02", "Обзоры и метаанализы", "Что уже устойчиво известно и где результаты расходятся?"],
      ["03", "Первичные исследования", "Какие дизайны, выборки и операционализации дают конкретные эффекты?"],
      ["04", "Методические источники", "Насколько валидны измерения и применимы ли версии к вашей выборке?"],
    ].map(([n, title, text]) => <article key={n}><b>{n}</b><strong>{title}</strong><p>{text}</p></article>)}</div>
    <div className="subsection-head"><div><span className="eyebrow">Теоретическая мастерская</span><h3>Выберите объяснительную оптику</h3></div></div>
    <div className="theory-grid">{theoryFrameworks.map((framework) => <button key={framework.id} onClick={() => update("theory", `${framework.title}. Центральный вопрос: ${framework.core} Предполагаемый механизм: ${framework.mechanism}`)}><span>{framework.title}</span><strong>{framework.core}</strong><p>{framework.mechanism}</p><small><b>Не делать:</b> {framework.misuse}</small></button>)}</div>
    <div className="form-card form-grid">
      <Field label="Теоретическая рамка" hint="Назовите подход, авторов, ключевые понятия и предполагаемый механизм" wide><textarea rows={5} placeholder="Например: культурно-исторический и деятельностный подходы; единица анализа; механизм регуляции…" value={project.theory} onChange={(e) => update("theory", e.target.value)} /></Field>
      <Field label="Ключевые слова" hint="Русские и английские термины, синонимы, названия конструктов" wide><textarea rows={3} value={project.keywords} onChange={(e) => update("keywords", e.target.value)} /></Field>
      <Field label="Поисковый запрос" hint="Сохраните точную строку, дату поиска и фильтры" wide><textarea rows={3} placeholder='("emotion regulation" OR reappraisal) AND (student* OR undergraduate*) AND stress' value={project.searchQuery} onChange={(e) => update("searchQuery", e.target.value)} /></Field>
      <Field label="Критерии отбора" hint="Период, язык, популяция, дизайн, тип публикации" wide><textarea rows={3} value={project.literatureCriteria} onChange={(e) => update("literatureCriteria", e.target.value)} /></Field>
      <Field label="Пробел в знаниях" hint="Чего именно не позволяют решить уже опубликованные работы" wide><textarea rows={4} placeholder="Не «мало исследований», а противоречие, неизвестный механизм, непроверенная граница или проблема измерения" value={project.evidenceGap} onChange={(e) => update("evidenceGap", e.target.value)} /></Field>
    </div>
    <div className="database-picks"><span>Где искать</span>{databases.map((item) => <button key={item} className={project.databases.includes(item) ? "chip chip--active" : "chip"} onClick={() => toggle(item)}>{project.databases.includes(item) && <Check size={14} />}{item}</button>)}</div>
    <div className="evidence-matrix-head"><div><span className="eyebrow">Рабочая матрица</span><h3>Не склад ссылок, а карта доказательств</h3><p>Для каждой работы зафиксируйте вывод, ограничение и то, зачем она нужна именно вашему вопросу.</p></div><div className="evidence-matrix-score"><strong>{matrix.score}%</strong><span>{matrix.complete} полных из {matrix.total}</span></div></div>
    <div className="evidence-matrix">{project.evidenceItems.map((item, index) => <article className="evidence-record" key={item.id}>
      <div className="evidence-record__head"><span>S{String(index + 1).padStart(2, "0")}</span><select aria-label={`Роль источника ${index + 1}`} value={item.stance} onChange={(event) => setEvidence(item.id, { stance: event.target.value as EvidenceItem["stance"] })}>{Object.entries(stanceNames).map(([id, label]) => <option key={id} value={id}>{label}</option>)}</select><button className="icon-button" onClick={() => update("evidenceItems", project.evidenceItems.filter((source) => source.id !== item.id))} aria-label={`Удалить источник ${index + 1}`}><Trash2 size={16} /></button></div>
      <div className="form-grid"><Field label="Ссылка / авторы" wide><input value={item.citation} onChange={(event) => setEvidence(item.id, { citation: event.target.value })} placeholder="Автор, год, название или DOI" /></Field><Field label="Год"><input type="number" min={1900} max={new Date().getFullYear()} value={item.year} onChange={(event) => setEvidence(item.id, { year: Number(event.target.value) })} /></Field><Field label="Дизайн"><input value={item.design} onChange={(event) => setEvidence(item.id, { design: event.target.value })} placeholder="Лонгитюд, эксперимент, обзор…" /></Field><Field label="Выборка / материал" wide><input value={item.sample} onChange={(event) => setEvidence(item.id, { sample: event.target.value })} placeholder="N, возраст, контекст или корпус" /></Field><Field label="Главный вывод" wide><textarea rows={2} value={item.finding} onChange={(event) => setEvidence(item.id, { finding: event.target.value })} /></Field><Field label="Ограничение" wide><textarea rows={2} value={item.limitation} onChange={(event) => setEvidence(item.id, { limitation: event.target.value })} /></Field><Field label="Роль в вашей работе" wide><textarea rows={2} value={item.relevance} onChange={(event) => setEvidence(item.id, { relevance: event.target.value })} placeholder="Как меняет гипотезу, дизайн или границы вывода?" /></Field></div>
    </article>)}</div>
    {!project.evidenceItems.length && <div className="evidence-empty"><LibraryBig /><div><strong>Матрица пока пустая</strong><p>Добавьте хотя бы три ключевые работы: подтверждающую, ограничивающую и конкурирующую.</p></div></div>}
    <button className="button button--soft add-wide" onClick={addEvidence}><Plus size={16} /> Добавить источник в матрицу</button>
    {project.evidenceItems.length >= 3 && !matrix.hasCounterEvidence && <div className="conflict-note"><CircleHelp /><p><b>Слишком гладкая картина.</b> В матрице пока нет смешанного или противоречащего результата. Ищите не только подтверждение — иначе обзор быстро превращается в адвоката собственной гипотезы.</p></div>}
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
  const cockpit = experimentReadiness({ manipulation: project.manipulation, controlCondition: project.controlCondition, assignmentPlan: project.assignmentPlan, counterbalancing: project.counterbalancing, manipulationCheck: project.manipulationCheck, fidelityPlan: project.fidelityPlan, qualityRules: project.qualityRules, experimentControls: project.experimentControls });
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
      <div className="subsection-head"><div><span className="eyebrow">Экспериментальный cockpit</span><h3>От фактора — к причинному выводу</h3></div><span className="control-count">готовность {cockpit.score}%</span></div>
      <div className="causal-readiness"><div><strong>{cockpit.score}%</strong><span>готовность причинной проверки</span></div><p>{cockpit.missing.length ? `Не хватает: ${cockpit.missing.slice(0, 4).join(", ")}${cockpit.missing.length > 4 ? "…" : ""}.` : "Основные элементы зафиксированы. Теперь проверьте содержательное качество и остаточные угрозы."}</p></div>
      <div className="experiment-designs">{experimentDesigns.map((item) => <button key={item.id} className={project.experimentStructure === item.id ? "experiment-design experiment-design--active" : "experiment-design"} onClick={() => update("experimentStructure", item.id)}><span>{item.title}</span><strong>{item.best}</strong><p><b>Главный риск:</b> {item.threat}</p><small>{item.analysis}</small></button>)}</div>
      <div className="form-card form-grid">
        <Field label="Независимая переменная и уровни" hint="Что именно меняется между условиями; активный компонент и контроль" wide><textarea rows={4} placeholder="Фактор: тип обратной связи. Уровни: поддерживающая / нейтральная. Всё остальное одинаково." value={project.manipulation} onChange={(e) => update("manipulation", e.target.value)} /></Field>
        <Field label="Контрольное условие" hint="Что переживает контроль и почему это честное сравнение"><textarea rows={4} value={project.controlCondition} onChange={(e) => update("controlCondition", e.target.value)} /></Field>
        <Field label="Распределение по условиям" hint="Единица, генерация последовательности, сокрытие; если рандомизации нет — почему"><textarea rows={4} value={project.assignmentPlan} onChange={(e) => update("assignmentPlan", e.target.value)} /></Field>
        <Field label="Порядок и контрбалансировка" hint="Для внутригруппового плана: последовательности, отмывка, рандомизация порядка"><textarea rows={4} value={project.counterbalancing} onChange={(e) => update("counterbalancing", e.target.value)} /></Field>
        <Field label="Ослепление и стандартизация" hint="Кто знает условие; что автоматизировано; единые инструкции"><textarea rows={4} value={project.blindingPlan} onChange={(e) => update("blindingPlan", e.target.value)} /></Field>
        <Field label="Проверка манипуляции" hint="Показатель, не дублирующий основной исход, и момент измерения"><textarea rows={4} value={project.manipulationCheck} onChange={(e) => update("manipulationCheck", e.target.value)} /></Field>
        <Field label="Верность реализации" hint="Как проверить, что процедура действительно проведена по сценарию"><textarea rows={4} value={project.fidelityPlan} onChange={(e) => update("fidelityPlan", e.target.value)} /></Field>
        <Field label="ПО, оборудование и версии" hint="Браузер/платформа, устройство, тайминг, калибровка"><textarea rows={4} value={project.softwarePlan} onChange={(e) => update("softwarePlan", e.target.value)} /></Field>
        <Field label="Структура проб" hint="Тренировка, блоки, число проб, паузы, порядок"><textarea rows={4} value={project.trialPlan} onChange={(e) => update("trialPlan", e.target.value)} /></Field>
        <Field label="Правила качества" hint="Минимальная точность, технические ошибки, слишком быстрые ответы, решение до просмотра эффекта"><textarea rows={4} value={project.qualityRules} onChange={(e) => update("qualityRules", e.target.value)} /></Field>
        <Field label="Дебрифинг" hint="Что объясняется после участия, особенно при неполном раскрытии цели"><textarea rows={4} value={project.debriefPlan} onChange={(e) => update("debriefPlan", e.target.value)} /></Field>
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
  const scenario = buildRecruitmentStressScenario({ targetN: project.sampleSize, attritionRate: project.attrition, invalidRate: project.expectedInvalidRate, weeklyRate: project.recruitmentPerWeek, participantMinutes: project.methods.reduce((sum, method) => sum + method.minutes, 0) });
  return <section className="content-section step-page"><SectionHead eyebrow="Блок 06" title="Спроектируйте выборку, а не просто число" text="Опишите, на кого распространяется вопрос, кто реально попадёт в данные и почему такой объём достаточен." />
    <div className="sample-layout"><div className="form-card form-grid">
      <Field label="Генеральная совокупность" wide><textarea rows={2} placeholder="Например: студенты очной формы 18–24 лет российских вузов" value={project.population} onChange={(e) => update("population", e.target.value)} /></Field>
      <Field label="Критерии включения"><textarea rows={4} placeholder="Возраст, статус, язык, опыт…" value={project.inclusion} onChange={(e) => update("inclusion", e.target.value)} /></Field>
      <Field label="Критерии исключения"><textarea rows={4} placeholder="Дубли, незавершённые анкеты…" value={project.exclusion} onChange={(e) => update("exclusion", e.target.value)} /></Field>
      <Field label="Способ выборки"><select value={project.samplingMethod} onChange={(e) => update("samplingMethod", e.target.value)}><option value="convenience">Доступная</option><option value="purposeful">Целевая</option><option value="snowball">Снежный ком</option><option value="stratified">Стратифицированная</option><option value="cluster">Кластерная</option><option value="probability">Вероятностная</option><option value="theoretical">Теоретическая / информационная</option></select></Field>
      <Field label="Запас на отсев, %"><input type="number" min={0} max={90} value={project.attrition} onChange={(e) => update("attrition", Number(e.target.value))} /></Field>
      <Field label="Ожидаемо непригодных, %" hint="Дубли, технические сбои, заранее заданные правила качества"><input type="number" min={0} max={90} value={project.expectedInvalidRate} onChange={(e) => update("expectedInvalidRate", Number(e.target.value))} /></Field>
      <Field label="Реальный темп приглашений в неделю"><input type="number" min={1} value={project.recruitmentPerWeek} onChange={(e) => update("recruitmentPerWeek", Number(e.target.value))} /></Field>
      <Field label="Стратегия набора" wide><textarea rows={3} placeholder="Где искать участников, как приглашать, будет ли вознаграждение" value={project.recruitment} onChange={(e) => update("recruitment", e.target.value)} /></Field>
    </div><div className="calculator">
      <span className="eyebrow eyebrow--light">Оценка для планирования</span><h3>Размер выборки</h3><p>Ориентир, не замена расчёту мощности под конкретный статистический тест.</p>
      {!nonPower && <><Field label="Ожидаемый эффект"><select value={project.sampleEffect} onChange={(e) => update("sampleEffect", e.target.value)}><option value="small">Малый</option><option value="medium">Средний</option><option value="large">Большой</option></select></Field><Field label="Желаемая мощность"><select value={project.samplePower} onChange={(e) => update("samplePower", Number(e.target.value))}><option value={0.8}>0,80</option><option value={0.9}>0,90</option></select></Field><div className="estimate"><span>грубый ориентир</span><strong>≈ {estimated}</strong><small>завершённых наблюдений</small></div></>}
      {nonPower && <div className="estimate estimate--text"><strong>{project.pathway === "qualitative" ? "Информационная достаточность" : project.pathway === "review" ? "Корпус источников" : "Модель измерения"}</strong><small>{project.pathway === "qualitative" ? "Обоснуйте разнообразие случаев, глубину материала и информационную силу." : project.pathway === "review" ? "Число определяется поиском и критериями, а не мощностью участников." : "Планируйте под сложность факторной модели, точность и независимую проверку."}</small></div>}
      <Field label="Плановый объём"><input type="number" min={1} value={project.sampleSize} onChange={(e) => update("sampleSize", Number(e.target.value))} /></Field>
      <p className="calculator__note">С учётом отсева и непригодных наблюдений потребуется ≈ {scenario.base.invited} приглашений. Не меняйте правило остановки после просмотра основных эффектов.</p>
    </div></div>
    <div className={`field-stress field-stress--${scenario.level}`}><div><span className="eyebrow eyebrow--light">Полевой стресс-тест</span><h3>{scenario.level === "critical" ? "План набора хрупкий" : scenario.level === "warning" ? "Нужен резервный канал" : "План выдерживает ухудшение"}</h3><p>Симуляция не обещает реальный темп. Она показывает, что произойдёт, если отсев вырастет на 15 п.п., непригодные данные — на 10 п.п., а набор замедлится на 30%.</p></div><div className="field-stress__metrics"><article><span>Базовый план</span><strong>{scenario.base.weeks} нед.</strong><small>{scenario.base.invited} приглашений</small></article><article><span>Стресс-сценарий</span><strong>{scenario.stress.weeks} нед.</strong><small>{scenario.stress.invited} приглашений</small></article><article><span>Нагрузка участников</span><strong>{scenario.base.participantHours} ч</strong><small>суммарное время прохождения</small></article></div></div>
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
  const setDecision = (id: string, patch: Partial<DecisionItem>) => update("decisionLog", project.decisionLog.map((item) => item.id === id ? { ...item, ...patch } : item));
  const addDecision = () => update("decisionLog", [...project.decisionLog, { id: uid(), date: new Date().toISOString().slice(0, 10), decision: "", rationale: "", timing: "before-data", status: "planned" }]);
  return <section className="content-section step-page"><SectionHead eyebrow="Блок 08" title="Сделайте процедуру воспроизводимой" text="Другой исследователь должен понять, что происходит с участником или материалом от приглашения до готовой таблицы — без догадок и устных уточнений." />
    <div className="protocol-flow">{["Приглашение", "Согласие", "Инструкция", "Задания", "Дебрифинг", "Подготовка данных"].map((item, i) => <span key={item}><b>{i + 1}</b>{item}</span>)}</div>
    <div className="form-card form-grid"><Field label="Пошаговая процедура" hint="Порядок, длительность, рандомизация, перерывы, инструкции, дебрифинг" wide><textarea rows={7} value={project.procedure} onChange={(e) => update("procedure", e.target.value)} /></Field><Field label="Пилотирование" hint="Что проверяете и что будет основанием для изменения"><textarea rows={4} value={project.pilotPlan} onChange={(e) => update("pilotPlan", e.target.value)} /></Field><Field label="Правило завершения сбора" hint="Фиксированный N, дата или обоснованный критерий достаточности"><textarea rows={4} value={project.stoppingRule} onChange={(e) => update("stoppingRule", e.target.value)} /></Field></div>
    <div className="prereg-card"><div><span className="eyebrow">До просмотра исходов</span><h3>Пакет пререгистрации</h3><p>{project.preregistrationChecks.length} из {items.length} решений зафиксировано</p></div><div>{items.map((item) => <label className="light-check" key={item}><input type="checkbox" checked={project.preregistrationChecks.includes(item)} onChange={() => toggle(item)} /><span><Check size={14} /></span>{item}</label>)}</div></div>
    <div className="decision-log-head"><div><span className="eyebrow">Журнал решений</span><h3>Исследовательская память без переписывания прошлого</h3><p>План можно менять. Журнал сохраняет, что изменилось, почему и было ли это до или после просмотра данных.</p></div><button className="button button--soft" onClick={addDecision}><Plus size={16} /> Записать решение</button></div>
    <div className="decision-log">{project.decisionLog.map((item, index) => <article key={item.id}><div className="decision-log__head"><span>D{String(index + 1).padStart(2, "0")}</span><input type="date" aria-label={`Дата решения ${index + 1}`} value={item.date} onChange={(event) => setDecision(item.id, { date: event.target.value })} /><select aria-label={`Момент решения ${index + 1}`} value={item.timing} onChange={(event) => setDecision(item.id, { timing: event.target.value as DecisionItem["timing"] })}><option value="before-data">До просмотра данных</option><option value="after-data">После просмотра данных</option></select><select aria-label={`Статус решения ${index + 1}`} value={item.status} onChange={(event) => setDecision(item.id, { status: event.target.value as DecisionItem["status"] })}><option value="planned">Запланировано</option><option value="adopted">Принято</option><option value="revised">Пересмотрено</option></select><button className="icon-button" aria-label={`Удалить решение ${index + 1}`} onClick={() => update("decisionLog", project.decisionLog.filter((decision) => decision.id !== item.id))}><Trash2 size={16} /></button></div><Field label="Что решено" wide><textarea rows={2} value={item.decision} onChange={(event) => setDecision(item.id, { decision: event.target.value })} placeholder="Например: заменить основной тест на модель Уэлча" /></Field><Field label="Основание и влияние на вывод" wide><textarea rows={2} value={item.rationale} onChange={(event) => setDecision(item.id, { rationale: event.target.value })} placeholder="Что стало основанием и меняет ли решение подтверждающий статус анализа?" /></Field></article>)}</div>
    {!project.decisionLog.length && <div className="decision-empty"><ListChecks /><div><strong>Пока решений нет</strong><p>Записывайте сюда изменения после пилота, замечаний руководителя и технических ограничений.</p></div></div>}
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
  const safetyChecks = [filled(project.dataTypes), filled(project.accessRoles), filled(project.retentionPeriod), filled(project.deletionPlan), filled(project.incidentPlan), project.dataSensitivity !== "restricted"];
  const safetyScore = Math.round(safetyChecks.filter(Boolean).length / safetyChecks.length * 100);
  const generate = () => update("consent", `Вас приглашают принять участие в исследовании «${project.title}». Цель исследования: ${project.aim || "[укажите цель]"}. Участие добровольное и займёт около ${Math.max(5, project.methods.reduce((s, m) => s + m.minutes, 0))} минут. ${project.risk || "[опишите возможные неудобства и способы их минимизации]"} ${project.withdrawal} ${project.storage} Перед началом вы сможете задать вопросы исследователю. Нажимая «Согласен(на)», вы подтверждаете, что прочитали информацию, достигли необходимого возраста и добровольно соглашаетесь участвовать.`);
  return <section className="content-section step-page"><SectionHead eyebrow="Блок 10" title="Защитите участника, данные и исследование" text="Этика — это не одна галочка. Собирайте только необходимое, разделяйте идентификаторы и ответы, ограничивайте доступ и заранее определяйте проверяемое удаление." />
    <div className="data-ban"><ShieldCheck /><div><b>В конструктор запрещено вводить данные участников</b><p>Здесь должны быть только план, формулировки и методические решения. Не вставляйте ФИО, контакты, ответы, идентификаторы, медицинские сведения или выгрузки исследования.</p></div><strong>{safetyScore}%<small>контур безопасности</small></strong></div>
    <div className="subsection-head"><div><span className="eyebrow">Классификация</span><h3>Сначала определите чувствительность данных</h3></div></div>
    <div className="safety-levels">{dataSafetyLevels.map((level) => <button key={level.id} className={project.dataSensitivity === level.id ? "safety-level safety-level--active" : "safety-level"} onClick={() => update("dataSensitivity", level.id)}><span>{level.title}</span><strong>{level.examples}</strong><p>{level.controls}</p></button>)}</div>
    {project.dataSensitivity === "restricted" && <div className="restricted-warning"><LockKeyhole /><p><b>Остановитесь на уровне планирования.</b> Особо чувствительные данные нельзя переносить в этот конструктор или обычную таблицу. Используйте только согласованную с организацией инфраструктуру, роли доступа, шифрование и процедуру реагирования.</p></div>}
    <div className="ethics-layout"><div className="checklist"><div className="subsection-head"><div><span className="eyebrow">Минимум до запуска</span><h3>{project.ethicsChecks.length} / {ethicsItems.length} пунктов</h3></div></div>{ethicsItems.map((item) => <label className="check-item" key={item}><input type="checkbox" checked={project.ethicsChecks.includes(item)} onChange={() => toggle(item)} /><span className="fake-check"><Check size={14} /></span><span>{item}</span></label>)}</div><div className="form-card form-grid"><Field label="Риски и дискомфорт" wide><textarea rows={4} placeholder="Эмоциональный дискомфорт, усталость, чувствительные вопросы; как снижаете риск?" value={project.risk} onChange={(e) => update("risk", e.target.value)} /></Field><Field label="Минимальный состав данных" wide><textarea rows={4} value={project.dataTypes} onChange={(e) => update("dataTypes", e.target.value)} /></Field><Field label="Хранение и защита" wide><textarea rows={4} value={project.storage} onChange={(e) => update("storage", e.target.value)} /></Field><Field label="Кто имеет доступ" wide><textarea rows={3} value={project.accessRoles} onChange={(e) => update("accessRoles", e.target.value)} /></Field><Field label="Срок хранения" wide><textarea rows={3} value={project.retentionPeriod} onChange={(e) => update("retentionPeriod", e.target.value)} /></Field><Field label="Отказ участника и удаление его данных" wide><textarea rows={3} value={project.withdrawal} onChange={(e) => update("withdrawal", e.target.value)} /></Field><Field label="Проверяемое уничтожение" wide><textarea rows={4} value={project.deletionPlan} onChange={(e) => update("deletionPlan", e.target.value)} /></Field><Field label="План реакции на инцидент" wide><textarea rows={4} value={project.incidentPlan} onChange={(e) => update("incidentPlan", e.target.value)} /></Field></div></div>
    <div className="storage-inventory"><div><span>Обычный режим</span><b>Один локальный JSON-проект</b><p>Автосохранение работает только в хранилище этого браузера. Аккаунта и облачной базы проекта нет.</p></div><div><span>Приватная сессия</span><b>Только память открытой вкладки</b><p>При включении локальная копия удаляется и новые изменения не сохраняются после закрытия вкладки.</p></div><div><span>Проверяемое удаление</span><b>Два ключа — точечная очистка</b><p>Кнопка удаляет <code>{STORAGE_KEY}</code> и прежний <code>{LEGACY_STORAGE_KEY}</code>, затем проверяет отсутствие. Скачанные файлы удаляются отдельно.</p></div></div>
    <div className="threat-model"><article><span>Устройство</span><strong>Чужой доступ к браузеру</strong><p>Используйте отдельный профиль ОС, блокировку экрана и приватную сессию на общем компьютере.</p></article><article><span>Экспорт</span><strong>Случайная пересылка файла</strong><p>Для обмена скачивайте безопасную JSON-копию без руководителя, контактов набора и текста согласия.</p></article><article><span>Синхронизация</span><strong>Копии в загрузках и облаке</strong><p>Проверьте папку загрузок, корзину, резервные копии и автоматическую синхронизацию после окончания проекта.</p></article><article><span>Инцидент</span><strong>Потеря контроля</strong><p>Остановите доступ, зафиксируйте факт, уведомите ответственных и оцените риск для участников.</p></article></div>
    <div className="consent-builder"><div className="subsection-head"><div><span className="eyebrow">Черновик документа</span><h3>Информированное согласие</h3></div><div className="button-row"><button className="button button--soft" onClick={generate}><Sparkles size={16} /> Собрать из проекта</button><button className="button button--ghost" disabled={!project.consent} onClick={copyConsent}><Copy size={16} /> Копировать</button></div></div><textarea rows={10} placeholder="Соберите черновик кнопкой или напишите свой текст…" value={project.consent} onChange={(e) => update("consent", e.target.value)} /></div>
    <Tip>Для несовершеннолетних, клинических групп, обмана в процедуре или чувствительных тем нужен отдельный разбор рисков и требований вашей организации.</Tip>
  </section>;
}

function ReportStep({ project, update, readiness, exportDocx }: StepProps & { readiness: number; exportDocx: () => void }) {
  const standard = reportingStandards.find((item) => item.id === project.reportingStandard);
  const localVolume = project.level === "Курсовая работа" ? "45–50 страниц" : project.level === "ВКР бакалавра" ? "50–60 страниц" : project.level === "Курсовая работа магистра" ? "40–45 страниц" : project.level === "Магистерская диссертация" ? "70–80 страниц" : "определяется форматом издания";
  return <section className="content-section step-page"><SectionHead eyebrow="Блок 11" title="Спроектируйте отчёт и защиту заранее" text="Сильный текст показывает движение от теоретической проблемы к данным и обратно. Стандарт отчётности помогает не потерять детали, но не заменяет требования кафедры." />
    <div className="local-report-head"><div><span className="eyebrow eyebrow--light">Учебный профиль ТФ МГУ</span><h3>{project.level}: {localVolume}</h3><p>Это рабочий ориентир по структуре и объёму, а не универсальный закон. Для статьи или самостоятельного проекта используйте стандарт выбранного издания и задачу исследования.</p></div><small>Сверить перед сдачей</small></div>
    <div className="branch-report-grid">{[
      ["01", "Введение · 1,5–2 стр.", "Актуальность → проблема → цель → объект/предмет → задачи → гипотезы → методология → методы → значимость"],
      ["02", "Теоретическая глава", "Понятия → подходы → классика + последние 5 лет + иностранные работы → противоречия → авторская позиция → выводы"],
      ["03", "Программа эмпирики", "Методологический раздел: интерпретация и операционализация. Процедурный: дизайн, выборка, методы, порядок"],
      ["04", "Результаты и анализ", "Качество инструментов → выборка/описания → каждая гипотеза → эффект и ДИ → отдельный разведочный анализ"],
      ["05", "Интерпретация", "Статистика → психологические механизмы → теория и литература → альтернативы/артефакты → практический смысл"],
      ["06", "Выводы и заключение", "5–7 содержательных выводов без p; затем цель/задачи, ограничения, значимость и перспективы"],
    ].map(([number, title, text]) => <article key={number}><b>{number}</b><div><strong>{title}</strong><p>{text}</p></div></article>)}</div>
    <div className="conflict-note"><CircleHelp /><p><b>По объёму заключения встречаются разные ориентиры.</b> Не подгоняйте содержательный раздел под случайную цифру: подтвердите актуальное требование у руководителя до финальной вёрстки.</p></div>
    <div className="report-structure">{[["Введение", "Проблема → теория → пробел → цель"], ["Метод", "Участники → дизайн → инструменты → процедура"], ["Результаты", "Качество данных → основной эффект → чувствительность"], ["Обсуждение", "Смысл → альтернативы → границы → следующий шаг"]].map(([title, text], i) => <article key={title}><b>{String(i + 1).padStart(2, "0")}</b><strong>{title}</strong><p>{text}</p></article>)}</div>
    <div className="subsection-head"><div><span className="eyebrow">Полнота описания</span><h3>Стандарт отчётности</h3></div></div>
    <div className="standards-grid">{reportingStandards.map((item) => <button key={item.id} className={project.reportingStandard === item.id ? "standard-card standard-card--active" : "standard-card"} onClick={() => update("reportingStandard", item.id)}><span>{project.reportingStandard === item.id && <Check size={15} />}</span><strong>{item.title}</strong><p>{item.fit}</p><small>{item.checks}</small></button>)}</div>
    {standard && <a className="standard-link" href={standard.url} target="_blank" rel="noreferrer">Открыть официальный чек-лист {standard.title} <ArrowRight size={16} /></a>}
    <div className="form-card form-grid"><Field label="Ограничения и угрозы валидности" hint="Что данные не позволяют утверждать и почему" wide><textarea rows={5} value={project.limitations} onChange={(e) => update("limitations", e.target.value)} /></Field><Field label="Распространение и обратная связь" hint="Кому, в каком виде и без каких идентификаторов сообщаются результаты" wide><textarea rows={4} value={project.dissemination} onChange={(e) => update("dissemination", e.target.value)} /></Field></div>
    <div className="defense-card"><div><span className="eyebrow eyebrow--light">Черновик к обсуждению</span><h3>{readiness}% структурной готовности</h3><p>Экспорт включает логику, литературу, модель переменных, протокол, этику, данные и план анализа.</p></div><button className="button button--amber" onClick={exportDocx}><Download size={17} /> Скачать DOCX</button></div>
  </section>;
}

function AuditStep({ project, update, audit, readiness, go, exportDocx, signals }: { project: Project; update: StepProps["update"]; audit: { label: string; ok: boolean; step: StepId; group?: string }[]; readiness: number; go: (id: StepId) => void; exportDocx: () => void; signals: { level: "critical" | "warning" | "good"; title: string; text: string; step: StepId }[] }) {
  const critical = audit.filter((item) => !item.ok);
  const [reviewId, setReviewId] = useState<(typeof reviewerQuestions)[number]["id"]>(reviewerQuestions[0].id);
  const currentReview = reviewerQuestions.find((item) => item.id === reviewId) || reviewerQuestions[0];
  const answered = reviewerQuestions.filter((item) => filled(project.reviewResponses[item.id] || "")).length;
  const nextUnanswered = reviewerQuestions.find((item) => !filled(project.reviewResponses[item.id] || ""));
  const setReviewAnswer = (value: string) => update("reviewResponses", { ...project.reviewResponses, [currentReview.id]: value });
  return <section className="content-section step-page"><SectionHead eyebrow="Блок 12" title="Аудит связности проекта" text="Это не оценка научной истины, а проверка каркаса: каждый сильный вывод должен иметь вопрос, данные, метод и прозрачное ограничение." />
    <div className="audit-hero"><div className="audit-ring" style={{ "--score": `${readiness * 3.6}deg` } as React.CSSProperties}><span><b>{readiness}%</b><small>готовность</small></span></div><div><span className="eyebrow eyebrow--light">Диагностика</span><h3>{readiness >= 85 ? "Проект можно выносить на предметное обсуждение" : readiness >= 55 ? "Основа есть — закройте критические разрывы" : "Сначала соберите обязательный каркас"}</h3><p>{project.title}</p><button className="button button--amber" onClick={exportDocx}><FileText size={17} /> Скачать проект</button></div></div>
    {signals.length > 0 && <div className="signal-list">{signals.map((signal) => <button key={signal.title} className={`signal-card signal-card--${signal.level}`} onClick={() => go(signal.step)}><span>{signal.level === "critical" ? "Критично" : signal.level === "warning" ? "Проверить" : "Хорошо"}</span><strong>{signal.title}</strong><p>{signal.text}</p><ArrowRight size={17} /></button>)}</div>}
    <div className="red-team-lab">
      <div className="red-team-head"><div><span className="eyebrow eyebrow--light">Режим строгого рецензента</span><h3>Попробуйте сломать проект до того, как это сделают на обсуждении</h3><p>Ответ считается подготовленным, если в нём есть конкретное решение, проверяемое основание или честная граница вывода.</p></div><div className="red-team-score"><Gauge size={22} /><strong>{answered}/{reviewerQuestions.length}</strong><span>ответов</span></div></div>
      <div className="red-team-grid"><div className="red-team-lenses">{reviewerQuestions.map((item, index) => <button key={item.id} className={item.id === currentReview.id ? "active" : ""} onClick={() => setReviewId(item.id)}><span>{filled(project.reviewResponses[item.id] || "") ? <Check size={14} /> : String(index + 1).padStart(2, "0")}</span><strong>{item.lens}</strong></button>)}</div><div className="red-team-work"><span>{currentReview.lens}</span><h4>{currentReview.question}</h4><textarea rows={6} value={project.reviewResponses[currentReview.id] || ""} onChange={(event) => setReviewAnswer(event.target.value)} placeholder="Сформулируйте ответ так, чтобы его можно было произнести руководителю или рецензенту…" /><div><small>{(project.reviewResponses[currentReview.id] || "").trim().length} знаков</small>{nextUnanswered && <button className="button button--amber" onClick={() => setReviewId(nextUnanswered.id)}><WandSparkles size={16} /> Следующий незакрытый вопрос</button>}</div></div></div>
    </div>
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
    {tab === "branch" && branchRequirements.filter((item) => `${item.group} ${item.title} ${item.details}`.toLowerCase().includes(q)).map((item) => <article key={`${item.group}-${item.title}`} className={item.status === "Сверить" ? "knowledge-warning" : ""}><span>{item.group}{item.status === "Сверить" ? " · уточнить" : " · учебный ориентир"}</span><strong>{item.title}</strong><p>{item.details}</p></article>)}
    {tab === "experiment" && <>{experimentNorms.filter((item) => `${item.title} ${item.text}`.toLowerCase().includes(q)).map((item) => <article key={item.title}><span>Норма экспериментирования</span><strong>{item.title}</strong><p>{item.text}</p></article>)}{experimentThreats.filter((item) => `${item.title} ${item.diagnostic} ${item.control} ${item.validity}`.toLowerCase().includes(q)).map((item) => <article key={item.id}><span>{item.validity} валидность</span><strong>{item.title}</strong><p>{item.diagnostic}</p><small>Контроль: {item.control}</small></article>)}</>}
  </div><p className="knowledge-note">Учебный профиль собран по предоставленным материалам кафедры и вынесен отдельно от общенаучных рекомендаций. Справочник не заменяет актуальные указания, проверку адаптации/лицензии метода и решение научного руководителя.</p></aside></div>;
}
