import React, { useEffect } from "react";
import { useNavigation, useLocalSearchParams } from "expo-router";
import ParticipantDetails from "@/components/participants/ParticipantDetail";

export default function ParticipantDetailsPage() {
  const { pid } = useLocalSearchParams();
  const participantId = pid as string;
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      title: "Participant Details",
    });
  });

  return (
    <ParticipantDetails participantId={participantId}></ParticipantDetails>
  );
}
