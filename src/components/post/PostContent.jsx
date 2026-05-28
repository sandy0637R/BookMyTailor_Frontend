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
    <div ref={captionRef} className="space-y-2 mt-1">
      <p className="text-[14.5px] text-brown-secondary break-words whitespace-pre-wrap leading-relaxed">
        <span className="font-bold text-brown-tertiary mr-1.5">Caption:</span>
        {expandedCaption ? (
          <>
            {post.caption}{" "}
            {hasMoreCaption && (
              <span
                onClick={() => setExpandedCaption(false)}
                className="text-yellow-tertiary font-bold cursor-pointer hover:underline ml-1"
              >
                less
              </span>
            )}
          </>
        ) : (
          <>
            {shortCaption}
            {hasMoreCaption && (
              <span
                onClick={() => setExpandedCaption(true)}
                className="text-yellow-tertiary font-bold cursor-pointer hover:underline ml-1"
              >
                ... more
              </span>
            )}
          </>
        )}
      </p>
      {hashtagsText && (
        <p className="text-[13px] font-semibold text-yellow-tertiary tracking-wide">
          <span className="text-brown-primary/60 font-bold mr-1.5">Hashtags:</span>
          {expandedHashtags ? (
            <>
              {hashtagsText}{" "}
              {hasMoreHashtags && (
                <span
                  onClick={() => setExpandedHashtags(false)}
                  className="text-brown-secondary font-bold cursor-pointer hover:underline ml-1"
                >
                  less
                </span>
              )}
            </>
          ) : (
            <>
              {shortHashtags}
              {hasMoreHashtags && (
                <span
                  onClick={() => setExpandedHashtags(true)}
                  className="text-brown-secondary font-bold cursor-pointer hover:underline ml-1"
                >
                  ... more
                </span>
              )}
            </>
          )}
        </p>
      )}
    </div>
  );
};

export default PostContent;
