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
