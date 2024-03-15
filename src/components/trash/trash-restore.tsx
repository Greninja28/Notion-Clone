"use client";

import { appFoldersType, useAppState } from "@/lib/providers/state-providers";
import { File } from "@/lib/supabase/supabase.types";
import { File as FileIcon, Folder } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const TrashRestore = () => {
  const { state, dispatch, workspaceId } = useAppState();
  const [folders, setFolders] = useState<appFoldersType[] | []>([]);
  const [files, setFiles] = useState<File[] | []>([]);

  useEffect(() => {
    const stateFolders =
      state.workspaces
        .find((workspace) => workspace.id === workspaceId)
        ?.folders.filter((folder) => folder.inTrash) || [];

    setFolders(stateFolders);

    let stateFiles: File[] = [];
    state.workspaces
      .find((workspace) => workspace.id === workspaceId)
      ?.folders.forEach((folder) => {
        folder.files.forEach((file) => {
          if (file.inTrash) {
            stateFiles.push(file);
          }
        });
      });
    setFiles(stateFiles);
  }, [state, workspaceId]);

  return (
    <section>
      {!!folders.length && (
        <>
          <h3 className="mt-2">Folders</h3>
          {folders.map((folder) => (
            <Link
              href={`/dashboard/${folder.workspaceId}/${folder.id}`}
              key={folder.id}
              className="hover:bg-muted rounded-md p-2 flex items-center justify-between"
            >
              <article>
                <aside className="flex items-center gap-2">
                  <Folder />
                  {folder.title}
                </aside>
              </article>
            </Link>
          ))}
        </>
      )}
      {!!files.length && (
        <>
          <h3 className="mt-2">Files</h3>
          {files.map((file) => (
            <Link
              href={`/dashboard/${file.workspaceId}/${file.folderId}/${file.id}`}
              key={file.id}
              className="hover:bg-muted rounded-md p-2 flex items-center justify-between"
            >
              <article>
                <aside className="flex items-center gap-2">
                  <FileIcon />
                  {file.title}
                </aside>
              </article>
            </Link>
          ))}
        </>
      )}
      {!files.length && !folders.length && (
        <div className="text-muted-foreground absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2">
          No Items in Trash
        </div>
      )}
    </section>
  );
};

export default TrashRestore;
