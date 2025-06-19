---
name: unit_test
title: Unit Test Generator
description: Generate comprehensive unit tests for various testing frameworks
category: testing
tags: [testing, unit-test, tdd, quality, automation]
difficulty: intermediate
author: jezweb
version: 1.0.0
arguments:
  - name: framework
    description: Testing framework (jest, mocha, pytest, junit, vitest)
    required: true
  - name: language
    description: Programming language
    required: true
  - name: function_name
    description: Name of function/method to test
    required: true
  - name: async
    description: Is the function async? (yes/no)
    required: false
    default: no
---

# Unit Tests for {{function_name}}

## Test Suite: {{framework}} ({{language}})

{{#if (eq framework "jest")}}
```javascript
// {{function_name}}.test.js
{{#if (eq async "yes")}}
describe('{{function_name}}', () => {
  // Setup and teardown
  beforeEach(() => {
    // Reset mocks, clear data, etc.
  });

  afterEach(() => {
    // Cleanup
  });

  describe('successful cases', () => {
    it('should handle valid input correctly', async () => {
      // Arrange
      const input = { /* test data */ };
      const expected = { /* expected result */ };

      // Act
      const result = await {{function_name}}(input);

      // Assert
      expect(result).toEqual(expected);
    });

    it('should return expected output for edge case', async () => {
      // Test edge cases
    });
  });

  describe('error cases', () => {
    it('should throw error for invalid input', async () => {
      // Arrange
      const invalidInput = null;

      // Act & Assert
      await expect({{function_name}}(invalidInput)).rejects.toThrow('Expected error message');
    });

    it('should handle timeout gracefully', async () => {
      // Test timeout scenarios
      jest.setTimeout(10000);
      // ... test implementation
    });
  });

  describe('integration scenarios', () => {
    it('should work with mocked dependencies', async () => {
      // Mock external dependencies
      const mockDependency = jest.fn().mockResolvedValue('mocked value');
      
      // Test with mocks
    });
  });
});
{{else}}
describe('{{function_name}}', () => {
  // Setup and teardown
  beforeEach(() => {
    // Reset mocks, clear data, etc.
  });

  describe('successful cases', () => {
    it('should handle valid input correctly', () => {
      // Arrange
      const input = { /* test data */ };
      const expected = { /* expected result */ };

      // Act
      const result = {{function_name}}(input);

      // Assert
      expect(result).toBe(expected);
    });

    it('should handle edge cases', () => {
      // Test boundary conditions
      expect({{function_name}}(0)).toBe(0);
      expect({{function_name}}(-1)).toBe(1);
      expect({{function_name}}(Number.MAX_SAFE_INTEGER)).toBeDefined();
    });
  });

  describe('error cases', () => {
    it('should throw error for invalid input', () => {
      // Arrange
      const invalidInput = null;

      // Act & Assert
      expect(() => {{function_name}}(invalidInput)).toThrow('Expected error message');
    });
  });
});
{{/if}}
```
{{/if}}

{{#if (eq framework "vitest")}}
```javascript
// {{function_name}}.test.js
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { {{function_name}} } from './{{function_name}}';

describe('{{function_name}}', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  {{#if (eq async "yes")}}
  it('should handle async operations correctly', async () => {
    // Arrange
    const input = { /* test data */ };
    
    // Act
    const result = await {{function_name}}(input);
    
    // Assert
    expect(result).toMatchInlineSnapshot();
  });

  it('should handle errors in async flow', async () => {
    await expect({{function_name}}(null)).rejects.toThrowError();
  });
  {{else}}
  it('should return expected output', () => {
    const result = {{function_name}}('input');
    expect(result).toMatchSnapshot();
  });
  {{/if}}
});
```
{{/if}}

{{#if (eq framework "pytest")}}
```python
# test_{{function_name}}.py
import pytest
{{#if (eq async "yes")}}import asyncio{{/if}}
from unittest.mock import Mock, patch
from module import {{function_name}}

class Test{{function_name}}:
    """Test suite for {{function_name}} function"""
    
    @pytest.fixture
    def setup_data(self):
        """Fixture to provide test data"""
        return {
            'valid_input': {'key': 'value'},
            'invalid_input': None,
            'edge_case': []
        }
    
    {{#if (eq async "yes")}}
    @pytest.mark.asyncio
    async def test_successful_async_operation(self, setup_data):
        """Test successful async execution"""
        # Arrange
        input_data = setup_data['valid_input']
        
        # Act
        result = await {{function_name}}(input_data)
        
        # Assert
        assert result is not None
        assert isinstance(result, dict)
    
    @pytest.mark.asyncio
    async def test_async_error_handling(self, setup_data):
        """Test error handling in async function"""
        with pytest.raises(ValueError):
            await {{function_name}}(setup_data['invalid_input'])
    {{else}}
    def test_valid_input(self, setup_data):
        """Test with valid input"""
        # Arrange
        input_data = setup_data['valid_input']
        
        # Act
        result = {{function_name}}(input_data)
        
        # Assert
        assert result is not None
        assert isinstance(result, dict)
    
    def test_invalid_input_raises_error(self, setup_data):
        """Test that invalid input raises appropriate error"""
        with pytest.raises(ValueError) as exc_info:
            {{function_name}}(setup_data['invalid_input'])
        
        assert "Invalid input" in str(exc_info.value)
    {{/if}}
    
    def test_edge_cases(self, setup_data):
        """Test edge cases and boundary conditions"""
        # Test empty input
        result = {{function_name}}(setup_data['edge_case'])
        assert result == []
    
    @patch('module.external_dependency')
    def test_with_mocked_dependency(self, mock_dep, setup_data):
        """Test with mocked external dependency"""
        # Configure mock
        mock_dep.return_value = 'mocked_value'
        
        # Act
        result = {{function_name}}(setup_data['valid_input'])
        
        # Assert
        mock_dep.assert_called_once()
        assert result == 'expected_with_mock'
    
    @pytest.mark.parametrize("input_val,expected", [
        (1, 1),
        (2, 4),
        (3, 9),
        (-1, 1),
    ])
    def test_parametrized_inputs(self, input_val, expected):
        """Test with multiple input/output combinations"""
        assert {{function_name}}(input_val) == expected
```
{{/if}}

{{#if (eq framework "junit")}}
```java
// {{function_name}}Test.java
import org.junit.jupiter.api.*;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class {{function_name}}Test {
    
    private SystemUnderTest sut;
    
    @Mock
    private Dependency mockDependency;
    
    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        sut = new SystemUnderTest(mockDependency);
    }
    
    @AfterEach
    void tearDown() {
        // Cleanup resources
    }
    
    @Nested
    @DisplayName("Successful execution tests")
    class SuccessfulCases {
        
        @Test
        @DisplayName("Should handle valid input correctly")
        void testValidInput() {
            // Given
            String input = "valid input";
            String expected = "expected output";
            
            // When
            String result = sut.{{function_name}}(input);
            
            // Then
            assertEquals(expected, result);
        }
        
        {{#if (eq async "yes")}}
        @Test
        @DisplayName("Should handle async operation")
        void testAsyncOperation() throws Exception {
            // Given
            CompletableFuture<String> future = new CompletableFuture<>();
            when(mockDependency.asyncCall()).thenReturn(future);
            
            // When
            CompletableFuture<String> result = sut.{{function_name}}Async();
            future.complete("async result");
            
            // Then
            assertEquals("async result", result.get());
        }
        {{/if}}
    }
    
    @Nested
    @DisplayName("Error handling tests")
    class ErrorCases {
        
        @Test
        @DisplayName("Should throw exception for null input")
        void testNullInput() {
            // When & Then
            assertThrows(IllegalArgumentException.class, () -> {
                sut.{{function_name}}(null);
            });
        }
        
        @Test
        @DisplayName("Should handle dependency failure")
        void testDependencyFailure() {
            // Given
            when(mockDependency.call()).thenThrow(new RuntimeException("Dependency failed"));
            
            // When & Then
            assertThrows(ServiceException.class, () -> {
                sut.{{function_name}}("input");
            });
        }
    }
    
    @ParameterizedTest
    @ValueSource(strings = {"", " ", "valid", "special!@#"})
    @DisplayName("Should handle various string inputs")
    void testParameterizedInputs(String input) {
        // When
        String result = sut.{{function_name}}(input);
        
        // Then
        assertNotNull(result);
    }
}
```
{{/if}}

{{#if (eq framework "mocha")}}
```javascript
// {{function_name}}.test.js
const { expect } = require('chai');
const sinon = require('sinon');
const { {{function_name}} } = require('./{{function_name}}');

describe('{{function_name}}', function() {
  let sandbox;
  
  beforeEach(function() {
    sandbox = sinon.createSandbox();
  });
  
  afterEach(function() {
    sandbox.restore();
  });
  
  describe('successful execution', function() {
    {{#if (eq async "yes")}}
    it('should handle async operations', async function() {
      // Arrange
      const input = 'test input';
      const expected = 'expected output';
      
      // Act
      const result = await {{function_name}}(input);
      
      // Assert
      expect(result).to.equal(expected);
    });
    
    it('should timeout after specified duration', async function() {
      this.timeout(5000);
      
      // Test timeout behavior
      const promise = {{function_name}}('slow input');
      const timeout = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), 3000)
      );
      
      await expect(Promise.race([promise, timeout])).to.be.rejected;
    });
    {{else}}
    it('should return correct result for valid input', function() {
      // Arrange
      const input = 'test input';
      
      // Act
      const result = {{function_name}}(input);
      
      // Assert
      expect(result).to.be.a('string');
      expect(result).to.have.length.above(0);
    });
    {{/if}}
  });
  
  describe('error handling', function() {
    it('should throw error for invalid input', function() {
      expect(() => {{function_name}}(null)).to.throw('Invalid input');
    });
    
    it('should handle errors from dependencies', function() {
      // Mock dependency to throw error
      const stub = sandbox.stub(dependency, 'method').throws(new Error('Dependency error'));
      
      expect(() => {{function_name}}('input')).to.throw('Dependency error');
      expect(stub.calledOnce).to.be.true;
    });
  });
});
```
{{/if}}

## Test Coverage Checklist

- [ ] Happy path scenarios
- [ ] Edge cases and boundary conditions
- [ ] Error scenarios and exception handling
- [ ] Null/undefined input handling
- [ ] Empty collections or strings
- [ ] Maximum/minimum values
- [ ] Timeout scenarios (for async)
- [ ] Mocked dependencies
- [ ] Integration points
- [ ] Performance considerations

## Best Practices Applied

1. **Arrange-Act-Assert** pattern
2. **Descriptive test names**
3. **Test isolation** (no shared state)
4. **Mock external dependencies**
5. **Test one thing per test**
6. **Use test fixtures/factories**
7. **Parametrized tests** for multiple scenarios
8. **Proper async handling**

## Running the Tests

{{#if (eq framework "jest")}}
```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run in watch mode
npm test -- --watch

# Run specific test file
npm test {{function_name}}.test.js
```
{{/if}}

{{#if (eq framework "pytest")}}
```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=module --cov-report=html

# Run specific test
pytest test_{{function_name}}.py::Test{{function_name}}::test_valid_input

# Run with verbose output
pytest -v
```
{{/if}}

{{#if (eq framework "junit")}}
```bash
# Run with Maven
mvn test

# Run specific test class
mvn test -Dtest={{function_name}}Test

# Run with Gradle
gradle test

# Generate test report
gradle test jacocoTestReport
```
{{/if}}