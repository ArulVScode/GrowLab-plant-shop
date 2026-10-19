import { useRef, useState } from "react";
import { Upload, X, ImagePlus } from "lucide-react";
import { api } from "../../services/apiClient";
import { getAdminToken } from "../../services/authStorage";

async function uploadFile(file) {
  const res = await api.upload("/uploads", file, { token: getAdminToken() });
  return res.data.url;
}

export function MainImageUpload({
  value,
  onChange,
  error,
  label = "Main Image",
  required = true,
}) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const handleFiles = async (files) => {
    const file = files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError("");
    try {
      onChange(await uploadFile(file));
    } catch (err) {
      setUploadError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="block text-sm font-bold font-display mb-1.5">
        {label} {required && <span className="text-clay">*</span>}
      </label>
      {value ? (
        <div className="relative w-full max-w-xs">
          <img
            src={value}
            alt="Preview produk"
            className="w-full aspect-square object-cover border-3 border-ink"
          />
          <div className="absolute top-2 right-2 flex gap-1.5">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="w-8 h-8 flex items-center justify-center bg-paper border-2 border-ink hover:bg-yellow"
              aria-label="Ganti gambar"
            >
              <Upload size={14} />
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              className="w-8 h-8 flex items-center justify-center bg-paper border-2 border-ink hover:bg-red-600 hover:text-cream hover:border-red-600"
              aria-label="Hapus gambar"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            handleFiles(e.dataTransfer.files);
          }}
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
          className={`w-full max-w-xs aspect-square border-3 border-dashed flex flex-col items-center justify-center gap-2 text-center cursor-pointer transition-colors ${
            dragOver
              ? "border-ink bg-cream"
              : "border-ink/30 bg-paper hover:bg-cream"
          }`}
        >
          <Upload size={24} className="text-muted" />
          <p className="text-sm font-semibold">Upload Image</p>
          <p className="text-xs text-muted px-4">
            Drag &amp; drop here or browse files
          </p>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      {uploading && (
        <p className="text-xs font-semibold mt-1.5">Mengunggah...</p>
      )}
      {(error || uploadError) && (
        <p className="text-clay text-xs font-semibold mt-1.5">
          {error || uploadError}
        </p>
      )}
    </div>
  );
}

export function GalleryImageUpload({ images, onChange }) {
  const inputRef = useRef(null);

  const [uploadError, setUploadError] = useState("");

  const handleFiles = async (files) => {
    const list = Array.from(files || []);
    if (!list.length) return;
    setUploadError("");
    try {
      const urls = await Promise.all(list.map(uploadFile));
      onChange([...images, ...urls]);
    } catch (err) {
      setUploadError(err.message);
    }
  };

  const removeAt = (idx) => onChange(images.filter((_, i) => i !== idx));

  return (
    <div>
      <label className="block text-sm font-bold font-display mb-1.5">
        Additional Images
      </label>
      <div className="flex flex-wrap gap-3">
        {images.map((img, idx) => (
          <div key={idx} className="relative w-20 h-20 shrink-0">
            <img
              src={img}
              alt=""
              className="w-full h-full object-cover border-2 border-ink"
            />
            <button
              type="button"
              onClick={() => removeAt(idx)}
              aria-label="Hapus gambar tambahan"
              className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center bg-ink text-cream border-2 border-paper"
            >
              <X size={10} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-20 h-20 shrink-0 border-3 border-dashed border-ink/30 flex flex-col items-center justify-center gap-1 hover:bg-cream"
        >
          <ImagePlus size={18} className="text-muted" />
          <span className="text-[10px] text-muted font-semibold">Add</span>
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      {uploadError && (
        <p className="text-clay text-xs font-semibold mt-1.5">{uploadError}</p>
      )}
    </div>
  );
}
