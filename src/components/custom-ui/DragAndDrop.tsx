import React, { useRef, useState } from "react";
import { Input } from "../ui-lib/Input";
import { Button } from "../ui-lib/Button";

interface DragAndDropProps {
  values?: File[];
  onChange?: (files: File[]) => void;
  children?: React.ReactNode;
}

export default function DragAndDrop(props: DragAndDropProps) {
  const [files, setFiles] = useState<File[]>(props.values ?? []);
  const [dragging, setDragging] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  function updateFiles(selectedFiles: File[]) {
    const newFiles = [...files, ...selectedFiles];
    setFiles(newFiles);
    if (props.onChange) {
      props.onChange(newFiles);
    }
  }

  // Handle file selection
  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFiles = Array.from(event.target.files);
      updateFiles(selectedFiles);
    }
  }

  // Drag over effect
  function handleDragOver(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(true);
  }

  // Drag leave effect
  function handleDragLeave(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);
  }

  // Handle dropped file
  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);

    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(event.dataTransfer.files);
      updateFiles(droppedFiles);
    }
  }

  function removeFile(
    event: React.MouseEvent<HTMLButtonElement>,
    index: number
  ) {
    event.preventDefault();
    const filteredFiles = files.filter((_, i) => i !== index);
    setFiles(filteredFiles);
    if (props.onChange) {
      props.onChange(filteredFiles);
    }
  }

  function handleInputClick(event: React.MouseEvent<HTMLDivElement>) {
    event.stopPropagation();
    fileInputRef.current?.click();
  }

  return (
    <div className='flex flex-col items-center gap-4 pt-3'>
      {/* Drag & Drop Area */}
      <div
        onClick={handleInputClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`w-full flex justify-center p-5 border-2 border-dashed border-inherit rounded-lg transition-all min-h-[200px]
        ${
          dragging ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-inherit"
        }
        flex flex-col items-center cursor-pointer`}
      >
        <p className='text-gray-600 dark:text-zinc-300 text-opacity-65 text-sm'>
          {dragging
            ? "Drop the file here..."
            : "Drag & drop a file here, or click to select"}
        </p>
        <Input
          type='file'
          ref={fileInputRef}
          accept='image/*, video/*'
          onChange={handleFileChange}
          className='hidden'
        />
      </div>

      {files.length > 0 && (
        <div className='w-full dark:bg-zinc-800 dark:rounded-md p-1'>
          <p className='text-gray-700 dark:text-zinc-300 font-semibold text-sm mb-2'>
            Selected Files:
          </p>
          <div className='grid grid-cols-4 gap-2 overflow-x-auto max-h-[250px] '>
            {files.map((file, index) => (
              <div
                key={index}
                className='relative group hover:bg-zinc-200 p-1 rounded-lg'
              >
                {file.type.startsWith("image/") ? (
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className='w-32 h-24 object-cover rounded-lg'
                  />
                ) : (
                  <video className='w-32 h-24 rounded-lg' controls>
                    <source src={URL.createObjectURL(file)} type={file.type} />
                  </video>
                )}
                <Button
                  variant='ghost'
                  onClick={(e) => removeFile(e, index)}
                  className='absolute top-0 right-0  rounded-md p-1 opacity-0 group-hover:opacity-100 transition'
                >
                  ✕
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
