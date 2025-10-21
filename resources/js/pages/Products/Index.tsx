"use client";

import { PlaceholderPattern } from "@/components/ui/placeholder-pattern";
import AppLayout from "@/layouts/app-layout";
import { Head, Link, router } from "@inertiajs/react";
import type { BreadcrumbItem, Product } from "@/types";
import { Edit2, Trash2 } from "lucide-react";
import { useState } from "react";

interface Props {
    products: Product[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: "Dashboard", href: "/dashboard" },
    { title: "Products", href: "/products" },
];

export default function ProductsIndex({ products }: Props) {
    const [deleting, setDeleting] = useState<number | null>(null);

    const handleDelete = (id: number, name: string) => {
        if (!confirm(`Yakin ingin menghapus produk "${name}"?`)) return;
        setDeleting(id);

        router.delete(`/products/${id}`, {
            onFinish: () => setDeleting(null),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Products" />
            <div className="flex flex-1 flex-col gap-6 p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                        Daftar Produk 📦
                    </h1>
                    <Link
                        href="/products/create"
                        className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white shadow-md transition duration-150 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-dark-bg"
                    >
                        Tambah Produk
                    </Link>
                </div>

                {/* Tabel */}
                <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg dark:bg-dark-card">
                    {products.length > 0 ? (
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-800/70">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                                        Gambar
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                                        Nama & Kategori
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                                        Deskripsi
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                                        Harga
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                                        Stok
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {products.map((product) => (
                                    <tr
                                        key={product.id}
                                        className="hover:bg-gray-50 dark:hover:bg-gray-800 transition duration-100"
                                    >
                                        {/* Gambar */}
                                        <td className="p-4">
                                            <div className="size-12 overflow-hidden rounded-md bg-gray-100 dark:bg-gray-800 relative">
                                                {product.image ? (
                                                    <img
                                                        src={`/storage/${product.image}`}
                                                        alt={product.name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                                                )}
                                            </div>
                                        </td>

                                        {/* Nama & Kategori */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                                {product.name}
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                {product.category || "Tidak Ada"}
                                            </div>
                                        </td>

                                        {/* Deskripsi */}
                                        <td className="px-6 py-4 max-w-xs">
                                            <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                                                {product.description || "Deskripsi kosong"}
                                            </p>
                                        </td>

                                        {/* Harga */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600 dark:text-green-400">
                                            {new Intl.NumberFormat('id-ID', {
                                                style: 'currency',
                                                currency: 'IDR',
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            }).format(product.price)}
                                        </td>

                                        {/* Stok */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            {product.stock}
                                        </td>

                                        {/* Aksi */}
                                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                            <div className="flex justify-center space-x-2">
                                                <Link
                                                    href={`/products/${product.id}/edit`}
                                                    className="p-2 text-blue-600 rounded-full hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900/50 transition duration-150"
                                                    title="Edit Produk"
                                                >
                                                    <Edit2 className="size-4" />
                                                </Link>

                                                <button
                                                    onClick={() => handleDelete(product.id, product.name)}
                                                    disabled={deleting === product.id}
                                                    className="p-2 text-red-600 rounded-full hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/50 transition duration-150 disabled:opacity-50"
                                                    title="Hapus Produk"
                                                >
                                                    {deleting === product.id ? (
                                                        <span className="text-xs">...</span>
                                                    ) : (
                                                        <Trash2 className="size-4" />
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="p-10 text-center text-gray-500 dark:text-gray-400">
                            <PlaceholderPattern className="mx-auto mb-4 h-16 w-16 stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                            <p className="text-lg font-medium">Belum ada produk</p>
                            <p className="text-sm">Tambahkan produk baru untuk ditampilkan di sini.</p>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
