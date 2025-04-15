import { ReactNode, createContext, useEffect, useReducer } from "react";
import { Activity } from "@/model/Activity";
import { DB } from "@/utils/db";
import { Participant } from "@/model/Participant";
import { Expense } from "@/model/Expense";

type ActivityContextType = {
  activities: Activity[];
  add: (activity: any) => Promise<any>;
  remove: (activity: any) => Promise<any>;
};

const ActivityContext = createContext<ActivityContextType>(
  {} as ActivityContextType
);

function reducer(
  state: any,
  action: { type: string; payload: Activity | Activity[] }
) {
  switch (action.type) {
    case "GET_ACTIVITIES":
      return action.payload;
    case "ADD_ACTIVITY":
      return [...state, action.payload];
    case "REMOVE_ACTIVITY":
      return state.filter(
        (activity: Activity) => activity.id! == (action.payload as Activity).id
      );
    default:
      return state;
  }
}

export function ActivityContextProvider({ children }: { children: ReactNode }) {
  const [activities, dispatch] = useReducer(reducer, []);

  useEffect(() => {
    getActivities();
  }, []);

  const getActivities = async () => {
    const activitiesList = await Activity.all();
    await Promise.all(
      activitiesList.map(async (activity) => {
        const [expenses, participants] = await Promise.all([
          Expense.get({ activity_id: ["=", activity.id] }),
          Participant.get({ activity_id: ["=", activity.id] }),
        ]);

        activity.participants = participants;
        activity.expenses = expenses;
        return activity;
      })
    );
    dispatch({
      type: "GET_ACTIVITIES",
      payload: activitiesList,
    });
  };

  const add = async (activity: any): Promise<any> => {
    const newActivity = new Activity(activity);

    // SPACE FOR Add newActivityEntity to db
    dispatch({ type: "ADD_ACTIVITY", payload: newActivity });
  };

  const remove = async (activity: any): Promise<any> => {
    const removedActiity = new Activity(activity as Activity);
    // SPACE FOR Cascading delete
    dispatch({ type: "REMOVE_ACTIVITY", payload: removedActiity });
  };

  const value = {
    activities,
    add,
    remove,
  };

  return (
    <ActivityContext.Provider value={value}>
      {children}
    </ActivityContext.Provider>
  );
}

export { ActivityContext };
