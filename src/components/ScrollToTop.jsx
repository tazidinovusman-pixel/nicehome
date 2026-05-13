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
        behavior: "instant",
      });
    } catch (error) {

      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
}