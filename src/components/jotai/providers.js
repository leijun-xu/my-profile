'use client';

import { Provider } from "jotai";
import { SessionProvider } from "next-auth/react";

export const Providers = ({ children }) => {
    return (
        <SessionProvider basePath={'/api/auth'} >
            <Provider>
                {children}</Provider>
        </SessionProvider>
    )
}