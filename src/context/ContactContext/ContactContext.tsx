import React, { createContext, useContext } from 'react';
import axios from "axios";
import { baseURL, PATHS } from '../../Routes/url';

const ContactContext = createContext();
const useContact = () => {
    return useContext(ContactContext);
}

function ContactProvider({children}) {
    const client = axios.create({baseURL: baseURL});

    const createMessage = async (data) => {
        /** Create a contact message */
        const response = await client.post(PATHS.contact, data);

        return response;
    }

    const value = {
        createMessage,
    }

  return (
    <ContactContext.Provider value={value}>
        {children}
    </ContactContext.Provider>
  )
}

export default ContactProvider;
export { useContact };