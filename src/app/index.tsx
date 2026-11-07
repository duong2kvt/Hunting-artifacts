import { Redirect } from "expo-router";

import { OnboardingFlow } from "@/features/onboarding/onboarding-flow";
import { useProfile } from "@/state/profile";

export default function Entry() {
  const { onboarded, tutorialDone } = useProfile();
  if (onboarded)
    return <Redirect href={tutorialDone ? "/museum" : "/tutorial"} />;
  return <OnboardingFlow />;
}
