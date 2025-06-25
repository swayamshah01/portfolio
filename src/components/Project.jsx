import React, { useState } from "react";
import ProjectDetails from "./ProjectDetails";

const Project = ({
  title,
  description,
  subDescription,
  href,
  image,
  tags,
  setPreview,
}) => {
  const [isHidden, setIsHidden] = useState(false);
  return (
    <>
      <div
        className="flex-wrap items-center justify-between py-10 space-y-14 sm:flex sm:space-y-0 transition-all duration-500 rounded-lg"
        onMouseEnter={() => setPreview(image)}
        onMouseLeave={() => setPreview(null)}
      >
        <div>
          <p className="text-2xl transition-all duration-500 md:group-hover:text-white md:group-hover:drop-shadow-sm font-medium">
            {title}
          </p>
          <div className="flex gap-5 mt-3 transition-all duration-500">
            {tags.map((tag) => (
              <span 
                key={tag.id}
                className="text-sand transition-all duration-500 md:group-hover:text-violet-200 md:group-hover:bg-white/10 md:group-hover:px-2 md:group-hover:py-1 md:group-hover:rounded-full text-sm font-medium backdrop-blur-sm"
              >
                {tag.name}
              </span>
            ))}
          </div>
        </div>
        <button
          onClick={() => setIsHidden(true)}
          className="flex items-center gap-2 cursor-pointer hover-animation transition-all duration-500 md:group-hover:text-white md:group-hover:bg-white/10 md:group-hover:px-4 md:group-hover:py-2 md:group-hover:rounded-full md:group-hover:backdrop-blur-sm font-medium"
        >
          Read More
          <img 
            src="assets/arrow-right.svg" 
            className="w-5 transition-all duration-500 md:group-hover:brightness-0 md:group-hover:invert" 
          />
        </button>
      </div>
      <div className="bg-gradient-to-r from-transparent via-violet-500/20 to-transparent h-[1px] w-full" />
      {isHidden && (
        <ProjectDetails
          title={title}
          description={description}
          subDescription={subDescription}
          image={image}
          tags={tags}
          href={href}
          closeModal={() => setIsHidden(false)}
        />
      )}
    </>
  );
};

export default Project;