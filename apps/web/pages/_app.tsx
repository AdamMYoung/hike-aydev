import { Layout } from "@/templates";
import { Jost } from "next/font/google";
import { cn } from "ui";
import "../styles/globals.css";

const jost = Jost({ subsets: ["latin"], variable: "--font-jost" });

const App = ({ Component, pageProps }) => {
  return (
    <Layout className={cn(jost.variable, "flex flex-col pt-16")}>
      <Component {...pageProps} />
    </Layout>
  );
};

export default App;
