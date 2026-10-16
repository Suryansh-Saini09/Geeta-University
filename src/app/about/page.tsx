import { permanentRedirect } from "next/navigation";

export default function AboutLegacyRedirect() {
  permanentRedirect("/about-us");
}
