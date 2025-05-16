import { ReactNode, createContext, useEffect, useReducer } from "react";
import { Activity } from "@/model/Activity";
import { DB } from "@/utils/DB";
import { Participant } from "@/model/Participant";

/**
 * Type definition for the Activity Context
 * Provides methods and state for managing activities throughout the application
 */
type ActivityContextType = {
  /** List of all activities */
  activities: Activity[];

  /** Add a new activity */
  add: (activity: Activity) => Promise<any>;

  /** Remove an existing activity */
  remove: (activity: Activity) => Promise<any>;

  /** Update an activity's data from the database */
  update: (id: string) => Promise<void>;

  /** Get an activity by its ID */
  get: (id: string) => Activity;

  /** Modify an existing activity */
  modify: (activity: Activity) => Promise<Activity>;
};

/**
 * Action types for the activity reducer
 */
type ActivityAction =
  | { type: "GET_ACTIVITIES"; payload: Activity[] }
  | { type: "ADD_ACTIVITY"; payload: Activity }
  | { type: "REMOVE_ACTIVITY"; payload: Activity }
  | { type: "UPDATE_ACTIVITY"; payload: Activity };

/**
 * Creates the Activity Context with default values
 */
const ActivityContext = createContext<ActivityContextType>(
  {} as ActivityContextType
);

/**
 * Reducer function for managing activity state
 * @param state Current state of activities
 * @param action Action to be performed
 * @returns Updated state
 */
function reducer(state: Activity[], action: ActivityAction): Activity[] {
  switch (action.type) {
    case "GET_ACTIVITIES":
      return action.payload;
    case "ADD_ACTIVITY":
      return [action.payload, ...state];
    case "REMOVE_ACTIVITY":
      return state.filter((activity) => activity.id !== action.payload.id);
    case "UPDATE_ACTIVITY":
      return state.map((activity) =>
        activity.id === action.payload.id ? action.payload : activity
      );
    default:
      return state;
  }
}

/**
 * Provider component for Activity Context
 * Manages the state and operations for activities
 */
export function ActivityContextProvider({ children }: { children: ReactNode }) {
  const [activities, dispatch] = useReducer(reducer, []);

  useEffect(() => {
    fetchActivitiesDB();
  }, []);

  /**
   * Fetches all activities from the database with their participants and totals
   */
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

  /**
   * Fetches a single activity from the database with its participants and totals
   * @param id ID of the activity to fetch
   */
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

  /**
   * Adds a new activity to the database and context
   * @param activity Activity to be added
   */
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
    } catch (error) {
      console.error("Error adding activity:", error);
      throw error;
    }
  };

  /**
   * Removes an activity from the database and context
   * @param activity Activity to be removed
   */
  const remove = async (activity: Activity): Promise<any> => {
    try {
      await DB.delete("activities", activity.id);
      dispatch({ type: "REMOVE_ACTIVITY", payload: activity });
    } catch (error) {
      console.error("Error removing activity:", error);
      throw error;
    }
  };

  /**
   * Gets an activity by its ID
   * @param id ID of the activity to get
   * @returns The activity with the specified ID
   * @throws Error if activity is not found
   */
  const get = (id: string): Activity => {
    const activity = activities.find((a: Activity) => a.id === id);
    if (!activity) {
      throw new Error(`Activity with id ${id} not found`);
    }
    return activity;
  };

  /**
   * Modifies an existing activity in the database and context
   * @param activity Activity to be modified
   * @returns The modified activity
   */
  const modify = async (activity: Activity): Promise<Activity> => {
    try {
      dispatch({ type: "UPDATE_ACTIVITY", payload: activity });
      await DB.update("activities", activity.id, activity.toEntity());
      return activity;
    } catch (error) {
      console.error("Error modifying activity:", error);
      throw error;
    }
  };

  /**
   * Updates an activity's data from the database
   * @param id ID of the activity to update
   */
  const update = async (id: string): Promise<void> => {
    await fetchActivityDB(id);
  };

  const value = {
    activities,
    add,
    remove,
    get,
    update,
    modify,
  };

  return (
    <ActivityContext.Provider value={value}>
      {children}
    </ActivityContext.Provider>
  );
}

export { ActivityContext };
