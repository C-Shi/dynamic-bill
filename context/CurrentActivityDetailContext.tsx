import { ReactNode, createContext, useState } from "react";
import { Participant } from "@/model/Participant";
import { Expense } from "@/model/Expense";

const CurrentActivityDetailContext = createContext({} as any);

export { CurrentActivityDetailContext };

export function CurrentActivityDetailContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [participants, setParticipants] = useState([] as Participant[]);
  const [expenses, setExpenses] = useState([] as Expense[]);

  const reset = () => {
    setParticipants([] as Participant[]);
    setExpenses([] as Expense[]);
  };

  const add = {
    participants: (participants: Participant[]) =>
      setParticipants((prev: Participant[]) => {
        return [...prev, ...participants];
      }),
    participant: (participant: Participant) => {
      setParticipants((prev: Participant[]) => {
        return [...prev, participant];
      });
    },
    expenses: (expenses: Expense[]) =>
      setExpenses((prev: Expense[]) => {
        return [...prev, ...expenses];
      }),
    expense: (expense: Expense) => {
      setExpenses((prev: Expense[]) => {
        return [...prev, expense];
      });
    },
  };

  const value = { add, participants, expenses, reset };

  return (
    <CurrentActivityDetailContext.Provider value={value}>
      {children}
    </CurrentActivityDetailContext.Provider>
  );
}
