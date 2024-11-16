<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Groups extends Model
{
    use HasFactory;
    public function members(){
        $members = $this->hasMany(GroupMembers::class,"group_id","id")->get();
        $customers = [];
        foreach ($members as $member){
            $customers[] = Customer::find($member->customer_id);
        }
        return $customers;
    }

    public function deleteAllMembers()
    {
        return GroupMembers::where("group_id",$this->id)->delete();
    }
    public function unmembers(){
        $members = $this->hasMany(GroupMembers::class,"group_id","id")->get("customer_id");
        $members = $members->toArray();
        $members = array_column($members,"customer_id");
        $unmembers = Customer::whereNotIn("id",$members)->get();
        return $unmembers;
    }
    public function addMember($customer_id){
        $groupMember = new GroupMembers();
        $groupMember->group_id = $this->id;
        $groupMember->customer_id = $customer_id;
        return $groupMember->save();
    }
    public function countMembers()
    {
        return GroupMembers::where("group_id",$this->id)->count();
    }
    public function removeMember($customer_id){
        $groupMember = GroupMembers::where("group_id",$this->id)->where("customer_id",$customer_id)->first();
        return $groupMember->delete();
    }

    public static function getGroup($groupId)
    {
        $group = self::find($groupId);
        if($group) $group->members = $group->members();
        return $group;
   }

    public static function getAllGroups()
    {
        $groups = self::all();
        foreach ($groups as $group){
            $group->membersCount = $group->countMembers();
        }
        return $groups;
   }
}
