import "../styles/globals.css";
import "../components/elements/icons/library";
import "@fortawesome/fontawesome/styles.css";
import type { AppProps } from "next/app";
import { BlackjackProvider } from "../context/data";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <BlackjackProvider>
      <Component {...pageProps} />
    </BlackjackProvider>
  );
}
export default MyApp;
