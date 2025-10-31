import hdfcLogo from "../logos/hdfc.svg";
import sbiLogo from "../logos/sbi.svg";
import iciciLogo from "../logos/icici.svg";
import idfcLogo from "../logos/idfb.svg";

interface Bank {
  name: string;
  redirectUrl: string;
  logo: any;
}

export const SUPPORTED_BANKS: Bank[] = [
  {
    name: "HDFC Bank",
    redirectUrl: "",
    logo: hdfcLogo,
  },
  {
    name: "State Bank of India",
    redirectUrl: "",
    logo: sbiLogo,
  },
  {
    name: "ICICI Bank",
    redirectUrl: "",
    logo: iciciLogo,
  },
  {
    name: "IDFC Bank",
    redirectUrl: "",
    logo: idfcLogo,
  },
];

export const CONNECTION = "CONNECTION";
export const TRANSFER = "TRANSFER";
export const NOTIFICATION = "NOTIFICATION";
