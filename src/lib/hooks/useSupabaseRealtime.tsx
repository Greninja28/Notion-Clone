"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useAppState } from "../providers/state-providers";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { File, Folder, workspace } from "../supabase/supabase.types";

// const useSupabaseRealtime = () => {
//   const supabase = createClientComponentClient();
//   const { dispatch, state, workspaceId: selectedWorkspace } = useAppState();
//   const router = useRouter();

//   // files:
//   useEffect(() => {
//     const channel = supabase
//       .channel("db-changes")
//       .on(
//         "postgres_changes",
//         { event: "*", schema: "public", table: "files" },
//         async (payload) => {
//           if (payload.eventType === "INSERT") {
//             console.log("🟢 Received real time update");
//             const {
//               folder_id: folderId,
//               workspace_id: workspaceId,
//               id: fileId,
//             } = payload.new;

//             if (
//               !state.workspaces
//                 .find((workspace) => workspace.id === workspaceId)
//                 ?.folders.find((folder) => folder.id === folderId)
//                 ?.files.find((file) => file.id === fileId)
//             ) {
//               const newFile: File = {
//                 id: payload.new.id,
//                 workspaceId: payload.new.workspace_id,
//                 folderId: payload.new.folder_id,
//                 createdAt: payload.new.created_at,
//                 title: payload.new.title,
//                 iconId: payload.new.icon_id,
//                 inTrash: payload.new.in_trash,
//                 data: payload.new.data,
//                 bannerUrl: payload.new.banner_url,
//               };

//               dispatch({
//                 type: "ADD_FILE",
//                 payload: { file: newFile, folderId, workspaceId },
//               });
//             }
//           } else if (payload.eventType === "DELETE") {
//             let workspaceId = "";
//             let folderId = "";
//             const fileExists = state.workspaces.some((workspace) =>
//               workspace.folders.some((folder) =>
//                 folder.files.some((file) => {
//                   if (file.id === payload.old.id) {
//                     workspaceId = workspace.id;
//                     folderId = folder.id;
//                     return true;
//                   }
//                 })
//               )
//             );
//             if (fileExists && workspaceId && folderId) {
//               router.replace(`/dashboard/${workspaceId}`);
//               dispatch({
//                 type: "DELETE_FILE",
//                 payload: {
//                   fileId: payload.old.id,
//                   folderId,
//                   workspaceId,
//                 },
//               });
//             }
//           } else if (payload.eventType === "UPDATE") {
//             const { folder_id: folderId, workspace_id: workspaceId } =
//               payload.new;

//             state.workspaces.some((workspace) =>
//               workspace.folders.some((folder) =>
//                 folder.files.some((file) => {
//                   if (file.id === payload.new.id) {
//                     dispatch({
//                       type: "UPDATE_FILE",
//                       payload: {
//                         workspaceId,
//                         folderId,
//                         fileId: payload.new.id,
//                         file: {
//                           title: payload.new.title,
//                           iconId: payload.new.icon_id,
//                           inTrash: payload.new.in_trash,
//                         },
//                       },
//                     });
//                     return true;
//                   }
//                 })
//               )
//             );
//           }
//         }
//       )
//       .subscribe();

//     const channel1 = supabase
//       .channel("db-changes")
//       .on(
//         "postgres_changes",
//         { event: "*", schema: "public", table: "folders" },
//         async (payload) => {
//           if (payload.eventType === "INSERT") {
//             console.log("🟢 Received real time update");
//             const { id: fileId, workspace_id: workspaceId } = payload.new;

//             if (
//               !state.workspaces
//                 .find((workspace) => workspace.id === workspaceId)
//                 ?.folders.find((folder) => folder.id === fileId)
//             ) {
//               const newFolder: Folder = {
//                 id: payload.new.id,
//                 workspaceId: payload.new.workspace_id,
//                 createdAt: payload.new.created_at,
//                 title: payload.new.title,
//                 iconId: payload.new.icon_id,
//                 inTrash: payload.new.in_trash,
//                 data: payload.new.data,
//                 bannerUrl: payload.new.banner_url,
//               };

//               dispatch({
//                 type: "ADD_FOLDER",
//                 payload: { folder: { ...newFolder, files: [] }, workspaceId },
//               });
//             }
//           } else if (payload.eventType === "DELETE") {
//             let workspaceId = "";
//             const folderExists = state.workspaces.some((workspace) =>
//               workspace.folders.some((folder) => {
//                 if (folder.id === payload.old.id) {
//                   workspaceId = workspace.id;
//                   return true;
//                 }
//               })
//             );
//             if (folderExists && workspaceId) {
//               router.replace(`/dashboard/${workspaceId}`);
//               dispatch({
//                 type: "DELETE_FOLDER",
//                 payload: {
//                   folderId: payload.old.id,
//                   workspaceId,
//                 },
//               });
//             }
//           } else if (payload.eventType === "UPDATE") {
//             const { folder_id: folderId, workspace_id: workspaceId } =
//               payload.new;

//             state.workspaces.some((workspace) =>
//               workspace.folders.some((folder) => {
//                 if (folder.id === payload.new.id) {
//                   dispatch({
//                     type: "UPDATE_FOLDER",
//                     payload: {
//                       workspaceId,
//                       folderId,
//                       folder: {
//                         title: payload.new.title,
//                         iconId: payload.new.icon_id,
//                         inTrash: payload.new.in_trash,
//                       },
//                     },
//                   });
//                   return true;
//                 }
//               })
//             );
//           }
//         }
//       )
//       .subscribe();

//     const channel2 = supabase
//       .channel("db-changes")
//       .on(
//         "postgres_changes",
//         { event: "*", schema: "public", table: "workspaces" },
//         async (payload) => {
//           if (payload.eventType === "INSERT") {
//             console.log("🟢 Received real time update");
//             const { id: fileId } = payload.new;

//             if (
//               !state.workspaces.find((workspace) => workspace.id === fileId)
//             ) {
//               const newWorkspace: workspace = {
//                 id: payload.new.id,
//                 createdAt: payload.new.created_at,
//                 title: payload.new.title,
//                 iconId: payload.new.icon_id,
//                 inTrash: payload.new.in_trash,
//                 data: payload.new.data,
//                 bannerUrl: payload.new.banner_url,
//                 workspaceOwner: payload.new.workspace_owner,
//                 logo: payload.new.logo,
//               };

//               dispatch({
//                 type: "ADD_WORKSPACE",
//                 payload: { ...newWorkspace, folders: [] },
//               });
//             }
//           } else if (payload.eventType === "DELETE") {
//             let workspaceId = "";
//             const fileExists = state.workspaces.some((workspace) => {
//               if (workspace.id === payload.old.id) {
//                 workspaceId = workspace.id;
//                 return true;
//               }
//             });
//             if (fileExists) {
//               router.replace(`/dashboard`);
//               dispatch({
//                 type: "DELETE_WORKSPACE",
//                 payload: workspaceId,
//               });
//             }
//           } else if (payload.eventType === "UPDATE") {
//             const { workspace_id: workspaceId } = payload.new;

//             state.workspaces.some((workspace) => {
//               if (workspace.id === payload.new.id) {
//                 dispatch({
//                   type: "UPDATE_WORKSPACE",
//                   payload: {
//                     workspaceId,
//                     workspace: {
//                       title: payload.new.title,
//                       iconId: payload.new.icon_id,
//                       inTrash: payload.new.in_trash,
//                     },
//                   },
//                 });
//                 return true;
//               }
//             });
//           }
//         }
//       )
//       .subscribe();

//     return () => {
//       channel.unsubscribe();
//       channel1.unsubscribe();
//       channel2.unsubscribe();
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [supabase, state, selectedWorkspace]);

//   // // folders:
//   // useEffect(() => {
//   //   const channel = supabase
//   //     .channel("db-changes")
//   //     .on(
//   //       "postgres_changes",
//   //       { event: "*", schema: "public", table: "folders" },
//   //       async (payload) => {
//   //         if (payload.eventType === "INSERT") {
//   //           console.log("🟢 Received real time update");
//   //           const { id: fileId, workspace_id: workspaceId } = payload.new;

//   //           if (
//   //             !state.workspaces
//   //               .find((workspace) => workspace.id === workspaceId)
//   //               ?.folders.find((folder) => folder.id === fileId)
//   //           ) {
//   //             const newFolder: Folder = {
//   //               id: payload.new.id,
//   //               workspaceId: payload.new.workspace_id,
//   //               createdAt: payload.new.created_at,
//   //               title: payload.new.title,
//   //               iconId: payload.new.icon_id,
//   //               inTrash: payload.new.in_trash,
//   //               data: payload.new.data,
//   //               bannerUrl: payload.new.banner_url,
//   //             };

//   //             dispatch({
//   //               type: "ADD_FOLDER",
//   //               payload: { folder: { ...newFolder, files: [] }, workspaceId },
//   //             });
//   //           }
//   //         } else if (payload.eventType === "DELETE") {
//   //           let workspaceId = "";
//   //           const folderExists = state.workspaces.some((workspace) =>
//   //             workspace.folders.some((folder) => {
//   //               if (folder.id === payload.old.id) {
//   //                 workspaceId = workspace.id;
//   //                 return true;
//   //               }
//   //             })
//   //           );
//   //           if (folderExists && workspaceId) {
//   //             router.replace(`/dashboard/${workspaceId}`);
//   //             dispatch({
//   //               type: "DELETE_FOLDER",
//   //               payload: {
//   //                 folderId: payload.old.id,
//   //                 workspaceId,
//   //               },
//   //             });
//   //           }
//   //         } else if (payload.eventType === "UPDATE") {
//   //           const { folder_id: folderId, workspace_id: workspaceId } =
//   //             payload.new;

//   //           state.workspaces.some((workspace) =>
//   //             workspace.folders.some((folder) => {
//   //               if (folder.id === payload.new.id) {
//   //                 dispatch({
//   //                   type: "UPDATE_FOLDER",
//   //                   payload: {
//   //                     workspaceId,
//   //                     folderId,
//   //                     folder: {
//   //                       title: payload.new.title,
//   //                       iconId: payload.new.icon_id,
//   //                       inTrash: payload.new.in_trash,
//   //                     },
//   //                   },
//   //                 });
//   //                 return true;
//   //               }
//   //             })
//   //           );
//   //         }
//   //       }
//   //     )
//   //     .subscribe();

//   //   return () => {
//   //     channel.unsubscribe();
//   //   };
//   //   // eslint-disable-next-line react-hooks/exhaustive-deps
//   // }, [supabase, state, selectedWorkspace]);

//   // // workspaces:
//   // useEffect(() => {
//   //   const channel = supabase
//   //     .channel("db-changes")
//   //     .on(
//   //       "postgres_changes",
//   //       { event: "*", schema: "public", table: "workspaces" },
//   //       async (payload) => {
//   //         if (payload.eventType === "INSERT") {
//   //           console.log("🟢 Received real time update");
//   //           const { id: fileId } = payload.new;

//   //           if (
//   //             !state.workspaces.find((workspace) => workspace.id === fileId)
//   //           ) {
//   //             const newWorkspace: workspace = {
//   //               id: payload.new.id,
//   //               createdAt: payload.new.created_at,
//   //               title: payload.new.title,
//   //               iconId: payload.new.icon_id,
//   //               inTrash: payload.new.in_trash,
//   //               data: payload.new.data,
//   //               bannerUrl: payload.new.banner_url,
//   //               workspaceOwner: payload.new.workspace_owner,
//   //               logo: payload.new.logo,
//   //             };

//   //             dispatch({
//   //               type: "ADD_WORKSPACE",
//   //               payload: { ...newWorkspace, folders: [] },
//   //             });
//   //           }
//   //         } else if (payload.eventType === "DELETE") {
//   //           let workspaceId = "";
//   //           const fileExists = state.workspaces.some((workspace) => {
//   //             if (workspace.id === payload.old.id) {
//   //               workspaceId = workspace.id;
//   //               return true;
//   //             }
//   //           });
//   //           if (fileExists) {
//   //             router.replace(`/dashboard`);
//   //             dispatch({
//   //               type: "DELETE_WORKSPACE",
//   //               payload: workspaceId,
//   //             });
//   //           }
//   //         } else if (payload.eventType === "UPDATE") {
//   //           const { workspace_id: workspaceId } = payload.new;

//   //           state.workspaces.some((workspace) => {
//   //             if (workspace.id === payload.new.id) {
//   //               dispatch({
//   //                 type: "UPDATE_WORKSPACE",
//   //                 payload: {
//   //                   workspaceId,
//   //                   workspace: {
//   //                     title: payload.new.title,
//   //                     iconId: payload.new.icon_id,
//   //                     inTrash: payload.new.in_trash,
//   //                   },
//   //                 },
//   //               });
//   //               return true;
//   //             }
//   //           });
//   //         }
//   //       }
//   //     )
//   //     .subscribe();

//   //   return () => {
//   //     channel.unsubscribe();
//   //   };
//   //   // eslint-disable-next-line react-hooks/exhaustive-deps
//   // }, [supabase, state, selectedWorkspace]);

//   return null;
// };

// export default useSupabaseRealtime;

const useSupabaseRealtime = () => {
  const supabase = createClientComponentClient();
  const { dispatch, state, workspaceId: selectedWorskpace } = useAppState();
  const router = useRouter();

  useEffect(() => {
    const channel = supabase
      .channel("db-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "files" },
        async (payload) => {
          if (payload.eventType === "INSERT") {
            console.log("🟢 RECEIVED REAL TIME EVENT");
            const {
              folder_id: folderId,
              workspace_id: workspaceId,
              id: fileId,
            } = payload.new;
            if (
              !state.workspaces
                .find((workspace) => workspace.id === workspaceId)
                ?.folders.find((folder) => folder.id === folderId)
                ?.files.find((file) => file.id === fileId)
            ) {
              const newFile: File = {
                id: payload.new.id,
                workspaceId: payload.new.workspace_id,
                folderId: payload.new.folder_id,
                createdAt: payload.new.created_at,
                title: payload.new.title,
                iconId: payload.new.icon_id,
                data: payload.new.data,
                inTrash: payload.new.in_trash,
                bannerUrl: payload.new.banner_url,
              };
              dispatch({
                type: "ADD_FILE",
                payload: { file: newFile, folderId, workspaceId },
              });
              console.log("new file added");
            }
          } else if (payload.eventType === "DELETE") {
            console.log("🟢 RECEIVED REAL TIME EVENT");
            let workspaceId = "";
            let folderId = "";
            const fileExists = state.workspaces.some((workspace) =>
              workspace.folders.some((folder) =>
                folder.files.some((file) => {
                  if (file.id === payload.old.id) {
                    workspaceId = workspace.id;
                    folderId = folder.id;
                    return true;
                  }
                })
              )
            );
            if (fileExists && workspaceId && folderId) {
              router.replace(`/dashboard/${workspaceId}/${folderId}`);
              dispatch({
                type: "DELETE_FILE",
                payload: { fileId: payload.old.id, folderId, workspaceId },
              });
            }
          } else if (payload.eventType === "UPDATE") {
            console.log("🟢 RECEIVED REAL TIME EVENT");
            const { folder_id: folderId, workspace_id: workspaceId } =
              payload.new;
            state.workspaces.some((workspace) =>
              workspace.folders.some((folder) =>
                folder.files.some((file) => {
                  if (file.id === payload.new.id) {
                    dispatch({
                      type: "UPDATE_FILE",
                      payload: {
                        workspaceId,
                        folderId,
                        fileId: payload.new.id,
                        file: {
                          title: payload.new.title,
                          iconId: payload.new.icon_id,
                          inTrash: payload.new.in_trash,
                          data: payload.new.data,
                        },
                      },
                    });
                    return true;
                  }
                })
              )
            );
          }
        }
      )
      .subscribe();

    // const channel1 = supabase
    //   .channel("db-changes")
    //   .on(
    //     "postgres_changes",
    //     { event: "*", schema: "public", table: "folders" },
    //     async (payload) => {
    //       if (payload.eventType === "INSERT") {
    //         console.log("🟢 RECEIVED REAL TIME EVENT");
    //         const { id: fileId, workspace_id: workspaceId } = payload.new;
    //         if (
    //           !state.workspaces
    //             .find((workspace) => workspace.id === workspaceId)
    //             ?.folders.find((folder) => folder.id === fileId)
    //         ) {
    //           const newFolder: Folder = {
    //             id: payload.new.id,
    //             workspaceId: payload.new.workspace_id,
    //             createdAt: payload.new.created_at,
    //             title: payload.new.title,
    //             iconId: payload.new.icon_id,
    //             data: payload.new.data,
    //             inTrash: payload.new.in_trash,
    //             bannerUrl: payload.new.banner_url,
    //           };
    //           dispatch({
    //             type: "ADD_FOLDER",
    //             payload: { folder: { ...newFolder, files: [] }, workspaceId },
    //           });
    //         }
    //       } else if (payload.eventType === "DELETE") {
    //         let workspaceId = "";
    //         let folderId = "";
    //         const folderExists = state.workspaces.some((workspace) =>
    //           workspace.folders.some((folder) => {
    //             if (folder.id === payload.old.id) {
    //               workspaceId = workspace.id;
    //               folderId = folder.id;
    //               return true;
    //             }
    //           })
    //         );
    //         if (folderExists && workspaceId && folderId) {
    //           router.replace(`/dashboard/${workspaceId}`);
    //           dispatch({
    //             type: "DELETE_FOLDER",
    //             payload: { folderId: payload.old.id, workspaceId },
    //           });
    //         }
    //       } else if (payload.eventType === "UPDATE") {
    //         const { folder_id: folderId, workspace_id: workspaceId } =
    //           payload.new;
    //         state.workspaces.some((workspace) =>
    //           workspace.folders.some((folder) => {
    //             if (folder.id === payload.new.id) {
    //               dispatch({
    //                 type: "UPDATE_FOLDER",
    //                 payload: {
    //                   workspaceId,
    //                   folderId: payload.new.id,
    //                   folder: {
    //                     title: payload.new.title,
    //                     iconId: payload.new.icon_id,
    //                     inTrash: payload.new.in_trash,
    //                   },
    //                 },
    //               });
    //               return true;
    //             }
    //           })
    //         );
    //       }
    //     }
    //   )
    //   .subscribe();

    // const channel2 = supabase
    //   .channel("db-changes")
    //   .on(
    //     "postgres_changes",
    //     { event: "*", schema: "public", table: "workspaces" },
    //     async (payload) => {
    //       if (payload.eventType === "INSERT") {
    //         console.log("🟢 RECEIVED REAL TIME EVENT");
    //         const {
    //           folder_id: folderId,
    //           workspace_id: workspaceId,
    //           id: fileId,
    //         } = payload.new;
    //         if (
    //           !state.workspaces
    //             .find((workspace) => workspace.id === workspaceId)
    //             ?.folders.find((folder) => folder.id === folderId)
    //             ?.files.find((file) => file.id === fileId)
    //         ) {
    //           const newFile: File = {
    //             id: payload.new.id,
    //             workspaceId: payload.new.workspace_id,
    //             folderId: payload.new.folder_id,
    //             createdAt: payload.new.created_at,
    //             title: payload.new.title,
    //             iconId: payload.new.icon_id,
    //             data: payload.new.data,
    //             inTrash: payload.new.in_trash,
    //             bannerUrl: payload.new.banner_url,
    //           };
    //           dispatch({
    //             type: "ADD_FILE",
    //             payload: { file: newFile, folderId, workspaceId },
    //           });
    //         }
    //       } else if (payload.eventType === "DELETE") {
    //         let workspaceId = "";
    //         let folderId = "";
    //         const fileExists = state.workspaces.some((workspace) =>
    //           workspace.folders.some((folder) =>
    //             folder.files.some((file) => {
    //               if (file.id === payload.old.id) {
    //                 workspaceId = workspace.id;
    //                 folderId = folder.id;
    //                 return true;
    //               }
    //             })
    //           )
    //         );
    //         if (fileExists && workspaceId && folderId) {
    //           router.replace(`/dashboard/${workspaceId}`);
    //           dispatch({
    //             type: "DELETE_FILE",
    //             payload: { fileId: payload.old.id, folderId, workspaceId },
    //           });
    //         }
    //       } else if (payload.eventType === "UPDATE") {
    //         const { folder_id: folderId, workspace_id: workspaceId } =
    //           payload.new;
    //         state.workspaces.some((workspace) =>
    //           workspace.folders.some((folder) =>
    //             folder.files.some((file) => {
    //               if (file.id === payload.new.id) {
    //                 dispatch({
    //                   type: "UPDATE_FILE",
    //                   payload: {
    //                     workspaceId,
    //                     folderId,
    //                     fileId: payload.new.id,
    //                     file: {
    //                       title: payload.new.title,
    //                       iconId: payload.new.icon_id,
    //                       inTrash: payload.new.in_trash,
    //                     },
    //                   },
    //                 });
    //                 return true;
    //               }
    //             })
    //           )
    //         );
    //       }
    //     }
    //   )
    //   .subscribe();

    return () => {
      channel.unsubscribe();
      // channel1.unsubscribe();
      // channel2.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase, state, selectedWorskpace, dispatch]);

  return null;
};

export default useSupabaseRealtime;
