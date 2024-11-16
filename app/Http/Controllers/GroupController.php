<?php

namespace App\Http\Controllers;

use App\Models\Groups;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GroupController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Group/Index', [
            'groupsAll' => Groups::getAllGroups()
        ]);
    }


    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Group/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $name = $request->input('name');
        $customers = explode(',', $request->input('customers'));
        if (Groups::where('name', $name)->first()) {
            return response()->json([
                'message' => 'Bu isimde bir grup zaten mevcut',
                'status' => false
            ]);
        } else {
            $group = new Groups();
            $group->name = $name;
            if ($group->save()) {
                foreach ($customers as $customer) {
                    if (!$group->addMember($customer)) {
                        $group->delete();
                    }
                }
                return response()->json([
                    'message' => 'Grup başarıyla oluşturuldu',
                    'status' => true
                ]);
            } else {
                return response()->json([
                    'message' => 'Grup oluşturulurken bir hata oluştu',
                    'status' => false
                ]);
            }

        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $group = Groups::getGroup($id);
        if (!$group) {
            return redirect()->route('groups.index');
        }
        return Inertia::render('Group/Show', [
            'group' => $group
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $group = Groups::getGroup($id);
        if (!$group) {
            return redirect()->route('groups.index');
        }
        return Inertia::render('Group/Edit', [
            'groupEdit' => $group
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $group = Groups::find($id);
        if ($group) {
            $name = $request->input('name');
            $customers = explode(',', $request->input('customers'));
            $group->name = $name;
            if ($group->save()) {
                $group->deleteAllMembers();
                foreach ($customers as $customer) {
                    if (!$group->addMember($customer)) {
                        $group->delete();
                    }
                }
                return response()->json([
                    'message' => 'Grup başarıyla güncellendi',
                    'status' => true,
                    'group' => Groups::getGroup($group->id)
                ]);
            } else {
                return response()->json([
                    'message' => 'Grup güncellenirken bir hata oluştu',
                    'status' => false
                ]);
            }
        } else {
            return response()->json([
                'message' => 'Grup bulunamadı',
                'status' => false
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $group = Groups::find($id);
        if ($group) {
            if ($group->delete()) {
                return response()->json([
                    'message' => 'Grup başarıyla silindi',
                    'status' => true
                ]);
            } else {
                return response()->json([
                    'message' => 'Grup silinirken bir hata oluştu',
                    'status' => false
                ]);
            }
        } else {
            return response()->json([
                'message' => 'Grup bulunamadı',
                'status' => false
            ]);
        }
    }

    public function sendMessage($id)
    {
        $group = Groups::getGroup($id);
        return response()->json([
            'message' => 'SMS Özelliği şu an aktif değil',
            'status' => false
        ]);
        if (!$group) {
            return response()->json([
                'message' => 'Grup bulunamadı',
                'status' => false
            ]);
        } else {
            $message = request()->input('message');
            $customers = $group->members();
            $phones = [];
            foreach ($customers as $customer) {
                $phones[] = $customer->phone;
            }
            $sms = \App\Services\VatanSmsService::sendSms($phones, $message);
            return response()->json(["message" => "Mesaj Gönderildi", "status" => true, "sms" => $sms]);
        }
    }
}
