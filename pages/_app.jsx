import React from "react";
import App from "next/app";
import Head from "next/head";
import { ChakraProvider } from "@chakra-ui/react";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { SessionProvider } from "next-auth/react";

import "@fortawesome/fontawesome-free/css/all.min.css";
import "../styles/tailwind.css";
import "../styles/style.css";

export default class MyApp extends App {
  componentDidMount() {
    let comment = document.createComment(`

`);
    document.insertBefore(comment, document.documentElement);
  }
  static async getInitialProps({ Component, router, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }
  render() {
    const {
      Component,
      pageProps: { session, ...pageProps },
    } = this.props;

    const Layout = Component.layout || (({ children }) => <>{children}</>);
    // const queryClient = new QueryClient({
    //   defaultOptions: {
    //     queries: {
    //       retry: 1,
    //     },
    //   },
    // });

    return (
      <>
        {/* <SessionProvider session={session}> */}
        {/* <QueryClientProvider client={queryClient}> */}
        <Layout>
          <ChakraProvider>
            <Component {...pageProps} />
          </ChakraProvider>
        </Layout>
        {/* </QueryClientProvider> */}
        {/* </SessionProvider> */}
      </>
    );
  }
}
