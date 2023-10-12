import "./globals.css";
import type { Metadata } from "next";
import Script from "next/script";
import { koho, bungee } from "@/fonts";
import AboutProvider from "@/context/AboutContext/AboutContext";
import ThemeProvider from "@/context/ThemeContext/ThemeContext";
import ContactProvider from "@/context/ContactContext/ContactContext";
import ProjectProvider from "@/context/ProjectContext/ProjectContext";

export const metadata: Metadata = {
  title: "Home - Edolor",
  description:
    "Explore Edolor's digital universe—a Software Developer, Designer, DevOps Pro, and Computer Scientist. Dive into a portfolio merging innovation and skill, showcasing seamless solutions, elegant designs, and efficient DevOps practices. Witness the convergence of art and code, reflecting a commitment to pushing the boundaries of technology.",
  themeColor: "#027373",
  // manifest: "/public/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <ProjectProvider>
        <ContactProvider>
          <AboutProvider>
            <html lang="en">
              <body className={`${koho.variable} ${bungee.variable} font-sans`}>
                {children}
                {/* Google Tracking */}
                <Script
                  async
                  src="https://www.googletagmanager.com/gtag/js?id=G-L3K9VKV1Y0"
                ></Script>
                <Script id="google-script">
                  {`window.dataLayer = window.dataLayer || [];
                  function gtag() {
                    dataLayer.push(arguments);
                  }
                  gtag("js", new Date());

                  gtag("config", "G-L3K9VKV1Y0");`}
                </Script>{" "}
                */
              </body>
            </html>
          </AboutProvider>
        </ContactProvider>
      </ProjectProvider>
    </ThemeProvider>
  );
}

{
  /*
<meta name="description"
content="Explore Aghoghomena Akasukpes' portfolio website, a skilled full-stack developer showcasing a range of projects and skills. Discover his expertise in web development, software engineering, and more" />
<meta name="keywords"
content="portfolio, full-stack developer, designer, developer, tech, cybersecurity, aghoghomena, computer scientist, Aghoghomena, Akasukpe" />
<meta name="author" content="aghoghomena" />
<meta property="og:title" content="Edolor portfolio website | Full stack developer | Cybersecurity enthusiast" />
<meta property="og:type" content="website" />
<meta property="og:image" content="%PUBLIC_URL%/favicon-144.png" />
<meta property="og:url" content="https://www.aghoghomena.com/" />
<meta property="og:description"
content="Explore Aghoghomena Akasukpes' portfolio website, a skilled full-stack developer showcasing a range of projects and skills. Discover his expertise in web development, software engineering, and more" />
<meta property="og:site_name" content="aghoghomena" />
<meta name="twitter:card" content="summary" />
<meta name="twitter:site" content="@hackfinals" />
<meta name="twitter:creator" content="@hackfinals" />
<meta property="twitter:image" content="%PUBLIC_URL%/favicon-144.png" />
<meta name="twitter:title" content="Edolor portfolio website | Full stack developer | Cybersecurity enthusiast" />
<meta name="twitter:description"
content="Explore Aghoghomena Akasukpes' portfolio website, a skilled full-stack developer showcasing a range of projects and skills. Discover his expertise in web development, software engineering, and more" />
*/
}
