"use client";
import Image from "next/image";
import { Dispatch, SetStateAction, useState } from "react";

interface EditPageProps {
  params: { id: string };
  // setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export default function EditPage({ params }: EditPageProps) {
  const closeAction = () => {
    // setIsOpen(false);
    //isOpen = !isOpen;
  };

  const handleTouchStart = () => {};
  const handleTouchMove = () => {};
  const handleTouchEnd = () => {};
  const handleImageError = () => {};
  const [post, setPost] = useState<any>();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [photos, setPhotos] = useState([]);
  const [touchDelta, setTouchDelta] = useState(0);
  const [hasMultiplePhotos, setHasMultiplePhotos] = useState(false);
  const [hasValidPhotos, setHasValidPhotos] = useState(false);

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4"
        onClick={closeAction}
        data-testid="post-modal-overlay"
        role="dialog"
        aria-modal="true"
      >
        <div
          className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header with close button */}
          <div className="flex justify-between items-center p-3 sm:p-4 border-b">
            <h2 className="text-lg sm:text-xl font-bold line-clamp-1">
              {/* {post.title} */}
            </h2>
            <button
              onClick={closeAction}
              className="p-1 rounded-full hover:bg-gray-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 sm:h-6 sm:w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 p-3 sm:p-6">
            <div>asd</div>

            {/* Left column - Image and Contact */}
            {/* <div className="flex flex-col space-y-3 sm:space-y-4">
              <div className="relative">
                {hasValidPhotos && (
                  <>
                    <div
                      className="relative bg-gray-200 h-[250px] sm:h-[300px] rounded-md overflow-hidden"
                      onTouchStart={handleTouchStart}
                      onTouchMove={handleTouchMove}
                      onTouchEnd={handleTouchEnd}
                    >
                      <Image
                        src={photos[currentImageIndex]}
                        alt={post?.title}
                        className="h-full w-full object-contain"
                        width={800}
                        height={600}
                        onError={handleImageError}
                        priority={true}
                        loading="eager"
                        unoptimized={process.env.NODE_ENV === "development"}
                      />

                      {touchDelta !== 0 && hasMultiplePhotos && (
                        <>
                          {touchDelta > 0 && (
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/20 p-1.5 rounded-full animate-pulse">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 5l7 7-7 7"
                                />
                              </svg>
                            </div>
                          )}
                          {touchDelta < 0 && (
                            <div className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/20 p-1.5 rounded-full animate-pulse">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 19l-7-7 7-7"
                                />
                              </svg>
                            </div>
                          )}
                        </>
                      )}

                      <button
                        onClick={() => setIsFullscreen(true)}
                        className="absolute top-2 right-2 bg-white/70 hover:bg-white p-1.5 sm:p-2 rounded-full"
                        aria-label="View fullscreen"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 sm:h-5 sm:w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5"
                          />
                        </svg>
                      </button>
                      {hasMultiplePhotos && (
                        <>
                          <button
                            onClick={prevImage}
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white p-1.5 sm:p-2 rounded-full"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 sm:h-5 sm:w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 19l-7-7 7-7"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={nextImage}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white p-1.5 sm:p-2 rounded-full"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 sm:h-5 sm:w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </button>
                          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                            {photos.map((_, index) => (
                              <button
                                key={index}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCurrentImageIndex(index);
                                }}
                                className={`h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full ${
                                  currentImageIndex === index
                                    ? "bg-blue-600"
                                    : "bg-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </div>

                    {hasMultiplePhotos && (
                      <div className="mt-2 flex gap-1.5 sm:gap-2 overflow-x-auto pb-1 hide-scrollbar">
                        {photos.map((photo, index) => (
                          <button
                            key={index}
                            onClick={(e) => {
                              e.stopPropagation();
                              setCurrentImageIndex(index);
                            }}
                            className={`h-12 w-12 sm:h-16 sm:w-16 flex-shrink-0 rounded ${
                              currentImageIndex === index
                                ? "ring-2 ring-blue-500"
                                : ""
                            }`}
                          >
                            <Image
                              src={photo}
                              alt={`Thumbnail ${index + 1}`}
                              className="h-full w-full object-cover rounded"
                              width={64}
                              height={64}
                              onError={handleImageError}
                              loading="eager"
                              unoptimized={
                                process.env.NODE_ENV === "development"
                              }
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>

              {(!post.category ||
                post.category.name !== "Resumes" ||
                post.email) && (
                <div className="mt-2 sm:mt-4">
                  <h4 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">
                    Contact
                  </h4>
                  <div className="space-y-3">
                    {post.email && (
                      <p className="text-gray-600">
                        Contact the seller using the form below.
                      </p>
                    )}
                    <form onSubmit={handleSendMessage} className="space-y-3">
                      <textarea
                        className="w-full border rounded-md p-3 text-sm"
                        placeholder="Write your message here..."
                        rows={4}
                        value={messageContent}
                        onChange={(e) => setMessageContent(e.target.value)}
                        disabled={isSending}
                        required
                      />
                      <input
                        type="email"
                        className={`w-full border rounded-md p-3 text-sm ${
                          isLoggedIn ? "bg-gray-100" : ""
                        } ${localLoadingState ? "animate-pulse" : ""}`}
                        placeholder={
                          localLoadingState
                            ? "Loading..."
                            : "Your email address"
                        }
                        value={senderEmail}
                        onChange={(e) =>
                          !isLoggedIn && setSenderEmail(e.target.value)
                        }
                        disabled={isSending || isLoggedIn || localLoadingState}
                        required
                        readOnly={isLoggedIn}
                      />
                      {isLoggedIn && user?.email && (
                        <p className="text-xs text-gray-500 -mt-2">
                          Using your account email
                        </p>
                      )}
                      {localLoadingState && (
                        <p className="text-xs text-gray-500 -mt-2">
                          Checking account information...
                        </p>
                      )}
                      {sendError && (
                        <div className="text-red-500 text-sm">{sendError}</div>
                      )}

                      {sendSuccess && (
                        <div className="text-green-500 text-sm">
                          Message sent successfully!
                        </div>
                      )}

                      <button
                        type="submit"
                        className={`w-full py-3 rounded-md ${
                          isSending
                            ? "bg-blue-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700"
                        } text-white`}
                        disabled={isSending}
                      >
                        {isSending ? "Sending..." : "Send Message"}
                      </button>
                    </form>

                    {profile?.stripe_account_status === "verified" &&
                      post.price && (
                        <button
                          type="button"
                          onClick={createPaymentIntent}
                          className={`w-full py-3 rounded-md ${
                            isPaying
                              ? "bg-blue-300 cursor-not-allowed"
                              : "bg-blue-600 hover:bg-blue-700"
                          } text-white`}
                          disabled={isPaying}
                        >
                          {isPaying
                            ? `Paying $${Math.floor(Number(post?.price ?? 0))}`
                            : `Stripe Pay $${Math.floor(
                                Number(post?.price ?? 0)
                              )}`}
                        </button>
                      )}

                    {profile?.paypal_client_id &&
                      profile?.paypal_verified?.verified && (
                        <Paypal
                          client_id={
                            profile?.paypal_client_id ?? ""
                            // "ARSys0ZHaf_SMGGrj3ExmbJ_0OdX3LOKgQwpskalWANFffb4quGX54C9_R3bc9tpge13CwJZt-xTU0c5"
                          }
                          currency="USD"
                          amount={post?.price.toString() ?? "45.5"}
                        />
                      )}

                    {!profile?.stripe_account_id && (
                      <p className="text-xs text-gray-500 -mt-2">Seller</p>
                    )}
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-3 mt-3 border-t">
                <button
                  type="button"
                  className="flex items-center text-gray-600 hover:text-gray-900"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                    />
                  </svg>
                  Share
                </button>
                <button
                  type="button"
                  className="flex items-center text-gray-600 hover:text-gray-900"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  Favorite
                </button>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="flex items-center text-gray-600 hover:text-gray-900 relative"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  {linkCopied ? "Copied!" : "Copy Link"}
                  {linkCopied && (
                    <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded">
                      Link copied!
                    </span>
                  )}
                </button>
              </div>

              {post.linkedin_url && (
                <div className="mt-4">
                  <a
                    href={post.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-[#0A66C2] rounded-md hover:bg-[#004182] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full justify-center"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                    View LinkedIn
                  </a>
                </div>
              )}
            </div> */}

            {/* Right column - Details */}
            {/* <div className="flex flex-col">
              <div className="mb-6">
                <div className="flex items-center space-x-2">
                  {(!post.category || post.category.price_visible !== false) &&
                    post.price !== null &&
                    post.price !== undefined && (
                      <span className="font-bold text-2xl">
                        ${Math.floor(Number(post.price) || 0)}
                        {post.category?.name === "Resumes"
                          ? "/hour"
                          : post.category?.name === "Housing"
                            ? "/month"
                            : ""}
                      </span>
                    )}
                  {post.category && (
                    <span
                      className="text-xs px-2 py-1 rounded-sm"
                      style={{
                        backgroundColor: post.category.color || "#999999",
                        color: post.category.text_color || "#ffffff",
                      }}
                    >
                      {post.category.name}
                    </span>
                  )}
                  {post.subcategory && (
                    <span className="text-xs px-2 py-1 rounded-sm bg-gray-100 text-gray-800">
                      {post.subcategory.name}
                    </span>
                  )}
                </div>
                <div className="mt-1 text-sm text-gray-500">
                  Posted{" "}
                  {post.time_posted
                    ? formatDistanceToNow(new Date(post.time_posted), {
                        addSuffix: true,
                      })
                    : "recently"}
                  {post.university &&
                    ` at ${
                      post.university.university ||
                      post.university.university_short
                    }`}
                </div>
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Description</h4>
                  <p className="text-gray-700 whitespace-pre-line">
                    {parseTextWithLinks(post.description || "")}
                  </p>
                </div>
              </div>

              {post.university && (
                <div className="mb-6">
                  <h4 className="font-semibold mb-2">University</h4>
                  <p className="text-gray-700">
                    {post.university.university ||
                      post.university.university_short}
                  </p>
                </div>
              )}
            </div> */}
          </div>
        </div>
      </div>

      {/* Auth Prompt Modal */}
      {/* {!localLoadingState && !isLoggedIn && (
        <AuthPromptModal
          isOpen={showAuthPrompt}
          onClose={() => setShowAuthPrompt(false)}
          email={senderEmail}
        />
      )} */}
    </>
  );
}
