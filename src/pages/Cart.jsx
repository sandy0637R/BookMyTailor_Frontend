import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { FaTrash, FaEye, FaCartPlus, FaSearch } from "react-icons/fa";
import { Link } from "react-router";
import {
  removeFromCart,
  addToWishlist,
  fetchProfileRequest,
  getClothsRequest,
  addToCart,
  updateProfileRequest,
} from "../redux/authSlice";
import { placeOrderRequest } from "../redux/orderSlice";
import ClothDetails from "../components/ClothDetails";

const Cart = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.auth.cart);
  const cloths = useSelector((state) => state.auth.cloths);
  const token = useSelector((state) => state.auth.token);
  const profile = useSelector((state) => state.auth.profile);
  const navigate = useNavigate();

  const [expandedId, setExpandedId] = useState(null);
  const [address, setAddress] = useState({ building: "", city: "", pin: "" });
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [paymentMode, setPaymentMode] = useState("");
  const [showOrderSummary, setShowOrderSummary] = useState(false);

   useEffect(() => {
      window.scrollTo(0, 0);
    }, []);

  useEffect(() => {
    if (token) dispatch(fetchProfileRequest());
    dispatch(getClothsRequest());
  }, [dispatch, token]);

  useEffect(() => {
    if (profile?.address) {
      const parts = profile.address.split(",").map((p) => p.trim());
      setAddress({
        building: parts[0] || "",
        city: parts[1] || "",
        pin: parts[2] || "",
      });
      setIsEditingAddress(false);
    }
  }, [profile]);

  const cartItems = useMemo(
    () =>
      cart
        ?.map(({ item, quantity }) => {
          const cloth = cloths.find((c) => c._id === item);
          return cloth ? { ...cloth, quantity } : null;
        })
        .filter(Boolean),
    [cart, cloths]
  );

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handlePlaceOrder = () => {
    if (!cartItems.length) return;
    if (!address.building || !address.city || !address.pin || !paymentMode)
      return;

    const items = cartItems.map((item) => ({
      product: item._id,
      quantity: item.quantity,
    }));
    const fullAddress = `${address.building}, ${address.city}, ${address.pin}`;

    const orderData = {
      items,
      address: fullAddress,
      paymentMode,
      totalAmount: totalPrice,
    };

    dispatch(
      placeOrderRequest({
        token,
        orderData,
        userId: profile._id,
        navigate,
      })
    );
  };

  return (
    <>
      <h1 className="text-3xl font-bold text-yellow-tertiary text-center mt-5 flex justify-center items-center">
        {" "}
        <span className="mr-2">
          <FaCartPlus />
        </span>
        Cart
      </h1>
      <div className="min-h-screen p-6 flex flex-col lg:flex-row gap-6 bg-neutral-primary ">
        {/* Cart Items */}
        <div className="w-full lg:w-2/3 max-h-screen overflow-y-auto p-3 border-3 rounded-xl border-yellow-tertiary">
          {cartItems.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cartItems.map((item) => {
                const showDetails = expandedId === item._id;
                return (
                  <div
                    key={item._id}
                    className="bg-neutral-primary rounded-2xl shadow-common overflow-hidden hover-common transition duration-300"
                  >
                    <img
                      src={
                        item.image?.startsWith("/uploads")
                          ? `https://bookmytailor-backend.onrender.com${item.image}`
                          : item.image || "/placeholder.jpg"
                      }
                      alt={item.name}
                      className="w-full h-64 object-cover"
                    />
                    <div className="p-4 space-y-2">
                      <h3 className="text-xl font-semibold text-brown-secondary">
                        {item.name}
                      </h3>
                      <p className="text-sm text-brown-primary">
                        Manufacturer: {item.manufacturer}
                      </p>
                      <p className="text-lg font-bold text-yellow-tertiary">
                        ₹{item.price}
                      </p>
                      <div className="flex justify-between mt-2 gap-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => dispatch(removeFromCart(item._id))}
                            className="px-2 py-1 text-lg font-bold rounded bg-brown-secondary text-neutral-primary hover:bg-brown-primary hover-common"
                          >
                            -
                          </button>
                          <span className="text-lg text-brown-primary">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => dispatch(addToCart(item._id))}
                            className="px-2 py-1 text-lg font-bold rounded bg-brown-secondary text-neutral-primary hover:bg-brown-primary hover-common"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => dispatch(removeFromCart(item._id))}
                          className="flex items-center gap-2 cloth-card-btn hover-common text-sm text-neutral-primary bg-danger-primary hover:bg-danger-secondary transition"
                        >
                          <FaTrash /> Remove
                        </button>
                        <button
                          onClick={() =>
                            setExpandedId(showDetails ? null : item._id)
                          }
                          className="flex items-center gap-2 cloth-card-btn hover-common bg-brown-primary hover:bg-brown-secondary"
                        >
                          <FaEye /> {showDetails ? "Hide" : "View"}
                        </button>
                      </div>
                    </div>
                    {showDetails && (
                      <ClothDetails
                        cloth={item}
                        isInCart={true}
                        isInWishlist={false}
                        onClose={() => setExpandedId(null)}
                        onCartToggle={() => {
                          dispatch(removeFromCart(item._id));
                          setExpandedId(null);
                        }}
                        onWishlistToggle={() => {
                          dispatch(removeFromCart(item._id));
                          dispatch(addToWishlist(item._id));
                          setExpandedId(null);
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center text-brown-primary font-semibold text-xl mt-10">
              <p>Your cart is empty 😢</p>
              <p className="text-yellow-primary mt-2">
                Add some cloths to get started!
              </p>
              <Link to="/">
                <button className=" flex bg-brown-secondary py-2  px-6 justify-center items-center text-neutral-primary mt-5 rounded hover-common hover:bg-brown-primary">
                  <span className="mr-4">
                    <FaSearch />
                  </span>
                  Explore
                </button>
              </Link>
            </div>
          )}
        </div>

        {/* Order Section */}
        <div className="w-full lg:w-1/3 flex-shrink-0 bg-yellow-primary p-5 rounded-xl">
          {!cartItems.length && (
            <div className="mb-4 p-4 bg-yellow-primary text-brown-primary font-semibold rounded text-center">
              Your cart is empty! Add some cloths to place an order.
            </div>
          )}
          {!showOrderSummary && (
            <div className="sticky top-4">
              <button
                className="bg-yellow-tertiary hover:bg-yellow-premium text-brown-secondary font-bold py-3 px-6 rounded w-full transition"
                onClick={() => setShowOrderSummary(true)}
                disabled={!cartItems.length}
              >
                Buy Now
              </button>
            </div>
          )}

          {showOrderSummary && (
            <div className="sticky top-4 bg-neutral-primary p-6 rounded-lg shadow-lg border border-brown-secondary">
              <h3 className="text-2xl font-semibold text-brown-primary mb-4">
                Order Summary
              </h3>
              <ul className="divide-y divide-brown-secondary">
                {cartItems.map((item) => (
                  <li
                    key={item._id}
                    className="flex justify-between py-2 text-brown-primary"
                  >
                    <span>
                      {item.name} x{item.quantity}
                    </span>
                    <span>₹{item.price * item.quantity}</span>
                  </li>
                ))}
              </ul>
              <div className="text-right font-bold text-xl text-yellow-tertiary mt-4">
                Total: ₹{totalPrice}
              </div>

              {/* Payment Mode */}
              <div className="mt-6">
                <label className="block font-medium text-brown-primary mb-2">
                  Select Payment Mode:
                </label>
                <label className="flex items-center gap-2 text-brown-primary">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMode === "cod"}
                    onChange={() => setPaymentMode("cod")}
                  />
                  Cash on Delivery
                </label>
              </div>

              {/* Address */}
              <div className="mt-6">
                <label className="block font-medium text-brown-primary mb-2">
                  Delivery Address:
                </label>

                {isEditingAddress ? (
                  <>
                    <input
                      type="text"
                      placeholder="Building / Street"
                      className="w-full border border-brown-secondary p-2 rounded mb-2 text-brown-primary"
                      value={address.building}
                      onChange={(e) =>
                        setAddress((prev) => ({
                          ...prev,
                          building: e.target.value,
                        }))
                      }
                    />
                    <input
                      type="text"
                      placeholder="City"
                      className="w-full border border-brown-secondary p-2 rounded mb-2 text-brown-primary"
                      value={address.city}
                      onChange={(e) =>
                        setAddress((prev) => ({
                          ...prev,
                          city: e.target.value,
                        }))
                      }
                    />
                    <input
                      type="text"
                      placeholder="PIN Code"
                      className="w-full border border-brown-secondary p-2 rounded mb-2 text-brown-primary"
                      value={address.pin}
                      onChange={(e) =>
                        setAddress((prev) => ({ ...prev, pin: e.target.value }))
                      }
                    />
                    <button
                      onClick={() => {
                        const fullAddress = `${address.building}, ${address.city}, ${address.pin}`;
                        dispatch(
                          updateProfileRequest({ address: fullAddress })
                        );
                        dispatch(fetchProfileRequest());
                        setIsEditingAddress(false);
                      }}
                      className="mt-2 px-4 py-2 rounded bg-yellow-tertiary text-brown-secondary font-bold hover:bg-yellow-primary transition"
                    >
                      Save Address
                    </button>
                  </>
                ) : (
                  <div className="flex justify-between items-start text-brown-primary">
                    <p>
                      {address.building} {address.city} {address.pin}
                      {!address.building &&
                        !address.city &&
                        !address.pin &&
                        "No address saved."}
                    </p>
                    <button
                      onClick={() => setIsEditingAddress(true)}
                      className="text-yellow-tertiary underline"
                    >
                      Change Address
                    </button>
                  </div>
                )}
              </div>

              {/* Place Order */}
              <button
                className={`mt-6 w-full py-2 rounded text-neutral-primary font-bold ${
                  cartItems.length &&
                  address.building &&
                  address.city &&
                  address.pin &&
                  paymentMode
                    ? "bg-yellow-tertiary hover:bg-yellow-primary text-brown-primary"
                    : "bg-brown-tertiary cursor-not-allowed text-neutral-primary"
                } transition`}
                disabled={
                  !(
                    cartItems.length &&
                    address.building &&
                    address.city &&
                    address.pin &&
                    paymentMode
                  )
                }
                onClick={handlePlaceOrder}
              >
                Place Order
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Cart;
