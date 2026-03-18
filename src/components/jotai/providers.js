'use client';

import { Provider } from "jotai";
import { SessionProvider } from "next-auth/react";
import { base_path } from "@/lib/const";

export const Providers = ({ children }) => {
    return (
        <SessionProvider basePath={base_path + '/api/auth'} >
            <Provider>
                {children}</Provider>
        </SessionProvider>
    )
}