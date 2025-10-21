"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import AppLayout from "@/layouts/app-layout";
import { Head, useForm } from "@inertiajs/react";
import type { BreadcrumbItem, Product } from "@/types";
import { Image as ImageIcon, Save, Loader2 } from "lucide-react";

interface Props {
    product: Product;
}

export default function ProductEdit({ product }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: "Dashboard", href: "/dashboard" },
        { title: "Products", href: "/products" },
        { title: `Edit: ${product.name}`, href: `/products/${product.id}/edit` },
    ];

    const { data, setData, put, errors, processing } = useForm({
        name: product.name || "",
        description: product.description || "",
        category: product.category || "",
        price: String(product.price || ""),
        stock: String(product.stock || ""),
        image: null as File | null,
    });

    const [preview, setPreview] = useState<string | null>(
        product.image ? `/storage/${product.image}` : null
    );

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setData("image", file);
        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        put(`/products/${product.id}`, {
            onSuccess: () => {
                // reset preview (optional)
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Produk - ${product.name}`} />

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2 lg:px-4">
                    <Save className="size-6 text-blue-600" />
                    Edit Produk
                </h1>
            </div>

            <div className="p-8 border border-gray-200 dark:border-gray-700 dark:bg-dark-card">
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">

                    {/* Nama & Kategori */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormInput
                            id="name"
                            label="Nama Produk"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            error={errors.name}
                        />
                        <FormInput
                            id="category"
                            label="Kategori"
                            value={data.category}
                            onChange={(e) => setData("category", e.target.value)}
                            error={errors.category}
                        />
                    </div>

                    {/* Deskripsi */}
                    <FormTextarea
                        id="description"
                        label="Deskripsi Produk"
                        value={data.description}
                        onChange={(e) => setData("description", e.target.value)}
                        error={errors.description}
                    />

                    {/* Harga & Stok */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormInput
                            id="price"
                            label="Harga (Rp)"
                            type="number"
                            value={data.price}
                            onChange={(e) => setData("price", e.target.value)}
                            error={errors.price}
                            min="0"
                        />
                        <FormInput
                            id="stock"
                            label="Stok"
                            type="number"
                            value={data.stock}
                            onChange={(e) => setData("stock", e.target.value)}
                            error={errors.stock}
                            min="0"
                        />
                    </div>

                    {/* Gambar Produk */}
                    <div>
                        <label
                            htmlFor="image-upload"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                            Gambar Produk
                        </label>
                        <div className="flex items-start gap-4">
                            <div className="relative size-32 border-2 border-dashed rounded-lg flex items-center justify-center p-2 cursor-pointer transition duration-150 hover:border-blue-500 dark:border-gray-600 dark:hover:border-blue-400">
                                {preview ? (
                                    <>
                                        <img
                                            src={preview}
                                            alt="Preview"
                                            className="h-full w-full object-cover rounded-md"
                                        />
                                        <div
                                            onClick={() => {
                                                setPreview(null);
                                                setData("image", null);
                                            }}
                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full size-6 flex items-center justify-center text-xs cursor-pointer hover:bg-red-600"
                                            title="Hapus Gambar"
                                        >
                                            &times;
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center text-gray-500 dark:text-gray-400">
                                        <ImageIcon className="mx-auto size-6" />
                                        <p className="text-xs mt-1">
                                            Pilih atau Seret Gambar Baru
                                        </p>
                                    </div>
                                )}
                                <input
                                    id="image-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                            </div>
                        </div>
                        {errors.image && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.image}
                            </p>
                        )}
                    </div>

                    {/* Tombol Simpan */}
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                        <button
                            type="submit"
                            disabled={processing}
                            className={`flex items-center justify-center gap-2 rounded-lg ${processing
                                    ? "bg-blue-400 cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-700"
                                } text-white px-6 py-2.5 font-semibold shadow-md transition duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-dark-bg`}
                        >
                            {processing && (
                                <Loader2 className="size-5 animate-spin" />
                            )}
                            {processing ? "Menyimpan..." : "Simpan Perubahan"}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}

// Reuse komponen form dari create
const FormInput = ({
    label,
    id,
    type = "text",
    value,
    onChange,
    error,
    placeholder,
    min,
}: {
    label: string;
    id: string;
    type?: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    error?: string;
    placeholder?: string;
    min?: string;
}) => (
    <div>
        <label
            htmlFor={id}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
            {label}
        </label>
        <input
            id={id}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            min={min}
            className={`w-full rounded-lg border ${error ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                } bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-2.5 transition duration-150 focus:border-blue-500 focus:ring-blue-500 dark:focus:border-blue-400 dark:focus:ring-blue-400`}
        />
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
);

const FormTextarea = ({
    label,
    id,
    value,
    onChange,
    error,
    placeholder,
}: {
    label: string;
    id: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
    error?: string;
    placeholder?: string;
}) => (
    <div>
        <label
            htmlFor={id}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
            {label}
        </label>
        <textarea
            id={id}
            rows={4}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`w-full rounded-lg border ${error ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                } bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-2.5 transition duration-150 focus:border-blue-500 focus:ring-blue-500 dark:focus:border-blue-400 dark:focus:ring-blue-400`}
        />
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
);
