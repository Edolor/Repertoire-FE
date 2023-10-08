"use client";
import React, { useContext, createContext } from "react";
import { baseURL, PATHS } from "../../urls";
import axios, { AxiosResponse } from "axios";

type AboutContextProps = {
  getAbout: () => Promise<AxiosResponse<any, any>>;
};
const AboutContext = createContext<AboutContextProps>({} as AboutContextProps);

export const useAbout = () => {
  return useContext(AboutContext);
};

export default function AboutProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const client = axios.create({ baseURL: baseURL });

  const getAbout = async () => {
    /** GET ABOOUT DETAILS */
    return await client.get(PATHS.about);
  };

  const value = {
    getAbout,
  };

  return (
    <AboutContext.Provider value={value}>{children}</AboutContext.Provider>
  );
}
