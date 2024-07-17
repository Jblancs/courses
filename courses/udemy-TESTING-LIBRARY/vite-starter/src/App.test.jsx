import { logRoles } from "@testing-library/react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("button starts with correct color", () => {
  const {container} = render(<App/>);
  // use logRoles to help figure out what roles to use
  // logRoles(container)
  
  // adding name plays role of assertion and throws error if button is not found with text including blue
  const buttonElement = screen.getByRole("button", {name: /blue/i});
  expect(buttonElement).toHaveClass("red")
});

test("button starts with correct text", () => {

});

test("button has correct color after click", () => {

});

test("button has correct text after click", () => {

});
