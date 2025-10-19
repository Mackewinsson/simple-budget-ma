# Guía de Traducción al Español - PresuSimple

## Estado Actual
El sistema i18n está configurado con español como idioma predeterminado.

## Traducciones Clave

### Navegación Principal
- Home → Inicio
- Transactions → Transacciones  
- Budgets → Presupuestos
- Reports → Reportes
- Settings → Configuración

### Acciones Comunes
- Add → Agregar
- Edit → Editar
- Delete → Eliminar
- Save → Guardar
- Cancel → Cancelar
- Submit → Enviar
- Create → Crear
- Update → Actualizar
- Search → Buscar
- Filter → Filtrar
- Export → Exportar
- Import → Importar
- Sign Out → Cerrar Sesión
- Sign In → Iniciar Sesión

### Términos Financieros
- Budget → Presupuesto
- Transaction → Transacción
- Expense → Gasto
- Income → Ingreso
- Category → Categoría
- Amount → Cantidad/Monto
- Balance → Saldo
- Total → Total
- Remaining → Restante
- Available → Disponible
- Spent → Gastado
- Budgeted → Presupuestado

### Mensajes del Sistema
- Loading... → Cargando...
- Success → Éxito
- Error → Error
- Warning → Advertencia
- Confirm → Confirmar
- Are you sure? → ¿Estás seguro?
- Please try again → Por favor intenta de nuevo
- Something went wrong → Algo salió mal
- No data available → No hay datos disponibles
- Feature coming soon → Función próximamente

### Pantallas Principales

#### Transacciones
- Add Transaction → Agregar Transacción
- AI Quick Input → Entrada Rápida IA
- Transaction History → Historial de Transacciones
- Available to Spend → Disponible para Gastar
- Manage your finances → Administra tus finanzas
- No transactions yet → Aún no hay transacciones
- Search transactions... → Buscar transacciones...

#### Presupuestos
- Create Your Budget → Crea tu Presupuesto
- Manual Setup → Configuración Manual
- AI Assistant → Asistente IA
- Total Budget Amount → Monto Total del Presupuesto
- Month → Mes
- Year → Año
- Budget created successfully → Presupuesto creado exitosamente

#### Reportes
- Financial Reports → Reportes Financieros
- Overview → Resumen
- Analytics → Analíticas
- Export Data → Exportar Datos
- Monthly Spending → Gasto Mensual
- Top Categories → Principales Categorías
- Spending Percentage → Porcentaje de Gasto

#### Configuración
- Account → Cuenta
- Preferences → Preferencias
- About → Acerca de
- Currency → Moneda
- Theme → Tema
- Light → Claro
- Dark → Oscuro
- System → Sistema
- Notifications → Notificaciones
- Version → Versión

### Meses
- January → Enero
- February → Febrero
- March → Marzo
- April → Abril
- May → Mayo
- June → Junio
- July → Julio
- August → Agosto
- September → Septiembre
- October → Octubre
- November → Noviembre
- December → Diciembre

### Días de la Semana
- Monday → Lunes
- Tuesday → Martes
- Wednesday → Miércoles
- Thursday → Jueves
- Friday → Viernes
- Saturday → Sábado
- Sunday → Domingo

### Validaciones y Errores
- Required field → Campo requerido
- Invalid email → Correo inválido
- Invalid amount → Monto inválido
- Must be greater than 0 → Debe ser mayor que 0
- Budget already exists → El presupuesto ya existe
- Failed to load data → Error al cargar datos
- Network error → Error de red
- Please check your connection → Por favor verifica tu conexión

### Características IA
- AI Magic → Magia IA
- Transform with AI → Transformar con IA
- Describe your budget → Describe tu presupuesto
- Describe your transactions → Describe tus transacciones
- AI is working... → IA trabajando...
- Processing... → Procesando...

## Archivos para Traducir

### Prioridad Alta (Pantallas Principales)
1. app/(tabs)/transactions.tsx
2. app/(tabs)/budgets.tsx
3. app/(tabs)/reports.tsx
4. app/(tabs)/settings.tsx
5. app/index.tsx (pantalla inicial)

### Prioridad Media (Componentes)
1. components/NewExpenseForm.tsx
2. components/NewBudgetForm.tsx
3. components/AITransactionInput.tsx
4. components/Summary.tsx

### Prioridad Baja (Otros)
1. Mensajes de error
2. Validaciones
3. Textos de ayuda

## Notas
- El sistema i18n está en src/lib/i18n.ts
- El idioma predeterminado ahora es español ('es')
- Mantener consistencia en terminología financiera
- Usar "tú" (informal) en lugar de "usted" (formal)
- Frases cortas y directas para mejor UX móvil
