import React, { useState, useRef, useEffect } from "react";


const PostContent = ({ post }) => {
  const [expandedCaption, setExpandedCaption] = useState(false);
  const [expandedHashtags, setExpandedHashtags] = useState(false);
  const captionRef = useRef(null);
  

  const shortCaption = post.caption ? post.caption.slice(0, 20) : "";
  const hasMoreCaption = post.caption && post.caption.length > 20;

  const hashtagsText = post.hashtags?.join(" ") || "";
  const shortHashtags = hashtagsText.slice(0, 20);
  const hasMoreHashtags = hashtagsText.length > 20;

  // ✅ Collapse when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (captionRef.current && !captionRef.current.contains(e.target)) {
        setExpandedCaption(false);
        setExpandedHashtags(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={captionRef}>

      <p className="text-lg text-brown-secondary mb-1 font-medium">
        <span className="font-semibold text-brown-tertiary">Posted by:</span>{" "}
        {post.postedBy?.name || "Unknown"}
      </p>
      

        <p className="text-[15px] text-brown-secondary break-words whitespace-pre-wrap mb-1">
          <span className="font-medium text-brown-tertiary">Caption:</span>{" "}
          {expandedCaption ? (
            <>
              {post.caption}{" "}
              {hasMoreCaption && (
                <span
                  onClick={() => setExpandedCaption(false)}
                  className="text-yellow-tertiary cursor-pointer ml-1"
                >
                  ..less
                </span>
              )}
            </>
          ) : (
            <>
              {shortCaption}
              {hasMoreCaption && (
                <span
                  onClick={() => setExpandedCaption(true)}
                  className="text-yellow-tertiary cursor-pointer ml-1"
                >
                  ..more
                </span>
              )}
            </>
          )}
        </p>
      <p className="text-sm text-brown-primary mb-1">
        <span className="font-medium text-brown-secondary">Hashtags:</span>{" "}
        <span className="break-words whitespace-pre-wrap">
          {expandedHashtags ? (
            <>
              {hashtagsText}{" "}
              {hasMoreHashtags && (
                <span
                  onClick={() => setExpandedHashtags(false)}
                  className="text-yellow-tertiary cursor-pointer ml-1"
                >
                  ..less
                </span>
              )}
            </>
          ) : (
            <>
              {shortHashtags}
              {hasMoreHashtags && (
                <span
                  onClick={() => setExpandedHashtags(true)}
                  className="text-yellow-tertiary cursor-pointer ml-1"
                >
                  ..more
                </span>
              )}
            </>
          )}
        </span>
      </p>
      <p className="text-sm text-brown-secondary">
        <span className="font-medium text-brown-tertiary">Posted on:</span>{" "}
        {new Date(post.createdAt).toLocaleDateString()}{" "}
        {new Date(post.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>
    </div>
  );
};

export default PostContent;
