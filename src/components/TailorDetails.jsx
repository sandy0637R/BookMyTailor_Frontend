const TailorDetails = ({ details }) => (
  <div className="mt-6 p-4 bg-gray-100 rounded-md">
    <h3 className="text-lg font-semibold">Your Tailor Details</h3>
    <p className="mt-2">Experience: {details.experience}</p>
    <p className="mt-2">Specialization: {details.specialization?.join(', ')}</p>
    <p className="mt-2">Fees: {details.fees}</p>
    <p className="mt-2">Description: {details?.description || "N/A"}</p>
  </div>
);

export default TailorDetails;