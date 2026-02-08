import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop 元件
 * 監聽 React Router 的 location 變動，當 pathname 改變時將視窗置頂。
 * 解決 SPA 切換頁面時會保留上一個頁面捲動位置的問題。
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // 當路徑變更時，立即重置捲動位置
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' as ScrollBehavior, // 使用 instant 確保導航後的視覺即時性
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;