import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Компоненттин атын сөзсүз ScrollToTop деп коюңуз!
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    try {
      // Экранды өйдө жылдыруу
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant", // же "smooth" жумшак жылдыруу үчүн
      });
    } catch (error) {
      // Эски браузерлер үчүн жөнөкөй вариант
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
}