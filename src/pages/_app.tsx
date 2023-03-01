import Layout from "../components/Layout";
import "../styles/globals.scss";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import store from "../store/store";
import "../styles/ReactToastify.scss";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

export default function App({ Component, pageProps }: AppProps) {
  const [client, setClient] = useState(new QueryClient());

  return (
    <Provider store={store}>
      <QueryClientProvider client={client}>
        <Layout>
          <Component {...pageProps} />
        </Layout>

        <ReactQueryDevtools />
      </QueryClientProvider>
    </Provider>
  );
}
