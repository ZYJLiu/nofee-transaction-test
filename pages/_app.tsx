import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { WorkspaceProvider } from "../contexts/workspace";

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <ChakraProvider>
            <WorkspaceProvider>
                <Component {...pageProps} />
            </WorkspaceProvider>
        </ChakraProvider>
    );
}

export default MyApp;
