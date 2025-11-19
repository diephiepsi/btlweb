// FILE: frontend/src/index.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import App from './App'; // Import App (nó sẽ tự hiểu là App.tsx)

// Tìm thẻ div có id="root" trong file public/index.html
const rootElement = document.getElementById('root');

// Kiểm tra null để TypeScript không báo lỗi
if (!rootElement) {
  throw new Error('Không tìm thấy thẻ root!');
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  // Provider: Cung cấp Redux Store
  <Provider store={store}>
    {/* BrowserRouter: Cung cấp khả năng điều hướng trang */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);