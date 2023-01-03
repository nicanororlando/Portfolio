import React, {
  createContext,
  useCallback,
  useState,
  useMemo,
  useLayoutEffect,
} from "react";
import { useLocation, useHistory } from "react-router-dom";

export interface ILanguage {
  navBar: {
    home: string;
    about: string;
    skills: string;
    services: string;
    portfolio: string;
    contact: string;
  };
  home: {
    data: {
      home_description: string;
      hello_button: string;
    };
  };
}

export interface LanguageContextData {
  language: ILanguage;
  handleSelectIdiom(idiom: string): void;
  idiom: string;
}

export const LanguageContext = createContext<LanguageContextData>(
  {} as LanguageContextData
);

interface Props {
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<Props> = ({ children }) => {
  const location = useLocation();
  const history = useHistory();
  const [idiom, setIdiom] = useState(() => {
    let lang = location.pathname.slice(1, 3);
    if (lang !== "es") {
      lang = localStorage.getItem("language") || "en";
    }
    const element = document.getElementsByTagName("html");
    element[0].lang = lang;
    return lang;
  });

  useLayoutEffect(() => {
    const idiomSelected = location.pathname.slice(1).split("/");
    if (idiomSelected[0].length === 2) {
      setIdiom(idiomSelected[0]);
    }
  }, [location.pathname]);

  const handleSelectIdiom = useCallback((idiomSelected: string) => {
    setIdiom(idiomSelected);
    const element = document.getElementsByTagName("html");
    element[0].lang = idiomSelected;
  }, []);

  const language = useMemo(() => {
    const checkIdiom = localStorage.getItem("language");
    if (checkIdiom !== idiom) {
      const lang = location.pathname.slice(1, 3);
      if (lang !== "en" && lang !== "es" && lang !== "pt") {
        history.push(`${process.env.PUBLIC_URL}/${idiom}${location.pathname}`);
      } else {
        history.push(
          `${process.env.PUBLIC_URL}/${idiom}${location.pathname.slice(3)}`
        );
      }
    }

    localStorage.setItem("language", idiom);

    return require(`./languages/${idiom}`);
  }, [history, idiom, location.pathname]);

  return (
    <LanguageContext.Provider value={{ language, handleSelectIdiom, idiom }}>
      {children}
    </LanguageContext.Provider>
  );
};