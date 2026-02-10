import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import TagManager from 'react-gtm-module';

const GTMHandler = () => {
  const location = useLocation();

  useEffect(() => {
    // Esto se dispara cada vez que la URL cambia
    const tagManagerArgs = {
      dataLayer: {
        event: 'pageview',
        page: location.pathname + location.search,
        title: document.title
      }
    };
    TagManager.dataLayer(tagManagerArgs);
  }, [location]);

  return null; // No renderiza nada, es solo lógica
};

export default GTMHandler;