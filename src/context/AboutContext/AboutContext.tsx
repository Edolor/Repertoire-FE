import React, { useContext, createContext } from 'react';
import { baseURL, PATHS } from '../../Routes/url';
import axios from "axios";


const AboutContext = createContext();
const useAbout = () => {
    return useContext(AboutContext);
}

function AboutProvider({ children }) {
    const client = axios.create({baseURL: baseURL});

    const getAbout = async () => {
        /** GET ABOOUT DETAILS */
        return await client.get(PATHS.about);
    }

    const value = {
        getAbout,
    }

    return (
        <AboutContext.Provider value={value}>
            {children}
        </AboutContext.Provider>
    )
}

export default AboutProvider;
export { useAbout };
