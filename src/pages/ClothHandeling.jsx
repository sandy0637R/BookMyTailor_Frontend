import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchClothsRequest, deleteClothRequest } from "../redux/clothSlice";
import ClothForm from "../components/ClothForm";
import ClothCard from "../components/ClothCard";
import ClothEdit from "../components/ClothEdit";

const ClothHandeling = () => {
  const dispatch = useDispatch();
  const { cloths } = useSelector((state) => state.cloth);
  const [editClothId, setEditClothId] = useState(null);

  useEffect(() => {
    dispatch(fetchClothsRequest());
  }, [dispatch]);

  const handleEdit = (cloth) => setEditClothId(cloth._id);
  const handleCancelEdit = () => setEditClothId(null);
  const handleDelete = (id) => dispatch(deleteClothRequest(id));

  const modalRef = useRef();

  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      handleCancelEdit();
    }
  };

  useEffect(() => {
    if (editClothId) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [editClothId]);

  const editCloth = cloths.find((c) => c._id === editClothId);

  return (
    <div className="bg-neutral-primary min-h-screen py-8">
      {/* Heading */}
      <div className="max-w-6xl mx-auto px-4 mb-6 text-center">
        <h1 className="text-4xl font-bold text-brown-primary mb-2">Cloth Management</h1>
      </div>

      {/* Cloth Form */}
      <div className="max-w-4xl mx-auto mb-8">
        <ClothForm />
      </div>

      {/* Cloth Cards */}
      <div className="max-w-6xl mx-auto px-4 mt-30">
        {cloths.length === 0 ? (
          <p className="text-center text-brown-secondary text-lg mt-8">
            No cloths added yet.
          </p>
        ) : (
          <>
            <h2 className="text-3xl font-bold text-brown-primary mb-6 text-center">
              Your Cloths
            </h2>

            <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
              {cloths.map((cloth) => (
                <ClothCard
                  key={cloth._id}
                  cloth={cloth}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Edit Modal */}
      {editCloth && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div
            ref={modalRef}
            className="bg-neutral-primary p-6 rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <ClothEdit cloth={editCloth} onCancel={handleCancelEdit} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ClothHandeling;
