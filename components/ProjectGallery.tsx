import React from "react";

type GalleryItem = { src: string; alt?: string; caption?: string };

export const ProjectGallery: React.FC<{
  projectName: string;
  items: GalleryItem[];
}> = ({ projectName, items }) => {
  // Keep original gallery for echo project
  if (projectName?.toLowerCase() === "echo - social media data suite") {
    return (
      <div className="project-gallery original">
        {/* ...existing original markup should be preserved elsewhere... */}
        {items.map((it, i) => (
          <figure key={i} className="original-item">
            <img src={it.src} alt={it.alt} />
            {it.caption && <figcaption>{it.caption}</figcaption>}
          </figure>
        ))}
      </div>
    );
  }

  // New two-column project gallery format
  return (
    <section className="project-gallery two-col">
      <div className="two-col-inner">
        {items.map((it, i) => (
          <figure key={i} className={`gallery-item item-${i}`}>
            <img src={it.src} alt={it.alt || `project image ${i + 1}`} />
            {it.caption && <figcaption className="gallery-caption">{it.caption}</figcaption>}
          </figure>
        ))}
      </div>
    </section>
  );
};

export default ProjectGallery;