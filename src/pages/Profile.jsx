import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProfileRequest,
  logout,
  updateProfileRequest,
  setRole,
} from "../redux/authSlice";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import ImageUpload from "../components/ImageUpload";
import TailorForm from "../components/TailorForm";
import TailorDetails from "../components/TailorDetails";
import FollowersList from "../components/FollowersList";
import FollowingList from "../components/FollowingList";
import { setSelectedUser } from "../redux/socialSlice";
import { FaPlus } from "react-icons/fa";
import { GiClothes } from "react-icons/gi";
import { MdExitToApp } from "react-icons/md";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { profile, loading } = useSelector((state) => state.auth);

  const [profileImage, setProfileImage] = useState(
    () => localStorage.getItem("profileImage") || ""
  );
  const [currentRole, setCurrentRole] = useState(
    localStorage.getItem("role") || "customer"
  );
  const [showTailorConfirm, setShowTailorConfirm] = useState(false);
  const [showTailorForm, setShowTailorForm] = useState(false);
  const [showFollowersId, setShowFollowersId] = useState(null);
  const [showFollowingId, setShowFollowingId] = useState(null);
  const [tailorForm, setTailorForm] = useState({
    experience: "",
    specialization: "",
    fees: "",
    description: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    address: "",
    experience: "",
    specialization: "",
    fees: "",
    description: "",
  });

  const isAdmin = profile?.roles?.includes("admin");

  useEffect(() => {
    dispatch(fetchProfileRequest());
  }, [dispatch]);

  useEffect(() => {
    if (profileImage) localStorage.setItem("profileImage", profileImage);
  }, [profileImage]);

  useEffect(() => {
    dispatch(setSelectedUser(null));
    if (profile) {
      if (!profileImage) setProfileImage(profile.profileImage || "");
      const roles = profile.roles || [];
      const hasTailor = roles.includes("tailor");

      setEditForm({
        name: profile?.name || "",
        email: profile?.email || "",
        address: profile?.address || "",
        experience: profile?.tailorDetails?.experience || "",
        specialization:
          profile?.tailorDetails?.specialization?.join(", ") || "",
        fees: profile?.tailorDetails?.fees || "",
        description: profile?.tailorDetails?.description || "",
      });

      if (hasTailor && profile.tailorDetails) {
        setTailorForm({
          experience: profile.tailorDetails.experience || "",
          specialization:
            profile.tailorDetails.specialization?.join(", ") || "",
          fees: profile.tailorDetails.fees || "",
          description: profile.tailorDetails.description || "",
        });
      }

      localStorage.setItem("user", profile.name || "");
      localStorage.setItem("email", profile.email || "");
      localStorage.setItem("roles", JSON.stringify(roles));
      localStorage.setItem(
        "tailorDetails",
        JSON.stringify(profile.tailorDetails || null)
      );
      localStorage.setItem("profile", JSON.stringify(profile));
    }
  }, [profile]);

  const handleCancel = () => {
  setShowTailorForm(false);
  setTailorForm({
    experience: 0,
    fees: 100,
    specialization: "",
    description: ""
  });
};


const handleLogout = async() => {
    const result = await window.confirm("Are you sure you want to logout?");
  if (result) {
    setTimeout(() => {
      dispatch(logout());
      toast.success("Logged out successfully!");
      localStorage.clear();
      navigate("/login");
    }, 500); 
  }
};


  const handleRoleChange = (e) => {
    const selected = e.target.value;
    if (selected === currentRole) return;

    if (selected === "tailor") {
      if (profile?.roles?.includes("tailor") && profile.tailorDetails) {
        setCurrentRole("tailor");
        localStorage.setItem("role", "tailor");
        dispatch(setRole("tailor"));
        toast.success("Switched to Tailor mode");
      } else {
        setShowTailorConfirm(true);
      }
    } else {
      dispatch(updateProfileRequest({ roles: ["customer"] }));
      setCurrentRole("customer");
      localStorage.setItem("role", "customer");
      dispatch(setRole("customer"));
      toast.success("Switched to Customer mode");
    }
  };

  const handleTailorConfirm = (confirm) => {
    setShowTailorConfirm(false);
    if (confirm) setShowTailorForm(true);
  };

  const handleTailorFormSubmit = (e) => {
    e.preventDefault();
    const { experience, specialization, fees, description } = tailorForm;

    if (experience === "" || !specialization?.trim() || fees === "") {
      toast.error("Experience, Specialization and Fees are required");
      return;
    }

    const tailorDetails = {
      experience: Number(experience),
      specialization: specialization.split(",").map((s) => s.trim()),
      fees: Number(fees),
      description: description?.trim() || "",
    };
    const roles = profile?.roles?.includes("customer")
      ? ["customer", "tailor"]
      : ["tailor"];

    dispatch(updateProfileRequest({ roles, tailorDetails }));
    dispatch(fetchProfileRequest());
    toast.success("Tailor profile submitted!");
    setShowTailorForm(false);
    setCurrentRole("tailor");
    localStorage.setItem("role", "tailor");
    dispatch(setRole("tailor"));
  };

  const handleEditSubmit = () => {
    const payload = {
      name: editForm.name,
      email: editForm.email,
      address: editForm.address,
      profileImage,
      tailorDetails: {
        experience: Number(editForm.experience),
        specialization: editForm.specialization.split(",").map((s) => s.trim()),
        fees: Number(editForm.fees),
        description: editForm.description,
      },
    };
    dispatch(updateProfileRequest(payload));
    dispatch(fetchProfileRequest());
    toast.success("Profile updated!");
    setIsEditing(false);
  };

  if (loading) return <div className="text-center">Loading...</div>;

  return (
    <>
      <div className="flex items-center justify-center w-screen py-10">
        <div className="w-full max-w-[850px] p-8 bg-neutral-primary shadow-premium border border-brown-primary/10 rounded-2xl relative pb-12 mx-4">
          <div className="mb-10 pb-4 border-b border-brown-primary/10 flex items-center justify-between">
            <h1 className="text-2xl font-black text-brown-secondary tracking-widest uppercase">
              Profile Center
            </h1>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-yellow-tertiary bg-yellow-primary/50 px-3 py-1 rounded-full border border-yellow-tertiary/15">
              Account Hub
            </span>
          </div>

          <div className="flex justify-between items-center ">
            <div>
              <ImageUpload
                profileImage={profileImage}
                setProfileImage={setProfileImage}
              />
            </div>

            <div className="p-5 text-brown-tertiary  text-[22px]">
              {isEditing ? (
                <>
                  <input
                    className="mb-2 border-2 border-brown-primary hover:shadow-custom focus:outline-none focus:ring-0 focus:border-brown-primary transition-all duration-200 ease-in-out  px-2 py-1 w-full rounded text-[17px] bg-yellow-primary text-brown-tertiary "
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm({ ...editForm, name: e.target.value })
                    }
                  />
                  <input
                    className="mb-2 border-2 border-brown-primary hover:shadow-custom focus:outline-none focus:ring-0 focus:border-brown-primary transition-all duration-200 ease-in-out  px-2 py-1 w-full rounded text-[17px] bg-yellow-primary text-brown-tertiary "
                    value={editForm.email}
                    onChange={(e) =>
                      setEditForm({ ...editForm, email: e.target.value })
                    }
                  />
                  <textarea
                    className="mb-1 border-2 border-brown-primary hover:shadow-custom focus:outline-none focus:ring-0 focus:border-brown-primary transition-all duration-200 ease-in-out  px-2 py-1 w-full rounded text-[17px] bg-yellow-primary text-brown-tertiary "
                    placeholder="Address"
                    value={editForm.address}
                    onChange={(e) =>
                      setEditForm({ ...editForm, address: e.target.value })
                    }
                  />
                  {currentRole === "tailor" && (
                    <>
                      <input
                        className="mb-2 border-2 border-brown-primary hover:shadow-custom focus:outline-none focus:ring-0 focus:border-brown-primary transition-all duration-200 ease-in-out  px-2 py-1 w-full rounded text-[17px] bg-yellow-primary text-brown-tertiary "
                        placeholder="Specialization"
                        value={editForm.specialization}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            specialization: e.target.value,
                          })
                        }
                      />
                      <input
                        className="mb-2 border-2 border-brown-primary hover:shadow-custom focus:outline-none focus:ring-0 focus:border-brown-primary transition-all duration-200 ease-in-out  px-2 py-1 w-full rounded text-[17px] bg-yellow-primary text-brown-tertiary "
                        placeholder="Fees"
                        value={editForm.fees}
                        onChange={(e) =>
                          setEditForm({ ...editForm, fees: e.target.value })
                        }
                      />
                      <textarea
                        className="mb-2 border-2 border-brown-primary hover:shadow-custom focus:outline-none focus:ring-0 focus:border-brown-primary transition-all duration-200 ease-in-out  px-2 py-1 w-full rounded text-[17px] bg-yellow-primary text-brown-tertiary "
                        placeholder="Description"
                        value={editForm.description}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            description: e.target.value,
                          })
                        }
                      />
                    </>
                  )}

                  <div className="flex gap-2 mb-4">
                    <button
                      onClick={handleEditSubmit}
                      className="bg-yellow-tertiary text-white  h-10 w-30 font-semibold  rounded text-[17px] hover-common hover:bg-yellow-secondary hover:text-brown-primary"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="bg-danger-primary text-white  h-10 w-30 font-semibold  rounded text-[17px] hover-common hover:bg-danger-secondary "
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className=" mb-2 flex">
                    <span className="font-medium mr-1 text-brown-primary ">
                      Name:
                    </span>{" "}
                    <span>{profile?.name}</span>
                  </p>
                  <p className=" mb-2 flex">
                    <span className="font-medium mr-1 text-brown-primary ">
                      Email:
                    </span>
                    <span> {profile?.email}</span>
                  </p>

                  <p className="font-medium mr-1 text-brown-primary w-[90px]">
                    Address:
                  </p>
                  <p className="inline-block w-72 h-20 text-[16px] font-medium overflow-y-auto bg-yellow-primary p-2 rounded-md">
                    {profile?.address || "N/A"}
                  </p>
                </>
              )}

              <div className="flex justify-between w-[300px] items-baseline-last">
                {isAdmin ? (
                  <p className=" mb-4">
                    <span className="font-medium mr-1 text-brown-primary">
                      Role:
                    </span>{" "}
                    Admin
                  </p>
                ) : (
                  <div className="mb-4">
                    <label
                      htmlFor="role"
                      className="block text-sm font-medium text-brown-tertiary"
                    >
                      Switch Role
                    </label>
                    <select
                      id="role"
                      value={currentRole}
                      onChange={handleRoleChange}
                      className="w-[150px] mt-1 px-3 py-2 bg-brown-secondary text-neutral-primary rounded-md text-[17px]"
                    >
                      <option value="customer">Customer</option>
                      <option value="tailor">Tailor</option>
                    </select>
                  </div>
                )}
                <div className="relative h-[30px] w-[150px] ml-5">
                  <button
                    onClick={() => setIsEditing(true)}
                    className=" text-neutral-primary bg-brown-secondary px-4 py-2 rounded mb-4 text-[17px]
             transform transition-transform  ease-in-out
             hover:bg-brown-primary hover:scale-105 hover:shadow-custom hover:border border-yellow-primary"
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>
          </div>

          {showTailorConfirm && (
            <div className="bg-yellow-100 p-4 mb-4 rounded-md">
              <p className="text-gray-700">
                Do you want to become a tailor? Please provide your details.
              </p>
              <div className="flex mt-2">
                <button
                  onClick={() => handleTailorConfirm(true)}
                  className="bg-blue-500 text-white py-2 px-4 rounded-md mr-2"
                >
                  Yes
                </button>
                <button
                  onClick={() => handleTailorConfirm(false)}
                  className="bg-red-500 text-white py-2 px-4 rounded-md"
                >
                  No
                </button>
              </div>
            </div>
          )}

          {showTailorForm && (
            <TailorForm
              tailorForm={tailorForm}
              setTailorForm={setTailorForm}
              onSubmit={handleTailorFormSubmit}
              onCancel={handleCancel}
            />
          )}

          {currentRole === "tailor" &&
            profile?.roles?.includes("tailor") &&
            profile.tailorDetails && (
              <div className="mb-10">
                <TailorDetails details={profile.tailorDetails} />
              </div>
            )}
          <div className="flex gap-4 items-center  ">
            <div className="ml-5 mr-10">
              <FollowingList
                userId={profile._id}
                showFollowingId={showFollowingId}
                setShowFollowingId={setShowFollowingId}
                defaultFollowing={profile.following || []}
              />
            </div>
            {currentRole === "customer" && (
              <div className="bg-yellow-primary rounded-md shadow-custom p-5 w-[600px] flex justify-around">
                <Link
                  to="/measurement"
                  className="h-10 inline-flex items-center p-2  bg-brown-primary text-neutral-primary rounded-md hover:bg-yellow-tertiary hover-common"
                >
                  <span className="p-1 mr-1">Add Measurement</span>{" "}
                  <FaPlus size={20} />
                </Link>
                <Link
                  to="/custom"
                  className="h-10  inline-flex items-center p-2 bg-brown-primary text-neutral-primary rounded-md hover:bg-yellow-tertiary hover-common"
                >
                  <span className="p-1 mr-1">Customize Cloth</span>{" "}
                  <GiClothes size={20} />
                </Link>
              </div>
            )}
            {currentRole === "tailor" &&
              profile?.roles?.includes("tailor") &&
              profile.tailorDetails && (
                <div className="flex items-center">
                  <div className=" mr-20">
                    <FollowersList
                      tailorId={profile._id}
                      showFollowersId={showFollowersId}
                      setShowFollowersId={setShowFollowersId}
                      defaultFollowers={profile.tailorDetails.followers || []}
                    />
                  </div>
                  <Link
                    to="/addpost"
                    className="inline-flex items-center p-2 bg-brown-primary text-neutral-primary rounded-md hover:bg-yellow-tertiary hover-common"
                  >
                    <span className="p-1 mr-1">Add Post</span>{" "}
                    <FaPlus size={20} />
                  </Link>
                  <Link
                    to="/cloth"
                    className="inline-flex ml-15 items-center p-2 bg-brown-primary text-neutral-primary rounded-md hover:bg-yellow-tertiary hover-common"
                  >
                    <span className="p-1 mr-1">Add Cloth</span>{" "}
                    <FaPlus size={20} />
                  </Link>
                </div>
              )}
          </div>

          <button
            onClick={handleLogout}
            className=" absolute top-0 right-5 mt-6  bg-neutral-primary text-danger-primary hover-common hover:text-danger-secondary py-2 px-2 rounded-sm flex justify-center items-center"
          >
            <span className="mr-1 font-semibold">Logout</span>
            <span className="text-[25px] font-bold"><MdExitToApp /></span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Profile;
