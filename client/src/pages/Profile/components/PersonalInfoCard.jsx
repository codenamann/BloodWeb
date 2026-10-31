import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { BLOOD_GROUPS } from '../../../utils/compatibility';
import { toast } from '../../../components/ui/toast';
import EditableFieldRow from '../../../components/common/EditableFieldRow';
import ClayDropdown from '../../../components/ui/ClayDropdown';
import ClayEditableInput from '../../../components/ui/ClayEditableInput';
import ClayEditableDropdown from '../../../components/ui/ClayEditableDropdown';
import ClayEditableDisplay from '../../../components/ui/ClayEditableDisplay';

const PersonalInfoCard = ({ onOpenLocationModal }) => {
  const { currentUser, updatePhone, updateBloodGroup, updateDob } = useAuth();

  const [editingField, setEditingField] = useState(null); // 'phone' | 'bloodGroup' | null
  const [phoneInput, setPhoneInput] = useState('');
  const [bloodGroupInput, setBloodGroupInput] = useState('');

  const handleSavePhone = async (newPhone) => {
    try {
      await updatePhone(newPhone.trim());
      toast.success('Phone Updated', 'Your phone number has been updated.');
    } catch (err) {
      toast.error(
        'Update Failed',
        err?.response?.data?.message || 'Could not update phone number'
      );
      throw err;
    }
  };

  const handleSaveBloodGroup = async (newBloodGroup) => {
    try {
      await updateBloodGroup(newBloodGroup);
      toast.success(
        'Blood Group Updated',
        'Your blood group has been updated.'
      );
    } catch (err) {
      toast.error(
        'Update Failed',
        err?.response?.data?.message || 'Could not update blood group'
      );
      throw err;
    }
  };

  const handleSaveDob = async (newDob) => {
    try {
      await updateDob(newDob);
      toast.success(
        'Date of Birth Updated',
        'Your date of birth update request has been processed.'
      );
    } catch (err) {
      toast.error(
        'Update Failed',
        err?.response?.data?.message || 'Could not update date of birth'
      );
      throw err;
    }
  };

  return (
    <div className="clay-card p-6 bg-white/95 space-y-4 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-stone-100">
        <h3 className="text-sm font-black text-stone-900 uppercase tracking-wider">
          Personal Information
        </h3>
      </div>

      <div className="space-y-2.5 divide-y divide-stone-100 text-sm">
        <div className="flex items-center justify-between pt-2">
          <span className="text-stone-500 font-medium text-xs">Full Name:</span>
          <span className="font-black text-stone-900 text-xs">
            {currentUser?.name}
          </span>
        </div>
        <div className="flex items-center justify-between pt-4">
          <span className="text-stone-500 font-medium text-xs">Email:</span>
          <span className="font-bold text-stone-900 text-xs">
            {currentUser?.email}
          </span>
        </div>

        {/* Phone Edit Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 gap-2">
          <span className="text-stone-500 font-medium text-xs w-24">
            Phone:
          </span>
          <div className="flex-1 max-w-sm flex justify-end">
            <ClayEditableInput
              initialValue={currentUser?.phone || ''}
              onSave={handleSavePhone}
              type="tel"
              maxLength={15}
              placeholder="Set phone number"
              className="w-full sm:w-60"
            />
          </div>
        </div>

        {/* Blood Group Edit Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 gap-2">
          <span className="text-stone-500 font-medium text-xs w-24">
            Blood Group:
          </span>
          <div className="flex-1 max-w-sm flex justify-end">
            <ClayEditableDropdown
              initialValue={currentUser?.bloodGroup || ''}
              onSave={handleSaveBloodGroup}
              options={BLOOD_GROUPS}
              placeholder="Set blood group"
              className="w-full sm:w-60"
            />
          </div>
        </div>

        {/* DOB Edit Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 gap-2">
          <div className="flex items-center gap-2 w-32">
            <span className="text-stone-500 font-medium text-xs">
              Date of Birth:
            </span>
            {currentUser?.dobUpdateStatus === 'pending' && (
              <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 text-[9px] font-black uppercase tracking-wider">
                Pending
              </span>
            )}
          </div>
          <div className="flex-1 max-w-sm flex justify-end">
            <ClayEditableInput
              initialValue={
                currentUser?.dob
                  ? new Date(currentUser.dob).toISOString().split('T')[0]
                  : ''
              }
              onSave={handleSaveDob}
              type="date"
              placeholder="Set date of birth"
              className="w-full sm:w-60"
              disabled={currentUser?.dobUpdateStatus === 'pending'}
            />
          </div>
        </div>

        {/* Location Edit Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 gap-2">
          <span className="text-stone-500 font-medium text-xs w-24">
            Location:
          </span>
          <div className="flex-1 max-w-sm flex justify-end">
            <ClayEditableDisplay
              value={
                currentUser?.location?.city
                  ? `${currentUser.location.area || currentUser.location.city}, ${currentUser.location.state}`
                  : ''
              }
              onEdit={onOpenLocationModal}
              placeholder="Set location"
              className="w-full sm:w-60"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoCard;
