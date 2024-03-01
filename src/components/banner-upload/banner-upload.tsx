import {
  appFoldersType,
  appWorkspacesType,
} from "@/lib/providers/state-providers";
import { File, Folder, workspace } from "@/lib/supabase/supabase.types";
import React from "react";
import CustomDialogTrigger from "../global/custom-dialog";
import BannerUploadForm from "./banner-upload-form";

interface BannerUploadProps {
  children: React.ReactNode;
  className?: string;
  dirType: "workspace" | "folder" | "file";
  id: string;
  details: appWorkspacesType | appFoldersType | File | workspace | Folder;
}

const BannerUpload = ({
  children,
  className,
  id,
  dirType,
  details,
}: BannerUploadProps) => {
  return (
    <CustomDialogTrigger
      header="Upload Banner"
      content={
        <BannerUploadForm
          details={details}
          dirType={dirType}
          id={id}
        ></BannerUploadForm>
      }
      className={className}
    >
      {children}
    </CustomDialogTrigger>
  );
};

export default BannerUpload;
