# React Native New Architecture - Development Best Practices

## 📋 Table of Contents
1. [Component Architecture](#component-architecture)
2. [Performance Optimization](#performance-optimization)
3. [State Management](#state-management)
4. [Navigation](#navigation)
5. [Testing](#testing)
6. [Error Handling](#error-handling)
7. [Code Organization](#code-organization)
8. [Debugging](#debugging)

---

## 🏗️ Component Architecture

### Functional Components with Hooks
Always use functional components with React hooks - they're more performant with the new architecture.

```tsx
import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface Props {
  title: string;
  onPress?: () => void;
}

const MyComponent: React.FC<Props> = ({ title, onPress }) => {
  const [count, setCount] = useState(0);

  const handlePress = useCallback(() => {
    setCount(prev => prev + 1);
    onPress?.();
  }, [onPress]);

  return (
    <TouchableOpacity onPress={handlePress}>
      <Text>{title} - {count}</Text>
    </TouchableOpacity>
  );
};

export default MyComponent;
```

### Memoization Best Practices
```tsx
import React, { memo, useCallback } from 'react';

// Use memo to prevent unnecessary re-renders
const MyComponent = memo(({ title, onPress }) => {
  return <TouchableOpacity onPress={onPress}><Text>{title}</Text></TouchableOpacity>;
});

// Use useCallback for stable function references
const ParentComponent = () => {
  const handlePress = useCallback(() => {
    // Handle press
  }, []);

  return <MyComponent title="Click me" onPress={handlePress} />;
};
```

---

## ⚡ Performance Optimization

### 1. Use FlatList for Large Lists
```tsx
import { FlatList } from 'react-native';

const ListComponent = ({ data }) => {
  const renderItem = useCallback(({ item }) => (
    <ListItem item={item} />
  ), []);

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      updateCellsBatchingPeriod={50}
    />
  );
};
```

### 2. Image Optimization
```tsx
import { Image } from 'react-native';

const OptimizedImage = () => {
  return (
    <Image
      source={{ uri: 'https://example.com/image.jpg' }}
      style={{ width: 100, height: 100 }}
      // Specify size for better rendering
      onLoadStart={() => console.log('Loading...')}
      onLoadEnd={() => console.log('Loaded')}
    />
  );
};
```

### 3. Lazy Loading
```tsx
import React, { lazy, Suspense } from 'react';

// Lazy load components
const HeavyComponent = lazy(() => import('./HeavyComponent'));

const App = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <HeavyComponent />
    </Suspense>
  );
};
```

### 4. Reduce Bundle Size
```tsx
// ❌ Bad: Import entire library
import * as lodash from 'lodash';
const result = lodash.debounce(func, 300);

// ✅ Good: Import specific function
import debounce from 'lodash/debounce';
const result = debounce(func, 300);
```

---

## 🎯 State Management

### Context API
For simple apps without complex state:
```tsx
import React, { createContext, useState } from 'react';

interface AppContextType {
  user: any;
  setUser: (user: any) => void;
}

export const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState(null);

  return (
    <AppContext.Provider value={{ user, setUser }}>
      {children}
    </AppContext.Provider>
  );
};

// Usage
const useAppContext = () => {
  const context = React.useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
```

### Redux (for large apps)
```bash
npm install redux react-redux @reduxjs/toolkit
```

```tsx
import { configureStore, createSlice } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';

const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: (state) => { state.value += 1; },
    decrement: (state) => { state.value -= 1; },
  },
});

const store = configureStore({
  reducer: {
    counter: counterSlice.reducer,
  },
});

// Usage
const MyComponent = () => {
  const count = useSelector((state: any) => state.counter.value);
  const dispatch = useDispatch();

  return (
    <TouchableOpacity onPress={() => dispatch(counterSlice.actions.increment())}>
      <Text>{count}</Text>
    </TouchableOpacity>
  );
};
```

---

## 🗺️ Navigation

### React Navigation Setup
```bash
npm install @react-navigation/native @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context
```

```tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from './screens/HomeScreen';
import SettingsScreen from './screens/SettingsScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === 'Home') {
              iconName = 'home';
            } else if (route.name === 'Settings') {
              iconName = 'settings';
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
```

---

## ✅ Testing

### Unit Tests
```tsx
// __tests__/Counter.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import Counter from '../components/Counter';

describe('Counter Component', () => {
  test('increments count on button press', () => {
    render(<Counter />);
    const button = screen.getByText('Increment');
    fireEvent.press(button);
    expect(screen.getByText('1')).toBeTruthy();
  });

  test('decrements count on button press', () => {
    render(<Counter />);
    const button = screen.getByText('Decrement');
    fireEvent.press(button);
    expect(screen.getByText('-1')).toBeTruthy();
  });
});
```

### Run Tests
```bash
npm test
npm test -- --watch
npm test -- --coverage
```

---

## 🚨 Error Handling

### Error Boundaries
```tsx
import React from 'react';
import { Text, View } from 'react-native';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.log('Error caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View>
          <Text>Something went wrong!</Text>
        </View>
      );
    }

    return this.props.children;
  }
}
```

### Try-Catch Pattern
```tsx
const fetchUserData = async (userId: string) => {
  try {
    const response = await fetch(`/api/users/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch user');
    return await response.json();
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};
```

---

## 📁 Code Organization

### Directory Structure
```
src/
├── components/           # Reusable components
│   ├── Button.tsx
│   ├── Card.tsx
│   └── List.tsx
├── screens/             # Screen components
│   ├── HomeScreen.tsx
│   └── SettingsScreen.tsx
├── navigation/          # Navigation configuration
│   └── AppNavigator.tsx
├── services/            # API & external services
│   ├── api.ts
│   └── auth.ts
├── utils/               # Utility functions
│   ├── helpers.ts
│   └── validators.ts
├── constants/           # Constants
│   └── colors.ts
├── types/               # TypeScript types
│   └── index.ts
└── App.tsx              # Main app component
```

---

## 🐛 Debugging

### React Native Debugger
1. Install: `npm install -g react-native-debugger`
2. Start: `react-native-debugger`
3. In app: Press Ctrl+M (Android) or Cmd+D (iOS)
4. Select "Connect to debugger"

### Console Logging
```tsx
// ✅ Good practice - structured logging
const logger = {
  info: (tag: string, message: string) => console.log(`[${tag}]`, message),
  error: (tag: string, error: any) => console.error(`[${tag}] ERROR:`, error),
  warn: (tag: string, message: string) => console.warn(`[${tag}] WARN:`, message),
};

logger.info('MyComponent', 'Component mounted');
```

### React DevTools Profiler
```tsx
import { Profiler } from 'react';

const MyComponent = () => (
  <Profiler id="MyComponent" onRender={(id, phase, actualDuration) => {
    console.log(`${id} (${phase}) took ${actualDuration}ms`);
  }}>
    <View>
      <Text>Profiled Component</Text>
    </View>
  </Profiler>
);
```

---

## 🎯 TypeScript Best Practices

### Define Proper Types
```tsx
// ✅ Always define component props
interface ButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({ title, onPress, disabled, variant }) => {
  // Implementation
};
```

### Use Utility Types
```tsx
// Partial - make all properties optional
type PartialUser = Partial<User>;

// Readonly - prevent modifications
type ReadonlyUser = Readonly<User>;

// Record - create object type
type Colors = Record<'primary' | 'secondary', string>;

// Pick - select specific properties
type UserPreview = Pick<User, 'id' | 'name'>;
```

---

## 🚀 Performance Monitoring

### Measure Component Performance
```tsx
import React, { useEffect } from 'react';

const MyComponent = () => {
  useEffect(() => {
    const start = performance.now();
    return () => {
      const end = performance.now();
      console.log(`Component render took ${end - start}ms`);
    };
  }, []);

  return <View><Text>Content</Text></View>;
};
```

---

## 📝 Code Style Guide

### Naming Conventions
```tsx
// ✅ Good
const getUserData = async () => {};
const isUserLoggedIn = false;
const MAX_RETRIES = 3;

// ❌ Avoid
const get_user_data = async () => {};
const userLoggedIn = false;
const max_retries = 3;
```

### File Organization
```tsx
// 1. Imports
import React, { useState } from 'react';
import { View, Text } from 'react-native';

// 2. Types/Interfaces
interface Props {
  title: string;
}

// 3. Component
const MyComponent: React.FC<Props> = ({ title }) => {
  const [state, setState] = useState(null);
  return <View><Text>{title}</Text></View>;
};

// 4. Styles
const styles = StyleSheet.create({});

// 5. Export
export default MyComponent;
```

---

## ✨ Useful Packages

```bash
# Navigation
npm install @react-navigation/native @react-navigation/bottom-tabs

# State Management
npm install zustand
# or
npm install @reduxjs/toolkit react-redux

# HTTP Client
npm install axios

# Date Handling
npm install dayjs

# Form Validation
npm install react-hook-form yup

# Icons
npm install @expo/vector-icons

# UI Components
npm install react-native-paper
```

---

## 🔍 Code Review Checklist

Before committing code:
- [ ] No console.logs left in production code
- [ ] All TypeScript errors resolved
- [ ] ESLint passes (`npm run lint`)
- [ ] Tests pass (`npm test`)
- [ ] Components are memoized appropriately
- [ ] Props are properly typed
- [ ] Error handling implemented
- [ ] Performance optimized (no N+1 queries, etc.)

---

**Last Updated**: January 2026  
**React Native**: 0.83.1  
**React**: 19.2.0
