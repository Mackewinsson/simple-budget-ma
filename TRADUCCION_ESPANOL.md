# Traducción al Español - PresuSimple

## Resumen
Se ha configurado el sistema de traducción al español para la app PresuSimple.

## Archivos Creados

### 1. [src/lib/spanish.ts](src/lib/spanish.ts)
Archivo de constantes con todas las traducciones al español.

**Uso:**
```typescript
import { ES } from '../lib/spanish';

<Text>{ES.appName}</Text>
<Text>{ES.transactions}</Text>
<Text>{ES.addTransaction}</Text>
```

### 2. [SPANISH_TRANSLATION_GUIDE.md](SPANISH_TRANSLATION_GUIDE.md)
Guía completa de traducción con:
- Términos clave traducidos
- Prioridades de traducción
- Notas de estilo

## Sistema i18n Actualizado

El archivo [src/lib/i18n.ts](src/lib/i18n.ts) ahora tiene:
- **Idioma predeterminado**: Español ('es')
- Traducciones expandidas en español
- Sistema de contexto para cambiar idiomas

## Cómo Usar las Traducciones

### Opción 1: Importar constantes ES
```typescript
import { ES } from '../lib/spanish';

function MyComponent() {
  return (
    <View>
      <Text>{ES.welcome}</Text>
      <Button title={ES.save} />
    </View>
  );
}
```

### Opción 2: Usar el hook de traducción
```typescript
import { useTranslation } from '../lib/i18n';

function MyComponent() {
  const { t } = useTranslation();
  
  return (
    <View>
      <Text>{t('welcome')}</Text>
      <Button title={t('save')} />
    </View>
  );
}
```

## Traducciones Disponibles

### Navegación
- home → Inicio
- transactions → Transacciones
- budgets → Presupuestos
- reports → Reportes
- settings → Configuración

### Acciones Comunes
- add → Agregar
- edit → Editar
- delete → Eliminar
- save → Guardar
- cancel → Cancelar
- create → Crear

### Términos Financieros
- budget → Presupuesto
- transaction → Transacción
- expense → Gasto
- income → Ingreso
- category → Categoría
- amount → Monto
- balance → Saldo

### Pantallas
- addTransaction → Agregar Transacción
- aiQuickInput → Entrada Rápida IA
- transactionHistory → Historial de Transacciones
- availableToSpend → Disponible para Gastar
- createYourBudget → Crea tu Presupuesto
- financialReports → Reportes Financieros

### Meses
```typescript
ES.months.january  → Enero
ES.months.february → Febrero
// ... etc
```

### Mensajes
- loading → Cargando...
- success → Éxito
- error → Error
- comingSoon → Función próximamente

## Para Aplicar Traducciones

### Actualizar un Componente
**Antes:**
```typescript
<Text>Add Transaction</Text>
```

**Después:**
```typescript
import { ES } from '../lib/spanish';

<Text>{ES.addTransaction}</Text>
```

### Actualizar Alerts
**Antes:**
```typescript
Alert.alert("Error", "Something went wrong");
```

**Después:**
```typescript
import { ES } from '../lib/spanish';

Alert.alert(ES.error, ES.somethingWrong);
```

## Estado de Traducción

### ✅ Completado
- [x] Sistema de traducción configurado
- [x] Idioma predeterminado cambiado a español
- [x] Archivo de constantes ES creado
- [x] Más de 100 traducciones disponibles
- [x] Guía de traducción documentada

### 📋 Para Implementar
Para aplicar las traducciones a toda la app:

1. **Pantallas Principales** (Prioridad Alta)
   - [ ] app/(tabs)/transactions.tsx
   - [ ] app/(tabs)/budgets.tsx
   - [ ] app/(tabs)/reports.tsx
   - [ ] app/(tabs)/settings.tsx
   - [ ] app/index.tsx

2. **Componentes** (Prioridad Media)
   - [ ] components/NewExpenseForm.tsx
   - [ ] components/NewBudgetForm.tsx
   - [ ] components/AITransactionInput.tsx
   - [ ] components/Summary.tsx

3. **Formularios** (Prioridad Media)
   - [ ] Validaciones
   - [ ] Mensajes de error
   - [ ] Placeholders

## Ejemplo Completo

```typescript
// Importar traducciones
import { ES } from '../lib/spanish';

function TransactionsScreen() {
  return (
    <View>
      {/* Header */}
      <Text style={styles.title}>{ES.transactions}</Text>
      <Text style={styles.subtitle}>{ES.manageYourFinances}</Text>
      
      {/* Tabs */}
      <View style={styles.tabs}>
        <Tab title={ES.addTransaction} />
        <Tab title={ES.aiQuickInput} />
        <Tab title={ES.transactionHistory} />
      </View>
      
      {/* Balance */}
      <Text>{ES.availableToSpend}</Text>
      <Text>${balance.toFixed(2)}</Text>
      
      {/* Empty State */}
      {transactions.length === 0 && (
        <Text>{ES.noTransactions}</Text>
      )}
      
      {/* Actions */}
      <Button title={ES.add} onPress={handleAdd} />
    </View>
  );
}
```

## Notas de Estilo

1. **Tono**: Informal (tú) en lugar de formal (usted)
2. **Brevedad**: Frases cortas para UI móvil
3. **Consistencia**: Usar siempre los mismos términos
4. **Claridad**: Evitar tecnicismos innecesarios

## Recursos

- Traducciones: [src/lib/spanish.ts](src/lib/spanish.ts)
- Sistema i18n: [src/lib/i18n.ts](src/lib/i18n.ts)
- Guía completa: [SPANISH_TRANSLATION_GUIDE.md](SPANISH_TRANSLATION_GUIDE.md)

---
Fecha: 2025-10-19
App: PresuSimple
Idioma: Español (es)
Estado: Sistema configurado, listo para implementar
