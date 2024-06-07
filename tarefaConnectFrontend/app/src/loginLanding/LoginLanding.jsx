import { LandingPage } from './LandingUtils';
import './LoginLanding.css';

// eslint-disable-next-line
const panelData = [
  {
    id: 0,
    buttonText: "I need help with something",
    body: "Get help from a worker to complete your job",
    redirectTo: "/findHelp"
  },
  {
    id: 1,
    buttonText: "I provide a service",
    body: "See what people need doing and negotiate a contract",
    redirectTo: "/taskList"
  }
]

export default function LoginLanding() {
  return LandingPage(panelData)
}
