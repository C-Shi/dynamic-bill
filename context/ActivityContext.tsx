import { ReactNode, createContext, useEffect, useReducer } from "react";
import { Activity } from "@/model/Activity";
import { DB } from "@/utils/DB";
import { Participant } from "@/model/Participant";
import { Expense } from "@/model/Expense";

type ActivityContextType = {
  activities: Activity[];
  add: (activity: Activity) => Promise<any>;
  remove: (activity: Activity) => Promise<any>;
  update: (id: string) => Promise<void>;
  get: (id: string) => Activity;
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
    case "UPDATE_ACTIVITY":
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
    const rows = await DB.query(`
      SELECT a.*, GROUP_CONCAT(DISTINCT p.name) AS participants,
      (SELECT IFNULL(SUM(amount), 0) FROM expenses e WHERE e.activity_id = a.id) AS totals
      FROM activities a LEFT JOIN participants p ON a.id = p.activity_id 
      GROUP BY a.id;
    `);
    const activitiesList = rows.map((r: any) => new Activity(r));
    dispatch({
      type: "GET_ACTIVITIES",
      payload: activitiesList,
    });
  };

  const fetchActivityDB = async (id: string) => {
    const row = await DB.first(
      `
      SELECT a.*, GROUP_CONCAT(DISTINCT p.name) AS participants,
      (SELECT IFNULL(SUM(amount), 0) FROM expenses e WHERE e.activity_id = a.id) AS totals
      FROM activities a LEFT JOIN participants p ON a.id = p.activity_id 
      WHERE a.id = ? GROUP BY a.id;
    `,
      [id]
    );
    const activity = new Activity(row);
    dispatch({
      type: "UPDATE_ACTIVITY",
      payload: activity,
    });
  };

  const add = async (activity: Activity): Promise<any> => {
    /** @todo Optimize save process - data consistency between state and db */
    try {
      const entity = activity.toEntity();
      const participants = activity.participants.map((p) =>
        new Participant({
          name: p,
          activityId: activity.id,
        }).toEntity()
      );
      await DB.insert("activities", entity);
      await DB.insert("participants", participants);
      dispatch({ type: "ADD_ACTIVITY", payload: activity });
    } finally {
    }
  };

  const remove = async (activity: Activity): Promise<any> => {
    // SPACE FOR Cascading delete
    try {
      await DB.delete("activities", activity.id);
      dispatch({ type: "REMOVE_ACTIVITY", payload: activity });
    } finally {
    }
  };

  const get = (id: string): Activity => {
    return activities.find((a: Activity) => a.id === id);
  };

  const update = async (id: string): Promise<void> => {
    fetchActivityDB(id);
  };

  const value = {
    activities,
    add,
    remove,
    get,
    update,
  };

  return (
    <ActivityContext.Provider value={value}>
      {children}
    </ActivityContext.Provider>
  );
}

export { ActivityContext };
