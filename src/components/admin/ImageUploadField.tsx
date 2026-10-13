'use client';

import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, X, AlertCircle, Check, Loader2 } from 'lucide-react';

interface ImageUploadFieldProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  hint?: string;
  aspectRatio?: string;
  placeholder?: string;
}

export function ImageUploadField({
  value,
  onChange,
  label = 'Image Asset',
  hint,
  aspectRatio = 'aspect-16/9',
  placeholder = 'https://... or click Upload below',
}: ImageUploadFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewError, setPreviewError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadFile = async (file: File) => {
    setError(null);
    setPreviewError(false);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success && data.url) {
        onChange(data.url);
      } else {
        setError(data.error || 'Upload failed.');
      }
    } catch {
      setError('Network communication failed during file upload.');
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUploadFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handleUploadFile(file);
    } else if (file) {
      setError('Please select a valid image file (PNG, JPG, WebP, SVG).');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  return (
    <div className="space-y-3">
      {/* Label and Hint */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs font-mono">
        <label className="block text-[10px] font-mono-tag uppercase text-[var(--stone)]">
          {label}
        </label>
        {hint && <span className="text-[10px] text-[var(--stone)]">{hint}</span>}
      </div>

      {/* URL Input Bar & Upload Button */}
      <div className="flex gap-2">
        <div className="relative flex-1 min-w-0">
          <input
            type="text"
            value={value}
            onChange={(e) => {
              setPreviewError(false);
              onChange(e.target.value);
            }}
            placeholder={placeholder}
            className="w-full bg-[var(--bg-page)] border border-[var(--border-color)] px-3 py-2 text-xs font-mono text-[var(--text-primary)] focus:outline-none focus:border-[var(--signal)] pr-8 truncate"
          />
          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--stone)] hover:text-red-500 cursor-pointer"
              title="Clear image URL"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml,image/gif,image/avif"
          className="hidden"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="px-2.5 sm:px-3.5 py-2 border border-[var(--border-color)] hover:border-[var(--signal)] hover:text-[var(--signal)] text-xs font-mono-tag uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0 bg-[var(--surface-elevated)]"
        >
          {uploading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span className="hidden sm:inline">UPLOADING...</span>
              <span className="sm:hidden">...</span>
            </>
          ) : (
            <>
              <Upload className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">UPLOAD FILE</span>
              <span className="sm:hidden">UPLOAD</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="p-2 bg-red-500/10 border border-red-500/30 text-red-500 text-xs flex items-center gap-2 font-mono">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Drag & Drop Upload Zone / Visual Preview */}
      {value ? (
        <div className={`border border-[var(--border-color)] bg-[var(--bg-page)] relative ${aspectRatio} w-full overflow-hidden flex items-center justify-center group`}>
          {!previewError ? (
            <img
              src={value}
              alt="Uploaded preview"
              onError={() => setPreviewError(true)}
              className="w-full h-full object-cover filter grayscale contrast-105 group-hover:grayscale-0 transition-all duration-300"
            />
          ) : (
            <div className="text-center p-4 text-xs font-mono text-[var(--stone)]">
              <AlertCircle className="w-5 h-5 mx-auto mb-1 text-amber-500" />
              <span>Unable to render image preview from specified URL</span>
            </div>
          )}

          <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-[var(--bg-page)]/90 backdrop-blur-sm border border-[var(--border-color)] text-[9px] font-mono text-[var(--stone)] uppercase flex items-center gap-1.5">
            <Check className="w-3 h-3 text-emerald-500" />
            <span>ASSET ATTACHED: {value.startsWith('/uploads/') ? 'LOCAL FILE' : 'REMOTE URL'}</span>
          </div>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute top-2 right-2 px-2 py-1 bg-[var(--bg-page)]/90 backdrop-blur-sm border border-[var(--border-color)] hover:border-[var(--signal)] text-[10px] font-mono text-[var(--text-primary)] hover:text-[var(--signal)] opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 cursor-pointer"
          >
            <Upload className="w-3 h-3" />
            <span>REPLACE</span>
          </button>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed p-6 text-center transition-colors cursor-pointer flex flex-col items-center justify-center gap-2 ${
            dragActive
              ? 'border-[var(--signal)] bg-[var(--signal)]/5 text-[var(--signal)]'
              : 'border-[var(--border-color)] hover:border-[var(--text-primary)] text-[var(--stone)] bg-[var(--surface-elevated)]/30'
          }`}
        >
          <ImageIcon className="w-6 h-6 opacity-60" />
          <div className="text-xs font-mono">
            <span className="font-semibold text-[var(--text-primary)]">Click to upload</span> or drag and drop image file here
          </div>
          <span className="text-[10px] font-mono text-[var(--stone)]">
            PNG, JPG, WebP, SVG up to 10MB (stored in public/uploads/)
          </span>
        </div>
      )}
    </div>
  );
}
