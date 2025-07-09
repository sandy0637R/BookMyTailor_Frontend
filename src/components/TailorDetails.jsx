import { useEffect, useState } from "react";

const TailorDetails = ({ details }) => {
  const [experienceInWords, setExperienceInWords] = useState("");

  useEffect(() => {
    if (details?.createdAt) {
      const created = new Date(details.createdAt);
      const now = new Date();

      const diffMs = now - created;
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const years = Math.floor(diffDays / 365);
      const days = diffDays % 365;

      let experience = "";
      if (years > 0) experience += `${years} yr${years > 1 ? "s" : ""} `;
      if (days > 0) experience += `${days} day${days > 1 ? "s" : ""}`;
      if (!experience) experience = "0 days";

      setExperienceInWords(experience);
    }
  }, [details]);

  return (
    <div className="mt-6 p-4 bg-gray-100 rounded-md">
      <h3 className="text-lg font-semibold">Your Tailor Details</h3>
      <p className="mt-2">Experience: {experienceInWords}</p>
      <p className="mt-2">Specialization: {details.specialization?.join(", ") || "N/A"}</p>
      <p className="mt-2">Fees: ₹{details.fees}</p>
      <p className="mt-2">Description: {details?.description || "N/A"}</p>
    </div>
  );
};

export default TailorDetails;
