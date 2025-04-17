import { ReactNode, createContext, useEffect, useReducer } from "react";
import { Activity } from "@/model/Activity";
import { DB } from "@/utils/db";
import { Participant } from "@/model/Participant";
import { Expense } from "@/model/Expense";

type ActivityContextType = {
  activities: Activity[];
  add: (activity: Activity) => Promise<any>;
  remove: (activity: Activity) => Promise<any>;
  get: (id: string) => Activity;
  detail: (activity: Activity, type: Array<any>) => Promise<any>;
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
      return [action.payload, ...state];
    case "REMOVE_ACTIVITY":
      return state.filter(
        (activity: Activity) => activity.id !== (action.payload as Activity).id
      );
    case "FETCH_DETAIL":
      return state.map((activity: Activity) => {
        if (activity.id === (action.payload as Activity).id) {
          return action.payload;
        }
        return activity;
      });
    default:
      return state;
  }
}

export function ActivityContextProvider({ children }: { children: ReactNode }) {
  const [activities, dispatch] = useReducer(reducer, []);

  useEffect(() => {
    fetchActivitiesDB();
  }, []);

  const fetchActivitiesDB = async () => {
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

  const add = async (activity: Activity): Promise<any> => {
    /** @todo Optimize save process - data consistency between state and db */
    try {
      await activity.save();
      await Promise.allSettled(
        activity.participants.map(async (p: Participant) => {
          await p.save();
        })
      );
      dispatch({ type: "ADD_ACTIVITY", payload: activity });
    } finally {
    }
  };

  const remove = async (activity: Activity): Promise<any> => {
    // SPACE FOR Cascading delete
    try {
      await activity.delete();
      dispatch({ type: "REMOVE_ACTIVITY", payload: activity });
    } finally {
    }
  };

  const get = (id: string): Activity => {
    return activities.find((a: Activity) => a.id === id);
  };

  const detail = async (
    activity: Activity,
    relation: Array<any>
  ): Promise<any> => {
    /** Update inplace */
    try {
      if (relation.find((r) => r === "expense")) {
        await Promise.allSettled(
          await activity.expenses.map(async (e) => await e.detail())
        );
      }
    } catch {
      console.error("Unable to fetch expense detail for activity");
    }
    try {
      if (relation.find((r) => r === "participant")) {
        await Promise.allSettled(
          await activity.participants.map(async (p) => await p.detail())
        );
      }
    } catch {
      console.error("Unable to fetch participant detail for activity");
    }
    /** Trigger state update */
    dispatch({ type: "FETCH_DETAIL", payload: activity });
  };

  const value = {
    activities,
    add,
    remove,
    get,
    detail,
  };

  return (
    <ActivityContext.Provider value={value}>
      {children}
    </ActivityContext.Provider>
  );
}

export { ActivityContext };
