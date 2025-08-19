// src/components/CustomizeHistory.jsx
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import RequestDisplayCard from "../components/RequestDisplayCard";
import { setChatUser } from "../redux/chatSlice";

const CustomizeHistory = ({ history }) => {
  const [showHistory, setShowHistory] = useState(false);
  const [openCardId, setOpenCardId] = useState(null);
  const tailors = useSelector((state) => state.social.tailors || []);
  const dispatch = useDispatch();

  if (history.length === 0) return null;

  return (
    <>
      <h2 className="text-xl font-bold mt-8 mb-2 text-center text-brown-secondary">
        Order History
      </h2>
      <button
        onClick={() => setShowHistory((prev) => !prev)}
        className="mb-4 bg-brown-tertiary text-yellow-primary px-4 py-2 rounded text-sm w-full hover:bg-brown-secondary hover-common"
      >
        {showHistory ? "Hide History" : "Show History"}
      </button>

      {showHistory && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm mb-4">
            <thead className="bg-brown-tertiary">
              <tr>
                <th className="p-2 rounded-tl-lg border-r-2 border-b-2 border-brown-primary text-yellow-primary">
                  Tailor Name
                </th>
                <th className="p-2 border-r-2 border-b-2 border-brown-primary text-yellow-primary">
                  Status
                </th>
                <th className="p-2 border-r-2 border-b-2 border-brown-primary text-yellow-primary">
                  Delivered On
                </th>
                <th className="p-2 rounded-tr-lg border-b-2 border-brown-primary text-yellow-primary">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {history.map((req) => (
                <React.Fragment key={req._id}>
                  <tr>
                    <td className="p-2 bg-yellow-primary border-b-2 border-yellow-secondary text-center">
                      {typeof req.tailorId === "object"
                        ? req.tailorId.name
                        : tailors.find((t) => t._id === req.tailorId)?.name ||
                          "N/A"}
                    </td>
                    <td className="p-2 bg-yellow-primary border-b-2 border-yellow-secondary text-center">
                      {req.status}
                    </td>
                    <td className="p-2 bg-yellow-primary border-b-2 border-yellow-secondary text-center">
                      {req.deliveredAt
                        ? new Date(req.deliveredAt).toLocaleDateString()
                        : "Pending"}
                    </td>
                    <td className="p-2 bg-yellow-primary border-b-2 border-yellow-secondary text-center">
                      <button
                        onClick={() =>
                          setOpenCardId(openCardId === req._id ? null : req._id)
                        }
                        className="text-yellow-primary bg-brown-tertiary py-1 px-5 rounded-sm hover:bg-yellow-primary hover:text-brown-tertiary shadow-[inset_0_0_15px_5px_rgba(100,100,100,0.3)] transition-all ease-in-out duration-200"
                      >
                        {openCardId === req._id
                          ? "Hide Request"
                          : "View Request"}
                      </button>
                    </td>
                  </tr>
                  {openCardId === req._id && (
                    <tr>
                      <td
                        colSpan="4"
                        className="p-2 border-b-2 border-yellow-secondary bg-yellow-primary"
                      >
                        <div className="p-2">
                          <RequestDisplayCard
                            req={req}
                            setChatUser={(user) => dispatch(setChatUser(user))}
                            handleDelete={() => {}}
                            setEditingId={() => {}}
                            handleConfirm={() => {}}
                          />
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default CustomizeHistory;
