# udemy-TESTING-LIBRARY

Code to accompany [React Testing Library and Jest](https://www.udemy.com/course/react-testing-library/?couponCode=TEST-LIB-GITHUB) course on Udemy.

## Test Driven Development
- Write tests prior to coding (allows for checking if code is correct as tests will continuously run)

## Types of Test

**Unit Tests** -Tests one unit of code in isolation

**Integration Tests** - How multiple units work together

**Functional Tests** - Tests a particular function (behavior NOT one function) of software

**Acceptance/End-to-end Tests** - Use actual browser and server (requires tools like cypress and selenium)

## Tradeoffs between Functional vs Unit Testing
### Unit Testing
- Want tests to be isolated as possible
- mock dependencies meaning if there are other dependencies the component relies on, use test versions of that instead of the actual version
- Test internals - test differences it has made to state because you do not have other components to see difference it made to app
- Easy to pinpoint failures but further from how users interact with software
- More likely to break with refactoring

### Functional Testing
- Include all relevant units to test behavior
- Close to how users interact with software
- Tests are robust and if refactored it should still pass
- More difficult to debug failing tests
- React testing library believes advantages of functional testing outweighs disadvantages

## Differences between Test Driven Development (TDD) vs Behaivior Driven Development (BDD)
### BDD
- Testing library encourages testing behavior over implementation
- BDD is very explicitly defined and involved collab between lots of roles (devs, QA, partners, etc.)
- defines process for how different groups to interact

## Accessibilty and Finding Elements
Testing library recommends finding elements by accessibility handles

Common Queries:

- getByRole
- getByText
- Check roles of buttons, checkbox, etc here: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles
- to see different jest dom matchers check: https://github.com/testing-library/jest-dom

# Testing syntax

    test("description", function)
    const buttonElement = screen.getByRole("role", {name: regex to include specific text})

- function runs and if it throws exception test will fail
- buttonElement would be placed in function and will throw error if no button found with name value

    describe("description", function)

- describe allows you to group multiple tests

# Unit Test
Functions separate from components

Unit test if:
- Used by several components or have complex logic
- complex logic difficult to test via functional tests
- too many edge cases

For more complicated functions, unit testing help with:
- covering all possible edge cases
- determining what caused a functional test to fail

Issue with functional tests:
- high-level makes them resistant to refactors

# Screen Query Methods
command [All]ByQueryType
- get: expect element to be in DOM
- query: expect element not to be in DOM
- find: expect element to appear async

[All]
- (exclude) expect only one match
- (include) expect more than one match

QueryType
- Role (most preferred)
- AltText (images)
- Text (display elements)
- Form elements (PlaceholderText, LabelText, DisplayValue)

# Mock Service Worker
Purpose:
- intercept network calls
- return specified responses

Steps to setup
- create handlers (functions that handle requests and match incoming url and give a mocked response)
- create test server
- make sure test server listens to all tests
- reset after each set

# When to use asynchronous
YOU MUST USE AWAIT AND FINDBY
- server connections are almost always asynchronous
- use findByRole or findAllByRoles NOT getByRole or getAllByRole

# Adding context to tests for individual tests
    render(<Component />, { wrapper: ContextProviderComponent })

# Adding context to multiple tests
- create a test-utils folder and testing-library-utils.jsx file
- can be used to wrap tests with context or even routers

        import { render } from "@testing-library/react";
        import { OrderDetailsProvider } from "../contexts/OrderDetails";

        const renderWithContext = (ui, options) => render(ui, {wrapper : OrderDetailsProvider, ...options})

        // re-export everything
        export * from '@testing-library/react';

        export { renderWithContext as render }
