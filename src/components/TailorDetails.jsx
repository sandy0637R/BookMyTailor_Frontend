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
    <div className="mt-6 p-4 bg-yellow-primary rounded-md">
      <h3 className="text-lg font-semibold">Your Tailor Details</h3>
      <p className="mt-2"><span className="font-semibold mr-1">Experience:</span> {experienceInWords}</p>
      <p className="mt-2"><span className="font-semibold mr-1">Specialization:</span> {details.specialization?.join(", ") || "N/A"}</p>
      <p className="mt-2"><span className="font-semibold mr-1">Fees:</span>₹{details.fees}</p>
      <p className="mt-2"><span className="font-semibold mr-1">Description:</span>{details?.description || "N/A"}</p>
    </div>
  );
};

export default TailorDetails;
