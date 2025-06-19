---
name: react_component
title: React Component Generator
description: Generate React components with best practices and modern patterns
category: frontend
tags: [react, component, frontend, javascript, typescript]
difficulty: intermediate
author: jezweb
version: 1.0.0
arguments:
  - name: component_name
    description: Name of the component (PascalCase)
    required: true
  - name: type
    description: Component type (functional, class)
    required: false
    default: functional
  - name: typescript
    description: Use TypeScript (yes/no)
    required: false
    default: yes
  - name: styling
    description: Styling approach (css, styled-components, tailwind, css-modules)
    required: false
    default: css-modules
  - name: hooks
    description: Common hooks to include (state, effect, context)
    required: false
---

# React Component: {{component_name}}

## Component Implementation

{{#if (eq typescript "yes")}}
```typescript
// {{component_name}}.tsx
import React{{#if (includes hooks "state")}}, { useState }{{/if}}{{#if (includes hooks "effect")}}, { useEffect }{{/if}}{{#if (includes hooks "context")}}, { useContext }{{/if}} from 'react';
{{#if (eq styling "styled-components")}}
import styled from 'styled-components';
{{/if}}
{{#if (eq styling "css-modules")}}
import styles from './{{component_name}}.module.css';
{{/if}}

interface {{component_name}}Props {
  // Define your prop types here
  className?: string;
  children?: React.ReactNode;
}

{{#if (eq type "functional")}}
export const {{component_name}}: React.FC<{{component_name}}Props> = ({ 
  className,
  children,
  ...props 
}) => {
{{#if (includes hooks "state")}}
  const [state, setState] = useState<string>('');
{{/if}}
{{#if (includes hooks "effect")}}
  
  useEffect(() => {
    // Side effects go here
    
    return () => {
      // Cleanup
    };
  }, []);
{{/if}}

  return (
    <div 
      className={{{#if (eq styling "css-modules")}}`${styles.container} ${className || ''}`{{else if (eq styling "tailwind")}}`flex flex-col ${className || ''}`{{else}}className{{/if}}}
      {...props}
    >
      {children}
    </div>
  );
};
{{else}}
export class {{component_name}} extends React.Component<{{component_name}}Props> {
  state = {
    // Initial state
  };

  componentDidMount() {
    // Lifecycle method
  }

  render() {
    const { className, children, ...props } = this.props;
    
    return (
      <div 
        className={{{#if (eq styling "css-modules")}}`${styles.container} ${className || ''}`{{else if (eq styling "tailwind")}}`flex flex-col ${className || ''}`{{else}}className{{/if}}}
        {...props}
      >
        {children}
      </div>
    );
  }
}
{{/if}}

{{component_name}}.displayName = '{{component_name}}';
```
{{else}}
```javascript
// {{component_name}}.jsx
import React{{#if (includes hooks "state")}}, { useState }{{/if}}{{#if (includes hooks "effect")}}, { useEffect }{{/if}}{{#if (includes hooks "context")}}, { useContext }{{/if}} from 'react';
{{#if (eq styling "styled-components")}}
import styled from 'styled-components';
{{/if}}
{{#if (eq styling "css-modules")}}
import styles from './{{component_name}}.module.css';
{{/if}}

{{#if (eq type "functional")}}
export const {{component_name}} = ({ 
  className,
  children,
  ...props 
}) => {
{{#if (includes hooks "state")}}
  const [state, setState] = useState('');
{{/if}}
{{#if (includes hooks "effect")}}
  
  useEffect(() => {
    // Side effects go here
    
    return () => {
      // Cleanup
    };
  }, []);
{{/if}}

  return (
    <div 
      className={{{#if (eq styling "css-modules")}}`${styles.container} ${className || ''}`{{else if (eq styling "tailwind")}}`flex flex-col ${className || ''}`{{else}}className{{/if}}}
      {...props}
    >
      {children}
    </div>
  );
};
{{else}}
export class {{component_name}} extends React.Component {
  state = {
    // Initial state
  };

  componentDidMount() {
    // Lifecycle method
  }

  render() {
    const { className, children, ...props } = this.props;
    
    return (
      <div 
        className={{{#if (eq styling "css-modules")}}`${styles.container} ${className || ''}`{{else if (eq styling "tailwind")}}`flex flex-col ${className || ''}`{{else}}className{{/if}}}
        {...props}
      >
        {children}
      </div>
    );
  }
}
{{/if}}

{{component_name}}.displayName = '{{component_name}}';
```
{{/if}}

{{#if (eq styling "css-modules")}}
## Styles

```css
/* {{component_name}}.module.css */
.container {
  /* Component styles */
}
```
{{/if}}

{{#if (eq styling "styled-components")}}
## Styled Components

```{{#if (eq typescript "yes")}}typescript{{else}}javascript{{/if}}
const Container = styled.div`
  /* Component styles */
`;

const Title = styled.h2`
  /* Title styles */
`;
```
{{/if}}

## Tests

```{{#if (eq typescript "yes")}}typescript{{else}}javascript{{/if}}
// {{component_name}}.test.{{#if (eq typescript "yes")}}tsx{{else}}jsx{{/if}}
import React from 'react';
import { render, screen } from '@testing-library/react';
import { {{component_name}} } from './{{component_name}}';

describe('{{component_name}}', () => {
  it('renders without crashing', () => {
    render(<{{component_name}} />);
  });

  it('renders children correctly', () => {
    render(
      <{{component_name}}>
        <span>Test Child</span>
      </{{component_name}}>
    );
    
    expect(screen.getByText('Test Child')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <{{component_name}} className="custom-class" />
    );
    
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
```

## Usage Example

```{{#if (eq typescript "yes")}}typescript{{else}}javascript{{/if}}
import { {{component_name}} } from './components/{{component_name}}';

function App() {
  return (
    <{{component_name}} className="my-custom-class">
      <h1>Hello World</h1>
    </{{component_name}}>
  );
}
```

## Component Checklist

- [ ] Props interface/types defined
- [ ] Default props set (if needed)
- [ ] PropTypes added (for JavaScript)
- [ ] Component is exported
- [ ] Display name is set
- [ ] Tests written
- [ ] Styles implemented
- [ ] Accessibility considered
- [ ] Error boundaries added (if needed)
- [ ] Memoization applied (if needed)