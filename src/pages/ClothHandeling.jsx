import React, { useEffect, useState } from "react";
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

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <ClothForm />
      <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-4">
        {cloths.map((cloth) =>
          editClothId === cloth._id ? (
            <ClothEdit key={cloth._id} cloth={cloth} onCancel={handleCancelEdit} />
          ) : (
            <ClothCard key={cloth._id} cloth={cloth} onEdit={handleEdit} onDelete={handleDelete} />
          )
        )}
      </div>
    </div>
  );
};

export default ClothHandeling;
