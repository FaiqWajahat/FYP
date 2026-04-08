import { Edit, Trash, Star, Loader2, Package } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import ConfirmationDialog from "@/Components/common/ConfirmationDialog";

export default function ProductsTable({ products, onRefresh }) {
  const router = useRouter();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);
    try {
      await axios.delete(`/api/products/${productToDelete.id}`);
      toast.success("Product deleted successfully");
      setIsDeleteModalOpen(false);
      if (onRefresh) onRefresh();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to delete product");
    } finally {
      setIsDeleting(false);
      setProductToDelete(null);
    }
  };

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 border-2 border-dashed border-base-content/10 rounded-2xl">
        <Package className="w-12 h-12 text-base-content/20" />
        <p className="text-[10px] uppercase font-black tracking-widest text-base-content/40">No Products Found</p>
      </div>
    );
  }

  return (
    <>
    <div className="overflow-x-auto">
      <table className="table w-full table-md">
        {/* head */}
        <thead className="text-xs font-semibold text-base-content/70 bg-base-200 uppercase tracking-wide">
          <tr>
            <th>ID</th>
            <th>Product</th>
            <th>Category</th>
            <th>Price</th>
            <th>Ratings</th>
            <th>Orders</th>
            <th>Stock</th>
            <th className="hidden md:table-cell">Created At</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, idx) => (
            <tr key={idx} className="hover:bg-base-200/40 transition">
              {/* Product ID */}
              <td className="font-mono text-[10px] opacity-50 whitespace-nowrap">
                #{product.sku || (product.id?.toString().length > 8 ? product.id.toString().slice(0, 8) : product.id)}
              </td>

              {/* Product (Image + Name) */}
              <td>
                <div className="flex items-center gap-3">
                  <div className="avatar">
                    <div className="w-10 h-10 rounded-lg overflow-hidden ring-1 ring-base-300 ring-offset-1 bg-base-200">
                      <Image
                        src={product.images?.[0] || product.image || 'https://placehold.co/100x100?text=Product'}
                        alt={product.name}
                        width={50}
                        height={50}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </div>
                  <div className="flex h-full flex-col">
                    <div>
                      <h3 className="font-medium text-xs ">{product.name || product.title}</h3>
                      <div>
                        {(product.quantity || product.stock) > 0 ? (
                          <span className="text-success text-[10px] font-bold uppercase tracking-wider">In Stock</span>
                        ) : (
                          <span className="text-error text-[10px] font-bold uppercase tracking-wider">Out of Stock</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </td>

              {/* Category */}
              <td className="flex flex-col gap-1">
                <div className="text-xs font-medium">
                  <h5> {product.category} </h5>
                </div>
                <div className="text-gray-400 text-xs">
                  <span>
 
                      {product.subCategory}
                  
                  </span>
                 
                </div>
              </td>

              {/* Price */}
              <td className="font-bold text-sm">
                ${product.pricingTiers?.[0]?.price || product.price || "0.00"}
              </td>

              {/* Ratings */}
              <td>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm">
                    {product.rating || product.ratings || '0.0'}
                  </span>
                  {product.reviewCount && (
                    <span className="text-xs text-base-content/60">
                      ({product.reviewCount})
                    </span>
                  )}
                </div>
              </td>

              {/* Orders */}
              <td className="font-medium">
                {product.orders || product.orderCount || 0}
              </td>

              {/* Stock */}
              <td>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className={`font-black text-sm ${
                      (product.quantity || product.stock || 0) <= (product.threshold || 5)
                        ? 'text-error' 
                        : (product.quantity || product.stock || 0) <= 20 
                        ? 'text-warning' 
                        : 'text-success'
                    }`}>
                      {product.quantity || product.stock || 0}
                    </span>
                    {(product.quantity || product.stock || 0) <= (product.threshold || 5) && (
                      <span className="px-1.5 py-0.5 rounded bg-error/10 text-error text-[9px] font-black uppercase">Low</span>
                    )}
                  </div>
                  <div className="text-[10px] opacity-40 font-medium">Units</div>
                </div>
              </td>

              {/* Created At */}
              <td className="hidden md:table-cell text-xs opacity-60">
                {product.created_at ? new Date(product.created_at).toLocaleDateString() : (product.createdAt || 'N/A')}
              </td>

              {/* Actions */}
              <td>
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => router.push(`/Dashboard/Products/Edit/${product.id}`)}
                    className="btn btn-ghost btn-circle btn-xs hover:bg-base-300 p-1"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => {
                      setProductToDelete(product);
                      setIsDeleteModalOpen(true);
                    }}
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
    
    <ConfirmationDialog 
      isOpen={isDeleteModalOpen}
      onClose={() => !isDeleting && setIsDeleteModalOpen(false)}
      onConfirm={handleDelete}
      isLoading={isDeleting}
      title="Delete Product?"
      message={`Are you sure you want to delete "${productToDelete?.name}"? This will permanently remove it from your warehouse.`}
      confirmText="Yes, Delete Product"
    />
    </>
  );
}

