import { useEffect } from "react";
import { useLocation } from "react-router";

const ScrollToTop = (props) => {
  const location = useLocation();
  useEffect(() => {
    if(!location.pathname.includes("/about/1") && !location.pathname.includes("/about/2") && !location.pathname.includes("/about/3"))
    window.scrollTo(0, 0);
  }, [location]);

  return <>{props.children}</>
};

export default ScrollToTop;