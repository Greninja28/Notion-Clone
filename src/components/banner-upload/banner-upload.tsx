import React from "react";
import CustomDialogTrigger from "../global/custom-dialog";
import BannerUploadForm from "./banner-upload-form";

interface BannerUploadProps {
  children: React.ReactNode;
  className?: string;
  dirType: "workspace" | "folder" | "file";
  id: string;
}

const BannerUpload = ({
  children,
  className,
  id,
  dirType,
}: BannerUploadProps) => {
  return (
    <CustomDialogTrigger
      header="Upload Banner"
      content={<BannerUploadForm dirType={dirType} id={id}></BannerUploadForm>}
      className={className}
    >
      {children}
    </CustomDialogTrigger>
  );
};

export default BannerUpload;
