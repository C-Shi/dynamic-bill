import { ReactNode, createContext, useState } from "react";
import { Participant } from "@/model/Participant";
import { Expense } from "@/model/Expense";
import { DB } from "@/utils/DB";

const CurrentActivityDetailContext = createContext({} as any);

export { CurrentActivityDetailContext };

export function CurrentActivityDetailContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [participants, setParticipants] = useState([] as Participant[]);
  const [expenses, setExpenses] = useState([] as Expense[]);

  const set = async (id: string) => {
    setParticipants([] as Participant[]);
    setExpenses([] as Expense[]);

    try {
      const [participantsResult, expensesResult] = await Promise.allSettled([
        DB.get("participants", { activity_id: ["=", id] }),
        DB.get("expenses", { activity_id: ["=", id] }),
      ]);

      // Handling participants
      if (participantsResult.status === "fulfilled") {
        const ps = participantsResult.value.map(
          (row: any) => new Participant(row)
        );
        add.participants(ps);
      } else {
        console.error("Error loading participants:", participantsResult.reason);
      }

      // Handling expenses
      if (expensesResult.status === "fulfilled") {
        const es = expensesResult.value.map((row: any) => new Expense(row));
        add.expenses(es);
      } else {
        console.error("Error loading expenses:", expensesResult.reason);
      }
    } catch (error) {
      console.error("Error loading activity data:", error);
    }
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

  const value = { add, participants, expenses, set };

  return (
    <CurrentActivityDetailContext.Provider value={value}>
      {children}
    </CurrentActivityDetailContext.Provider>
  );
}
