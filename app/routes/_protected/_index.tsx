import { Welcome } from "../../modules/welcome/welcome";

export function meta() {
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
