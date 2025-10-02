# TanStack Query Loading Integration

A smart loading system that integrates with TanStack Query to show loading states for API calls without blocking the UI.

## Features

- ✅ **TanStack Query Integration** - Automatically shows loading for background API calls
- ✅ **Non-Blocking** - Subtle indicator that doesn't interfere with user interaction
- ✅ **Smart Positioning** - Respects safe areas and can be positioned anywhere
- ✅ **Configurable** - Show/hide different types of loading states
- ✅ **Context-Aware** - Shows "Saving..." for mutations, spinner for fetches
- ✅ **Performance Optimized** - Only renders when needed

## Components

### GlobalLoadingIndicator

A floating loading indicator that shows when TanStack Query is fetching or mutating data.

```typescript
import GlobalLoadingIndicator from '../components/GlobalLoadingIndicator';

// Basic usage (shows in top-right corner)
<GlobalLoadingIndicator />

// Customized usage
<GlobalLoadingIndicator 
  showBackgroundFetching={true}  // Show for background refetches
  showMutations={true}           // Show for mutations (create/update/delete)
  position="top-left"            // Position: top-right, top-left, bottom-right, bottom-left
/>
```

### Props

- `showBackgroundFetching?: boolean` - Show indicator for background fetches (default: true)
- `showMutations?: boolean` - Show indicator for mutations (default: true)  
- `position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'` - Position (default: 'top-right')

## Hooks

### useQueryLoading

Get loading state for all TanStack Query operations.

```typescript
import { useQueryLoading } from '../src/hooks/useQueryLoading';

function MyComponent() {
  const { isFetching, isMutating, isLoading, fetchingCount, mutatingCount } = useQueryLoading();

  return (
    <View>
      {isLoading && <Text>Loading...</Text>}
      <Text>Fetching: {fetchingCount} operations</Text>
      <Text>Mutating: {mutatingCount} operations</Text>
    </View>
  );
}
```

### useSpecificQueryLoading

Get loading state for specific query keys.

```typescript
import { useSpecificQueryLoading, useBudgetLoading, useExpensesLoading } from '../src/hooks/useSpecificQueryLoading';

function MyComponent() {
  // Custom query key
  const { isLoading } = useSpecificQueryLoading(['budgets', 'user-123']);
  
  // Convenience hooks
  const { isLoading: budgetLoading } = useBudgetLoading();
  const { isLoading: expensesLoading } = useExpensesLoading();

  return (
    <View>
      {budgetLoading && <Text>Loading budget...</Text>}
      {expensesLoading && <Text>Loading expenses...</Text>}
    </View>
  );
}
```

## Integration

The global loading indicator is automatically integrated into the app through the root layout (`app/_layout.tsx`):

```typescript
<QueryClientProvider client={queryClient}>
  <Stack>
    {/* Your screens */}
  </Stack>
  <GlobalLoadingIndicator />
</QueryClientProvider>
```

## How It Works

1. **Background Fetching** - Shows spinner when TanStack Query is refetching data in the background
2. **Mutations** - Shows spinner + "Saving..." text when creating/updating/deleting data
3. **Smart Display** - Only shows when there are active operations
4. **Non-Intrusive** - Small floating indicator that doesn't block user interaction

## Examples

### Basic Usage

```typescript
// The indicator automatically appears when TanStack Query is working
function BudgetScreen() {
  const { data: budget, isLoading } = useBudget(userId);
  
  // Global indicator will show during background refetches
  // Local isLoading handles initial loading state
  
  return (
    <View>
      {isLoading ? <LoadingScreen /> : <BudgetContent budget={budget} />}
    </View>
  );
}
```

### Custom Loading States

```typescript
function MyComponent() {
  const { isLoading: budgetLoading } = useBudgetLoading();
  const { isLoading: expensesLoading } = useExpensesLoading();
  
  return (
    <View>
      {budgetLoading && <Text>Loading budget...</Text>}
      {expensesLoading && <Text>Loading expenses...</Text>}
      
      {/* Global indicator will also show for background operations */}
    </View>
  );
}
```

### Mutation Loading

```typescript
function CreateExpenseForm() {
  const createExpense = useCreateExpense();
  
  const handleSubmit = async (data) => {
    await createExpense.mutateAsync(data);
    // Global indicator will show "Saving..." during mutation
  };
  
  return (
    <Pressable onPress={handleSubmit}>
      <Text>Create Expense</Text>
    </Pressable>
  );
}
```

## Benefits

1. **Better UX** - Users see when data is being updated in the background
2. **Non-Blocking** - Users can continue interacting with the app
3. **Automatic** - No need to manually manage loading states for API calls
4. **Consistent** - Same loading experience across the entire app
5. **Performance** - Only renders when there are active operations
6. **Flexible** - Can be customized per screen or disabled entirely

## Best Practices

1. **Use for Background Operations** - Perfect for showing when data is being refetched
2. **Combine with Local Loading** - Use local loading for initial data, global for background updates
3. **Position Appropriately** - Choose position that doesn't interfere with content
4. **Customize Per Screen** - Different screens might need different configurations
5. **Test on Different Devices** - Ensure positioning works on all screen sizes

## Styling

The indicator uses a dark theme with:
- Semi-transparent black background
- Green spinner (matching app theme)
- White text for mutation messages
- Rounded corners and shadow
- Respects safe areas

You can customize the styling in `components/GlobalLoadingIndicator.tsx`.
