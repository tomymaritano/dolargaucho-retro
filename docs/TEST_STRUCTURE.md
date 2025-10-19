# 🧪 Test Structure Guide - Dólar Gaucho

## 📋 Overview

This document describes the testing structure, conventions, and best practices for the Dólar Gaucho project. Our testing philosophy emphasizes maintainability, readability, and comprehensive coverage.

---

## 📁 Directory Structure

```
dolargaucho-retro/
├── __tests__/                    # Root test directory
│   ├── components/               # Component tests
│   │   ├── calculadoras/        # Calculator component tests
│   │   │   ├── CalculadoraPlazoFijo.test.tsx
│   │   │   └── CalculadoraUVA.test.tsx
│   │   ├── finanzas/            # Finance component tests
│   │   │   └── FCIBrowser.test.tsx
│   │   └── ui/                  # UI component tests
│   │       ├── Button.test.tsx
│   │       └── Input.test.tsx
│   ├── hooks/                   # Custom hook tests
│   │   ├── useFCI.test.tsx
│   │   ├── useIndiceUVA.test.tsx
│   │   ├── useInflacionMensual.test.tsx
│   │   └── useRiesgoPais.test.tsx
│   └── lib/                     # Utility/helper tests
│       ├── config/
│       │   └── api.test.ts
│       └── utils/
│           └── cn.test.ts
├── components/                  # Source components
├── hooks/                       # Source hooks
└── lib/                         # Source utilities
```

---

## 🎯 Testing Conventions

### File Naming

- **Component Tests**: `ComponentName.test.tsx`
- **Hook Tests**: `useHookName.test.tsx`
- **Utility Tests**: `utilityName.test.ts`

### Test Location

Tests should mirror the source directory structure:

```
Source:       components/ui/Button/Button.tsx
Test:         __tests__/components/ui/Button.test.tsx

Source:       hooks/useDolar.ts
Test:         __tests__/hooks/useDolar.test.tsx

Source:       lib/utils/cn.ts
Test:         __tests__/lib/utils/cn.test.ts
```

---

## 🔧 Testing Stack

### Core Libraries

- **Jest**: Test runner and assertion library
- **@testing-library/react**: React component testing utilities
- **@testing-library/jest-dom**: Custom Jest matchers
- **@testing-library/user-event**: User interaction simulation

### Configuration

Jest configuration is defined in `jest.config.js`:

- TypeScript support via `ts-jest`
- Path aliases matching `tsconfig.json`
- Coverage thresholds and reporting
- Setup files for Testing Library

---

## 📝 Writing Tests

### Component Test Template

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentName } from '@/components/path/ComponentName';

describe('ComponentName', () => {
  it('renders correctly', () => {
    render(<ComponentName />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  it('handles user interaction', async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();

    render(<ComponentName onClick={handleClick} />);

    await user.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders different variants', () => {
    const { rerender } = render(<ComponentName variant="primary" />);
    expect(screen.getByText('Content')).toHaveClass('expected-class');

    rerender(<ComponentName variant="secondary" />);
    expect(screen.getByText('Content')).toHaveClass('different-class');
  });
});
```

### Hook Test Template

```tsx
import { renderHook, waitFor } from '@testing-library/react';
import { useCustomHook } from '@/hooks/useCustomHook';

describe('useCustomHook', () => {
  it('returns expected initial state', () => {
    const { result } = renderHook(() => useCustomHook());

    expect(result.current.data).toBeNull();
    expect(result.current.isLoading).toBe(true);
  });

  it('fetches and returns data', async () => {
    const { result } = renderHook(() => useCustomHook());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toBeDefined();
  });
});
```

### Utility Test Template

```typescript
import { utilityFunction } from '@/lib/utils/utilityFunction';

describe('utilityFunction', () => {
  it('handles valid input', () => {
    const result = utilityFunction('valid input');
    expect(result).toBe('expected output');
  });

  it('handles edge cases', () => {
    expect(utilityFunction('')).toBe('');
    expect(utilityFunction(null)).toBe(null);
  });
});
```

---

## 🎨 Best Practices

### 1. **Test Structure (AAA Pattern)**

```typescript
it('should do something', () => {
  // Arrange - Set up test data and conditions
  const input = 'test';
  const expected = 'TEST';

  // Act - Execute the code being tested
  const result = transformInput(input);

  // Assert - Verify the results
  expect(result).toBe(expected);
});
```

### 2. **Query Priority (Testing Library)**

Use queries in this order of preference:

1. **Accessible by Everyone**: `getByRole`, `getByLabelText`, `getByPlaceholderText`, `getByText`
2. **Semantic Queries**: `getByAltText`, `getByTitle`
3. **Test IDs** (last resort): `getByTestId`

```tsx
// ✅ Good - Accessible query
screen.getByRole('button', { name: /submit/i });

// ❌ Avoid - Test ID should be last resort
screen.getByTestId('submit-button');
```

### 3. **Async Operations**

```tsx
// Use waitFor for async state changes
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument();
});

// Use findBy queries (combines getBy + waitFor)
const element = await screen.findByText('Loaded');
```

### 4. **User Interactions**

```tsx
// ✅ Prefer userEvent over fireEvent
const user = userEvent.setup();
await user.click(button);
await user.type(input, 'text');

// ❌ Avoid fireEvent (less realistic)
fireEvent.click(button);
```

### 5. **Mocking**

```typescript
// Mock external dependencies
jest.mock('@/hooks/useDolar', () => ({
  useDolar: () => ({
    data: { venta: 1000, compra: 980 },
    isLoading: false,
  }),
}));

// Mock API calls
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ data: 'mocked' }),
  })
) as jest.Mock;
```

### 6. **Test Data**

```typescript
// Create test fixtures
const mockDolarData = {
  casa: 'blue',
  nombre: 'Dólar Blue',
  compra: 980,
  venta: 1000,
  fechaActualizacion: '2025-01-15T10:00:00Z',
};

// Use factory functions
const createMockDolar = (overrides = {}) => ({
  ...mockDolarData,
  ...overrides,
});
```

---

## 📊 Testing Types

### Unit Tests

Test individual components, hooks, or utilities in isolation.

**Location**: `__tests__/components/`, `__tests__/hooks/`, `__tests__/lib/`

**Example**: Testing a single button component

```tsx
it('calls onClick when clicked', async () => {
  const onClick = jest.fn();
  const user = userEvent.setup();

  render(<Button onClick={onClick}>Click me</Button>);
  await user.click(screen.getByRole('button'));

  expect(onClick).toHaveBeenCalledTimes(1);
});
```

### Integration Tests

Test how multiple components work together.

**Location**: `__tests__/components/`

**Example**: Testing a form with multiple inputs

```tsx
it('submits form with all fields', async () => {
  const onSubmit = jest.fn();
  const user = userEvent.setup();

  render(<RegistrationForm onSubmit={onSubmit} />);

  await user.type(screen.getByLabelText(/email/i), 'test@example.com');
  await user.type(screen.getByLabelText(/password/i), 'password123');
  await user.click(screen.getByRole('button', { name: /submit/i }));

  expect(onSubmit).toHaveBeenCalledWith({
    email: 'test@example.com',
    password: 'password123',
  });
});
```

---

## 🚀 Running Tests

### Available Commands

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test Button.test.tsx

# Run tests matching pattern
npm test -- --testNamePattern="renders"
```

### Coverage Thresholds

Current coverage targets:

- Statements: 80%
- Branches: 75%
- Functions: 80%
- Lines: 80%

View coverage report: `coverage/lcov-report/index.html`

---

## ✅ Testing Checklist

When writing tests for a component:

- [ ] Renders without crashing
- [ ] Renders with required props
- [ ] Renders with optional props
- [ ] Handles user interactions (clicks, typing, etc.)
- [ ] Shows loading states
- [ ] Shows error states
- [ ] Shows empty states
- [ ] Calls callbacks/handlers correctly
- [ ] Renders different variants/states
- [ ] Is accessible (ARIA attributes, keyboard navigation)

When writing tests for a hook:

- [ ] Returns expected initial state
- [ ] Updates state correctly
- [ ] Handles async operations
- [ ] Handles errors
- [ ] Cleans up resources (useEffect cleanup)
- [ ] Works with different parameters

When writing tests for a utility:

- [ ] Handles valid inputs
- [ ] Handles invalid inputs
- [ ] Handles edge cases (null, undefined, empty)
- [ ] Returns expected outputs
- [ ] Throws errors when appropriate

---

## 📚 Additional Resources

### Related Documentation

- [TESTING_SETUP.md](./TESTING_SETUP.md) - CI/CD and testing infrastructure
- [TESTING_GUIDE.md](./TESTING_GUIDE.md) - Authentication testing guide
- [REACT_PRINCIPLES.md](./REACT_PRINCIPLES.md) - React best practices

### External Resources

- [Testing Library Documentation](https://testing-library.com/docs/react-testing-library/intro/)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing Library Queries](https://testing-library.com/docs/queries/about)
- [User Event Documentation](https://testing-library.com/docs/user-event/intro)
- [Common Mistakes](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

## 🐛 Troubleshooting

### Common Issues

**Issue**: "Cannot find module '@/components/...'"

**Solution**: Check `jest.config.js` moduleNameMapper matches `tsconfig.json` paths

**Issue**: "MutationObserver is not a constructor"

**Solution**: Add to `jest.setup.js`:

```javascript
global.MutationObserver = class {
  constructor(callback) {}
  disconnect() {}
  observe(element, initObject) {}
  takeRecords() {
    return [];
  }
};
```

**Issue**: "window.matchMedia is not a function"

**Solution**: Add to `jest.setup.js`:

```javascript
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
```

---

**Last Updated**: 2025-10-15
**Version**: 1.0.0
