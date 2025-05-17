import { ReactNode, createContext, useState } from "react";
import { Participant } from "@/model/Participant";
import { Expense } from "@/model/Expense";
import { DB } from "@/utils/db";

/**
 * Type definition for the add operations in the context
 */
type AddOperations = {
  /** Add multiple participants at once */
  participants: (participants: Participant[]) => void;

  /** Add a single participant */
  participant: (participant: Participant) => void;

  /** Add multiple expenses at once */
  expenses: (expenses: Expense[]) => void;

  /** Add a single expense */
  expense: (expense: Expense) => void;
};

/**
 * Type definition for the Current Activity Detail Context
 * Provides methods and state for managing the currently selected activity's details
 */
type CurrentActivityDetailContextType = {
  /** ID of the currently selected activity */
  activityId: string | undefined;

  /** List of participants in the current activity */
  participants: Participant[];

  /** List of expenses in the current activity */
  expenses: Expense[];

  /** Operations for adding participants and expenses */
  add: AddOperations;

  /** Set the current activity and load its details */
  set: (id: string) => Promise<void>;
};

/**
 * Creates the Current Activity Detail Context with default values
 */
const CurrentActivityDetailContext =
  createContext<CurrentActivityDetailContextType>(
    {} as CurrentActivityDetailContextType
  );

export { CurrentActivityDetailContext };

/**
 * Provider component for Current Activity Detail Context
 * Manages the state and operations for the currently selected activity's details
 */
export function CurrentActivityDetailContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [activityId, setActivityId] = useState<string | undefined>(undefined);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  /**
   * Sets the current activity and loads its details
   * @param id ID of the activity to load
   */
  const set = async (id: string): Promise<void> => {
    setActivityId(id);
    setParticipants([]);
    setExpenses([]);

    try {
      const [participantsResult, expensesResult] = await Promise.allSettled([
        DB.get("participants", { activity_id: ["=", id] }),
        DB.get("expenses", { activity_id: ["=", id] }),
      ]);

      // Handle participants data
      if (participantsResult.status === "fulfilled") {
        const participants = participantsResult.value.map(
          (row: any) => new Participant(row)
        );
        add.participants(participants);
      } else {
        console.error("Error loading participants:", participantsResult.reason);
        throw new Error("Failed to load participants");
      }

      // Handle expenses data
      if (expensesResult.status === "fulfilled") {
        const expenses = expensesResult.value.map(
          (row: any) => new Expense(row)
        );
        add.expenses(expenses);
      } else {
        console.error("Error loading expenses:", expensesResult.reason);
        throw new Error("Failed to load expenses");
      }
    } catch (error) {
      console.error("Error loading activity data:", error);
      throw error;
    }
  };

  /**
   * Operations for adding participants and expenses
   */
  const add: AddOperations = {
    participants: (newParticipants: Participant[]) =>
      setParticipants((prev: Participant[]) => [...prev, ...newParticipants]),

    participant: (participant: Participant) =>
      setParticipants((prev: Participant[]) => [...prev, participant]),

    expenses: (newExpenses: Expense[]) =>
      setExpenses((prev: Expense[]) => [...prev, ...newExpenses]),

    expense: (expense: Expense) =>
      setExpenses((prev: Expense[]) => [...prev, expense]),
  };

  const value: CurrentActivityDetailContextType = {
    activityId,
    participants,
    expenses,
    add,
    set,
  };

  return (
    <CurrentActivityDetailContext.Provider value={value}>
      {children}
    </CurrentActivityDetailContext.Provider>
  );
}
