// import React from "react";
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import ReactDOM from "react-dom/client";
import App from "./App";
import AdminPage from './components/admin/AdminPage';
import { store } from './redux/store';
import { Provider } from 'react-redux';

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  // <React.StrictMode>
  // </React.StrictMode>
  <Provider store={store}>
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </BrowserRouter>
  </Provider>
  ,
);

import { getCurrentWindow } from '@tauri-apps/api/window';
import { ask } from '@tauri-apps/plugin-dialog';

const appWindow = getCurrentWindow();

window.addEventListener('keydown', async (e) => {
  if (e.key === 'Escape') {
    const answer = await ask('Bạn có chắc muốn thoát khỏi ứng dụng không?', {
      title: 'Xác nhận thoát ứng dụng',
      kind: 'info',
      cancelLabel: "Hủy",
      okLabel: "Có"
    });
    if(answer){
      appWindow.close(); 
    }
  }
});