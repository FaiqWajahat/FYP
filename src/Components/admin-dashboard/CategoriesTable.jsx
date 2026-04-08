"use client";
import React from "react";
import { Edit, Trash, Layers } from "lucide-react";
import Image from "next/image";

export default function CategoriesTable({ categories, onEdit, onDelete }) {
  if (categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 border-2 border-dashed border-base-content/10 rounded-2xl">
        <Layers className="w-12 h-12 text-base-content/20" />
        <p className="text-[10px] uppercase font-black tracking-widest text-base-content/40">No Categories Found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="table w-full table-md">
        <thead className="text-xs font-semibold text-base-content/70 bg-base-200 uppercase tracking-wide">
          <tr>
            <th>ID</th>
            <th>Category</th>
            <th>Description</th>
            <th>Subcategories</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {categories.map((cat, idx) => (
            <tr key={cat.id} className="hover:bg-base-200/40 transition">
              {/* ID */}
              <td className="font-mono text-[10px] opacity-50 whitespace-nowrap">
                  #{cat.id?.slice(0, 8) || idx + 1}
              </td>

              {/* Category (Image + Name) */}
              <td>
                <div className="flex items-center gap-3">
                  <div className="avatar">
                    <div className="w-10 h-10 rounded-lg overflow-hidden ring-1 ring-base-300 ring-offset-1 bg-base-200">
                      {cat.image_url ? (
                        <Image
                          src={cat.image_url}
                          alt={cat.name}
                          width={50}
                          height={50}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-base-300 text-base-content/20">
                           <Layers size={16} />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex h-full flex-col">
                    <h3 className="font-medium text-xs text-base-content">{cat.name}</h3>
                    <div className="text-[10px] opacity-40 font-medium">Type: Main</div>
                  </div>
                </div>
              </td>

              {/* Description */}
              <td>
                <div className="text-xs font-medium text-base-content/70 line-clamp-1 max-w-[250px]">
                  {cat.description || "—"}
                </div>
              </td>

              {/* Subcategories */}
              <td>
                <div className="flex flex-wrap gap-1">
                  {cat.subcategories?.slice(0, 2).map((sub, i) => (
                    <span key={i} className="px-1.5 py-0.5 rounded bg-base-200 text-[9px] font-black uppercase text-base-content/60 tracking-wider">
                      {sub}
                    </span>
                  ))}
                  {cat.subcategories?.length > 2 && (
                    <span className="text-[10px] font-bold text-base-content/40 pl-1">
                      +{cat.subcategories.length - 2}
                    </span>
                  )}
                  {(!cat.subcategories || cat.subcategories.length === 0) && <span className="text-xs opacity-20">—</span>}
                </div>
              </td>

              {/* Status */}
              <td>
                <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${
                  cat.status === "Active" ? "bg-success/10 text-success" : "bg-error/10 text-error"
                }`}>
                  {cat.status}
                </span>
              </td>

              {/* Actions */}
              <td>
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => onEdit?.(cat)}
                    className="btn btn-ghost btn-circle btn-xs hover:bg-base-300 p-1"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => onDelete?.(cat)}
                    className="btn btn-ghost btn-circle btn-xs hover:bg-base-300 hover:text-error p-1"
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
