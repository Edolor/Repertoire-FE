"use client";
import { createContext, useContext } from "react";
import axios, { AxiosResponse } from "axios";
import { baseURL, PATHS } from "../../urls";

type ContactContextProps = {
  createMessage: (data: any) => Promise<AxiosResponse<any, any>>;
};
const ContactContext = createContext<ContactContextProps>(
  {} as ContactContextProps
);
export const useContact = () => {
  return useContext(ContactContext);
};

export default function ContactProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const client = axios.create({ baseURL: baseURL });

  const createMessage = async (data) => {
    /** Create a contact message */
    const response = await client.post(PATHS.contact, data);

    return response;
  };

  const value = {
    createMessage,
  };

  return (
    <ContactContext.Provider value={value}>{children}</ContactContext.Provider>
  );
}
