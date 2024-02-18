"use client";

import {
  Dispatch,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import { Folder, workspace } from "../supabase/supabase.types";
import { usePathname } from "next/navigation";

export type appFoldersType = Folder & { files: File[] | [] };
export type appWorkspacesType = workspace & { folders: appFoldersType[] | [] };

interface AppState {
  workspaces: appWorkspacesType[] | [];
}

interface AppStateProviderProps {
  children: React.ReactNode;
}

type Action =
  | { type: "ADD_WORKSPACE"; payload: appWorkspacesType }
  | {
      type: "SET_WORKSPACES";
      payload: { workspaces: appWorkspacesType[] | [] };
    };

const initalState: AppState = {
  workspaces: [],
};

const appReducer = (
  state: AppState = initalState,
  action: Action
): AppState => {
  switch (action.type) {
    case "ADD_WORKSPACE":
      return { ...state, workspaces: [...state.workspaces, action.payload] };
    case "SET_WORKSPACES":
      return { ...state, workspaces: action.payload.workspaces };
    default:
      return initalState;
  }
};

const AppStateContext = createContext<
  | {
      state: AppState;
      dispatch: Dispatch<Action>;
      workspaceId: string | undefined;
      folderId: string | undefined;
      fileId: string | undefined;
    }
  | undefined
>(undefined);

const AppStateProvider = ({ children }: AppStateProviderProps) => {
  const [state, dispatch] = useReducer(appReducer, initalState);
  const pathname = usePathname();

  const workspaceId = useMemo(() => {
    const urlSegments = pathname?.split("/").filter(Boolean);
    if (urlSegments) {
      if (urlSegments.length > 1) {
        return urlSegments[1];
      }
    }
  }, [pathname]);

  const folderId = useMemo(() => {
    const urlSegments = pathname?.split("/").filter(Boolean);
    if (urlSegments) {
      if (urlSegments?.length > 2) {
        return urlSegments[2];
      }
    }
  }, [pathname]);

  const fileId = useMemo(() => {
    const urlSegments = pathname?.split("/").filter(Boolean);
    if (urlSegments) {
      if (urlSegments?.length > 3) {
        return urlSegments[3];
      }
    }
  }, [pathname]);

  useEffect(() => {
    console.log("App state changed", state);
  }, [state]);

  return (
    <AppStateContext.Provider
      value={{ state, dispatch, workspaceId, folderId, fileId }}
    >
      {children}
    </AppStateContext.Provider>
  );
};

export default AppStateProvider;

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error("useAppState must be used within an AppStateProvider");
  }
  return context;
};
