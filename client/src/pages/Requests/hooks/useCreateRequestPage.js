import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useBloodRequests } from '../../../context/BloodRequestContext';

export const useCreateRequestPage = () => {
  const { currentUser, updateUser } = useAuth();
  const { createRequest } = useBloodRequests();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    patientBloodGroup: '',
    unitsNeeded: 2,
    hospitalId: '',
    urgency: 'NORMAL',
    neededBy: '',
    patientCondition: '',
    hospitalDocument: '',
  });

  const [selectedHospital, setSelectedHospital] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [formError, setFormError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

  // Check contact completeness
  const cleanPhone = (currentUser?.phone || '').replace(/\D/g, '').slice(-10);
  const isPhoneValid = cleanPhone.length === 10 && /^[6-9]/.test(cleanPhone);
  const isNameValid = Boolean(currentUser?.name && currentUser.name.trim().length >= 2);
  const isEmailValid = Boolean(currentUser?.email && currentUser?.emailVerified);
  const isContactInfoComplete = isNameValid && isPhoneValid && isEmailValid;

  useEffect(() => {
    if (currentUser && !isContactInfoComplete) {
      setShowContactModal(true);
    }
  }, [currentUser, isContactInfoComplete]);

  const handleUnitsChange = (delta) => {
    setFormData((prev) => ({
      ...prev,
      unitsNeeded: Math.max(1, Math.min(10, prev.unitsNeeded + delta)),
    }));
  };

  const handleSelectHospital = (hosp) => {
    setSelectedHospital(hosp);
    setFormData((prev) => ({ ...prev, hospitalId: hosp ? hosp._id : '' }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowed = ['application/pdf', 'image/jpeg', 'image/png'];
      if (!allowed.includes(file.type)) {
        setFormError('Only PDF, JPG, and PNG are allowed');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setFormError('File size must be under 5MB');
        return;
      }
      setFormError(null);
      setUploadedFileName(file.name);
      setFormData((prev) => ({ ...prev, hospitalDocument: file }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isContactInfoComplete) {
      setShowContactModal(true);
      return;
    }
    if (
      !selectedHospital ||
      !formData.patientBloodGroup ||
      !formData.neededBy ||
      !formData.hospitalDocument
    ) {
      setFormError('Please fill all required fields including the supporting document.');
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    try {
      const created = await createRequest({
        ...formData,
        hospitalId: selectedHospital._id,
      });
      setIsSubmitting(false);
      navigate(`/requests/${created._id}`);
    } catch (err) {
      console.error(err);
      setFormError(err.response?.data?.message || 'Failed to create request');
      setIsSubmitting(false);
    }
  };

  return {
    currentUser,
    updateUser,
    formData,
    setFormData,
    selectedHospital,
    uploadedFileName,
    formError,
    isSubmitting,
    showContactModal,
    setShowContactModal,
    handleUnitsChange,
    handleSelectHospital,
    handleFileUpload,
    handleSubmit,
  };
};

export default useCreateRequestPage;
