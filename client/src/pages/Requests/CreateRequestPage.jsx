import React from 'react';
import { ArrowLeft, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCreateRequestPage } from './hooks/useCreateRequestPage';

// Subcomponents
import PatientDetailsSection from './components/create/PatientDetailsSection';
import HospitalInformationSection from './components/create/HospitalInformationSection';
import UrgencySection from './components/create/UrgencySection';
import DocumentUploadSection from './components/create/DocumentUploadSection';
import CreateRequestSidebar from './components/create/CreateRequestSidebar';
import RequesterContactModal from './components/RequesterContactModal';

export const CreateRequestPage = () => {
  const {
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
  } = useCreateRequestPage();

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* 1. Header & Navigation */}
      <div>
        <Link
          to="/requests"
          className="inline-flex items-center gap-1.5 text-xs font-black text-stone-500 hover:text-stone-900 transition-colors mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to My Requests</span>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#1c1d22] tracking-tight">
              Create a Blood Request
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 font-medium mt-0.5">
              Share the details and let our verified donor community help.
            </p>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-100/90 text-[#d93829] text-xs font-black self-start sm:self-auto">
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            <span>Help Brings Hope</span>
          </div>
        </div>
      </div>

      {formError && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-800">
          {formError}
        </div>
      )}

      {/* 2. Main Form & Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
          {/* Step 1: Patient Details */}
          <PatientDetailsSection
            bloodGroup={formData.patientBloodGroup}
            onBloodGroupChange={(bg) =>
              setFormData((prev) => ({ ...prev, patientBloodGroup: bg }))
            }
            unitsNeeded={formData.unitsNeeded}
            onUnitsChange={handleUnitsChange}
          />

          {/* Step 2: Hospital Information */}
          <HospitalInformationSection
            selectedHospital={selectedHospital}
            onSelectHospital={handleSelectHospital}
            defaultCity={currentUser?.location?.city || ''}
          />

          {/* Step 3: Urgency & Needed By */}
          <UrgencySection
            urgency={formData.urgency}
            onUrgencyChange={(urg) =>
              setFormData((prev) => ({ ...prev, urgency: urg }))
            }
            neededBy={formData.neededBy}
            onNeededByChange={(val) =>
              setFormData((prev) => ({ ...prev, neededBy: val }))
            }
            patientCondition={formData.patientCondition}
            onConditionChange={(val) =>
              setFormData((prev) => ({ ...prev, patientCondition: val }))
            }
          />

          {/* Step 4: Supporting Document Upload */}
          <DocumentUploadSection
            uploadedFileName={uploadedFileName}
            onFileUpload={handleFileUpload}
          />

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={
                isSubmitting ||
                !selectedHospital ||
                !formData.patientBloodGroup ||
                !formData.neededBy ||
                !formData.hospitalDocument
              }
              className="w-full clay-btn-crimson py-3.5 sm:py-4 text-sm font-black flex items-center justify-center gap-2 shadow-xl cursor-pointer disabled:opacity-75"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>Broadcasting Request...</span>
                </>
              ) : (
                <>
                  <span>Create Request</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Sidebar */}
        <CreateRequestSidebar />
      </div>

      {/* Pre-Flight Contact Modal */}
      <RequesterContactModal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
        currentUser={currentUser}
        onSuccess={(updatedUser) => updateUser(updatedUser)}
      />
    </div>
  );
};

export default CreateRequestPage;
