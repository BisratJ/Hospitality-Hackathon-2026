import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "https://alx-hackathon-api.bisrojc60.workers.dev";

const Registration = () => {
  const [registrationType, setRegistrationType] = useState("team");
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    alxAffiliation: "",
    teamName: "",
    strengths: "",
    roleType: "",
    teamMembers: [{ fullName: "", email: "", phoneNumber: "", roleType: "" }],
  });

  const [status, setStatus] = useState({
    type: "",
    message: "",
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Clear field errors when form data changes
  useEffect(() => {
    setFieldErrors((prev) => Object.keys(prev).length > 0 ? {} : prev);
  }, [formData]);

  const handleRegistrationTypeChange = (type) => {
    setRegistrationType(type);
    // Reset form data when switching registration type
    setFormData({
      fullName: "",
      phoneNumber: "",
      email: "",
      alxAffiliation: "",
      teamName: "",
      strengths: "",
      roleType: "",
      teamMembers: [{ fullName: "", email: "", phoneNumber: "", roleType: "" }],
    });
    setStatus({ type: "", message: "" });
    setFieldErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // Clear error status when user starts typing
    if (status.type === "error") {
      setStatus({ type: "", message: "" });
    }

    // Clear field error for this specific field
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleTeamMemberChange = (index, e) => {
    const { name, value } = e.target;
    const updatedTeamMembers = [...formData.teamMembers];
    updatedTeamMembers[index] = {
      ...updatedTeamMembers[index],
      [name]: value,
    };
    setFormData((prevState) => ({
      ...prevState,
      teamMembers: updatedTeamMembers,
    }));

    // Clear team member field errors
    const fieldKey = `teamMember-${index}-${name}`;
    if (fieldErrors[fieldKey]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldKey];
        return newErrors;
      });
    }
  };

  const addTeamMember = () => {
    if (formData.teamMembers.length < 4) {
      setFormData((prevState) => ({
        ...prevState,
        teamMembers: [...prevState.teamMembers, { fullName: "", email: "", phoneNumber: "", roleType: "" }],
      }));
    } else {
      setStatus({
        type: "error",
        message: "Maximum of 5 team members allowed (including team lead)",
      });
    }
  };

  const removeTeamMember = (index) => {
    const updatedTeamMembers = [...formData.teamMembers];
    updatedTeamMembers.splice(index, 1);
    setFormData((prevState) => ({
      ...prevState,
      teamMembers: updatedTeamMembers,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
      isValid = false;
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
      isValid = false;
    }

    if (!formData.alxAffiliation) {
      newErrors.alxAffiliation = "ALX Affiliation is required";
      isValid = false;
    }

    if (!formData.strengths.trim()) {
      newErrors.strengths = "Strengths/Background is required";
      isValid = false;
    }

    if (!formData.roleType) {
      newErrors.roleType = "Role Type is required";
      isValid = false;
    }

    if (registrationType === "team") {
      if (!formData.teamName.trim()) {
        newErrors.teamName = "Team name is required";
        isValid = false;
      }

      formData.teamMembers.forEach((member, index) => {
        if (index > 0) {
          if (!member.fullName.trim()) {
            newErrors[`teamMember-${index}-fullName`] = "Team member name is required";
            isValid = false;
          }

          if (!member.email.trim()) {
            newErrors[`teamMember-${index}-email`] = "Team member email is required";
            isValid = false;
          } else if (!/\S+@\S+\.\S+/.test(member.email)) {
            newErrors[`teamMember-${index}-email`] = "Team member email is invalid";
            isValid = false;
          }

          if (!member.phoneNumber.trim()) {
            newErrors[`teamMember-${index}-phoneNumber`] = "Team member phone is required";
            isValid = false;
          }

          if (!member.roleType) {
            newErrors[`teamMember-${index}-roleType`] = "Team member role is required";
            isValid = false;
          }
        }
      });
    }

    setFieldErrors(newErrors);
    return isValid;
  };

  const checkForDuplicateEmails = () => {
    // Check if any team member emails are duplicates of the team lead email
    if (registrationType === "team") {
      const leadEmail = formData.email.toLowerCase().trim();
      const duplicateIndex = formData.teamMembers.findIndex(
        (member, index) => index > 0 && member.email.toLowerCase().trim() === leadEmail,
      );

      if (duplicateIndex > 0) {
        setStatus({
          type: "error",
          message: `Team member #${duplicateIndex} has the same email as the team lead. Each participant needs a unique email.`,
        });
        setFieldErrors((prev) => ({
          ...prev,
          [`teamMember-${duplicateIndex}-email`]: "Duplicate email",
        }));
        return false;
      }

      // Check for duplicate emails among team members
      const emails = new Map();
      for (let i = 1; i < formData.teamMembers.length; i++) {
        const email = formData.teamMembers[i].email.toLowerCase().trim();
        if (email && emails.has(email)) {
          const duplicateIndex = emails.get(email);
          setStatus({
            type: "error",
            message: `Team members #${duplicateIndex} and #${i} have the same email. Each participant needs a unique email.`,
          });
          setFieldErrors((prev) => ({
            ...prev,
            [`teamMember-${i}-email`]: "Duplicate email",
          }));
          return false;
        }
        emails.set(email, i);
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset previous errors
    setFieldErrors({});
    setStatus({ type: "", message: "" });

    if (!validateForm()) {
      setStatus({
        type: "error",
        message: "Please fill in all required fields correctly",
      });
      return;
    }

    // Check for duplicate emails within the team
    if (!checkForDuplicateEmails()) {
      return;
    }

    try {
      setIsSubmitting(true); // Set loading state to true
      setStatus({
        type: "loading",
        message: "Processing your registration...",
      });

      const response = await fetch(`${API_URL}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          registrationType,
          teamMembers: registrationType === "team" ? formData.teamMembers : [],
        }),
      });

      let data;
      try {
        data = await response.json();
      } catch (e) {
        // Handle case where response isn't JSON
        data = { message: "Invalid server response" };
      }

      console.log("API Response:", response.status, data);

      if (response.ok) {
        setShowSuccess(true);
        setFormData({
          fullName: "",
          phoneNumber: "",
          email: "",
          alxAffiliation: "",
          teamName: "",
          strengths: "",
          roleType: "",
          teamMembers: [{ fullName: "", email: "", phoneNumber: "", roleType: "" }],
        });
      } else {
        // Check for different types of errors
        let errorMessage = "Registration failed. ";

        if (data.error) {
          errorMessage = data.error;
          if (data.details) {
            errorMessage = data.details;
          }
          
          // Set specific field error
          if (errorMessage.includes("team member")) {
            setFieldErrors((prev) => ({
              ...prev,
              email: "Already registered as team member"
            }));
          } else {
            setFieldErrors((prev) => ({
              ...prev,
              email: "Email already registered"
            }));
          }
        } else if (response.status === 400) {
          errorMessage += "Please check your information and try again.";
        } else if (response.status === 429) {
          errorMessage = "Too many registration attempts. Please try again later.";
        } else {
          errorMessage += "An unexpected error occurred. Please try again later.";
        }

        setStatus({
          type: "error",
          message: errorMessage,
        });
      }
    } catch (error) {
      console.error("Registration error:", error);
      setStatus({
        type: "error",
        message: "Network error. Please check your connection and try again.",
      });
    } finally {
      setIsSubmitting(false); // Set loading state to false
    }
  };

  if (showSuccess) {
    return (
      <div
        className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 -mt-[56px] pt-[56px] nav:-mt-[72px] nav:pt-[72px] relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #0a0a0a 0%, #171717 35%, #1a1a1a 70%, #111111 100%)"
        }}
      >
        {/* Decorative cross-pattern overlay */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
        {/* Red radial glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.06]" style={{ background: "radial-gradient(circle, #DC2626 0%, transparent 70%)" }} />
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
          <div
            className="rounded-2xl border border-black/[0.06] bg-white/60 shadow-sm backdrop-blur-sm py-8 px-4 sm:px-10 text-center"
          >
            <div className="mb-6">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full" style={{ backgroundColor: "#DC2626" }}>
                <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">Registration Successful!</h2>
            <p className="text-neutral-600 mb-8">
              {registrationType === "team"
                ? "Thank you for registering your team for the ALX Hackathon! You and your team members will receive confirmation emails with QR codes shortly."
                : "Thank you for registering for the ALX Hackathon! You will receive a confirmation email with your QR code shortly."}
            </p>
            <div className="space-y-4">
              <button
                onClick={() => navigate("/")}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white transition-all duration-200 transform hover:scale-[1.02]"
                style={{
                  background: "linear-gradient(135deg, #DC2626 0%, #B91C1C 50%, #991B1B 100%)",
                  boxShadow: "0 4px 14px rgba(220, 38, 38, 0.35)"
                }}
              >
                Return to Home
              </button>
              <button
                onClick={() => {
                  setShowSuccess(false);
                  setRegistrationType("individual");
                }}
                className="w-full flex justify-center py-2 px-4 border border-neutral-300 rounded-lg shadow-sm text-sm font-medium text-neutral-700 bg-white/80 hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200"
                style={{
                  borderColor: "#DC2626",
                  color: "#DC2626"
                }}
              >
                Register Another Participant
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 -mt-[56px] pt-[56px] nav:-mt-[72px] nav:pt-[72px] relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #0a0a0a 0%, #171717 35%, #1a1a1a 70%, #111111 100%)"
      }}
    >
      {/* Decorative cross-pattern overlay */}
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }}></div>
      {/* Red radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.06]" style={{ background: "radial-gradient(circle, #DC2626 0%, transparent 70%)" }} />
      <div className="pt-10 sm:pt-14 lg:pt-16 relative z-10" />
      <div
        className="max-w-3xl mx-auto rounded-2xl border border-white/10 shadow-xl p-8 sm:p-10 relative z-10"
        style={{
          background: "rgba(255, 255, 255, 0.08)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          boxShadow: "0 0 0 0.5px rgba(255,255,255,0.08), 0 8px 40px rgba(0,0,0,0.4)"
        }}
      >
        <h2 className="text-3xl font-bold text-center text-white mb-2">Register for Hospitality Hackathon 2026</h2>
        <p className="text-center text-neutral-400 mb-8 text-sm">Teams must have exactly 5 members (Team Lead + 4 members).</p>

        <div className="mb-8">
          <div className="flex justify-center space-x-4 flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleRegistrationTypeChange("individual")}
              className="px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-[1.02]"
              style={
                registrationType === "individual"
                  ? {
                      background: "linear-gradient(135deg, #DC2626 0%, #B91C1C 50%, #991B1B 100%)",
                      color: "white",
                      boxShadow: "0 4px 14px rgba(220, 38, 38, 0.35)"
                    }
                  : {
                      backgroundColor: "rgba(255, 255, 255, 0.06)",
                      color: "#a3a3a3",
                      border: "1px solid rgba(255, 255, 255, 0.1)"
                    }
              }
            >
              Individual Registration
            </button>
            <button
              type="button"
              onClick={() => handleRegistrationTypeChange("team")}
              className="px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-[1.02]"
              style={
                registrationType === "team"
                  ? {
                      background: "linear-gradient(135deg, #DC2626 0%, #B91C1C 50%, #991B1B 100%)",
                      color: "white",
                      boxShadow: "0 4px 14px rgba(220, 38, 38, 0.35)"
                    }
                  : {
                      backgroundColor: "rgba(255, 255, 255, 0.06)",
                      color: "#a3a3a3",
                      border: "1px solid rgba(255, 255, 255, 0.1)"
                    }
              }
            >
              Team Registration
            </button>
          </div>
        </div>

        {status.message && (
          <div
            className={`mb-6 p-4 rounded-xl border flex items-center gap-3 ${
              status.type === "error"
                ? "bg-red-900/30 text-red-300 border-red-500/30"
                : status.type === "loading"
                  ? "bg-white/5 text-neutral-300 border-white/10"
                  : "bg-white/5 text-neutral-300 border-white/10"
            }`}
          >
            {status.type === "loading" && (
              <svg
                className="animate-spin flex-shrink-0 h-5 w-5"
                style={{ color: "#DC2626" }}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            )}
            {status.type === "error" && (
              <svg
                className="flex-shrink-0 h-5 w-5"
                style={{ color: "#DC2626" }}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            <span className="flex-1">{status.message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 mb-6">
            <h3 className="text-xl font-semibold text-white mb-4">
              {registrationType === "team" ? "Team Lead Information" : "Personal Information"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-neutral-300">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  id="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-lg border transition-colors duration-200 ${
                    fieldErrors.fullName
                      ? "border-red-500/50 bg-red-900/20 text-white focus:ring-red-500 focus:border-red-500"
                      : "border-white/10 bg-white/5 text-white placeholder-neutral-500 focus:ring-red-500 focus:border-red-500"
                  } shadow-sm sm:text-sm p-2.5 hover:border-neutral-400`}
                />
                {fieldErrors.fullName && <p className="mt-1 text-sm font-medium" style={{ color: "#DC2626" }}>{fieldErrors.fullName}</p>}
              </div>

              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-neutral-300">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-lg border transition-colors duration-200 ${
                    fieldErrors.phoneNumber
                      ? "border-red-500/50 bg-red-900/20 text-white focus:ring-red-500 focus:border-red-500"
                      : "border-white/10 bg-white/5 text-white placeholder-neutral-500 focus:ring-red-500 focus:border-red-500"
                  } shadow-sm sm:text-sm p-2.5 hover:border-neutral-400`}
                />
                {fieldErrors.phoneNumber && <p className="mt-1 text-sm font-medium" style={{ color: "#DC2626" }}>{fieldErrors.phoneNumber}</p>}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-neutral-300">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-lg border transition-colors duration-200 ${
                    fieldErrors.email
                      ? "border-red-500/50 bg-red-900/20 text-white focus:ring-red-500 focus:border-red-500"
                      : "border-white/10 bg-white/5 text-white placeholder-neutral-500 focus:ring-red-500 focus:border-red-500"
                  } shadow-sm sm:text-sm p-2.5 hover:border-neutral-400`}
                />
                {fieldErrors.email && <p className="mt-1 text-sm font-medium" style={{ color: "#DC2626" }}>{fieldErrors.email}</p>}
              </div>

              <div>
                <label htmlFor="alxAffiliation" className="block text-sm font-medium text-neutral-300">
                  ALX Affiliation *
                </label>
                <select
                  name="alxAffiliation"
                  id="alxAffiliation"
                  value={formData.alxAffiliation}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-lg border transition-colors duration-200 ${
                    fieldErrors.alxAffiliation
                      ? "border-red-500/50 bg-red-900/20 text-white focus:ring-red-500 focus:border-red-500"
                      : "border-white/10 bg-white/5 text-white placeholder-neutral-500 focus:ring-red-500 focus:border-red-500"
                  } shadow-sm sm:text-sm p-2.5 hover:border-neutral-400`}
                >
                  <option value="">Select your affiliation</option>
                  <option value="Learner">Learner</option>
                  <option value="Graduate">Graduate</option>
                  <option value="Neither">Neither</option>
                </select>
                {fieldErrors.alxAffiliation && (
                  <p className="mt-1 text-sm font-medium" style={{ color: "#DC2626" }}>{fieldErrors.alxAffiliation}</p>
                )}
              </div>

              {registrationType === "team" && (
                <div>
                  <label htmlFor="teamName" className="block text-sm font-medium text-neutral-300">
                    Team Name *
                  </label>
                  <input
                    type="text"
                    name="teamName"
                    id="teamName"
                    value={formData.teamName}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-lg border transition-colors duration-200 ${
                      fieldErrors.teamName
                        ? "border-red-500/50 bg-red-900/20 text-white focus:ring-red-500 focus:border-red-500"
                        : "border-white/10 bg-white/5 text-white placeholder-neutral-500 focus:ring-red-500 focus:border-red-500"
                    } shadow-sm sm:text-sm p-2.5 hover:border-neutral-400`}
                  />
                  {fieldErrors.teamName && <p className="mt-1 text-sm font-medium" style={{ color: "#DC2626" }}>{fieldErrors.teamName}</p>}
                </div>
              )}

              <div>
                <label htmlFor="roleType" className="block text-sm font-medium text-neutral-300">
                  Role Type *
                </label>
                <select
                  name="roleType"
                  id="roleType"
                  value={formData.roleType}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-lg border transition-colors duration-200 ${
                    fieldErrors.roleType
                      ? "border-red-500/50 bg-red-900/20 text-white focus:ring-red-500 focus:border-red-500"
                      : "border-white/10 bg-white/5 text-white placeholder-neutral-500 focus:ring-red-500 focus:border-red-500"
                  } shadow-sm sm:text-sm p-2.5 hover:border-neutral-400`}
                >
                  <option value="">Select your role</option>
                  <option value="Developer">Developer</option>
                  <option value="Creative">Creative</option>
                  <option value="Manager">Manager</option>
                  <option value="Entrepreneur">Entrepreneur</option>
                  <option value="Other">Other</option>
                </select>
                {fieldErrors.roleType && <p className="mt-1 text-sm font-medium" style={{ color: "#DC2626" }}>{fieldErrors.roleType}</p>}
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="strengths" className="block text-sm font-medium text-neutral-300">
                Strengths/Background *
              </label>
              <textarea
                name="strengths"
                id="strengths"
                rows="3"
                value={formData.strengths}
                onChange={handleChange}
                placeholder="Describe your skills, experience, and what you can bring to the hackathon"
                className={`mt-1 block w-full rounded-lg border transition-colors duration-200 ${
                  fieldErrors.strengths
                    ? "border-red-500/50 bg-red-900/20 text-white focus:ring-red-500 focus:border-red-500"
                    : "border-white/10 bg-white/5 text-white placeholder-neutral-500 focus:ring-red-500 focus:border-red-500"
                } shadow-sm sm:text-sm p-2.5 hover:border-neutral-400`}
              />
              {fieldErrors.strengths && <p className="mt-1 text-sm font-medium" style={{ color: "#DC2626" }}>{fieldErrors.strengths}</p>}
            </div>
          </div>

          {registrationType === "team" && (
            <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
                <h3 className="text-xl font-semibold text-white">Team Members (Max 4 Additional Members)</h3>
                <button
                  type="button"
                  onClick={addTeamMember}
                  className="inline-flex items-center px-4 py-2 text-sm leading-4 font-medium rounded-lg text-white border border-transparent transition-all duration-200 transform hover:scale-[1.02]"
                  style={{
                    background: "linear-gradient(135deg, #DC2626 0%, #B91C1C 50%, #991B1B 100%)",
                    boxShadow: "0 4px 14px rgba(220, 38, 38, 0.35)"
                  }}
                >
                  Add Team Member
                </button>
              </div>

              {formData.teamMembers.map((member, index) =>
                index === 0 ? null : (
                  <div key={index} className="mb-6 p-4 border border-white/10 bg-white/5 rounded-xl">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-medium text-neutral-200">Team Member #{index}</h4>
                      <button
                        type="button"
                        onClick={() => removeTeamMember(index)}
                        className="font-medium transition-colors duration-200"
                        style={{ color: "#DC2626" }}
                      >
                        Remove
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor={`member-${index}-name`} className="block text-sm font-medium text-neutral-300">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          id={`member-${index}-name`}
                          value={member.fullName}
                          onChange={(e) => handleTeamMemberChange(index, e)}
                          className={`mt-1 block w-full rounded-lg border transition-colors duration-200 ${
                            fieldErrors[`teamMember-${index}-fullName`]
                              ? "border-red-500/50 bg-red-900/20 text-white focus:ring-red-500 focus:border-red-500"
                              : "border-white/10 bg-white/5 text-white placeholder-neutral-500 focus:ring-red-500 focus:border-red-500"
                          } shadow-sm sm:text-sm p-2.5`}
                        />
                        {fieldErrors[`teamMember-${index}-fullName`] && (
                          <p className="mt-1 text-sm font-medium" style={{ color: "#DC2626" }}>{fieldErrors[`teamMember-${index}-fullName`]}</p>
                        )}
                      </div>
                      <div>
                        <label htmlFor={`member-${index}-email`} className="block text-sm font-medium text-neutral-300">
                          Email *
                        </label>
                        <input
                          type="email"
                          name="email"
                          id={`member-${index}-email`}
                          value={member.email}
                          onChange={(e) => handleTeamMemberChange(index, e)}
                          className={`mt-1 block w-full rounded-lg border transition-colors duration-200 ${
                            fieldErrors[`teamMember-${index}-email`]
                              ? "border-red-500/50 bg-red-900/20 text-white focus:ring-red-500 focus:border-red-500"
                              : "border-white/10 bg-white/5 text-white placeholder-neutral-500 focus:ring-red-500 focus:border-red-500"
                          } shadow-sm sm:text-sm p-2.5`}
                        />
                        {fieldErrors[`teamMember-${index}-email`] && (
                          <p className="mt-1 text-sm font-medium" style={{ color: "#DC2626" }}>{fieldErrors[`teamMember-${index}-email`]}</p>
                        )}
                      </div>
                      <div>
                        <label htmlFor={`member-${index}-phone`} className="block text-sm font-medium text-neutral-300">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          name="phoneNumber"
                          id={`member-${index}-phone`}
                          value={member.phoneNumber}
                          onChange={(e) => handleTeamMemberChange(index, e)}
                          className={`mt-1 block w-full rounded-lg border transition-colors duration-200 ${
                            fieldErrors[`teamMember-${index}-phoneNumber`]
                              ? "border-red-500/50 bg-red-900/20 text-white focus:ring-red-500 focus:border-red-500"
                              : "border-white/10 bg-white/5 text-white placeholder-neutral-500 focus:ring-red-500 focus:border-red-500"
                          } shadow-sm sm:text-sm p-2.5`}
                        />
                        {fieldErrors[`teamMember-${index}-phoneNumber`] && (
                          <p className="mt-1 text-sm font-medium" style={{ color: "#DC2626" }}>{fieldErrors[`teamMember-${index}-phoneNumber`]}</p>
                        )}
                      </div>
                      <div>
                        <label htmlFor={`member-${index}-role`} className="block text-sm font-medium text-neutral-300">
                          Role *
                        </label>
                        <select
                          name="roleType"
                          id={`member-${index}-role`}
                          value={member.roleType}
                          onChange={(e) => handleTeamMemberChange(index, e)}
                          className={`mt-1 block w-full rounded-lg border transition-colors duration-200 ${
                            fieldErrors[`teamMember-${index}-roleType`]
                              ? "border-red-500/50 bg-red-900/20 text-white focus:ring-red-500 focus:border-red-500"
                              : "border-white/10 bg-white/5 text-white placeholder-neutral-500 focus:ring-red-500 focus:border-red-500"
                          } shadow-sm sm:text-sm p-2.5`}
                        >
                          <option value="">Select role</option>
                          <option value="Developer">Developer</option>
                          <option value="Creative">Creative</option>
                          <option value="Manager">Manager</option>
                          <option value="Entrepreneur">Entrepreneur</option>
                          <option value="Other">Other</option>
                        </select>
                        {fieldErrors[`teamMember-${index}-roleType`] && (
                          <p className="mt-1 text-sm font-medium" style={{ color: "#DC2626" }}>{fieldErrors[`teamMember-${index}-roleType`]}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ),
              )}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-75 disabled:cursor-not-allowed"
              style={{
                background: isSubmitting ? "linear-gradient(135deg, #DC2626 0%, #B91C1C 50%, #991B1B 100%)" : "linear-gradient(135deg, #DC2626 0%, #B91C1C 50%, #991B1B 100%)",
                boxShadow: "0 4px 14px rgba(220, 38, 38, 0.35)"
              }}
            >
              {isSubmitting ? (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : registrationType === "team" ? (
                "Register Team"
              ) : (
                "Register"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Registration;