import { Layout } from "@/templates";
import { Jost } from "next/font/google";
import { cn } from "ui";
import "../styles/globals.css";

const jost = Jost({ subsets: ["latin"], variable: "--font-jost" });

const App = ({ Component, pageProps }) => {
  return (
    <div className="h-screen">
      <Layout className={cn(jost.variable)}>
        <Component {...pageProps} />
      </Layout>
    </div>
  );
};

export default App;
