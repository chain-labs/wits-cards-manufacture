import localFont from "next/font/local";
import { Lato } from "next/font/google";

const lato = Lato({
  weight: ["400", "100", "300", "700", "900"],
  subsets: ["latin"],
});

const beaufortPro = localFont({
  src: [
    {
      path: "../fonts/BeaufortPro-light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../fonts/BeaufortPro-regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/BeaufortPro-medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/BeaufortPro-bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../fonts/BeaufortPro-extrabold.otf",
      weight: "800",
      style: "normal",
    },
  ],
});

export { beaufortPro, lato };
