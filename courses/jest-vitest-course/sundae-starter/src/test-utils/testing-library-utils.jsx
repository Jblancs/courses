import { render } from "@testing-library/react";
import { OrderDetailsProvider } from "../contexts/OrderDetails";

const renderWithContext = (ui, options) => render(ui, {wrapper : OrderDetailsProvider, ...options})

// re-export everything
export * from '@testing-library/react';

export { renderWithContext as render }
