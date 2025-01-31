"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ProductDetailSkeleton from "../../../../components/productDetailSkeleton";
import Error from "../../../../components/404";

/**
 * ProductDetail Component
 * Displays detailed information of a selected product including description, reviews, and actions (buy/add to cart).
 * @returns {JSX.Element} The rendered component.
 */
const ProductDetail = () => {
  const { id } = useParams(); // Retrieve product ID from the URL.
  const router = useRouter(); // Router instance for navigating.
  const [product, setProduct] = useState(null); // State to store product details.
  const [loading, setLoading] = useState(true); // State to manage loading state.
  const [error, setError] = useState(null); // State to manage errors.
  const [activeTab, setActiveTab] = useState("description"); // State to track the active tab (description/reviews).
  const [sortType, setSortType] = useState("date"); // State to manage the sorting type for reviews.

  /**
   * Fetches the product data from the API based on the product ID.
   * @param {string} id - The product ID.
   */
  useEffect(() => {
    const fetchProduct = async (id) => {
      try {
        const res = await fetch(`https://next-ecommerce-api.vercel.app/products/${id}`);
        if (!res.ok) {
          throw new Error(`Failed to fetch product. Status: ${res.status}`);
        }
        const data = await res.json();
        setProduct(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct(id);
    }
  }, [id]);

  if (loading) return <ProductDetailSkeleton />; // Show loading skeleton while data is loading.
  if (error) return <Error />; // Show error component in case of an error.
  if (!product) return <p>No product found</p>; // Display message if no product is found.

  /**
   * Sorts the reviews array based on the selected type (either "date" or "rating").
   * @param {Array} reviews - Array of product reviews.
   * @param {string} type - Sorting type, either "date" or "rating".
   * @returns {Array} Sorted reviews.
   */
  const sortReviews = (reviews, type) => {
    return reviews.sort((a, b) => {
      if (type === "date") {
        return new Date(b.date) - new Date(a.date);
      } else if (type === "rating") {
        return b.rating - a.rating;
      }
    });
  };

  return (
    <div className="font-sans p-8 tracking-wide max-lg:max-w-2xl mx-auto">
     
      <button
        onClick={() => router.back()}
        className="flex items-center text-gray-600 font-bold mb-4 hover:text-indigo-600 transition-all"
      >
        <svg
          className="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"></path>
        </svg>
        Back
      </button>

      <div className="grid items-start grid-cols-1 lg:grid-cols-2 gap-10">
     
        <div className="space-y-4 text-center lg:sticky top-8">
          <div className="bg-gray-100 p-4 flex items-center sm:h-[380px] rounded-lg">
            <img
              src={product.images[0]}
              alt={product.title}
              className="w-full max-h-full object-contain object-top"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {product.images.slice(1).map((image, index) => (
              <div
                key={index}
                className="bg-gray-100 p-4 flex items-center rounded-lg sm:h-[182px]"
              >
                <img
                  src={image}
                  alt={`Product ${index + 1}`}
                  className="w-full max-h-full object-contain object-top"
                />
              </div>
            ))}
          </div>
        </div>

       
        <div className="max-w-xl">
          <h2 className="text-2xl font-extrabold text-gray-800">{product.title}</h2>
          <p className="text-sm text-gray-600 mt-2">{product.category}</p>
          <h3 className="text-gray-800 text-4xl font-bold mt-4">${product.price}</h3>

         
          <div className="flex space-x-1 mt-4">
            {[...Array(5)].map((_, index) => (
              <svg
                key={index}
                className={`w-5 ${
                  index < Math.round(product.rating) ? "fill-yellow-400" : "fill-[#CED5D8]"
                }`}
                viewBox="0 0 14 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
              </svg>
            ))}
          </div>

          <div className="mt-8">
          
            <ul className="flex border-b">
              <li
                className={`${
                  activeTab === "description"
                    ? "text-gray-800 font-bold bg-gray-100 py-3 px-8 border-b-2 border-indigo-600"
                    : "text-gray-600 font-bold py-3 px-8"
                } cursor-pointer transition-all`}
                onClick={() => setActiveTab("description")}
              >
                Description
              </li>
              <li
                className={`${
                  activeTab === "reviews"
                    ? "text-gray-800 font-bold bg-gray-100 py-3 px-8 border-b-2 border-indigo-600"
                    : "text-gray-600 font-bold py-3 px-8"
                } cursor-pointer transition-all`}
                onClick={() => setActiveTab("reviews")}
              >
                Reviews
              </li>
            </ul>

           
            <div className="mt-8">
              {activeTab === "description" ? (
                <>
                  <h3 className="text-lg font-bold text-gray-800">Product Description</h3>
                  <p className="text-sm text-gray-600 mt-4">{product.description}</p>
                  <ul className="space-y-3 list-disc mt-6 pl-4 text-sm text-gray-600">
                    <li>Brand: {product.brand}</li>
                    <li>{product.stock} in stock</li>
                    <li>Availability Status: {product.availabilityStatus}</li>
                    <li>Tags: {product.tags.join(", ")}</li>
                    <li>Return Policy: {product.returnPolicy}</li>
                  </ul>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-bold text-gray-800">Customer Reviews</h3>

                 
                  <div className="flex space-x-4 mb-4">
                    <button
                      className={`py-2 px-4 text-sm font-semibold rounded-lg ${
                        sortType === "date" ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-800"
                      }`}
                      onClick={() => setSortType("date")}
                    >
                      Sort by Date
                    </button>
                    <button
                      className={`py-2 px-4 text-sm font-semibold rounded-lg ${
                        sortType === "rating" ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-800"
                      }`}
                      onClick={() => setSortType("rating")}
                    >
                      Sort by Rating
                    </button>
                  </div>

                
                  {product.reviews && product.reviews.length > 0 ? (
                    <ul className="space-y-3 mt-4">
                      {sortReviews(product.reviews, sortType).map((review, index) => (
                        <li key={index} className="text-sm text-gray-600 border-b pb-4">
                          <p className="font-bold">
                            {review.reviewerName} ({new Date(review.date).toLocaleDateString()})
                          </p>
                          <p>Rating: {review.rating}/5</p>
                          <p>{review.comment}</p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-600">No reviews available</p>
                  )}
                </>
              )}
            </div>
          </div>

          
          <div className="flex flex-wrap gap-4 mt-8">
            <button
              type="button"
              className="min-w-[200px] px-4 py-3 bg-indigo-600 hover:bg-indigo-600 text-white text-sm font-semibold rounded-lg"
            >
              Buy now
            </button>
            <button
              type="button"
              className="min-w-[200px] px-4 py-3 bg-gray-100 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-200"
            >
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
