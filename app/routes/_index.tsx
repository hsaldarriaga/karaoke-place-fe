import type { Route } from "./+types/_index";
import { Welcome } from "../welcome/welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Karaoke Place | Auth0 Login" },
    {
      name: "description",
      content: "Secure sign-in for your karaoke management app using Auth0.",
    },
  ];
}

export default function Home() {
  return <Welcome />;
}
