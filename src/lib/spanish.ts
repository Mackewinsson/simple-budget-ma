/**
 * Spanish translations for PresuSimple
 * Use: import { ES } from '../lib/spanish'
 * Then: <Text>{ES.welcome}</Text>
 */

export const ES = {
  // App Info
  appName: 'PresuSimple',
  tagline: 'Tu app de presupuesto simple',
  
  // Navigation
  home: 'Inicio',
  transactions: 'Transacciones',
  budgets: 'Presupuestos',
  reports: 'Reportes',
  settings: 'Configuración',
  
  // Common Actions
  add: 'Agregar',
  edit: 'Editar',
  delete: 'Eliminar',
  save: 'Guardar',
  cancel: 'Cancelar',
  submit: 'Enviar',
  create: 'Crear',
  update: 'Actualizar',
  search: 'Buscar',
  filter: 'Filtrar',
  export: 'Exportar',
  import: 'Importar',
  confirm: 'Confirmar',
  done: 'Hecho',
  next: 'Siguiente',
  back: 'Atrás',
  close: 'Cerrar',
  
  // Auth
  signIn: 'Iniciar Sesión',
  signOut: 'Cerrar Sesión',
  signUp: 'Registrarse',
  email: 'Correo electrónico',
  password: 'Contraseña',
  forgotPassword: '¿Olvidaste tu contraseña?',
  createAccount: 'Crear cuenta',
  alreadyHaveAccount: '¿Ya tienes cuenta?',
  dontHaveAccount: '¿No tienes cuenta?',
  passwordRequirements: 'Mínimo 8 caracteres, una mayúscula, una minúscula y un número',
  registrationSuccess: 'Cuenta creada exitosamente',
  name: 'Nombre',
  
  // Financial Terms
  budget: 'Presupuesto',
  transaction: 'Transacción',
  expense: 'Gasto',
  income: 'Ingreso',
  category: 'Categoría',
  categories: 'Categorías',
  amount: 'Monto',
  balance: 'Saldo',
  total: 'Total',
  remaining: 'Restante',
  available: 'Disponible',
  spent: 'Gastado',
  budgeted: 'Presupuestado',
  description: 'Descripción',
  date: 'Fecha',
  type: 'Tipo',
  
  // Transactions Screen
  addTransaction: 'Agregar Transacción',
  aiQuickInput: 'Entrada Rápida IA',
  transactionHistory: 'Historial de Transacciones',
  availableToSpend: 'Disponible para Gastar',
  manageYourFinances: 'Administra tus finanzas',
  noTransactions: 'Aún no hay transacciones',
  searchTransactions: 'Buscar transacciones...',
  noCategories: 'Aún no hay categorías',
  createCategories: 'Crear Categorías',
  needCategories: 'Necesitas crear categorías de presupuesto antes de poder agregar transacciones. Cada transacción debe asignarse a una categoría.',
  
  // Budget Screen
  createYourBudget: 'Crea tu Presupuesto',
  manualSetup: 'Configuración Manual',
  aiAssistant: 'Asistente IA',
  totalBudgetAmount: 'Monto Total del Presupuesto',
  month: 'Mes',
  year: 'Año',
  budgetCreatedSuccess: 'Presupuesto creado exitosamente',
  chooseHowToCreate: 'Elige cómo crear tu presupuesto',
  describeBudget: 'Describe tu presupuesto',
  budgetAlreadyExists: 'Ya tienes un presupuesto para',
  tryUpdating: 'Intenta actualizar ese presupuesto en su lugar',
  
  // Reports Screen
  financialReports: 'Reportes Financieros',
  overview: 'Resumen',
  analytics: 'Analíticas',
  exportData: 'Exportar Datos',
  monthlySpending: 'Gasto Mensual',
  topCategories: 'Principales Categorías',
  spendingPercentage: 'Porcentaje de Gasto',
  noReports: 'Aún no hay reportes',
  createBudgetFirst: 'Crea un presupuesto primero para ver tus reportes financieros',
  loadingReports: 'Cargando reportes...',
  actions: 'Acciones',
  
  // Settings Screen
  account: 'Cuenta',
  preferences: 'Preferencias',
  about: 'Acerca de',
  currency: 'Moneda',
  theme: 'Tema',
  light: 'Claro',
  dark: 'Oscuro',
  system: 'Sistema',
  notifications: 'Notificaciones',
  version: 'Versión',
  aboutPresuSimple: 'Acerca de PresuSimple',
  aboutMessage: 'Versión 1.0.0\n\nUna app simple e intuitiva de presupuesto para ayudarte a administrar tus finanzas.\n\nDesarrollada con React Native y Expo.',
  
  // AI Features
  aiMagic: 'Magia IA',
  transformWithAI: 'Transformar con IA',
  aiWorking: 'IA trabajando...',
  processing: 'Procesando...',
  aiDescription: 'Describe tus transacciones en lenguaje natural y deja que la IA las analice automáticamente',
  exampleTransaction: 'Ejemplo: "Compré café por $4.50 y almuerzo por $12.80 en la cafetería"',
  characters: 'caracteres',
  needMoreDetail: 'Necesitas más detalle',
  readyToParse: 'Listo para analizar',
  tryExamples: 'Prueba estos ejemplos:',
  
  // Months
  months: {
    january: 'Enero',
    february: 'Febrero',
    march: 'Marzo',
    april: 'Abril',
    may: 'Mayo',
    june: 'Junio',
    july: 'Julio',
    august: 'Agosto',
    september: 'Septiembre',
    october: 'Octubre',
    november: 'Noviembre',
    december: 'Diciembre',
  },
  
  // Messages
  loading: 'Cargando...',
  success: 'Éxito',
  error: 'Error',
  warning: 'Advertencia',
  areYouSure: '¿Estás seguro?',
  tryAgain: 'Por favor intenta de nuevo',
  somethingWrong: 'Algo salió mal',
  noData: 'No hay datos disponibles',
  comingSoon: 'Función próximamente',
  
  // Validation
  required: 'Campo requerido',
  invalidEmail: 'Correo inválido',
  invalidAmount: 'Monto inválido',
  greaterThanZero: 'Debe ser mayor que 0',
  failedToLoad: 'Error al cargar datos',
  networkError: 'Error de red',
  checkConnection: 'Por favor verifica tu conexión',
  
  // Confirmation Messages
  deleteExpense: '¿Eliminar este gasto?',
  deleteMessage: 'Esta acción no se puede deshacer.',
  signOutConfirm: '¿Estás seguro que quieres cerrar sesión?',
  
  // Feature Messages
  featureComingSoon: 'Función próximamente',
  exportComingSoon: 'La exportación de datos estará disponible en una futura actualización.',
  
  // Empty States
  noTransactionsYet: 'Aún no hay transacciones. Agrega una para comenzar.',
  noBudgetYet: 'Aún no tienes un presupuesto',
  noCategoriesYet: 'Aún no hay categorías',
  noCategoriesAvailable: 'No hay categorías disponibles',
  selectACategory: 'Seleccionar una categoría',
  
  // Time
  today: 'Hoy',
  yesterday: 'Ayer',
  thisWeek: 'Esta semana',
  thisMonth: 'Este mes',
  lastMonth: 'Mes pasado',
};

export default ES;
