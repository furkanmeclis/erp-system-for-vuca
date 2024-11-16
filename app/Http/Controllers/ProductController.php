<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Products/Index', [
            'categories' => Category::all()
        ]);
    }

    public function katalog()
    {
        return Inertia::render('Products/Katalog', [
            "defaultImage" => asset("uploads/images/default.png"),
            'categories' => Category::all()

        ]);
    }

    public function updateOrder(): \Illuminate\Http\JsonResponse
    {
        $data = request()->input('data');
        $data = json_decode($data, true);

        $batchUpdate = [];
        foreach ($data as $value) {
            $batchUpdate[] = [
                'id' => $value['id'],
                'order' => $value['sort']
            ];
        }
        $error = false;
        foreach ($batchUpdate as $value) {
            $product = Product::find($value['id']);
            $product->order = $value['order'];
            if (!$product->save()) {
                $error = true;
            }
        }
        if ($error === false) {
            return response()->json(['status' => true, 'message' => 'Sıra Güncellendi', "products" => Product::getAllProducts()]);
        } else {
            return response()->json(['status' => false, 'message' => 'Sıra Güncellenemedi']);
        }
    }

    public function updateIsActive($id): \Illuminate\Http\JsonResponse
    {
        $product = Product::find($id);
        $isActive = \request()->input('is_active');
        if ($product) {
            $product->is_active = $isActive;
            if ($product->save()) {
                return response()->json(['status' => true, 'message' => 'Ürün Durumu Güncellendi']);
            } else {
                return response()->json(['status' => false, 'message' => 'Ürün Durumu Güncellenemedi']);
            }
        } else {
            return response()->json(['status' => false, 'message' => 'Ürün Bulunamadı']);
        }
    }

    public function getImages($id): \Illuminate\Http\JsonResponse
    {
        $product = Product::where('id', $id)->orWhere("sku", $id)->first();
        if ($product) {
            return response()->json(['status' => true, 'media' => $product->getImages()]);
        } else {
            return response()->json(['status' => false, 'message' => 'Ürün Bulunamadı']);
        }
    }

    public function uploadImages($id): \Illuminate\Http\JsonResponse
    {
        $product = Product::find($id);
        if ($product) {
            if (\request()->has("images")) {
                $files = \request()->file("images");
                if ($product->addImages($files)) {
                    return response()->json(['status' => true, 'message' => 'Resimler Yüklendi']);
                } else {
                    return response()->json(['status' => false, 'message' => 'Resimler Yüklenemedi']);
                }
            } else {
                return response()->json(['status' => false, 'message' => 'Resimler Bulunamadı']);
            }
        } else {
            return response()->json(['status' => false, 'message' => 'Ürün Bulunamadı']);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): \Illuminate\Http\JsonResponse
    {
        $name = $request->input('name');
        $sku = $request->input('sku');
        $price = $request->input('price');
        $is_tl = $request->input('is_tl');
        $category = $request->input('category');
        $order = $request->has("order") ? $request->input('order') : false;
        $is_active = $request->input('is_active');
        $is_new = $request->input('is_new');
        $is_discount = $request->input('is_discount');
        $images = $request->has("images") ? $request->file("images") : false;
        $controlSku = Product::where('sku', $sku)->first();
        if ($controlSku) {
            return response()->json([
                'status' => false,
                'message' => 'Ürün Kodu Kullanılmaktadır'
            ]);
        } else {
            $product = new Product();
            $product->name = $name;
            $product->sku = $sku;
            $product->price = $price;
            $product->is_tl = $is_tl;
            $product->category = $category;
            if ($order) {
                $product->order = $order;
            } else {
                $product->order = Product::where('id', '>', 0)->count() + 1;
            }
            $product->is_active = $is_active;
            $product->is_new = $is_new;
            $product->is_discount = $is_discount;
            if ($product->save()) {
                if ($images) {
                    if ($product->addImages($images)) {
                        return response()->json([
                            'status' => true,
                            'message' => 'Ürün Kaydedildi',
                            "products" => Product::getAllProducts()
                        ]);
                    } else {
                        return response()->json([
                            'status' => true,
                            'message' => 'Ürün Kaydedildi Resimler Eklenemedi',
                            "products" => Product::getAllProducts()
                        ]);
                    }
                } else {
                    return response()->json([
                        'status' => false,
                        'message' => 'Ürün Kaydedilemedi'
                    ]);
                }
            }
        }
    }

    public
    function storeCategory(): \Illuminate\Http\JsonResponse
    {
        $category = new Category();
        $category->name = \request()->input('name');
        $category->slug = Str::slug($category->name);
        if ($category->save()) {
            return response()->json(['status' => true, 'message' => 'Kategori Eklendi', "categories" => Category::all()]);
        } else {
            return response()->json(['status' => false, 'message' => 'Kategori Eklenemedi']);
        }
    }

    public
    function updateCategory($id): \Illuminate\Http\JsonResponse
    {
        $category = Category::find($id);
        if ($category) {
            $category->name = \request()->input('name');
            $category->slug = Str::slug($category->name);
            if ($category->save()) {
                return response()->json(['status' => true, 'message' => 'Kategori Güncellendi', "categories" => Category::all()]);
            } else {
                return response()->json(['status' => false, 'message' => 'Kategori Güncellenemedi']);
            }
        } else {
            return response()->json(['status' => false, 'message' => 'Kategori Bulunamadı']);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public
    function update(Request $request, string $id): \Illuminate\Http\JsonResponse
    {
        $product = Product::find($id);
        if ($product) {
            //control sku unique
            $controlSku = Product::where('sku', $request->input('sku'))->where('id', '!=', $id)->first();
            if ($controlSku) {
                return response()->json([
                    'status' => false,
                    'message' => 'Ürün Kodu Kullanılmaktadır'
                ]);
            }
            if ($product->sku != $request->input('sku')) {
                $oldPath = public_path('uploads/images/' . $product->sku);
                $newPath = public_path('uploads/images/' . $request->input('sku'));
                if (file_exists($oldPath)) {
                    rename($oldPath, $newPath);
                }
            }
            $product->name = $request->input('name');
            $product->sku = $request->input('sku');
            $product->price = $request->input('price');
            $product->order = $request->input('order');
            $product->is_tl = $request->input('is_tl');
            $product->category = $request->input('category');
            $product->is_active = $request->input('is_active');
            $product->is_new = $request->input('is_new');
            $product->is_discount = $request->input('is_discount');
            if ($product->save()) {
                return response()->json(['status' => true, 'message' => 'Ürün Güncellendi', "products" => Product::getAllProducts()]);
            } else {
                return response()->json(['status' => false, 'message' => 'Ürün Güncellenemedi']);
            }

        } else {
            return response()->json(['status' => false, 'message' => 'Ürün Bulunamadı']);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public
    function destroy(string $id): \Illuminate\Http\JsonResponse
    {
        $product = Product::find($id);
        if ($product) {
            if ($product->delete()) {
                if ($product->deleteImages()) {
                    return response()->json(['status' => true, 'message' => 'Ürün Silindi', "products" => Product::getAllProducts()]);
                } else {
                    return response()->json(['status' => false, 'message' => 'Ürün Silindi Resimler Silinemedi', "products" => Product::getAllProducts()]);
                }
            } else {
                return response()->json(['status' => false, 'message' => 'Ürün Silinemedi']);
            }
        } else {
            return response()->json(['status' => false, 'message' => 'Ürün Bulunamadı']);
        }
    }

    public
    function deleteImage($id, $fileName): \Illuminate\Http\JsonResponse
    {
        $product = Product::find($id);
        if ($product) {
            if ($product->deleteImage($fileName)) {
                return response()->json(['status' => true, 'message' => 'Resim Silindi']);
            } else {
                return response()->json(['status' => false, 'message' => 'Resim Silinemedi']);
            }
        } else {
            return response()->json(['status' => false, 'message' => 'Ürün Bulunamadı']);
        }
    }

    public
    function destroyCategory($id): \Illuminate\Http\JsonResponse
    {
        $category = Category::find($id);
        if ($category) {
            if ($category->delete()) {
                return response()->json(['status' => true, 'message' => 'Kategori Silindi', "categories" => Category::all()]);
            } else {
                return response()->json(['status' => false, 'message' => 'Kategori Silinemedi']);
            }
        } else {
            return response()->json(['status' => false, 'message' => 'Kategori Bulunamadı']);
        }
    }
}
