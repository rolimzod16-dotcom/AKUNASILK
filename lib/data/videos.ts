export type SilkVideo = {
  id: string;
  src: string;
  poster: string;
  titleKey: string;
  locationKey: string;
  kind?: "video" | "image";
};

export type HeroScene =
  | {
      type: "video";
      id: string;
      src: string;
      poster: string;
      labelKey: string;
    }
  | {
      type: "image";
      id: string;
      src: string;
      labelKey: string;
    };

/** Silk Road hero — camel caravan, desert trails, Samarkand, Pamir (no ocean/beach) */
export const heroScenes: HeroScene[] = [
  {
    type: "video",
    id: "caravan",
    src: "https://videos.pexels.com/video-files/33255422/14168298_2560_1440_60fps.mp4",
    poster:
      "https://images.pexels.com/videos/33255422/gobi-march-25-33255422.jpeg?auto=compress&w=1920&h=1080&fit=crop",
    labelKey: "caravan",
  },
  {
    type: "video",
    id: "desert",
    src: "https://videos.pexels.com/video-files/2035391/2035391-hd_1920_1080_25fps.mp4",
    poster:
      "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=1920&q=80",
    labelKey: "desert",
  },
  {
    type: "video",
    id: "dunes",
    src: "https://videos.pexels.com/video-files/7895571/7895571-hd_1920_1080_25fps.mp4",
    poster:
      "https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?w=1920&q=80",
    labelKey: "dunes",
  },
  {
    type: "image",
    id: "samarkand",
    src: "https://images.unsplash.com/photo-1565008576549-57569a49371d?w=1920&q=80",
    labelKey: "samarkand",
  },
  {
    type: "image",
    id: "pamir",
    src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80",
    labelKey: "pamir",
  },
];

export const heroVideo = {
  src: heroScenes[0].type === "video" ? heroScenes[0].src : "",
  poster: heroScenes[0].type === "video" ? heroScenes[0].poster : heroScenes[0].src,
};

export const ctaVideo = {
  src: "https://videos.pexels.com/video-files/2035391/2035391-hd_1920_1080_25fps.mp4",
  poster:
    "https://images.unsplash.com/photo-1565008576549-57569a49371d?w=1920&q=80",
};

export const showcaseVideos: SilkVideo[] = [
  {
    id: "desert",
    src: "https://videos.pexels.com/video-files/33255422/14168298_2560_1440_60fps.mp4",
    poster:
      "https://images.pexels.com/videos/33255422/gobi-march-25-33255422.jpeg?auto=compress&w=1200&h=1600&fit=crop",
    titleKey: "desert",
    locationKey: "desert",
  },
  {
    id: "mountains",
    src: "https://videos.pexels.com/video-files/7895571/7895571-hd_1920_1080_25fps.mp4",
    poster:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
    titleKey: "mountains",
    locationKey: "mountains",
  },
  {
    id: "cities",
    src: "https://images.unsplash.com/photo-1565008576549-57569a49371d?w=1200&q=80",
    poster:
      "https://images.unsplash.com/photo-1565008576549-57569a49371d?w=1200&q=80",
    titleKey: "cities",
    locationKey: "cities",
    kind: "image",
  },
];