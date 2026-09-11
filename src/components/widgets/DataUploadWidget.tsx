"use client";

import React, { useState } from "react";
import { ContainerTile } from "../ui/ContainerTile";
import { UploadCloud, File, CheckCircle2, Upload } from "lucide-react";

export function DataUploadWidget() {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!file) return;
    setStatus("uploading");
    
    // Mock upload delay
    setTimeout(() => {
      setStatus("success");
      setTimeout(() => {
        setFile(null);
        setStatus("idle");
      }, 3000);
    }, 1500);
  };

  return (
    <ContainerTile span={2} id="widget_data_upload">
      <div className="space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-white/[0.08]">
          <div className="w-8 h-8 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <UploadCloud className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-sans">
              Data Upload
            </h2>
            <p className="text-[11px] text-text-muted">
              Import CSV or documents to analyze.
            </p>
          </div>
        </div>

        <div
          className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center transition-colors ${
            dragActive ? "border-blue-400 bg-blue-500/5" : "border-line hover:border-line-strong bg-surface-2/30"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {status === "success" ? (
            <div className="flex flex-col items-center gap-2 text-jade">
              <CheckCircle2 className="w-8 h-8" />
              <span className="text-xs font-bold">Upload Complete</span>
            </div>
          ) : status === "uploading" ? (
            <div className="flex flex-col items-center gap-2 text-blue-400 animate-pulse">
              <Upload className="w-8 h-8" />
              <span className="text-xs font-bold">Uploading {file?.name}...</span>
            </div>
          ) : (
            <>
              <input
                type="file"
                id="file-upload"
                className="hidden"
                onChange={handleFileChange}
                accept=".csv,.xlsx,.pdf,.json"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center gap-2 group w-full"
              >
                <div className="p-3 rounded-full bg-surface border border-line group-hover:border-blue-400/50 transition-colors">
                  <File className="w-6 h-6 text-text-muted group-hover:text-blue-400" />
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-bold text-text truncate block max-w-full px-2">
                    {file ? file.name : "Click to select or drag and drop"}
                  </span>
                  <p className="text-[10px] text-text-muted">
                    CSV, XLSX, PDF, or JSON (Max 10MB)
                  </p>
                </div>
              </label>

              {file && (
                <button
                  onClick={handleUpload}
                  className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold rounded-lg transition-colors w-full"
                >
                  Confirm Upload
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </ContainerTile>
  );
}
